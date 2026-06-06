import { lazy, Suspense } from 'react';
import { ContentGrid } from '@/widgets/content-grid';
import { Spinner } from '@/shared/ui/Spinner';
import './HomePage.scss';

const RecommendationFeed = lazy(() =>
  import('@/widgets/recommendation-feed').then((m) => ({ default: m.RecommendationFeed }))
);

export const HomePage = () => (
  <div className="home-page">
    <section className="home-page__hero">
      <h1>Твоя личная кино-полка</h1>
      <p>
        Небольшая подборка под настроение — чем больше смотришь и кликаешь,
        тем точнее становятся рекомендации.
      </p>
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
      <h2>Популярное сейчас</h2>
      <ContentGrid showEmptyFilterMessage={false} />
    </section>
  </div>
);
