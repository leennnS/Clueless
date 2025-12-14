import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { useAppDispatch } from "../hooks/useAppDispatch";
import {
  requestPasswordResetThunk,
  resetPasswordThunk,
} from "../store/auth/authSlice";
import {
  devCodeStyle,
  errorBannerStyle,
  fieldStyle,
  formStyle,
  helperTextStyle,
  infoBannerStyle,
  inputStyle,
  labelStyle,
  secondaryButtonStyle,
  successContainerStyle,
  submitButtonStyle,
  footerLinkStyle,
} from "../styles/forgotPasswordStyles";

type Step = "request" | "verify" | "success";

/**
 * Multi-step forgot-password flow that requests a code and submits the reset payload.
 *
 * Preconditions:
 * - API must expose `/users/forgot-password` and `/users/reset-password`.
 *
 * Postconditions:
 * - Guides the user through requesting a verification code and setting a new password.
 */
export default function ForgotPassword() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [developmentCode, setDevelopmentCode] = useState<string | null>(null);

  const handleRequestReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    setDevelopmentCode(null);

    try {
      const response = await dispatch(requestPasswordResetThunk({ email })).unwrap();
      setToken(response.resetToken ?? "");
      if (response.resetCode) {
        setDevelopmentCode(response.resetCode);
      }
      setInfo(
        "If email delivery is configured, a verification code has been sent to your inbox. Otherwise, use the code shown below.",
      );
      setStep("verify");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to start password reset.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) {
      setError("Reset token missing. Please restart the process.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await dispatch(resetPasswordThunk({ token, code, password })).unwrap();
      setInfo("Password updated successfully. You can now sign in.");
      setStep("success");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to reset password.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const renderRequestStep = () => (
    <form onSubmit={handleRequestReset} style={formStyle}>
      <p style={helperTextStyle}>
        Enter the email associated with your account. We'll send a one-time code
        to verify it's really you.
      </p>
      <label style={fieldStyle}>
        <span style={labelStyle}>Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="email"
          placeholder="you@example.com"
          style={inputStyle}
          disabled={loading}
        />
      </label>
      <button type="submit" style={submitButtonStyle} disabled={loading}>
        {loading ? "Sending code..." : "Send verification code"}
      </button>
    </form>
  );

  const renderVerifyStep = () => (
    <form onSubmit={handleResetPassword} style={formStyle}>
      <p style={helperTextStyle}>
        We've sent a 6-digit verification code to <strong>{email}</strong>.
        Enter the code and choose a new password below.
      </p>
      {developmentCode && (
        <div style={devCodeStyle}>
          Development code: <strong>{developmentCode}</strong>
        </div>
      )}
      <label style={fieldStyle}>
        <span style={labelStyle}>Verification code</span>
        <input
          type="text"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          required
          placeholder="6-digit code"
          style={inputStyle}
          disabled={loading}
        />
      </label>
      <label style={fieldStyle}>
        <span style={labelStyle}>New password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={8}
          placeholder="At least 8 characters"
          style={inputStyle}
          disabled={loading}
        />
      </label>
      <label style={fieldStyle}>
        <span style={labelStyle}>Confirm password</span>
        <input
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
          minLength={8}
          placeholder="Repeat your new password"
          style={inputStyle}
          disabled={loading}
        />
      </label>
      <button type="submit" style={submitButtonStyle} disabled={loading}>
        {loading ? "Updating..." : "Update password"}
      </button>
      <button
        type="button"
        onClick={() => {
          setStep("request");
          setCode("");
          setPassword("");
          setConfirmPassword("");
          setError(null);
        }}
        style={secondaryButtonStyle}
        disabled={loading}
      >
        Start over
      </button>
    </form>
  );

  return (
    <AuthLayout
      title={
        step === "success" ? "Password reset complete" : "Forgot your password?"
      }
      subtitle={
        step === "success"
          ? "Your password has been updated. Sign in to continue building looks."
          : "We'll send a one-time verification code to your inbox."
      }
      footer={
        <>
          Remembered it?{" "}
          <Link to="/login" style={footerLinkStyle}>
            Back to login
          </Link>
        </>
      }
    >
      {error && <div style={errorBannerStyle}>{error}</div>}
      {info && <div style={infoBannerStyle}>{info}</div>}

      {step === "request" && renderRequestStep()}
      {step === "verify" && renderVerifyStep()}
      {step === "success" && (
        <div style={successContainerStyle}>
          <p style={helperTextStyle}>
            Password updated successfully. You can now sign in with your new credentials.
          </p>
          <button
            type="button"
            onClick={() => navigate("/login")}
            style={submitButtonStyle}
          >
            Go to login
          </button>
        </div>
      )}
    </AuthLayout>
  );
}
