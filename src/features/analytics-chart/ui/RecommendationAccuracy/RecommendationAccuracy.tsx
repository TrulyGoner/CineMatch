import { useTranslation } from 'react-i18next';
import './RecommendationAccuracy.scss';

interface RecommendationAccuracyProps {
  accuracy: number;
  totalRecommendations: number;
}

export const RecommendationAccuracy = ({ accuracy, totalRecommendations }: RecommendationAccuracyProps) => {
  const { t } = useTranslation();
  const pct = Math.min(100, Math.max(0, accuracy));

  return (
    <div className="recommendation-accuracy">
      <h3 className="recommendation-accuracy__title">{t('chart.accuracyTitle')}</h3>
      <div className="recommendation-accuracy__gauge">
        <svg viewBox="0 0 120 120" className="recommendation-accuracy__svg">
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
          <circle
            cx="60" cy="60" r="52"
            fill="none"
            stroke="#e8b865"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${pct / 100 * 326} 326`}
            transform="rotate(-90 60 60)"
            style={{ transition: 'stroke-dasharray 0.6s ease' }}
          />
        </svg>
        <span className="recommendation-accuracy__value">{pct}%</span>
      </div>
      <p className="recommendation-accuracy__hint">
        {totalRecommendations > 0
          ? t('chart.accuracyHint', { total: totalRecommendations })
          : t('chart.accuracyNoData')}
      </p>
    </div>
  );
};
