import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "./useAuth";

interface LocationState {
  from?: { pathname?: string };
  registered?: boolean;
}

interface LoginFormValues {
  email: string;
  password: string;
}

interface UseLoginFormResult {
  formValues: LoginFormValues;
  registeredMessage: string | null;
  showPassword: boolean;
  loading: boolean;
  error: string | null;
  success: string | null;
  handleChange: (field: keyof LoginFormValues) => (event: ChangeEvent<HTMLInputElement>) => void;
  toggleShowPassword: () => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

/**
 * Handles login page form state, including redirect handling and error/success messaging.
 *
 * Preconditions:
 * - `useAuth` provider must be mounted to supply login/clearStatus helpers.
 * - React Router context is required for navigation + location state.
 *
 * Postconditions:
 * - Returns controlled input handlers and submit logic that redirect on success.
 * - Clears stale auth messages when the hook mounts/unmounts.
 */
export function useLoginForm(): UseLoginFormResult {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, success, clearStatus } = useAuth();

  const [formValues, setFormValues] = useState<LoginFormValues>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const state = (location.state as LocationState) ?? {};
  const destination = state?.from?.pathname ?? "/dashboard";
  const registeredMessage = state?.registered
    ? "Registration successful! Please log in to continue."
    : null;

  useEffect(() => {
    clearStatus();
    return () => {
      clearStatus();
    };
  }, [clearStatus]);

  const handleChange =
    (field: keyof LoginFormValues) => (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setFormValues((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await login({ email: formValues.email, password: formValues.password });
      navigate(destination, { replace: true });
    } catch {
      // handled via error state
    }
  };

  return {
    formValues,
    registeredMessage,
    showPassword,
    loading,
    error,
    success,
    handleChange,
    toggleShowPassword: () => setShowPassword((prev) => !prev),
    handleSubmit,
  };
}
