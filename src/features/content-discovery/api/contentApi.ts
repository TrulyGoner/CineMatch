import type { Content, ContentPage } from '@/entities/content/model/types';
import { apiClient, fetchWithCache } from '@/shared/api/apiClient';
import { STORAGE_KEYS, TMDB_GENRE_MAP, TMDB_GENRE_MAP_RU } from '@/shared/config/constants';
import { hasApiKey } from '@/shared/config/env';
import i18n, { tmdbLocale } from '@/shared/config/i18n';

type TmdbMediaType = 'movie' | 'tv';

interface TmdbItem {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  media_type?: TmdbMediaType | 'person';
}

interface TmdbResponse {
  page: number;
  results: TmdbItem[];
  total_pages: number;
  total_results: number;
}

const assertApiKey = (): void => {
  if (!hasApiKey()) {
    throw new Error(i18n.t('errors.apiKeyMissing'));
  }
};

const mapTmdbToContent = (item: TmdbItem, mediaType: TmdbMediaType): Content => {
  const genreMap = i18n.language === 'ru' ? TMDB_GENRE_MAP_RU : TMDB_GENRE_MAP;
  const genres = item.genre_ids
    .map((id) => genreMap[id])
    .filter((g): g is string => Boolean(g));

  return {
    id: item.id,
    title: item.title ?? item.name ?? i18n.t('contentApi.untitled'),
    overview: item.overview,
    posterPath: item.poster_path,
    backdropPath: item.backdrop_path,
    releaseDate: item.release_date ?? item.first_air_date ?? '2000-01-01',
    voteAverage: item.vote_average,
    voteCount: item.vote_count,
    genres,
    genreIds: item.genre_ids,
    mediaType,
    popularity: item.popularity,
  };
};

const fetchTmdbEndpoint = async (
  endpoint: string,
  page: number,
  cacheKey: string,
  signal: AbortSignal
): Promise<ContentPage> => {
  const data = await fetchWithCache<TmdbResponse>(
    cacheKey,
    async (abortSignal) => {
      const response = await apiClient.get<TmdbResponse>(endpoint, {
        params: { page, language: tmdbLocale() },
        signal: abortSignal,
      });
      return response.data;
    },
    signal
  );

  const mediaType: TmdbMediaType = endpoint.includes('/tv/') ? 'tv' : 'movie';

  return {
    page: data.page,
    results: data.results.map((item) => mapTmdbToContent(item, mediaType)),
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
};

/** Чётные страницы — сериалы, нечётные — фильмы. */
const fetchTmdbPage = async (page: number, signal: AbortSignal): Promise<ContentPage> => {
  const isTv = page % 2 === 0;
  const apiPage = Math.ceil(page / 2);
  const endpoint = isTv ? '/tv/popular' : '/movie/popular';
  const lang = tmdbLocale();
  const cacheKey = `${STORAGE_KEYS.contentCache}_${lang}_api_${isTv ? 'tv' : 'movie'}_${apiPage}`;

  return fetchTmdbEndpoint(endpoint, apiPage, cacheKey, signal);
};

export const fetchMovies = async (
  page = 1,
  signal?: AbortSignal
): Promise<ContentPage> => {
  assertApiKey();
  return fetchTmdbPage(page, signal ?? new AbortController().signal);
};

export const getContentKey = (item: Content): string => `${item.mediaType}-${item.id}`;

export const fetchSimilar = async (
  contentId: number,
  mediaType: 'movie' | 'tv',
  signal?: AbortSignal
): Promise<Content[]> => {
  assertApiKey();
  const endpoint = `/${mediaType}/${contentId}/similar`;
  const lang = tmdbLocale();
  const cacheKey = `similar_${lang}_${mediaType}_${contentId}`;

  try {
    const data = await fetchWithCache<TmdbResponse>(
      cacheKey,
      async (abortSignal) => {
        const response = await apiClient.get<TmdbResponse>(endpoint, {
          params: { language: lang },
          signal: abortSignal,
        });
        return response.data;
      },
      signal ?? new AbortController().signal
    );
    return data.results.map((item) => mapTmdbToContent(item, mediaType));
  } catch {
    return [];
  }
};

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority: number;
}

interface TmdbProviderResponse {
  results: Record<string, {
    flatrate?: WatchProvider[];
    rent?: WatchProvider[];
    buy?: WatchProvider[];
    link?: string;
  }>;
}

export const fetchWatchProviders = async (
  contentId: number,
  mediaType: 'movie' | 'tv',
  signal?: AbortSignal
): Promise<{
  flatrate: WatchProvider[];
  rent: WatchProvider[];
  buy: WatchProvider[];
  link: string | null;
}> => {
  assertApiKey();
  const endpoint = `/${mediaType}/${contentId}/watch/providers`;
  const lang = tmdbLocale();
  const cacheKey = `providers_${lang}_${mediaType}_${contentId}`;

  try {
    const data = await fetchWithCache<TmdbProviderResponse>(
      cacheKey,
      async (abortSignal) => {
        const response = await apiClient.get<TmdbProviderResponse>(endpoint, {
          params: { language: lang },
          signal: abortSignal,
        });
        return response.data;
      },
      signal ?? new AbortController().signal
    );
    const regionCode = lang === 'ru-RU' ? 'RU' : 'US';
    const region = data.results[regionCode] ?? data.results.US ?? data.results.RU ?? {};
    return {
      flatrate: region.flatrate ?? [],
      rent: region.rent ?? [],
      buy: region.buy ?? [],
      link: region.link ?? null,
    };
  } catch {
    return { flatrate: [], rent: [], buy: [], link: null };
  }
};

export { getContentPosterUrl, getPosterUrl, buildTmdbImageUrl } from '@/shared/lib/tmdbImages';
