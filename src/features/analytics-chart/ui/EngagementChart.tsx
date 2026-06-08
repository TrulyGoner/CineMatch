import { useTranslation } from 'react-i18next';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { EngagementPoint } from '@/entities/analytics/model/types';
import './EngagementChart.scss';

interface EngagementChartProps {
  data: EngagementPoint[];
}

export const EngagementChart = ({ data }: EngagementChartProps) => {
  const { t } = useTranslation();

  return (
    <div className="engagement-chart">
      <h3 className="engagement-chart__title">{t('chart.engagementTitle')}</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
          <XAxis dataKey="time" stroke="var(--chart-axis)" fontSize={12} />
          <YAxis stroke="var(--chart-axis)" fontSize={12} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              background: 'var(--chart-tooltip-bg)',
              border: '1px solid var(--chart-tooltip-border)',
              borderRadius: 8,
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="clicks"
            name={t('chart.clicks')}
            stroke="var(--chart-line-clicks)"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="views"
            name={t('chart.views')}
            stroke="var(--chart-line-views)"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
