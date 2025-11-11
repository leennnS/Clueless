import apiClient from "./apiClient";
import type { ClothingItem } from "./types";

export interface OutfitItem {
  outfit_item_id: number;
  outfit_id?: number;
  item_id?: number;
  x_position?: number | null;
  y_position?: number | null;
  z_index?: number | null;
  transform?: Record<string, unknown> | null;
  item?: ClothingItem;
}

/**
 * Loads all canvas items belonging to a saved outfit.
 *
 * Preconditions: Outfit must exist and be accessible to the requester.
 * Postconditions: Returns an array (empty if outfit has no items or was not found).
 */
export async function getOutfitItemsByOutfit(outfitId: number) {
  try {
    const response = await apiClient.get<OutfitItem[]>(
      `/outfit-items/outfit/${outfitId}`
    );
    return response.data;
  } catch (error: unknown) {
    const status = (error as { response?: { status?: number } })?.response?.status;
    if (status === 404) {
      return [];
    }
    throw error;
  }
}

export interface CreateOutfitItemPayload {
  outfit_id: number;
  item_id: number;
  x_position?: number | null;
  y_position?: number | null;
  z_index?: number | null;
  transform?: Record<string, unknown> | null;
}

export interface CreateOutfitItemResponse {
  message: string;
  outfit_item: OutfitItem;
}

/**
 * Persists a wardrobe item onto an outfit canvas (position, z-index, transforms).
 */
export async function createOutfitItem(payload: CreateOutfitItemPayload) {
  const response = await apiClient.post<CreateOutfitItemResponse>(
    "/outfit-items",
    payload
  );
  return response.data;
}

export interface DeleteOutfitItemResponse {
  message: string;
}

/**
 * Removes a clothing element from the outfit canvas.
 */
export async function deleteOutfitItem(outfitItemId: number) {
  const response = await apiClient.delete<DeleteOutfitItemResponse>(
    `/outfit-items/${outfitItemId}`
  );
  return response.data;
}
