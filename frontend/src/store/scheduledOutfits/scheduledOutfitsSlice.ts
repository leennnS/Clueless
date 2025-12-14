import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { executeGraphQL } from '../../api/client';
import {
  SCHEDULED_OUTFITS_QUERY,
  SCHEDULED_OUTFITS_BY_USER_QUERY,
  SCHEDULED_OUTFIT_QUERY,
  CREATE_SCHEDULED_OUTFIT_MUTATION,
  UPDATE_SCHEDULED_OUTFIT_MUTATION,
  DELETE_SCHEDULED_OUTFIT_MUTATION,
} from '../../api/graphql/scheduledOutfit';
import type { MessagePayload, ScheduledOutfit } from '../../types/models';

interface ScheduledOutfitsState {
  data: ScheduledOutfit[];
  current?: ScheduledOutfit | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ScheduledOutfitsState = {
  data: [],
  current: null,
  status: 'idle',
  error: null,
};

export const fetchScheduledOutfitsThunk = createAsyncThunk<ScheduledOutfit[]>(
  'scheduledOutfits/fetchAll',
  async () => {
    const data = await executeGraphQL<{ scheduledOutfits: ScheduledOutfit[] }>(SCHEDULED_OUTFITS_QUERY);
    return data.scheduledOutfits;
  },
);

export const fetchScheduledOutfitsByUserThunk = createAsyncThunk<ScheduledOutfit[], number>(
  'scheduledOutfits/byUser',
  async (userId) => {
    const data = await executeGraphQL<{ scheduledOutfitsByUser: ScheduledOutfit[] }>(
      SCHEDULED_OUTFITS_BY_USER_QUERY,
      { userId },
    );
    return data.scheduledOutfitsByUser;
  },
);

export const fetchScheduledOutfitThunk = createAsyncThunk<ScheduledOutfit, number>(
  'scheduledOutfits/fetchOne',
  async (id) => {
    const data = await executeGraphQL<{ scheduledOutfit: ScheduledOutfit }>(SCHEDULED_OUTFIT_QUERY, { id });
    return data.scheduledOutfit;
  },
);

export const createScheduledOutfitThunk = createAsyncThunk<ScheduledOutfit, Partial<ScheduledOutfit>>(
  'scheduledOutfits/create',
  async (input) => {
    const data = await executeGraphQL<{ createScheduledOutfit: ScheduledOutfit }>(
      CREATE_SCHEDULED_OUTFIT_MUTATION,
      { input },
    );
    return data.createScheduledOutfit;
  },
);

export const updateScheduledOutfitThunk = createAsyncThunk<ScheduledOutfit, Partial<ScheduledOutfit>>(
  'scheduledOutfits/update',
  async (input) => {
    const data = await executeGraphQL<{ updateScheduledOutfit: ScheduledOutfit }>(
      UPDATE_SCHEDULED_OUTFIT_MUTATION,
      { input },
    );
    return data.updateScheduledOutfit;
  },
);

export const deleteScheduledOutfitThunk = createAsyncThunk<MessagePayload, number>(
  'scheduledOutfits/delete',
  async (id) => {
    const data = await executeGraphQL<{ deleteScheduledOutfit: MessagePayload }>(
      DELETE_SCHEDULED_OUTFIT_MUTATION,
      { id },
    );
    return data.deleteScheduledOutfit;
  },
);

const scheduledOutfitsSlice = createSlice({
  name: 'scheduledOutfits',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchScheduledOutfitsThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchScheduledOutfitsThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchScheduledOutfitsThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to load scheduled outfits';
      })
      .addCase(fetchScheduledOutfitThunk.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(createScheduledOutfitThunk.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateScheduledOutfitThunk.fulfilled, (state, action) => {
        state.data = state.data.map((s) => (s.schedule_id === action.payload.schedule_id ? action.payload : s));
      });
  },
});

export default scheduledOutfitsSlice.reducer;
