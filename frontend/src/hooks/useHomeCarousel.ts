import { useCallback, useEffect, useMemo, useState } from "react";

import type { FeedOutfit, Outfit } from "../services/outfitService";
import { getOutfitId, getPublicFeed } from "../services/outfitService";

type CarouselPosition = "left" | "center" | "right";

interface DisplaySlot {
  outfit: Outfit;
  position: CarouselPosition;
  index: number;
}

export interface CarouselCardData {
  key: string;
  position: CarouselPosition;
  index: number;
  isCenter: boolean;
  displayName: string;
  displayOwner: string;
  accentColor: string;
  emoji: string;
  primaryImage: string | null;
}

const pickFirstString = (
  ...values: Array<string | null | undefined>
): string | undefined => {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }
  return undefined;
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Unable to load outfits. Please try again.";
};

/**
 * Fetches public outfits for the homepage hero and exposes a rotating set of slots.
 *
 * Preconditions:
 * - Backend feed endpoint must be reachable (no auth required but base URL configured).
 *
 * Postconditions:
 * - Returns loading/error flags plus derived card metadata for the carousel component.
 * - Auto-advances the `currentOutfitIndex` every 2 seconds while data is available.
 */
export function useHomeCarousel() {
  const [outfits, setOutfits] = useState<FeedOutfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentOutfitIndex, setCurrentOutfitIndex] = useState(0);
  const fetchPublicOutfits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPublicFeed();
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
    fetchPublicOutfits().catch(() => undefined);
  }, [fetchPublicOutfits]);

  const hasOutfits = outfits.length > 0;

  const displaySlots = useMemo<DisplaySlot[]>(() => {
    if (!hasOutfits) {
      return [];
    }

    if (outfits.length === 1) {
      return [{ outfit: outfits[0], position: "center", index: 0 }];
    }

    const prevIndex = (currentOutfitIndex - 1 + outfits.length) % outfits.length;
    const nextIndex = (currentOutfitIndex + 1) % outfits.length;

    return [
      { outfit: outfits[prevIndex], position: "left", index: prevIndex },
      { outfit: outfits[currentOutfitIndex], position: "center", index: currentOutfitIndex },
      { outfit: outfits[nextIndex], position: "right", index: nextIndex },
    ];
  }, [currentOutfitIndex, hasOutfits, outfits]);

  useEffect(() => {
    if (outfits.length === 0) {
      setCurrentOutfitIndex(0);
      return;
    }

    setCurrentOutfitIndex((prev) => (prev >= outfits.length ? 0 : prev));
  }, [outfits.length]);

  useEffect(() => {
    if (!hasOutfits) {
      return;
    }

    const timer = window.setInterval(() => {
      setCurrentOutfitIndex((prev) =>
        outfits.length > 0 ? (prev + 1) % outfits.length : prev
      );
    }, 2000);

    return () => {
      window.clearInterval(timer);
    };
  }, [hasOutfits, outfits.length]);

  const cards = useMemo<CarouselCardData[]>(() => {
    return displaySlots.map(({ outfit, position, index }) => {
      const isCenter = position === "center";
      const outfitId = getOutfitId(outfit);
      const displayName =
        pickFirstString(outfit?.title, outfit?.name) ?? "Untitled Outfit";
      const displayOwner =
        pickFirstString(
          outfit?.username,
          outfit?.user?.username,
          outfit?.user?.name
        ) ?? "Anonymous stylist";
      const accentColor =
        pickFirstString(outfit?.color ?? undefined) ?? "#8b4513";
      const emoji = pickFirstString(outfit?.emoji ?? undefined) ?? "";
      const primaryImage =
        outfit?.cover_image_url ??
        (typeof outfit?.image === "string" ? outfit.image : null);

      const cardKey = outfitId != null ? String(outfitId) : `fallback-${index}`;

      return {
        key: cardKey,
        position,
        index,
        isCenter,
        displayName,
        displayOwner,
        accentColor,
        emoji,
        primaryImage,
      };
    });
  }, [displaySlots]);

  const showCounter = hasOutfits && !loading && !error;
  const counterText =
    showCounter && outfits.length > 0
      ? `${currentOutfitIndex + 1} / ${outfits.length}`
      : null;

  const handleCardClick = useCallback(
    (card: CarouselCardData) => {
      if (!hasOutfits || card.isCenter) {
        return;
      }
      setCurrentOutfitIndex(card.index);
    },
    [hasOutfits]
  );

  return {
    loading,
    error,
    refetch: fetchPublicOutfits,
    hasOutfits,
    cards,
    imageLoading: false,
    imageError: null,
    showCounter,
    counterText,
    handleCardClick,
  };
}
