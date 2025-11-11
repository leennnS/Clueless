import { Link } from "react-router-dom";

import AuthLayout from "../components/AuthLayout";
import { useRegisterForm } from "../hooks/useRegisterForm";
import {
  errorBannerStyle,
  fieldWrapperStyle,
  footerLinkStyle,
  formStyle,
  inputStyle,
  labelTextStyle,
  passwordInputWrapperStyle,
  submitButtonStyle,
  successBannerStyle,
  toggleButtonStyle,
} from "../styles/registerStyles";

/**
 * Registration page that collects credentials, registers the user, and auto-logs them in.
 *
 * Preconditions:
 * - `useAuth` context available to call `register` + `login`.
 *
 * Postconditions:
 * - Displays validation errors via `useRegisterForm`; navigates to studio after success.
 */
export default function Register() {
  const {
    formValues,
    handleChange,
    showPassword,
    toggleShowPassword,
    localError,
    loading,
    error,
    success,
    handleSubmit,
  } = useRegisterForm();

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join the Clueless community"
      description="Save your closet digitally, build outfits, and get inspired every day."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" style={footerLinkStyle}>
            Log in instead
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={formStyle}>
        {localError && (
          <div role="alert" style={errorBannerStyle}>
            {localError}
          </div>
        )}

        {error && (
          <div role="alert" style={errorBannerStyle}>
            {error}
          </div>
        )}

        {success && (
          <div style={successBannerStyle}>
            {success} Taking you to your studio...
          </div>
        )}

        <label style={fieldWrapperStyle}>
          <span style={labelTextStyle}>Username</span>
          <input
            type="text"
            value={formValues.username}
            onChange={handleChange("username")}
            required
            placeholder="fashionista123"
            style={inputStyle}
            autoComplete="username"
          />
        </label>

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
              minLength={6}
              placeholder="Create a strong password"
              style={{ ...inputStyle, paddingRight: "48px" }}
              autoComplete="new-password"
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

        <label style={fieldWrapperStyle}>
          <span style={labelTextStyle}>Confirm password</span>
          <input
            type={showPassword ? "text" : "password"}
            value={formValues.confirmPassword}
            onChange={handleChange("confirmPassword")}
            required
            placeholder="Re-enter your password"
            style={inputStyle}
            autoComplete="new-password"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            ...submitButtonStyle,
            background: loading ? "rgba(236,64,122,0.6)" : submitButtonStyle.background,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Creating your account..." : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
}
