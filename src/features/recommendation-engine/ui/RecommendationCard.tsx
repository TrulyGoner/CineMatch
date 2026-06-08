import { memo, useCallback, useEffect, useRef } from 'react';
import type { Recommendation } from '@/entities/recommendation/model/types';
import { Card } from '@/shared/ui/Card';
import { ContentPoster } from '@/shared/ui/ContentPoster';
import { formatDate } from '@/shared/lib/formatters';
import { StarRating } from '@/features/user-rating';
import { FeedbackButtons } from '@/features/recommendation-feedback';
import { Icon } from '@/shared/ui/Icon';
import { WhyRecommended } from './WhyRecommended';
import './RecommendationCard.scss';

interface RecommendationCardProps {
  item: Recommendation;
  onOpen?: (item: Recommendation) => void;
  onView?: (id: number, genre: string | undefined, duration: number) => void;
}

export const RecommendationCard = memo(({ item, onOpen, onView }: RecommendationCardProps) => {
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

  const contentKey = `${item.mediaType}-${item.id}`;

  return (
    <Card className="recommendation-card" onClick={handleClick}>
      <div ref={ref} className="recommendation-card__poster">
        <ContentPoster
          title={item.title}
          posterPath={item.posterPath}
          backdropPath={item.backdropPath}
        />
        <span className="recommendation-card__score">{item.score.toFixed(1)}</span>
      </div>
      <div className="recommendation-card__body">
        <h3 className="recommendation-card__title">{item.title}</h3>
        <p className="recommendation-card__meta">
          {formatDate(item.releaseDate)} · <Icon name="star-filled" size={12} color="var(--color-primary)" /> {item.voteAverage.toFixed(1)}
        </p>
        <div className="recommendation-card__rating-wrap">
          <StarRating contentKey={contentKey} size="sm" />
        </div>
        <WhyRecommended reasons={item.reasons} compact />
        <FeedbackButtons contentKey={contentKey} />
      </div>
    </Card>
  );
});

RecommendationCard.displayName = 'RecommendationCard';
