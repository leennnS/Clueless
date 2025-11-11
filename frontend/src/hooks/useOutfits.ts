import { useCallback, useEffect, useMemo, useState } from "react";
import { getOutfits } from "../services/outfitService";
import type { Outfit } from "../services/outfitService";

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
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOutfits = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getOutfits();
      setOutfits(data);
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isSubscribed = true;

    const loadOutfits = async () => {
      try {
        const data = await getOutfits();
        if (isSubscribed) {
          setOutfits(data);
          setError(null);
        }
      } catch (err) {
        if (isSubscribed) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    loadOutfits();

    return () => {
      isSubscribed = false;
    };
  }, []);

  const result = useMemo(
    () => ({
      outfits,
      loading,
      error,
      refetch: fetchOutfits,
    }),
    [outfits, loading, error, fetchOutfits]
  );

  return result;
}
