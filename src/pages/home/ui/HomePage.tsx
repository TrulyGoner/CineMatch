import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { ContentGrid } from '@/widgets/content-grid';
import { Spinner } from '@/shared/ui/Spinner';
import './HomePage.scss';

const RecommendationFeed = lazy(() =>
  import('@/widgets/recommendation-feed').then((m) => ({ default: m.RecommendationFeed }))
);

export const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div className="home-page">
      <section className="home-page__hero">
        <h1>{t('home.heroTitle')}</h1>
        <p>{t('home.heroText')}</p>
      </section>

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
