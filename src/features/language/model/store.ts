import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import i18n from '@/shared/config/i18n';
import { localStorageManager } from '@/shared/storage/localStorageManager';
import { STORAGE_KEYS } from '@/shared/config/constants';

export type SupportedLocale = 'ru' | 'en';

interface LanguageState {
  locale: SupportedLocale;
}

const loadLocale = (): SupportedLocale => {
  const saved = localStorageManager.get<string>(STORAGE_KEYS.locale);
  if (saved === 'ru' || saved === 'en') return saved;
  return 'ru';
};

const initialState: LanguageState = {
  locale: loadLocale(),
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLocale(state, action: PayloadAction<SupportedLocale>) {
      state.locale = action.payload;
      localStorageManager.set(STORAGE_KEYS.locale, action.payload);
      void i18n.changeLanguage(action.payload);
    },
  },
});

export const { setLocale } = languageSlice.actions;
export default languageSlice;

export const selectLocale = (state: { language: LanguageState }): SupportedLocale =>
  state.language.locale;
