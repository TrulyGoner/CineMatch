import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/app/store';
import { selectAllContent } from '@/features/content-discovery/model/store';
import { ContentCard } from '@/entities/content';
import { getContentKey } from '@/features/content-discovery/api/contentApi';
import { useContentDetail } from '@/features/content-detail';
import { useUserBehavior } from '@/features/user-behavior-tracking';
import { ContentGrid } from '@/widgets/content-grid';
import { Spinner } from '@/shared/ui/Spinner';
import { useRecentViews } from '@/shared/hooks/useRecentViews';
import './HomePage.scss';

const RecommendationFeed = lazy(() =>
  import('@/widgets/recommendation-feed').then((m) => ({ default: m.RecommendationFeed }))
);

export const HomePage = () => {
  const { t } = useTranslation();
  const catalog = useAppSelector(selectAllContent);
  const recentViews = useRecentViews(catalog);
  const { open } = useContentDetail();
  const { tracker } = useUserBehavior();

  return (
    <div className="home-page">
      <section className="home-page__hero">
        <h1>{t('home.heroTitle')}</h1>
        <p>{t('home.heroText')}</p>
      </section>

      {recentViews.length > 0 && (
        <section className="home-page__recent">
          <h2>{t('recent.title')}</h2>
          <div className="home-page__recent-row">
            {recentViews.map((item) => (
              <div key={getContentKey(item)} className="home-page__recent-card">
                <ContentCard
                  item={item}
                  onOpen={(c) => {
                    tracker.trackClick(c.id, c.genres[0]);
                    open(c);
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      <Suspense
        fallback={
          <div className="home-page__loader">
            <Spinner size="lg" />
          </div>
        }
      >
        <RecommendationFeed />
      </Suspense>

      <section className="home-page__catalog">
        <h2>{t('home.popularNow')}</h2>
        <ContentGrid showEmptyFilterMessage={false} />
      </section>
    </div>
  );
};
