import { useTranslation } from 'react-i18next';
import type { GenreHeatmapCell } from '@/entities/analytics/model/types';
import './ContentHeatmap.scss';

interface ContentHeatmapProps {
  data: GenreHeatmapCell[];
}

export const ContentHeatmap = ({ data }: ContentHeatmapProps) => {
  const { t } = useTranslation();

  return (
    <div className="content-heatmap">
      <h3 className="content-heatmap__title">{t('chart.heatmapTitle')}</h3>
      {data.length === 0 ? (
        <p className="content-heatmap__empty">{t('chart.heatmapEmpty')}</p>
      ) : (
        <div className="content-heatmap__grid">
          {data.map((cell) => (
            <div
              key={cell.genre}
              className="content-heatmap__cell"
              style={{ opacity: 0.3 + cell.intensity * 0.7 }}
              title={`${cell.genre}: ${cell.count}`}
            >
              <span className="content-heatmap__genre">{cell.genre}</span>
              <span className="content-heatmap__count">{cell.count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
