import type { UserBehaviorEvent } from '@/entities/analytics/model/types';
import type { Content } from '@/entities/content/model/types';
import type { Recommendation } from '@/entities/recommendation/model/types';

interface GenreProfile {
  genre: string;
  score: number;
}

const buildGenreProfiles = (
  allEvents: UserBehaviorEvent[]
): Map<string, GenreProfile[]> => {
  const userMap = new Map<string, Map<string, number>>();

  for (const event of allEvents) {
    const key = `user_${event.contentId}_${event.type}`;
    if (!userMap.has(key)) {
      userMap.set(key, new Map());
    }
    const profile = userMap.get(key)!
    if (event.genre) {
      profile.set(event.genre, (profile.get(event.genre) ?? 0) + 1);
    }
  }

  const result = new Map<string, GenreProfile[]>();
  for (const [key, genres] of userMap) {
    const profiles: GenreProfile[] = [];
    for (const [genre, score] of genres) {
      profiles.push({ genre, score });
    }
    result.set(key, profiles);
  }
  return result;
};

export const computeCollaborativeScore = (
  content: Content,
  _userEvents: UserBehaviorEvent[],
  _allEvents: UserBehaviorEvent[]
): number => {
  const profiles = buildGenreProfiles(_allEvents);
  let totalScore = 0;

  for (const [, genres] of profiles) {
    for (const pg of genres) {
      if (content.genres.includes(pg.genre)) {
        totalScore += pg.score * 0.3;
      }
    }
  }

  return totalScore;
};

export const getCollaborativeRecommendations = (
  candidates: Content[],
  userEvents: UserBehaviorEvent[],
  allEvents: UserBehaviorEvent[],
  topN: number = 4
): Recommendation[] => {
  const scored = candidates
    .map((c) => ({
      ...c,
      score: computeCollaborativeScore(c, userEvents, allEvents),
      reasons: [] as string[],
    }))
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);

  return scored;
};
