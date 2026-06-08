const isDev = import.meta.env.DEV;

export const env = {
  tmdbApiKey: import.meta.env.VITE_TMDB_API_KEY as string | undefined,
  /** В dev — через прокси Vite, чтобы обойти блокировку TMDB CDN. */
  tmdbImageOrigin: isDev ? '/tmdb-img' : 'https://image.tmdb.org',
  tmdbApiBase: isDev ? '/tmdb-api/3' : 'https://api.themoviedb.org/3',
} as const;

export const hasApiKey = (): boolean =>
  Boolean(env.tmdbApiKey && env.tmdbApiKey.length > 0);
