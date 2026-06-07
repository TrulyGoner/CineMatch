import { createSlice } from '@reduxjs/toolkit';
const initialState = {
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
        appendContent(state, action) {
            const newItems = action.payload.items.filter((item) => !state.items.some((existing) => existing.id === item.id && existing.mediaType === item.mediaType));
            state.items.push(...newItems);
            state.page = action.payload.page;
            state.totalPages = action.payload.totalPages;
            state.status = 'success';
        },
        setError(state, action) {
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
        setSearchQuery(state, action) {
            state.searchQuery = action.payload;
        },
        setSelectedGenre(state, action) {
            state.selectedGenre = action.payload;
        },
    },
});
export const { setLoading, appendContent, setError, resetContent, setSearchQuery, setSelectedGenre, } = contentSlice.actions;
export default contentSlice;
export const selectAllContent = (state) => state.content.items;
export const selectFilteredContent = (state) => {
    const { items, searchQuery, selectedGenre } = state.content;
    const query = searchQuery.trim().toLowerCase();
    return items.filter((item) => {
        const matchesGenre = !selectedGenre || item.genres.some((g) => g.toLowerCase() === selectedGenre.toLowerCase());
        const matchesSearch = !query ||
            item.title.toLowerCase().includes(query) ||
            item.overview.toLowerCase().includes(query);
        return matchesGenre && matchesSearch;
    });
};
export const selectContentStatus = (state) => state.content.status;
export const selectContentError = (state) => state.content.error;
export const selectContentPage = (state) => state.content.page;
export const selectHasMoreContent = (state) => state.content.page < state.content.totalPages;
export const selectSearchQuery = (state) => state.content.searchQuery;
export const selectSelectedGenre = (state) => state.content.selectedGenre;
