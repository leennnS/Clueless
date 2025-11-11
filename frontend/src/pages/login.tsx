import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { useLoginForm } from "../hooks/useLoginForm";
import {
  errorBannerStyle,
  fieldWrapperStyle,
  forgotContainerStyle,
  forgotLinkStyle,
  formStyle,
  footerLinkStyle,
  inputStyle,
  labelTextStyle,
  passwordInputWrapperStyle,
  submitButtonStyle,
  successBannerStyle,
  toggleButtonStyle,
} from "../styles/loginStyles";

/**
 * Login screen that renders inside `AuthLayout` and wires up the `useLoginForm` hook.
 *
 * Preconditions:
 * - `AuthProvider` must wrap the app so `useAuth` is available.
 *
 * Postconditions:
 * - On submit, attempts authentication and redirects to the last visited route (or dashboard).
 */
export default function Login() {
  const {
    formValues,
    handleChange,
    registeredMessage,
    showPassword,
    toggleShowPassword,
    loading,
    error,
    success,
    handleSubmit,
  } = useLoginForm();

  return (
    <AuthLayout
      title="Welcome back!"
      subtitle="Log in to your virtual closet"
      description="Access your curated outfits, schedule looks, and share your styling inspiration."
      footer={
        <>
          New here?{" "}
          <Link to="/register" style={footerLinkStyle}>
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={formStyle}>
        {registeredMessage && <div style={successBannerStyle}>{registeredMessage}</div>}

        {error && (
          <div role="alert" style={errorBannerStyle}>
            {error}
          </div>
        )}

        {success && !registeredMessage && (
          <div style={successBannerStyle}>{success}</div>
        )}

        <label style={fieldWrapperStyle}>
          <span style={labelTextStyle}>Email</span>
          <input
            type="email"
            value={formValues.email}
            onChange={handleChange("email")}
            required
            placeholder="you@example.com"
            style={inputStyle}
            autoComplete="email"
          />
        </label>

        <label style={fieldWrapperStyle}>
          <span style={labelTextStyle}>Password</span>
          <div style={passwordInputWrapperStyle}>
            <input
              type={showPassword ? "text" : "password"}
              value={formValues.password}
              onChange={handleChange("password")}
              required
              placeholder="Enter your password"
              style={{ ...inputStyle, paddingRight: "48px" }}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              style={toggleButtonStyle}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        <div style={forgotContainerStyle}>
          <Link to="/forgot-password" style={forgotLinkStyle}>
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            ...submitButtonStyle,
            background: loading ? "rgba(236,64,122,0.6)" : submitButtonStyle.background,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Signing you in..." : "Log In"}
        </button>
      </form>
    </AuthLayout>
  );
}
