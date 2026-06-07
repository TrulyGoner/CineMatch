import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { localStorageManager } from '@/shared/storage/localStorageManager';
import { STORAGE_KEYS } from '@/shared/config/constants';
import ru from './locales/ru.json';
import en from './locales/en.json';
const savedLocale = localStorageManager.get(STORAGE_KEYS.locale) ?? 'ru';
i18n.use(initReactI18next).init({
    resources: {
        ru: { translation: ru },
        en: { translation: en },
    },
    lng: savedLocale,
    fallbackLng: 'ru',
    interpolation: { escapeValue: false },
    returnObjects: false,
});
i18n.on('languageChanged', (lng) => {
    document.documentElement.lang = lng;
});
export const tmdbLocale = () => (i18n.language === 'ru' ? 'ru-RU' : 'en-US');
export default i18n;
