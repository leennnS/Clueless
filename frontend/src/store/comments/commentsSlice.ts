import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { executeGraphQL } from '../../api/client';
import {
  COMMENTS_BY_OUTFIT_QUERY,
  COMMENT_QUERY,
  CREATE_COMMENT_MUTATION,
  UPDATE_COMMENT_MUTATION,
  DELETE_COMMENT_MUTATION,
} from '../../api/graphql/comment';
import type { Comment, MessagePayload } from '../../types/models';

interface CommentsState {
  data: Comment[];
  current?: Comment | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CommentsState = {
  data: [],
  current: null,
  status: 'idle',
  error: null,
};

export const fetchCommentsByOutfitThunk = createAsyncThunk<Comment[], number>(
  'comments/byOutfit',
  async (outfitId) => {
    const data = await executeGraphQL<{ commentsByOutfit: Comment[] }>(COMMENTS_BY_OUTFIT_QUERY, { outfitId });
    return data.commentsByOutfit;
  },
);

export const fetchCommentThunk = createAsyncThunk<Comment, number>('comments/fetchOne', async (id) => {
  const data = await executeGraphQL<{ comment: Comment }>(COMMENT_QUERY, { id });
  return data.comment;
});

export const createCommentThunk = createAsyncThunk<Comment, { content: string; user_id: number; outfit_id: number }>(
  'comments/create',
  async (input) => {
    const data = await executeGraphQL<{ createComment: Comment }>(CREATE_COMMENT_MUTATION, { input });
    return data.createComment;
  },
);

export const updateCommentThunk = createAsyncThunk<Comment, { comment_id: number; content?: string }>(
  'comments/update',
  async (input) => {
    const data = await executeGraphQL<{ updateComment: Comment }>(UPDATE_COMMENT_MUTATION, { input });
    return data.updateComment;
  },
);

export const deleteCommentThunk = createAsyncThunk<MessagePayload, number>('comments/delete', async (id) => {
  const data = await executeGraphQL<{ deleteComment: MessagePayload }>(DELETE_COMMENT_MUTATION, { id });
  return data.deleteComment;
});

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentsByOutfitThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCommentsByOutfitThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchCommentThunk.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(createCommentThunk.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateCommentThunk.fulfilled, (state, action) => {
        state.data = state.data.map((c) => (c.comment_id === action.payload.comment_id ? action.payload : c));
      });
  },
});

export default commentsSlice.reducer;
