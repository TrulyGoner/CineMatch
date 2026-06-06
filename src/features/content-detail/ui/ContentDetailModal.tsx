import { useMemo } from 'react';
import { useAppSelector } from '@/app/store';
import { selectBehaviorEvents } from '@/features/user-behavior-tracking/model/store';
import { computeContentMetrics } from '@/features/user-behavior-tracking/lib/metrics';
import { WhyRecommended } from '@/features/recommendation-engine/ui/WhyRecommended';
import { ContentPoster } from '@/shared/ui/ContentPoster';
import { buildTmdbImageUrl } from '@/shared/lib/tmdbImages';
import { formatDate, formatDuration } from '@/shared/lib/formatters';
import { Modal } from '@/shared/ui/Modal';
import { useContentDetail } from '../hooks/useContentDetail';
import './ContentDetailModal.scss';

export const ContentDetailModal = () => {
  const { item, reasons, isOpen, close } = useContentDetail();
  const events = useAppSelector(selectBehaviorEvents);

  const metrics = useMemo(
    () => (item ? computeContentMetrics(item.id, events) : null),
    [item, events]
  );

  if (!item) return null;

  const backdropUrl = buildTmdbImageUrl(item.backdropPath, 'w780');
  const mediaLabel = item.mediaType === 'tv' ? 'Сериал' : 'Фильм';
  const hasEngagement = metrics && (metrics.clickCount > 0 || metrics.viewDuration > 0);

  return (
    <Modal isOpen={isOpen} onClose={close} variant="cinema" className="content-detail-modal">
      <div className="content-detail-modal__shell">
        <div className="content-detail-modal__hero">
          {backdropUrl ? (
            <img
              className="content-detail-modal__backdrop-img"
              src={backdropUrl}
              alt=""
              aria-hidden="true"
            />
          ) : (
            <div className="content-detail-modal__backdrop-fallback" />
          )}
          <div className="content-detail-modal__hero-overlay" />
        </div>

        <div className="content-detail-modal__panel">
          <div className="content-detail-modal__poster-wrap">
            <div className="content-detail-modal__poster">
              <ContentPoster
                title={item.title}
                posterPath={item.posterPath}
                backdropPath={item.backdropPath}
              />
            </div>
          </div>

          <div className="content-detail-modal__info">
            <div className="content-detail-modal__labels">
              <span className="content-detail-modal__badge">{mediaLabel}</span>
              <span className="content-detail-modal__rating">
                ★ {item.voteAverage.toFixed(1)}
              </span>
            </div>

            <h2 className="content-detail-modal__title">{item.title}</h2>

            <p className="content-detail-modal__meta">
              {formatDate(item.releaseDate)}
              <span className="content-detail-modal__dot">·</span>
              {item.voteCount.toLocaleString('ru-RU')} оценок
            </p>

            {item.genres.length > 0 && (
              <div className="content-detail-modal__genres">
                {item.genres.map((g) => (
                  <span key={g} className="content-detail-modal__genre">
                    {g}
                  </span>
                ))}
              </div>
            )}

          {reasons.length > 0 && (
            <div className="content-detail-modal__reasons">
              <WhyRecommended reasons={reasons} />
            </div>
          )}

            <p className="content-detail-modal__overview">
              {item.overview || 'Описание пока недоступно.'}
            </p>

            {hasEngagement && metrics && (
              <div className="content-detail-modal__metrics">
                <p className="content-detail-modal__metrics-label">Ваша история</p>
                <div className="content-detail-modal__metrics-row">
                  {metrics.clickCount > 0 && (
                    <span className="content-detail-modal__metric">
                      {metrics.clickCount} клик{metrics.clickCount > 1 ? 'а' : ''}
                    </span>
                  )}
                  {metrics.viewDuration > 0 && (
                    <span className="content-detail-modal__metric">
                      {formatDuration(metrics.viewDuration)} просмотра
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
