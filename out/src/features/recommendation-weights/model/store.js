import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '@/shared/config/constants';
import { localStorageManager } from '@/shared/storage/localStorageManager';
const DEFAULT_WEIGHTS = {
    genre: 70,
    freshness: 50,
    popularity: 40,
};
const loadWeights = () => localStorageManager.get(STORAGE_KEYS.weights) ?? DEFAULT_WEIGHTS;
const loadPresets = () => localStorageManager.get(STORAGE_KEYS.presets) ?? [];
const initialState = {
    values: loadWeights(),
    presets: loadPresets(),
};
const weightsSlice = createSlice({
    name: 'weights',
    initialState,
    reducers: {
        setWeight(state, action) {
            state.values[action.payload.key] = action.payload.value;
            localStorageManager.set(STORAGE_KEYS.weights, state.values);
        },
        resetWeights(state) {
            state.values = DEFAULT_WEIGHTS;
            localStorageManager.set(STORAGE_KEYS.weights, DEFAULT_WEIGHTS);
        },
        savePreset(state, action) {
            const existing = state.presets.findIndex((p) => p.name === action.payload.name);
            const preset = { name: action.payload.name, values: { ...state.values } };
            if (existing >= 0) {
                state.presets[existing] = preset;
            }
            else {
                state.presets.push(preset);
            }
            localStorageManager.set(STORAGE_KEYS.presets, state.presets);
        },
        applyPreset(state, action) {
            const preset = state.presets.find((p) => p.name === action.payload.name);
            if (preset) {
                state.values = { ...preset.values };
                localStorageManager.set(STORAGE_KEYS.weights, state.values);
            }
        },
        deletePreset(state, action) {
            state.presets = state.presets.filter((p) => p.name !== action.payload.name);
            localStorageManager.set(STORAGE_KEYS.presets, state.presets);
        },
    },
});
export const { setWeight, resetWeights, savePreset, applyPreset, deletePreset } = weightsSlice.actions;
export default weightsSlice;
export const selectWeights = (state) => state.weights.values;
export const selectPresets = (state) => state.weights.presets;
