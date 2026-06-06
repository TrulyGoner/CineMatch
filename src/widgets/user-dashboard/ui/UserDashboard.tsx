import { useMemo } from 'react';
import { useAppSelector } from '@/app/store';
import {
  EngagementChart,
  ContentHeatmap,
  PersonalizationScore,
  buildEngagementData,
  buildGenreHeatmap,
  calculatePersonalizationScore,
} from '@/features/analytics-chart';
import { selectBehaviorEvents } from '@/features/user-behavior-tracking/model/store';
import { selectRecommendations } from '@/features/recommendation-engine/model/store';
import './UserDashboard.scss';

export const UserDashboard = () => {
  const events = useAppSelector(selectBehaviorEvents);
  const recommendations = useAppSelector(selectRecommendations);

  const engagementData = useMemo(() => buildEngagementData(events), [events]);
  const heatmapData = useMemo(() => buildGenreHeatmap(events), [events]);
  const personalizationScore = useMemo(
    () => calculatePersonalizationScore(events, recommendations),
    [events, recommendations]
  );

  return (
    <div className="user-dashboard">
      <div className="user-dashboard__row">
        <EngagementChart data={engagementData} />
        <PersonalizationScore score={personalizationScore} />
      </div>
      <ContentHeatmap data={heatmapData} />
    </div>
  );
};
