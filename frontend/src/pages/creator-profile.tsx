import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { fetchCreatorProfileThunk } from "../store/users/usersSlice";
import { fetchUserOutfitsThunk } from "../store/outfits/outfitsSlice";
import type { ClothingItem, Outfit, User } from "../types/models";
import { creatorProfileStyles } from "../styles/creatorProfileStyles";

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "http://localhost:3000";

const normalizeApiBase = (base: string) =>
  base.endsWith("/") ? base.slice(0, -1) : base;

const toAbsoluteImageUrl = (path?: string | null) => {
  if (!path) return null;
  if (/^https?:\/\//i.test(path) || path.startsWith("data:")) {
    return path;
  }
  const base = normalizeApiBase(API_BASE_URL);
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
};

const pageStyles = creatorProfileStyles;



const getDisplayName = (profile?: User | null) => {
  if (!profile) return "Stylist";
  return profile.username || profile.email || "Stylist";
};

const getHandle = (profile?: User | null) => {
  if (!profile?.username) return "";
  return `@${profile.username}`;
};

const getInitials = (profile?: User | null) => {
  const source = profile?.username ?? profile?.email ?? "";
  const trimmed = source.trim();
  if (!trimmed) return "SC";
  return trimmed
    .split(/\s+/)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase() ?? "")
    .join("");
};

const formatDisplayDate = (iso?: string | null) => {
  if (!iso) return "Recently styled";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "Recently styled";
  }
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Public-facing creator profile that showcases another stylist's outfits and wardrobe samples.
 *
 * Preconditions:
 * - `userId` param must be present and numeric.
 *
 * Postconditions:
 * - Fetches creator metadata + public outfits and renders them with the shared nav bar.
 */
export default function CreatorProfile() {
  const navigate = useNavigate();
  const { userId: userIdParam } = useParams<{ userId: string }>();
  const { user: viewer, logout } = useAuth();
  const dispatch = useAppDispatch();

  const creatorId = useMemo(() => {
    if (!userIdParam) return null;
    const parsed = Number(userIdParam);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }, [userIdParam]);

  const [profile, setProfile] = useState<User | null>(null);
  const [publicOutfits, setPublicOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const viewerInitials = useMemo(() => {
    if (viewer?.username) {
      return viewer.username
        .trim()
        .split(/\s+/)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("")
        .slice(0, 2);
    }
    return viewer?.email?.[0]?.toUpperCase() ?? "VC";
  }, [viewer]);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/login", { replace: true });
  }, [logout, navigate]);

  const handleOpenViewerProfile = useCallback(() => {
    navigate("/profile");
  }, [navigate]);

  useEffect(() => {
    if (!creatorId) {
      setError("We couldn't find that stylist.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [profileResponse, outfitsResponse] = await Promise.all([
          dispatch(fetchCreatorProfileThunk(creatorId)).unwrap(),
          dispatch(fetchUserOutfitsThunk(creatorId)).unwrap().catch(() => []),
        ]);

        if (cancelled) {
          return;
        }

        const safeOutfits = (outfitsResponse ?? []).filter(
          (outfit) => outfit.is_public === true,
        );

        setProfile(profileResponse);
        setPublicOutfits(safeOutfits);
      } catch (err) {
        if (cancelled) {
          return;
        }
        const message =
          err instanceof Error ? err.message : "Unable to load creator profile.";
        setError(message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [creatorId, dispatch]);

  const wardrobeShowcase = useMemo<ClothingItem[]>(() => {
    return (profile?.clothing_items ?? []).slice(0, 6);
  }, [profile]);

  if (loading) {
    return (
      <div style={pageStyles.container}>
        <div style={pageStyles.inner}>
          <div style={pageStyles.loading}>Gathering outfit inspo...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={pageStyles.container}>
        <div style={pageStyles.inner}>
          <Link to="/feed" style={pageStyles.backLink}>
            {"\u2190"} Back to feed
          </Link>
          <div style={pageStyles.errorBox}>{error}</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={pageStyles.container}>
        <div style={pageStyles.inner}>
          <div style={pageStyles.errorBox}>
            We couldn't find details for this stylist.
          </div>
          <Link to="/feed" style={pageStyles.backLink}>
            {"\u2190"} Return to feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyles.container}>
      <div style={pageStyles.inner}>
        <header style={pageStyles.navHeader}>
          <div style={pageStyles.headerLeft}>
            <Link to="/" style={pageStyles.brand}>
              virtual closet
            </Link>
            <nav style={pageStyles.nav}>
              <Link to="/dashboard" style={pageStyles.navLink}>
                <span aria-hidden="true">{"\u2728"}</span>
                Studio
              </Link>
              <Link
                to="/feed"
                style={{ ...pageStyles.navLink, ...pageStyles.navLinkActive }}
              >
                <span aria-hidden="true">{"\u{1F4F8}"}</span>
                Feed
              </Link>
            </nav>
          </div>
          <div style={pageStyles.headerActions}>
            <div style={pageStyles.navProfileWrapper}>
              <button
                type="button"
                onClick={handleOpenViewerProfile}
                style={pageStyles.navProfileButton}
              >
                <div style={pageStyles.navProfileAvatar}>
                  {viewer?.profile_image_url ? (
                    <img
                      src={viewer.profile_image_url}
                      alt={`${viewer?.username ?? "Profile"} avatar`}
                      style={pageStyles.navProfileAvatarImage}
                    />
                  ) : (
                    viewerInitials
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                  <span style={{ fontWeight: 600, color: "#303039" }}>
                    {viewer?.username ?? "Guest stylist"}
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "#777" }}>
                    {viewer?.email ?? "Sign in to personalize"}
                  </span>
                </div>
              </button>
              <button
                type="button"
                style={pageStyles.navLogoutButton}
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <header style={pageStyles.header}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              border: "none",
              background: "transparent",
              color: "#ec407a",
              fontWeight: 600,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {"\u2190"} Back
          </button>
          <Link to="/feed" style={pageStyles.backLink}>
            Explore feed
          </Link>
        </header>

        <section style={pageStyles.hero}>
          <div style={pageStyles.heroTopRow}>
            <div style={pageStyles.avatar}>{getInitials(profile)}</div>
            <div style={pageStyles.heroText}>
              <h1 style={pageStyles.heroName}>{getDisplayName(profile)}</h1>
              {getHandle(profile) && (
                <p style={pageStyles.heroHandle}>{getHandle(profile)}</p>
              )}
            </div>
          </div>
          <div style={pageStyles.statsRow}>
            <div style={pageStyles.statCard}>
              <span style={pageStyles.statLabel}>Public outfits</span>
              <span style={pageStyles.statValue}>{publicOutfits.length}</span>
            </div>
            <div style={pageStyles.statCard}>
              <span style={pageStyles.statLabel}>Wardrobe pieces</span>
              <span style={pageStyles.statValue}>
                {profile.clothing_items?.length ?? 0}
              </span>
            </div>
          </div>
        </section>

        <section style={pageStyles.section}>
          <h2 style={pageStyles.sectionTitle}>Public outfits</h2>
          {publicOutfits.length === 0 ? (
            <div style={pageStyles.emptyState}>
              This stylist hasn&apos;t shared any public looks yet.
            </div>
          ) : (
            <div style={pageStyles.outfitGrid}>
              {publicOutfits.map((outfit, index) => {
                const coverUrl = toAbsoluteImageUrl(outfit.cover_image_url);
                return (
                  <div
                    key={outfit.outfit_id ?? `outfit-${index}`}
                    style={pageStyles.outfitCard}
                  >
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt={outfit.name ?? "Shared outfit"}
                        style={pageStyles.outfitCover}
                      />
                    ) : (
                      <div
                        style={{
                          ...pageStyles.outfitCover,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#d81b60",
                          fontWeight: 600,
                        }}
                      >
                        {outfit.name ?? "Styled look"}
                      </div>
                    )}
                    <div style={pageStyles.outfitBody}>
                      <h3 style={pageStyles.outfitName}>
                        {outfit.name ?? "Styled look"}
                      </h3>
                      <p style={pageStyles.outfitMeta}>
                        Posted{" "}
                        {formatDisplayDate(outfit.updated_at ?? outfit.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section style={pageStyles.section}>
          <h2 style={pageStyles.sectionTitle}>Wardrobe highlights</h2>
          {wardrobeShowcase.length === 0 ? (
            <div style={pageStyles.emptyState}>
              Wardrobe pieces are still coming soon.
            </div>
          ) : (
            <div style={pageStyles.wardrobeStrip}>
              {wardrobeShowcase.map((item) => {
                const itemImageUrl = toAbsoluteImageUrl(item.image_url);
                return (
                  <div key={item.item_id} style={pageStyles.wardrobeCard}>
                    <div style={pageStyles.wardrobeImageShell}>
                      {itemImageUrl ? (
                        <img
                          src={itemImageUrl}
                          alt={item.name}
                          style={pageStyles.wardrobeImage}
                        />
                      ) : (
                        <div style={pageStyles.wardrobeFallback}>
                          {item.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <p style={pageStyles.wardrobeName}>{item.name}</p>
                      <p style={pageStyles.wardrobeMeta}>{item.category}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
