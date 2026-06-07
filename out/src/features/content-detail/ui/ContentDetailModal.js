import { useMemo, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '@/shared/config/i18n';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { selectBehaviorEvents } from '@/features/user-behavior-tracking/model/store';
import { computeContentMetrics } from '@/features/user-behavior-tracking/lib/metrics';
import { WhyRecommended } from '@/features/recommendation-engine/ui/WhyRecommended';
import { SaveButton } from '@/features/saved-content';
import { ContentPoster } from '@/shared/ui/ContentPoster';
import { buildTmdbImageUrl } from '@/shared/lib/tmdbImages';
import { formatDate, formatDuration } from '@/shared/lib/formatters';
import { Modal } from '@/shared/ui/Modal';
import { useContentDetail } from '../hooks/useContentDetail';
import { fetchSimilar } from '@/features/content-discovery/api/contentApi';
import { openDetail } from '@/features/content-detail/model/store';
import './ContentDetailModal.scss';
const RECENT_KEY = 'recent_views';
const addRecentView = (item) => {
    try {
        const raw = localStorage.getItem(RECENT_KEY);
        let list = raw ? JSON.parse(raw) : [];
        list = list.filter((v) => !(v.id === item.id && v.mediaType === item.mediaType));
        list.unshift({ id: item.id, mediaType: item.mediaType, timestamp: Date.now() });
        if (list.length > 20)
            list = list.slice(0, 20);
        localStorage.setItem(RECENT_KEY, JSON.stringify(list));
    }
    catch {
        // ignore
    }
};
export const ContentDetailModal = () => {
    const { item, reasons, isOpen, close } = useContentDetail();
    const dispatch = useAppDispatch();
    const events = useAppSelector(selectBehaviorEvents);
    const { t } = useTranslation();
    const [similar, setSimilar] = useState([]);
    const [similarLoading, setSimilarLoading] = useState(false);
    const metrics = useMemo(() => (item ? computeContentMetrics(item.id, events) : null), [item, events]);
    useEffect(() => {
        if (item && isOpen) {
            addRecentView(item);
        }
    }, [item, isOpen]);
    useEffect(() => {
        if (!item || !isOpen) {
            setSimilar([]);
            return;
        }
        let cancelled = false;
        setSimilarLoading(true);
        fetchSimilar(item.id, item.mediaType)
            .then((res) => { if (!cancelled)
            setSimilar(res); })
            .catch(() => { if (!cancelled)
            setSimilar([]); })
            .finally(() => { if (!cancelled)
            setSimilarLoading(false); });
        return () => { cancelled = true; };
    }, [item?.id, item?.mediaType, isOpen]);
    const handleSimilarOpen = useCallback((simItem) => {
        dispatch(openDetail({ item: simItem, reasons: [] }));
    }, [dispatch]);
    if (!item)
        return null;
    const backdropUrl = buildTmdbImageUrl(item.backdropPath, 'w780');
    const mediaLabel = item.mediaType === 'tv' ? t('detail.series') : t('detail.movie');
    const hasEngagement = metrics && (metrics.clickCount > 0 || metrics.viewDuration > 0);
    return (React.createElement(Modal, { isOpen: isOpen, onClose: close, variant: "cinema", className: "content-detail-modal" },
        React.createElement("div", { className: "content-detail-modal__shell" },
            React.createElement("div", { className: "content-detail-modal__hero" },
                backdropUrl ? (React.createElement("img", { className: "content-detail-modal__backdrop-img", src: backdropUrl, alt: "", "aria-hidden": "true" })) : (React.createElement("div", { className: "content-detail-modal__backdrop-fallback" })),
                React.createElement("div", { className: "content-detail-modal__hero-overlay" })),
            React.createElement("div", { className: "content-detail-modal__panel" },
                React.createElement("div", { className: "content-detail-modal__poster-wrap" },
                    React.createElement("div", { className: "content-detail-modal__poster" },
                        React.createElement(ContentPoster, { title: item.title, posterPath: item.posterPath, backdropPath: item.backdropPath }))),
                React.createElement("div", { className: "content-detail-modal__info" },
                    React.createElement("div", { className: "content-detail-modal__labels" },
                        React.createElement("span", { className: "content-detail-modal__badge" }, mediaLabel),
                        React.createElement("span", { className: "content-detail-modal__rating" },
                            "\u2605 ",
                            item.voteAverage.toFixed(1))),
                    React.createElement("h2", { className: "content-detail-modal__title" }, item.title),
                    React.createElement("div", { className: "content-detail-modal__save-wrap" },
                        React.createElement(SaveButton, { item: item })),
                    React.createElement("p", { className: "content-detail-modal__meta" },
                        formatDate(item.releaseDate),
                        React.createElement("span", { className: "content-detail-modal__dot" }, "\u00B7"),
                        item.voteCount.toLocaleString(i18n.language === 'ru' ? 'ru-RU' : 'en-US'),
                        " ",
                        t('detail.votes')),
                    item.genres.length > 0 && (React.createElement("div", { className: "content-detail-modal__genres" }, item.genres.map((g) => (React.createElement("span", { key: g, className: "content-detail-modal__genre" }, g))))),
                    reasons.length > 0 && (React.createElement("div", { className: "content-detail-modal__reasons" },
                        React.createElement(WhyRecommended, { reasons: reasons }))),
                    React.createElement("p", { className: "content-detail-modal__overview" }, item.overview || t('detail.noDescription')),
                    hasEngagement && metrics && (React.createElement("div", { className: "content-detail-modal__metrics" },
                        React.createElement("p", { className: "content-detail-modal__metrics-label" }, t('detail.yourHistory')),
                        React.createElement("div", { className: "content-detail-modal__metrics-row" },
                            metrics.clickCount > 0 && (React.createElement("span", { className: "content-detail-modal__metric" },
                                metrics.clickCount,
                                " ",
                                t('detail.click'),
                                metrics.clickCount > 1 ? t('detail.clickAlt') : '')),
                            metrics.viewDuration > 0 && (React.createElement("span", { className: "content-detail-modal__metric" },
                                formatDuration(metrics.viewDuration),
                                " ",
                                t('detail.views')))))),
                    !similarLoading && similar.length > 0 && (React.createElement("div", { className: "content-detail-modal__similar" },
                        React.createElement("h4", { className: "content-detail-modal__similar-title" }, t('similar.title')),
                        React.createElement("div", { className: "content-detail-modal__similar-row" }, similar.map((sim) => (React.createElement("button", { key: `${sim.mediaType}-${sim.id}`, type: "button", className: "content-detail-modal__similar-card", onClick: () => handleSimilarOpen(sim) },
                            React.createElement(ContentPoster, { title: sim.title, posterPath: sim.posterPath, backdropPath: sim.backdropPath }),
                            React.createElement("span", { className: "content-detail-modal__similar-name" }, sim.title))))))))))));
};
