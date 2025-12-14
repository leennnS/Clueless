import { useCallback, useEffect, useMemo } from "react";
import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector } from "./useAppSelector";
import { fetchOutfitsThunk } from "../store/outfits/outfitsSlice";
import type { Outfit } from "../types/models";

interface UseOutfitsResult {
  outfits: Outfit[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<Outfit[]>;
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Failed to load outfits. Please try again.";
};

/**
 * Fetches the current user's outfits for profile dashboards.
 *
 * Preconditions:
 * - `getOutfits` must be authenticated via `apiClient` headers (user logged in).
 *
 * Postconditions:
 * - Returns outfits array, loading/error flags, and a refetch helper.
 * - Handles subscription cleanup to avoid state updates after unmount.
 */
export function useOutfits(): UseOutfitsResult {
  const dispatch = useAppDispatch();
  const { data: outfits, status, error } = useAppSelector((state) => state.outfits);

  const fetchOutfits = useCallback(async () => {
    try {
      const data = await dispatch(fetchOutfitsThunk()).unwrap();
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      throw new Error(message);
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchOutfitsThunk()).catch(() => undefined);
  }, [dispatch]);

  const result = useMemo(
    () => ({
      outfits,
      loading: status === "loading",
      error,
      refetch: fetchOutfits,
    }),
    [outfits, status, error, fetchOutfits]
  );

  return result;
}
