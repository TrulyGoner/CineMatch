import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import recommendation from '@/features/recommendation-engine/model/store';
import behavior from '@/features/user-behavior-tracking/model/store';
import weights from '@/features/recommendation-weights/model/store';
import abTest from '@/features/ab-test-toggle/model/store';
import content from '@/features/content-discovery/model/store';
import contentDetail from '@/features/content-detail/model/store';
import language from '@/features/language/model/store';
import savedContent from '@/features/saved-content/model/store';
import userRating from '@/features/user-rating/model/store';
import userFeedback from '@/features/recommendation-feedback/model/store';
import explorer from '@/features/explorer/model/store';
import achievement from '@/features/achievements/model/store';
import toast from '@/shared/ui/Toast/store';

export const store = configureStore({
  reducer: {
    recommendations: recommendation.reducer,
    userBehavior: behavior.reducer,
    weights: weights.reducer,
    abTest: abTest.reducer,
    content: content.reducer,
    contentDetail: contentDetail.reducer,
    language: language.reducer,
    savedContent: savedContent.reducer,
    userRating: userRating.reducer,
    userFeedback: userFeedback.reducer,
    explorer: explorer.reducer,
    achievements: achievement.reducer,
    toast: toast.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
