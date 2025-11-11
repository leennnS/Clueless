import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  getPublicFeed,
  type FeedOutfit,
  type OutfitUser,
} from "../services/outfitService";
import {
  createComment,
  getCommentsForOutfit,
  type CommentRecord,
} from "../services/commentService";
import { toggleLike } from "../services/likeService";
import { feedStyles } from "../styles/feedStyles";

type NoticeType = "info" | "error";

interface Notice {
  id: number;
  type: NoticeType;
  text: string;
}

interface CommentPanelState {
  expanded: boolean;
  loading: boolean;
  error: string | null;
  comments: CommentRecord[];
}

const heroGradientPalette: [string, string] = ["#f8bbd0", "#c5cae9"];

const cardGradients = [
  ["#ffecd2", "#fcb69f"],
  ["#ff9a9e", "#fad0c4"],
  ["#a1c4fd", "#c2e9fb"],
  ["#d4fc79", "#96e6a1"],
  ["#f6d365", "#fda085"],
  ["#a18cd1", "#fbc2eb"],
];

const styles = feedStyles;



const pickGradient = (seed: number, palette: string[][]) => {
  if (!palette.length) {
    return ["#ec407a", "#ab47bc"];
  }
  return palette[Math.abs(seed) % palette.length];
};

const getInitials = (user?: OutfitUser | null) => {
  const source = user?.name ?? user?.username ?? "";
  const trimmed = source.trim();
  if (!trimmed) {
    return "??";
  }
  return trimmed
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
};

const resolveUserDisplayName = (user?: OutfitUser | null) => {
  if (!user) return "Anonymous";
  const name = [user.name, user.username].find(
    (value) => value && value.trim().length > 0,
  );
  return name?.trim() ?? "Anonymous";
};

const resolveUserHandle = (user?: OutfitUser | null) => {
  if (!user?.username) return "@stylist";
  return `@${user.username}`;
};

const formatRelativeTime = (isoDate?: string) => {
  if (!isoDate) return "just now";
  const createdAt = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - createdAt.getTime();
  if (Number.isNaN(diffMs)) return "just now";

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return createdAt.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

const createNotice = (() => {
  let counter = 0;
  return (type: NoticeType, text: string): Notice => ({
    id: ++counter,
    type,
    text,
  });
})();

/**
 * Community feed page showing public outfits, creator search, and comments panel.
 *
 * Preconditions:
 * - `useAuth` supplies viewer context for likes/comments (anonymous browsing still supported).
 *
 * Postconditions:
 * - Renders responsive cards, handles likes/comments, and links to creator profiles.
 */
export default function Feed() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const viewerId = user?.id ?? null;

  const [feed, setFeed] = useState<FeedOutfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notices, setNotices] = useState<Notice[]>([]);
  const [pendingLikes, setPendingLikes] = useState<Record<number, boolean>>({});
  const [commentPanels, setCommentPanels] = useState<
    Record<number, CommentPanelState>
  >({});
  const [newCommentText, setNewCommentText] = useState<Record<number, string>>(
    {},
  );
  const [submittingComments, setSubmittingComments] = useState<
    Record<number, boolean>
  >({});

  const heroGradient = heroGradientPalette;

  const uniqueCreators = useMemo(() => {
    const registry = new Map<number, OutfitUser>();
    feed.forEach((entry) => {
      const creator = entry.user;
      if (!creator?.user_id) {
        return;
      }
      if (!registry.has(creator.user_id)) {
        registry.set(creator.user_id, creator);
      }
    });
    return Array.from(registry.values());
  }, [feed]);

  const filteredCreatorResults = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (term.length === 0) {
      return [];
    }
    return uniqueCreators
      .filter((creator) => {
        const candidates = [
          creator.username,
          creator.name,
          creator.email,
        ].filter(Boolean) as string[];
        return candidates.some((value) =>
          value.toLowerCase().includes(term),
        );
      })
      .slice(0, 6);
  }, [searchTerm, uniqueCreators]);

  const profileInitials = useMemo(() => {
    if (user?.username) {
      return user.username
        .trim()
        .split(/\s+/)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("")
        .slice(0, 2);
    }
    const fallback = user?.email?.[0]?.toUpperCase();
    return fallback ?? "VC";
  }, [user]);

  const addNotice = useCallback((type: NoticeType, text: string) => {
    setNotices((prev) => [createNotice(type, text), ...prev].slice(0, 3));
  }, []);

  const handleOpenCreatorProfile = useCallback(
    (userId?: number) => {
      if (!userId) {
        addNotice("info", "This stylist profile isn't available yet.");
        return;
      }
      navigate(`/creators/${userId}`);
    },
    [addNotice, navigate],
  );

  const handleOpenProfile = useCallback(() => {
    navigate("/profile");
  }, [navigate]);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/login", { replace: true });
  }, [logout, navigate]);

  const loadFeed = useCallback(
    async (search?: string) => {
      setLoading(true);
      setError(null);
      try {
        const outfits = await getPublicFeed({
          search,
          viewerId: viewerId ?? undefined,
        });
        setFeed(outfits);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to load feed.";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [viewerId],
  );

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  const handleSearchSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = searchTerm.trim();
    await loadFeed(trimmed.length > 0 ? trimmed : undefined);
    if (trimmed.length === 0) {
      addNotice("info", "Showing the freshest community looks.");
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    loadFeed(undefined);
  };

  const ensureCommentPanel = useCallback(
    (outfitId: number) => {
      setCommentPanels((prev) => {
        if (prev[outfitId]) {
          return prev;
        }
        return {
          ...prev,
          [outfitId]: {
            expanded: false,
            loading: false,
            error: null,
            comments: [],
          },
        };
      });
    },
    [],
  );

  const handleToggleComments = async (outfitId: number) => {
    ensureCommentPanel(outfitId);
    setCommentPanels((prev) => {
      const current = prev[outfitId] ?? {
        expanded: false,
        loading: false,
        error: null,
        comments: [],
      };
      return {
        ...prev,
        [outfitId]: { ...current, expanded: !current.expanded },
      };
    });

    setCommentPanels((prev) => {
      const current = prev[outfitId];
      if (!current || current.comments.length > 0 || current.loading) {
        return prev;
      }
      return {
        ...prev,
        [outfitId]: { ...current, loading: true, error: null },
      };
    });

    try {
      const comments = await getCommentsForOutfit(outfitId);
      setCommentPanels((prev) => {
        const current = prev[outfitId];
        if (!current) {
          return prev;
        }
        return {
          ...prev,
          [outfitId]: { ...current, comments, loading: false },
        };
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to load comments.";
      setCommentPanels((prev) => {
        const current = prev[outfitId];
        if (!current) {
          return prev;
        }
        return {
          ...prev,
          [outfitId]: { ...current, loading: false, error: message },
        };
      });
    }
  };

  const handleToggleLike = async (outfitId: number) => {
    if (!viewerId) {
      addNotice("info", "Sign in to show this look some love.");
      return;
    }
    setPendingLikes((prev) => ({ ...prev, [outfitId]: true }));
    try {
      const response = await toggleLike(viewerId, outfitId);
      setFeed((prev) =>
        prev.map((outfit) => {
          if (outfit.outfit_id !== outfitId) {
            return outfit;
          }
          const liked = response.liked;
          const likeCount = outfit.like_count ?? 0;
          return {
            ...outfit,
            liked_by_viewer: liked,
            like_count: liked ? likeCount + 1 : Math.max(likeCount - 1, 0),
          };
        }),
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to update like.";
      addNotice("error", message);
    } finally {
      setPendingLikes((prev) => {
        const next = { ...prev };
        delete next[outfitId];
        return next;
      });
    }
  };

  const handleCommentSubmit = async (outfitId: number) => {
    if (!viewerId) {
      addNotice("info", "Sign in to join the conversation.");
      return;
    }
    const trimmed = (newCommentText[outfitId] ?? "").trim();
    if (!trimmed) {
      addNotice("info", "Add a quick note before posting.");
      return;
    }
    setSubmittingComments((prev) => ({ ...prev, [outfitId]: true }));
    try {
      const comment = await createComment({
        outfit_id: outfitId,
        user_id: viewerId,
        comment_text: trimmed,
      });
      setCommentPanels((prev) => {
        const current = prev[outfitId] ?? {
          expanded: true,
          loading: false,
          error: null,
          comments: [],
        };
        return {
          ...prev,
          [outfitId]: {
            ...current,
            comments: [comment, ...current.comments],
            error: null,
            expanded: true,
          },
        };
      });
      setNewCommentText((prev) => ({ ...prev, [outfitId]: "" }));
      setFeed((prev) =>
        prev.map((outfit) => {
          if (outfit.outfit_id !== outfitId) {
            return outfit;
          }
          return {
            ...outfit,
            comment_count: (outfit.comment_count ?? 0) + 1,
          };
        }),
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to post comment.";
      addNotice("error", message);
    } finally {
      setSubmittingComments((prev) => {
        const next = { ...prev };
        delete next[outfitId];
        return next;
      });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.inner}>

        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <Link to="/" style={styles.brand}>
              virtual closet
            </Link>
            <nav style={styles.nav}>
              <Link to="/dashboard" style={styles.navLink}>
                <span aria-hidden="true">{"\u2728"}</span>
                Studio
              </Link>
              <Link
                to="/feed"
                style={{ ...styles.navLink, ...styles.navLinkActive }}
              >
                <span aria-hidden="true">{"\u{1F4F8}"}</span>
                Feed
              </Link>
            </nav>
          </div>
          <div style={styles.headerActions}>
            <div style={styles.profileWrapper}>
              <button
                type="button"
                onClick={handleOpenProfile}
                style={styles.profileSummaryButton}
              >
                <div style={styles.profileAvatar}>
                  {user?.profile_image_url ? (
                    <img
                      src={user.profile_image_url}
                      alt={`${user?.username ?? "Profile"} avatar`}
                      style={styles.profileAvatarImage}
                    />
                  ) : (
                    profileInitials
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                  <span style={{ fontWeight: 600, color: "#303039" }}>
                    {user?.username ?? "Guest stylist"}
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "#777" }}>
                    {user?.email ?? "Sign in to personalize"}
                  </span>
                </div>
              </button>
              <button type="button" style={styles.logoutButton} onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </header>

        <section
          style={{
            ...styles.hero,
            background: `linear-gradient(135deg, ${heroGradient[0]}, ${heroGradient[1]})`,
          }}
        >
          <h1 style={styles.heroTitle}>Discover the community feed</h1>
          <p style={styles.heroBody}>
            Peek at fresh looks from stylists across the closet, save ideas, and
            leave a kind note when something inspires you.
          </p>
          <form style={styles.searchForm} onSubmit={handleSearchSubmit}>
            <input
              type="search"
              placeholder="Search outfit titles or creators"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              style={styles.searchInput}
            />
            <button type="submit" style={styles.primaryButton}>
              Search
            </button>
            <button
              type="button"
              onClick={handleClearSearch}
              style={styles.clearButton}
            >
              Clear
            </button>
          </form>
          {searchTerm.trim().length > 0 && (
            <div style={styles.creatorSearchResults}>
              {filteredCreatorResults.length === 0 ? (
                <span style={styles.creatorSearchEmpty}>
                  No stylists found yet.
                </span>
              ) : (
                filteredCreatorResults.map((creator) => (
                  <button
                    key={creator.user_id}
                    type="button"
                    onClick={() => handleOpenCreatorProfile(creator.user_id)}
                    style={styles.creatorResultButton}
                  >
                    <span aria-hidden="true" style={{ fontSize: "1.2rem" }}>
                      {"\u{1F464}"}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "2px",
                      }}
                    >
                      <span style={styles.creatorResultName}>
                        {resolveUserDisplayName(creator)}
                      </span>
                      <span style={styles.creatorResultHandle}>
                        {resolveUserHandle(creator)}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </section>

        {notices.map((notice) => (
          <div
            key={notice.id}
            style={{
              ...styles.notice,
              background:
                notice.type === "error"
                  ? "rgba(244, 67, 54, 0.14)"
                  : "rgba(76, 175, 80, 0.12)",
              color: notice.type === "error" ? "#c62828" : "#2e7d32",
            }}
          >
            {notice.text}
          </div>
        ))}

        {error && <div style={styles.errorBox}>{error}</div>}

        {loading ? (
          <div style={styles.loading}>Styling your feed...</div>
        ) : feed.length === 0 ? (
          <div style={styles.emptyState}>
            No looks matched your search just yet. Try another keyword or check
            again soon.
          </div>
        ) : (
          <div style={styles.feedGrid}>
            {feed.map((outfit) => {
              const gradient = pickGradient(outfit.outfit_id, cardGradients);
              const panel = commentPanels[outfit.outfit_id] ?? {
                expanded: false,
                loading: false,
                error: null,
                comments: [],
              };
              const likePending = pendingLikes[outfit.outfit_id] ?? false;
              const commentPending =
                submittingComments[outfit.outfit_id] ?? false;
              const likeButtonStyle: CSSProperties = {
                ...styles.actionButton,
                background: outfit.liked_by_viewer
                  ? "rgba(236,64,122,0.18)"
                  : "rgba(32,26,53,0.06)",
                color: outfit.liked_by_viewer ? "#d81b60" : "#322f3d",
                border: outfit.liked_by_viewer
                  ? "1px solid rgba(236,64,122,0.35)"
                  : "1px solid rgba(50,47,61,0.1)",
                opacity: likePending ? 0.6 : 1,
              };
              const commentButtonStyle: CSSProperties = {
                ...styles.actionButton,
                background: "rgba(32,26,53,0.05)",
                border: "1px solid rgba(50,47,61,0.1)",
              };

              return (
                <div key={outfit.outfit_id} style={styles.card}>
                  <button
                    type="button"
                    onClick={() =>
                      handleOpenCreatorProfile(outfit.user?.user_id)
                    }
                    style={styles.creatorRow}
                  >
                    <div
                      style={{
                        ...styles.avatar,
                        background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
                      }}
                    >
                      {getInitials(outfit.user)}
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          color: "#2f2f3a",
                          fontSize: "1.05rem",
                        }}
                      >
                        {resolveUserDisplayName(outfit.user)}
                      </div>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          color: "#7a7785",
                          display: "flex",
                          gap: "8px",
                        }}
                      >
                        <span>{resolveUserHandle(outfit.user)}</span>
                        <span>{"\u00B7"}</span>
                        <span>{formatRelativeTime(outfit.created_at)}</span>
                      </div>
                    </div>
                  </button>

                  <div
                    style={{
                      ...styles.cover,
                      background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
                    }}
                  >
                    {outfit.cover_image_url ? (
                      <img
                        src={outfit.cover_image_url}
                        alt={outfit.name ?? "Outfit collage"}
                        style={styles.coverImage}
                      />
                    ) : (
                      <div style={styles.coverFallback}>
                        {outfit.name?.trim() || "Public Outfit"}
                      </div>
                    )}
                    <div
                      style={{
                        position: "absolute",
                        inset: "12px",
                        borderRadius: "20px",
                        border: "1px solid rgba(255,255,255,0.18)",
                        pointerEvents: "none",
                      }}
                    />
                  </div>

                  <div>
                    <h2 style={styles.cardTitle}>
                      {outfit.name?.trim() || "Untitled Outfit"}
                    </h2>
                    <p style={styles.cardBody}>
                      Show some love to this look or let the creator know what
                      you adore most about it.
                    </p>
                  </div>

                  <div style={styles.actionRow}>
                    <button
                      type="button"
                      onClick={() => handleToggleLike(outfit.outfit_id)}
                      disabled={likePending}
                      style={likeButtonStyle}
                    >
                      <span
                        aria-hidden="true"
                        style={{ fontSize: "1rem", lineHeight: 1 }}
                      >
                        {outfit.liked_by_viewer ? "\u2665" : "\u2661"}
                      </span>
                      <span>
                        {outfit.liked_by_viewer ? "Loved" : "Love this"}{" "}
                        {"\u00B7"} {outfit.like_count ?? 0}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleComments(outfit.outfit_id)}
                      style={commentButtonStyle}
                    >
                      <span
                        aria-hidden="true"
                        style={{ fontSize: "1rem", lineHeight: 1 }}
                      >
                        {"\u{1F4AC}"}
                      </span>
                      <span>
                        {panel.expanded ? "Hide" : "View"} comments {"\u00B7"}{" "}
                        {outfit.comment_count ?? 0}
                      </span>
                    </button>
                  </div>

                  {panel.expanded && (
                    <div style={styles.commentPanel}>
                      <div>
                        <textarea
                          value={newCommentText[outfit.outfit_id] ?? ""}
                          onChange={(event) =>
                            setNewCommentText((prev) => ({
                              ...prev,
                              [outfit.outfit_id]: event.target.value,
                            }))
                          }
                          placeholder={
                            viewerId
                              ? "Share a quick thought about this fit..."
                              : "Sign in to join the conversation."
                          }
                          rows={2}
                          style={styles.commentInput}
                          disabled={!viewerId || commentPending}
                        />
                        <div
                          style={{
                            marginTop: "12px",
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => handleCommentSubmit(outfit.outfit_id)}
                            disabled={!viewerId || commentPending}
                            style={{
                              ...styles.primaryButton,
                              padding: "10px 20px",
                              opacity: viewerId ? 1 : 0.6,
                              cursor: viewerId ? "pointer" : "not-allowed",
                            }}
                          >
                            {commentPending ? "Posting..." : "Post"}
                          </button>
                        </div>
                      </div>

                      {panel.loading && (
                        <div
                          style={{
                            color: "#5b5b66",
                            fontWeight: 500,
                            fontSize: "0.95rem",
                          }}
                        >
                          Loading comments...
                        </div>
                      )}

                      {panel.error && (
                        <div
                          style={{
                            color: "#c62828",
                            fontWeight: 500,
                            fontSize: "0.95rem",
                          }}
                        >
                          {panel.error}
                        </div>
                      )}

                      {!panel.loading &&
                        panel.comments.length === 0 &&
                        !panel.error && (
                          <div
                            style={{
                              color: "#6b6879",
                              fontWeight: 500,
                              fontSize: "0.9rem",
                            }}
                          >
                            No comments yet. Be the first to share some love.
                          </div>
                        )}

                      {panel.comments.map((comment) => (
                        <div key={comment.comment_id} style={styles.commentItem}>
                          <div style={styles.commentMeta}>
                            <span style={{ fontWeight: 600 }}>
                              {resolveUserDisplayName(comment.user)}
                            </span>
                            <span>{formatRelativeTime(comment.created_at)}</span>
                          </div>
                          <p style={styles.commentText}>
                            {comment.comment_text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
