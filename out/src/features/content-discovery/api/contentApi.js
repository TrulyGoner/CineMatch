import { fetchWithCache, AbortError } from '@/shared/api/apiClient';
import { STORAGE_KEYS, TMDB_GENRE_MAP } from '@/shared/config/constants';
import { env, hasApiKey } from '@/shared/config/env';
import { MOCK_CONTENT } from '@/shared/data/mockContent';
const mapTmdbToContent = (item, mediaType) => {
    const genres = item.genre_ids
        .map((id) => TMDB_GENRE_MAP[id])
        .filter((g) => Boolean(g));
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
const fetchTmdbPage = async (page, signal) => {
    const data = await fetchWithCache(`${STORAGE_KEYS.contentCache}_page_${page}`, async (abortSignal) => {
        const { default: axios } = await import('axios');
        const response = await axios.get(`${env.tmdbApiBase}/movie/popular`, {
            params: { api_key: env.tmdbApiKey, page },
            signal: abortSignal,
        });
        return response.data;
    }, signal);
    return {
        page: data.page,
        results: data.results.map((item) => mapTmdbToContent(item, 'movie')),
        totalPages: data.total_pages,
        totalResults: data.total_results,
    };
};
export const fetchMovies = async (page = 1, signal) => {
    if (!hasApiKey()) {
        const pageSize = 6;
        const start = (page - 1) * pageSize;
        const results = MOCK_CONTENT.slice(start, start + pageSize);
        return {
            page,
            results,
            totalPages: Math.ceil(MOCK_CONTENT.length / pageSize),
            totalResults: MOCK_CONTENT.length,
        };
    }
    try {
        return await fetchTmdbPage(page, signal ?? new AbortController().signal);
    }
    catch (error) {
        if (error instanceof AbortError)
            throw error;
        const pageSize = 6;
        const start = (page - 1) * pageSize;
        const results = MOCK_CONTENT.slice(start, start + pageSize);
        return {
            page,
            results,
            totalPages: Math.ceil(MOCK_CONTENT.length / pageSize),
            totalResults: MOCK_CONTENT.length,
        };
    }
};
export const getPosterUrl = (path) => path ? `${env.tmdbImageBase}${path}` : null;
