import type { Content, ContentPage } from '@/entities/content/model/types';
import { apiClient, fetchWithCache } from '@/shared/api/apiClient';
import { STORAGE_KEYS, TMDB_GENRE_MAP } from '@/shared/config/constants';
import { hasApiKey } from '@/shared/config/env';

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
    throw new Error(
      'Не задан VITE_TMDB_API_KEY. Создайте файл .env и добавьте ключ с https://www.themoviedb.org/settings/api'
    );
  }
};

const mapTmdbToContent = (item: TmdbItem, mediaType: TmdbMediaType): Content => {
  const genres = item.genre_ids
    .map((id) => TMDB_GENRE_MAP[id])
    .filter((g): g is string => Boolean(g));

  return {
    id: item.id,
    title: item.title ?? item.name ?? 'Без названия',
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
        params: { page },
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
  const cacheKey = `${STORAGE_KEYS.contentCache}_api_${isTv ? 'tv' : 'movie'}_${apiPage}`;

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

export { getContentPosterUrl, getPosterUrl, buildTmdbImageUrl } from '@/shared/lib/tmdbImages';
