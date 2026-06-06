import { useCallback } from 'react';
import { RecommendationCard } from '@/features/recommendation-engine';
import { useRecommendations } from '@/features/recommendation-engine/hooks/useRecommendations';
import { useUserBehavior } from '@/features/user-behavior-tracking';
import { Skeleton } from '@/shared/ui/Skeleton';
import { Spinner } from '@/shared/ui/Spinner';
import './RecommendationFeed.scss';
export const RecommendationFeed = () => {
    const { items, status } = useRecommendations();
    const { tracker } = useUserBehavior();
    const handleClick = useCallback((id, genre) => {
        tracker.trackClick(id, genre);
    }, [tracker]);
    if (status === 'loading' && items.length === 0) {
        return (React.createElement("div", { className: "recommendation-feed" },
            React.createElement("h2", { className: "recommendation-feed__title" }, "\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0438\u0438 \u0434\u043B\u044F \u0432\u0430\u0441"),
            React.createElement("div", { className: "recommendation-feed__grid" }, Array.from({ length: 5 }).map((_, i) => (React.createElement(Skeleton, { key: i, height: "320px" }))))));
    }
    return (React.createElement("div", { className: "recommendation-feed" },
        React.createElement("div", { className: "recommendation-feed__header" },
            React.createElement("h2", { className: "recommendation-feed__title" }, "\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0438\u0438 \u0434\u043B\u044F \u0432\u0430\u0441"),
            status === 'loading' && React.createElement(Spinner, { size: "sm" })),
        React.createElement("div", { className: "recommendation-feed__grid" }, items.map((item) => (React.createElement(RecommendationCard, { key: item.id, item: item, onClick: handleClick })))),
        items.length === 0 && (React.createElement("p", { className: "recommendation-feed__empty" }, "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0435 \u043A\u043E\u043D\u0442\u0435\u043D\u0442 \u0438 \u043A\u043B\u0438\u043A\u043D\u0438\u0442\u0435 \u043F\u043E \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430\u043C \u2014 \u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0438\u0438 \u043F\u043E\u044F\u0432\u044F\u0442\u0441\u044F \u0437\u0434\u0435\u0441\u044C"))));
};
