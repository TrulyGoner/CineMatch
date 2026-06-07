import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '@/shared/config/constants';
import { localStorageManager } from '@/shared/storage/localStorageManager';
const loadSaved = () => localStorageManager.get(STORAGE_KEYS.savedContent) ?? [];
const initialState = {
    ids: loadSaved(),
};
const savedContentSlice = createSlice({
    name: 'savedContent',
    initialState,
    reducers: {
        toggleSave(state, action) {
            const key = action.payload;
            const index = state.ids.indexOf(key);
            if (index === -1) {
                state.ids.push(key);
            }
            else {
                state.ids.splice(index, 1);
            }
            localStorageManager.set(STORAGE_KEYS.savedContent, state.ids);
        },
    },
});
export const { toggleSave } = savedContentSlice.actions;
export default savedContentSlice;
export const selectSavedIds = (state) => state.savedContent.ids;
export const selectIsSaved = (key) => (state) => state.savedContent.ids.includes(key);
