import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '@/shared/config/constants';
import { localStorageManager } from '@/shared/storage/localStorageManager';

export interface RecommendationWeights {
  genre: number;
  freshness: number;
  popularity: number;
}

export interface WeightPreset {
  name: string;
  values: RecommendationWeights;
}

const DEFAULT_WEIGHTS: RecommendationWeights = {
  genre: 70,
  freshness: 50,
  popularity: 40,
};

const loadWeights = (): RecommendationWeights =>
  localStorageManager.get<RecommendationWeights>(STORAGE_KEYS.weights) ?? DEFAULT_WEIGHTS;

const loadPresets = (): WeightPreset[] =>
  localStorageManager.get<WeightPreset[]>(STORAGE_KEYS.presets) ?? [];

interface WeightsState {
  values: RecommendationWeights;
  presets: WeightPreset[];
}

const initialState: WeightsState = {
  values: loadWeights(),
  presets: loadPresets(),
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
    savePreset(state, action: PayloadAction<{ name: string }>) {
      const existing = state.presets.findIndex((p) => p.name === action.payload.name);
      const preset: WeightPreset = { name: action.payload.name, values: { ...state.values } };
      if (existing >= 0) {
        state.presets[existing] = preset;
      } else {
        state.presets.push(preset);
      }
      localStorageManager.set(STORAGE_KEYS.presets, state.presets);
    },
    applyPreset(state, action: PayloadAction<{ name: string }>) {
      const preset = state.presets.find((p) => p.name === action.payload.name);
      if (preset) {
        state.values = { ...preset.values };
        localStorageManager.set(STORAGE_KEYS.weights, state.values);
      }
    },
    deletePreset(state, action: PayloadAction<{ name: string }>) {
      state.presets = state.presets.filter((p) => p.name !== action.payload.name);
      localStorageManager.set(STORAGE_KEYS.presets, state.presets);
    },
  },
});

export const { setWeight, resetWeights, savePreset, applyPreset, deletePreset } = weightsSlice.actions;
export default weightsSlice;

export const selectWeights = (state: { weights: WeightsState }): RecommendationWeights =>
  state.weights.values;

export const selectPresets = (state: { weights: WeightsState }): WeightPreset[] =>
  state.weights.presets;
