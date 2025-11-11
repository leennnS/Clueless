import apiClient from "./apiClient";

export interface CommentUserSummary {
  user_id: number;
  username?: string | null;
  name?: string | null;
}

export interface CommentRecord {
  comment_id: number;
  comment_text: string;
  created_at: string;
  user: CommentUserSummary;
  outfit?: {
    outfit_id: number;
  } | null;
}

export interface CreateCommentPayload {
  user_id: number;
  outfit_id: number;
  comment_text: string;
}

/**
 * Loads comments for a specific outfit card (community feed / detail view).
 *
 * Preconditions: Outfit must be public or owned by viewer.
 * Postconditions: Returns newest-to-oldest array supplied by the API.
 */
export async function getCommentsForOutfit(outfitId: number) {
  const response = await apiClient.get<CommentRecord[]>(
    `/comments/outfit/${outfitId}`
  );
  return response.data;
}

/**
 * Creates a comment tied to an outfit.
 *
 * Preconditions: Payload must include authenticated `user_id`.
 * Postconditions: Returns the created comment record ready to prepend into UI state.
 */
export async function createComment(payload: CreateCommentPayload) {
  const response = await apiClient.post<CommentRecord>("/comments", payload);
  return response.data;
}
