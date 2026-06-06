import { createSlice } from '@reduxjs/toolkit';
import { localStorageManager } from '@/shared/storage/localStorageManager';
import { STORAGE_KEYS } from '@/shared/config/constants';
const loadCache = () => localStorageManager.get(STORAGE_KEYS.recommendationCache);
const initialState = {
    items: loadCache()?.items ?? [],
    status: 'idle',
    cacheHash: loadCache()?.hash ?? '',
    lastUpdated: 0,
};
const recommendationSlice = createSlice({
    name: 'recommendations',
    initialState,
    reducers: {
        setLoading(state) {
            state.status = 'loading';
        },
        setRecommendations(state, action) {
            state.items = action.payload.items;
            state.cacheHash = action.payload.hash;
            state.status = 'success';
            state.lastUpdated = Date.now();
            localStorageManager.set(STORAGE_KEYS.recommendationCache, {
                hash: action.payload.hash,
                items: action.payload.items,
            });
        },
        setError(state) {
            state.status = 'error';
        },
    },
});
export const { setLoading, setRecommendations, setError } = recommendationSlice.actions;
export default recommendationSlice;
export const selectRecommendations = (state) => state.recommendations.items;
export const selectRecommendationStatus = (state) => state.recommendations.status;
export const selectRecommendationCacheHash = (state) => state.recommendations.cacheHash;
