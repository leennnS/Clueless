import type { CSSProperties } from "react";

export const fieldWrapperStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  width: "100%",
  maxWidth: "360px",
};

export const formStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "18px",
  alignItems: "center",
  width: "100%",
};

export const inputStyle: CSSProperties = {
  width: "100%",
  borderRadius: "14px",
  border: "1px solid rgba(0,0,0,0.08)",
  padding: "14px 16px",
  fontSize: "0.95rem",
  transition: "border 0.2s ease, box-shadow 0.2s ease",
  outline: "none",
  boxShadow: "0 2px 6px rgba(236,64,122,0.1)",
  boxSizing: "border-box",
};

export const toggleButtonStyle: CSSProperties = {
  position: "absolute",
  right: "14px",
  top: "50%",
  transform: "translateY(-50%)",
  background: "transparent",
  border: "none",
  color: "#ec407a",
  fontWeight: 600,
  cursor: "pointer",
  fontSize: "0.85rem",
};

export const passwordInputWrapperStyle: CSSProperties = {
  position: "relative",
  width: "100%",
};

export const forgotLinkStyle: CSSProperties = {
  color: "#ec407a",
  fontWeight: 600,
  textDecoration: "none",
  fontSize: "0.85rem",
};

export const forgotContainerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  width: "100%",
  maxWidth: "360px",
  marginTop: "-6px",
};

export const footerLinkStyle: CSSProperties = {
  color: "#ec407a",
  fontWeight: 600,
  textDecoration: "none",
};

export const successBannerStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: "12px",
  background: "rgba(76,175,80,0.12)",
  color: "#2e7d32",
  fontSize: "0.9rem",
};

export const errorBannerStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: "12px",
  background: "rgba(229,57,53,0.12)",
  color: "#c62828",
  fontSize: "0.9rem",
};

export const labelTextStyle: CSSProperties = {
  fontSize: "0.85rem",
  fontWeight: 600,
  color: "#444",
};

export const submitButtonStyle: CSSProperties = {
  border: "none",
  borderRadius: "999px",
  padding: "14px 18px",
  fontSize: "1rem",
  fontWeight: 600,
  color: "white",
  background: "#ec407a",
  cursor: "pointer",
  boxShadow: "0 10px 20px rgba(236,64,122,0.25)",
  transition: "transform 0.2s ease",
  width: "100%",
  maxWidth: "360px",
};
