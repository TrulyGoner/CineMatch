import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '@/shared/config/constants';
import { localStorageManager } from '@/shared/storage/localStorageManager';
import { ACHIEVEMENTS, type AchievementStats } from './definitions';

interface AchievementState {
  unlocked: string[];
  stats: AchievementStats;
}

const load = (): AchievementState =>
  localStorageManager.get<AchievementState>(STORAGE_KEYS.achievements) ?? {
    unlocked: [],
    stats: { ratingsCount: 0, explorerDecisions: 0, savedCount: 0, likesGiven: 0, viewsLogged: 0 },
  };

const initialState: AchievementState = load();

const achievementSlice = createSlice({
  name: 'achievements',
  initialState,
  reducers: {
    updateStat(state, action: PayloadAction<Partial<AchievementStats>>) {
      state.stats = { ...state.stats, ...action.payload };
      for (const ach of ACHIEVEMENTS) {
        if (!state.unlocked.includes(ach.id) && ach.condition(state.stats)) {
          state.unlocked.push(ach.id);
        }
      }
      localStorageManager.set(STORAGE_KEYS.achievements, state);
    },
    resetAchievements() {
      const empty: AchievementState = {
        unlocked: [],
        stats: { ratingsCount: 0, explorerDecisions: 0, savedCount: 0, likesGiven: 0, viewsLogged: 0 },
      };
      localStorageManager.set(STORAGE_KEYS.achievements, empty);
      return empty;
    },
  },
});

export const { updateStat, resetAchievements } = achievementSlice.actions;
export default achievementSlice;

export const selectAchievements = (state: { achievements: AchievementState }): AchievementState =>
  state.achievements;
