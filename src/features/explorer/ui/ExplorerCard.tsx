import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Content } from '@/entities/content/model/types';
import { ContentPoster } from '@/shared/ui/ContentPoster';
import { buildTmdbImageUrl } from '@/shared/lib/tmdbImages';
import { formatDate } from '@/shared/lib/formatters';
import './ExplorerCard.scss';

interface ExplorerCardProps {
  item: Content;
}

export const ExplorerCard = memo(({ item }: ExplorerCardProps) => {
  const { t } = useTranslation();
  const backdropUrl = buildTmdbImageUrl(item.backdropPath, 'w780');
  const mediaLabel = item.mediaType === 'tv' ? t('detail.series') : t('detail.movie');

  return (
    <div className="explorer-card">
      <div className="explorer-card__backdrop">
        {backdropUrl ? (
          <img
            className="explorer-card__backdrop-img"
            src={backdropUrl}
            alt=""
            aria-hidden="true"
          />
        ) : (
          <div className="explorer-card__backdrop-fallback" />
        )}
        <div className="explorer-card__overlay" />
      </div>
      <div className="explorer-card__panel">
        <div className="explorer-card__poster-wrap">
          <ContentPoster
            title={item.title}
            posterPath={item.posterPath}
            backdropPath={item.backdropPath}
          />
        </div>
        <div className="explorer-card__info">
          <div className="explorer-card__labels">
            <span className="explorer-card__badge">{mediaLabel}</span>
            <span className="explorer-card__rating">★ {item.voteAverage.toFixed(1)}</span>
          </div>
          <h2 className="explorer-card__title">{item.title}</h2>
          <p className="explorer-card__meta">
            {formatDate(item.releaseDate)}
          </p>
          {item.genres.length > 0 && (
            <div className="explorer-card__genres">
              {item.genres.map((g) => (
                <span key={g} className="explorer-card__genre">{g}</span>
              ))}
            </div>
          )}
          <p className="explorer-card__overview">
            {item.overview || t('detail.noDescription')}
          </p>
        </div>
      </div>
    </div>
  );
});

ExplorerCard.displayName = 'ExplorerCard';
