import type { CSSProperties } from "react";

export const containerStyle: CSSProperties = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #f3e7e9 0%, #e3eeff 100%)",
  padding: "40px 48px 64px",
  boxSizing: "border-box",
  fontFamily: "'Poppins', sans-serif",
  color: "#2f2f3a",
};

export const headerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "28px",
};

export const backButtonStyle: CSSProperties = {
  border: "none",
  background: "rgba(236,64,122,0.18)",
  color: "#d81b60",
  borderRadius: "999px",
  padding: "10px 18px",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 12px 24px rgba(236,64,122,0.25)",
};

export const refreshButtonStyle: CSSProperties = {
  border: "none",
  background: "rgba(32, 26, 53, 0.08)",
  color: "#322f3d",
  borderRadius: "999px",
  padding: "10px 18px",
  fontWeight: 600,
  cursor: "pointer",
};

export const heroSectionStyle: CSSProperties = {
  background: "rgba(255,255,255,0.9)",
  borderRadius: "28px",
  padding: "32px",
  boxShadow: "0 30px 60px rgba(31,24,53,0.12)",
  display: "flex",
  flexDirection: "column",
  gap: "28px",
  marginBottom: "36px",
};

export const heroIdentityStyle: CSSProperties = {
  display: "flex",
  gap: "24px",
  alignItems: "center",
};

export const heroAvatarStyle: CSSProperties = {
  width: "84px",
  height: "84px",
  borderRadius: "24px",
  background: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "2rem",
  fontWeight: 700,
  color: "white",
  boxShadow: "0 20px 40px rgba(255,105,135,0.25)",
  overflow: "hidden",
  border: "3px solid rgba(255,255,255,0.6)",
};

export const heroAvatarImageStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

export const heroTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "2rem",
  letterSpacing: "0.02em",
};

export const heroSubtitleStyle: CSSProperties = {
  margin: "6px 0 18px",
  color: "#5b5b66",
  fontSize: "0.95rem",
};

export const heroActionsRowStyle: CSSProperties = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
};

export const primaryActionStyle: CSSProperties = {
  border: "none",
  background: "#ec407a",
  color: "white",
  borderRadius: "999px",
  padding: "10px 24px",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 16px 30px rgba(236,64,122,0.32)",
};

export const secondaryActionStyle: CSSProperties = {
  border: "none",
  background: "rgba(33,30,45,0.08)",
  color: "#332f4c",
  borderRadius: "999px",
  padding: "10px 24px",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 12px 22px rgba(33,30,45,0.12)",
};

export const tertiaryActionStyle: CSSProperties = {
  border: "none",
  background: "rgba(161,136,248,0.18)",
  color: "#5e35b1",
  borderRadius: "999px",
  padding: "10px 24px",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 12px 22px rgba(94,53,177,0.2)",
};

export const inboxActionStyle: CSSProperties = {
  border: "1px solid rgba(33,30,45,0.16)",
  background: "rgba(255,255,255,0.92)",
  color: "#322f3d",
  borderRadius: "999px",
  padding: "10px 24px",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 12px 24px rgba(33,30,45,0.12)",
};

export const heroStatsStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: "18px",
};

export const statCardStyle: CSSProperties = {
  padding: "16px 20px",
  borderRadius: "20px",
  background: "rgba(255,255,255,0.8)",
  border: "1px solid rgba(236,64,122,0.18)",
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

export const statLabelStyle: CSSProperties = {
  fontSize: "0.85rem",
  color: "#6b6879",
};

export const statValueStyle: CSSProperties = {
  fontSize: "1.6rem",
  fontWeight: 700,
  color: "#d81b60",
};

export const loadingStateStyle: CSSProperties = {
  textAlign: "center",
  color: "#5b5b66",
  fontSize: "1rem",
  marginTop: "18px",
};

export const errorBoxStyle: CSSProperties = {
  background: "rgba(244, 67, 54, 0.12)",
  color: "#c62828",
  padding: "16px 20px",
  borderRadius: "18px",
  boxShadow: "0 18px 40px rgba(31,24,53,0.12)",
  marginTop: "18px",
};

export const splitSectionStyle: CSSProperties = {
  marginBottom: "32px",
};

export const panelStyle: CSSProperties = {
  background: "rgba(255,255,255,0.92)",
  borderRadius: "24px",
  padding: "24px 28px",
  boxShadow: "0 24px 50px rgba(31,24,53,0.12)",
};

export const panelTitleStyle: CSSProperties = {
  margin: "0 0 6px",
  fontSize: "1.45rem",
};

export const panelSubtitleStyle: CSSProperties = {
  margin: "0 0 18px",
  color: "#6b6879",
  fontSize: "0.95rem",
};

export const highlightGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "18px",
};

export const highlightCardStyle: CSSProperties = {
  background: "rgba(255,255,255,0.9)",
  borderRadius: "20px",
  border: "1px solid rgba(32,26,53,0.08)",
  padding: "18px 20px",
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};

export const highlightLabelStyle: CSSProperties = {
  fontSize: "0.95rem",
  fontWeight: 700,
  color: "#2f2f3a",
};

export const latestListStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

export const latestItemStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
  alignItems: "flex-start",
};

export const latestItemBulletStyle: CSSProperties = {
  fontSize: "0.8rem",
  color: "#ec407a",
  marginTop: "3px",
};

export const latestItemTitleStyle: CSSProperties = {
  fontWeight: 600,
  color: "#2f2f3a",
};

export const latestItemMetaStyle: CSSProperties = {
  fontSize: "0.85rem",
  color: "#6b6879",
};

export const favoriteTagWrapStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
};

export const favoriteTagStyle: CSSProperties = {
  background: "rgba(236,64,122,0.18)",
  color: "#d81b60",
  borderRadius: "999px",
  padding: "6px 12px",
  fontWeight: 600,
  fontSize: "0.85rem",
};

export const favoriteTagHintStyle: CSSProperties = {
  margin: 0,
  fontSize: "0.8rem",
  color: "#7a7785",
};

export const mutedTextStyle: CSSProperties = {
  color: "#7a7785",
  fontSize: "0.9rem",
};

export const showMoreRowStyle: CSSProperties = {
  gridColumn: "1 / -1",
  display: "flex",
  justifyContent: "center",
  marginTop: "16px",
};

export const showMoreButtonStyle: CSSProperties = {
  border: "1px solid rgba(236,64,122,0.35)",
  background: "rgba(236,64,122,0.12)",
  color: "#d81b60",
  borderRadius: "999px",
  padding: "8px 22px",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 12px 24px rgba(236,64,122,0.18)",
};

export const wardrobeSectionStyle: CSSProperties = {
  marginBottom: "36px",
};

export const sectionHeaderStyle: CSSProperties = {
  marginBottom: "18px",
};

export const wardrobeGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "18px",
};

export const wardrobeCardStyle: CSSProperties = {
  background: "rgba(255,255,255,0.92)",
  borderRadius: "22px",
  padding: "16px",
  display: "flex",
  gap: "16px",
  alignItems: "center",
  border: "1px solid rgba(236,64,122,0.15)",
  boxShadow: "0 20px 40px rgba(31,24,53,0.08)",
};

export const wardrobeImageShellStyle: CSSProperties = {
  width: "72px",
  height: "72px",
  borderRadius: "18px",
  background: "rgba(236,64,122,0.12)",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const wardrobeImageStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

export const wardrobeFallbackStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  fontWeight: 700,
  color: "#ec407a",
  fontSize: "1.2rem",
};

export const wardrobeItemTitleStyle: CSSProperties = {
  fontWeight: 600,
  color: "#2f2f3a",
};

export const wardrobeMetaStyle: CSSProperties = {
  fontSize: "0.85rem",
  color: "#6b6879",
};

export const wardrobeTagListStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "6px",
};

export const wardrobeTagStyle: CSSProperties = {
  padding: "4px 8px",
  borderRadius: "999px",
  background: "rgba(33,30,45,0.08)",
  fontSize: "0.75rem",
  color: "#322f3d",
};

export const wardrobeActionsRowStyle: CSSProperties = {
  marginTop: "10px",
  display: "flex",
};

export const wardrobeActionButtonStyle: CSSProperties = {
  border: "1px solid rgba(236,64,122,0.25)",
  background: "rgba(236,64,122,0.08)",
  color: "#d81b60",
  borderRadius: "999px",
  padding: "6px 14px",
  fontSize: "0.8rem",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 8px 16px rgba(236,64,122,0.18)",
};

export const actionButtonDisabledStyle: CSSProperties = {
  opacity: 0.6,
  cursor: "not-allowed",
  boxShadow: "none",
};

export const emptyPanelStyle: CSSProperties = {
  gridColumn: "1 / -1",
  background: "rgba(255,255,255,0.95)",
  borderRadius: "22px",
  padding: "28px",
  textAlign: "center",
  color: "#6b6879",
  display: "flex",
  flexDirection: "column",
  gap: "14px",
  alignItems: "center",
};

export const outfitGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "18px",
};

export const outfitCardStyle: CSSProperties = {
  background: "rgba(255,255,255,0.92)",
  borderRadius: "22px",
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  border: "1px solid rgba(32,26,53,0.08)",
  boxShadow: "0 22px 44px rgba(31,24,53,0.08)",
};

export const outfitBadgeRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginTop: "4px",
};

export const outfitPrivacyBadgeStyle: CSSProperties = {
  borderRadius: "999px",
  padding: "4px 12px",
  fontSize: "0.75rem",
  fontWeight: 600,
  background: "rgba(229,57,53,0.16)",
  color: "#c62828",
};

export const outfitActionsRowStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
};

export const outfitActionButtonStyle: CSSProperties = {
  flex: "1 1 0",
  border: "1px solid rgba(236,64,122,0.3)",
  background: "rgba(236,64,122,0.12)",
  color: "#d81b60",
  borderRadius: "999px",
  padding: "8px 0",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 12px 22px rgba(236,64,122,0.22)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  fontSize: "0.85rem",
};

export const outfitDeleteButtonStyle: CSSProperties = {
  border: "1px solid rgba(229,57,53,0.3)",
  background: "rgba(229,57,53,0.16)",
  color: "#c62828",
};

export const outfitPreviewShellStyle: CSSProperties = {
  width: "100%",
  aspectRatio: "1 / 1",
  borderRadius: "18px",
  overflow: "hidden",
  background: "rgba(236,64,122,0.12)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const outfitPreviewStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

export const outfitFallbackStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  fontWeight: 700,
  color: "#ec407a",
  fontSize: "1.4rem",
};

export const inboxSectionStyle: CSSProperties = {
  marginBottom: "36px",
  background: "rgba(255,255,255,0.92)",
  borderRadius: "24px",
  padding: "24px 28px",
  boxShadow: "0 24px 48px rgba(31,24,53,0.12)",
};

export const inboxListStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

export const inboxItemStyle: CSSProperties = {
  display: "flex",
  gap: "12px",
  padding: "12px 16px",
  borderRadius: "16px",
  background: "rgba(236,64,122,0.1)",
  border: "1px solid rgba(236,64,122,0.2)",
  boxShadow: "0 16px 28px rgba(236,64,122,0.16)",
};

export const inboxAvatarStyle: CSSProperties = {
  width: "44px",
  height: "44px",
  borderRadius: "50%",
  background: "rgba(236,64,122,0.9)",
  color: "white",
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 12px 26px rgba(236,64,122,0.3)",
};

export const inboxMetaStyle: CSSProperties = {
  fontSize: "0.85rem",
  color: "#6b6879",
};

export const inboxEmptyStyle: CSSProperties = {
  padding: "20px",
  borderRadius: "18px",
  background: "rgba(240,98,146,0.12)",
  color: "#a9446b",
  textAlign: "center",
  fontWeight: 600,
};

export const outfitNameStyle: CSSProperties = {
  fontWeight: 600,
  color: "#2f2f3a",
};

export const outfitMetaStyle: CSSProperties = {
  color: "#6b6879",
  fontSize: "0.85rem",
};

export const outfitMetaSecondaryStyle: CSSProperties = {
  color: "#948fa4",
  fontSize: "0.8rem",
};







export const successBannerStyle: CSSProperties = {
  margin: "0 0 18px",
  padding: "12px 16px",
  borderRadius: "16px",
  background: "rgba(76,175,80,0.12)",
  color: "#2e7d32",
  fontSize: "0.9rem",
  boxShadow: "0 14px 30px rgba(31,24,53,0.08)",
};

export const errorBannerStyle: CSSProperties = {
  margin: "0 0 18px",
  padding: "12px 16px",
  borderRadius: "16px",
  background: "rgba(229,57,53,0.12)",
  color: "#c62828",
  fontSize: "0.9rem",
  boxShadow: "0 14px 30px rgba(31,24,53,0.08)",
};

export const editSectionStyle: CSSProperties = {
  background: "rgba(255,255,255,0.92)",
  borderRadius: "24px",
  padding: "24px 28px",
  boxShadow: "0 24px 50px rgba(31,24,53,0.12)",
  marginBottom: "36px",
};

export const editFormStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  marginTop: "16px",
};

export const editFieldStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

export const editLabelStyle: CSSProperties = {
  fontSize: "0.85rem",
  fontWeight: 600,
  color: "#4c4a57",
};

export const editInputStyle: CSSProperties = {
  borderRadius: "14px",
  border: "1px solid rgba(0,0,0,0.12)",
  padding: "12px 14px",
  fontSize: "0.95rem",
  boxShadow: "0 6px 18px rgba(31,24,53,0.08)",
  outline: "none",
};

export const profileImageFieldStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

export const profileImagePreviewShellStyle: CSSProperties = {
  width: "120px",
  height: "120px",
  borderRadius: "24px",
  border: "2px dashed rgba(236,64,122,0.35)",
  background: "rgba(236,64,122,0.08)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  color: "#d81b60",
  fontWeight: 600,
};

export const profileImagePreviewImgStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

export const profileImageUploadLabelStyle: CSSProperties = {
  borderRadius: "999px",
  border: "1px dashed rgba(236,64,122,0.5)",
  color: "#d81b60",
  padding: "10px 18px",
  fontWeight: 600,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  background: "rgba(236,64,122,0.08)",
};

export const formActionRowStyle: CSSProperties = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  alignItems: "center",
};

export const cancelButtonStyle: CSSProperties = {
  border: "none",
  background: "rgba(33,30,45,0.08)",
  color: "#322f3d",
  borderRadius: "999px",
  padding: "10px 22px",
  fontWeight: 600,
  cursor: "pointer",
};

export const calendarSectionStyle: CSSProperties = {
  background: "rgba(255,255,255,0.94)",
  borderRadius: "24px",
  padding: "28px",
  boxShadow: "0 28px 60px rgba(31,24,53,0.12)",
  marginBottom: "36px",
  display: "flex",
  flexDirection: "column",
  gap: "18px",
};

export const calendarErrorStyle: CSSProperties = {
  background: "rgba(229,57,53,0.14)",
  color: "#c62828",
  borderRadius: "14px",
  padding: "10px 14px",
  fontWeight: 600,
};

export const calendarLayoutStyle: CSSProperties = {
  display: "grid",
  gap: "24px",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  alignItems: "stretch",
};

export const calendarColumnStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};

export const calendarHeaderRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
};

export const calendarMonthLabelStyle: CSSProperties = {
  fontSize: "1.1rem",
  fontWeight: 700,
  color: "#2f2f3a",
};

export const calendarNavButtonStyle: CSSProperties = {
  border: "none",
  background: "rgba(236,64,122,0.16)",
  color: "#ec407a",
  borderRadius: "999px",
  width: "36px",
  height: "36px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.25rem",
  cursor: "pointer",
  boxShadow: "0 12px 28px rgba(236,64,122,0.22)",
};

export const calendarWeekdayRowStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
  gap: "8px",
  fontSize: "0.75rem",
  color: "#77728c",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  fontWeight: 700,
};

export const calendarWeekdayCellStyle: CSSProperties = {
  textAlign: "center",
};

export const calendarGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
  gap: "10px",
};

export const calendarDayCellStyle: CSSProperties = {
  borderRadius: "16px",
  padding: "14px 10px",
  background: "rgba(248,187,208,0.18)",
  border: "1px solid rgba(32,26,53,0.08)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  cursor: "pointer",
  transition: "transform 0.18s ease, box-shadow 0.18s ease",
  boxShadow: "0 12px 26px rgba(31,24,53,0.08)",
};

export const calendarDayNumberStyle: CSSProperties = {
  fontWeight: 700,
  fontSize: "1rem",
};

export const calendarHeartStyle: CSSProperties = {
  fontSize: "1rem",
  lineHeight: 1,
};

export const calendarTodayDotStyle: CSSProperties = {
  width: "6px",
  height: "6px",
  borderRadius: "999px",
  background: "#ec407a",
};

export const calendarLoadingStyle: CSSProperties = {
  textAlign: "center",
  padding: "28px 0",
  color: "#6b6879",
  fontWeight: 600,
};

export const calendarResetButtonStyle: CSSProperties = {
  border: "none",
  background: "rgba(32,26,53,0.08)",
  color: "#322f3d",
  borderRadius: "999px",
  padding: "8px 18px",
  fontWeight: 600,
  cursor: "pointer",
  alignSelf: "flex-end",
};

export const calendarSidebarStyle: CSSProperties = {
  background: "rgba(246, 226, 236, 0.6)",
  borderRadius: "22px",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  boxShadow: "0 18px 40px rgba(236,64,122,0.18)",
};

export const calendarSidebarTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "1.2rem",
  color: "#2f2f3a",
};

export const calendarSidebarMetaStyle: CSSProperties = {
  margin: 0,
  fontSize: "0.9rem",
  color: "#5a5670",
  lineHeight: 1.5,
};

export const calendarFormStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};

export const calendarSelectedInfoStyle: CSSProperties = {
  background: "rgba(255,255,255,0.86)",
  borderRadius: "18px",
  padding: "14px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  border: "1px solid rgba(236,64,122,0.25)",
};

export const calendarSelectedCardStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  padding: "10px 12px",
  borderRadius: "16px",
  background: "rgba(236,64,122,0.12)",
  boxShadow: "0 16px 32px rgba(236,64,122,0.18)",
};

export const calendarSelectedImageShellStyle: CSSProperties = {
  width: "58px",
  height: "58px",
  borderRadius: "14px",
  overflow: "hidden",
  background: "rgba(255,255,255,0.75)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
  color: "#d81b60",
};

export const calendarSelectedImageStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

export const calendarSelectedFallbackStyle: CSSProperties = {
  fontSize: "1rem",
};

export const calendarSelectedTitleStyle: CSSProperties = {
  fontWeight: 700,
  color: "#2f2f3a",
  fontSize: "0.95rem",
};

export const calendarSelectedMetaStyle: CSSProperties = {
  fontSize: "0.8rem",
  color: "#5a5670",
};

export const calendarPickerControlsStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

export const calendarPickerGridStyle: CSSProperties = {
  display: "grid",
  gap: "14px",
  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
  maxHeight: "320px",
  overflowY: "auto",
  padding: "6px 2px",
};

export const calendarPickerCardStyle: CSSProperties = {
  borderRadius: "18px",
  border: "1px solid rgba(236,64,122,0.22)",
  background: "rgba(255,255,255,0.9)",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  padding: "12px 12px 14px",
  cursor: "pointer",
  boxShadow: "0 14px 32px rgba(236,64,122,0.16)",
  textAlign: "left",
};

export const calendarPickerCardActiveStyle: CSSProperties = {
  border: "2px solid #ec407a",
  boxShadow: "0 16px 36px rgba(236,64,122,0.25)",
};

export const calendarPickerImageShellStyle: CSSProperties = {
  width: "100%",
  aspectRatio: "1 / 1",
  borderRadius: "14px",
  overflow: "hidden",
  background: "rgba(236,64,122,0.14)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const calendarPickerImageStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

export const calendarPickerFallbackStyle: CSSProperties = {
  fontWeight: 700,
  color: "#d81b60",
};

export const calendarPickerCardMetaStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  fontSize: "0.8rem",
  color: "#5a5670",
};

export const calendarActionRowStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

export const calendarPrimaryButtonStyle: CSSProperties = {
  border: "none",
  background: "#ec407a",
  color: "white",
  borderRadius: "999px",
  padding: "10px 20px",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 16px 34px rgba(236,64,122,0.28)",
};

export const calendarGhostButtonStyle: CSSProperties = {
  border: "1px solid rgba(236,64,122,0.35)",
  background: "rgba(255,255,255,0.8)",
  color: "#d81b60",
  borderRadius: "999px",
  padding: "10px 18px",
  fontWeight: 600,
  cursor: "pointer",
};

export const calendarStatusStyle: CSSProperties = {
  background: "rgba(76,175,80,0.14)",
  color: "#2e7d32",
  borderRadius: "14px",
  padding: "10px 14px",
  fontWeight: 600,
  fontSize: "0.9rem",
};

export const calendarStatusErrorStyle: CSSProperties = {
  background: "rgba(229,57,53,0.14)",
  color: "#c62828",
  borderRadius: "14px",
  padding: "10px 14px",
  fontWeight: 600,
  fontSize: "0.9rem",
};

export const calendarPickerEmptyStyle: CSSProperties = {
  color: "#6b6879",
  fontSize: "0.85rem",
  padding: "12px",
};

export const calendarPreviewOverlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(31,24,53,0.46)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
  padding: "24px",
};

export const calendarPreviewCardStyle: CSSProperties = {
  width: "min(480px, 100%)",
  background: "linear-gradient(135deg, #f8bbd0 0%, #e3eeff 100%)",
  borderRadius: "28px",
  padding: "28px 26px",
  boxShadow: "0 40px 80px rgba(31,24,53,0.22)",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  maxHeight: "90vh",
  overflowY: "auto",
};

export const calendarPreviewHeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

export const calendarPreviewTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "1.25rem",
  color: "#2f2f3a",
};

export const calendarPreviewCloseStyle: CSSProperties = {
  border: "none",
  background: "rgba(255,255,255,0.6)",
  color: "#4c4a57",
  borderRadius: "999px",
  width: "32px",
  height: "32px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1rem",
};

export const calendarPreviewMetaStyle: CSSProperties = {
  margin: 0,
  color: "#5a5670",
  fontSize: "0.9rem",
};

export const calendarPreviewImageShellStyle: CSSProperties = {
  width: "100%",
  aspectRatio: "4 / 5",
  borderRadius: "20px",
  overflow: "hidden",
  background: "rgba(236,64,122,0.15)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  maxHeight: "52vh",
};

export const calendarPreviewImageStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

export const calendarPreviewFallbackStyle: CSSProperties = {
  fontSize: "1.4rem",
  fontWeight: 700,
  color: "#ec407a",
};

export const calendarPreviewBodyStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  fontSize: "0.9rem",
  color: "#4c4a57",
};



