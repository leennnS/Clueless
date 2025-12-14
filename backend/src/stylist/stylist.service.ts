import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ClothingItemService } from '../clothing-item/clothing-item.service';
import { UserService } from '../user/user.service';
import { WeatherService, WeatherSnapshot } from '../weather/weather.service';
import {
  ShoppingSuggestion,
  StylistItemSuggestion,
  StylistMessage,
  StylistOutfitSuggestion,
  StylistResponse,
} from './stylist.types';
import { OpenAiClientService } from './openai-client.service';
import type { ClothingItemPayload } from '../clothing-item/clothing-item.types';

interface PromptContext {
  wardrobe: WardrobeContext[];
  weather: WeatherSnapshot | null;
  message: string;
  user: {
    id: number;
    username?: string | null;
  };
}

interface WardrobeContext {
  itemId: number;
  name: string;
  category: string;
  color?: string | null;
  imageUrl?: string | null;
  tags?: string[];
}

type GarmentType =
  | 'top'
  | 'bottom'
  | 'footwear'
  | 'one-piece'
  | 'layer'
  | 'accessory'
  | 'unknown';

@Injectable()
export class StylistService {
  private readonly logger = new Logger(StylistService.name);
  private readonly maxWardrobeItems = 100;
  private readonly systemPrompt = [
    'You are an AI fashion stylist inside a virtual closet web app. The user has a digital wardrobe.',
    "I will give you: a list of clothing items with fields (id, category, color, etc.), today's weather, and the user's request.",
    'Your job:',
    '- Suggest 1-3 outfits using ONLY items from the wardrobe list (reference them by itemId).',
    '- Each outfit must be wearable: include footwear plus either (a) a top matched with a bottom or (b) a one-piece garment (dress, jumpsuit, romper). Layers like jackets or coats are optional but additive.',
    '- Never mix mutually exclusive alternatives inside one outfit (e.g., do not pair a blouse with a dress unless explicitly layering with a jacket or coat).',
    '- Weather arrives as JSON fields (temperatureC, feelsLikeC, condition, description, humidity, locationName) plus a human summary string. Factor this into outfit choices when present.',
    '- Consider weather when selecting layers ONLY when weather data is provided. If the weather details are missing, do not mention or speculate about weather, and never say weather is unavailable—simply craft seasonless, versatile outfits.',
    '- If the user request is vague (e.g., “suggest outfit” with no event, vibe, or constraints), reply with one concise clarifying question and leave the outfits/shoppingSuggestions arrays empty until they respond.',
    '- Optionally suggest up to 3 high-level categories of items the user should consider buying.',
    '- NEVER invent new clothing items or IDs.',
    'Output valid JSON only, following this schema:',
    '{',
    '  "messages": [{ "sender": "assistant", "text": "..." }],',
    '  "outfits": [{ "name": "...", "reasoning": "...", "items": [{ "itemId": 123, "reason": "..." }] }],',
    '  "shoppingSuggestions": [{ "category": "...", "reason": "..." }]',
    '}',
    'Reply ONLY with JSON, no extra text.',
  ].join('\n');
  private readonly topKeywords = [
    'top',
    'shirt',
    'tee',
    't-shirt',
    'tank',
    'blouse',
    'polo',
    'henley',
    'sweater',
    'sweatshirt',
    'hoodie',
    'bodysuit',
    'camisole',
    'crop',
  ];
  private readonly bottomKeywords = [
    'pant',
    'jean',
    'trouser',
    'skirt',
    'short',
    'legging',
    'slack',
    'bottom',
    'chino',
    'cargo',
    'culotte',
  ];
  private readonly footwearKeywords = [
    'shoe',
    'sneaker',
    'boot',
    'heel',
    'flat',
    'loafer',
    'sandal',
    'wedge',
    'pump',
    'trainer',
    'mule',
  ];
  private readonly onePieceKeywords = [
    'dress',
    'jumpsuit',
    'romper',
    'overall',
    'playsuit',
    'gown',
  ];
  private readonly layerKeywords = [
    'jacket',
    'coat',
    'blazer',
    'cardigan',
    'vest',
    'kimono',
    'poncho',
    'trench',
    'windbreaker',
    'parka',
    'wrap',
    'shacket',
    'duster',
  ];
  private readonly accessoryKeywords = [
    'hat',
    'scarf',
    'belt',
    'bag',
    'purse',
    'watch',
    'bracelet',
    'necklace',
    'earring',
    'glove',
    'sunglass',
  ];

  constructor(
    private readonly userService: UserService,
    private readonly clothingItemService: ClothingItemService,
    private readonly weatherService: WeatherService,
    private readonly openAiClientService: OpenAiClientService,
  ) {}

  async askStylist(userId: number, message: string): Promise<StylistResponse> {
    if (!message?.trim()) {
      throw new BadRequestException('Message is required.');
    }

    const trimmedMessage = message.trim();

    try {
      const [user, wardrobeItems, weather] = await Promise.all([
        this.userService.getUserById(userId),
        this.clothingItemService.getByUser(userId),
        this.weatherService.getCurrentWeatherForUser(userId),
      ]);

      const context: PromptContext = {
        user: {
          id: user.user_id,
          username: user.username,
        },
        wardrobe: this.buildWardrobeContext(wardrobeItems),
        weather,
        message: trimmedMessage,
      };

      const wardrobeLookup = this.buildWardrobeLookup(context.wardrobe);
      const prompt = this.buildUserPrompt(context);
      const raw = await this.openAiClientService.generateStylistResponse(
        this.systemPrompt,
        prompt,
      );
      const parsed = this.tryParseStylistResponse(raw, wardrobeLookup);
      if (parsed) {
        return parsed;
      }

      this.logger.warn('Model response could not be parsed as JSON.', raw);
      return this.fallbackResponse(
        'I had trouble reading that reply. Try asking again in a moment.',
      );
    } catch (error) {
      const messageText =
        error instanceof Error ? error.message : 'Unknown stylist error';
      this.logger.error(
        `Failed to complete stylist request for user ${userId}: ${messageText}`,
      );
      return this.fallbackResponse(
        'Your stylist is unavailable right now. Please try again shortly.',
      );
    }
  }

  private buildWardrobeContext(items: ClothingItemPayload[]): WardrobeContext[] {
    return items.slice(0, this.maxWardrobeItems).map((item) => ({
      itemId: item.item_id,
      name: item.name,
      category: item.category,
      color: item.color ?? null,
      imageUrl: item.image_url ?? null,
      tags: item.tags?.map((tag) => tag.name),
    }));
  }

  private buildWardrobeLookup(items: WardrobeContext[]): Map<number, WardrobeContext> {
    return new Map(items.map((item) => [item.itemId, item]));
  }

  private buildUserPrompt(context: PromptContext): string {
    const payload: Record<string, unknown> = {
      wardrobe: context.wardrobe,
      user: context.user,
      userMessage: context.message,
    };

    if (context.weather) {
      payload.weather = context.weather;
      payload.weatherSummary = this.describeWeather(context.weather);
    }

    return [
      'Context JSON:',
      JSON.stringify(payload, null, 2),
      context.weather
        ? 'Weather data is provided above. Mention it only if it helps explain the outfit.'
        : 'Weather data is unavailable; do NOT mention or guess about weather—focus on versatile styling.',
      'Return only the JSON response described above.',
    ].join('\n\n');
  }

  private describeWeather(snapshot: WeatherSnapshot): string {
    const parts: string[] = [];
    if (snapshot.locationName) {
      parts.push(`Location: ${snapshot.locationName}`);
    }
    if (typeof snapshot.temperatureC === 'number') {
      parts.push(`Temp: ${snapshot.temperatureC.toFixed(0)}°C`);
    }
    if (typeof snapshot.feelsLikeC === 'number') {
      parts.push(`Feels like: ${snapshot.feelsLikeC.toFixed(0)}°C`);
    }
    if (snapshot.condition || snapshot.description) {
      parts.push(
        `Conditions: ${snapshot.description ?? snapshot.condition}`,
      );
    }
    if (typeof snapshot.humidity === 'number') {
      parts.push(`Humidity: ${snapshot.humidity}%`);
    }

    return parts.length
      ? parts.join(' | ')
      : 'Weather data provided but missing details.';
  }

  private tryParseStylistResponse(
    raw: string,
    wardrobeLookup?: Map<number, WardrobeContext>,
  ): StylistResponse | null {
    const parsed = this.coerceToObject(raw);
    if (!parsed) {
      return null;
    }
    return this.normalizeResponse(parsed, wardrobeLookup);
  }

  private coerceToObject(raw: string): Record<string, unknown> | null {
    try {
      return JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) {
        return null;
      }
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
  }

  private normalizeResponse(
    payload: Record<string, unknown>,
    wardrobeLookup?: Map<number, WardrobeContext>,
  ): StylistResponse {
    const messages = this.normalizeMessages(payload.messages);
    const outfits = this.normalizeOutfits(payload.outfits);
    const structuredOutfits = this.enforceOutfitStructure(outfits, wardrobeLookup);
    const shoppingSuggestions = this.normalizeShopping(payload.shoppingSuggestions);

    if (!messages.length) {
      messages.push({
        sender: 'assistant',
        text: 'Here are some looks pulled from your wardrobe.',
      });
    }

    return {
      messages,
      outfits: structuredOutfits,
      shoppingSuggestions,
    };
  }

  private normalizeMessages(input: unknown): StylistMessage[] {
    if (!Array.isArray(input)) {
      return [];
    }
    return input
      .map((entry) => {
        if (
          entry &&
          typeof entry === 'object' &&
          typeof (entry as any).text === 'string'
        ) {
          const senderValue = (entry as any).sender;
          return {
            sender: senderValue === 'user' ? 'user' : 'assistant',
            text: (entry as any).text as string,
          };
        }
        return null;
      })
      .filter((entry): entry is StylistMessage => Boolean(entry));
  }

  private normalizeOutfits(input: unknown): StylistOutfitSuggestion[] {
    if (!Array.isArray(input)) {
      return [];
    }

    return input
      .map((entry) => {
        if (!entry || typeof entry !== 'object') {
          return null;
        }
        const name = (entry as any).name;
        const reasoning = (entry as any).reasoning ?? (entry as any).reason;
        if (typeof name !== 'string' || typeof reasoning !== 'string') {
          return null;
        }
        return {
          name,
          reasoning,
          items: this.normalizeItems((entry as any).items),
        };
      })
      .filter((entry): entry is StylistOutfitSuggestion => Boolean(entry));
  }

  private enforceOutfitStructure(
    outfits: StylistOutfitSuggestion[],
    wardrobeLookup?: Map<number, WardrobeContext>,
  ): StylistOutfitSuggestion[] {
    if (!wardrobeLookup?.size) {
      return outfits;
    }

    const sanitized = outfits
      .map((outfit) => {
        const cleanedItems = this.sanitizeOutfitItems(outfit.items, wardrobeLookup);
        if (!cleanedItems.length) {
          return null;
        }
        return {
          ...outfit,
          items: cleanedItems,
        };
      })
      .filter((outfit): outfit is StylistOutfitSuggestion => Boolean(outfit));

    if (!sanitized.length && outfits.length) {
      this.logger.warn('Stylist response lacked valid outfits after enforcing structure.');
    }

    return sanitized;
  }

  private sanitizeOutfitItems(
    items: StylistItemSuggestion[],
    wardrobeLookup: Map<number, WardrobeContext>,
  ): StylistItemSuggestion[] {
    if (!items.length) {
      return [];
    }

    const typedItems = items.map((suggestion) => {
      const wardrobeItem = wardrobeLookup.get(suggestion.itemId);
      return {
        suggestion,
        type: this.categorizeWardrobeItem(wardrobeItem?.category),
      };
    });

    const excludeIds = new Set(items.map((item) => item.itemId));
    const hasOnePiece = typedItems.some((entry) => entry.type === 'one-piece');
    let filtered = hasOnePiece
      ? typedItems.filter(
          (entry) => entry.type !== 'top' && entry.type !== 'bottom',
        )
      : [...typedItems];

    const ensureCorePiece = (type: GarmentType): boolean => {
      if (filtered.some((entry) => entry.type === type)) {
        return true;
      }
      const addition = this.pickWardrobeItemByType(type, wardrobeLookup, excludeIds);
      if (!addition) {
        return false;
      }
      excludeIds.add(addition.itemId);
      filtered = [
        ...filtered,
        {
          suggestion: {
            itemId: addition.itemId,
            reason: this.defaultReasonForType(addition, type),
          },
          type,
        },
      ];
      return true;
    };

    if (!ensureCorePiece('footwear')) {
      return [];
    }

    if (hasOnePiece) {
      return filtered.map((entry) => entry.suggestion);
    }

    const topReady = ensureCorePiece('top');
    const bottomReady = ensureCorePiece('bottom');

    if (!topReady || !bottomReady) {
      return [];
    }

    return filtered.map((entry) => entry.suggestion);
  }

  private categorizeWardrobeItem(category?: string | null): GarmentType {
    if (!category) {
      return 'unknown';
    }
    const normalized = category.trim().toLowerCase();
    const matches = (keywords: string[]) =>
      keywords.some((keyword) => normalized.includes(keyword));

    if (matches(this.onePieceKeywords)) {
      return 'one-piece';
    }
    if (matches(this.footwearKeywords)) {
      return 'footwear';
    }
    if (matches(this.layerKeywords)) {
      return 'layer';
    }
    if (matches(this.bottomKeywords)) {
      return 'bottom';
    }
    if (matches(this.topKeywords)) {
      return 'top';
    }
    if (matches(this.accessoryKeywords)) {
      return 'accessory';
    }
    return 'unknown';
  }

  private pickWardrobeItemByType(
    type: GarmentType,
    wardrobeLookup: Map<number, WardrobeContext>,
    excludeIds: Set<number>,
  ): WardrobeContext | null {
    for (const item of wardrobeLookup.values()) {
      if (excludeIds.has(item.itemId)) {
        continue;
      }
      if (this.categorizeWardrobeItem(item.category) === type) {
        return item;
      }
    }
    return null;
  }

  private defaultReasonForType(item: WardrobeContext, type: GarmentType): string {
    const readableName = item.name || item.category || 'this piece';
    switch (type) {
      case 'footwear':
        return `${readableName} grounds the outfit with sturdy footwear.`;
      case 'top':
        return `${readableName} completes the look as the necessary top.`;
      case 'bottom':
        return `${readableName} balances the outfit as the bottom piece.`;
      default:
        return `${readableName} rounds out the outfit.`;
    }
  }

  private normalizeItems(input: unknown): StylistItemSuggestion[] {
    if (!Array.isArray(input)) {
      return [];
    }
    const normalized: StylistItemSuggestion[] = [];
    for (const entry of input) {
      const itemId = Number((entry as any)?.itemId ?? (entry as any)?.id);
      if (!Number.isFinite(itemId)) {
        continue;
      }
      const reasonValue =
        typeof (entry as any)?.reason === 'string'
          ? ((entry as any).reason as string)
          : null;
      const suggestion: StylistItemSuggestion = {
        itemId,
      };
      if (reasonValue) {
        suggestion.reason = reasonValue;
      } else if (reasonValue === null) {
        suggestion.reason = null;
      }
      normalized.push(suggestion);
    }
    return normalized;
  }

  private normalizeShopping(input: unknown): ShoppingSuggestion[] {
    if (!Array.isArray(input)) {
      return [];
    }
    return input
      .map((entry) => {
        if (!entry || typeof entry !== 'object') {
          return null;
        }
        const category = (entry as any).category;
        const reason = (entry as any).reason;
        if (typeof category !== 'string' || typeof reason !== 'string') {
          return null;
        }
        return { category, reason };
      })
      .filter((entry): entry is ShoppingSuggestion => Boolean(entry));
  }

  private fallbackResponse(friendlyMessage: string): StylistResponse {
    return {
      messages: [
        {
          sender: 'assistant',
          text: friendlyMessage,
        },
      ],
      outfits: [],
      shoppingSuggestions: [],
    };
  }
}
