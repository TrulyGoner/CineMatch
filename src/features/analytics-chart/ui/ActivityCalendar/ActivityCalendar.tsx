import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { UserBehaviorEvent } from '@/entities/analytics/model/types';
import './ActivityCalendar.scss';

interface ActivityCalendarProps {
  events: UserBehaviorEvent[];
}

export const ActivityCalendar = ({ events }: ActivityCalendarProps) => {
  const { t } = useTranslation();
  const [now] = useState(() => Date.now());

  const days = useMemo(() => {
    const dayMs = 86400000;
    const result: { date: string; count: number; dayLabel: string }[] = [];

    for (let i = 27; i >= 0; i--) {
      const ts = now - i * dayMs;
      const d = new Date(ts);
      const dateStr = d.toISOString().slice(0, 10);
      const count = events.filter((e) => {
        const eDate = new Date(e.timestamp).toISOString().slice(0, 10);
        return eDate === dateStr;
      }).length;
      const dayLabel = d.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 2);
      result.push({ date: dateStr, count, dayLabel });
    }
    return result;
  }, [events, now]);

  const maxCount = Math.max(...days.map((d) => d.count), 1);

  return (
    <div className="activity-calendar">
      <h3 className="activity-calendar__title">{t('chart.activityTitle')}</h3>
      <div className="activity-calendar__grid">
        {days.map((d) => (
          <div
            key={d.date}
            className="activity-calendar__cell"
            style={{ opacity: d.count > 0 ? 0.2 + (d.count / maxCount) * 0.8 : 0.08 }}
            title={`${d.date}: ${d.count}`}
          >
            <span className="activity-calendar__day">{d.dayLabel}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
