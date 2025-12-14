import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { executeGraphQL } from '../../api/client';
import { ASK_STYLIST_MUTATION } from '../../api/graphql/stylist';
import type {
  ShoppingSuggestion,
  StylistMessage,
  StylistOutfitSuggestion,
  StylistResponse,
} from '../../types/models';

export interface StylistState {
  messages: StylistMessage[];
  outfits: StylistOutfitSuggestion[];
  shoppingSuggestions: ShoppingSuggestion[];
  loading: boolean;
  error: string | null;
}

const initialState: StylistState = {
  messages: [],
  outfits: [],
  shoppingSuggestions: [],
  loading: false,
  error: null,
};

export const askStylistThunk = createAsyncThunk<
  StylistResponse,
  { userId: number; message: string }
>('stylist/askStylist', async (input) => {
  const data = await executeGraphQL<{ askStylist: StylistResponse }>(ASK_STYLIST_MUTATION, {
    input,
  });
  return data.askStylist;
});

const stylistSlice = createSlice({
  name: 'stylist',
  initialState,
  reducers: {
    clearStylistSession: () => ({
      ...initialState,
      messages: [],
      outfits: [],
      shoppingSuggestions: [],
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(askStylistThunk.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.messages.push({
          sender: 'user',
          text: action.meta.arg.message,
        });
      })
      .addCase(askStylistThunk.fulfilled, (state, action) => {
        state.loading = false;
        const assistantMessages = (action.payload.messages ?? []).filter(
          (message) => message.sender === 'assistant' && Boolean(message.text),
        );
        state.messages.push(
          ...assistantMessages.map((message) => ({
            sender: 'assistant' as const,
            text: message.text,
          })),
        );
        state.outfits = action.payload.outfits ?? [];
        state.shoppingSuggestions = action.payload.shoppingSuggestions ?? [];
      })
      .addCase(askStylistThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Stylist is unavailable right now.';
        state.messages.push({
          sender: 'assistant',
          text:
            'Sorry, I could not connect to your stylist right now. Please try again shortly.',
        });
      });
  },
});

export const { clearStylistSession } = stylistSlice.actions;
export default stylistSlice.reducer;
