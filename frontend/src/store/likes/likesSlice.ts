import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { executeGraphQL } from '../../api/client';
import {
  LIKES_QUERY,
  LIKE_QUERY,
  LIKES_BY_USER_QUERY,
  LIKES_FOR_CREATOR_QUERY,
  LIKE_OUTFIT_MUTATION,
  TOGGLE_LIKE_MUTATION,
  DELETE_LIKE_MUTATION,
} from '../../api/graphql/like';
import type { Like, MessagePayload } from '../../types/models';

interface LikesState {
  data: Like[];
  current?: Like | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: LikesState = {
  data: [],
  current: null,
  status: 'idle',
  error: null,
};

export const fetchLikesThunk = createAsyncThunk<Like[]>('likes/fetchAll', async () => {
  const data = await executeGraphQL<{ likes: Like[] }>(LIKES_QUERY);
  return data.likes;
});

export const fetchLikeThunk = createAsyncThunk<Like, number>('likes/fetchOne', async (id) => {
  const data = await executeGraphQL<{ like: Like }>(LIKE_QUERY, { id });
  return data.like;
});

export const fetchLikesByUserThunk = createAsyncThunk<Like[], number>('likes/byUser', async (userId) => {
  const data = await executeGraphQL<{ likesByUser: Like[] }>(LIKES_BY_USER_QUERY, { userId });
  return data.likesByUser;
});

export const fetchLikesForCreatorThunk = createAsyncThunk<Like[], number>('likes/forCreator', async (creatorId) => {
  const data = await executeGraphQL<{ likesForCreator: Like[] }>(LIKES_FOR_CREATOR_QUERY, { creatorId });
  return data.likesForCreator;
});

export const likeOutfitThunk = createAsyncThunk<Like, { user_id: number; outfit_id: number }>(
  'likes/likeOutfit',
  async (input) => {
    const data = await executeGraphQL<{ likeOutfit: Like }>(LIKE_OUTFIT_MUTATION, { input });
    return data.likeOutfit;
  },
);

export const toggleLikeThunk = createAsyncThunk<Like | null, { user_id: number; outfit_id: number }>(
  'likes/toggle',
  async (input) => {
    const data = await executeGraphQL<{ toggleLike: Like | null }>(TOGGLE_LIKE_MUTATION, { input });
    return data.toggleLike;
  },
);

export const deleteLikeThunk = createAsyncThunk<MessagePayload, number>('likes/delete', async (id) => {
  const data = await executeGraphQL<{ deleteLike: MessagePayload }>(DELETE_LIKE_MUTATION, { id });
  return data.deleteLike;
});

const likesSlice = createSlice({
  name: 'likes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLikesThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLikesThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchLikeThunk.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(likeOutfitThunk.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(toggleLikeThunk.fulfilled, (state, action) => {
        if (action.payload) {
          const existing = state.data.find((l) => l.like_id === action.payload?.like_id);
          if (!existing) {
            state.data.push(action.payload);
          }
        }
      });
  },
});

export default likesSlice.reducer;
