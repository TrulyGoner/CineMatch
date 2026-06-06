export type BehaviorEventType = 'click' | 'view' | 'search' | 'filter';

export interface UserBehaviorEvent {
  contentId: number;
  type: BehaviorEventType;
  timestamp: number;
  genre?: string;
  duration?: number;
  query?: string;
}

export interface ClickEvent {
  contentId: number;
  timestamp: number;
  genre?: string;
}

export interface SessionData {
  sessionId: string;
  startTime: number;
  events: UserBehaviorEvent[];
}

export interface EngagementPoint {
  time: string;
  clicks: number;
  views: number;
}

export interface GenreHeatmapCell {
  genre: string;
  count: number;
  intensity: number;
}
