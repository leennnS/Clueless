import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "./useAuth";

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface UseRegisterFormResult {
  formValues: RegisterFormValues;
  showPassword: boolean;
  localError: string | null;
  loading: boolean;
  error: string | null;
  success: string | null;
  handleChange: (field: keyof RegisterFormValues) => (event: ChangeEvent<HTMLInputElement>) => void;
  toggleShowPassword: () => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

/**
 * Manages the registration form, including validation and auto-login flow.
 *
 * Preconditions:
 * - `useAuth` provider must be available to call `register`/`login`.
 *
 * Postconditions:
 * - Returns controlled form handlers, error states, and loading flags.
 * - On success, automatically logs the user in and navigates to `/dashboard`.
 */
export function useRegisterForm(): UseRegisterFormResult {
  const navigate = useNavigate();
  const { register, login, loading, error, success, clearStatus } = useAuth();

  const [formValues, setFormValues] = useState<RegisterFormValues>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    clearStatus();
    return () => {
      clearStatus();
    };
  }, [clearStatus]);

  const handleChange =
    (field: keyof RegisterFormValues) => (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setFormValues((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formValues.password !== formValues.confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    setLocalError(null);

    try {
      await register({
        username: formValues.username,
        email: formValues.email,
        password: formValues.password,
      });
      await login({ email: formValues.email, password: formValues.password });
      navigate("/dashboard", { replace: true });
    } catch {
      // handled via error state
    }
  };

  return {
    formValues,
    showPassword,
    localError,
    loading,
    error,
    success,
    handleChange,
    toggleShowPassword: () => setShowPassword((prev) => !prev),
    handleSubmit,
  };
}
