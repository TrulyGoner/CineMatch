import { env } from '@/shared/config/env';

/** JWT Read Access Token (API v4) начинается с eyJ */
export const isBearerToken = (token: string): boolean => token.startsWith('eyJ');

export type TmdbAuthMode = 'bearer' | 'api_key';

export const getTmdbAuthMode = (): TmdbAuthMode | null => {
  const token = env.tmdbApiKey?.trim();
  if (!token) return null;
  return isBearerToken(token) ? 'bearer' : 'api_key';
};

interface TmdbAuthConfig {
  headers?: Record<string, string>;
  params?: Record<string, string | number>;
}

/** Единая авторизация: API Key (v3) или Bearer token (v4). */
export const withTmdbAuth = (
  params: Record<string, string | number> = {}
): TmdbAuthConfig => {
  const token = env.tmdbApiKey?.trim();
  if (!token) return { params };

  if (isBearerToken(token)) {
    return {
      headers: { Authorization: `Bearer ${token}` },
      params,
    };
  }

  return {
    params: { ...params, api_key: token },
  };
};
