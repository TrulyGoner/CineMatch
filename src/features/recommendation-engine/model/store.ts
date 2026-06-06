import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Recommendation } from '@/entities/recommendation/model/types';
import { localStorageManager } from '@/shared/storage/localStorageManager';
import { STORAGE_KEYS } from '@/shared/config/constants';

interface RecommendationCache {
  hash: string;
  items: Recommendation[];
}

interface RecommendationState {
  items: Recommendation[];
  status: 'idle' | 'loading' | 'success' | 'error';
  cacheHash: string;
  lastUpdated: number;
}

const loadCache = (): RecommendationCache | null =>
  localStorageManager.get<RecommendationCache>(STORAGE_KEYS.recommendationCache);

const initialState: RecommendationState = {
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
    setRecommendations(
      state,
      action: PayloadAction<{ items: Recommendation[]; hash: string }>
    ) {
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

export const selectRecommendations = (state: { recommendations: RecommendationState }): Recommendation[] =>
  state.recommendations.items;

export const selectRecommendationStatus = (
  state: { recommendations: RecommendationState }
): RecommendationState['status'] => state.recommendations.status;

export const selectRecommendationCacheHash = (
  state: { recommendations: RecommendationState }
): string => state.recommendations.cacheHash;
