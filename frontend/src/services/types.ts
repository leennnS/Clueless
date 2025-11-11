/** Shared DTO representing a clothing item returned by the API. */
export interface ClothingItem {
  item_id: number;
  name: string;
  category: string;
  color?: string | null;
  image_url?: string | null;
  user_id: number;
}

/** Lightweight summary shape for outfits when full details are unnecessary. */
export interface OutfitSummary {
  outfit_id: number;
  name?: string | null;
  cover_image_url?: string | null;
  is_public?: boolean;
  user_id: number;
}
