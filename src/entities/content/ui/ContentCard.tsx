import { memo, useCallback, useEffect, useRef } from 'react';
import type { Content, ContentMetrics } from '@/entities/content/model/types';
import { Card } from '@/shared/ui/Card';
import { ContentPoster } from '@/shared/ui/ContentPoster';
import { formatDate, formatDuration } from '@/shared/lib/formatters';
import './ContentCard.scss';

interface ContentCardProps {
  item: Content;
  metrics?: ContentMetrics;
  onOpen?: (item: Content) => void;
  onView?: (id: number, genre: string | undefined, duration: number) => void;
}

export const ContentCard = memo(({ item, metrics, onOpen, onView }: ContentCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const primaryGenre = item.genres[0];

  const handleClick = useCallback(() => {
    onOpen?.(item);
  }, [onOpen, item]);

  useEffect(() => {
    if (!onView || !ref.current) return undefined;

    let viewStart: number | null = null;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            viewStart = Date.now();
          } else if (viewStart !== null) {
            const duration = Date.now() - viewStart;
            if (duration > 500) {
              onView(item.id, primaryGenre, duration);
            }
            viewStart = null;
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [onView, item.id, primaryGenre]);

  const hasMetrics = metrics && (metrics.clickCount > 0 || metrics.viewDuration > 0);

  return (
    <Card className="content-card" onClick={handleClick}>
      <div ref={ref} className="content-card__poster">
        <ContentPoster
          title={item.title}
          posterPath={item.posterPath}
          backdropPath={item.backdropPath}
        />
      </div>
      <div className="content-card__body">
        <h3 className="content-card__title">{item.title}</h3>
        <p className="content-card__meta">
          {formatDate(item.releaseDate)} · ★ {item.voteAverage.toFixed(1)}
        </p>
        {item.genres.length > 0 && (
          <div className="content-card__genres">
            {item.genres.slice(0, 2).map((g) => (
              <span key={g} className="content-card__genre">
                {g}
              </span>
            ))}
          </div>
        )}
        {hasMetrics && metrics && (
          <div className="content-card__metrics">
            {metrics.clickCount > 0 && <span>{metrics.clickCount} клик.</span>}
            {metrics.viewDuration > 0 && (
              <span>{formatDuration(metrics.viewDuration)} просмотр</span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
});

ContentCard.displayName = 'ContentCard';
