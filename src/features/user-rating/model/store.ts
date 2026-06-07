import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '@/shared/config/constants';
import { localStorageManager } from '@/shared/storage/localStorageManager';

interface UserRatingState {
  ratings: Record<string, number>;
}

const loadRatings = (): Record<string, number> =>
  localStorageManager.get<Record<string, number>>(STORAGE_KEYS.userRatings) ?? {};

const initialState: UserRatingState = {
  ratings: loadRatings(),
};

const userRatingSlice = createSlice({
  name: 'userRating',
  initialState,
  reducers: {
    setRating(state, action: PayloadAction<{ key: string; rating: number }>) {
      const { key, rating } = action.payload;
      if (rating >= 1 && rating <= 5) {
        state.ratings[key] = rating;
      } else {
        delete state.ratings[key];
      }
      localStorageManager.set(STORAGE_KEYS.userRatings, state.ratings);
    },
  },
});

export const { setRating } = userRatingSlice.actions;
export default userRatingSlice;

export const selectUserRating = (key: string) => (state: { userRating: UserRatingState }): number | undefined =>
  state.userRating.ratings[key];

export const selectAllRatings = (state: { userRating: UserRatingState }): Record<string, number> =>
  state.userRating.ratings;
