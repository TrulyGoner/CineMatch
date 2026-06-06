import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '@/shared/config/constants';
import { localStorageManager } from '@/shared/storage/localStorageManager';
const DEFAULT_WEIGHTS = {
    genre: 70,
    freshness: 50,
    popularity: 40,
};
const loadWeights = () => localStorageManager.get(STORAGE_KEYS.weights) ?? DEFAULT_WEIGHTS;
const initialState = {
    values: loadWeights(),
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
    },
});
export const { setWeight, resetWeights } = weightsSlice.actions;
export default weightsSlice;
export const selectWeights = (state) => state.weights.values;
