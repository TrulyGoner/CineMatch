import { memo, useCallback, useEffect, useRef } from 'react';
import { Card } from '@/shared/ui/Card';
import { getPosterUrl } from '@/features/content-discovery/api/contentApi';
import { formatDate } from '@/shared/lib/formatters';
import './ContentCard.scss';
export const ContentCard = memo(({ item, onClick, onView }) => {
    const ref = useRef(null);
    const posterUrl = getPosterUrl(item.posterPath);
    const primaryGenre = item.genres[0];
    const handleClick = useCallback(() => {
        onClick?.(item.id, primaryGenre);
    }, [onClick, item.id, primaryGenre]);
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
    return (React.createElement(Card, { className: "content-card", onClick: handleClick },
        React.createElement("div", { ref: ref, className: "content-card__poster" }, posterUrl ? (React.createElement("img", { src: posterUrl, alt: item.title, loading: "lazy" })) : (React.createElement("div", { className: "content-card__placeholder" }, item.title.charAt(0)))),
        React.createElement("div", { className: "content-card__body" },
            React.createElement("h3", { className: "content-card__title" }, item.title),
            React.createElement("p", { className: "content-card__meta" },
                formatDate(item.releaseDate),
                " \u00B7 \u2605 ",
                item.voteAverage.toFixed(1)),
            item.genres.length > 0 && (React.createElement("div", { className: "content-card__genres" }, item.genres.slice(0, 2).map((g) => (React.createElement("span", { key: g, className: "content-card__genre" }, g))))))));
});
ContentCard.displayName = 'ContentCard';
