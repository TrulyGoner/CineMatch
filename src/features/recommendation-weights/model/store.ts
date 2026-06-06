import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '@/shared/config/constants';
import { localStorageManager } from '@/shared/storage/localStorageManager';

export interface RecommendationWeights {
  genre: number;
  freshness: number;
  popularity: number;
}

const DEFAULT_WEIGHTS: RecommendationWeights = {
  genre: 70,
  freshness: 50,
  popularity: 40,
};

const loadWeights = (): RecommendationWeights =>
  localStorageManager.get<RecommendationWeights>(STORAGE_KEYS.weights) ?? DEFAULT_WEIGHTS;

interface WeightsState {
  values: RecommendationWeights;
}

const initialState: WeightsState = {
  values: loadWeights(),
};

const weightsSlice = createSlice({
  name: 'weights',
  initialState,
  reducers: {
    setWeight(
      state,
      action: PayloadAction<{ key: keyof RecommendationWeights; value: number }>
    ) {
      state.values[action.payload.key] = action.payload.value;
      localStorageManager.set(STORAGE_KEYS.weights, state.values);
    },
    resetWeights(state) {
      state.values = DEFAULT_WEIGHTS;
      localStorageManager.set(STORAGE_KEYS.weights, DEFAULT_WEIGHTS);
    },
  },
});

export const { setWeight, resetWeights } = weightsSlice.actions;
export default weightsSlice;

export const selectWeights = (state: { weights: WeightsState }): RecommendationWeights =>
  state.weights.values;
