import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '@/shared/config/constants';
import { localStorageManager } from '@/shared/storage/localStorageManager';
const loadMode = () => localStorageManager.get(STORAGE_KEYS.abTestMode) ?? 'personalized';
const initialState = {
    mode: loadMode(),
};
const abTestSlice = createSlice({
    name: 'abTest',
    initialState,
    reducers: {
        setMode(state, action) {
            state.mode = action.payload;
            localStorageManager.set(STORAGE_KEYS.abTestMode, action.payload);
        },
        toggleMode(state) {
            state.mode = state.mode === 'personalized' ? 'random' : 'personalized';
            localStorageManager.set(STORAGE_KEYS.abTestMode, state.mode);
        },
    },
});
export const { setMode, toggleMode } = abTestSlice.actions;
export default abTestSlice;
export const selectABTestMode = (state) => state.abTest.mode;
