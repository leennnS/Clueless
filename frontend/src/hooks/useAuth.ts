import { useCallback, useMemo } from "react";
import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector } from "./useAppSelector";
import {
  clearStatus as clearStatusAction,
  loginThunk,
  logout as logoutAction,
  meThunk,
  registerThunk,
  setUser,
} from "../store/auth/authSlice";
import type { User } from "../types/models";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

interface UseAuthResult {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  success: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  clearStatus: () => void;
  applyUserUpdate: (user: User) => void;
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
  const dispatch = useAppDispatch();
  const { user, token, status, error, success } = useAppSelector((state) => state.auth);

  const login = useCallback(async (payload: LoginPayload) => {
    await dispatch(loginThunk(payload)).unwrap();
    await dispatch(meThunk()).unwrap().catch(() => undefined);
  }, [dispatch]);

  const register = useCallback(async (payload: RegisterPayload) => {
    await dispatch(registerThunk(payload)).unwrap();
    await dispatch(loginThunk({ email: payload.email, password: payload.password })).unwrap();
    await dispatch(meThunk()).unwrap().catch(() => undefined);
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch(logoutAction());
  }, [dispatch]);

  const clearStatus = useCallback(() => {
    dispatch(clearStatusAction());
  }, [dispatch]);

  const applyUserUpdate = useCallback(
    (updatedUser: User) => {
      dispatch(setUser(updatedUser));
    },
    [dispatch]
  );

  return useMemo(
    () => ({
      user,
      token,
      loading: status === "loading",
      error,
      success,
      login,
      register,
      logout,
      clearStatus,
      applyUserUpdate,
    }),
    [user, token, status, error, success, login, register, logout, clearStatus, applyUserUpdate]
  );
}
