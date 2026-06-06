import { useCallback } from 'react';
import { getContentKey } from '@/features/content-discovery/api/contentApi';
import { RecommendationCard } from '@/features/recommendation-engine';
import { useRecommendations } from '@/features/recommendation-engine/hooks/useRecommendations';
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
        <h2 className="recommendation-feed__title">Подобрано для тебя</h2>
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
        <h2 className="recommendation-feed__title">Подобрано для тебя</h2>
        <div className="recommendation-feed__error">
          <p>Не удалось рассчитать рекомендации</p>
          <Button onClick={recalculate}>Повторить</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendation-feed">
      <div className="recommendation-feed__header">
        <h2 className="recommendation-feed__title">Подобрано для тебя</h2>
        {status === 'loading' && <Spinner size="sm" />}
      </div>
      <div className="recommendation-feed__grid">
        {items.map((item) => (
          <RecommendationCard
            key={getContentKey(item)}
            item={item}
            onOpen={handleOpen}
            onView={handleView}
          />
        ))}
      </div>
      {items.length === 0 && status !== 'loading' && (
        <p className="recommendation-feed__empty">
          Загрузите контент и кликните по карточкам — рекомендации появятся здесь
        </p>
      )}
    </div>
  );
};
