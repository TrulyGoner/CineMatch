import { createSlice } from '@reduxjs/toolkit';
import i18n from '@/shared/config/i18n';
import { localStorageManager } from '@/shared/storage/localStorageManager';
import { STORAGE_KEYS } from '@/shared/config/constants';
const loadLocale = () => {
    const saved = localStorageManager.get(STORAGE_KEYS.locale);
    if (saved === 'ru' || saved === 'en')
        return saved;
    return 'ru';
};
const initialState = {
    locale: loadLocale(),
};
const languageSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {
        setLocale(state, action) {
            state.locale = action.payload;
            localStorageManager.set(STORAGE_KEYS.locale, action.payload);
            void i18n.changeLanguage(action.payload);
        },
    },
});
export const { setLocale } = languageSlice.actions;
export default languageSlice;
export const selectLocale = (state) => state.language.locale;
