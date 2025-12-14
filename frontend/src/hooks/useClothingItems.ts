import { useCallback, useEffect, useMemo } from "react";
import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector } from "./useAppSelector";
import {
  fetchUserClothingItemsThunk,
  fetchClothingItemsThunk,
} from "../store/clothingItems/clothingItemsSlice";
import type { ClothingItem } from "../types/models";

type FetchMode = "all" | "user";

interface UseClothingItemsOptions {
  userId?: number | null;
  mode?: FetchMode;
}

interface UseClothingItemsResult {
  items: ClothingItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<ClothingItem[]>;
}

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
const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  ((import.meta.env.VITE_GRAPHQL_ENDPOINT as string | undefined)?.replace(/\/graphql$/i, "") ??
    "http://localhost:3000");

const normalizeApiBase = (base: string) =>
  base.endsWith("/") ? base.slice(0, -1) : base;

export const toAbsoluteImageUrl = (path?: string | null) => {
  if (!path) return null;
  if (/^https?:\/\//i.test(path) || path.startsWith("data:")) {
    return path;
  }
  const base = normalizeApiBase(API_BASE_URL);
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
};

export function useClothingItems(
  options: UseClothingItemsOptions = {}
): UseClothingItemsResult {
  const { userId = null, mode = "user" } = options;
  const dispatch = useAppDispatch();
  const { data: items, status, error } = useAppSelector((state) => state.clothingItems);

  const fetchItems = useCallback(async () => {
    if (mode === "user" && userId) {
      const data = await dispatch(fetchUserClothingItemsThunk(userId)).unwrap();
      return data;
    }
    const data = await dispatch(fetchClothingItemsThunk()).unwrap();
    return data;
  }, [dispatch, mode, userId]);

  useEffect(() => {
    if (mode === "user" && !userId) {
      return;
    }
    fetchItems().catch(() => undefined);
  }, [fetchItems, mode, userId]);

  const normalizedItems = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        image_url: toAbsoluteImageUrl(item.image_url) ?? undefined,
      })),
    [items]
  );

  return useMemo(
    () => ({
      items: normalizedItems,
      loading: status === "loading",
      error,
      refetch: fetchItems,
    }),
    [normalizedItems, status, error, fetchItems]
  );
}
