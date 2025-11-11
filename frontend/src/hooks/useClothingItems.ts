import { useCallback, useEffect, useMemo, useState } from "react";
import apiClient from "../services/apiClient";
import {
  getAllClothingItems,
  getClothingItemsByUser,
  type ClothingItemRecord,
} from "../services/clothingItemService";

type FetchMode = "all" | "user";

interface UseClothingItemsOptions {
  userId?: number | null;
  mode?: FetchMode;
}

interface UseClothingItemsResult {
  items: ClothingItemRecord[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<ClothingItemRecord[]>;
}

interface ErrorResponsePayload {
  response?: {
    data?: {
      message?: unknown;
    };
  };
}

/**
 * Attempts to pull a backend-sent message off an Axios-style error object.
 */
const readResponseMessage = (error: unknown): string | null => {
  if (typeof error !== "object" || error === null) {
    return null;
  }

  const response = (error as ErrorResponsePayload).response;
  if (typeof response !== "object" || response === null) {
    return null;
  }

  const data = response.data;
  if (typeof data !== "object" || data === null) {
    return null;
  }

  const message = (data as { message?: unknown }).message;
  return typeof message === "string" ? message : null;
};

/**
 * Converts any thrown error into a user-friendly string.
 */
const resolveErrorMessage = (error: unknown) => {
  const responseMessage = readResponseMessage(error);
  if (responseMessage) {
    return responseMessage;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Unable to load clothing items. Please try again.";
};

/**
 * Normalizes relative image URLs into absolute paths so <img /> tags always work.
 */
const resolveImageUrl = (imageUrl?: string | null) => {
  if (!imageUrl || imageUrl.trim().length === 0) {
    return null;
  }
  if (/^https?:\/\//i.test(imageUrl)) {
    return imageUrl;
  }
  try {
    const baseUrl =
      apiClient.defaults.baseURL ?? window.location.origin;
    return new URL(imageUrl, baseUrl).toString();
  } catch {
    return imageUrl;
  }
};

/**
 * Ensures every clothing record has safe tag + image data for rendering.
 */
const sanitizeItems = (raw: ClothingItemRecord[]): ClothingItemRecord[] =>
  raw.map((item) => ({
    ...item,
    image_url: resolveImageUrl(item.image_url ?? undefined) ?? undefined,
    tags: Array.isArray(item.tags) ? item.tags : [],
  }));

/**
 * Fetches clothing items for the current user (or globally) with loading and error states.
 *
 * Preconditions:
 * - When `mode === "user"`, a valid `userId` must be supplied; otherwise an error is surfaced.
 * - Axios client must have its `baseURL` configured (handled via `apiClient` bootstrap).
 *
 * Postconditions:
 * - Returns sanitized wardrobe items with normalized image URLs.
 * - Exposes a `refetch` function that resolves with the latest items or throws on failure.
 */
export function useClothingItems(
  options: UseClothingItemsOptions = {}
): UseClothingItemsResult {
  const { userId = null, mode = "user" } = options;
  const [items, setItems] = useState<ClothingItemRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data =
        mode === "user" && userId
          ? await getClothingItemsByUser(userId)
          : await getAllClothingItems();
      const normalized = sanitizeItems(data);
      setItems(normalized);
      return normalized;
    } catch (err) {
      const message = resolveErrorMessage(err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mode, userId]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const data =
          mode === "user" && userId
            ? await getClothingItemsByUser(userId)
            : await getAllClothingItems();
        if (active) {
          setItems(sanitizeItems(data));
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(resolveErrorMessage(err));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    if (mode === "user" && !userId) {
      setItems([]);
      setLoading(false);
      setError("No user found. Please log in again.");
      return;
    }

    load().catch(() => undefined);

    return () => {
      active = false;
    };
  }, [mode, userId]);

  return useMemo(
    () => ({
      items,
      loading,
      error,
      refetch: fetchItems,
    }),
    [items, loading, error, fetchItems]
  );
}
