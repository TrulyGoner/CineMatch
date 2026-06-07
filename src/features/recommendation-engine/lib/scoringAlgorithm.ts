import i18n from '@/shared/config/i18n';
import type { Content } from '@/entities/content/model/types';
import type { Recommendation } from '@/entities/recommendation/model/types';
import type { UserBehaviorEvent } from '@/entities/analytics/model/types';
import type { RecommendationWeights } from '@/features/recommendation-weights/model/store';
import {
  FRESHNESS_BONUS,
  FRESHNESS_DAYS_THRESHOLD,
  RECOMMENDATION_TOP_N,
} from '@/shared/config/constants';

const buildGenreClickMap = (events: UserBehaviorEvent[]): Record<string, number> => {
  const genreCounts: Record<string, number> = {};
  for (const event of events) {
    if (event.genre) {
      genreCounts[event.genre] = (genreCounts[event.genre] ?? 0) + 1;
    }
  }
  return genreCounts;
};

interface ExternalSignals {
  ratings?: Record<string, number>;
  feedbackLikes?: string[];
  feedbackDislikes?: string[];
}

export const calculateRecommendations = (
  contents: Content[],
  events: UserBehaviorEvent[],
  weights: RecommendationWeights,
  externalSignals?: ExternalSignals
): Recommendation[] => {
  const genreCounts = buildGenreClickMap(events);
  const ratings = externalSignals?.ratings ?? {};
  const likes = new Set(externalSignals?.feedbackLikes ?? []);
  const dislikes = new Set(externalSignals?.feedbackDislikes ?? []);

  const scored: Recommendation[] = contents.map((content) => {
    const contentKey = `${content.mediaType}-${content.id}`;

    const genreScore = content.genres.reduce((sum, genre) => {
      const clicks = genreCounts[genre] ?? 0;
      return sum + clicks * (weights.genre / 100);
    }, 0);

    const daysSinceRelease =
      (Date.now() - new Date(content.releaseDate).getTime()) / (1000 * 60 * 60 * 24);
    const freshnessMultiplier =
      daysSinceRelease < FRESHNESS_DAYS_THRESHOLD ? FRESHNESS_BONUS : 1;
    const freshnessScore =
      daysSinceRelease < FRESHNESS_DAYS_THRESHOLD ? (weights.freshness / 100) * freshnessMultiplier : 0;

    const popularityScore = (content.voteAverage / 10) * (weights.popularity / 100);

    // User rating bonus: 0-5 mapped to 0-0.5 boost
    const userRating = ratings[contentKey] ?? 0;
    const ratingBonus = userRating > 0 ? userRating * 0.1 : 0;

    // Feedback multiplier
    let feedbackMultiplier = 1;
    if (likes.has(contentKey)) feedbackMultiplier = 1.5;
    if (dislikes.has(contentKey)) feedbackMultiplier = 0.3;

    const totalScore = (genreScore + freshnessScore + popularityScore + ratingBonus) * freshnessMultiplier * feedbackMultiplier;

    const topGenres = content.genres
      .filter((g) => (genreCounts[g] ?? 0) > 0)
      .sort((a, b) => (genreCounts[b] ?? 0) - (genreCounts[a] ?? 0))
      .slice(0, 2);

    const reasons =
      topGenres.length > 0
        ? [`__interest__:${topGenres.join(',')}`]
        : [i18n.t('whyRecommended.popularContent')];

    if (userRating > 0) reasons.push(i18n.t('whyRecommended.ratingHigh'));
    if (dislikes.has(contentKey)) reasons.push(i18n.t('whyRecommended.disliked'));

    return { ...content, score: totalScore, reasons };
  });

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
    reasons: [i18n.t('whyRecommended.randomMode')],
  }));
};

type GroupedRecommendations = Record<string, Recommendation[]>;

export const groupByGenre = (recommendations: Recommendation[]): GroupedRecommendations => {
  const groups: GroupedRecommendations = {};

  for (const rec of recommendations) {
    const key = rec.genres[0] ?? 'Other';
    if (!groups[key]) groups[key] = [];
    groups[key].push(rec);
  }

  // sort groups by total score descending
  const sorted: GroupedRecommendations = {};
  Object.entries(groups)
    .sort(([, a], [, b]) => {
      const sumA = a.reduce((s, r) => s + r.score, 0);
      const sumB = b.reduce((s, r) => s + r.score, 0);
      return sumB - sumA;
    })
    .forEach(([genre, items]) => { sorted[genre] = items; });

  return sorted;
};
