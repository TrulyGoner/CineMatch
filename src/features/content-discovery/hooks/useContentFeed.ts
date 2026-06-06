import { useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { AbortError } from '@/shared/api/apiClient';
import { useAppDispatch } from '@/app/store';
import { fetchMovies } from '../api/contentApi';
import {
  appendContent,
  setError,
  setLoading,
  selectAllContent,
  selectContentPage,
  selectContentStatus,
  selectContentError,
  selectHasMoreContent,
} from '../model/store';

export const useContentFeed = () => {
  const dispatch = useAppDispatch();
  const items = useSelector(selectAllContent);
  const page = useSelector(selectContentPage);
  const status = useSelector(selectContentStatus);
  const error = useSelector(selectContentError);
  const hasMore = useSelector(selectHasMoreContent);
  const abortRef = useRef<AbortController | null>(null);

  const loadPage = useCallback(
    async (nextPage: number) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      dispatch(setLoading());

      try {
        const data = await fetchMovies(nextPage, controller.signal);
        dispatch(
          appendContent({
            items: data.results,
            page: data.page,
            totalPages: data.totalPages,
          })
        );
      } catch (err) {
        if (err instanceof AbortError) return;
        const message = err instanceof Error ? err.message : 'Ошибка загрузки';
        dispatch(setError(message));
      }
    },
    [dispatch]
  );

  const loadMore = useCallback(() => {
    if (status === 'loading' || !hasMore) return;
    void loadPage(page + 1);
  }, [status, hasMore, page, loadPage]);

  const retry = useCallback(() => {
    void loadPage(page === 0 ? 1 : page);
  }, [page, loadPage]);

  useEffect(() => {
    if (page === 0) {
      void loadPage(1);
    }

    return () => {
      abortRef.current?.abort();
    };
  }, [page, loadPage]);

  const prefetchNext = useCallback(() => {
    if (hasMore && status !== 'loading') {
      void fetchMovies(page + 1).catch(() => undefined);
    }
  }, [hasMore, status, page]);

  return { items, status, error, hasMore, loadMore, retry, prefetchNext };
};
