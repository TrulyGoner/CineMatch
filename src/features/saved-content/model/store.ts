import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '@/shared/config/constants';
import { localStorageManager } from '@/shared/storage/localStorageManager';

interface SavedContentState {
  ids: string[];
}

const loadSaved = (): string[] =>
  localStorageManager.get<string[]>(STORAGE_KEYS.savedContent) ?? [];

const initialState: SavedContentState = {
  ids: loadSaved(),
};

const savedContentSlice = createSlice({
  name: 'savedContent',
  initialState,
  reducers: {
    toggleSave(state, action: PayloadAction<string>) {
      const key = action.payload;
      const index = state.ids.indexOf(key);
      if (index === -1) {
        state.ids.push(key);
      } else {
        state.ids.splice(index, 1);
      }
      localStorageManager.set(STORAGE_KEYS.savedContent, state.ids);
    },
  },
});

export const { toggleSave } = savedContentSlice.actions;
export default savedContentSlice;

export const selectSavedIds = (state: { savedContent: SavedContentState }): string[] =>
  state.savedContent.ids;

export const selectIsSaved = (key: string) => (state: { savedContent: SavedContentState }): boolean =>
  state.savedContent.ids.includes(key);
