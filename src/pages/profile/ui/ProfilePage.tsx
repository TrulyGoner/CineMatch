import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/app/store';
import { selectBehaviorEvents } from '@/features/user-behavior-tracking/model/store';
import { selectAllRatings } from '@/features/user-rating/model/store';
import { selectSavedIds } from '@/features/saved-content';
import { selectFeedback } from '@/features/recommendation-feedback/model/store';
import { AchievementBadge } from '@/features/achievements';
import { STORAGE_KEYS } from '@/shared/config/constants';
import { localStorageManager } from '@/shared/storage/localStorageManager';
import './ProfilePage.scss';

interface RecentViewItem {
  id: number;
  mediaType: string;
  timestamp: number;
}

export const ProfilePage = () => {
  const { t } = useTranslation();
  const events = useAppSelector(selectBehaviorEvents);
  const ratings = useAppSelector(selectAllRatings);
  const savedIds = useAppSelector(selectSavedIds);
  const feedback = useAppSelector(selectFeedback);
  const stats = useMemo(() => {
    const viewEvents = events.filter((e) => e.type === 'view');
    const clickEvents = events.filter((e) => e.type === 'click');
    const uniqueViewed = new Set(viewEvents.map((e) => e.contentId)).size;
    const uniqueClicked = new Set(clickEvents.map((e) => e.contentId)).size;

    const recentViews = localStorageManager.get<RecentViewItem[]>(STORAGE_KEYS.recentViews) ?? [];
    const recentCount = recentViews.length;

    const genreCounts = new Map<string, number>();
    for (const e of events) {
      if (e.genre) {
        genreCounts.set(e.genre, (genreCounts.get(e.genre) ?? 0) + 1);
      }
    }
    const topGenres = [...genreCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([genre]) => genre);

    return {
      ratingsCount: Object.keys(ratings).length,
      savedCount: savedIds.length,
      viewsCount: recentCount || uniqueViewed,
      clicksCount: uniqueClicked,
      likesCount: feedback.likes.length,
      dislikesCount: feedback.dislikes.length,
      feedbackCount: feedback.likes.length + feedback.dislikes.length,
      topGenres,
      totalEvents: events.length,
    };
  }, [events, ratings, savedIds, feedback]);

  return (
    <div className="profile-page">
      <div className="profile-page__header">
        <div className="profile-page__avatar">
          <span className="profile-page__avatar-letter">U</span>
        </div>
        <div className="profile-page__header-info">
          <h1>{t('profile.title')}</h1>
          <p className="profile-page__subtitle">
            {stats.totalEvents > 0
              ? `${stats.totalEvents} interactions`
              : t('explorer.loading')}
          </p>
        </div>
      </div>

      <section className="profile-page__section">
        <h2 className="section-title">{t('profile.stats')}</h2>
        <div className="profile-page__stats-grid">
          <div className="profile-page__stat-card">
            <span className="profile-page__stat-value">{stats.ratingsCount}</span>
            <span className="profile-page__stat-label">{t('profile.ratings')}</span>
          </div>
          <div className="profile-page__stat-card">
            <span className="profile-page__stat-value">{stats.savedCount}</span>
            <span className="profile-page__stat-label">{t('profile.saved')}</span>
          </div>
          <div className="profile-page__stat-card">
            <span className="profile-page__stat-value">{stats.viewsCount}</span>
            <span className="profile-page__stat-label">{t('profile.views')}</span>
          </div>
          <div className="profile-page__stat-card">
            <span className="profile-page__stat-value">{stats.likesCount}</span>
            <span className="profile-page__stat-label">{t('profile.likes')}</span>
          </div>
          <div className="profile-page__stat-card">
            <span className="profile-page__stat-value">{stats.dislikesCount}</span>
            <span className="profile-page__stat-label">{t('profile.dislikes')}</span>
          </div>
          <div className="profile-page__stat-card">
            <span className="profile-page__stat-value">{stats.feedbackCount}</span>
            <span className="profile-page__stat-label">{t('profile.feedback')}</span>
          </div>
        </div>
      </section>

      {stats.topGenres.length > 0 && (
        <section className="profile-page__section">
          <h2 className="section-title">{t('profile.genres')}</h2>
          <div className="profile-page__genres">
            {stats.topGenres.map((genre) => (
              <span key={genre} className="profile-page__genre-chip">{genre}</span>
            ))}
          </div>
        </section>
      )}

      <section className="profile-page__section">
        <h2 className="section-title">{t('settings.achievementsTitle')}</h2>
        <AchievementBadge />
      </section>
    </div>
  );
};
