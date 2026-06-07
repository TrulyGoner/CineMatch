import i18n from '@/shared/config/i18n';
import { localStorageManager } from '@/shared/storage/localStorageManager';
import { STORAGE_KEYS } from '@/shared/config/constants';
export const getApiErrorMessage = (error) => {
    const status = error.response?.status;
    if (status === 401)
        return i18n.t('errors.invalidKey');
    if (status === 502)
        return i18n.t('errors.tmdbUnavailable');
    if (status === 429)
        return i18n.t('errors.rateLimit');
    if (status && status >= 500)
        return i18n.t('errors.serverError');
    return error.message || i18n.t('errors.loadFailed');
};
export const getCachedFallback = () => localStorageManager.get(STORAGE_KEYS.contentFallback);
