import { Link } from "react-router-dom";

import WeatherWidget from "../components/WeatherWidget";
import { useHomeCarousel } from "../hooks/useHomeCarousel";
import { homeStyles } from "../styles/homeStyles";

const sparkles = [
  {
    key: "sparkle-left",
    content: "\u2726",
    style: { top: "0px", left: "-10px", width: "46px", height: "46px" },
    delay: "0.4s",
  },
  {
    key: "sparkle-right",
    content: "\u2727",
    style: { top: "70px", right: "-25px", width: "38px", height: "38px" },
    delay: "1s",
  },
  {
    key: "sparkle-bottom",
    content: "\u2749",
    style: { bottom: "10px", left: "30px", width: "42px", height: "42px" },
    delay: "1.8s",
  },
  {
    key: "sparkle-upper-right",
    content: "\u273A",
    style: { top: "-20px", right: "70px", width: "36px", height: "36px" },
    delay: "2.2s",
  },
];

/**
 * Landing page that highlights feature cards and surfaces a mini outfit carousel.
 *
 * Preconditions:
 * - Weather/feed hooks are not required; this page only relies on static assets and client-side storage.
 *
 * Postconditions:
 * - Renders hero section with CTA buttons and carousel fed by `useOutfits` hook.
 */
export default function Home() {
  const {
    loading,
    error,
    refetch,
    hasOutfits,
    cards,
    imageLoading,
    imageError,
    showCounter,
    counterText,
    handleCardClick,
  } = useHomeCarousel();

  return (
    <div style={homeStyles.pageContainer}>
      <div style={homeStyles.weatherWrapper}>
        <WeatherWidget />
      </div>

      <div style={homeStyles.contentLayout}>
        <div style={homeStyles.introCard}>
          <h1 style={homeStyles.title}>
            Clueless
            <span role="img" aria-label="kiss" style={homeStyles.titleEmoji}>
              💋
            </span>
          </h1>
          <h2 style={homeStyles.subtitle}>Your Virtual Closet</h2>
          <p style={homeStyles.description}>
            Your personal fashion assistant—organize, style, and share your looks effortlessly.
          </p>

          <div style={homeStyles.ctaRow}>
            <Link to="/login" style={homeStyles.primaryButton}>
              Get Started
            </Link>
          </div>
        </div>

        <div style={homeStyles.sceneWrapper}>
          <style>
            {`
              @keyframes float {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                50% { transform: translateY(-20px) rotate(5deg); }
              }

              @keyframes gentleFloat {
                0%, 100% { transform: translateY(0) }
                50% { transform: translateY(-12px) }
              }

              .floating-outfit-card {
                animation: gentleFloat 6s ease-in-out infinite;
              }
            `}
          </style>

          <div className="closet-scene" style={homeStyles.closetScene}>
            <div
              style={homeStyles.backgroundFrame}
            />

            <div
              className="carousel-wrapper"
              style={homeStyles.carouselWrapper}
            >
              {loading && (
                <p style={homeStyles.statusText}>Loading outfits...</p>
              )}

              {!loading && error && (
                <div style={homeStyles.errorState}>
                  <p style={homeStyles.errorText}>{error}</p>
                  <button
                    type="button"
                    style={homeStyles.retryButton}
                    onClick={() => {
                      refetch().catch(() => undefined);
                    }}
                  >
                    Try again
                  </button>
                </div>
              )}

              {!loading && !error && hasOutfits && (
                cards.map((card) => {
                  const imageSrc = card.primaryImage;

                  let transform = "";
                  let opacity = 1;
                  let zIndex = 10;
                  let filter = "none";

                  if (card.position === "left") {
                    transform = "translateX(-110%) scale(0.75)";
                    opacity = 0.6;
                    zIndex = 5;
                    filter = "blur(3px) brightness(0.85)";
                  } else if (card.position === "right") {
                    transform = "translateX(110%) scale(0.75)";
                    opacity = 0.6;
                    zIndex = 5;
                    filter = "blur(3px) brightness(0.85)";
                  } else {
                    transform = "translateX(0) scale(1)";
                    opacity = 1;
                    zIndex = 15;
                    filter = "none";
                  }

                  return (
                    <div
                      key={card.key}
                      className="carousel-card"
                      style={{
                        ...homeStyles.carouselCard,
                        width: card.isCenter ? "220px" : "180px",
                        minHeight: card.isCenter ? "260px" : "220px",
                        boxShadow: card.isCenter
                          ? "0 15px 30px rgba(0,0,0,0.25)"
                          : "0 8px 20px rgba(0,0,0,0.15)",
                        transform,
                        opacity,
                        zIndex,
                        filter,
                      }}
                      onClick={() => handleCardClick(card)}
                    >
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt={card.displayName}
                          style={{
                            ...homeStyles.carouselImage,
                            height: card.isCenter ? "130px" : "110px",
                            filter: card.isCenter ? "none" : "blur(1.5px)",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            ...homeStyles.carouselImageFallback,
                            height: card.isCenter ? "130px" : "110px",
                          }}
                        >
                          No image available
                        </div>
                      )}

                      {card.isCenter && imageLoading && (
                        <p style={homeStyles.loadingHint}>Loading outfit photo...</p>
                      )}

                      {card.isCenter && !imageLoading && imageError && (
                        <p style={homeStyles.errorHint}>{imageError}</p>
                      )}

                      <p
                        style={{
                          ...homeStyles.cardTitle,
                          fontSize: card.isCenter ? "14px" : "12px",
                          color: card.accentColor,
                        }}
                      >
                        {card.displayName} {card.emoji}
                      </p>

                      <p style={homeStyles.cardOwner}>by {card.displayOwner}</p>
                    </div>
                  );
                })
              )}

              {!loading && !error && !hasOutfits && (
                <p style={homeStyles.emptyState}>
                  No outfits yet. Add your first look to get started.
                </p>
              )}
            </div>

            {showCounter && counterText && (
              <div style={homeStyles.counterBadge}>{counterText}</div>
            )}

            {sparkles.map((sparkle) => (
              <div
                key={sparkle.key}
                className="floating-item"
                style={{
                  ...homeStyles.sparkleBase,
                  animationDelay: sparkle.delay,
                  ...sparkle.style,
                }}
              >
                {sparkle.content}
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}
