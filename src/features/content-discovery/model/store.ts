import { createSlice, createSelector, type PayloadAction } from '@reduxjs/toolkit';
import type { Content } from '@/entities/content/model/types';

type SortField = 'default' | 'rating' | 'releaseDate' | 'popularity';

interface ContentState {
  items: Content[];
  page: number;
  totalPages: number;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
  searchQuery: string;
  selectedGenre: string | null;
  sortBy: SortField;
}

const initialState: ContentState = {
  items: [],
  page: 0,
  totalPages: 1,
  status: 'idle',
  error: null,
  searchQuery: '',
  selectedGenre: null,
  sortBy: 'default',
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
    setSortBy(state, action: PayloadAction<SortField>) {
      state.sortBy = action.payload;
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
  setSortBy,
} = contentSlice.actions;
export default contentSlice;

export const selectAllContent = (state: { content: ContentState }): Content[] =>
  state.content.items;

const selectContentState = (state: { content: ContentState }): ContentState => state.content;

export const selectFilteredContent = createSelector(
  selectContentState,
  (content) => {
    const { items, searchQuery, selectedGenre, sortBy } = content;
    const query = searchQuery.trim().toLowerCase();

    let filtered = items.filter((item) => {
      const matchesGenre =
        !selectedGenre || item.genres.some((g) => g.toLowerCase() === selectedGenre.toLowerCase());

      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.overview.toLowerCase().includes(query);

      return matchesGenre && matchesSearch;
    });

    if (sortBy === 'rating') {
      filtered = [...filtered].sort((a, b) => b.voteAverage - a.voteAverage);
    } else if (sortBy === 'releaseDate') {
      filtered = [...filtered].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
    } else if (sortBy === 'popularity') {
      filtered = [...filtered].sort((a, b) => b.popularity - a.popularity);
    }

    return filtered;
  }
);

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

export const selectSortBy = (state: { content: ContentState }): SortField =>
  state.content.sortBy;
