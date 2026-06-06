import { memo, useCallback } from 'react';
import { Card } from '@/shared/ui/Card';
import { getPosterUrl } from '@/features/content-discovery/api/contentApi';
import { formatDate } from '@/shared/lib/formatters';
import { WhyRecommended } from './WhyRecommended';
import './RecommendationCard.scss';
export const RecommendationCard = memo(({ item, onClick }) => {
    const posterUrl = getPosterUrl(item.posterPath);
    const primaryGenre = item.genres[0];
    const handleClick = useCallback(() => {
        onClick?.(item.id, primaryGenre);
    }, [onClick, item.id, primaryGenre]);
    return (React.createElement(Card, { className: "recommendation-card", onClick: handleClick },
        React.createElement("div", { className: "recommendation-card__poster" },
            posterUrl ? (React.createElement("img", { src: posterUrl, alt: item.title, loading: "lazy" })) : (React.createElement("div", { className: "recommendation-card__placeholder" }, item.title.charAt(0))),
            React.createElement("span", { className: "recommendation-card__score" }, item.score.toFixed(1))),
        React.createElement("div", { className: "recommendation-card__body" },
            React.createElement("h3", { className: "recommendation-card__title" }, item.title),
            React.createElement("p", { className: "recommendation-card__meta" },
                formatDate(item.releaseDate),
                " \u00B7 \u2605 ",
                item.voteAverage.toFixed(1)),
            React.createElement(WhyRecommended, { reasons: item.reasons }))));
});
RecommendationCard.displayName = 'RecommendationCard';
