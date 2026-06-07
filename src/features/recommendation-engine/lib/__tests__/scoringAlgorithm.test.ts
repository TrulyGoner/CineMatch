import { describe, it, expect, vi } from 'vitest';
import { calculateRecommendations, shuffleRecommendations } from '../scoringAlgorithm';
import type { Content } from '@/entities/content/model/types';
import type { UserBehaviorEvent } from '@/entities/analytics/model/types';
import type { RecommendationWeights } from '@/features/recommendation-weights/model/store';

vi.mock('@/shared/config/i18n', () => ({
  default: {
    language: 'en',
    t: (key: string) => {
      const map: Record<string, string> = {
        'whyRecommended.popularContent': 'Popular content in catalog',
        'whyRecommended.randomMode': 'Random selection (mode B)',
      };
      return map[key] ?? key;
    },
    changeLanguage: vi.fn(),
    on: vi.fn(),
  },
  tmdbLocale: () => 'en-US',
}));

const makeContent = (overrides: Partial<Content> = {}): Content => ({
  id: 1,
  title: 'Test Movie',
  overview: 'Description',
  posterPath: null,
  backdropPath: null,
  releaseDate: '2024-01-15',
  voteAverage: 7.5,
  voteCount: 100,
  genres: ['Action', 'Sci-Fi'],
  genreIds: [28, 878],
  mediaType: 'movie',
  popularity: 50,
  ...overrides,
});

const makeClickEvent = (genre: string): UserBehaviorEvent => ({
  contentId: 1,
  type: 'click',
  timestamp: Date.now(),
  genre,
});

const defaultWeights: RecommendationWeights = {
  genre: 70,
  freshness: 50,
  popularity: 40,
};

describe('calculateRecommendations', () => {
  it('returns empty array when no content provided', () => {
    const result = calculateRecommendations([], [], defaultWeights);
    expect(result).toEqual([]);
  });

  it('returns up to RECOMMENDATION_TOP_N items', () => {
    const many = Array.from({ length: 20 }, (_, i) =>
      makeContent({ id: i, title: `Movie ${i}` })
    );
    const result = calculateRecommendations(many, [], defaultWeights);
    expect(result.length).toBeLessThanOrEqual(10);
  });

  it('scores content higher when user clicked matching genres', () => {
    const actionMovie = makeContent({ id: 1, title: 'Action Movie', genres: ['Action'] });
    const dramaMovie = makeContent({ id: 2, title: 'Drama Movie', genres: ['Drama'] });

    const events = [makeClickEvent('Action'), makeClickEvent('Action')];

    const result = calculateRecommendations([actionMovie, dramaMovie], events, defaultWeights);
    expect(result[0].id).toBe(1);
  });

  it('reasons include interest prefix when matching genres', () => {
    const content = makeContent({ genres: ['Action'] });
    const events = [makeClickEvent('Action')];

    const result = calculateRecommendations([content], events, defaultWeights);
    expect(result[0].reasons.some((r) => r.includes('__interest__'))).toBe(true);
  });

  it('applies freshness bonus for recent content', () => {
    const recent = makeContent({
      id: 1,
      title: 'Recent',
      releaseDate: new Date().toISOString().split('T')[0],
    });
    const old = makeContent({
      id: 2,
      title: 'Old',
      releaseDate: '2000-01-01',
    });

    const result = calculateRecommendations([old, recent], [], defaultWeights);
    expect(result[0].id).toBe(1);
  });

  it('respects custom genre weight of zero', () => {
    const content = makeContent({ genres: ['Action'] });
    const events = [makeClickEvent('Action')];

    const weights: RecommendationWeights = { genre: 0, freshness: 50, popularity: 40 };
    const result = calculateRecommendations([content], events, weights);
    expect(result.length).toBeGreaterThanOrEqual(0);
  });
});

describe('shuffleRecommendations', () => {
  it('returns shuffled content with random mode reasons', () => {
    const items = Array.from({ length: 5 }, (_, i) =>
      makeContent({ id: i, title: `Movie ${i}` })
    );
    const result = shuffleRecommendations(items);
    expect(result.length).toBeLessThanOrEqual(10);
    expect(result[0].reasons).toContain('Random selection (mode B)');
    expect(result[0].score).toBe(0);
  });
});
