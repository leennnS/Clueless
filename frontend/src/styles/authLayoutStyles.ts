import type { CSSProperties } from "react";

export const authLayoutStyles: Record<string, CSSProperties> = {
  wrapper: {
    minHeight: "100vh",
    width: "100%",
    background: "linear-gradient(135deg, #f8bbd0 0%, #fbe9e7 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 16px",
    boxSizing: "border-box",
    fontFamily: "'Poppins', sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    backgroundColor: "rgba(255,255,255,0.88)",
    borderRadius: "24px",
    boxShadow: "0 18px 40px rgba(0,0,0,0.12)",
    padding: "36px",
    position: "relative",
    overflow: "hidden",
  },
  homeLink: {
    position: "absolute",
    top: "20px",
    right: "24px",
    fontSize: "12px",
    color: "#ec407a",
    textDecoration: "none",
    fontWeight: 600,
    letterSpacing: "0.03em",
  },
  header: {
    marginBottom: "28px",
  },
  title: {
    margin: 0,
    fontSize: "1.9rem",
    color: "#333",
    letterSpacing: "0.04em",
  },
  subtitle: {
    margin: "8px 0 0",
    fontSize: "1rem",
    fontWeight: 500,
    color: "#ec407a",
  },
  description: {
    margin: "16px 0 0",
    fontSize: "0.94rem",
    color: "#666",
    lineHeight: 1.5,
  },
  footer: {
    marginTop: "28px",
    fontSize: "0.9rem",
    color: "#555",
    textAlign: "center",
  },
};
