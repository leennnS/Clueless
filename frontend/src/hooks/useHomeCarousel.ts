import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector } from "./useAppSelector";
import { fetchPublicFeedThunk } from "../store/outfits/outfitsSlice";
import type { Outfit } from "../types/models";

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

const ACCENT_PALETTE = ["#8b4513", "#ec407a", "#42a5f5", "#66bb6a", "#ab47bc", "#ffa726"];
const EMOJI_PALETTE = ["✨", "💖", "🌟", "🎨", "🧵", "👗"];

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
  const dispatch = useAppDispatch();
  const { feed: outfits, status, error } = useAppSelector((state) => state.outfits);
  const loading = status === "loading";
  const [currentOutfitIndex, setCurrentOutfitIndex] = useState(0);
  const fetchPublicOutfits = useCallback(async () => {
    try {
      await dispatch(fetchPublicFeedThunk({})).unwrap();
    } catch (err) {
      const message = getErrorMessage(err);
      throw new Error(message);
    }
  }, [dispatch]);

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
      const outfitId = outfit?.outfit_id ?? index;
      const displayName = outfit?.name?.trim() || "Untitled Outfit";
      const displayOwner =
        outfit?.user?.username?.trim() ||
        outfit?.user?.email?.trim() ||
        "Anonymous stylist";
      const accentColor =
        ACCENT_PALETTE[Math.abs(outfitId) % ACCENT_PALETTE.length] ?? ACCENT_PALETTE[0];
      const emoji = EMOJI_PALETTE[Math.abs(outfitId) % EMOJI_PALETTE.length] ?? "";
      const primaryImage = outfit?.cover_image_url ?? null;

      return {
        key: `carousel-${outfitId}`,
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
