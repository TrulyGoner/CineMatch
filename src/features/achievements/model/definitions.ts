export interface Achievement {
  id: string;
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
    id: 'first_click',
    icon: 'star',
    titleKey: 'achievements.firstClick',
    descKey: 'achievements.firstClickDesc',
    condition: (s) => s.ratingsCount >= 1,
  },
  {
    id: 'explorer',
    icon: 'search',
    titleKey: 'achievements.explorer',
    descKey: 'achievements.explorerDesc',
    condition: (s) => s.explorerDecisions >= 10,
  },
  {
    id: 'collector',
    icon: 'package',
    titleKey: 'achievements.collector',
    descKey: 'achievements.collectorDesc',
    condition: (s) => s.savedCount >= 5,
  },
  {
    id: 'critic',
    icon: 'star',
    titleKey: 'achievements.critic',
    descKey: 'achievements.criticDesc',
    condition: (s) => s.ratingsCount >= 10,
  },
  {
    id: 'viewer',
    icon: 'eye',
    titleKey: 'achievements.viewer',
    descKey: 'achievements.viewerDesc',
    condition: (s) => s.viewsLogged >= 20,
  },
  {
    id: 'feedback_giver',
    icon: 'thumbs-up',
    titleKey: 'achievements.feedbackGiver',
    descKey: 'achievements.feedbackGiverDesc',
    condition: (s) => s.likesGiven >= 10,
  },
  {
    id: 'diversity',
    icon: 'rainbow',
    titleKey: 'achievements.diversity',
    descKey: 'achievements.diversityDesc',
    condition: (s) => s.ratingsCount >= 1 && s.explorerDecisions >= 1 && s.savedCount >= 1 && s.likesGiven >= 1,
  },
];
