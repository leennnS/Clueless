import apiClient from "./apiClient";

export interface ClothingTagSummary {
  tag_id: number;
  name: string;
}

export interface ClothingItemRecord {
  item_id: number;
  name: string;
  category: string;
  color?: string | null;
  image_url?: string | null;
  description?: string | null;
  uploaded_at?: string | null;
  updated_at?: string | null;
  user?: {
    user_id: number;
    username?: string | null;
    email?: string | null;
  } | null;
  tags?: ClothingTagSummary[];
}

/**
 * Retrieves every clothing item, regardless of owner (used for discovery/admin views).
 *
 * Preconditions: Requires the caller to be authenticated if the endpoint is protected.
 * Postconditions: Returns normalized `ClothingItemRecord[]`.
 */
export async function getAllClothingItems() {
  const response = await apiClient.get<ClothingItemRecord[]>("/clothing-items");
  return response.data;
}

/**
 * Fetches wardrobe entries for a specific user.
 *
 * Preconditions: `userId` must reference an existing account.
 * Postconditions: Returns only clothing items belonging to that user.
 */
export async function getClothingItemsByUser(userId: number) {
  const response = await apiClient.get<ClothingItemRecord[]>(
    `/clothing-items/user/${userId}`,
  );
  return response.data;
}

export interface CreateClothingItemPayload {
  name: string;
  category: string;
  color: string;
  image_url: string;
  user_id: number;
  tag_names: string[];
}

export interface CreateClothingItemResponse {
  message: string;
  item: ClothingItemRecord;
}

/**
 * Creates a new clothing record along with optional tag associations.
 *
 * Preconditions: Caller supplies required fields plus authenticated user id.
 * Postconditions: Returns the created item echoed back from the API.
 */
export async function createClothingItem(payload: CreateClothingItemPayload) {
  const response = await apiClient.post<CreateClothingItemResponse>(
    "/clothing-items",
    payload,
  );
  return response.data;
}

export interface DeleteClothingItemResponse {
  message: string;
}

/**
 * Permanently removes a clothing item (and cascades associated tags/canvas references on the backend).
 *
 * Preconditions: `itemId` exists and belongs to the authenticated user.
 * Postconditions: Returns API confirmation message.
 */
export async function deleteClothingItem(itemId: number) {
  const response = await apiClient.delete<DeleteClothingItemResponse>(
    `/clothing-items/${itemId}`
  );
  return response.data;
}
