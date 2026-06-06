import { env } from '@/shared/config/env';

const normalizePath = (path: string): string => {
  const trimmed = path.trim();
  if (!trimmed) return '';

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

export const buildTmdbImageUrl = (
  path: string | null | undefined,
  size: 'w342' | 'w500' | 'w780' | 'original' = 'w500'
): string | null => {
  if (!path) return null;

  const normalized = normalizePath(path);
  if (!normalized) return null;

  if (normalized.startsWith('https://') || normalized.startsWith('http://')) {
    return normalized;
  }

  return `${env.tmdbImageOrigin}/t/p/${size}${normalized}`;
};

export const getContentPosterUrl = (
  posterPath: string | null | undefined,
  backdropPath?: string | null
): string | null =>
  buildTmdbImageUrl(posterPath, 'w500') ?? buildTmdbImageUrl(backdropPath, 'w780');

/** @deprecated use getContentPosterUrl */
export const getPosterUrl = (path: string | null): string | null =>
  buildTmdbImageUrl(path, 'w500');
