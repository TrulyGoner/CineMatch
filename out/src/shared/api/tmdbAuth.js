import { env } from '@/shared/config/env';
/** JWT Read Access Token (API v4) начинается с eyJ */
export const isBearerToken = (token) => token.startsWith('eyJ');
export const getTmdbAuthMode = () => {
    const token = env.tmdbApiKey?.trim();
    if (!token)
        return null;
    return isBearerToken(token) ? 'bearer' : 'api_key';
};
/** Единая авторизация: API Key (v3) или Bearer token (v4). */
export const withTmdbAuth = (params = {}) => {
    const token = env.tmdbApiKey?.trim();
    if (!token)
        return { params };
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
