import { useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/app/store';
import { selectSavedIds } from '@/features/saved-content';
import { selectAllContent } from '@/features/content-discovery/model/store';
import { selectCollections, CollectionManager } from '@/features/collections';
import { ContentCard } from '@/entities/content';
import { getContentKey } from '@/features/content-discovery/api/contentApi';
import { useContentDetail } from '@/features/content-detail';
import { useUserBehavior } from '@/features/user-behavior-tracking';
import type { Content } from '@/entities/content/model/types';
import './SavedPage.scss';

export const SavedPage = () => {
  const { t } = useTranslation();
  const savedIds = useAppSelector(selectSavedIds);
  const catalog = useAppSelector(selectAllContent);
  const collections = useAppSelector(selectCollections);
  const { open } = useContentDetail();
  const { tracker } = useUserBehavior();
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);

  const savedContent = useMemo(() => {
    const map = new Map<string, Content>();
    catalog.forEach((c) => map.set(getContentKey(c), c));
    return savedIds.map((key) => map.get(key)).filter((c): c is Content => Boolean(c));
  }, [savedIds, catalog]);

  const collectionContent = useMemo(() => {
    if (!selectedCollectionId) return null;
    const col = collections.find((c) => c.id === selectedCollectionId);
    if (!col) return null;
    const map = new Map<string, Content>();
    catalog.forEach((c) => map.set(getContentKey(c), c));
    return col.itemKeys.map((key) => map.get(key)).filter((c): c is Content => Boolean(c));
  }, [selectedCollectionId, collections, catalog]);

  const selectedCollection = useMemo(
    () => collections.find((c) => c.id === selectedCollectionId),
    [collections, selectedCollectionId]
  );

  const displayItems = collectionContent ?? savedContent;
  const isEmpty = displayItems.length === 0;

  const handleOpen = useCallback(
    (item: Content) => {
      tracker.trackClick(item.id, item.genres[0]);
      open(item);
    },
    [tracker, open]
  );

  return (
    <div className="saved-page">
      <h1>{t('saved.title')}</h1>

      {collections.length > 0 && (
        <div className="saved-page__collections-bar">
          <button
            type="button"
            className={`saved-page__collection-chip ${!selectedCollectionId ? 'saved-page__collection-chip--active' : ''}`}
            onClick={() => setSelectedCollectionId(null)}
          >
            {t('saved.title')}
          </button>
          {collections.map((col) => (
            <button
              key={col.id}
              type="button"
              className={`saved-page__collection-chip ${selectedCollectionId === col.id ? 'saved-page__collection-chip--active' : ''}`}
              onClick={() => setSelectedCollectionId(col.id)}
            >
              {col.name}
              <span className="saved-page__collection-count">{col.itemKeys.length}</span>
            </button>
          ))}
        </div>
      )}

      <section className="saved-page__collections-section">
        <details className="saved-page__collections-details">
          <summary className="saved-page__collections-summary">
            {t('collections.title')}
          </summary>
          <CollectionManager />
        </details>
      </section>

      {selectedCollection && (
        <p className="saved-page__collection-name">
          {selectedCollection.name}
        </p>
      )}

      {isEmpty ? (
        <p className="saved-page__empty">
          {selectedCollection ? t('collections.emptyCollection') : t('saved.empty')}
        </p>
      ) : (
        <div className="content-grid__items">
          {displayItems.map((item) => (
            <ContentCard
              key={getContentKey(item)}
              item={item}
              onOpen={handleOpen}
            />
          ))}
        </div>
      )}
    </div>
  );
};
