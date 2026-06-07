import { memo, useCallback, useEffect, useRef } from 'react';
import { Card } from '@/shared/ui/Card';
import { ContentPoster } from '@/shared/ui/ContentPoster';
import { SaveButton } from '@/features/saved-content';
import { formatDate, formatDuration } from '@/shared/lib/formatters';
import './ContentCard.scss';
export const ContentCard = memo(({ item, metrics, onOpen, onView }) => {
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
    const hasMetrics = metrics && (metrics.clickCount > 0 || metrics.viewDuration > 0);
    return (React.createElement(Card, { className: "content-card", onClick: handleClick },
        React.createElement("div", { ref: ref, className: "content-card__poster" },
            React.createElement(ContentPoster, { title: item.title, posterPath: item.posterPath, backdropPath: item.backdropPath }),
            React.createElement(SaveButton, { item: item })),
        React.createElement("div", { className: "content-card__body" },
            React.createElement("h3", { className: "content-card__title" }, item.title),
            React.createElement("p", { className: "content-card__meta" },
                formatDate(item.releaseDate),
                " \u00B7 \u2605 ",
                item.voteAverage.toFixed(1)),
            item.genres.length > 0 && (React.createElement("div", { className: "content-card__genres" }, item.genres.slice(0, 2).map((g) => (React.createElement("span", { key: g, className: "content-card__genre" }, g))))),
            hasMetrics && metrics && (React.createElement("div", { className: "content-card__metrics" },
                metrics.clickCount > 0 && React.createElement("span", null,
                    metrics.clickCount,
                    " ",
                    metrics.clickCount === 1 ? 'click' : 'clicks'),
                metrics.viewDuration > 0 && (React.createElement("span", null,
                    formatDuration(metrics.viewDuration),
                    " viewed")))))));
});
ContentCard.displayName = 'ContentCard';
