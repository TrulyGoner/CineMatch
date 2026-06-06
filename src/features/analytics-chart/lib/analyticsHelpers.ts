import type {
  UserBehaviorEvent,
  EngagementPoint,
  GenreHeatmapCell,
} from '@/entities/analytics/model/types';
import type { Recommendation } from '@/entities/recommendation/model/types';

export const buildEngagementData = (events: UserBehaviorEvent[]): EngagementPoint[] => {
  const buckets = new Map<string, { clicks: number; views: number }>();

  for (const event of events) {
    const date = new Date(event.timestamp);
    const key = `${date.getHours().toString().padStart(2, '0')}:00`;
    const bucket = buckets.get(key) ?? { clicks: 0, views: 0 };

    if (event.type === 'click') bucket.clicks += 1;
    if (event.type === 'view') bucket.views += 1;

    buckets.set(key, bucket);
  }

  if (buckets.size === 0) {
    return [{ time: '12:00', clicks: 0, views: 0 }];
  }

  return Array.from(buckets.entries())
    .map(([time, data]) => ({ time, ...data }))
    .sort((a, b) => a.time.localeCompare(b.time));
};

export const buildGenreHeatmap = (events: UserBehaviorEvent[]): GenreHeatmapCell[] => {
  const counts = new Map<string, number>();

  for (const event of events) {
    if (event.genre) {
      counts.set(event.genre, (counts.get(event.genre) ?? 0) + 1);
    }
  }

  const max = Math.max(...Array.from(counts.values()), 1);

  return Array.from(counts.entries())
    .map(([genre, count]) => ({
      genre,
      count,
      intensity: count / max,
    }))
    .sort((a, b) => b.count - a.count);
};

export const calculatePersonalizationScore = (
  events: UserBehaviorEvent[],
  recommendations: Recommendation[]
): number => {
  if (recommendations.length === 0) return 0;

  const genreCounts: Record<string, number> = {};
  for (const event of events) {
    if (event.genre) {
      genreCounts[event.genre] = (genreCounts[event.genre] ?? 0) + 1;
    }
  }

  const topGenres = Object.entries(genreCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([genre]) => genre);

  if (topGenres.length === 0) return 35;

  const matched = recommendations.filter((rec) =>
    rec.genres.some((g) => topGenres.includes(g))
  ).length;

  return Math.round((matched / recommendations.length) * 100);
};
