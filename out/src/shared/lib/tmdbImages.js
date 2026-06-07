import { env } from '@/shared/config/env';
const normalizePath = (path) => {
    const trimmed = path.trim();
    if (!trimmed)
        return '';
    if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
        return trimmed;
    }
    if (trimmed.startsWith('//')) {
        return `https:${trimmed}`;
    }
    if (trimmed.includes('image.tmdb.org')) {
        const withoutProtocol = trimmed.replace(/^https?:\/\//, '');
        return `https://${withoutProtocol}`;
    }
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
};
export const buildTmdbImageUrl = (path, size = 'w500') => {
    if (!path)
        return null;
    const normalized = normalizePath(path);
    if (!normalized)
        return null;
    if (normalized.startsWith('https://') || normalized.startsWith('http://')) {
        return normalized;
    }
    return `${env.tmdbImageOrigin}/t/p/${size}${normalized}`;
};
export const getContentPosterUrl = (posterPath, backdropPath) => buildTmdbImageUrl(posterPath, 'w500') ?? buildTmdbImageUrl(backdropPath, 'w780');
/** @deprecated use getContentPosterUrl */
export const getPosterUrl = (path) => buildTmdbImageUrl(path, 'w500');
