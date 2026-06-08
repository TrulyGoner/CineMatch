import { useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/app/store';
import { selectAllContent } from '@/features/content-discovery/model/store';
import { useContentDetail } from '@/features/content-detail';
import { useUserBehavior } from '@/features/user-behavior-tracking';
import { ContentCard } from '@/entities/content';
import { getContentKey } from '@/features/content-discovery/api/contentApi';
import { STORAGE_KEYS } from '@/shared/config/constants';
import { localStorageManager } from '@/shared/storage/localStorageManager';
import { Button } from '@/shared/ui/Button';
import type { Content } from '@/entities/content/model/types';
import './HistoryPage.scss';

interface RecentViewItem {
  id: number;
  mediaType: string;
  timestamp: number;
}

const RECENT_KEY = STORAGE_KEYS.recentViews;

const groupByDate = (items: { timestamp: number; item: Content }[]): Map<string, typeof items> => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterday = today - 86_400_000;
  const groups = new Map<string, typeof items>();

  for (const entry of items) {
    let key: string;
    if (entry.timestamp >= today) key = 'today';
    else if (entry.timestamp >= yesterday) key = 'yesterday';
    else key = 'earlier';
    const existing = groups.get(key);
    if (existing) existing.push(entry);
    else groups.set(key, [entry]);
  }
  return groups;
};

export const HistoryPage = () => {
  const { t } = useTranslation();
  const catalog = useAppSelector(selectAllContent);
  const { open } = useContentDetail();
  const { tracker } = useUserBehavior();

  const recentRaw = useMemo(() => {
    return localStorageManager.get<RecentViewItem[]>(RECENT_KEY) ?? [];
  }, []);

  const historyItems = useMemo(() => {
    const map = new Map<string, Content>();
    catalog.forEach((c) => map.set(getContentKey(c), c));
    return recentRaw
      .map((r) => {
        const key = `${r.mediaType}-${r.id}`;
        const item = map.get(key);
        return item ? { timestamp: r.timestamp, item } : null;
      })
      .filter((r): r is { timestamp: number; item: Content } => Boolean(r));
  }, [recentRaw, catalog]);

  const grouped = useMemo(() => groupByDate(historyItems), [historyItems]);

  const handleClear = useCallback(() => {
    localStorageManager.remove(RECENT_KEY);
    window.location.reload();
  }, []);

  const handleOpen = useCallback(
    (item: Content) => {
      tracker.trackClick(item.id, item.genres[0]);
      open(item);
    },
    [tracker, open]
  );

  return (
    <div className="history-page">
      <div className="history-page__header">
        <h1>{t('history.title')}</h1>
        {historyItems.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleClear}>
            {t('history.clear')}
          </Button>
        )}
      </div>
      <p className="page-intro">{t('history.description')}</p>

      {historyItems.length === 0 ? (
        <p className="history-page__empty">{t('history.empty')}</p>
      ) : (
        <div className="history-page__groups">
          {(['today', 'yesterday', 'earlier'] as const).map((groupKey) => {
            const group = grouped.get(groupKey);
            if (!group || group.length === 0) return null;
            return (
              <section key={groupKey} className="history-page__group">
                <h2 className="history-page__group-title">{t(`history.${groupKey}`)}</h2>
                <div className="content-grid__items">
                  {group.map(({ item }) => (
                    <ContentCard
                      key={getContentKey(item)}
                      item={item}
                      onOpen={handleOpen}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};
