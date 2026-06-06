import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserBehaviorEvent } from '@/entities/analytics/model/types';
import { STORAGE_KEYS } from '@/shared/config/constants';
import { localStorageManager } from '@/shared/storage/localStorageManager';
import { indexedDBManager } from '@/shared/storage/indexedDBManager';

const loadEvents = (): UserBehaviorEvent[] =>
  localStorageManager.get<UserBehaviorEvent[]>(STORAGE_KEYS.behaviorEvents) ?? [];

interface BehaviorState {
  events: UserBehaviorEvent[];
  behaviorHash: string;
}

const computeHash = (events: UserBehaviorEvent[]): string =>
  JSON.stringify(events.map((e) => `${e.contentId}:${e.type}:${e.timestamp}`));

const initialState: BehaviorState = {
  events: loadEvents(),
  behaviorHash: computeHash(loadEvents()),
};

const behaviorSlice = createSlice({
  name: 'userBehavior',
  initialState,
  reducers: {
    trackEvent(state, action: PayloadAction<UserBehaviorEvent>) {
      state.events.push(action.payload);
      if (state.events.length > 500) {
        state.events = state.events.slice(-500);
      }
      state.behaviorHash = computeHash(state.events);
      localStorageManager.set(STORAGE_KEYS.behaviorEvents, state.events);
      void indexedDBManager.addEvent(action.payload);
    },
    clearEvents(state) {
      state.events = [];
      state.behaviorHash = computeHash([]);
      localStorageManager.remove(STORAGE_KEYS.behaviorEvents);
      void indexedDBManager.clearAll();
    },
  },
});

export const { trackEvent, clearEvents } = behaviorSlice.actions;
export default behaviorSlice;

export const selectBehaviorEvents = (state: { userBehavior: BehaviorState }): UserBehaviorEvent[] =>
  state.userBehavior.events;

export const selectBehaviorHash = (state: { userBehavior: BehaviorState }): string =>
  state.userBehavior.behaviorHash;
