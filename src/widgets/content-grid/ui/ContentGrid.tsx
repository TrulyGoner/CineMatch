import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/app/store';
import { ContentCard } from '@/entities/content';
import { getContentKey } from '@/features/content-discovery/api/contentApi';
import { useContentFeed } from '@/features/content-discovery/hooks/useContentFeed';
import { selectFilteredContent, selectAllContent } from '@/features/content-discovery/model/store';
import { useContentDetail } from '@/features/content-detail';
import { useUserBehavior } from '@/features/user-behavior-tracking';
import { computeContentMetrics } from '@/features/user-behavior-tracking/lib/metrics';
import { selectBehaviorEvents } from '@/features/user-behavior-tracking/model/store';
import { Skeleton } from '@/shared/ui/Skeleton';
import { Spinner } from '@/shared/ui/Spinner';
import './ContentGrid.scss';

interface ContentGridProps {
  showEmptyFilterMessage?: boolean;
}

export const ContentGrid = ({ showEmptyFilterMessage = true }: ContentGridProps) => {
  const { status, error, hasMore, loadMore, retry } = useContentFeed();
  const { t } = useTranslation();
  const filteredItems = useAppSelector(selectFilteredContent);
  const allItems = useAppSelector(selectAllContent);
  const events = useAppSelector(selectBehaviorEvents);
  const { tracker } = useUserBehavior();
  const { open } = useContentDetail();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleOpen = useCallback(
    (item: Parameters<typeof open>[0]) => {
      tracker.trackClick(item.id, item.genres[0]);
      open(item);
    },
    [tracker, open]
  );

  const handleView = useCallback(
    (id: number, genre: string | undefined, duration: number) => {
      tracker.trackView(id, genre, duration);
    },
    [tracker]
  );

  const metricsMap = useMemo(() => {
    const map = new Map<number, ReturnType<typeof computeContentMetrics>>();
    for (const item of filteredItems) {
      map.set(item.id, computeContentMetrics(item.id, events));
    }
    return map;
  }, [filteredItems, events]);

  // Infinite scroll: observe sentinel
  useEffect(() => {
    if (!hasMore || status === 'loading') return undefined;
    const el = sentinelRef.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, status, loadMore]);

  if (status === 'loading' && allItems.length === 0) {
    return (
      <div className="content-grid">
        <div className="content-grid__items">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height="300px" />
          ))}
        </div>
      </div>
    );
  }

  if (status === 'error' && allItems.length === 0) {
    return (
      <div className="content-grid__error">
        <p>{error ?? t('content.errorLoad')}</p>
        <button type="button" className="content-grid__retry-btn" onClick={retry}>
          {t('content.retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="content-grid">
      <div className="content-grid__items">
        {filteredItems.map((item) => (
          <ContentCard
            key={getContentKey(item)}
            item={item}
            metrics={metricsMap.get(item.id)}
            onOpen={handleOpen}
            onView={handleView}
          />
        ))}
      </div>

      {showEmptyFilterMessage && filteredItems.length === 0 && allItems.length > 0 && (
        <p className="content-grid__empty">{t('content.nothingFound')}</p>
      )}

      {status === 'error' && allItems.length > 0 && (
        <p className="content-grid__error-inline">{error}</p>
      )}

      {hasMore && (
        <div ref={sentinelRef} className="content-grid__sentinel">
          {status === 'loading' && <Spinner size="sm" />}
        </div>
      )}
    </div>
  );
};
