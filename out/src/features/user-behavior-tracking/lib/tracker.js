import { debounce } from '@/shared/lib/debounce';
import { DEBOUNCE_MS } from '@/shared/config/constants';
export const createTracker = (onTrack) => {
    const trackClick = (contentId, genre) => {
        onTrack({
            contentId,
            type: 'click',
            timestamp: Date.now(),
            genre,
        });
    };
    const trackView = debounce((contentId, genre, duration) => {
        onTrack({
            contentId,
            type: 'view',
            timestamp: Date.now(),
            genre,
            duration,
        });
    }, DEBOUNCE_MS);
    const trackSearch = debounce((query) => {
        onTrack({
            contentId: 0,
            type: 'search',
            timestamp: Date.now(),
            query,
        });
    }, DEBOUNCE_MS);
    const trackFilter = debounce((genre) => {
        onTrack({
            contentId: 0,
            type: 'filter',
            timestamp: Date.now(),
            genre,
        });
    }, DEBOUNCE_MS);
    const createScrollTracker = (contentId, genre, element) => {
        let viewStart = null;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    viewStart = Date.now();
                }
                else if (viewStart !== null) {
                    const duration = Date.now() - viewStart;
                    if (duration > 500) {
                        trackView(contentId, genre, duration);
                    }
                    viewStart = null;
                }
            });
        }, { threshold: 0.5 });
        observer.observe(element);
        return () => observer.disconnect();
    };
    return { trackClick, trackView, trackSearch, trackFilter, createScrollTracker };
};
