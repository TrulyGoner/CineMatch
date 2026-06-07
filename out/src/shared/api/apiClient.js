import axios, { AxiosError } from 'axios';
import i18n from '@/shared/config/i18n';
import { env } from '@/shared/config/env';
import { STORAGE_KEYS } from '@/shared/config/constants';
import { localStorageManager } from '@/shared/storage/localStorageManager';
import { getApiErrorMessage } from './interceptors';
import { isBearerToken } from './tmdbAuth';
export class AbortError extends Error {
    constructor() {
        super('Request aborted');
        this.name = 'AbortError';
    }
}
export const apiClient = axios.create({
    baseURL: env.tmdbApiBase,
    timeout: 15000,
});
apiClient.interceptors.request.use((config) => {
    const token = env.tmdbApiKey?.trim();
    if (!token)
        return config;
    if (isBearerToken(token)) {
        config.headers.set('Authorization', `Bearer ${token}`);
    }
    else {
        config.params = { ...config.params, api_key: token };
    }
    return config;
});
export const fetchWithAbort = async (url, signal) => {
    try {
        const response = await apiClient.get(url, { signal });
        return response.data;
    }
    catch (error) {
        if (axios.isCancel(error) || error.name === 'CanceledError') {
            throw new AbortError();
        }
        throw error;
    }
};
export const fetchWithCache = async (key, fetcher, signal) => {
    try {
        const data = await fetcher(signal ?? new AbortController().signal);
        localStorageManager.set(key, data);
        if (key !== STORAGE_KEYS.contentFallback) {
            localStorageManager.set(STORAGE_KEYS.contentFallback, data);
        }
        return data;
    }
    catch (error) {
        if (error instanceof AbortError)
            throw error;
        const cached = localStorageManager.get(key);
        if (cached)
            return cached;
        const fallback = localStorageManager.get(STORAGE_KEYS.contentFallback);
        if (fallback)
            return fallback;
        const message = error instanceof AxiosError ? getApiErrorMessage(error) : i18n.t('errors.loadingError');
        throw new Error(message, { cause: error });
    }
};
