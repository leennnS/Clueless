import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type MouseEvent,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { useClothingItems } from "./useClothingItems";
import {
  createClothingItem,
  type ClothingItemRecord,
} from "../services/clothingItemService";
import { createOutfit, getOutfit, updateOutfit } from "../services/outfitService";
import apiClient from "../services/apiClient";
import {
  createOutfitItem,
  deleteOutfitItem,
  getOutfitItemsByOutfit,
  type CreateOutfitItemResponse,
  type OutfitItem,
} from "../services/outfitItemService";
import { createScheduledOutfit } from "../services/scheduledOutfitService";
import {
  getCreatorLikesInbox,
  type LikeRecord,
} from "../services/likeService";

interface CanvasItem {
  instanceId: string;
  item: ClothingItemRecord;
  x: number;
  y: number;
  z: number;
  scale: number;
  rotation: number;
}

interface DragState {
  instanceId: string;
  offsetX: number;
  offsetY: number;
}

interface EditingContext {
  outfitId: number;
  originalItemIds: number[];
  name: string | null;
  isPublic: boolean;
}

interface ResizeState {
  instanceId: string;
  anchorX: number;
  anchorY: number;
  startDistance: number;
  startScale: number;
}

interface RotateState {
  instanceId: string;
  centerX: number;
  centerY: number;
  startAngle: number;
  startRotation: number;
}

const CANVAS_WIDTH = 520;
const CANVAS_HEIGHT = 520;
/** Default pixel size used when placing wardrobe tiles onto the canvas. */
export const CANVAS_ITEM_SIZE = 120;
const MIN_CANVAS_SCALE = 0.6;
const MAX_CANVAS_SCALE = 2.4;
/** Predefined tag suggestions shown in the add-item dialog. */
export const PRESET_TAG_OPTIONS = [
  { label: "Summer", value: "summer" },
  { label: "Winter", value: "winter" },
  { label: "Spring", value: "spring" },
  { label: "Autumn", value: "autumn" },
  { label: "Rainy", value: "rainy" },
  { label: "Cold", value: "cold" },
  { label: "Warm", value: "warm" },
  { label: "Layered", value: "layered" },
  { label: "Lightweight", value: "lightweight" },
] as const;

export const CLOTHING_CATEGORY_OPTIONS = [
  { value: "shirts", label: "Shirts & Tops", icon: "👚" },
  { value: "dresses", label: "Dresses", icon: "👗" },
  { value: "pants", label: "Pants", icon: "👖" },
  { value: "outerwear", label: "Outerwear", icon: "🧥" },
  { value: "shoes", label: "Shoes", icon: "👟" },
  { value: "accessories", label: "Accessories", icon: "🎀" },
] as const;

const DEFAULT_CLOTHING_CATEGORY = CLOTHING_CATEGORY_OPTIONS[0].value;

export const WARDROBE_CATEGORY_TABS = [
  { value: "all", label: "All items", icon: "🌈" },
  ...CLOTHING_CATEGORY_OPTIONS,
  { value: "other", label: "Other", icon: "🧺" },
] as const;

export const STUDIO_SPARKLES: Array<{
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  delay: string;
  size: string;
}> = [
  { top: "40px", left: "50px", delay: "0s", size: "1.2rem" },
  { top: "140px", right: "80px", delay: "0.5s", size: "1.4rem" },
  { bottom: "160px", left: "120px", delay: "1s", size: "1.1rem" },
  { bottom: "60px", right: "50px", delay: "1.5s", size: "1.3rem" },
] as const;

const getLocalDateKey = (value: Date) => {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const day = `${value.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const LIKES_SEEN_STORAGE_KEY = "dashboard.likesSeen";

/**
 * Central hook powering the studio dashboard: exposes wardrobe search/filtering,
 * drag-and-drop canvas interactions, save/edit flows, and scheduling helpers.
 *
 * Preconditions:
 * - The caller must wrap the tree in `AuthProvider` so `useAuth` yields a user/token.
 * - API base URL must be configured so service calls succeed.
 *
 * Postconditions:
 * - Returns stable references for UI actions (add/remove items, persist outfits, etc.).
 * - Keeps wardrobe/outfit state in sync with the backend and surfaces toast-friendly status values.
 */
export function useDashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const userId = user?.id ?? null;
  const todayKey = useMemo(() => getLocalDateKey(new Date()), []);

  useEffect(() => {
    if (!userId) {
      navigate("/login", {
        replace: true,
        state: { from: { pathname: location.pathname } },
      });
    }
  }, [userId, navigate, location.pathname]);


  const { items, loading, error, refetch } = useClothingItems({
    userId: userId ?? undefined,
    mode: userId ? "user" : "all",
  });
  const [studioLikes, setStudioLikes] = useState<LikeRecord[]>([]);
  const [showLikeNotification, setShowLikeNotification] = useState(true);
  const [lastSeenLikeCount, setLastSeenLikeCount] = useState(() => {
    if (typeof window === "undefined") {
      return 0;
    }
    try {
      const raw = window.localStorage.getItem(LIKES_SEEN_STORAGE_KEY);
      if (!raw) {
        return 0;
      }
      const parsed = JSON.parse(raw) as { date?: string; count?: number };
      if (parsed.date !== todayKey) {
        return 0;
      }
      return typeof parsed.count === "number" ? parsed.count : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    if (!userId) {
      setStudioLikes([]);
      return;
    }
    let isMounted = true;
    getCreatorLikesInbox(userId)
      .then((records) => {
        if (isMounted) {
          setStudioLikes(records);
        }
      })
      .catch(() => {
        if (isMounted) {
          setStudioLikes([]);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [userId]);

  const resolveImageUrl = useCallback((imageUrl?: string | null) => {
    if (!imageUrl || imageUrl.trim().length === 0) {
      return null;
    }
    if (/^https?:\/\//i.test(imageUrl)) {
      return imageUrl;
    }
    try {
      const baseUrl = apiClient.defaults.baseURL ?? window.location.origin;
      return new URL(imageUrl, baseUrl).toString();
    } catch {
      return imageUrl;
    }
  }, []);

  const wardrobeItemLookup = useMemo(() => {
    const lookup = new Map<number, ClothingItemRecord>();
    items.forEach((item) => {
      lookup.set(item.item_id, item);
    });
    return lookup;
  }, [items]);

  const [selectedItem, setSelectedItem] = useState<ClothingItemRecord | null>(
    null
  );
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [activeCanvasItemId, setActiveCanvasItemId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [editingContext, setEditingContext] = useState<EditingContext | null>(null);
  const [loadingEditContext, setLoadingEditContext] = useState(false);
  const [editContextError, setEditContextError] = useState<string | null>(null);
const [saveFormName, setSaveFormName] = useState("");
const [saveFormIsPublic, setSaveFormIsPublic] = useState(false);
  const [saveFormScheduleDate, setSaveFormScheduleDate] = useState("");
const [saveDialogError, setSaveDialogError] = useState<string | null>(null);
  const [savingOutfit, setSavingOutfit] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [wardrobeSearch, setWardrobeSearch] = useState("");
  const [activeWardrobeCategory, setActiveWardrobeCategory] = useState<string>("all");
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
  const [resizeState, setResizeState] = useState<ResizeState | null>(null);
  const [rotateState, setRotateState] = useState<RotateState | null>(null);
  const [addItemSubmitting, setAddItemSubmitting] = useState(false);
const [addItemError, setAddItemError] = useState<string | null>(null);
const [addItemForm, setAddItemForm] = useState<{
  name: string;
  category: string;
    color: string;
    imageData: string | null;
    tags: string[];
    previewUrl: string | null;
  }>({
    name: "",
    category: DEFAULT_CLOTHING_CATEGORY,
    color: "",
    imageData: null,
    tags: [],
    previewUrl: null,
  });
  const canvasRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (items.length && !selectedItem) {
      setSelectedItem(items[0]);
    }
  }, [items, selectedItem]);

  useEffect(() => {
    if (!activeCanvasItemId) {
      return;
    }
    if (!canvasItems.some((item) => item.instanceId === activeCanvasItemId)) {
      setActiveCanvasItemId(null);
    }
  }, [activeCanvasItemId, canvasItems]);

  const activeCanvasItem = useMemo(
    () =>
      canvasItems.find((item) => item.instanceId === activeCanvasItemId) ?? null,
    [canvasItems, activeCanvasItemId]
  );
  const detailItem = activeCanvasItem?.item ?? selectedItem;

  const handleWardrobeCategoryChange = useCallback((value: string) => {
    if (!WARDROBE_CATEGORY_TABS.some((tab) => tab.value === value)) {
      return;
    }
    setActiveWardrobeCategory(value);
  }, []);

  const filteredWardrobeItems = useMemo(() => {
    const query = wardrobeSearch.trim().toLowerCase();
    const knownCategories = new Set<string>(
      CLOTHING_CATEGORY_OPTIONS.map((option) => option.value)
    );

    return items.filter((item) => {
      const normalizedCategory = (item.category ?? "")
        .toString()
        .trim()
        .toLowerCase();

      const matchesCategory =
        activeWardrobeCategory === "all"
          ? true
          : activeWardrobeCategory === "other"
          ? !knownCategories.has(normalizedCategory)
          : normalizedCategory === activeWardrobeCategory;

      if (!matchesCategory) {
        return false;
      }

      if (!query) {
        return true;
      }

      const tagMatch = (item.tags ?? []).some((tag) =>
        tag.name.toLowerCase().includes(query)
      );

      return (
        item.name.toLowerCase().includes(query) ||
        normalizedCategory.includes(query) ||
        (typeof item.color === "string" &&
          item.color.toLowerCase().includes(query)) ||
        tagMatch
      );
    });
  }, [items, wardrobeSearch, activeWardrobeCategory]);

  const resetAddItemForm = useCallback(() => {
    setAddItemForm({
      name: "",
      category: DEFAULT_CLOTHING_CATEGORY,
      color: "",
      imageData: null,
      tags: [],
      previewUrl: null,
    });
    setAddItemError(null);
  }, []);

  const todayIso = useMemo(
    () => new Date().toISOString().split("T")[0],
    [],
  );
  const handleOpenAddItemDialog = useCallback(() => {
    setShowAddItemDialog(true);
    setAddItemError(null);
  }, []);


  const handleCloseAddItemDialog = useCallback(() => {
    if (addItemSubmitting) {
      return;
    }
    setShowAddItemDialog(false);
    resetAddItemForm();
  }, [addItemSubmitting, resetAddItemForm]);

  const handleAddItemFieldChange = useCallback(
    (field: "name" | "category" | "color", value: string) => {
      setAddItemForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [],
  );

  const handleToggleTagSelection = useCallback((tagValue: string) => {
    setAddItemForm((prev) => {
      const hasTag = prev.tags.includes(tagValue);
      return {
        ...prev,
        tags: hasTag
          ? prev.tags.filter((tag) => tag !== tagValue)
          : [...prev.tags, tagValue],
      };
    });
  }, []);

  const handleImageSelection = useCallback(
    (file: File | null) => {
      if (!file) {
        setAddItemForm((prev) => ({
          ...prev,
          imageData: null,
          previewUrl: null,
        }));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const result = typeof reader.result === "string" ? reader.result : null;
        setAddItemForm((prev) => ({
          ...prev,
          imageData: result,
          previewUrl: result,
        }));
      };
      reader.readAsDataURL(file);
    },
    [],
  );

  const handleSubmitNewItem = useCallback(async () => {
    if (!userId) {
      setAddItemError("Please log in again to add wardrobe pieces.");
      return;
    }

    const name = addItemForm.name.trim();
    const category = addItemForm.category;
    const color = addItemForm.color.trim();
    const { imageData, tags } = addItemForm;

    if (!name || !category || !color) {
      setAddItemError("Name, category, and color are required.");
      return;
    }
    if (!CLOTHING_CATEGORY_OPTIONS.some((option) => option.value === category)) {
      setAddItemError("Choose a category from the dropdown list.");
      return;
    }
    if (!imageData) {
      setAddItemError("Please add a clear photo of your clothing item.");
      return;
    }
    if (!tags.length) {
      setAddItemError("Select at least one tag to organize your wardrobe.");
      return;
    }

    setAddItemSubmitting(true);
    setAddItemError(null);

    try {
      await createClothingItem({
        name,
        category,
        color,
        image_url: imageData,
        user_id: userId,
        tag_names: tags,
      });
      await refetch();
      setStatusMessage("New wardrobe item added successfully!");
      setShowAddItemDialog(false);
      resetAddItemForm();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to add clothing item.";
      setAddItemError(message);
    } finally {
      setAddItemSubmitting(false);
    }
  }, [addItemForm, refetch, resetAddItemForm, setStatusMessage, userId]);

  const handleDragStart = useCallback(
    (item: ClothingItemRecord) => (event: DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData(
        "application/json",
        JSON.stringify(item.item_id)
      );
      setSelectedItem(item);
    },
    []
  );

  const handleDragOverCanvas = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const addItemToCanvas = useCallback(
    (item: ClothingItemRecord, clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const defaultScale = 1;
      const itemSize = CANVAS_ITEM_SIZE * defaultScale;
      const x = clientX - rect.left - itemSize / 2;
      const y = clientY - rect.top - itemSize / 2;
      const clampedX = Math.max(
        0,
        Math.min(x, rect.width - itemSize)
      );
      const clampedY = Math.max(
        0,
        Math.min(y, rect.height - itemSize)
      );
      const newInstanceId = `${item.item_id}-${Date.now()}`;

      setCanvasItems((prev) => [
        ...prev,
        {
          instanceId: newInstanceId,
          item,
          x: clampedX,
          y: clampedY,
          z: prev.length + 1,
          scale: defaultScale,
          rotation: 0,
        },
      ]);
      setSelectedItem(item);
      setActiveCanvasItemId(newInstanceId);
    },
    []
  );

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const itemIdRaw = event.dataTransfer.getData("application/json");
      const itemId = Number(itemIdRaw);
      if (!itemId) {
        return;
      }
      const sourceItem = items.find((item) => item.item_id === itemId);
      if (!sourceItem) {
        return;
      }
      addItemToCanvas(sourceItem, event.clientX, event.clientY);
    },
    [items, addItemToCanvas]
  );

  const beginDragFromCanvas = useCallback(
    (instanceId: string) => (event: MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
        }
        const rect = canvas.getBoundingClientRect();
        const target = canvasItems.find((item) => item.instanceId === instanceId);
        if (!target) {
          return;
        }
        const offsetX = event.clientX - rect.left - target.x;
        const offsetY = event.clientY - rect.top - target.y;
        setActiveCanvasItemId(instanceId);
        setDragState({ instanceId, offsetX, offsetY });
        setSelectedItem(target.item);
      },
      [canvasItems]
    );

  const beginResizeHandle = useCallback(
    (instanceId: string) => (event: MouseEvent<HTMLElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }
      const target = canvasItems.find((item) => item.instanceId === instanceId);
      if (!target) {
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const anchorX = rect.left + target.x;
      const anchorY = rect.top + target.y;
      const startDistance = Math.max(
        Math.hypot(event.clientX - anchorX, event.clientY - anchorY),
        1
      );
      setActiveCanvasItemId(instanceId);
      setSelectedItem(target.item);
      setDragState(null);
      setRotateState(null);
      setResizeState({
        instanceId,
        anchorX,
        anchorY,
        startDistance,
        startScale: target.scale,
      });
    },
    [canvasItems]
  );

  const beginRotateHandle = useCallback(
    (instanceId: string) => (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }
      const target = canvasItems.find((item) => item.instanceId === instanceId);
      if (!target) {
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const itemSize = CANVAS_ITEM_SIZE * target.scale;
      const centerX = rect.left + target.x + itemSize / 2;
      const centerY = rect.top + target.y + itemSize / 2;
      const startAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX);
      setActiveCanvasItemId(instanceId);
      setSelectedItem(target.item);
      setDragState(null);
      setResizeState(null);
      setRotateState({
        instanceId,
        centerX,
        centerY,
        startAngle,
        startRotation: target.rotation,
      });
    },
    [canvasItems]
  );

  const handleCanvasMouseMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }

      if (resizeState) {
        event.preventDefault();
        const { instanceId, anchorX, anchorY, startDistance, startScale } = resizeState;
        const newDistance = Math.max(
          Math.hypot(event.clientX - anchorX, event.clientY - anchorY),
          1
        );
        const ratio = newDistance / Math.max(startDistance, 1);
        const unclampedScale = startScale * ratio;
        const clampedScale = Math.min(
          MAX_CANVAS_SCALE,
          Math.max(MIN_CANVAS_SCALE, unclampedScale)
        );
        const rect = canvas.getBoundingClientRect();
        setCanvasItems((prev) =>
          prev.map((item) => {
            if (item.instanceId !== instanceId) {
              return item;
            }
            const itemSize = CANVAS_ITEM_SIZE * clampedScale;
            const maxX = Math.max(0, rect.width - itemSize);
            const maxY = Math.max(0, rect.height - itemSize);
            const clampedX = Math.max(0, Math.min(item.x, maxX));
            const clampedY = Math.max(0, Math.min(item.y, maxY));
            return {
              ...item,
              scale: clampedScale,
              x: clampedX,
              y: clampedY,
            };
          })
        );
        return;
      }

      if (rotateState) {
        event.preventDefault();
        const { instanceId, centerX, centerY, startAngle, startRotation } = rotateState;
        const currentAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX);
        const deltaAngle = currentAngle - startAngle;
        const newRotation = startRotation + (deltaAngle * 180) / Math.PI;
        setCanvasItems((prev) =>
          prev.map((item) =>
            item.instanceId === instanceId
              ? {
                  ...item,
                  rotation: ((newRotation % 360) + 360) % 360,
                }
              : item
          )
        );
        return;
      }

      if (!dragState) {
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const { instanceId, offsetX, offsetY } = dragState;
      setCanvasItems((prev) =>
        prev.map((item) => {
          if (item.instanceId !== instanceId) {
            return item;
          }
          const itemSize = CANVAS_ITEM_SIZE * item.scale;
          const x = event.clientX - rect.left - (offsetX ?? itemSize / 2);
          const y = event.clientY - rect.top - (offsetY ?? itemSize / 2);
          const clampedX = Math.max(0, Math.min(x, rect.width - itemSize));
          const clampedY = Math.max(0, Math.min(y, rect.height - itemSize));
          return { ...item, x: clampedX, y: clampedY };
        })
      );
    },
    [dragState, resizeState, rotateState]
  );

  const handleCanvasMouseDown = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const targetElement = event.target as HTMLElement | null;
    const canvasItemContainer = targetElement?.closest('[data-canvas-item="true"]');
    if (!canvasItemContainer) {
      setActiveCanvasItemId(null);
    }
  }, []);

  const endCanvasDrag = useCallback(() => {
    if (dragState) {
      setDragState(null);
    }
    if (resizeState) {
      setResizeState(null);
    }
    if (rotateState) {
      setRotateState(null);
    }
  }, [dragState, resizeState, rotateState]);

  const removeCanvasItem = useCallback(
    (instanceId: string) => {
      const removedItem = canvasItems.find((item) => item.instanceId === instanceId);
      setCanvasItems((prev) => prev.filter((item) => item.instanceId !== instanceId));
      setActiveCanvasItemId((prev) => (prev === instanceId ? null : prev));
      if (removedItem && selectedItem?.item_id === removedItem.item.item_id) {
        setSelectedItem(null);
      }
    },
    [canvasItems, selectedItem]
  );

  const resetStatus = useCallback(() => {
    setStatusMessage(null);
    setStatusError(null);
  }, []);

  const buildCanvasItemFromOutfitItem = useCallback(
    (outfitItem: OutfitItem, index: number): CanvasItem => {
      const clothing = outfitItem.item ?? null;
      const resolvedItemId =
        typeof clothing?.item_id === "number" && clothing.item_id > 0
          ? clothing.item_id
          : Number(
              typeof outfitItem.item_id === "number" && outfitItem.item_id > 0
                ? outfitItem.item_id
                : index + 1
            );

      const wardrobeItem = wardrobeItemLookup.get(resolvedItemId);
      const fallbackImageUrl =
        resolveImageUrl(clothing?.image_url ?? undefined) ?? undefined;

      const normalized: ClothingItemRecord = wardrobeItem
        ? {
            ...wardrobeItem,
            image_url: wardrobeItem.image_url ?? fallbackImageUrl ?? undefined,
          }
        : {
            item_id: resolvedItemId,
            name: clothing?.name ?? `Item ${index + 1}`,
            category: clothing?.category ?? "other",
            color: clothing?.color ?? undefined,
            image_url: fallbackImageUrl ?? undefined,
            description: undefined,
            uploaded_at: (clothing as { uploaded_at?: string })?.uploaded_at ?? undefined,
            updated_at: (clothing as { updated_at?: string })?.updated_at ?? undefined,
            user:
              clothing && (clothing as { user?: { user_id?: number } }).user
                ? {
                    user_id:
                      (clothing as { user?: { user_id?: number } }).user?.user_id ??
                      userId ??
                      resolvedItemId,
                    username: (clothing as { user?: { username?: string | null } }).user
                      ?.username ?? undefined,
                    email: (clothing as { user?: { email?: string | null } }).user?.email ??
                      undefined,
                  }
                : userId
                ? {
                    user_id: userId,
                    username: user?.username,
                    email: user?.email,
                  }
                : undefined,
            tags: [],
          };

      const transform = (outfitItem.transform ?? {}) as {
        scale?: unknown;
        rotation?: unknown;
      };

      const resolveNumber = (value: unknown, fallback: number) => {
        if (typeof value === "number" && Number.isFinite(value)) {
          return value;
        }
        if (typeof value === "string" && value.trim().length > 0) {
          const parsed = Number(value);
          if (Number.isFinite(parsed)) {
            return parsed;
          }
        }
        return fallback;
      };

      const scale = resolveNumber(transform.scale, 1);
      const rotation = resolveNumber(transform.rotation, 0);
      const itemSize = CANVAS_ITEM_SIZE * scale;
      const defaultX = (CANVAS_WIDTH - itemSize) / 2;
      const defaultY = (CANVAS_HEIGHT - itemSize) / 2;
      const maxX = Math.max(0, CANVAS_WIDTH - itemSize);
      const maxY = Math.max(0, CANVAS_HEIGHT - itemSize);

      const x = Math.max(
        0,
        Math.min(resolveNumber(outfitItem.x_position, defaultX), maxX)
      );
      const y = Math.max(
        0,
        Math.min(resolveNumber(outfitItem.y_position, defaultY), maxY)
      );

      return {
        instanceId: `loaded-${
          outfitItem.outfit_item_id ?? resolvedItemId ?? index
        }-${Math.random().toString(36).slice(2, 9)}`,
        item: normalized,
        x,
        y,
        z: outfitItem.z_index ?? index + 1,
        scale,
        rotation,
      };
    },
    [resolveImageUrl, userId, user, wardrobeItemLookup]
  );

  const persistOutfitItems = useCallback(
    async (outfitId: number): Promise<CreateOutfitItemResponse[]> => {
      const results = await Promise.all(
        canvasItems.map((canvasItem, index) =>
          createOutfitItem({
            outfit_id: outfitId,
            item_id: canvasItem.item.item_id,
            x_position: Math.round(canvasItem.x),
            y_position: Math.round(canvasItem.y),
            z_index: index + 1,
            transform: {
              scale: Number(canvasItem.scale.toFixed(4)),
              rotation: Number(canvasItem.rotation.toFixed(2)),
            },
          })
        )
      );
      return results;
    },
    [canvasItems]
  );

  useEffect(() => {
    const state = location.state as { editOutfitId?: number } | null;
    if (!state?.editOutfitId) {
      return;
    }

    const parsedOutfitId = Number(state.editOutfitId);
    if (!Number.isFinite(parsedOutfitId) || parsedOutfitId <= 0) {
      navigate(location.pathname, { replace: true });
      return;
    }

    if (!userId) {
      return;
    }

    setLoadingEditContext(true);
    setEditContextError(null);

    const load = async () => {
      try {
        const [outfitDetails, outfitItems] = await Promise.all([
          getOutfit(parsedOutfitId),
          getOutfitItemsByOutfit(parsedOutfitId),
        ]);

        const sortedItems = [...outfitItems].sort(
          (a, b) => (a.z_index ?? 0) - (b.z_index ?? 0)
        );
        const mappedCanvasItems = sortedItems.map((item, index) =>
          buildCanvasItemFromOutfitItem(item, index)
        );

        setCanvasItems(mappedCanvasItems);
        setActiveCanvasItemId(
          mappedCanvasItems[mappedCanvasItems.length - 1]?.instanceId ?? null
        );
        setSelectedItem(
          mappedCanvasItems[mappedCanvasItems.length - 1]?.item ?? null
        );
        setEditingContext({
          outfitId: parsedOutfitId,
          originalItemIds: sortedItems
            .map((item) => item.outfit_item_id)
            .filter((id): id is number => typeof id === "number"),
          name: outfitDetails.name ?? outfitDetails.title ?? null,
          isPublic: Boolean(outfitDetails.is_public),
        });
        setSaveFormName(outfitDetails.name ?? outfitDetails.title ?? "");
        setSaveFormIsPublic(Boolean(outfitDetails.is_public));
        setSaveFormScheduleDate("");
        resetStatus();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to load outfit for editing.";
        setEditContextError(message);
        setStatusError(message);
        setCanvasItems([]);
        setActiveCanvasItemId(null);
        setSelectedItem(null);
        setEditingContext(null);
      } finally {
        setLoadingEditContext(false);
      }
    };

    void load();

    navigate(location.pathname, { replace: true });
  }, [
    location.state,
    location.pathname,
    userId,
    buildCanvasItemFromOutfitItem,
    resetStatus,
    navigate,
  ]);

  const handleSaveOutfit = useCallback(() => {
    resetStatus();
    setSaveDialogError(null);
    if (!userId) {
      setStatusError("You must be logged in to save an outfit.");
      return;
    }
    if (canvasItems.length === 0) {
      setStatusError("Add at least one item to the canvas before saving.");
      return;
    }
    if (editingContext) {
      setSaveFormName(editingContext.name ?? "");
      setSaveFormIsPublic(editingContext.isPublic);
    } else {
      setSaveFormName("");
      setSaveFormIsPublic(false);
    }
    setSaveFormScheduleDate("");
    setShowSaveDialog(true);
  }, [canvasItems.length, editingContext, resetStatus, userId]);

  const handleExitEditing = useCallback(() => {
    setEditingContext(null);
    setEditContextError(null);
    setStatusError(null);
    setCanvasItems([]);
    setActiveCanvasItemId(null);
    setSelectedItem(null);
    setStatusMessage("Editing mode cleared. The next save will create a new outfit.");
  }, []);

  const closeSaveDialog = useCallback(() => {
    setShowSaveDialog(false);
    setSaveDialogError(null);
    setSaveFormName("");
    setSaveFormIsPublic(false);
    setSaveFormScheduleDate("");
  }, []);

  const handleConfirmSaveOutfit = useCallback(async () => {
    if (!userId) {
      setSaveDialogError("You must be logged in to save an outfit.");
      return;
    }

    const trimmedName = saveFormName.trim();
    const trimmedScheduleDate = saveFormScheduleDate.trim();
    if (!trimmedName) {
      setSaveDialogError("Outfit name is required.");
      return;
    }

    setSavingOutfit(true);
    setSaveDialogError(null);
    resetStatus();
    setIsExporting(true);

    try {
      let coverImageUrl: string | null = null;
      if (canvasRef.current) {
        try {
          const { default: html2canvas } = await import("html2canvas");
          const renderedCanvas = await html2canvas(canvasRef.current, {
            backgroundColor: null,
            useCORS: true,
            logging: false,
            onclone: (doc) => {
              const cloneCanvas = doc.getElementById(
                canvasRef.current?.id ?? ""
              );
              if (cloneCanvas) {
                cloneCanvas.setAttribute("data-export-clone", "true");
              }
            },
          });
          coverImageUrl = renderedCanvas.toDataURL("image/jpeg", 0.85);
        } catch (captureError) {
          console.error("Failed to capture outfit preview:", captureError);
        }
      }

      const isEditing = Boolean(editingContext);
      let targetOutfitId = editingContext?.outfitId ?? null;

      if (isEditing) {
        if (!targetOutfitId) {
          throw new Error("Unable to determine outfit being edited.");
        }
        await updateOutfit(targetOutfitId, {
          name: trimmedName,
          is_public: saveFormIsPublic,
          cover_image_url: coverImageUrl ?? undefined,
        });

        if (editingContext?.originalItemIds.length) {
          await Promise.all(
            editingContext.originalItemIds.map(async (outfitItemId) => {
              try {
                await deleteOutfitItem(outfitItemId);
              } catch (deleteError) {
                const status = (deleteError as {
                  response?: { status?: number };
                })?.response?.status;
                if (status !== 404) {
                  throw deleteError;
                }
              }
            })
          );
        }
      } else {
        const response = await createOutfit({
          name: trimmedName,
          user_id: userId,
          is_public: saveFormIsPublic,
          cover_image_url: coverImageUrl ?? undefined,
        });
        targetOutfitId = response.outfit?.outfit_id ?? null;
        if (!targetOutfitId) {
          throw new Error("Unable to determine outfit id from response.");
        }
      }

      if (!targetOutfitId) {
        throw new Error("Unable to resolve outfit id.");
      }

      await persistOutfitItems(targetOutfitId);

      let scheduleFailed = false;
      let scheduleSuccessNote: string | null = null;

      if (trimmedScheduleDate) {
        try {
          await createScheduledOutfit({
            outfit_id: targetOutfitId,
            user_id: userId,
            schedule_date: trimmedScheduleDate,
          });
          const prettyDate = new Date(`${trimmedScheduleDate}T00:00:00`);
          scheduleSuccessNote = `Scheduled for ${prettyDate.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}`;
        } catch (scheduleError) {
          console.error("Failed to schedule outfit:", scheduleError);
          scheduleFailed = true;
        }
      }

      if (isEditing) {
        setStatusMessage(
          scheduleSuccessNote
            ? `Outfit updated successfully! ${scheduleSuccessNote}.`
            : "Outfit updated successfully!"
        );
        if (scheduleFailed) {
          setStatusError(
            "We updated your outfit, but scheduling it failed. Try again from your profile calendar."
          );
        } else {
          setStatusError(null);
        }
        setCanvasItems([]);
        setActiveCanvasItemId(null);
        setSelectedItem(null);
        setEditingContext(null);
      } else {
        if (scheduleFailed) {
          setStatusMessage("Outfit saved successfully!");
          setStatusError(
            "We saved your outfit, but scheduling it failed. Try again from your profile calendar."
          );
        } else {
          setStatusMessage(
            scheduleSuccessNote
              ? `Outfit saved successfully! ${scheduleSuccessNote}.`
              : "Outfit saved successfully!"
          );
          setStatusError(null);
        }
        setCanvasItems([]);
        setActiveCanvasItemId(null);
        setSelectedItem(null);
        setEditingContext(null);
      }

      setShowSaveDialog(false);
      setSaveFormName("");
      setSaveFormIsPublic(false);
      setSaveFormScheduleDate("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save outfit.";
      setSaveDialogError(message);
      setStatusError(message);
    } finally {
      setIsExporting(false);
      setSavingOutfit(false);
    }
  }, [
    editingContext,
    persistOutfitItems,
    resetStatus,
    saveFormIsPublic,
    saveFormName,
    saveFormScheduleDate,
    userId,
  ]);

  const headerProfileInitials = useMemo(() => {
    if (!user?.username) return user?.email?.[0]?.toUpperCase() ?? "U";
    const trimmed = user.username.trim();
    return trimmed
      .split(/\s+/)
      .map((part) => part[0]?.toUpperCase())
      .join("")
      .slice(0, 2);
  }, [user]);
  const todaysLikes = useMemo(() => {
    return studioLikes.filter((record) => {
      if (!record.created_at) {
        return false;
      }
      const date = new Date(record.created_at);
      if (Number.isNaN(date.getTime())) {
        return false;
      }
      return getLocalDateKey(date) === todayKey;
    });
  }, [studioLikes, todayKey]);
  const todaysLikeCount = todaysLikes.length;
  const hasInboxLove = todaysLikeCount > 0 && showLikeNotification;
  const latestLove = hasInboxLove ? todaysLikes[0] : null;
  const persistLikesSeen = useCallback(
    (count: number) => {
      try {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(
            LIKES_SEEN_STORAGE_KEY,
            JSON.stringify({ date: todayKey, count }),
          );
        }
      } catch {
        // ignore storage errors
      }
      setLastSeenLikeCount(count);
    },
    [todayKey],
  );
  useEffect(() => {
    if (todaysLikeCount === 0) {
      setShowLikeNotification(false);
      return;
    }
    if (todaysLikeCount > lastSeenLikeCount) {
      setShowLikeNotification(true);
    } else {
      setShowLikeNotification(false);
    }
  }, [todaysLikeCount, lastSeenLikeCount]);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/login", { replace: true });
  }, [logout, navigate]);

  const handleOpenFeed = useCallback(() => {
    navigate("/feed");
  }, [navigate]);

  const handleOpenProfile = useCallback(
    (options?: { openInbox?: boolean }) => {
      setShowLikeNotification(false);
      navigate("/profile", {
        state: options?.openInbox ? { openInbox: true } : undefined,
      });
    },
    [navigate],
  );

  const handleOpenInboxFromNotification = useCallback(() => {
    persistLikesSeen(todaysLikeCount);
    setShowLikeNotification(false);
    handleOpenProfile({ openInbox: true });
  }, [handleOpenProfile, persistLikesSeen, todaysLikeCount]);

  /**
   * Return value groups:
   * - Header helpers: `user`, `headerProfileInitials`, `hasInboxLove`, `handleOpenFeed`, `handleOpenProfile`, `handleLogout`.
   * - Wardrobe/search: `wardrobeSearch`, `activeWardrobeCategory`, `filteredWardrobeItems`, `refetch`.
   * - Canvas state: `canvasItems`, `activeCanvasItemId`, drag/resize/rotate handlers, `detailItem`.
   * - Dialog/forms: add-item form state, save dialog state, status messages.
   * - Notifications: `todaysLikes`, `handleOpenInboxFromNotification`, `isExporting`, etc.
   */
  return {
    user,
    headerProfileInitials,
    todaysLikes,
    hasInboxLove,
    latestLove,
    handleOpenFeed,
    handleOpenInboxFromNotification,
    handleOpenProfile,
    handleLogout,
    wardrobeSearch,
    setWardrobeSearch,
    refetch,
    handleOpenAddItemDialog,
    activeWardrobeCategory,
    handleWardrobeCategoryChange,
    loading,
    error,
    filteredWardrobeItems,
    handleDragStart,
    setSelectedItem,
    selectedItem,
    handleDragOverCanvas,
    handleDrop,
    loadingEditContext,
    editingContext,
    handleExitEditing,
    editContextError,
    handleSaveOutfit,
    canvasRef,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    endCanvasDrag,
    canvasItems,
    isExporting,
    activeCanvasItemId,
    dragState,
    resizeState,
    rotateState,
    beginDragFromCanvas,
    setActiveCanvasItemId,
    removeCanvasItem,
    beginRotateHandle,
    beginResizeHandle,
    statusMessage,
    statusError,
    detailItem,
    showAddItemDialog,
    addItemSubmitting,
    handleCloseAddItemDialog,
    addItemForm,
    handleAddItemFieldChange,
    handleImageSelection,
    handleToggleTagSelection,
    addItemError,
    handleSubmitNewItem,
    showSaveDialog,
    closeSaveDialog,
    savingOutfit,
    handleConfirmSaveOutfit,
    saveFormName,
    setSaveFormName,
    saveDialogError,
    setSaveDialogError,
    saveFormIsPublic,
    setSaveFormIsPublic,
    saveFormScheduleDate,
    setSaveFormScheduleDate,
    todayIso,
  };
}
