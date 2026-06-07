import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/app/store';
import { ContentCard } from '@/entities/content';
import { getContentKey } from '@/features/content-discovery/api/contentApi';
import { useContentFeed } from '@/features/content-discovery/hooks/useContentFeed';
import { selectFilteredContent, selectAllContent } from '@/features/content-discovery/model/store';
import { useContentDetail } from '@/features/content-detail';
import { useUserBehavior } from '@/features/user-behavior-tracking';
import { computeContentMetrics } from '@/features/user-behavior-tracking/lib/metrics';
import { selectBehaviorEvents } from '@/features/user-behavior-tracking/model/store';
import { Button } from '@/shared/ui/Button';
import { Skeleton } from '@/shared/ui/Skeleton';
import { Spinner } from '@/shared/ui/Spinner';
import './ContentGrid.scss';
export const ContentGrid = ({ showEmptyFilterMessage = true }) => {
    const { status, error, hasMore, loadMore, retry, prefetchNext } = useContentFeed();
    const { t } = useTranslation();
    const filteredItems = useAppSelector(selectFilteredContent);
    const allItems = useAppSelector(selectAllContent);
    const events = useAppSelector(selectBehaviorEvents);
    const { tracker } = useUserBehavior();
    const { open } = useContentDetail();
    const handleOpen = useCallback((item) => {
        tracker.trackClick(item.id, item.genres[0]);
        open(item);
    }, [tracker, open]);
    const handleView = useCallback((id, genre, duration) => {
        tracker.trackView(id, genre, duration);
    }, [tracker]);
    const metricsMap = useMemo(() => {
        const map = new Map();
        for (const item of filteredItems) {
            map.set(item.id, computeContentMetrics(item.id, events));
        }
        return map;
    }, [filteredItems, events]);
    useEffect(() => {
        if (allItems.length > 0) {
            prefetchNext();
        }
    }, [allItems.length, prefetchNext]);
    if (status === 'loading' && allItems.length === 0) {
        return (React.createElement("div", { className: "content-grid" },
            React.createElement("div", { className: "content-grid__items" }, Array.from({ length: 6 }).map((_, i) => (React.createElement(Skeleton, { key: i, height: "300px" }))))));
    }
    if (status === 'error' && allItems.length === 0) {
        return (React.createElement("div", { className: "content-grid__error" },
            React.createElement("p", null, error ?? t('content.errorLoad')),
            React.createElement(Button, { onClick: retry }, t('content.retry'))));
    }
    return (React.createElement("div", { className: "content-grid" },
        React.createElement("div", { className: "content-grid__items" }, filteredItems.map((item) => (React.createElement(ContentCard, { key: getContentKey(item), item: item, metrics: metricsMap.get(item.id), onOpen: handleOpen, onView: handleView })))),
        showEmptyFilterMessage && filteredItems.length === 0 && allItems.length > 0 && (React.createElement("p", { className: "content-grid__empty" }, t('content.nothingFound'))),
        status === 'error' && allItems.length > 0 && (React.createElement("p", { className: "content-grid__error-inline" }, error)),
        hasMore && (React.createElement("div", { className: "content-grid__more" },
            React.createElement(Button, { variant: "secondary", onClick: loadMore, disabled: status === 'loading' }, status === 'loading' ? React.createElement(Spinner, { size: "sm" }) : t('content.loadMore'))))));
};
