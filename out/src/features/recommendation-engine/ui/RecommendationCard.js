import { memo, useCallback, useEffect, useRef } from 'react';
import { Card } from '@/shared/ui/Card';
import { ContentPoster } from '@/shared/ui/ContentPoster';
import { formatDate } from '@/shared/lib/formatters';
import { WhyRecommended } from './WhyRecommended';
import './RecommendationCard.scss';
export const RecommendationCard = memo(({ item, onOpen, onView }) => {
    const ref = useRef(null);
    const primaryGenre = item.genres[0];
    const handleClick = useCallback(() => {
        onOpen?.(item);
    }, [onOpen, item]);
    useEffect(() => {
        if (!onView || !ref.current)
            return undefined;
        let viewStart = null;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    viewStart = Date.now();
                }
                else if (viewStart !== null) {
                    const duration = Date.now() - viewStart;
                    if (duration > 500) {
                        onView(item.id, primaryGenre, duration);
                    }
                    viewStart = null;
                }
            });
        }, { threshold: 0.5 });
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [onView, item.id, primaryGenre]);
    return (React.createElement(Card, { className: "recommendation-card", onClick: handleClick },
        React.createElement("div", { ref: ref, className: "recommendation-card__poster" },
            React.createElement(ContentPoster, { title: item.title, posterPath: item.posterPath, backdropPath: item.backdropPath }),
            React.createElement("span", { className: "recommendation-card__score" }, item.score.toFixed(1))),
        React.createElement("div", { className: "recommendation-card__body" },
            React.createElement("h3", { className: "recommendation-card__title" }, item.title),
            React.createElement("p", { className: "recommendation-card__meta" },
                formatDate(item.releaseDate),
                " \u00B7 \u2605 ",
                item.voteAverage.toFixed(1)),
            React.createElement(WhyRecommended, { reasons: item.reasons, compact: true }))));
});
RecommendationCard.displayName = 'RecommendationCard';
