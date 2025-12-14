import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { executeGraphQL } from '../../api/client';
import {
  CLOTHING_ITEMS_QUERY,
  CLOTHING_ITEM_QUERY,
  CLOTHING_ITEMS_BY_USER_QUERY,
  CREATE_CLOTHING_ITEM_MUTATION,
  UPDATE_CLOTHING_ITEM_MUTATION,
  DELETE_CLOTHING_ITEM_MUTATION,
} from '../../api/graphql/clothingItem';
import type {
  ClothingItem,
  MessagePayload,
  CreateClothingItemInput,
  UpdateClothingItemInput,
} from '../../types/models';

interface ClothingItemsState {
  data: ClothingItem[];
  current?: ClothingItem | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ClothingItemsState = {
  data: [],
  current: null,
  status: 'idle',
  error: null,
};

export const fetchClothingItemsThunk = createAsyncThunk<ClothingItem[]>(
  'clothingItems/fetchAll',
  async () => {
    const data = await executeGraphQL<{ clothingItems: ClothingItem[] }>(CLOTHING_ITEMS_QUERY);
    return data.clothingItems;
  },
);

export const fetchClothingItemThunk = createAsyncThunk<ClothingItem, number>(
  'clothingItems/fetchOne',
  async (id) => {
    const data = await executeGraphQL<{ clothingItem: ClothingItem }>(CLOTHING_ITEM_QUERY, { id });
    return data.clothingItem;
  },
);

export const fetchUserClothingItemsThunk = createAsyncThunk<ClothingItem[], number>(
  'clothingItems/fetchUser',
  async (userId) => {
    const data = await executeGraphQL<{ clothingItemsByUser: ClothingItem[] }>(
      CLOTHING_ITEMS_BY_USER_QUERY,
      { userId },
    );
    return data.clothingItemsByUser;
  },
);

export const createClothingItemThunk = createAsyncThunk<ClothingItem, CreateClothingItemInput>(
  'clothingItems/create',
  async (input) => {
   const data = await executeGraphQL<{ createClothingItem: ClothingItem }>(
  CREATE_CLOTHING_ITEM_MUTATION,
  { createClothingItemInput: input },
);

    return data.createClothingItem;
  },
);

export const updateClothingItemThunk = createAsyncThunk<ClothingItem, UpdateClothingItemInput>(
  'clothingItems/update',
  async (input) => {
   const data = await executeGraphQL<{ updateClothingItem: ClothingItem }>(
  UPDATE_CLOTHING_ITEM_MUTATION,
  { updateClothingItemInput: input },
);

    return data.updateClothingItem;
  },
);

export const deleteClothingItemThunk = createAsyncThunk<MessagePayload, number>(
  'clothingItems/delete',
  async (id) => {
    const data = await executeGraphQL<{ deleteClothingItem: MessagePayload }>(DELETE_CLOTHING_ITEM_MUTATION, {
      id,
    });
    return data.deleteClothingItem;
  },
);

const clothingItemsSlice = createSlice({
  name: 'clothingItems',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClothingItemsThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClothingItemsThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchClothingItemsThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to load wardrobe';
      })
      .addCase(fetchClothingItemThunk.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(fetchUserClothingItemsThunk.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(createClothingItemThunk.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateClothingItemThunk.fulfilled, (state, action) => {
        state.data = state.data.map((item) =>
          item.item_id === action.payload.item_id ? action.payload : item,
        );
      })
      .addCase(deleteClothingItemThunk.fulfilled, (state) => {
        state.status = 'succeeded';
      });
  },
});

export default clothingItemsSlice.reducer;
