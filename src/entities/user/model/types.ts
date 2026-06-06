export interface User {
  id: string;
  name: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  favoriteGenres: string[];
  maxWatchTime: number;
  interests: string[];
}

import type { UserBehaviorEvent } from '@/entities/analytics/model/types';

export interface UserSession {
  id: string;
  startTime: number;
  lastActivity: number;
  events: UserBehaviorEvent[];
}