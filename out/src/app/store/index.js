import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import recommendation from '@/features/recommendation-engine/model/store';
import behavior from '@/features/user-behavior-tracking/model/store';
import weights from '@/features/recommendation-weights/model/store';
import abTest from '@/features/ab-test-toggle/model/store';
import content from '@/features/content-discovery/model/store';
export const store = configureStore({
    reducer: {
        recommendations: recommendation.reducer,
        userBehavior: behavior.reducer,
        weights: weights.reducer,
        abTest: abTest.reducer,
        content: content.reducer,
    },
});
export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;
