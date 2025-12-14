import type { CSSProperties } from "react";

const CANVAS_WIDTH = 520;
const CANVAS_HEIGHT = 640;

export const containerStyle: CSSProperties = {
  minHeight: "100vh",
  width: "100%",
  background: "linear-gradient(135deg, #f8bbd0 0%, #fbe9e7 100%)",
  padding: "32px 40px 48px",
  boxSizing: "border-box",
  fontFamily: "'Poppins', sans-serif",
  position: "relative",
  overflowX: "hidden",
  overflowY: "auto",
};

export const headerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "24px",
  gap: "24px",
  flexWrap: "wrap",
  position: "relative",
  zIndex: 2,
};

export const headerIntroStyle: CSSProperties = {
  flex: "1 1 280px",
  minWidth: "260px",
  order: 1,
};

export const studioTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "1.8rem",
  color: "#2f2f3a",
  whiteSpace: "nowrap",
};

export const headerSubtitleStyle: CSSProperties = {
  margin: "6px 0 0",
  color: "#6f6f7a",
  fontSize: "0.95rem",
};

export const headerActionsRowStyle: CSSProperties = {
  marginTop: "14px",
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
};

export const headerCenterStackStyle: CSSProperties = {
  flex: "0 0 auto",
  order: 2,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
  textAlign: "center",
  marginTop: "-28px",
  marginBottom: "0px",
  alignSelf: "center",
  zIndex: 3,
};

export const weatherCardStyle: CSSProperties = {
  background: "transparent",
  borderRadius: "0px",
  padding: 0,
  boxShadow: "none",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  maxWidth: "420px",
  margin: "0 auto",
};

export const likeNotificationStyle: CSSProperties = {
  background: "rgba(236,64,122,0.12)",
  borderRadius: "18px",
  padding: "10px 14px",
  display: "flex",
  gap: "12px",
  alignItems: "center",
  boxShadow: "0 18px 36px rgba(236,64,122,0.18)",
  maxWidth: "280px",
  border: "none",
  cursor: "pointer",
  textAlign: "left",
};

export const likeNotificationHeartStyle: CSSProperties = {
  fontSize: "1.5rem",
  animation: "heartPulse 1.6s ease-in-out infinite",
};

export const likeNotificationBodyStyle: CSSProperties = {
  margin: "2px 0 0",
  fontSize: "0.85rem",
  color: "#6f6f7a",
};

export const sparkleLayerStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  zIndex: 1,
};

export const sparkleStyle: CSSProperties = {
  position: "absolute",
  color: "rgba(255,255,255,0.92)",
  animation: "sparkleFloat 3.2s ease-in-out infinite",
};

export const heartFloatStyle: CSSProperties = {
  position: "absolute",
  top: "80px",
  fontSize: "1.2rem",
  color: "#ec407a",
  animation: "heartDrift 2.6s ease-in-out infinite",
  opacity: 0.85,
};

export const profileWrapperStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  background: "rgba(255,255,255,0.9)",
  padding: "6px 12px",
  borderRadius: "999px",
  boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
  order: 1,
  marginLeft: "auto",
};

export const profileSummaryButtonStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  padding: 0,
  minWidth: 0,
};

export const profileAvatarStyle: CSSProperties = {
  width: "38px",
  height: "38px",
  borderRadius: "50%",
  background: "#ec407a",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 600,
  letterSpacing: "0.03em",
  overflow: "hidden",
  border: "2px solid rgba(255,255,255,0.8)",
};

export const profileAvatarImageStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

export const logoutButtonStyle: CSSProperties = {
  border: "none",
  background: "#ff7775",
  color: "white",
  borderRadius: "999px",
  padding: "4px 12px",
  fontSize: "0.85rem",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 4px 10px rgba(255,119,117,0.3)",
};

export const mainLayoutStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(300px, 25vw) minmax(540px, 1fr) minmax(300px, 24vw)",
  gap: "24px",
  alignItems: "start",
};

export const panelHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
};

export const inventorySectionStyle: CSSProperties = {
  background: "rgba(255,255,255,0.85)",
  borderRadius: "24px",
  padding: "22px",
  boxShadow: "0 14px 30px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
  alignSelf: "flex-start",
};

export const inventoryListStyle: CSSProperties = {
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  paddingRight: "6px",
  maxHeight: "calc(100vh - 220px)",
  flex: 1,
  minHeight: 0,
};

export const inventoryCardStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(255,255,255,0.95)",
  borderRadius: "18px",
  padding: "4px",
  cursor: "grab",
  boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  minHeight: "132px",
  width: "100%",
};

export const inventoryImageWrapperStyle: CSSProperties = {
  width: "112px",
  height: "112px",
  borderRadius: "16px",
  overflow: "hidden",
  background: "rgba(236,64,122,0.12)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

export const fallbackThumbnailStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 600,
  color: "#ec407a",
  fontSize: "1.4rem",
};

export const infoTextStyle: CSSProperties = {
  fontSize: "0.9rem",
  color: "#666",
};

export const refreshButtonStyle: CSSProperties = {
  border: "none",
  background: "rgba(236,64,122,0.15)",
  color: "#ec407a",
  borderRadius: "999px",
  padding: "6px 14px",
  fontWeight: 600,
  cursor: "pointer",
  fontSize: "0.82rem",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  height: "30px",
};

export const wardrobeControlsStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  flexWrap: "wrap",
};

export const wardrobeCategoryTabsStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
  marginTop: "12px",
  marginBottom: "12px",
  overflowX: "auto",
  padding: "0 2px 6px",
  scrollbarWidth: "thin",
  WebkitOverflowScrolling: "touch",
};

export const wardrobeCategoryTabButtonStyle: CSSProperties = {
  border: "none",
  background: "rgba(236,64,122,0.12)",
  color: "#ec407a",
  borderRadius: "50%",
  width: "48px",
  height: "48px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  boxShadow: "0 6px 12px rgba(236,64,122,0.16)",
  flex: "0 0 auto",
};

export const wardrobeCategoryTabButtonActiveStyle: CSSProperties = {
  background: "#ec407a",
  color: "white",
  transform: "translateY(-2px)",
  boxShadow: "0 10px 20px rgba(236,64,122,0.35)",
};

export const srOnlyStyle: CSSProperties = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

export const wardrobeAddButtonStyle: CSSProperties = {
  width: "30px",
  height: "30px",
  borderRadius: "50%",
  border: "none",
  background: "#ec407a",
  color: "white",
  fontSize: "1rem",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 8px 18px rgba(236,64,122,0.35)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: "1",
};

export const wardrobeSearchInputStyle: CSSProperties = {
  borderRadius: "999px",
  border: "1px solid rgba(0,0,0,0.12)",
  padding: "6px 14px",
  fontSize: "0.85rem",
  minWidth: "160px",
  background: "rgba(255,255,255,0.9)",
  height: "32px",
};

export const inventoryEmptyStateStyle: CSSProperties = {
  padding: "24px 12px",
  textAlign: "center",
  color: "#6b6879",
  fontSize: "0.9rem",
};

export const addItemDialogBodyStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};

export const addItemInputStyle: CSSProperties = {
  borderRadius: "10px",
  border: "1px solid rgba(0,0,0,0.12)",
  padding: "10px 12px",
  fontSize: "0.95rem",
};

export const addItemTagGridStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  maxHeight: "160px",
  overflowY: "auto",
};

export const addItemTagOptionStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: "6px 10px",
  borderRadius: "999px",
  border: "1px solid rgba(0,0,0,0.12)",
  background: "rgba(255,255,255,0.95)",
  fontSize: "0.85rem",
  cursor: "pointer",
};

export const addItemGuidanceStyle: CSSProperties = {
  fontSize: "0.85rem",
  lineHeight: 1.5,
  color: "#5b5b66",
  background: "rgba(236,64,122,0.08)",
  padding: "12px",
  borderRadius: "12px",
};

export const addItemPreviewStyle: CSSProperties = {
  width: "100%",
  height: "200px",
  borderRadius: "16px",
  background: "rgba(236,64,122,0.1)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  border: "1px dashed rgba(236,64,122,0.35)",
};

export const feedLinkButtonStyle: CSSProperties = {
  border: "none",
  background: "rgba(236,64,122,0.16)",
  color: "#ec407a",
  borderRadius: "999px",
  padding: "8px 18px",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 10px 20px rgba(236,64,122,0.2)",
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
};

export const editContextBannerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginBottom: "14px",
  padding: "10px 14px",
  borderRadius: "14px",
  background: "rgba(236,64,122,0.12)",
  color: "#d81b60",
  fontSize: "0.9rem",
  fontWeight: 600,
};

export const editContextStatusBadgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
};

export const editContextPrivacyBadgeStyle: CSSProperties = {
  borderRadius: "999px",
  padding: "4px 12px",
  fontSize: "0.75rem",
  fontWeight: 600,
};

export const editContextExitButtonStyle: CSSProperties = {
  marginLeft: "auto",
  border: "1px solid rgba(236,64,122,0.35)",
  background: "white",
  color: "#d81b60",
  borderRadius: "999px",
  padding: "6px 14px",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 6px 12px rgba(236,64,122,0.2)",
};

export const editContextErrorStyle: CSSProperties = {
  marginBottom: "14px",
  padding: "10px 14px",
  borderRadius: "14px",
  background: "rgba(229,57,53,0.16)",
  color: "#c62828",
  fontSize: "0.85rem",
  fontWeight: 600,
};


export const canvasSectionStyle: CSSProperties = {
  background: "rgba(255,255,255,0.92)",
  borderRadius: "32px",
  padding: "24px",
  boxShadow: "0 18px 36px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  alignSelf: "flex-start",
};

export const canvasStyle: CSSProperties = {
  position: "relative",
  width: `${CANVAS_WIDTH}px`,
  height: `${CANVAS_HEIGHT}px`,
  background: "linear-gradient(160deg, #fdf2f8 0%, #eef2ff 100%)",
  borderRadius: "28px",
  border: "1px solid rgba(236,64,122,0.25)",
  overflow: "hidden",
  boxShadow: "0 18px 42px rgba(236,64,122,0.12)",
  alignSelf: "center",
  transition: "box-shadow 0.2s ease, transform 0.2s ease",
};

export const canvasGuidelineStyle: CSSProperties = {
  position: "absolute",
  inset: "18px",
  borderRadius: "24px",
  border: "2px dashed rgba(236,64,122,0.35)",
  pointerEvents: "none",
};

export const placeholderTextStyle: CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  color: "#c48b9f",
  fontSize: "0.95rem",
  textAlign: "center",
  maxWidth: "70%",
};

export const canvasItemStyle: CSSProperties = {
  position: "absolute",
  borderRadius: "16px",
  background: "transparent",
  cursor: "grab",
  userSelect: "none",
  transition: "outline 0.2s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const canvasFallbackStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "2rem",
  fontWeight: 700,
  color: "#ec407a",
  background: "rgba(255,255,255,0.6)",
  borderRadius: "12px",
};

export const canvasVisualWrapperStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  borderRadius: "inherit",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  transition: "transform 0.2s ease",
  background: "transparent",
};

export const canvasDeleteButtonStyle: CSSProperties = {
  border: "2px solid rgba(236,64,122,0.75)",
  background: "rgba(255,255,255,0.98)",
  color: "#ec407a",
  width: "34px",
  height: "34px",
  borderRadius: "50%",
  fontWeight: 700,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.1rem",
  boxShadow: "0 10px 22px rgba(236,64,122,0.28)",
  position: "absolute",
  top: "-24px",
  right: "-24px",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  outline: "none",
};

export const canvasRotateHandleStyle: CSSProperties = {
  position: "absolute",
  top: "-30px",
  left: "50%",
  transform: "translate(-50%, -50%)",
  border: "2px solid rgba(236,64,122,0.45)",
  background: "rgba(255,255,255,0.96)",
  color: "#d81b60",
  width: "34px",
  height: "34px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "grab",
  fontSize: "1rem",
  boxShadow: "0 10px 22px rgba(236,64,122,0.2)",
  outline: "none",
};

export const canvasResizeHandleStyle: CSSProperties = {
  position: "absolute",
  bottom: "-24px",
  right: "-24px",
  width: "34px",
  height: "34px",
  borderRadius: "50%",
  background: "rgba(255,255,255,0.98)",
  border: "2px solid rgba(236,64,122,0.75)",
  color: "#ec407a",
  cursor: "nwse-resize",
  boxShadow: "0 10px 22px rgba(236,64,122,0.25)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1rem",
  outline: "none",
};


export const primaryButtonStyle: CSSProperties = {
  border: "none",
  background: "#ec407a",
  color: "white",
  borderRadius: "999px",
  padding: "10px 20px",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 10px 20px rgba(236,64,122,0.3)",
};

export const detailsSectionStyle: CSSProperties = {
  background: "rgba(255,255,255,0.85)",
  borderRadius: "20px",
  padding: "18px",
  boxShadow: "0 12px 26px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

export const detailPreviewWrapperStyle: CSSProperties = {
  width: "100%",
  height: "160px",
  borderRadius: "18px",
  overflow: "hidden",
  background: "rgba(236,64,122,0.12)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const detailFallbackPreviewStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "3rem",
  color: "#ec407a",
  fontWeight: 700,
};

export const detailMetaStyle: CSSProperties = {
  margin: 0,
  fontSize: "0.9rem",
  color: "#5b5b66",
};

export const sideColumnStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  position: "sticky",
  top: "0px",
  alignSelf: "flex-start",
};

export const saveDialogOverlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(33,30,45,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
  zIndex: 1000,
};

export const saveDialogContentStyle: CSSProperties = {
  width: "min(420px, 100%)",
  background: "white",
  borderRadius: "20px",
  boxShadow: "0 30px 60px rgba(0,0,0,0.18)",
  padding: "24px 24px 20px",
  display: "flex",
  flexDirection: "column",
  gap: "18px",
};

export const saveDialogHeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

export const saveDialogTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "1.25rem",
  color: "#2f2f3a",
};

export const saveDialogCloseButtonStyle: CSSProperties = {
  border: "none",
  background: "transparent",
  color: "#5b5b66",
  fontSize: "1.1rem",
  cursor: "pointer",
};

export const saveDialogBodyStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

export const saveDialogLabelStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  fontSize: "0.85rem",
  color: "#5b5b66",
  fontWeight: 600,
};

export const saveDialogInputStyle: CSSProperties = {
  borderRadius: "10px",
  border: "1px solid rgba(0,0,0,0.12)",
  padding: "10px 12px",
  fontSize: "0.95rem",
};

export const saveDialogCheckboxRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "0.85rem",
  color: "#5b5b66",
};

export const saveDialogErrorStyle: CSSProperties = {
  margin: 0,
  fontSize: "0.8rem",
  color: "#c62828",
};

export const saveDialogHintStyle: CSSProperties = {
  fontSize: "0.8rem",
  color: "#d81b60",
  background: "rgba(236,64,122,0.16)",
  borderRadius: "12px",
  padding: "8px 12px",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
};

export const saveDialogActionsStyle: CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "12px",
  marginTop: "8px",
};

export const saveDialogSecondaryButtonStyle: CSSProperties = {
  border: "none",
  background: "rgba(236,64,122,0.12)",
  color: "#ec407a",
  borderRadius: "999px",
  padding: "10px 18px",
  fontWeight: 600,
  cursor: "pointer",
};

export const saveDialogPrimaryButtonStyle: CSSProperties = {
  border: "none",
  background: "#ec407a",
  color: "white",
  borderRadius: "999px",
  padding: "10px 22px",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 12px 24px rgba(236,64,122,0.32)",
};

export const buttonDisabledStyle: CSSProperties = {
  opacity: 0.6,
  cursor: "not-allowed",
};

export const addItemDialogContentStyle: CSSProperties = {
  width: "min(520px, 100%)",
  background: "white",
  borderRadius: "24px",
  boxShadow: "0 30px 60px rgba(0,0,0,0.18)",
  padding: "26px 26px 22px",
  display: "flex",
  flexDirection: "column",
  gap: "18px",

  maxHeight: "90vh",
  overflowY: "auto",
};


export const addItemDialogHeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

export const addItemDialogTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "1.3rem",
  color: "#2f2f3a",
};






