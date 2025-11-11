import { useCallback, useMemo, useState } from "react";
import {
  login as loginRequest,
  register as registerRequest,
  persistAuth,
  clearPersistedAuth,
  loadPersistedAuth,
  persistUpdatedUser,
  type AuthUser,
  type LoginPayload,
  type RegisterPayload,
  type RegisterResponse,
  type LoginResponse,
} from "../services/authService";

interface ErrorResponsePayload {
  response?: {
    data?: {
      message?: unknown;
    };
  };
}

/**
 * Safely attempts to pull a backend-provided message from an Axios error chain.
 * @param error arbitrary caught error
 * @returns parsed message string or null if nothing useful was found
 */
const readResponseMessage = (error: unknown): string | null => {
  if (typeof error !== "object" || error === null) {
    return null;
  }

  const response = (error as ErrorResponsePayload).response;
  if (typeof response !== "object" || response === null) {
    return null;
  }

  const data = response.data;
  if (typeof data !== "object" || data === null) {
    return null;
  }

  const message = (data as { message?: unknown }).message;
  return typeof message === "string" ? message : null;
};

/**
 * Normalizes any thrown error into a human-friendly string suitable for toasts.
 */
const resolveErrorMessage = (error: unknown) => {
  const responseMessage = readResponseMessage(error);
  if (responseMessage) {
    return responseMessage;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};

interface UseAuthResult {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  success: string | null;
  login: (payload: LoginPayload) => Promise<LoginResponse>;
  register: (payload: RegisterPayload) => Promise<RegisterResponse>;
  logout: () => void;
  clearStatus: () => void;
  applyUserUpdate: (user: AuthUser) => void;
}

/**
 * Shared authentication hook that exposes current user/token along with
 * login/register/logout helpers.
 *
 * Preconditions:
 * - `apiClient` must be configured; backend auth routes must be reachable.
 * - Browser environment needs localStorage (for persistence).
 *
 * Postconditions:
 * - Returns memoized helpers/state for components.
 * - Persists auth tokens in localStorage and ensures Axios headers stay in sync.
 */
export function useAuth(): UseAuthResult {
  const { user: initialUser, token: initialToken } = loadPersistedAuth();
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [token, setToken] = useState<string | null>(initialToken);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const login = useCallback(async (payload: LoginPayload) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await loginRequest(payload);
      persistAuth(response);
      setUser(response.user);
      setToken(response.token);
      setSuccess(response.message ?? "Login successful!");
      return response;
    } catch (err) {
      const message = resolveErrorMessage(err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await registerRequest(payload);
      setSuccess(response.message ?? "Registration successful!");
      return response;
    } catch (err) {
      const message = resolveErrorMessage(err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearPersistedAuth();
    setUser(null);
    setToken(null);
  }, []);

  const clearStatus = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const applyUserUpdate = useCallback((updatedUser: AuthUser) => {
    setUser(updatedUser);
    persistUpdatedUser(updatedUser);
  }, []);

  return useMemo(
    () => ({
      user,
      token,
      loading,
      error,
      success,
      login,
      register,
      logout,
      clearStatus,
      applyUserUpdate,
    }),
    [user, token, loading, error, success, login, register, logout, clearStatus, applyUserUpdate]
  );
}
