import axios from 'axios';
import { env } from '@/shared/config/env';
import { STORAGE_KEYS } from '@/shared/config/constants';
import { localStorageManager } from '@/shared/storage/localStorageManager';
import { getApiErrorMessage } from './interceptors';
export class AbortError extends Error {
    constructor() {
        super('Request aborted');
        this.name = 'AbortError';
    }
}
export const apiClient = axios.create({
    baseURL: env.tmdbApiBase,
    params: { api_key: env.tmdbApiKey ?? '' },
    timeout: 10000,
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
        const message = error instanceof AxiosError ? getApiErrorMessage(error) : 'Ошибка загрузки';
        throw new Error(message);
    }
};
