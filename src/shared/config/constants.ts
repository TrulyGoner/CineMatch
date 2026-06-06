export const STORAGE_KEYS = {
  behaviorEvents: 'user_behavior_events',
  contentCache: 'content_cache_v3',
  contentFallback: 'content_fallback_v3',
  recommendationCache: 'recommendation_cache_v3',
  weights: 'recommendation_weights',
  abTestMode: 'ab_test_mode',
} as const;

export const RECOMMENDATION_INTERVAL_MS = 30_000;
export const DEBOUNCE_MS = 300;
export const RECOMMENDATION_TOP_N = 10;
export const FRESHNESS_BONUS = 1.2;
export const FRESHNESS_DAYS_THRESHOLD = 30;

export const TMDB_GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
  10759: 'Action & Adventure',
  10762: 'Kids',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics',
};
