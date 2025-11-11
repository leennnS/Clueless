import apiClient from "./apiClient";

export interface LikeUserSummary {
  user_id: number;
  username?: string | null;
  name?: string | null;
}

export interface LikeOutfitSummary {
  outfit_id: number;
  name?: string | null;
  cover_image_url?: string | null;
  is_public?: boolean | null;
  user?: LikeUserSummary | null;
}

export interface LikeRecord {
  like_id: number;
  user?: LikeUserSummary | null;
  outfit?: LikeOutfitSummary | null;
  created_at?: string;
}

export interface ToggleLikeResponse {
  message: string;
  liked: boolean;
  like?: LikeRecord;
}

/**
 * Toggles a like on an outfit for the given viewer.
 *
 * Preconditions: `user_id` must be authenticated; outfit must exist.
 * Postconditions: Returns whether the outfit is now liked and the like record if created.
 */
export async function toggleLike(user_id: number, outfit_id: number) {
  const response = await apiClient.post<ToggleLikeResponse>("/likes/toggle", {
    user_id,
    outfit_id,
  });

  return response.data;
}

/**
 * Retrieves outfits liked by a user (used for the profile page "Liked looks" section).
 */
export async function getLikesByUser(userId: number) {
  const response = await apiClient.get<LikeRecord[]>(`/likes/user/${userId}`);
  return response.data;
}

/**
 * Returns inbox entries (recent likes) for creators, powering studio floating hearts.
 */
export async function getCreatorLikesInbox(userId: number) {
  const response = await apiClient.get<LikeRecord[]>(`/likes/creator/${userId}`);
  return response.data;
}
