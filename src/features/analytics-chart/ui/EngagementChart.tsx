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
          <CartesianGrid strokeDasharray="3 3" stroke="#2e3344" />
          <XAxis dataKey="time" stroke="#9aa3b5" fontSize={12} />
          <YAxis stroke="#9aa3b5" fontSize={12} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              background: '#1a1d27',
              border: '1px solid #2e3344',
              borderRadius: 8,
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="clicks"
            name={t('chart.clicks')}
            stroke="#6c8cff"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="views"
            name={t('chart.views')}
            stroke="#ff6b9d"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
