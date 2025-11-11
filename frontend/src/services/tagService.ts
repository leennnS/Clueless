import apiClient from "./apiClient";

export interface TagRecord {
  tag_id: number;
  name: string;
  user_id?: number;
}

/**
 * Fetches the authenticated user's tags for wardrobe filtering.
 */
export async function getTags() {
  const response = await apiClient.get<TagRecord[]>("/tags");
  return response.data;
}
