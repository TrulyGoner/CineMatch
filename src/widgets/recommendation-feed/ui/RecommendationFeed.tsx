import { useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getContentKey } from '@/features/content-discovery/api/contentApi';
import { RecommendationCard } from '@/features/recommendation-engine';
import { useRecommendations } from '@/features/recommendation-engine/hooks/useRecommendations';
import { groupByGenre } from '@/features/recommendation-engine/lib/scoringAlgorithm';
import { useContentDetail } from '@/features/content-detail';
import { useUserBehavior } from '@/features/user-behavior-tracking';
import { Button } from '@/shared/ui/Button';
import { Skeleton } from '@/shared/ui/Skeleton';
import { Spinner } from '@/shared/ui/Spinner';
import './RecommendationFeed.scss';

export const RecommendationFeed = () => {
  const { items, status, recalculate } = useRecommendations();
  const { tracker } = useUserBehavior();
  const { open } = useContentDetail();
  const { t } = useTranslation();

  const rows = useMemo(() => {
    if (items.length === 0) return [];
    return Object.entries(groupByGenre(items));
  }, [items]);

  const handleOpen = useCallback(
    (item: (typeof items)[number]) => {
      tracker.trackClick(item.id, item.genres[0]);
      open(item, item.reasons);
    },
    [tracker, open]
  );

  const handleView = useCallback(
    (id: number, genre: string | undefined, duration: number) => {
      tracker.trackView(id, genre, duration);
    },
    [tracker]
  );

  if (status === 'loading' && items.length === 0) {
    return (
      <div className="recommendation-feed">
        <h2 className="recommendation-feed__title">{t('recommendation.pickedForYou')}</h2>
        <div className="recommendation-feed__grid">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} height="320px" />
          ))}
        </div>
      </div>
    );
  }

  if (status === 'error' && items.length === 0) {
    return (
      <div className="recommendation-feed">
        <h2 className="recommendation-feed__title">{t('recommendation.pickedForYou')}</h2>
        <div className="recommendation-feed__error">
          <p>{t('recommendation.errorCalculate')}</p>
          <Button onClick={recalculate}>{t('recommendation.retry')}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendation-feed">
      <div className="recommendation-feed__header">
        <h2 className="recommendation-feed__title">{t('recommendation.pickedForYou')}</h2>
        {status === 'loading' && <Spinner size="sm" />}
      </div>
      {rows.length === 0 && status !== 'loading' && (
        <p className="recommendation-feed__empty">
          {t('recommendation.emptyState')}
        </p>
      )}
      {rows.map(([genre, recs]) => (
        <section key={genre} className="recommendation-feed__row-section">
          <h3 className="recommendation-feed__row-title">{genre}</h3>
          <div className="recommendation-feed__row">
            {recs.map((item) => (
              <RecommendationCard
                key={getContentKey(item)}
                item={item}
                onOpen={handleOpen}
                onView={handleView}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
