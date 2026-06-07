import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
    const handleOpen = useCallback((item) => {
        tracker.trackClick(item.id, item.genres[0]);
        open(item, item.reasons);
    }, [tracker, open]);
    const handleView = useCallback((id, genre, duration) => {
        tracker.trackView(id, genre, duration);
    }, [tracker]);
    if (status === 'loading' && items.length === 0) {
        return (React.createElement("div", { className: "recommendation-feed" },
            React.createElement("h2", { className: "recommendation-feed__title" }, t('recommendation.pickedForYou')),
            React.createElement("div", { className: "recommendation-feed__grid" }, Array.from({ length: 5 }).map((_, i) => (React.createElement(Skeleton, { key: i, height: "320px" }))))));
    }
    if (status === 'error' && items.length === 0) {
        return (React.createElement("div", { className: "recommendation-feed" },
            React.createElement("h2", { className: "recommendation-feed__title" }, t('recommendation.pickedForYou')),
            React.createElement("div", { className: "recommendation-feed__error" },
                React.createElement("p", null, t('recommendation.errorCalculate')),
                React.createElement(Button, { onClick: recalculate }, t('recommendation.retry')))));
    }
    return (React.createElement("div", { className: "recommendation-feed" },
        React.createElement("div", { className: "recommendation-feed__header" },
            React.createElement("h2", { className: "recommendation-feed__title" }, t('recommendation.pickedForYou')),
            status === 'loading' && React.createElement(Spinner, { size: "sm" })),
        React.createElement("div", { className: "recommendation-feed__grid" }, items.map((item) => (React.createElement(RecommendationCard, { key: getContentKey(item), item: item, onOpen: handleOpen, onView: handleView })))),
        items.length === 0 && status !== 'loading' && (React.createElement("p", { className: "recommendation-feed__empty" }, t('recommendation.emptyState')))));
};
