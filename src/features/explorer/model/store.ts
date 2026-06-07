import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserBehaviorEvent } from '@/entities/analytics/model/types';
import { STORAGE_KEYS } from '@/shared/config/constants';
import { localStorageManager } from '@/shared/storage/localStorageManager';

interface ExplorerEntry {
  contentId: number;
  mediaType: 'movie' | 'tv';
  genres: string[];
  decision: 'like' | 'dislike' | 'skip';
  timestamp: number;
}

interface ExplorerState {
  entries: ExplorerEntry[];
  seenIds: string[];
  completed: boolean;
}

const loadExplorer = (): ExplorerState =>
  localStorageManager.get<ExplorerState>(STORAGE_KEYS.explorer) ?? {
    entries: [],
    seenIds: [],
    completed: false,
  };

const initialState: ExplorerState = loadExplorer();

const explorerSlice = createSlice({
  name: 'explorer',
  initialState,
  reducers: {
    recordDecision(state, action: PayloadAction<ExplorerEntry>) {
      const key = `${action.payload.mediaType}-${action.payload.contentId}`;
      const existing = state.entries.findIndex(
        (e) => e.contentId === action.payload.contentId && e.mediaType === action.payload.mediaType
      );
      if (existing >= 0) {
        state.entries[existing] = action.payload;
      } else {
        state.entries.push(action.payload);
      }
      if (!state.seenIds.includes(key)) {
        state.seenIds.push(key);
      }
      if (state.entries.filter((e) => e.decision !== 'skip').length >= 10) {
        state.completed = true;
      }
      localStorageManager.set(STORAGE_KEYS.explorer, state);
    },
    resetExplorer() {
      const empty = { entries: [], seenIds: [], completed: false };
      localStorageManager.set(STORAGE_KEYS.explorer, empty);
      return empty;
    },
  },
});

export const { recordDecision, resetExplorer } = explorerSlice.actions;
export default explorerSlice;

export const selectExplorerState = (state: { explorer: ExplorerState }): ExplorerState =>
  state.explorer;

export const selectExplorerCompleted = (state: { explorer: ExplorerState }): boolean =>
  state.explorer.completed;

export const selectSeenIds = (state: { explorer: ExplorerState }): string[] =>
  state.explorer.seenIds;

export const explorerProfileToEvents = (entries: ExplorerEntry[]): UserBehaviorEvent[] => {
  const events: UserBehaviorEvent[] = [];
  for (const entry of entries) {
    const weight = entry.decision === 'like' ? 3 : entry.decision === 'dislike' ? -1 : 0;
    if (weight === 0) continue;
    for (const genre of entry.genres) {
      for (let i = 0; i < Math.abs(weight); i++) {
        events.push({
          contentId: entry.contentId,
          type: 'click',
          timestamp: entry.timestamp,
          genre,
        });
      }
    }
  }
  return events;
};
