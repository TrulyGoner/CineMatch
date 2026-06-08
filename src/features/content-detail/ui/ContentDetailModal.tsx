import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
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
import { env } from '@/shared/config/env';
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

const proxifyTmdbUrl = (url: string): string =>
  url.startsWith('https://www.themoviedb.org')
    ? url.replace('https://www.themoviedb.org', env.tmdbWwwBase)
    : url;

const renderProviderGroup = (
  providers: WatchProvider[],
  watchLink: string | null,
  label: string,
  contentId?: number,
  mediaType?: string
): React.ReactNode => {
  if (providers.length === 0) return null;
  const fallbackHref = contentId && mediaType
    ? `${env.tmdbWwwBase}/${mediaType}/${contentId}/watch`
    : `${env.tmdbWwwBase}/watch`;
  const baseHref = watchLink ? proxifyTmdbUrl(watchLink) : fallbackHref;
  return (
    <div className="content-detail-modal__provider-group">
      <span className="content-detail-modal__provider-label">{label}</span>
      <div className="content-detail-modal__provider-icons">
        {providers.map((p) => {
          const imgUrl = buildTmdbImageUrl(p.logo_path, 'w92');
          if (!imgUrl) return null;
          return (
            <a
              key={p.provider_id}
              href={baseHref}
              target="_blank"
              rel="noopener noreferrer"
              title={`${p.provider_name} — ${label}`}
              className="content-detail-modal__provider-link"
            >
              <img
                src={imgUrl}
                alt={p.provider_name}
                className="content-detail-modal__provider-icon"
                loading="lazy"
              />
            </a>
          );
        })}
      </div>
    </div>
  );
};

export const ContentDetailModal = () => {
  const { item, reasons, isOpen, close } = useContentDetail();
  const dispatch = useAppDispatch();
  const events = useAppSelector(selectBehaviorEvents);
  const { t } = useTranslation();
  const [similar, setSimilar] = useState<Content[]>([]);
  const [videos, setVideos] = useState<TmdbVideo[]>([]);
  const [showCollections, setShowCollections] = useState(false);
  const [fullscreenVideo, setFullscreenVideo] = useState<TmdbVideo | null>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const [providers, setProviders] = useState<{
    flatrate: WatchProvider[];
    rent: WatchProvider[];
    buy: WatchProvider[];
    link: string | null;
  }>({ flatrate: [], rent: [], buy: [], link: null });

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
      .catch(() => { if (!cancelled) setProviders({ flatrate: [], rent: [], buy: [], link: null }); });
    return () => { cancelled = true; setProviders({ flatrate: [], rent: [], buy: [], link: null }); };
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
                      <div className="content-detail-modal__trailer-media">
                        <iframe
                          src={`https://www.youtube.com/embed/${v.key}`}
                          title={v.name}
                          className="content-detail-modal__trailer-iframe"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          loading="lazy"
                        />
                        <button
                          type="button"
                          className="content-detail-modal__trailer-fullscreen"
                          onClick={() => setFullscreenVideo(v)}
                          aria-label="Fullscreen"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M21 8V5a2 2 0 0 0-2-2h-3" /><path d="M16 21h3a2 2 0 0 0 2-2v-3" /><path d="M3 16v3a2 2 0 0 0 2 2h3" />
                          </svg>
                        </button>
                      </div>
                      <span className="content-detail-modal__trailer-name">{v.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {fullscreenVideo && (
              <div
                className="content-detail-modal__fullscreen"
                ref={fullscreenRef}
                onClick={(e) => {
                  if (e.target === fullscreenRef.current) setFullscreenVideo(null);
                }}
                onKeyDown={(e) => { if (e.key === 'Escape') setFullscreenVideo(null); }}
                role="presentation"
              >
                <button
                  type="button"
                  className="content-detail-modal__fullscreen-close"
                  onClick={() => setFullscreenVideo(null)}
                  aria-label="Close"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18" /><path d="M6 6l12 12" />
                  </svg>
                </button>
                <iframe
                  src={`https://www.youtube.com/embed/${fullscreenVideo.key}?autoplay=1`}
                  title={fullscreenVideo.name}
                  className="content-detail-modal__fullscreen-video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {hasProviders && (
              <div className="content-detail-modal__providers">
                <h4 className="content-detail-modal__providers-title">{t('detail.whereToWatch')}</h4>
                {renderProviderGroup(providers.flatrate, providers.link, t('detail.streaming'), item.id, item.mediaType)}
                {renderProviderGroup(providers.rent, providers.link, t('detail.rent'), item.id, item.mediaType)}
                {renderProviderGroup(providers.buy, providers.link, t('detail.buy'), item.id, item.mediaType)}
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
