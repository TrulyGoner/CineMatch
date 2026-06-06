import type { AxiosError } from 'axios';
import { localStorageManager } from '@/shared/storage/localStorageManager';
import { STORAGE_KEYS } from '@/shared/config/constants';

export const getApiErrorMessage = (error: AxiosError): string => {
  const status = error.response?.status;

  if (status === 401) {
    return 'Неверный ключ TMDB. Используйте API Key (v3) или Read Access Token (v4) в .env';
  }
  if (status === 502) {
    return 'TMDB недоступен. Перезапустите dev-сервер или проверьте VPN/прокси';
  }
  if (status === 429) return 'Превышен лимит запросов. Попробуйте позже';
  if (status && status >= 500) return 'Ошибка сервера TMDB. Повторите запрос';

  return error.message || 'Не удалось загрузить данные';
};

export const getCachedFallback = <T>(): T | null =>
  localStorageManager.get<T>(STORAGE_KEYS.contentFallback);
