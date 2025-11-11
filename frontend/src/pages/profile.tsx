import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useClothingItems } from "../hooks/useClothingItems";
import {
  deleteOutfit,
  getOutfitsByUser,
  type Outfit,
  getOutfitId,
} from "../services/outfitService";
import {
  deleteClothingItem,
  type ClothingItemRecord,
} from "../services/clothingItemService";
import { updateUser } from "../services/authService";
import {
  getCreatorLikesInbox,
  getLikesByUser,
  type LikeRecord,
} from "../services/likeService";
import {
  getScheduledOutfitsByUser,
  createScheduledOutfit,
  deleteScheduledOutfit,
  type ScheduledOutfitRecord,
} from "../services/scheduledOutfitService";
import * as profileStyles from "../styles/profileStyles";

interface TagSummary {
  name: string;
  count: number;
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

const formatLocalDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getDateKey = (value: string) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value.slice(0, 10);
  }
  return formatLocalDateKey(parsed);
};

const LIST_PREVIEW_COUNT = 6;
const INBOX_PREVIEW_COUNT = 5;

/**
 * Logged-in profile page presenting wardrobe stats, calendar scheduling, inbox, and editing tools.
 *
 * Preconditions:
 * - Requires authenticated user; redirects to login otherwise.
 *
 * Postconditions:
 * - Provides editing toggles, likes inbox, wardrobe/outfit grids, and calendar modals.
 */
export default function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, applyUserUpdate } = useAuth();
  const userId = user?.id ?? null;
  const todayKey = useMemo(() => formatLocalDateKey(new Date()), []);

  const {
    items,
    loading: itemsLoading,
    error: itemsError,
    refetch: refetchItems,
  } = useClothingItems({
    userId: userId ?? undefined,
    mode: userId ? "user" : "all",
  });

  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [outfitsLoading, setOutfitsLoading] = useState(false);
  const [outfitsError, setOutfitsError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editUsername, setEditUsername] = useState(user?.username ?? "");
  const [editEmail, setEditEmail] = useState(user?.email ?? "");
  const [editPassword, setEditPassword] = useState("");
  const [editConfirmPassword, setEditConfirmPassword] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);
  const [editProfileImage, setEditProfileImage] = useState<string | null>(
    user?.profile_image_url ?? null,
  );
  const [profileImageDirty, setProfileImageDirty] = useState(false);
  const profileImageInputRef = useRef<HTMLInputElement | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [deletingClothingItemIds, setDeletingClothingItemIds] = useState<Set<number>>(
    () => new Set()
  );
  const [deletingOutfitIds, setDeletingOutfitIds] = useState<Set<number>>(
    () => new Set()
  );
  const [scheduledOutfits, setScheduledOutfits] = useState<ScheduledOutfitRecord[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(
    () => formatLocalDateKey(new Date()),
  );
  const [calendarOutfitSelection, setCalendarOutfitSelection] = useState<string>("");
  const [calendarStatus, setCalendarStatus] = useState<string | null>(null);
  const [calendarStatusError, setCalendarStatusError] = useState<string | null>(null);
  const [calendarSubmitting, setCalendarSubmitting] = useState(false);
  const [showOutfitPicker, setShowOutfitPicker] = useState(false);
  const [previewSchedule, setPreviewSchedule] = useState<ScheduledOutfitRecord | null>(null);
  const [likedOutfits, setLikedOutfits] = useState<LikeRecord[]>([]);
  const [likedLoading, setLikedLoading] = useState(false);
  const [likedError, setLikedError] = useState<string | null>(null);
  const [creatorInboxLikes, setCreatorInboxLikes] = useState<LikeRecord[]>([]);
  const [creatorInboxLoading, setCreatorInboxLoading] = useState(false);
  const [creatorInboxError, setCreatorInboxError] = useState<string | null>(null);
  const [showAllWardrobe, setShowAllWardrobe] = useState(false);
  const [showAllOutfits, setShowAllOutfits] = useState(false);
  const [showAllLiked, setShowAllLiked] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const [showAllInbox, setShowAllInbox] = useState(false);
  useEffect(() => {
    const state = location.state as { openInbox?: boolean } | undefined;
    if (state?.openInbox) {
      setShowInbox(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    if (editMode) {
      return;
    }
    setEditProfileImage(user?.profile_image_url ?? null);
    setProfileImageDirty(false);
    if (profileImageInputRef.current) {
      profileImageInputRef.current.value = "";
    }
  }, [user?.profile_image_url, editMode]);

  const loadScheduledOutfits = useCallback(async () => {
    if (!userId) {
      return;
    }
    setScheduleLoading(true);
    setScheduleError(null);
    try {
      const data = await getScheduledOutfitsByUser(userId);
      setScheduledOutfits(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to load scheduled outfits.";
      setScheduleError(message);
    } finally {
      setScheduleLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      navigate("/login", { replace: true });
      return;
    }
    setOutfitsLoading(true);
    setOutfitsError(null);
    getOutfitsByUser(userId)
      .then((data) => {
        setOutfits(data);
      })
      .catch((error) => {
        const status = (error as { response?: { status?: number } })?.response?.status;
        if (status === 404) {
          setOutfits([]);
          setOutfitsError(null);
          return;
        }
        const message =
          error instanceof Error ? error.message : "Unable to load outfits.";
        setOutfitsError(message);
      })
      .finally(() => {
      setOutfitsLoading(false);
      });
  }, [navigate, userId]);

  useEffect(() => {
    if (!userId) {
      return;
    }
    void loadScheduledOutfits();
  }, [userId, loadScheduledOutfits]);

  useEffect(() => {
    setEditUsername(user?.username ?? "");
    setEditEmail(user?.email ?? "");
  }, [user]);

  useEffect(() => {
    if (!selectedCalendarDate) {
      setCalendarOutfitSelection("");
      return;
    }
    const match = scheduledOutfits.find(
      (entry) => getDateKey(entry.schedule_date) === selectedCalendarDate,
    );
      setCalendarOutfitSelection(
        match?.outfit?.outfit_id ? String(match.outfit.outfit_id) : "",
    );
  }, [scheduledOutfits, selectedCalendarDate]);

  useEffect(() => {
    if (!userId) {
      setLikedOutfits([]);
      setCreatorInboxLikes([]);
      return;
    }

    setLikedLoading(true);
    setLikedError(null);
    getLikesByUser(userId)
      .then((data) => {
        setLikedOutfits(data);
      })
      .catch((error) => {
        const message =
          error instanceof Error ? error.message : "Unable to load liked outfits.";
        setLikedError(message);
      })
      .finally(() => {
        setLikedLoading(false);
      });

    setCreatorInboxLoading(true);
    setCreatorInboxError(null);
    getCreatorLikesInbox(userId)
      .then((data) => {
        setCreatorInboxLikes(data);
      })
      .catch((error) => {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to load your likes inbox.";
        setCreatorInboxError(message);
      })
      .finally(() => {
        setCreatorInboxLoading(false);
      });
  }, [userId]);

  const stats = useMemo(() => {
    const totalItems = items.length;
    const totalOutfits = outfits.length;
    const uniqueTags = new Set(
      items.flatMap((item) =>
        (item.tags ?? []).map((tag) => tag.name.toLowerCase())
      )
    ).size;
    const withImages = items.filter((item) => Boolean(item.image_url)).length;
    return {
      totalItems,
      totalOutfits,
      uniqueTags,
      withImages,
    };
  }, [items, outfits]);

  const favoriteTags = useMemo<TagSummary[]>(() => {
    const counts = new Map<string, number>();
    for (const item of items) {
      for (const tag of item.tags ?? []) {
        const key = tag.name.trim();
        if (!key) continue;
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [items]);

  const latestItems = useMemo(() => {
    const sortable = [...items];
    sortable.sort((a, b) => {
      const aDate = new Date(a.updated_at ?? a.uploaded_at ?? 0).getTime();
      const bDate = new Date(b.updated_at ?? b.uploaded_at ?? 0).getTime();
      return bDate - aDate;
    });
    return sortable.slice(0, 4);
  }, [items]);

  const visibleWardrobeItems = showAllWardrobe
    ? items
    : items.slice(0, LIST_PREVIEW_COUNT);
  const visibleOutfits = showAllOutfits
    ? outfits
    : outfits.slice(0, LIST_PREVIEW_COUNT);
  const visibleLikedOutfits = showAllLiked
    ? likedOutfits
    : likedOutfits.slice(0, LIST_PREVIEW_COUNT);
  const visibleInboxLikes = showAllInbox
    ? creatorInboxLikes
    : creatorInboxLikes.slice(0, INBOX_PREVIEW_COUNT);

  const profileInitials = useMemo(() => {
    if (user?.username) {
      const parts = user.username.trim().split(/\s+/);
      return parts.map((p) => p[0]?.toUpperCase()).join("").slice(0, 2);
    }
    const fallback = user?.email?.[0]?.toUpperCase();
    return fallback ?? "U";
  }, [user]);

  const scheduledByDate = useMemo(() => {
    const map = new Map<string, ScheduledOutfitRecord>();
    for (const entry of scheduledOutfits) {
      const key = getDateKey(entry.schedule_date);
      if (key) {
        map.set(key, entry);
      }
    }
    return map;
  }, [scheduledOutfits]);

  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

    const cells: Array<{
      key: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
    }> = [];

    for (let index = 0; index < totalCells; index += 1) {
      const date = new Date(year, month, index - startOffset + 1);
      const key = formatLocalDateKey(date);
      cells.push({
        key,
        dayNumber: date.getDate(),
        isCurrentMonth: date.getMonth() === month,
        isToday: key === todayKey,
      });
    }

    return cells;
  }, [calendarMonth, todayKey]);

  const calendarMonthLabel = useMemo(
    () =>
      calendarMonth.toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      }),
    [calendarMonth],
  );

  const selectedSchedule = selectedCalendarDate
    ? scheduledByDate.get(selectedCalendarDate)
    : undefined;

  const selectedDateLabel = useMemo(() => {
    if (!selectedCalendarDate) {
      return "Pick a date";
    }
    const date = new Date(`${selectedCalendarDate}T00:00:00`);
    if (Number.isNaN(date.getTime())) {
      return selectedCalendarDate;
    }
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [selectedCalendarDate]);

  const currentSelectionOutfit = useMemo(() => {
    const outfitIdNumber = Number(calendarOutfitSelection);
    if (!Number.isFinite(outfitIdNumber) || outfitIdNumber <= 0) {
      return null;
    }
    return (
      outfits.find((outfit) => getOutfitId(outfit) === outfitIdNumber) ?? null
    );
  }, [calendarOutfitSelection, outfits]);

  const handleNavigateDashboard = () => navigate("/dashboard");
  const handleNavigateFeed = () => navigate("/feed");

  const handleDeleteClothingItem = useCallback(
    async (itemId: number, itemName?: string) => {
      if (!itemId) {
        return;
      }
      if (typeof window !== "undefined") {
        const confirmed = window.confirm(
          itemName
            ? `Delete "${itemName}" from your wardrobe?`
            : "Delete this wardrobe item?"
        );
        if (!confirmed) {
          return;
        }
      }
      setActionMessage(null);
      setActionError(null);
      setDeletingClothingItemIds((prev) => {
        const next = new Set(prev);
        next.add(itemId);
        return next;
      });
      try {
        await deleteClothingItem(itemId);
        await refetchItems().catch(() => undefined);
        setActionMessage(
          itemName
            ? `"${itemName}" was removed from your wardrobe.`
            : "Wardrobe item removed."
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to delete this wardrobe item.";
        setActionError(message);
      } finally {
        setDeletingClothingItemIds((prev) => {
          const next = new Set(prev);
          next.delete(itemId);
          return next;
        });
      }
    },
    [refetchItems]
  );

  const handleDeleteOutfit = useCallback(
    async (outfitId: number, outfitName?: string) => {
      if (!outfitId) {
        return;
      }
      if (typeof window !== "undefined") {
        const confirmationMessage = outfitName
          ? `Are you sure you want to delete "${outfitName}"? This will remove the outfit and any scheduled plans.`
          : "Are you sure you want to delete this outfit? This will remove any scheduled plans.";
        const confirmed = window.confirm(confirmationMessage);
        if (!confirmed) {
          return;
        }
      }
      setActionMessage(null);
      setActionError(null);
      setDeletingOutfitIds((prev) => {
        const next = new Set(prev);
        next.add(outfitId);
        return next;
      });
      try {
        await deleteOutfit(outfitId);
        setOutfits((prev) =>
          prev.filter((entry) => getOutfitId(entry) !== outfitId)
        );
        setScheduledOutfits((prev) =>
          prev.filter((entry) => entry.outfit?.outfit_id !== outfitId)
        );
        setCalendarOutfitSelection((prev) =>
          prev === String(outfitId) ? "" : prev
        );
        if (previewSchedule?.outfit?.outfit_id === outfitId) {
          setPreviewSchedule(null);
        }
        setCalendarStatus(null);
        setCalendarStatusError(null);
        setActionMessage(
          outfitName
            ? `"${outfitName}" was deleted from your outfits.`
            : "Outfit deleted successfully."
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to delete this outfit.";
        setActionError(message);
      } finally {
        setDeletingOutfitIds((prev) => {
          const next = new Set(prev);
          next.delete(outfitId);
          return next;
        });
      }
    },
    [previewSchedule]
  );

  const handleEditOutfit = useCallback(
    (outfit: Outfit) => {
      const outfitIdValue = getOutfitId(outfit);
      if (!outfitIdValue) {
        setActionError("Unable to determine outfit id for editing.");
        return;
      }
      setActionMessage(null);
      setActionError(null);
      navigate("/dashboard", {
        state: { editOutfitId: outfitIdValue },
      });
    },
    [navigate]
  );

  const renderWardrobeCard = (item: ClothingItemRecord) => {
    const deleting = deletingClothingItemIds.has(item.item_id);
    return (
      <div key={item.item_id} style={profileStyles.wardrobeCardStyle}>
        <div style={profileStyles.wardrobeImageShellStyle}>
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.name}
              style={profileStyles.wardrobeImageStyle}
            />
          ) : (
            <div style={profileStyles.wardrobeFallbackStyle}>
              {item.name.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={profileStyles.wardrobeItemTitleStyle}>{item.name}</span>
          <span style={profileStyles.wardrobeMetaStyle}>{item.category}</span>
          <div style={profileStyles.wardrobeTagListStyle}>
            {(item.tags ?? []).slice(0, 3).map((tag) => (
              <span key={tag.tag_id} style={profileStyles.wardrobeTagStyle}>
                {tag.name}
              </span>
            ))}
            {(item.tags?.length ?? 0) > 3 && (
              <span style={profileStyles.wardrobeTagStyle}>
                +{(item.tags?.length ?? 0) - 3}
              </span>
            )}
          </div>
          <div style={profileStyles.wardrobeActionsRowStyle}>
            <button
              type="button"
              onClick={() => handleDeleteClothingItem(item.item_id, item.name)}
              style={{
                ...profileStyles.wardrobeActionButtonStyle,
                ...(deleting ? profileStyles.actionButtonDisabledStyle : {}),
              }}
              disabled={deleting}
            >
              {deleting ? "Removing..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderOutfitCard = (outfit: Outfit, index: number) => {
    const cover = outfit.cover_image_url ?? outfit.image ?? null;
    const key = getOutfitId(outfit) ?? `${outfit.name ?? "outfit"}-${index}`;
    const outfitIdValue = getOutfitId(outfit);
    const isPublic = Boolean(outfit.is_public);
    const deleting = outfitIdValue ? deletingOutfitIds.has(outfitIdValue) : false;
    return (
      <div key={key} style={profileStyles.outfitCardStyle}>
        <div style={profileStyles.outfitPreviewShellStyle}>
          {cover ? (
            <img
              src={cover}
              alt={outfit.name ?? "Outfit preview"}
              style={profileStyles.outfitPreviewStyle}
            />
          ) : (
            <div style={profileStyles.outfitFallbackStyle}>
              {(outfit.name ?? "Outfit").slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={profileStyles.outfitNameStyle}>{outfit.name ?? "Untitled outfit"}</span>
          <span style={profileStyles.outfitMetaStyle}>
            {outfit.user?.username ? `@${outfit.user.username}` : "Created by you"}
          </span>
          <div style={profileStyles.outfitBadgeRowStyle}>
            <span
              style={{
                ...profileStyles.outfitPrivacyBadgeStyle,
                background: isPublic
                  ? "rgba(76,175,80,0.12)"
                  : "rgba(229,57,53,0.16)",
                color: isPublic ? "#2e7d32" : "#c62828",
              }}
            >
              {isPublic ? "Public" : "Private"}
            </span>
          </div>
        </div>
        <div style={profileStyles.outfitActionsRowStyle}>
          <button
            type="button"
            onClick={() => handleEditOutfit(outfit)}
            style={profileStyles.outfitActionButtonStyle}
            disabled={!outfitIdValue}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => outfitIdValue && handleDeleteOutfit(outfitIdValue, outfit.name ?? undefined)}
            style={{
              ...profileStyles.outfitActionButtonStyle,
              ...profileStyles.outfitDeleteButtonStyle,
              ...(deleting ? profileStyles.actionButtonDisabledStyle : {}),
            }}
            disabled={!outfitIdValue || deleting}
            aria-label={outfit.name ? `Delete ${outfit.name}` : "Delete outfit"}
            title="Delete outfit"
          >
            {deleting ? "Removing..." : "Delete"}
          </button>
        </div>
      </div>
    );
  };

  const renderLikedOutfitCard = (record: LikeRecord, index: number) => {
    const outfit = record.outfit;
    if (!outfit?.outfit_id) {
      return null;
    }
    const cover = outfit.cover_image_url ?? null;
    const key = `liked-${outfit.outfit_id}-${index}`;
    return (
      <div key={key} style={profileStyles.outfitCardStyle}>
        <div style={profileStyles.outfitPreviewShellStyle}>
          {cover ? (
            <img
              src={cover}
              alt={outfit.name ?? "Liked outfit"}
              style={profileStyles.outfitPreviewStyle}
            />
          ) : (
            <div style={profileStyles.outfitFallbackStyle}>
              {(outfit.name ?? "Outfit").slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={profileStyles.outfitNameStyle}>{outfit.name ?? "Untitled outfit"}</span>
          <span style={profileStyles.outfitMetaStyle}>
            {outfit.user?.username ? `@${outfit.user.username}` : "Community stylist"}
          </span>
          <span style={profileStyles.outfitMetaSecondaryStyle}>
            {record.created_at
              ? `Liked on ${new Date(record.created_at).toLocaleDateString()}`
              : "Liked recently"}
          </span>
        </div>
      </div>
    );
  };

  const renderInboxRow = (record: LikeRecord, index: number) => {
    const liker = record.user;
    const outfit = record.outfit;
    const likedAt = record.created_at
      ? new Date(record.created_at).toLocaleString(undefined, {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })
      : "Recently";

    return (
      <div key={`inbox-${record.like_id}-${index}`} style={profileStyles.inboxItemStyle}>
        <div style={profileStyles.inboxAvatarStyle}>
          {(liker?.username ?? liker?.name ?? "Guest").slice(0, 2).toUpperCase()}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <strong>
            {liker?.username
              ? `@${liker.username}`
              : liker?.name ?? "Guest stylist"}
          </strong>
          <span style={profileStyles.inboxMetaStyle}>
            liked <em>{outfit?.name ?? "one of your outfits"}</em> &bull; {likedAt}
          </span>
        </div>
      </div>
    );
  };

  const loading = itemsLoading || outfitsLoading;
  const error = itemsError ?? outfitsError;

  const handleToggleEdit = () => {
    if (editMode) {
      handleCancelEdit();
    } else {
      setEditMode(true);
      setEditError(null);
      setEditSuccess(null);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditError(null);
    setEditSuccess(null);
    setEditPassword("");
    setEditConfirmPassword("");
    setEditUsername(user?.username ?? "");
    setEditEmail(user?.email ?? "");
    setEditProfileImage(user?.profile_image_url ?? null);
    setProfileImageDirty(false);
    if (profileImageInputRef.current) {
      profileImageInputRef.current.value = "";
    }
  };

  const handleProfileImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setEditProfileImage(reader.result);
        setProfileImageDirty(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveProfileImage = () => {
    setEditProfileImage(null);
    setProfileImageDirty(true);
    if (profileImageInputRef.current) {
      profileImageInputRef.current.value = "";
    }
  };

  const handleSaveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId) {
      return;
    }
    if (!editUsername.trim() || !editEmail.trim()) {
      setEditError("Username and email are required.");
      return;
    }
    if (editPassword && editPassword.length < 8) {
      setEditError("Password must be at least 8 characters long.");
      return;
    }
    if (editPassword && editPassword !== editConfirmPassword) {
      setEditError("Passwords do not match.");
      return;
    }

    setEditLoading(true);
    setEditError(null);
    setEditSuccess(null);

    try {
      const payload = {
        username: editUsername.trim(),
        email: editEmail.trim(),
        ...(editPassword ? { password: editPassword } : {}),
        ...(profileImageDirty ? { profile_image_url: editProfileImage ?? "" } : {}),
      };
      const response = await updateUser(userId, payload);
      applyUserUpdate(response.user);
      setEditSuccess(response.message ?? "Profile updated successfully.");
      setEditPassword("");
      setEditConfirmPassword("");
      setEditMode(false);
      setEditProfileImage(response.user.profile_image_url ?? null);
      setProfileImageDirty(false);
      if (profileImageInputRef.current) {
        profileImageInputRef.current.value = "";
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to update profile.";
      setEditError(message);
  } finally {
    setEditLoading(false);
  }
};

  const handlePrevCalendarMonth = useCallback(() => {
    setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const handleNextCalendarMonth = useCallback(() => {
    setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  const handleResetCalendarToToday = useCallback(() => {
    const today = new Date();
    setCalendarMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedCalendarDate(todayKey);
    setCalendarStatus(null);
    setCalendarStatusError(null);
    setShowOutfitPicker(false);
  }, [todayKey]);

  const handleSelectCalendarDate = useCallback(
    (isoDate: string) => {
      setSelectedCalendarDate(isoDate);
      setCalendarStatus(null);
      setCalendarStatusError(null);
      setShowOutfitPicker(false);
      const date = new Date(`${isoDate}T00:00:00`);
      if (
        date.getMonth() !== calendarMonth.getMonth() ||
        date.getFullYear() !== calendarMonth.getFullYear()
      ) {
        setCalendarMonth(new Date(date.getFullYear(), date.getMonth(), 1));
      }
    },
    [calendarMonth],
  );

  const handleScheduleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!userId || !selectedCalendarDate) {
        setCalendarStatusError("Select a date first.");
        return;
      }
      const outfitId = Number(calendarOutfitSelection);
      if (!Number.isFinite(outfitId) || outfitId <= 0) {
        setCalendarStatusError("Pick an outfit to schedule.");
        return;
      }
      setCalendarSubmitting(true);
      setCalendarStatus(null);
      setCalendarStatusError(null);
      try {
        const existing = scheduledByDate.get(selectedCalendarDate);
        if (existing) {
          await deleteScheduledOutfit(existing.schedule_id);
        }
        await createScheduledOutfit({
          outfit_id: outfitId,
          user_id: userId,
          schedule_date: selectedCalendarDate,
        });
        setCalendarStatus("We added a heart to your calendar!");
        setShowOutfitPicker(false);
        await loadScheduledOutfits();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to schedule this outfit.";
        setCalendarStatusError(message);
      } finally {
        setCalendarSubmitting(false);
      }
    },
    [
      calendarOutfitSelection,
      loadScheduledOutfits,
      scheduledByDate,
      selectedCalendarDate,
      userId,
    ],
  );

  const handleUnschedule = useCallback(async () => {
    if (!selectedCalendarDate) {
      return;
    }
    const existing = scheduledByDate.get(selectedCalendarDate);
    if (!existing) {
      setCalendarStatusError("Nothing is scheduled for this day yet.");
      return;
    }
    setCalendarSubmitting(true);
    setCalendarStatus(null);
    setCalendarStatusError(null);
    try {
      await deleteScheduledOutfit(existing.schedule_id);
      setCalendarStatus("Cleared this date!");
      setCalendarOutfitSelection("");
      await loadScheduledOutfits();
      setShowOutfitPicker(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to clear this scheduled outfit.";
      setCalendarStatusError(message);
    } finally {
      setCalendarSubmitting(false);
    }
  }, [loadScheduledOutfits, scheduledByDate, selectedCalendarDate]);

  const handleToggleOutfitPicker = () => {
    if (outfits.length === 0) {
      setCalendarStatusError("Save an outfit in your studio before scheduling.");
      return;
    }
    setShowOutfitPicker((prev) => !prev);
    setCalendarStatus(null);
    setCalendarStatusError(null);
  };

  const handleSelectOutfitForCalendar = (outfit?: Outfit | null) => {
    if (!outfit) {
      return;
    }
    const outfitIdValue = getOutfitId(outfit);
    if (!outfitIdValue) {
      return;
    }
    const asString = String(outfitIdValue);
    setCalendarOutfitSelection(asString);
    setShowOutfitPicker(false);
    setCalendarStatus(`Ready to wear "${outfit.name ?? `Outfit #${outfitIdValue}`}"`);
    setCalendarStatusError(null);
  };

  const getOutfitCoverUrl = useCallback((outfit?: Outfit | null) => {
    if (!outfit) {
      return null;
    }
    return outfit.cover_image_url ?? outfit.image ?? null;
  }, []);

  return (
    <div style={profileStyles.containerStyle}>
      <header style={profileStyles.headerStyle}>
        <button
          type="button"
          onClick={handleNavigateDashboard}
          style={profileStyles.backButtonStyle}
        >
          &larr; Back to studio
        </button>
        <button
          type="button"
          onClick={() => {
            refetchItems().catch(() => undefined);
          }}
          style={profileStyles.refreshButtonStyle}
        >
          Refresh wardrobe
        </button>
      </header>
      {actionError && <div style={profileStyles.errorBannerStyle}>{actionError}</div>}
      {actionMessage && <div style={profileStyles.successBannerStyle}>{actionMessage}</div>}
      {editSuccess && (
        <div style={profileStyles.successBannerStyle}>{editSuccess}</div>
      )}

      {editMode && (
        <section style={profileStyles.editSectionStyle}>
          <h2 style={profileStyles.panelTitleStyle}>Edit profile</h2>
          <p style={profileStyles.panelSubtitleStyle}>
            Update how you appear across the app. Leave the password fields blank to keep your current password.
          </p>
          <form onSubmit={handleSaveProfile} style={profileStyles.editFormStyle}>
            {editError && <div style={profileStyles.errorBannerStyle}>{editError}</div>}
            <div style={profileStyles.editFieldStyle}>
              <span style={profileStyles.editLabelStyle}>Display name</span>
              <input
                type="text"
                value={editUsername}
                onChange={(event) => setEditUsername(event.target.value)}
                style={profileStyles.editInputStyle}
                disabled={editLoading}
                required
              />
            </div>
            <div style={profileStyles.editFieldStyle}>
              <span style={profileStyles.editLabelStyle}>Email</span>
              <input
                type="email"
                value={editEmail}
                onChange={(event) => setEditEmail(event.target.value)}
                style={profileStyles.editInputStyle}
                disabled={editLoading}
                required
              />
            </div>
            <div style={profileStyles.editFieldStyle}>
              <span style={profileStyles.editLabelStyle}>Profile photo</span>
              <div style={profileStyles.profileImageFieldStyle}>
                <div style={profileStyles.profileImagePreviewShellStyle}>
                  {editProfileImage ? (
                    <img
                      src={editProfileImage}
                      alt="Profile preview"
                      style={profileStyles.profileImagePreviewImgStyle}
                    />
                  ) : (
                    <span>No photo yet</span>
                  )}
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <label style={profileStyles.profileImageUploadLabelStyle}>
                    <input
                      type="file"
                      accept="image/*"
                      ref={profileImageInputRef}
                      onChange={handleProfileImageChange}
                      disabled={editLoading}
                      style={{ display: "none" }}
                    />
                    Upload photo
                  </label>
                  {(editProfileImage ?? user?.profile_image_url) && (
                    <button
                      type="button"
                      onClick={handleRemoveProfileImage}
                      disabled={editLoading}
                      style={profileStyles.cancelButtonStyle}
                    >
                      Remove photo
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div style={profileStyles.editFieldStyle}>
              <span style={profileStyles.editLabelStyle}>New password</span>
              <input
                type="password"
                value={editPassword}
                onChange={(event) => setEditPassword(event.target.value)}
                style={profileStyles.editInputStyle}
                disabled={editLoading}
                placeholder="Leave blank to keep current password"
              />
            </div>
            <div style={profileStyles.editFieldStyle}>
              <span style={profileStyles.editLabelStyle}>Confirm password</span>
              <input
                type="password"
                value={editConfirmPassword}
                onChange={(event) => setEditConfirmPassword(event.target.value)}
                style={profileStyles.editInputStyle}
                disabled={editLoading}
                placeholder="Repeat new password"
              />
            </div>
            <div style={profileStyles.formActionRowStyle}>
              <button
                type="submit"
                disabled={editLoading}
                style={profileStyles.primaryActionStyle}
              >
                {editLoading ? "Saving changes..." : "Save changes"}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={editLoading}
                style={profileStyles.cancelButtonStyle}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}


      <section style={profileStyles.heroSectionStyle}>
        <div style={profileStyles.heroIdentityStyle}>
          <div style={profileStyles.heroAvatarStyle}>
            {user?.profile_image_url ? (
              <img
                src={user.profile_image_url}
                alt={`${user?.username ?? "Profile"} avatar`}
                style={profileStyles.heroAvatarImageStyle}
              />
            ) : (
              <span>{profileInitials}</span>
            )}
          </div>
          <div>
            <h1 style={profileStyles.heroTitleStyle}>
              {user?.username ?? "Your Style Profile"}
            </h1>
            <p style={profileStyles.heroSubtitleStyle}>
              {user?.email ?? "Signed-in stylist"} {" "}&bull;{" "}Est.{" "}
              {new Date().getFullYear()}
            </p>
            <div style={profileStyles.heroActionsRowStyle}>
              <button type="button" onClick={handleNavigateFeed} style={profileStyles.primaryActionStyle}>
                Explore community feed
              </button>
              <button
                type="button"
                onClick={handleNavigateDashboard}
                style={profileStyles.secondaryActionStyle}
              >
                Open outfit studio
              </button>
              <button
                type="button"
                onClick={handleToggleEdit}
                style={profileStyles.tertiaryActionStyle}
              >
                {editMode ? "Close editor" : "Edit profile"}
              </button>
              <button
                type="button"
                onClick={() => setShowInbox((prev) => !prev)}
                style={profileStyles.inboxActionStyle}
              >
                {showInbox ? "Hide likes inbox" : "Open likes inbox"}
              </button>
            </div>
          </div>
        </div>
        <div style={profileStyles.heroStatsStyle}>
          <div style={profileStyles.statCardStyle}>
            <span style={profileStyles.statLabelStyle}>Wardrobe items</span>
            <strong style={profileStyles.statValueStyle}>{stats.totalItems}</strong>
          </div>
          <div style={profileStyles.statCardStyle}>
            <span style={profileStyles.statLabelStyle}>Published outfits</span>
            <strong style={profileStyles.statValueStyle}>{stats.totalOutfits}</strong>
          </div>
          <div style={profileStyles.statCardStyle}>
            <span style={profileStyles.statLabelStyle}>Style tags</span>
            <strong style={profileStyles.statValueStyle}>{stats.uniqueTags}</strong>
          </div>
          <div style={profileStyles.statCardStyle}>
            <span style={profileStyles.statLabelStyle}>Photo-ready fits</span>
            <strong style={profileStyles.statValueStyle}>{stats.withImages}</strong>
          </div>
        </div>
      </section>

      {showInbox && (
        <section style={profileStyles.inboxSectionStyle}>
          <div style={profileStyles.sectionHeaderStyle}>
            <h2 style={profileStyles.panelTitleStyle}>Likes inbox</h2>
            <p style={profileStyles.panelSubtitleStyle}>
              See who is loving your public outfits in real time.
            </p>
          </div>
          {creatorInboxLoading ? (
            <div style={profileStyles.loadingStateStyle}>Loading likes inbox...</div>
          ) : creatorInboxError ? (
            <div style={profileStyles.errorBoxStyle}>{creatorInboxError}</div>
          ) : creatorInboxLikes.length === 0 ? (
            <div style={profileStyles.inboxEmptyStyle}>
              <p>No likes yet. Share more looks to invite some love.</p>
            </div>
          ) : (
            <>
              <div style={profileStyles.inboxListStyle}>
                {visibleInboxLikes.map((record, index) =>
                  renderInboxRow(record, index)
                )}
              </div>
              {creatorInboxLikes.length > INBOX_PREVIEW_COUNT && (
                <div style={profileStyles.showMoreRowStyle}>
                  <button
                    type="button"
                    onClick={() => setShowAllInbox((prev) => !prev)}
                    style={profileStyles.showMoreButtonStyle}
                  >
                    {showAllInbox
                      ? "Show fewer messages"
                      : `Show all (${creatorInboxLikes.length})`}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      )}

      {loading && (
        <div style={profileStyles.loadingStateStyle}>Curating your closet...</div>
      )}

      {error && <div style={profileStyles.errorBoxStyle}>{error}</div>}

      {!loading && !error && (
        <>
          <section style={profileStyles.calendarSectionStyle}>
            <div style={profileStyles.sectionHeaderStyle}>
              <h2 style={profileStyles.panelTitleStyle}>Outfit calendar</h2>
              <p style={profileStyles.panelSubtitleStyle}>
                Tap a date to leave a little heart and plan exactly what you&apos;ll wear.
              </p>
            </div>
            {scheduleError && (
              <div style={profileStyles.calendarErrorStyle}>{scheduleError}</div>
            )}
            <div style={profileStyles.calendarLayoutStyle}>
              <div style={profileStyles.calendarColumnStyle}>
                <div style={profileStyles.calendarHeaderRowStyle}>
                  <button
                    type="button"
                    onClick={handlePrevCalendarMonth}
                    style={profileStyles.calendarNavButtonStyle}
                    aria-label="Previous month"
                  >
                    {"\u2039"}
                  </button>
                  <span style={profileStyles.calendarMonthLabelStyle}>{calendarMonthLabel}</span>
                  <button
                    type="button"
                    onClick={handleNextCalendarMonth}
                    style={profileStyles.calendarNavButtonStyle}
                    aria-label="Next month"
                  >
                    {"\u203A"}
                  </button>
                </div>
                <div style={profileStyles.calendarWeekdayRowStyle}>
                  {WEEKDAY_LABELS.map((weekday) => (
                    <span key={weekday} style={profileStyles.calendarWeekdayCellStyle}>
                      {weekday}
                    </span>
                  ))}
                </div>
                {scheduleLoading ? (
                  <div style={profileStyles.calendarLoadingStyle}>Sprinkling hearts...</div>
                ) : (
                  <div style={profileStyles.calendarGridStyle}>
                    {calendarDays.map((day) => {
                      const scheduled = scheduledByDate.get(day.key);
                      const isSelected = selectedCalendarDate === day.key;
                      const dayStyle = {
                        ...profileStyles.calendarDayCellStyle,
                        opacity: day.isCurrentMonth ? 1 : 0.45,
                        border: isSelected
                          ? "2px solid #ec407a"
                          : scheduled
                          ? "1px solid rgba(236,64,122,0.4)"
                          : "1px solid rgba(32,26,53,0.08)",
                        background: isSelected
                          ? "linear-gradient(135deg, #f8bbd0 0%, #fce4ec 100%)"
                          : scheduled
                          ? "rgba(236,64,122,0.18)"
                          : profileStyles.calendarDayCellStyle.background,
                        color: scheduled ? "#d81b60" : "#322f3d",
                        boxShadow: scheduled
                          ? "0 14px 32px rgba(236,64,122,0.18)"
                          : profileStyles.calendarDayCellStyle.boxShadow,
                      } satisfies CSSProperties;
                      return (
                        <button
                          key={day.key}
                          type="button"
                          onClick={() => handleSelectCalendarDate(day.key)}
                          onDoubleClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            if (scheduled) {
                              setPreviewSchedule(scheduled);
                            }
                          }}
                          style={dayStyle}
                          disabled={calendarSubmitting}
                        >
                          <span style={profileStyles.calendarDayNumberStyle}>{day.dayNumber}</span>
                          {scheduled && (
                            <span style={profileStyles.calendarHeartStyle} aria-hidden="true">
                              {"\u2764\uFE0F"}
                            </span>
                          )}
                          {!scheduled && day.isToday && (
                            <span style={profileStyles.calendarTodayDotStyle} aria-hidden="true" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleResetCalendarToToday}
                  style={profileStyles.calendarResetButtonStyle}
                  disabled={calendarSubmitting}
                >
                  Today
                </button>
              </div>
              <div style={profileStyles.calendarSidebarStyle}>
                <h3 style={profileStyles.calendarSidebarTitleStyle}>Plan this day</h3>
                <p style={profileStyles.calendarSidebarMetaStyle}>
                  {selectedDateLabel}
                  {selectedSchedule
                    ? "\u2022 A look is already pinned."
                    : "\u2022 No outfit scheduled yet."}
                </p>
                <form onSubmit={handleScheduleSubmit} style={profileStyles.calendarFormStyle}>
                  <div style={profileStyles.calendarSelectedInfoStyle}>
                    <span style={{ fontWeight: 600, color: "#4c4a57", fontSize: "0.9rem" }}>
                      Outfit for this day
                    </span>
                    {selectedSchedule ? (
                      <div style={profileStyles.calendarSelectedCardStyle}>
                        <div style={profileStyles.calendarSelectedImageShellStyle}>
                          {getOutfitCoverUrl(selectedSchedule.outfit) ? (
                            <img
                              src={getOutfitCoverUrl(selectedSchedule.outfit) ?? ""}
                              alt={selectedSchedule.outfit?.name ?? "Scheduled outfit"}
                              style={profileStyles.calendarSelectedImageStyle}
                            />
                          ) : (
                            <span style={profileStyles.calendarSelectedFallbackStyle}>
                              {(selectedSchedule.outfit?.name ?? "Outfit")
                                .slice(0, 2)
                                .toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <strong style={profileStyles.calendarSelectedTitleStyle}>
                            {selectedSchedule.outfit?.name ?? "Untitled outfit"}
                          </strong>
                          <span style={profileStyles.calendarSelectedMetaStyle}>
                            Saved on{" "}
                            {new Date(
                              selectedSchedule.outfit?.updated_at ??
                                selectedSchedule.outfit?.created_at ??
                                selectedSchedule.schedule_date,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ) : currentSelectionOutfit ? (
                      <div style={profileStyles.calendarSelectedCardStyle}>
                        <div style={profileStyles.calendarSelectedImageShellStyle}>
                          {getOutfitCoverUrl(currentSelectionOutfit) ? (
                            <img
                              src={getOutfitCoverUrl(currentSelectionOutfit) ?? ""}
                              alt={currentSelectionOutfit.name ?? "Chosen outfit"}
                              style={profileStyles.calendarSelectedImageStyle}
                            />
                          ) : (
                            <span style={profileStyles.calendarSelectedFallbackStyle}>
                              {(currentSelectionOutfit.name ?? "Outfit")
                                .slice(0, 2)
                                .toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <strong style={profileStyles.calendarSelectedTitleStyle}>
                            {currentSelectionOutfit.name ?? "Untitled outfit"}
                          </strong>
                          <span style={profileStyles.calendarSelectedMetaStyle}>Ready to schedule</span>
                        </div>
                      </div>
                    ) : (
                      <span style={profileStyles.calendarPickerEmptyStyle}>
                        No outfit picked yet. Tap below to choose one.
                      </span>
                    )}
                  </div>
                  <div style={profileStyles.calendarPickerControlsStyle}>
                    <button
                      type="button"
                      onClick={handleToggleOutfitPicker}
                      style={{
                        ...profileStyles.calendarGhostButtonStyle,
                        ...(calendarSubmitting ? { opacity: 0.6, cursor: "not-allowed" } : {}),
                      }}
                      disabled={calendarSubmitting}
                    >
                      {showOutfitPicker ? "Close outfit list" : "Browse outfits"}
                    </button>
                  </div>
                  {showOutfitPicker && (
                    <div style={profileStyles.calendarPickerGridStyle}>
                      {outfits.length === 0 ? (
                        <span style={profileStyles.calendarPickerEmptyStyle}>
                          Save an outfit in your studio first.
                        </span>
                      ) : (
                        outfits.map((outfit) => {
                          const outfitIdValue = getOutfitId(outfit);
                          if (!outfitIdValue) {
                            return null;
                          }
                          const isActive =
                            calendarOutfitSelection === String(outfitIdValue) ||
                            selectedSchedule?.outfit?.outfit_id === outfitIdValue;
                          return (
                            <button
                              key={outfitIdValue}
                              type="button"
                              onClick={() => handleSelectOutfitForCalendar(outfit)}
                              style={{
                                ...profileStyles.calendarPickerCardStyle,
                                ...(isActive ? profileStyles.calendarPickerCardActiveStyle : {}),
                              }}
                              disabled={calendarSubmitting}
                            >
                              <div style={profileStyles.calendarPickerImageShellStyle}>
                                {getOutfitCoverUrl(outfit) ? (
                                  <img
                                    src={getOutfitCoverUrl(outfit) ?? ""}
                                    alt={outfit.name ?? "Outfit preview"}
                                    style={profileStyles.calendarPickerImageStyle}
                                  />
                                ) : (
                                  <span style={profileStyles.calendarPickerFallbackStyle}>
                                    {(outfit.name ?? "Outfit").slice(0, 2).toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <div style={profileStyles.calendarPickerCardMetaStyle}>
                                <strong>
                                  {outfit.name ?? `Outfit #${outfitIdValue}`}
                                </strong>
                                <span>
                                  Saved{" "}
                                  {new Date(
                                    outfit.updated_at ?? outfit.created_at ?? Date.now(),
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}
                  <div style={profileStyles.calendarActionRowStyle}>
                    <button
                      type="submit"
                      style={{
                        ...profileStyles.calendarPrimaryButtonStyle,
                        ...(calendarSubmitting || outfits.length === 0
                          ? { opacity: 0.6, cursor: "not-allowed" }
                          : {}),
                      }}
                      disabled={calendarSubmitting || outfits.length === 0}
                    >
                      {calendarSubmitting ? "Saving..." : "Save to calendar"}
                    </button>
                    {selectedSchedule && (
                      <button
                        type="button"
                        onClick={handleUnschedule}
                        style={{
                          ...profileStyles.calendarGhostButtonStyle,
                          ...(calendarSubmitting
                            ? { opacity: 0.6, cursor: "not-allowed" }
                            : {}),
                        }}
                        disabled={calendarSubmitting}
                      >
                        Clear day
                      </button>
                    )}
                  </div>
                </form>
                {calendarStatus && (
                  <div style={profileStyles.calendarStatusStyle}>{calendarStatus}</div>
                )}
                {calendarStatusError && (
                  <div style={profileStyles.calendarStatusErrorStyle}>{calendarStatusError}</div>
                )}
              </div>
            </div>
          </section>

          <section style={profileStyles.splitSectionStyle}>
            <div style={profileStyles.panelStyle}>
              <h2 style={profileStyles.panelTitleStyle}>Wardrobe Highlights</h2>
              <p style={profileStyles.panelSubtitleStyle}>
                A quick glance at your latest additions and go-to style themes.
              </p>
              <div style={profileStyles.highlightGridStyle}>
                <div style={profileStyles.highlightCardStyle}>
                  <span style={profileStyles.highlightLabelStyle}>Latest arrivals</span>
                  <div style={profileStyles.latestListStyle}>
                    {latestItems.length === 0 ? (
                      <span style={profileStyles.mutedTextStyle}>No items yet. Add your first piece!</span>
                    ) : (
                      latestItems.map((item) => (
                        <div key={item.item_id} style={profileStyles.latestItemStyle}>
                          <span
                            style={profileStyles.latestItemBulletStyle}
                            aria-hidden="true"
                          >
                            &bull;
                          </span>
                          <div>
                            <div style={profileStyles.latestItemTitleStyle}>{item.name}</div>
                            <div style={profileStyles.latestItemMetaStyle}>
                              {item.category} {" "}&bull;{" "}
                              {item.color ?? "No color"}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div style={profileStyles.highlightCardStyle}>
                  <span style={profileStyles.highlightLabelStyle}>Favorite tags</span>
                  <div style={profileStyles.favoriteTagWrapStyle}>
                    {favoriteTags.length === 0 ? (
                      <span style={profileStyles.mutedTextStyle}>
                        Tag pieces to group your styles faster.
                      </span>
                    ) : (
                      favoriteTags.map((tag) => (
                        <span key={tag.name} style={profileStyles.favoriteTagStyle}>
                          {tag.name} <small style={{ opacity: 0.75 }}>x{tag.count}</small>
                        </span>
                      ))
                    )}
                  </div>
                  <p style={profileStyles.favoriteTagHintStyle}>
                    Tags help you filter styles in seconds. Add them when uploading pieces.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section style={profileStyles.wardrobeSectionStyle}>
            <div style={profileStyles.sectionHeaderStyle}>
              <h2 style={profileStyles.panelTitleStyle}>Wardrobe gallery</h2>
              <p style={profileStyles.panelSubtitleStyle}>
                Every piece you&apos;ve captured, ready for remixing.
              </p>
            </div>
            <div style={profileStyles.wardrobeGridStyle}>
              {items.length === 0 ? (
                <div style={profileStyles.emptyPanelStyle}>
                  <p>No wardrobe items yet.</p>
                  <button
                    type="button"
                    onClick={handleNavigateDashboard}
                    style={profileStyles.primaryActionStyle}
                  >
                    Add your first piece
                  </button>
                </div>
              ) : (
                <>
                  {visibleWardrobeItems.map((item) => renderWardrobeCard(item))}
                  {items.length > LIST_PREVIEW_COUNT && (
                    <div style={profileStyles.showMoreRowStyle}>
                      <button
                        type="button"
                        onClick={() => setShowAllWardrobe((prev) => !prev)}
                        style={profileStyles.showMoreButtonStyle}
                      >
                        {showAllWardrobe
                          ? "Show fewer items"
                          : `Show more (${items.length - LIST_PREVIEW_COUNT})`}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          <section style={profileStyles.wardrobeSectionStyle}>
            <div style={profileStyles.sectionHeaderStyle}>
              <h2 style={profileStyles.panelTitleStyle}>Outfit showcase</h2>
              <p style={profileStyles.panelSubtitleStyle}>
                Your saved looks and public posts all in one place.
              </p>
            </div>
          {outfits.length === 0 ? (
            <div style={profileStyles.emptyPanelStyle}>
              <p>No outfits yet. Start creating combinations in your studio.</p>
              <button
                type="button"
                  onClick={handleNavigateDashboard}
                  style={profileStyles.secondaryActionStyle}
                >
                  Open outfit studio
                </button>
            </div>
          ) : (
            <div style={profileStyles.outfitGridStyle}>
              {visibleOutfits.map((outfit, index) => renderOutfitCard(outfit, index))}
              {outfits.length > LIST_PREVIEW_COUNT && (
                <div style={profileStyles.showMoreRowStyle}>
                  <button
                    type="button"
                    onClick={() => setShowAllOutfits((prev) => !prev)}
                    style={profileStyles.showMoreButtonStyle}
                  >
                    {showAllOutfits
                      ? "Show fewer outfits"
                      : `Show more (${outfits.length - LIST_PREVIEW_COUNT})`}
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

          <section style={profileStyles.wardrobeSectionStyle}>
            <div style={profileStyles.sectionHeaderStyle}>
              <h2 style={profileStyles.panelTitleStyle}>Liked outfits</h2>
              <p style={profileStyles.panelSubtitleStyle}>
                A collection of looks you&apos;ve saved from the community.
              </p>
            </div>
            {likedLoading ? (
              <div style={profileStyles.loadingStateStyle}>Loading liked outfits...</div>
            ) : likedError ? (
              <div style={profileStyles.errorBoxStyle}>{likedError}</div>
            ) : likedOutfits.length === 0 ? (
              <div style={profileStyles.emptyPanelStyle}>
                <p>
                  You haven&apos;t liked any outfits yet. Tap the heart on the feed to save your
                  favorites.
                </p>
                <button
                  type="button"
                  onClick={handleNavigateFeed}
                  style={profileStyles.primaryActionStyle}
                >
                  Browse outfits
                </button>
              </div>
            ) : (
              <div style={profileStyles.outfitGridStyle}>
                {visibleLikedOutfits.map((record, index) =>
                  renderLikedOutfitCard(record, index)
                )}
                {likedOutfits.length > LIST_PREVIEW_COUNT && (
                  <div style={profileStyles.showMoreRowStyle}>
                    <button
                      type="button"
                      onClick={() => setShowAllLiked((prev) => !prev)}
                      style={profileStyles.showMoreButtonStyle}
                    >
                      {showAllLiked
                        ? "Show fewer likes"
                        : `Show more (${likedOutfits.length - LIST_PREVIEW_COUNT})`}
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        </>
      )}
      {previewSchedule && (
        <div
          style={profileStyles.calendarPreviewOverlayStyle}
          onClick={() => setPreviewSchedule(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            style={profileStyles.calendarPreviewCardStyle}
            onClick={(event) => event.stopPropagation()}
          >
            <div style={profileStyles.calendarPreviewHeaderStyle}>
              <h3 style={profileStyles.calendarPreviewTitleStyle}>Scheduled outfit</h3>
              <button
                type="button"
                onClick={() => setPreviewSchedule(null)}
                style={profileStyles.calendarPreviewCloseStyle}
              >
                ✕
              </button>
            </div>
            <p style={profileStyles.calendarPreviewMetaStyle}>
              {new Date(previewSchedule.schedule_date).toLocaleDateString(undefined, {
                weekday: "long",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <div style={profileStyles.calendarPreviewImageShellStyle}>
              {getOutfitCoverUrl(previewSchedule.outfit) ? (
                <img
                  src={getOutfitCoverUrl(previewSchedule.outfit) ?? ""}
                  alt={previewSchedule.outfit?.name ?? "Scheduled outfit"}
                  style={profileStyles.calendarPreviewImageStyle}
                />
              ) : (
                <span style={profileStyles.calendarPreviewFallbackStyle}>
                  {(previewSchedule.outfit?.name ?? "Outfit").slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div style={profileStyles.calendarPreviewBodyStyle}>
              <strong>{previewSchedule.outfit?.name ?? "Untitled outfit"}</strong>
              <span>
                Added{" "}
                {new Date(
                  previewSchedule.outfit?.updated_at ??
                    previewSchedule.outfit?.created_at ??
                    previewSchedule.created_at ??
                    previewSchedule.schedule_date,
                ).toLocaleDateString()}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                handleSelectCalendarDate(getDateKey(previewSchedule.schedule_date));
                setPreviewSchedule(null);
              }}
              style={profileStyles.calendarPrimaryButtonStyle}
            >
              Plan something else
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
