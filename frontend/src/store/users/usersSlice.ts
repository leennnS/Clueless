import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { executeGraphQL } from '../../api/client';
import { USER_QUERY, USERS_QUERY, WARDROBE_SUMMARY_QUERY, UPDATE_USER_MUTATION } from '../../api/graphql/user';
import type { User, WardrobeSummary, UpdateUserInput } from '../../types/models';

interface UsersState {
  list: User[];
  current?: User | null;
  wardrobeSummary?: WardrobeSummary | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UsersState = {
  list: [],
  current: null,
  wardrobeSummary: null,
  status: 'idle',
  error: null,
};

export const fetchUsersThunk = createAsyncThunk<User[]>('users/fetchAll', async () => {
  const data = await executeGraphQL<{ users: User[] }>(USERS_QUERY);
  return data.users;
});

export const fetchUserThunk = createAsyncThunk<User, number>('users/fetchOne', async (id) => {
  const data = await executeGraphQL<{ user: User }>(USER_QUERY, { id });
  return data.user;
});

export const fetchCreatorProfileThunk = fetchUserThunk;

export const fetchWardrobeSummaryThunk = createAsyncThunk<WardrobeSummary, number>(
  'users/wardrobeSummary',
  async (userId) => {
    const data = await executeGraphQL<{ wardrobeSummary: WardrobeSummary }>(WARDROBE_SUMMARY_QUERY, { userId });
    return data.wardrobeSummary;
  },
);

export interface UpdateUserResult {
  message: string;
  user: User;
}

export const updateUserProfileThunk = createAsyncThunk<UpdateUserResult, UpdateUserInput>(
  'users/updateProfile',
  async (input) => {
    const data = await executeGraphQL<{ updateUser: UpdateUserResult }>(UPDATE_USER_MUTATION, { input });
    return data.updateUser;
  },
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to load users';
      })
      .addCase(fetchUserThunk.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(fetchWardrobeSummaryThunk.fulfilled, (state, action) => {
        state.wardrobeSummary = action.payload;
      })
      .addCase(updateUserProfileThunk.fulfilled, (state, action) => {
        state.current = action.payload.user;
      });
  },
});

export default usersSlice.reducer;
