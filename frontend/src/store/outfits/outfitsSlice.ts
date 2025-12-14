import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { executeGraphQL } from '../../api/client';
import {
  OUTFITS_QUERY,
  OUTFIT_QUERY,
  OUTFITS_BY_USER_QUERY,
  PUBLIC_OUTFIT_FEED_QUERY,
  CREATE_OUTFIT_MUTATION,
  UPDATE_OUTFIT_MUTATION,
  DELETE_OUTFIT_MUTATION,
} from '../../api/graphql/outfit';
import { toggleLikeThunk } from '../likes/likesSlice';
import type { MessagePayload, Outfit } from '../../types/models';

interface OutfitsState {
  data: Outfit[];
  feed: Outfit[];
  current?: Outfit | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: OutfitsState = {
  data: [],
  feed: [],
  current: null,
  status: 'idle',
  error: null,
};

export const fetchOutfitsThunk = createAsyncThunk<Outfit[]>('outfits/fetchAll', async () => {
  const data = await executeGraphQL<{ outfits: Outfit[] }>(OUTFITS_QUERY);
  return data.outfits;
});

export const fetchOutfitThunk = createAsyncThunk<Outfit, number>('outfits/fetchOne', async (id) => {
  const data = await executeGraphQL<{ outfit: Outfit }>(OUTFIT_QUERY, { id });
  return data.outfit;
});

export const fetchUserOutfitsThunk = createAsyncThunk<Outfit[], number>('outfits/byUser', async (userId) => {
  const data = await executeGraphQL<{ outfitsByUser: Outfit[] }>(OUTFITS_BY_USER_QUERY, { userId });
  return data.outfitsByUser;
});

export const fetchPublicFeedThunk = createAsyncThunk<Outfit[], { search?: string; viewerId?: number }>(
  'outfits/publicFeed',
  async (variables) => {
    const data = await executeGraphQL<{ publicOutfitFeed: Outfit[] }>(PUBLIC_OUTFIT_FEED_QUERY, variables);
    return data.publicOutfitFeed;
  },
);

export const createOutfitThunk = createAsyncThunk<Outfit, Partial<Outfit>>('outfits/create', async (input) => {
  const data = await executeGraphQL<{ createOutfit: Outfit }>(CREATE_OUTFIT_MUTATION, { input });
  return data.createOutfit;
});

export const updateOutfitThunk = createAsyncThunk<Outfit, Partial<Outfit>>('outfits/update', async (input) => {
  const data = await executeGraphQL<{ updateOutfit: Outfit }>(UPDATE_OUTFIT_MUTATION, { input });
  return data.updateOutfit;
});

export const deleteOutfitThunk = createAsyncThunk<MessagePayload, number>('outfits/delete', async (id) => {
  const data = await executeGraphQL<{ deleteOutfit: MessagePayload }>(DELETE_OUTFIT_MUTATION, { id });
  return data.deleteOutfit;
});

const outfitsSlice = createSlice({
  name: 'outfits',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOutfitsThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOutfitsThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchOutfitsThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to load outfits';
      })
      .addCase(fetchOutfitThunk.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(fetchPublicFeedThunk.fulfilled, (state, action) => {
        state.feed = action.payload;
      })
      .addCase(fetchUserOutfitsThunk.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(toggleLikeThunk.fulfilled, (state, action) => {
        const outfitId = action.meta.arg.outfit_id;
        const liked = Boolean(action.payload);
        const adjustment = liked ? 1 : -1;
        state.feed = state.feed.map((outfit) => {
          if (outfit.outfit_id !== outfitId) {
            return outfit;
          }
          const currentCount = outfit.like_count ?? 0;
          const nextCount = Math.max(currentCount + adjustment, 0);
          return {
            ...outfit,
            like_count: nextCount,
            liked_by_viewer: liked,
          };
        });
      })
      .addCase(deleteOutfitThunk.fulfilled, (state, action) => {
        state.data = state.data.filter((outfit) => outfit.outfit_id !== (action.meta.arg ?? 0));
      })
      .addCase(createOutfitThunk.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateOutfitThunk.fulfilled, (state, action) => {
        state.data = state.data.map((o) => (o.outfit_id === action.payload.outfit_id ? action.payload : o));
      });
  },
});

export default outfitsSlice.reducer;
