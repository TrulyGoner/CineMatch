import { useMemo, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '@/shared/config/i18n';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { selectBehaviorEvents } from '@/features/user-behavior-tracking/model/store';
import { computeContentMetrics } from '@/features/user-behavior-tracking/lib/metrics';
import { WhyRecommended } from '@/features/recommendation-engine/ui/WhyRecommended';
import { SaveButton } from '@/features/saved-content';
import { StarRating } from '@/features/user-rating';
import { FeedbackButtons } from '@/features/recommendation-feedback';
import { CollectionManager } from '@/features/collections';
import { ContentPoster } from '@/shared/ui/ContentPoster';
import { buildTmdbImageUrl } from '@/shared/lib/tmdbImages';
import { formatDate, formatDuration } from '@/shared/lib/formatters';
import { Icon } from '@/shared/ui/Icon';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';
import { useContentDetail } from '../hooks/useContentDetail';
import { fetchSimilar, fetchWatchProviders } from '@/features/content-discovery/api/contentApi';
import { fetchVideos } from '@/features/content-discovery/api/videos';
import type { WatchProvider } from '@/features/content-discovery/api/contentApi';
import type { TmdbVideo } from '@/features/content-discovery/api/videos';
import type { Content } from '@/entities/content/model/types';
import { openDetail } from '@/features/content-detail/model/store';
import './ContentDetailModal.scss';

const RECENT_KEY = 'recent_views';

const addRecentView = (item: Content): void => {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    let list: { id: number; mediaType: string; timestamp: number }[] = raw ? JSON.parse(raw) : [];
    list = list.filter((v) => !(v.id === item.id && v.mediaType === item.mediaType));
    list.unshift({ id: item.id, mediaType: item.mediaType, timestamp: Date.now() });
    if (list.length > 20) list = list.slice(0, 20);
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
};

export const ContentDetailModal = () => {
  const { item, reasons, isOpen, close } = useContentDetail();
  const dispatch = useAppDispatch();
  const events = useAppSelector(selectBehaviorEvents);
  const { t } = useTranslation();
  const [similar, setSimilar] = useState<Content[]>([]);
  const [videos, setVideos] = useState<TmdbVideo[]>([]);
  const [showCollections, setShowCollections] = useState(false);
  const [providers, setProviders] = useState<{
    flatrate: WatchProvider[];
    rent: WatchProvider[];
    buy: WatchProvider[];
  }>({ flatrate: [], rent: [], buy: [] });

  const metrics = useMemo(
    () => (item ? computeContentMetrics(item.id, events) : null),
    [item, events]
  );

  useEffect(() => {
    if (item && isOpen) {
      addRecentView(item);
    }
  }, [item, isOpen]);

  useEffect(() => {
    if (!item || !isOpen) return;
    let cancelled = false;
    fetchSimilar(item.id, item.mediaType)
      .then((res) => { if (!cancelled) setSimilar(res); })
      .catch(() => { if (!cancelled) setSimilar([]); });
    return () => { cancelled = true; setSimilar([]); };
  }, [item, isOpen]);

  useEffect(() => {
    if (!item || !isOpen) return;
    let cancelled = false;
    fetchWatchProviders(item.id, item.mediaType)
      .then((res) => { if (!cancelled) setProviders(res); })
      .catch(() => { if (!cancelled) setProviders({ flatrate: [], rent: [], buy: [] }); });
    return () => { cancelled = true; setProviders({ flatrate: [], rent: [], buy: [] }); };
  }, [item, isOpen]);

  useEffect(() => {
    if (!item || !isOpen) return;
    let cancelled = false;
    fetchVideos(item.id, item.mediaType)
      .then((res) => { if (!cancelled) setVideos(res); })
      .catch(() => { if (!cancelled) setVideos([]); });
    return () => { cancelled = true; setVideos([]); };
  }, [item, isOpen]);

  const handleSimilarOpen = useCallback((simItem: Content) => {
    dispatch(openDetail({ item: simItem, reasons: [] }));
  }, [dispatch]);

  if (!item) return null;

  const backdropUrl = buildTmdbImageUrl(item.backdropPath, 'w780');
  const mediaLabel = item.mediaType === 'tv' ? t('detail.series') : t('detail.movie');
  const hasEngagement = metrics && (metrics.clickCount > 0 || metrics.viewDuration > 0);
  const contentKey = `${item.mediaType}-${item.id}`;
  const hasProviders = providers.flatrate.length > 0 || providers.rent.length > 0 || providers.buy.length > 0;

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
                <Icon name="star-filled" size={14} /> {item.voteAverage.toFixed(1)}
              </span>
            </div>

            <h2 className="content-detail-modal__title">{item.title}</h2>

            <div className="content-detail-modal__actions">
              <SaveButton item={item} />
              <StarRating contentKey={contentKey} size="md" interactive />
              <FeedbackButtons contentKey={contentKey} />
              <Button variant="ghost" size="sm" onClick={() => setShowCollections((p) => !p)}>
                <span className="content-detail-modal__collections-icon">+</span>
                {t('collections.title')}
              </Button>
            </div>

            {showCollections && item && (
              <div className="content-detail-modal__collections-panel">
                <CollectionManager itemKey={contentKey} />
              </div>
            )}

            <p className="content-detail-modal__meta">
              {formatDate(item.releaseDate)}
              <span className="content-detail-modal__dot">·</span>
              {item.voteCount.toLocaleString(i18n.language === 'ru' ? 'ru-RU' : 'en-US')} {t('detail.votes')}
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
              {item.overview || t('detail.noDescription')}
            </p>

            {hasEngagement && metrics && (
              <div className="content-detail-modal__metrics">
                <p className="content-detail-modal__metrics-label">{t('detail.yourHistory')}</p>
                <div className="content-detail-modal__metrics-row">
                  {metrics.clickCount > 0 && (
                    <span className="content-detail-modal__metric">
                      {metrics.clickCount} {t('detail.click')}{metrics.clickCount > 1 ? t('detail.clickAlt') : ''}
                    </span>
                  )}
                  {metrics.viewDuration > 0 && (
                    <span className="content-detail-modal__metric">
                      {formatDuration(metrics.viewDuration)} {t('detail.views')}
                    </span>
                  )}
                </div>
              </div>
            )}

            {videos.length > 0 && (
              <div className="content-detail-modal__trailers">
                <h4 className="content-detail-modal__trailers-title">{t('trailers.title')}</h4>
                <div className="content-detail-modal__trailers-row">
                  {videos.slice(0, 3).map((v) => (
                    <div key={v.id} className="content-detail-modal__trailer-card">
                      <iframe
                        src={`https://www.youtube.com/embed/${v.key}`}
                        title={v.name}
                        className="content-detail-modal__trailer-iframe"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                      />
                      <span className="content-detail-modal__trailer-name">{v.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {hasProviders && (
              <div className="content-detail-modal__providers">
                <h4 className="content-detail-modal__providers-title">{t('detail.whereToWatch')}</h4>
                {providers.flatrate.length > 0 && (
                  <div className="content-detail-modal__provider-group">
                    <span className="content-detail-modal__provider-label">{t('detail.streaming')}</span>
                    <div className="content-detail-modal__provider-icons">
                      {providers.flatrate.map((p) => {
                        const imgUrl = buildTmdbImageUrl(p.logo_path, 'w92');
                        return imgUrl ? (
                          <img
                            key={p.provider_id}
                            src={imgUrl}
                            alt={p.provider_name}
                            title={p.provider_name}
                            className="content-detail-modal__provider-icon"
                            loading="lazy"
                          />
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
                {providers.rent.length > 0 && (
                  <div className="content-detail-modal__provider-group">
                    <span className="content-detail-modal__provider-label">{t('detail.rent')}</span>
                    <div className="content-detail-modal__provider-icons">
                      {providers.rent.map((p) => {
                        const imgUrl = buildTmdbImageUrl(p.logo_path, 'w92');
                        return imgUrl ? (
                          <img
                            key={p.provider_id}
                            src={imgUrl}
                            alt={p.provider_name}
                            title={p.provider_name}
                            className="content-detail-modal__provider-icon"
                            loading="lazy"
                          />
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
                {providers.buy.length > 0 && (
                  <div className="content-detail-modal__provider-group">
                    <span className="content-detail-modal__provider-label">{t('detail.buy')}</span>
                    <div className="content-detail-modal__provider-icons">
                      {providers.buy.map((p) => {
                        const imgUrl = buildTmdbImageUrl(p.logo_path, 'w92');
                        return imgUrl ? (
                          <img
                            key={p.provider_id}
                            src={imgUrl}
                            alt={p.provider_name}
                            title={p.provider_name}
                            className="content-detail-modal__provider-icon"
                            loading="lazy"
                          />
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {similar.length > 0 && (
              <div className="content-detail-modal__similar">
                <h4 className="content-detail-modal__similar-title">{t('similar.title')}</h4>
                <div className="content-detail-modal__similar-row">
                  {similar.map((sim) => (
                    <button
                      key={`${sim.mediaType}-${sim.id}`}
                      type="button"
                      className="content-detail-modal__similar-card"
                      onClick={() => handleSimilarOpen(sim)}
                    >
                      <ContentPoster
                        title={sim.title}
                        posterPath={sim.posterPath}
                        backdropPath={sim.backdropPath}
                      />
                      <span className="content-detail-modal__similar-name">{sim.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
