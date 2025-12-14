import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { executeGraphQL } from '../../api/client';
import {
  OUTFIT_ITEMS_QUERY,
  OUTFIT_ITEM_QUERY,
  OUTFIT_ITEMS_BY_OUTFIT_QUERY,
  CREATE_OUTFIT_ITEM_MUTATION,
  UPDATE_OUTFIT_ITEM_MUTATION,
  DELETE_OUTFIT_ITEM_MUTATION,
} from '../../api/graphql/outfitItem';
import type { MessagePayload, OutfitItem } from '../../types/models';

interface OutfitItemsState {
  data: OutfitItem[];
  current?: OutfitItem | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: OutfitItemsState = {
  data: [],
  current: null,
  status: 'idle',
  error: null,
};

export const fetchOutfitItemsThunk = createAsyncThunk<OutfitItem[]>('outfitItems/fetchAll', async () => {
  const data = await executeGraphQL<{ outfitItems: OutfitItem[] }>(OUTFIT_ITEMS_QUERY);
  return data.outfitItems;
});

export const fetchOutfitItemThunk = createAsyncThunk<OutfitItem, number>('outfitItems/fetchOne', async (id) => {
  const data = await executeGraphQL<{ outfitItem: OutfitItem }>(OUTFIT_ITEM_QUERY, { id });
  return data.outfitItem;
});

export const fetchOutfitItemsByOutfitThunk = createAsyncThunk<OutfitItem[], number>(
  'outfitItems/byOutfit',
  async (outfitId) => {
    const data = await executeGraphQL<{ outfitItemsByOutfit: OutfitItem[] }>(OUTFIT_ITEMS_BY_OUTFIT_QUERY, {
      outfitId,
    });
    return data.outfitItemsByOutfit;
  },
);

export const createOutfitItemThunk = createAsyncThunk<OutfitItem, Partial<OutfitItem>>(
  'outfitItems/create',
  async (input) => {
    const data = await executeGraphQL<{ createOutfitItem: OutfitItem }>(CREATE_OUTFIT_ITEM_MUTATION, { input });
    return data.createOutfitItem;
  },
);

export const updateOutfitItemThunk = createAsyncThunk<OutfitItem, Partial<OutfitItem>>(
  'outfitItems/update',
  async (input) => {
    const data = await executeGraphQL<{ updateOutfitItem: OutfitItem }>(UPDATE_OUTFIT_ITEM_MUTATION, { input });
    return data.updateOutfitItem;
  },
);

export const deleteOutfitItemThunk = createAsyncThunk<MessagePayload, number>('outfitItems/delete', async (id) => {
  const data = await executeGraphQL<{ deleteOutfitItem: MessagePayload }>(DELETE_OUTFIT_ITEM_MUTATION, { id });
  return data.deleteOutfitItem;
});

const outfitItemsSlice = createSlice({
  name: 'outfitItems',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOutfitItemsThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOutfitItemsThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchOutfitItemThunk.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(fetchOutfitItemsByOutfitThunk.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(createOutfitItemThunk.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateOutfitItemThunk.fulfilled, (state, action) => {
        state.data = state.data.map((oi) => (oi.outfit_item_id === action.payload.outfit_item_id ? action.payload : oi));
      });
  },
});

export default outfitItemsSlice.reducer;
