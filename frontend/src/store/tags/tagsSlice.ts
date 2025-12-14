import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { executeGraphQL } from '../../api/client';
import {
  TAGS_QUERY,
  TAG_QUERY,
  CREATE_TAG_MUTATION,
  UPDATE_TAG_MUTATION,
  DELETE_TAG_MUTATION,
} from '../../api/graphql/tag';
import type { MessagePayload, Tag } from '../../types/models';

interface TagsState {
  data: Tag[];
  current?: Tag | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TagsState = {
  data: [],
  current: null,
  status: 'idle',
  error: null,
};

export const fetchTagsThunk = createAsyncThunk<Tag[]>('tags/fetchAll', async () => {
  const data = await executeGraphQL<{ tags: Tag[] }>(TAGS_QUERY);
  return data.tags;
});

export const fetchTagThunk = createAsyncThunk<Tag, number>('tags/fetchOne', async (id) => {
  const data = await executeGraphQL<{ tag: Tag }>(TAG_QUERY, { id });
  return data.tag;
});

export const createTagThunk = createAsyncThunk<Tag, { name: string }>('tags/create', async (input) => {
  const data = await executeGraphQL<{ createTag: Tag }>(CREATE_TAG_MUTATION, { input });
  return data.createTag;
});

export const updateTagThunk = createAsyncThunk<Tag, Tag>('tags/update', async (input) => {
  const data = await executeGraphQL<{ updateTag: Tag }>(UPDATE_TAG_MUTATION, { input });
  return data.updateTag;
});

export const deleteTagThunk = createAsyncThunk<MessagePayload, number>('tags/delete', async (id) => {
  const data = await executeGraphQL<{ deleteTag: MessagePayload }>(DELETE_TAG_MUTATION, { id });
  return data.deleteTag;
});

const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTagsThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTagsThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchTagThunk.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(createTagThunk.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateTagThunk.fulfilled, (state, action) => {
        state.data = state.data.map((tag) => (tag.tag_id === action.payload.tag_id ? action.payload : tag));
      });
  },
});

export default tagsSlice.reducer;
