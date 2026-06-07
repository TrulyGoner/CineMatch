import { useMemo } from 'react';
import type { Content } from '@/entities/content/model/types';

const RECENT_KEY = 'recent_views';

interface RecentViewEntry {
  id: number;
  mediaType: string;
  timestamp: number;
}

export const useRecentViews = (catalog: Content[], limit = 8): Content[] =>
  useMemo(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (!raw) return [];
      const entries: RecentViewEntry[] = JSON.parse(raw);
      const map = new Map<string, Content>();
      catalog.forEach((c) => map.set(`${c.mediaType}-${c.id}`, c));
      const result: Content[] = [];
      for (const e of entries) {
        const key = `${e.mediaType}-${e.id}`;
        const content = map.get(key);
        if (content) {
          result.push(content);
          if (result.length >= limit) break;
        }
      }
      return result;
    } catch {
      return [];
    }
  }, [catalog, limit]);
