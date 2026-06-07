import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { GenreHeatmapCell } from '@/entities/analytics/model/types';
import './GenreDistributionChart.scss';

const COLORS = ['#e8b865', '#d4846a', '#8fbf9a', '#6c8cff', '#c084fc', '#f472b6', '#fb923c', '#a3a3a3'];

interface GenreDistributionChartProps {
  data: GenreHeatmapCell[];
}

export const GenreDistributionChart = ({ data }: GenreDistributionChartProps) => {
  const { t } = useTranslation();
  if (data.length === 0) return null;

  return (
    <div className="genre-distribution-chart">
      <h3 className="genre-distribution-chart__title">{t('chart.genreDistribution')}</h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="genre"
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={36}
            paddingAngle={2}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={0.85} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#1a1d27', border: '1px solid #2e3344', borderRadius: 8 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
