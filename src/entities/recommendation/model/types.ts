import type { Content } from '@/entities/content/model/types';

export interface RecommendationScore {
  contentId: number;
  score: number;
}

export interface RecommendationReason {
  text: string;
  genres: string[];
}

export interface Recommendation extends Content {
  score: number;
  reasons: string[];
}
