import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Content } from '@/entities/content/model/types';

interface ContentState {
  items: Content[];
  page: number;
  totalPages: number;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
  searchQuery: string;
  selectedGenre: string | null;
}

const initialState: ContentState = {
  items: [],
  page: 0,
  totalPages: 1,
  status: 'idle',
  error: null,
  searchQuery: '',
  selectedGenre: null,
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setLoading(state) {
      state.status = 'loading';
      state.error = null;
    },
    appendContent(
      state,
      action: PayloadAction<{ items: Content[]; page: number; totalPages: number }>
    ) {
      const newItems = action.payload.items.filter(
        (item) =>
          !state.items.some(
            (existing) => existing.id === item.id && existing.mediaType === item.mediaType
          )
      );
      state.items.push(...newItems);
      state.page = action.payload.page;
      state.totalPages = action.payload.totalPages;
      state.status = 'success';
    },
    setError(state, action: PayloadAction<string>) {
      state.status = 'error';
      state.error = action.payload;
    },
    resetContent(state) {
      state.items = [];
      state.page = 0;
      state.totalPages = 1;
      state.status = 'idle';
      state.error = null;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setSelectedGenre(state, action: PayloadAction<string | null>) {
      state.selectedGenre = action.payload;
    },
  },
});

export const {
  setLoading,
  appendContent,
  setError,
  resetContent,
  setSearchQuery,
  setSelectedGenre,
} = contentSlice.actions;
export default contentSlice;

export const selectAllContent = (state: { content: ContentState }): Content[] =>
  state.content.items;

export const selectFilteredContent = (state: { content: ContentState }): Content[] => {
  const { items, searchQuery, selectedGenre } = state.content;
  const query = searchQuery.trim().toLowerCase();

  return items.filter((item) => {
    const matchesGenre =
      !selectedGenre || item.genres.some((g) => g.toLowerCase() === selectedGenre.toLowerCase());

    const matchesSearch =
      !query ||
      item.title.toLowerCase().includes(query) ||
      item.overview.toLowerCase().includes(query);

    return matchesGenre && matchesSearch;
  });
};

export const selectContentStatus = (state: { content: ContentState }): ContentState['status'] =>
  state.content.status;

export const selectContentError = (state: { content: ContentState }): string | null =>
  state.content.error;

export const selectContentPage = (state: { content: ContentState }): number =>
  state.content.page;

export const selectHasMoreContent = (state: { content: ContentState }): boolean =>
  state.content.page < state.content.totalPages;

export const selectSearchQuery = (state: { content: ContentState }): string =>
  state.content.searchQuery;

export const selectSelectedGenre = (state: { content: ContentState }): string | null =>
  state.content.selectedGenre;
