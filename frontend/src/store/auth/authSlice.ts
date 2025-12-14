import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { executeGraphQL, setAuthToken } from '../../api/client';
import {
  LOGIN_MUTATION,
  REGISTER_MUTATION,
  REQUEST_PASSWORD_RESET_MUTATION,
  RESET_PASSWORD_MUTATION,
  ME_QUERY,
} from '../../api/graphql/auth';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User, AuthPayload, MessagePayload } from '../../types/models';

export interface AuthState {
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  success: string | null;
}

const persistedToken = localStorage.getItem('virtual-closet.token');
const persistedUser = localStorage.getItem('virtual-closet.user');

if (persistedToken) {
  setAuthToken(persistedToken);
}

const initialState: AuthState = {
  user: persistedUser ? (JSON.parse(persistedUser) as User) : null,
  token: persistedToken,
  status: 'idle',
  error: null,
  success: null,
};

const persistAuth = (token: string, user: User) => {
  localStorage.setItem('virtual-closet.token', token);
  localStorage.setItem('virtual-closet.user', JSON.stringify(user));
  setAuthToken(token);
};

export const loginThunk = createAsyncThunk<AuthPayload, { email: string; password: string }>(
  'auth/login',
  async (payload) => {
    const data = await executeGraphQL<{ login: AuthPayload }>(LOGIN_MUTATION, { input: payload });
    return data.login;
  },
);

export const registerThunk = createAsyncThunk<User, { username: string; email: string; password: string }>(
  'auth/register',
  async (payload) => {
    const data = await executeGraphQL<{ register: { user: User } }>(REGISTER_MUTATION, { input: payload });
    return data.register.user;
  },
);

export const meThunk = createAsyncThunk<User>('auth/me', async () => {
  const data = await executeGraphQL<{ me: User }>(ME_QUERY);
  return data.me;
});

export interface PasswordResetRequestPayload extends MessagePayload {
  resetToken?: string;
  resetCode?: string;
  email?: string;
}

export const requestPasswordResetThunk = createAsyncThunk<PasswordResetRequestPayload, { email: string }>(
  'auth/requestReset',
  async (payload) => {
    const data = await executeGraphQL<{ requestPasswordReset: PasswordResetRequestPayload }>(
      REQUEST_PASSWORD_RESET_MUTATION,
      { input: payload },
    );
    return data.requestPasswordReset;
  },
);

export const resetPasswordThunk = createAsyncThunk<MessagePayload, { token: string; code: string; password: string }>(
  'auth/resetPassword',
  async (payload) => {
    const data = await executeGraphQL<{ resetPassword: MessagePayload }>(RESET_PASSWORD_MUTATION, { input: payload });
    return data.resetPassword;
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      state.success = null;
      localStorage.removeItem('virtual-closet.token');
      localStorage.removeItem('virtual-closet.user');
      setAuthToken(null);
    },
    setAuth(state, action: PayloadAction<AuthPayload>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
       state.success = action.payload.message ?? null;
      state.error = null;
      persistAuth(action.payload.token, action.payload.user);
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      if (state.token) {
        persistAuth(state.token, action.payload);
      }
    },
    clearStatus(state) {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.success = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.success = action.payload.message ?? 'Logged in successfully';
        persistAuth(action.payload.token, action.payload.user);
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Login failed';
      })
      .addCase(registerThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.success = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.success = 'Registration successful';
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Registration failed';
      })
      .addCase(meThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        if (state.token) {
          persistAuth(state.token, action.payload);
        }
      });
  },
});

export const { logout, setAuth, setUser, clearStatus } = authSlice.actions;
export default authSlice.reducer;
