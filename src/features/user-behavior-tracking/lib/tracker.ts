import { debounce } from '@/shared/lib/debounce';
import { DEBOUNCE_MS } from '@/shared/config/constants';
import type { UserBehaviorEvent } from '@/entities/analytics/model/types';

type TrackCallback = (event: UserBehaviorEvent) => void;

export const createTracker = (onTrack: TrackCallback) => {
  const trackClick = (contentId: number, genre?: string): void => {
    onTrack({
      contentId,
      type: 'click',
      timestamp: Date.now(),
      genre,
    });
  };

  const trackView = debounce((contentId: number, genre: string | undefined, duration: number) => {
    onTrack({
      contentId,
      type: 'view',
      timestamp: Date.now(),
      genre,
      duration,
    });
  }, DEBOUNCE_MS);

  const trackSearch = debounce((query: string) => {
    onTrack({
      contentId: 0,
      type: 'search',
      timestamp: Date.now(),
      query,
    });
  }, DEBOUNCE_MS);

  const trackFilter = debounce((genre: string) => {
    onTrack({
      contentId: 0,
      type: 'filter',
      timestamp: Date.now(),
      genre,
    });
  }, DEBOUNCE_MS);

  const createScrollTracker = (
    contentId: number,
    genre: string | undefined,
    element: HTMLElement
  ): (() => void) => {
    let viewStart: number | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            viewStart = Date.now();
          } else if (viewStart !== null) {
            const duration = Date.now() - viewStart;
            if (duration > 500) {
              trackView(contentId, genre, duration);
            }
            viewStart = null;
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  };

  return { trackClick, trackView, trackSearch, trackFilter, createScrollTracker };
};
