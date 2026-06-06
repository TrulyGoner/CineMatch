import { useCallback, useEffect } from 'react';
import { ContentCard } from '@/entities/content';
import { useContentFeed } from '@/features/content-discovery/hooks/useContentFeed';
import { useUserBehavior } from '@/features/user-behavior-tracking';
import { Button } from '@/shared/ui/Button';
import { Skeleton } from '@/shared/ui/Skeleton';
import { Spinner } from '@/shared/ui/Spinner';
import './ContentGrid.scss';
export const ContentGrid = () => {
    const { items, status, error, hasMore, loadMore, retry, prefetchNext } = useContentFeed();
    const { tracker } = useUserBehavior();
    const handleClick = useCallback((id, genre) => {
        tracker.trackClick(id, genre);
    }, [tracker]);
    const handleView = useCallback((id, genre, duration) => {
        tracker.trackView(id, genre, duration);
    }, [tracker]);
    useEffect(() => {
        if (items.length > 0) {
            prefetchNext();
        }
    }, [items.length, prefetchNext]);
    if (status === 'loading' && items.length === 0) {
        return (React.createElement("div", { className: "content-grid" },
            React.createElement("div", { className: "content-grid__items" }, Array.from({ length: 6 }).map((_, i) => (React.createElement(Skeleton, { key: i, height: "300px" }))))));
    }
    if (status === 'error' && items.length === 0) {
        return (React.createElement("div", { className: "content-grid__error" },
            React.createElement("p", null, error ?? 'Не удалось загрузить контент'),
            React.createElement(Button, { onClick: retry }, "\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C")));
    }
    return (React.createElement("div", { className: "content-grid" },
        React.createElement("div", { className: "content-grid__items" }, items.map((item) => (React.createElement(ContentCard, { key: item.id, item: item, onClick: handleClick, onView: handleView })))),
        hasMore && (React.createElement("div", { className: "content-grid__more" },
            React.createElement(Button, { variant: "secondary", onClick: loadMore, disabled: status === 'loading' }, status === 'loading' ? React.createElement(Spinner, { size: "sm" }) : 'Загрузить ещё')))));
};
