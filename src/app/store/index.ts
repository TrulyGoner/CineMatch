import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import recommendation from '@/features/recommendation-engine/model/store';
import behavior from '@/features/user-behavior-tracking/model/store';
import weights from '@/features/recommendation-weights/model/store';
import abTest from '@/features/ab-test-toggle/model/store';
import content from '@/features/content-discovery/model/store';
import contentDetail from '@/features/content-detail/model/store';

export const store = configureStore({
  reducer: {
    recommendations: recommendation.reducer,
    userBehavior: behavior.reducer,
    weights: weights.reducer,
    abTest: abTest.reducer,
    content: content.reducer,
    contentDetail: contentDetail.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
