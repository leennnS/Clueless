import type { CSSProperties } from "react";

export const weatherWidgetStyles: Record<string, CSSProperties> = {
  loadingText: {
    margin: 0,
    fontSize: "0.85rem",
    color: "#6f6f7a",
  },
  errorText: {
    margin: 0,
    fontSize: "0.85rem",
    color: "#c62828",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    textAlign: "center",
    width: "100%",
  },
  icon: {
    width: "42px",
  },
  city: {
    fontSize: "1rem",
    fontWeight: 600,
  },
  meta: {
    fontSize: "0.9rem",
    color: "#555",
  },
};
