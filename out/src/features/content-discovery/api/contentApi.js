import { apiClient, fetchWithCache } from '@/shared/api/apiClient';
import { STORAGE_KEYS, TMDB_GENRE_MAP, TMDB_GENRE_MAP_RU } from '@/shared/config/constants';
import { hasApiKey } from '@/shared/config/env';
import i18n, { tmdbLocale } from '@/shared/config/i18n';
const assertApiKey = () => {
    if (!hasApiKey()) {
        throw new Error(i18n.t('errors.apiKeyMissing'));
    }
};
const mapTmdbToContent = (item, mediaType) => {
    const genreMap = i18n.language === 'ru' ? TMDB_GENRE_MAP_RU : TMDB_GENRE_MAP;
    const genres = item.genre_ids
        .map((id) => genreMap[id])
        .filter((g) => Boolean(g));
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
const fetchTmdbEndpoint = async (endpoint, page, cacheKey, signal) => {
    const data = await fetchWithCache(cacheKey, async (abortSignal) => {
        const response = await apiClient.get(endpoint, {
            params: { page, language: tmdbLocale() },
            signal: abortSignal,
        });
        return response.data;
    }, signal);
    const mediaType = endpoint.includes('/tv/') ? 'tv' : 'movie';
    return {
        page: data.page,
        results: data.results.map((item) => mapTmdbToContent(item, mediaType)),
        totalPages: data.total_pages,
        totalResults: data.total_results,
    };
};
/** Чётные страницы — сериалы, нечётные — фильмы. */
const fetchTmdbPage = async (page, signal) => {
    const isTv = page % 2 === 0;
    const apiPage = Math.ceil(page / 2);
    const endpoint = isTv ? '/tv/popular' : '/movie/popular';
    const lang = tmdbLocale();
    const cacheKey = `${STORAGE_KEYS.contentCache}_${lang}_api_${isTv ? 'tv' : 'movie'}_${apiPage}`;
    return fetchTmdbEndpoint(endpoint, apiPage, cacheKey, signal);
};
export const fetchMovies = async (page = 1, signal) => {
    assertApiKey();
    return fetchTmdbPage(page, signal ?? new AbortController().signal);
};
export const getContentKey = (item) => `${item.mediaType}-${item.id}`;
export const fetchSimilar = async (contentId, mediaType, signal) => {
    assertApiKey();
    const endpoint = `/${mediaType}/${contentId}/similar`;
    const lang = tmdbLocale();
    const cacheKey = `similar_${lang}_${mediaType}_${contentId}`;
    try {
        const data = await fetchWithCache(cacheKey, async (abortSignal) => {
            const response = await apiClient.get(endpoint, {
                params: { language: lang },
                signal: abortSignal,
            });
            return response.data;
        }, signal ?? new AbortController().signal);
        return data.results.map((item) => mapTmdbToContent(item, mediaType));
    }
    catch {
        return [];
    }
};
export { getContentPosterUrl, getPosterUrl, buildTmdbImageUrl } from '@/shared/lib/tmdbImages';
