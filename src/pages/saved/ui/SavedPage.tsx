import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/app/store';
import { selectSavedIds } from '@/features/saved-content';
import { selectAllContent } from '@/features/content-discovery/model/store';
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
  const { open } = useContentDetail();
  const { tracker } = useUserBehavior();

  const savedContent = useMemo(() => {
    const map = new Map<string, Content>();
    catalog.forEach((c) => map.set(getContentKey(c), c));
    return savedIds.map((key) => map.get(key)).filter((c): c is Content => Boolean(c));
  }, [savedIds, catalog]);

  return (
    <div className="saved-page">
      <section className="saved-page__hero">
        <h1>{t('saved.title')}</h1>
      </section>

      {savedContent.length === 0 ? (
        <p className="saved-page__empty">{t('saved.empty')}</p>
      ) : (
        <div className="content-grid__items">
          {savedContent.map((item) => (
            <ContentCard
              key={getContentKey(item)}
              item={item}
              onOpen={(c) => {
                tracker.trackClick(c.id, c.genres[0]);
                open(c);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
