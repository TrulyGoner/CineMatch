import { useCallback, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { RECOMMENDATION_INTERVAL_MS } from '@/shared/config/constants';
import { selectABTestMode } from '@/features/ab-test-toggle/model/store';
import { selectAllContent } from '@/features/content-discovery/model/store';
import { selectWeights } from '@/features/recommendation-weights/model/store';
import { selectBehaviorEvents, selectBehaviorHash, } from '@/features/user-behavior-tracking/model/store';
import { calculateRecommendations, shuffleRecommendations, } from '../lib/scoringAlgorithm';
import { setLoading, setRecommendations, setError, selectRecommendations, selectRecommendationCacheHash, selectRecommendationStatus, } from '../model/store';
export const useRecommendations = () => {
    const dispatch = useAppDispatch();
    const events = useAppSelector(selectBehaviorEvents);
    const behaviorHash = useAppSelector(selectBehaviorHash);
    const weights = useAppSelector(selectWeights);
    const abMode = useAppSelector(selectABTestMode);
    const catalog = useAppSelector(selectAllContent);
    const items = useAppSelector(selectRecommendations);
    const cacheHash = useAppSelector(selectRecommendationCacheHash);
    const status = useAppSelector(selectRecommendationStatus);
    const inputHash = useMemo(() => JSON.stringify({
        behaviorHash,
        weights,
        abMode,
        catalogIds: catalog.map((c) => `${c.mediaType}-${c.id}`).join(','),
    }), [behaviorHash, weights, abMode, catalog]);
    const recalculate = useCallback(() => {
        if (catalog.length === 0)
            return;
        if (inputHash === cacheHash && items.length > 0)
            return;
        dispatch(setLoading());
        try {
            const result = abMode === 'random'
                ? shuffleRecommendations(catalog)
                : calculateRecommendations(catalog, events, weights);
            dispatch(setRecommendations({ items: result, hash: inputHash }));
        }
        catch {
            dispatch(setError());
        }
    }, [catalog, inputHash, cacheHash, items.length, abMode, events, weights, dispatch]);
    useEffect(() => {
        recalculate();
    }, [recalculate]);
    useEffect(() => {
        const timer = setInterval(recalculate, RECOMMENDATION_INTERVAL_MS);
        return () => clearInterval(timer);
    }, [recalculate]);
    return { items, status, recalculate };
};
