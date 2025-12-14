export interface User {
  user_id: number;
  username?: string | null;
  email?: string | null;
  profile_image_url?: string | null;
  created_at?: string;
  updated_at?: string;
  clothing_items?: ClothingItem[];
  outfits?: Outfit[];
}

export interface AuthPayload {
  token: string;
  user: User;
  message: string;
}

export interface ClothingItem {
  item_id: number;
  name: string;
  category: string;
  user_id: number;
  color?: string | null;
  image_url?: string | null;
  uploaded_at?: string;
  updated_at?: string;
  user?: User | null;
  tags?: Tag[];
  tag_names?: string[];
  tag_ids?: number[];
}

export interface Tag {
  tag_id: number;
  name: string;
}

export interface Outfit {
  outfit_id: number;
  name?: string | null;
  is_public: boolean;
  cover_image_url?: string | null;
  user_id: number;
  user?: User | null;
  created_at?: string;
  updated_at?: string;
  like_count?: number;
  comment_count?: number;
  liked_by_viewer?: boolean;
}

export interface OutfitItem {
  outfit_item_id: number;
  outfit_id: number;
  item_id: number;
  item?: ClothingItem | null;
  x_position?: number | null;
  y_position?: number | null;
  z_index?: number | null;
  transform?: Record<string, unknown> | string | null;
}

export interface Like {
  like_id: number;
  user_id: number;
  outfit_id: number;
  created_at?: string;
  user?: User | null;
  outfit?: Outfit | null;
}

export interface Comment {
  comment_id: number;
  content: string;
  user_id: number;
  outfit_id: number;
  created_at?: string;
  updated_at?: string;
  user?: User | null;
  outfit?: Outfit | null;
}

export interface ScheduledOutfit {
  schedule_id: number;
  user_id: number;
  outfit_id: number;
  schedule_date: string;
  created_at: string;
  user?: User | null;
  outfit?: Outfit | null;
}

export interface WardrobePreviewItem {
  item_id: number;
  name: string;
  category?: string | null;
  color?: string | null;
  image_url?: string | null;
}

export interface WardrobePreviewOutfit {
  outfit_id: number;
  name?: string | null;
  cover_image_url?: string | null;
  is_public: boolean;
}

export interface WardrobeColorStat {
  color: string;
  count: number;
}

export interface WardrobeTagStat {
  tag: string;
  count: number;
}

export interface WardrobeItemStat extends WardrobePreviewItem {
  wear_count: number;
}

export interface WardrobeSummary {
  total_items: number;
  total_outfits: number;
  favorites: string[];
  latest_items: WardrobePreviewItem[];
  latest_outfits: WardrobePreviewOutfit[];
  favorite_colors: WardrobeColorStat[];
  top_tags: WardrobeTagStat[];
  most_worn_item?: WardrobeItemStat | null;
}

export interface MessagePayload {
  message: string;
}

export interface UpdateUserInput {
  id: number;
  username?: string;
  email?: string;
  password?: string;
  profile_image_url?: string | null;
}

export interface CreateClothingItemInput {
  name: string;
  category: string;
  user_id: number;
  color?: string | null;
  image_url?: string | null;
  tag_ids?: number[];
  tag_names?: string[];
}

export interface UpdateClothingItemInput extends Partial<CreateClothingItemInput> {
  item_id: number;
}

export interface StylistMessage {
  sender: 'user' | 'assistant';
  text: string;
}

export interface StylistItemSuggestion {
  itemId: number;
  reason?: string | null;
}

export interface StylistOutfitSuggestion {
  name: string;
  reasoning: string;
  items: StylistItemSuggestion[];
}

export interface ShoppingSuggestion {
  category: string;
  reason: string;
}

export interface StylistResponse {
  messages: StylistMessage[];
  outfits: StylistOutfitSuggestion[];
  shoppingSuggestions: ShoppingSuggestion[];
}
