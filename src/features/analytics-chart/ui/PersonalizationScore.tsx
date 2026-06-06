import { formatPercent } from '@/shared/lib/formatters';
import './PersonalizationScore.scss';

interface PersonalizationScoreProps {
  score: number;
}

export const PersonalizationScore = ({ score }: PersonalizationScoreProps) => (
  <div className="personalization-score">
    <h3 className="personalization-score__title">Оценка персонализации</h3>
    <div className="personalization-score__bar">
      <div
        className="personalization-score__fill"
        style={{ width: formatPercent(score) }}
      />
    </div>
    <p className="personalization-score__value">{formatPercent(score)}</p>
    <p className="personalization-score__hint">
      Насколько рекомендации совпадают с вашими интересами
    </p>
  </div>
);
