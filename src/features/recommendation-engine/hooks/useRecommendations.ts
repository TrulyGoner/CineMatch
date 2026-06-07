import { useCallback, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { RECOMMENDATION_INTERVAL_MS } from '@/shared/config/constants';
import { selectABTestMode } from '@/features/ab-test-toggle/model/store';
import { selectAllContent } from '@/features/content-discovery/model/store';
import { selectWeights } from '@/features/recommendation-weights/model/store';
import {
  selectBehaviorEvents,
  selectBehaviorHash,
} from '@/features/user-behavior-tracking/model/store';
import { selectAllRatings } from '@/features/user-rating/model/store';
import { selectFeedback } from '@/features/recommendation-feedback/model/store';
import { selectExplorerState, explorerProfileToEvents } from '@/features/explorer/model/store';
import {
  calculateRecommendations,
  shuffleRecommendations,
} from '../lib/scoringAlgorithm';
import {
  setLoading,
  setRecommendations,
  setError,
  selectRecommendations,
  selectRecommendationCacheHash,
  selectRecommendationStatus,
} from '../model/store';

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
  const ratings = useAppSelector(selectAllRatings);
  const feedback = useAppSelector(selectFeedback);
  const explorer = useAppSelector(selectExplorerState);

  const explorerEvents = useMemo(
    () => explorerProfileToEvents(explorer.entries),
    [explorer.entries]
  );

  const mergedEvents = useMemo(
    () => [...events, ...explorerEvents],
    [events, explorerEvents]
  );

  const explorerHash = useMemo(() => JSON.stringify(explorer.entries), [explorer.entries]);

  const inputHash = useMemo(
    () =>
      JSON.stringify({
        behaviorHash,
        explorerHash,
        weights,
        abMode,
        catalogIds: catalog.map((c) => `${c.mediaType}-${c.id}`).join(','),
        ratingsHash: JSON.stringify(ratings),
        feedbackHash: JSON.stringify(feedback),
      }),
    [behaviorHash, explorerHash, weights, abMode, catalog, ratings, feedback]
  );

  const recalculate = useCallback(() => {
    if (catalog.length === 0) return;
    if (inputHash === cacheHash && items.length > 0) return;

    dispatch(setLoading());

    try {
      const result =
        abMode === 'random'
          ? shuffleRecommendations(catalog)
          : calculateRecommendations(catalog, mergedEvents, weights, {
              ratings,
              feedbackLikes: feedback.likes,
              feedbackDislikes: feedback.dislikes,
            });

      dispatch(setRecommendations({ items: result, hash: inputHash }));
    } catch {
      dispatch(setError());
    }
  }, [catalog, inputHash, cacheHash, items.length, abMode, mergedEvents, weights, dispatch, ratings, feedback]);

  useEffect(() => {
    recalculate();
  }, [recalculate]);

  useEffect(() => {
    const timer = setInterval(recalculate, RECOMMENDATION_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [recalculate]);

  return { items, status, recalculate };
};
