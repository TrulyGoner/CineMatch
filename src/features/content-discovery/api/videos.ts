export interface TmdbVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

interface TmdbVideoResponse {
  results: TmdbVideo[];
}

export const fetchVideos = async (
  contentId: number,
  mediaType: 'movie' | 'tv',
  signal?: AbortSignal
): Promise<TmdbVideo[]> => {
  const { apiClient, fetchWithCache } = await import('@/shared/api/apiClient');
  const { tmdbLocale } = await import('@/shared/config/i18n');
  const endpoint = `/${mediaType}/${contentId}/videos`;
  const lang = tmdbLocale();
  const cacheKey = `videos_${lang}_${mediaType}_${contentId}`;

  try {
    const data = await fetchWithCache<TmdbVideoResponse>(
      cacheKey,
      async (abortSignal) => {
        const response = await apiClient.get<TmdbVideoResponse>(endpoint, {
          params: { language: lang },
          signal: abortSignal,
        });
        return response.data;
      },
      signal ?? new AbortController().signal
    );
    return data.results.filter((v) => v.site === 'YouTube' && v.type === 'Trailer');
  } catch {
    return [];
  }
};
