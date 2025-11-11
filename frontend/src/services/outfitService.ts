import apiClient from "./apiClient";

export interface OutfitUser {
  user_id: number;
  username?: string | null;
  name?: string | null;
  email?: string | null;
}

export interface Outfit {
  id?: number | string;
  outfit_id?: number;
  title?: string | null;
  name?: string | null;
  is_public?: boolean | null;
  image?: string | null;
  cover_image_url?: string | null;
  username?: string | null;
  color?: string | null;
  emoji?: string | null;
  user?: OutfitUser | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface FeedOutfit extends Outfit {
  outfit_id: number;
  like_count: number;
  comment_count: number;
  liked_by_viewer: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Attempts to resolve a numeric id from various outfit representations (feed vs. dashboard).
 */
export const getOutfitId = (outfit: Outfit): number | null => {
  if (typeof outfit.outfit_id === "number") {
    return outfit.outfit_id;
  }

  if (typeof outfit.id === "number") {
    return outfit.id;
  }

  if (typeof outfit.id === "string" && outfit.id.trim().length > 0) {
    const numericId = Number(outfit.id);
    if (!Number.isNaN(numericId)) {
      return numericId;
    }
  }

  return null;
};

/**
 * Fetches outfits for the authenticated user (used in profile dashboard).
 */
export async function getOutfits() {
  const response = await apiClient.get<Outfit[]>("/outfits");
  return response.data;
}

/**
 * Returns outfits for any user id (used by creator profile pages).
 */
export async function getOutfitsByUser(userId: number) {
  const response = await apiClient.get<Outfit[]>(`/outfits/user/${userId}`);
  return response.data;
}

interface GetPublicFeedParams {
  search?: string;
  viewerId?: number | null;
}

/**
 * Retrieves the community feed with optional search and viewer context.
 *
 * Preconditions: Backend feed endpoint reachable.
 * Postconditions: Returns FeedOutfit array with derived like/comment counts.
 */
export async function getPublicFeed(params: GetPublicFeedParams = {}) {
  const { search, viewerId } = params;
  const response = await apiClient.get<FeedOutfit[]>("/outfits/feed", {
    params: {
      search: search && search.trim().length > 0 ? search.trim() : undefined,
      viewer_id:
        typeof viewerId === "number" && !Number.isNaN(viewerId)
          ? viewerId
          : undefined,
    },
  });
  return response.data;
}

export interface CreateOutfitPayload {
  name?: string | null;
  is_public?: boolean;
  cover_image_url?: string | null;
  user_id: number;
}

export interface CreateOutfitResponse {
  message: string;
  outfit: Outfit & { outfit_id: number };
}

/**
 * Creates an outfit shell before adding canvas items.
 */
export async function createOutfit(payload: CreateOutfitPayload) {
  const response = await apiClient.post<CreateOutfitResponse>("/outfits", payload);
  return response.data;
}

export interface UpdateOutfitPayload {
  name?: string | null;
  is_public?: boolean | null;
  cover_image_url?: string | null;
  user_id?: number;
}

export interface UpdateOutfitResponse {
  message: string;
  outfit: Outfit & { outfit_id: number };
}

/**
 * Updates outfit metadata (name/privacy/cover image).
 */
export async function updateOutfit(outfitId: number, payload: UpdateOutfitPayload) {
  const response = await apiClient.put<UpdateOutfitResponse>(
    `/outfits/${outfitId}`,
    payload
  );
  return response.data;
}

export interface DeleteOutfitResponse {
  message: string;
}

/**
 * Deletes an outfit and its associated canvas items/likes/comments server-side.
 */
export async function deleteOutfit(outfitId: number) {
  const response = await apiClient.delete<DeleteOutfitResponse>(
    `/outfits/${outfitId}`
  );
  return response.data;
}

/**
 * Fetches a single outfit by id (used when editing existing outfits).
 */
export async function getOutfit(outfitId: number) {
  const response = await apiClient.get<Outfit>(`/outfits/${outfitId}`);
  return response.data;
}
