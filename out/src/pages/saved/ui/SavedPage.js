import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/app/store';
import { selectSavedIds } from '@/features/saved-content';
import { selectAllContent } from '@/features/content-discovery/model/store';
import { ContentCard } from '@/entities/content';
import { getContentKey } from '@/features/content-discovery/api/contentApi';
import { useContentDetail } from '@/features/content-detail';
import { useUserBehavior } from '@/features/user-behavior-tracking';
import './SavedPage.scss';
export const SavedPage = () => {
    const { t } = useTranslation();
    const savedIds = useAppSelector(selectSavedIds);
    const catalog = useAppSelector(selectAllContent);
    const { open } = useContentDetail();
    const { tracker } = useUserBehavior();
    const savedContent = useMemo(() => {
        const map = new Map();
        catalog.forEach((c) => map.set(getContentKey(c), c));
        return savedIds.map((key) => map.get(key)).filter((c) => Boolean(c));
    }, [savedIds, catalog]);
    return (React.createElement("div", { className: "saved-page" },
        React.createElement("section", { className: "saved-page__hero" },
            React.createElement("h1", null, t('saved.title'))),
        savedContent.length === 0 ? (React.createElement("p", { className: "saved-page__empty" }, t('saved.empty'))) : (React.createElement("div", { className: "content-grid__items" }, savedContent.map((item) => (React.createElement(ContentCard, { key: getContentKey(item), item: item, onOpen: (c) => {
                tracker.trackClick(c.id, c.genres[0]);
                open(c);
            } })))))));
};
