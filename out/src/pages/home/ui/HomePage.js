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
const RecommendationFeed = lazy(() => import('@/widgets/recommendation-feed').then((m) => ({ default: m.RecommendationFeed })));
export const HomePage = () => {
    const { t } = useTranslation();
    const catalog = useAppSelector(selectAllContent);
    const recentViews = useRecentViews(catalog);
    const { open } = useContentDetail();
    const { tracker } = useUserBehavior();
    return (React.createElement("div", { className: "home-page" },
        React.createElement("section", { className: "home-page__hero" },
            React.createElement("h1", null, t('home.heroTitle')),
            React.createElement("p", null, t('home.heroText'))),
        recentViews.length > 0 && (React.createElement("section", { className: "home-page__recent" },
            React.createElement("h2", null, t('recent.title')),
            React.createElement("div", { className: "home-page__recent-row" }, recentViews.map((item) => (React.createElement("div", { key: getContentKey(item), className: "home-page__recent-card" },
                React.createElement(ContentCard, { item: item, onOpen: (c) => {
                        tracker.trackClick(c.id, c.genres[0]);
                        open(c);
                    } }))))))),
        React.createElement(Suspense, { fallback: React.createElement("div", { className: "home-page__loader" },
                React.createElement(Spinner, { size: "lg" })) },
            React.createElement(RecommendationFeed, null)),
        React.createElement("section", { className: "home-page__catalog" },
            React.createElement("h2", null, t('home.popularNow')),
            React.createElement(ContentGrid, { showEmptyFilterMessage: false }))));
};
