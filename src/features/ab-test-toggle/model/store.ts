import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '@/shared/config/constants';
import { localStorageManager } from '@/shared/storage/localStorageManager';

export type ABTestMode = 'personalized' | 'random';

const loadMode = (): ABTestMode =>
  localStorageManager.get<ABTestMode>(STORAGE_KEYS.abTestMode) ?? 'personalized';

interface ABTestState {
  mode: ABTestMode;
}

const initialState: ABTestState = {
  mode: loadMode(),
};

const abTestSlice = createSlice({
  name: 'abTest',
  initialState,
  reducers: {
    setMode(state, action: PayloadAction<ABTestMode>) {
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

export const selectABTestMode = (state: { abTest: ABTestState }): ABTestMode =>
  state.abTest.mode;
