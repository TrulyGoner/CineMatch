import type { Content } from '@/entities/content/model/types';
import type { Recommendation } from '@/entities/recommendation/model/types';
import type { UserBehaviorEvent } from '@/entities/analytics/model/types';
import type { RecommendationWeights } from '@/features/recommendation-weights/model/store';
import {
  FRESHNESS_BONUS,
  FRESHNESS_DAYS_THRESHOLD,
  RECOMMENDATION_TOP_N,
} from '@/shared/config/constants';

/**
 * Шаг 1: Собираем историю кликов пользователя по жанрам.
 */
const buildGenreClickMap = (events: UserBehaviorEvent[]): Record<string, number> => {
  const genreCounts: Record<string, number> = {};

  for (const event of events) {
    if (event.genre) {
      genreCounts[event.genre] = (genreCounts[event.genre] ?? 0) + 1;
    }
  }

  return genreCounts;
};

/**
 * Шаг 2–4: Для каждого контента считаем score = Σ(weight_genre × clicks_genre),
 * умножаем на freshness_factor (+20% для свежего) и применяем веса популярности.
 */
export const calculateRecommendations = (
  contents: Content[],
  events: UserBehaviorEvent[],
  weights: RecommendationWeights
): Recommendation[] => {
  const genreCounts = buildGenreClickMap(events);

  const scored: Recommendation[] = contents.map((content) => {
    // Step 2: genre preference score
    const genreScore = content.genres.reduce((sum, genre) => {
      const clicks = genreCounts[genre] ?? 0;
      return sum + clicks * (weights.genre / 100);
    }, 0);

    // Step 3: freshness factor — новый контент получает +20%
    const daysSinceRelease =
      (Date.now() - new Date(content.releaseDate).getTime()) / (1000 * 60 * 60 * 24);
    const freshnessMultiplier =
      daysSinceRelease < FRESHNESS_DAYS_THRESHOLD ? FRESHNESS_BONUS : 1;
    const freshnessScore =
      daysSinceRelease < FRESHNESS_DAYS_THRESHOLD ? (weights.freshness / 100) * freshnessMultiplier : 0;

    // Step 4: popularity with configurable weight
    const popularityScore = (content.voteAverage / 10) * (weights.popularity / 100);

    const totalScore = (genreScore + freshnessScore + popularityScore) * freshnessMultiplier;

    const topGenres = content.genres
      .filter((g) => (genreCounts[g] ?? 0) > 0)
      .sort((a, b) => (genreCounts[b] ?? 0) - (genreCounts[a] ?? 0))
      .slice(0, 2);

    const reasons =
      topGenres.length > 0
        ? [`На основе вашего интереса к: ${topGenres.join(', ')}`]
        : ['Популярный контент в каталоге'];

    return { ...content, score: totalScore, reasons };
  });

  // Step 5: топ 5–10 по убыванию score
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, RECOMMENDATION_TOP_N);
};

export const shuffleRecommendations = (contents: Content[]): Recommendation[] => {
  const shuffled = [...contents];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, RECOMMENDATION_TOP_N).map((content) => ({
    ...content,
    score: 0,
    reasons: ['Случайная подборка (режим B)'],
  }));
};
