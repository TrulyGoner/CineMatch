import { useMemo } from 'react';
import { useAppSelector } from '@/app/store';
import {
  EngagementChart,
  ContentHeatmap,
  PersonalizationScore,
  GenreDistributionChart,
  RecommendationAccuracy,
  ActivityCalendar,
  buildEngagementData,
  buildGenreHeatmap,
  calculatePersonalizationScore,
} from '@/features/analytics-chart';
import { AchievementBadge } from '@/features/achievements';
import { selectBehaviorEvents } from '@/features/user-behavior-tracking/model/store';
import { selectRecommendations } from '@/features/recommendation-engine/model/store';
import { selectFeedback } from '@/features/recommendation-feedback/model/store';
import './UserDashboard.scss';

export const UserDashboard = () => {
  const events = useAppSelector(selectBehaviorEvents);
  const recommendations = useAppSelector(selectRecommendations);
  const feedback = useAppSelector(selectFeedback);
  const engagementData = useMemo(() => buildEngagementData(events), [events]);
  const heatmapData = useMemo(() => buildGenreHeatmap(events), [events]);
  const personalizationScore = useMemo(
    () => calculatePersonalizationScore(events, recommendations),
    [events, recommendations]
  );

  const accuracy = useMemo(() => {
    if (recommendations.length === 0) return 0;
    const likedCount = recommendations.filter(
      (r) => feedback.likes.includes(`${r.mediaType}-${r.id}`)
    ).length;
    return Math.round((likedCount / recommendations.length) * 100);
  }, [recommendations, feedback.likes]);

  return (
    <div className="user-dashboard">
      <div className="user-dashboard__row">
        <EngagementChart data={engagementData} />
        <PersonalizationScore score={personalizationScore} />
      </div>
      <div className="user-dashboard__row user-dashboard__row--three">
        <GenreDistributionChart data={heatmapData} />
        <RecommendationAccuracy accuracy={accuracy} totalRecommendations={recommendations.length} />
        <ActivityCalendar events={events} />
      </div>
      <ContentHeatmap data={heatmapData} />
      <AchievementBadge />
    </div>
  );
};
