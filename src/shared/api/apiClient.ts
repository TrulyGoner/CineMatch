import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
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
  timeout: 15_000,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = env.tmdbApiKey?.trim();
  if (!token) return config;

  if (isBearerToken(token)) {
    config.headers.set('Authorization', `Bearer ${token}`);
  } else {
    config.params = { ...config.params, api_key: token };
  }

  return config;
});

export const fetchWithAbort = async <T>(
  url: string,
  signal?: AbortSignal
): Promise<T> => {
  try {
    const response = await apiClient.get<T>(url, { signal });
    return response.data;
  } catch (error) {
    if (axios.isCancel(error) || (error as Error).name === 'CanceledError') {
      throw new AbortError();
    }
    throw error;
  }
};

export const fetchWithCache = async <T>(
  key: string,
  fetcher: (signal: AbortSignal) => Promise<T>,
  signal?: AbortSignal
): Promise<T> => {
  try {
    const data = await fetcher(signal ?? new AbortController().signal);
    localStorageManager.set(key, data);
    if (key !== STORAGE_KEYS.contentFallback) {
      localStorageManager.set(STORAGE_KEYS.contentFallback, data);
    }
    return data;
  } catch (error) {
    if (error instanceof AbortError) throw error;

    const cached = localStorageManager.get<T>(key);
    if (cached) return cached;

    const fallback = localStorageManager.get<T>(STORAGE_KEYS.contentFallback);
    if (fallback) return fallback;

    const message =
      error instanceof AxiosError ? getApiErrorMessage(error) : 'Ошибка загрузки';
    throw new Error(message);
  }
};
