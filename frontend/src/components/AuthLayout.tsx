import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { authLayoutStyles } from "../styles/authLayoutStyles";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Shared layout for authentication pages (login/register/forgot password).
 *
 * Preconditions:
 * - Caller must pass `title` plus form content via `children`.
 * - Surrounding routes should provide React Router context so the home link works.
 *
 * Postconditions:
 * - Renders a centered card with hero copy, slotted form content, and optional footer.
 */
export default function AuthLayout({
  title,
  subtitle,
  description,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <div style={authLayoutStyles.wrapper}>
      <div style={authLayoutStyles.card}>
        <Link to="/" style={authLayoutStyles.homeLink}>
          �+? Back home
        </Link>
        <div style={authLayoutStyles.header}>
          <h1 style={authLayoutStyles.title}>{title}</h1>
          {subtitle && <p style={authLayoutStyles.subtitle}>{subtitle}</p>}
          {description && (
            <p style={authLayoutStyles.description}>{description}</p>
          )}
        </div>

        {children}

        {footer && <div style={authLayoutStyles.footer}>{footer}</div>}
      </div>
    </div>
  );
}
