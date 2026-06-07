import { useEffect, useCallback, useMemo, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { selectAllContent, appendContent } from '@/features/content-discovery/model/store';
import { fetchMovies } from '@/features/content-discovery/api/contentApi';
import type { Content } from '@/entities/content/model/types';
import {
  recordDecision,
  resetExplorer,
  selectExplorerCompleted,
  selectSeenIds,
} from '../model/store';

const EXPLORER_QUEUE_SIZE = 10;
const REFILL_THRESHOLD = 3;

export const useExplorer = () => {
  const dispatch = useAppDispatch();
  const catalog = useAppSelector(selectAllContent);
  const completed = useAppSelector(selectExplorerCompleted);
  const seenIds = useAppSelector(selectSeenIds);
  const loadingRef = useRef(false);

  const unseenPool = useMemo(
    () => catalog.filter((c) => !seenIds.includes(`${c.mediaType}-${c.id}`)),
    [catalog, seenIds]
  );

  useEffect(() => {
    if (completed) return;
    if (loadingRef.current) return;
    if (unseenPool.length >= REFILL_THRESHOLD) return;
    loadingRef.current = true;
    const ctrl = new AbortController();
    let page = 1;
    const tryFetch = (): void => {
      if (page > 3 || ctrl.signal.aborted) { loadingRef.current = false; return; }
      const currentPage = page;
      page += 1;
      fetchMovies(currentPage, ctrl.signal)
        .then((data) => {
          if (!ctrl.signal.aborted) {
            dispatch(appendContent({ items: data.results, page: data.page, totalPages: data.totalPages }));
          }
        })
        .catch(() => {})
        .finally(() => { if (!ctrl.signal.aborted) tryFetch(); });
    };
    tryFetch();
    return () => { loadingRef.current = false; ctrl.abort(); };
  }, [completed, unseenPool.length, dispatch]);

  const current: Content | null = unseenPool[0] ?? null;
  const remainingCount = Math.min(unseenPool.length, EXPLORER_QUEUE_SIZE);

  const handleDecision = useCallback(
    (decision: 'like' | 'dislike' | 'skip') => {
      if (!current) return;
      dispatch(
        recordDecision({
          contentId: current.id,
          mediaType: current.mediaType,
          genres: current.genres,
          decision,
          timestamp: Date.now(),
        })
      );
    },
    [current, dispatch]
  );

  const handleReset = useCallback(() => {
    dispatch(resetExplorer());
    loadingRef.current = false;
  }, [dispatch]);

  return {
    current,
    queueSize: EXPLORER_QUEUE_SIZE,
    remainingCount,
    completed,
    onDecision: handleDecision,
    onReset: handleReset,
  };
};
