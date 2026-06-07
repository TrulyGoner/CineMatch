import { useTranslation } from 'react-i18next';
import { formatPercent } from '@/shared/lib/formatters';
import './PersonalizationScore.scss';

interface PersonalizationScoreProps {
  score: number;
}

export const PersonalizationScore = ({ score }: PersonalizationScoreProps) => {
  const { t } = useTranslation();

  return (
    <div className="personalization-score">
      <h3 className="personalization-score__title">{t('chart.personalizationTitle')}</h3>
      <div className="personalization-score__bar">
        <div
          className="personalization-score__fill"
          style={{ width: formatPercent(score) }}
        />
      </div>
      <p className="personalization-score__value">{formatPercent(score)}</p>
      <p className="personalization-score__hint">
        {t('chart.personalizationHint')}
      </p>
    </div>
  );
};
