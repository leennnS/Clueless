import apiClient from "./apiClient";
import type { Outfit } from "./outfitService";

export interface ScheduledOutfitRecord {
  schedule_id: number;
  schedule_date: string;
  created_at?: string;
  outfit: Outfit;
  user?: {
    user_id: number;
    username?: string | null;
    email?: string | null;
  } | null;
}

export interface CreateScheduledOutfitPayload {
  outfit_id: number;
  user_id: number;
  schedule_date: string; // ISO date (YYYY-MM-DD)
}

/**
 * Loads all scheduled outfits for a given user (profile calendar).
 */
export const getScheduledOutfitsByUser = async (userId: number) => {
  const response = await apiClient.get<ScheduledOutfitRecord[]>(
    `/scheduled-outfits/user/${userId}`,
  );
  return response.data;
};

/**
 * Schedules an outfit on the provided date.
 *
 * Preconditions: Outfit/user ids must exist; date must be ISO yyyy-mm-dd.
 */
export const createScheduledOutfit = async (
  payload: CreateScheduledOutfitPayload,
) => {
  const response = await apiClient.post<ScheduledOutfitRecord>(
    "/scheduled-outfits",
    payload,
  );
  return response.data;
};

/**
 * Removes a scheduled outfit entry.
 */
export const deleteScheduledOutfit = async (scheduleId: number) => {
  await apiClient.delete(`/scheduled-outfits/${scheduleId}`);
};
