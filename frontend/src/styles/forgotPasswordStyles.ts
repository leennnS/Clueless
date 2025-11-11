import type { CSSProperties } from "react";

export const formStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "18px",
};

export const fieldStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

export const labelStyle: CSSProperties = {
  fontSize: "0.85rem",
  fontWeight: 600,
  color: "#444",
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
};

export const secondaryButtonStyle: CSSProperties = {
  border: "none",
  borderRadius: "999px",
  padding: "12px 18px",
  fontSize: "0.95rem",
  fontWeight: 600,
  color: "#322f3d",
  background: "rgba(32,26,53,0.08)",
  cursor: "pointer",
};

export const errorBannerStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: "12px",
  background: "rgba(229,57,53,0.12)",
  color: "#c62828",
  fontSize: "0.9rem",
  marginBottom: "12px",
};

export const infoBannerStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: "12px",
  background: "rgba(32,26,53,0.08)",
  color: "#322f3d",
  fontSize: "0.9rem",
  marginBottom: "12px",
};

export const helperTextStyle: CSSProperties = {
  color: "#6b6879",
  fontSize: "0.9rem",
  lineHeight: 1.5,
  marginBottom: 0,
};

export const devCodeStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: "10px",
  background: "rgba(161,136,248,0.15)",
  color: "#5e35b1",
  fontWeight: 600,
  fontSize: "0.9rem",
};

export const footerLinkStyle: CSSProperties = {
  color: "#ec407a",
  fontWeight: 600,
  textDecoration: "none",
};

export const successContainerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "18px",
};
