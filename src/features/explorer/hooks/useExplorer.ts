import { useEffect, useCallback, useMemo, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { selectAllContent, appendContent } from '@/features/content-discovery/model/store';
import { fetchMovies } from '@/features/content-discovery/api/contentApi';
import type { Content } from '@/entities/content/model/types';
import { incrementStat } from '@/features/achievements';
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
  const nextItems: Content[] = unseenPool.slice(1, 4);
  const remainingCount = Math.min(unseenPool.length, EXPLORER_QUEUE_SIZE);

  const makeDecision = useCallback(
    (content: Content, decision: 'like' | 'dislike' | 'skip') => {
      dispatch(
        recordDecision({
          contentId: content.id,
          mediaType: content.mediaType,
          genres: content.genres,
          decision,
          timestamp: Date.now(),
        })
      );
      if (decision !== 'skip') {
        dispatch(incrementStat({ explorerDecisions: 1 }));
      }
    },
    [dispatch]
  );

  const handleReset = useCallback(() => {
    dispatch(resetExplorer());
    loadingRef.current = false;
  }, [dispatch]);

  return {
    current,
    nextItems,
    queueSize: EXPLORER_QUEUE_SIZE,
    remainingCount,
    completed,
    makeDecision,
    onReset: handleReset,
    seenCount: seenIds.length,
  };
};
