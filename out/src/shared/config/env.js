export const env = {
    tmdbApiKey: import.meta.env.VITE_TMDB_API_KEY,
    tmdbImageBase: 'https://image.tmdb.org/t/p/w500',
    tmdbApiBase: 'https://api.themoviedb.org/3',
};
export const hasApiKey = () => Boolean(env.tmdbApiKey && env.tmdbApiKey.length > 0);
