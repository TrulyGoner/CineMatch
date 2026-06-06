import { localStorageManager } from '@/shared/storage/localStorageManager';
import { STORAGE_KEYS } from '@/shared/config/constants';
export const getApiErrorMessage = (error) => {
    const status = error.response?.status;
    if (status === 401)
        return 'Неверный API-ключ TMDB. Проверьте .env';
    if (status === 429)
        return 'Превышен лимит запросов. Попробуйте позже';
    if (status && status >= 500)
        return 'Ошибка сервера TMDB. Повторите запрос';
    return error.message || 'Не удалось загрузить данные';
};
export const getCachedFallback = () => localStorageManager.get(STORAGE_KEYS.contentFallback);
