import apiClient from "./apiClient";
import type { ClothingItemRecord } from "./clothingItemService";

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  profile_image_url?: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: AuthUser;
}

export interface RegisterResponse {
  message: string;
  user: AuthUser;
}

const TOKEN_STORAGE_KEY = "virtual-closet.token";
const USER_STORAGE_KEY = "virtual-closet.user";

/**
 * Applies or removes the Authorization header on the shared Axios client.
 *
 * Preconditions: Axios instance must exist.
 * Postconditions: Future requests include a `Bearer` token when present.
 */
export const setAuthHeader = (token: string | null) => {
  if (token && token.length > 0) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
};

/**
 * Persists a successful login payload to localStorage and Axios.
 *
 * Preconditions: Browser localStorage available; payload includes token/user.
 * Postconditions: Token & user cached and default Authorization header set.
 */
export const persistAuth = (auth: LoginResponse) => {
  localStorage.setItem(TOKEN_STORAGE_KEY, auth.token);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(auth.user));
  setAuthHeader(auth.token);
};

/**
 * Updates the cached user object while preserving the existing token.
 *
 * Preconditions: Token already stored from a prior login.
 * Postconditions: Local storage user snapshot mirrors latest profile data.
 */
export const persistUpdatedUser = (user: AuthUser) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (!token) {
    return;
  }
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

/**
 * Clears both token + user from storage and Axios defaults.
 *
 * Preconditions: none.
 * Postconditions: Subsequent API calls are unauthenticated until login occurs.
 */
export const clearPersistedAuth = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
  setAuthHeader(null);
};

/**
 * Reads cached auth state if available and primes Axios headers.
 *
 * Preconditions: localStorage values may be present.
 * Postconditions: Returns parsed `{ token, user }` or clears corrupted entries.
 */
export const loadPersistedAuth = () => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  const rawUser = localStorage.getItem(USER_STORAGE_KEY);

  if (!token || !rawUser) {
    return { token: null, user: null };
  }

  try {
    const parsedUser = JSON.parse(rawUser) as AuthUser;
    setAuthHeader(token);
    return { token, user: parsedUser };
  } catch {
    clearPersistedAuth();
    return { token: null, user: null };
  }
};

/**
 * Calls the NestJS login endpoint.
 *
 * Preconditions: Email/password payload validated by caller.
 * Postconditions: Resolves with `{ message, token, user }`.
 */
export const login = async (payload: LoginPayload) => {
  const response = await apiClient.post<LoginResponse>("/users/login", payload);
  return response.data;
};

/**
 * Registers a new user account.
 *
 * Preconditions: Valid username/email/password provided.
 * Postconditions: Returns `{ message, user }` (token issued after login).
 */
export const register = async (payload: RegisterPayload) => {
  const response = await apiClient.post<RegisterResponse>(
    "/users/register",
    payload
  );
  return response.data;
};

export interface UpdateUserPayload {
  username?: string;
  email?: string;
  password?: string;
  profile_image_url?: string | null;
}

export interface UpdateUserResponse {
  message: string;
  user: AuthUser;
}

/**
 * Updates profile details for the authenticated user.
 *
 * Preconditions: Caller must pass a valid `userId` and fields to update.
 * Postconditions: Returns the updated AuthUser object.
 */
export const updateUser = async (userId: number, payload: UpdateUserPayload) => {
  const response = await apiClient.put<UpdateUserResponse>(
    `/users/${userId}`,
    payload
  );
  return response.data;
};

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  token: string;
  emailDelivery: boolean;
  developmentCode?: string;
}

/**
 * Requests a password reset code emailed to the user.
 *
 * Preconditions: Email exists in the system.
 * Postconditions: Backend issues a token & optionally sends an email (or returns dev code).
 */
export const requestPasswordReset = async (payload: ForgotPasswordPayload) => {
  const response = await apiClient.post<ForgotPasswordResponse>(
    "/users/forgot-password",
    payload
  );
  return response.data;
};

export interface ResetPasswordPayload {
  token: string;
  code: string;
  password: string;
}

export interface ResetPasswordResponse {
  message: string;
}

/**
 * Confirms a password reset using the emailed code/token pair.
 *
 * Preconditions: Token+code pair must be valid and not expired.
 * Postconditions: User password hash is updated.
 */
export const resetPassword = async (payload: ResetPasswordPayload) => {
  const response = await apiClient.post<ResetPasswordResponse>(
    "/users/reset-password",
    payload
  );
  return response.data;
};

export interface PublicUserProfile {
  user_id: number;
  username: string;
  email: string;
  clothing_items?: ClothingItemRecord[];
}

/**
 * Fetches a creator's public profile including wardrobe preview.
 *
 * Preconditions: User id must exist.
 * Postconditions: Returns public fields + optional clothing items.
 */
export const getPublicUserProfile = async (userId: number) => {
  const response = await apiClient.get<PublicUserProfile>(`/users/${userId}`);
  return response.data;
};
