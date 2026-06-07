const isDev = import.meta.env.DEV;
export const env = {
    tmdbApiKey: import.meta.env.VITE_TMDB_API_KEY,
    /** В dev — через прокси Vite, чтобы обойти блокировку TMDB CDN. */
    tmdbImageOrigin: isDev ? '/tmdb-img' : 'https://image.tmdb.org',
    tmdbApiBase: isDev ? '/tmdb-api/3' : 'https://api.themoviedb.org/3',
};
export const hasApiKey = () => Boolean(env.tmdbApiKey && env.tmdbApiKey.length > 0);
