export interface Achievement {
  id: string;
  key: string;
  icon: string;
  titleKey: string;
  descKey: string;
  condition: (stats: AchievementStats) => boolean;
}

export interface AchievementStats {
  ratingsCount: number;
  explorerDecisions: number;
  savedCount: number;
  likesGiven: number;
  viewsLogged: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_rating',
    key: 'first_rating',
    icon: '⭐',
    titleKey: 'achievements.firstRatingTitle',
    descKey: 'achievements.firstRatingDesc',
    condition: (s) => s.ratingsCount >= 1,
  },
  {
    id: 'explorer_10',
    key: 'explorer_10',
    icon: '🔍',
    titleKey: 'achievements.explorerTitle',
    descKey: 'achievements.explorerDesc',
    condition: (s) => s.explorerDecisions >= 10,
  },
  {
    id: 'collector_10',
    key: 'collector_10',
    icon: '📦',
    titleKey: 'achievements.collectorTitle',
    descKey: 'achievements.collectorDesc',
    condition: (s) => s.savedCount >= 10,
  },
  {
    id: 'collector_50',
    key: 'collector_50',
    icon: '🏛',
    titleKey: 'achievements.collector50Title',
    descKey: 'achievements.collector50Desc',
    condition: (s) => s.savedCount >= 50,
  },
  {
    id: 'critic_5',
    key: 'critic_5',
    icon: '🎬',
    titleKey: 'achievements.criticTitle',
    descKey: 'achievements.criticDesc',
    condition: (s) => s.ratingsCount >= 5,
  },
  {
    id: 'social_10',
    key: 'social_10',
    icon: '👍',
    titleKey: 'achievements.socialTitle',
    descKey: 'achievements.socialDesc',
    condition: (s) => s.likesGiven >= 10,
  },
  {
    id: 'viewer_100',
    key: 'viewer_100',
    icon: '👁',
    titleKey: 'achievements.viewerTitle',
    descKey: 'achievements.viewerDesc',
    condition: (s) => s.viewsLogged >= 100,
  },
];
