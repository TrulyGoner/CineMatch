import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '@/shared/config/constants';
import { localStorageManager } from '@/shared/storage/localStorageManager';

interface UserFeedbackState {
  likes: string[];
  dislikes: string[];
  notInterested: string[];
}

const loadFeedback = (): UserFeedbackState =>
  localStorageManager.get<UserFeedbackState>(STORAGE_KEYS.userFeedback) ?? {
    likes: [],
    dislikes: [],
    notInterested: [],
  };

const initialState: UserFeedbackState = loadFeedback();

const feedbackSlice = createSlice({
  name: 'userFeedback',
  initialState,
  reducers: {
    toggleLike(state, action: PayloadAction<string>) {
      const key = action.payload;
      const likeIdx = state.likes.indexOf(key);
      const dislikeIdx = state.dislikes.indexOf(key);
      if (likeIdx >= 0) {
        state.likes.splice(likeIdx, 1);
      } else {
        state.likes.push(key);
        if (dislikeIdx >= 0) state.dislikes.splice(dislikeIdx, 1);
      }
      localStorageManager.set(STORAGE_KEYS.userFeedback, state);
    },
    toggleDislike(state, action: PayloadAction<string>) {
      const key = action.payload;
      const likeIdx = state.likes.indexOf(key);
      const dislikeIdx = state.dislikes.indexOf(key);
      if (dislikeIdx >= 0) {
        state.dislikes.splice(dislikeIdx, 1);
      } else {
        state.dislikes.push(key);
        if (likeIdx >= 0) state.likes.splice(likeIdx, 1);
      }
      localStorageManager.set(STORAGE_KEYS.userFeedback, state);
    },
    markNotInterested(state, action: PayloadAction<string>) {
      const key = action.payload;
      if (!state.notInterested.includes(key)) {
        state.notInterested.push(key);
      }
      const likeIdx = state.likes.indexOf(key);
      const dislikeIdx = state.dislikes.indexOf(key);
      if (likeIdx >= 0) state.likes.splice(likeIdx, 1);
      if (dislikeIdx >= 0) state.dislikes.splice(dislikeIdx, 1);
      localStorageManager.set(STORAGE_KEYS.userFeedback, state);
    },
  },
});

export const { toggleLike, toggleDislike, markNotInterested } = feedbackSlice.actions;
export default feedbackSlice;

export const selectFeedback = (state: { userFeedback: UserFeedbackState }): UserFeedbackState =>
  state.userFeedback;

export const selectIsLiked = (key: string) => (state: { userFeedback: UserFeedbackState }): boolean =>
  state.userFeedback.likes.includes(key);

export const selectIsDisliked = (key: string) => (state: { userFeedback: UserFeedbackState }): boolean =>
  state.userFeedback.dislikes.includes(key);

export const selectNotInterested = (state: { userFeedback: UserFeedbackState }): string[] =>
  state.userFeedback.notInterested;
