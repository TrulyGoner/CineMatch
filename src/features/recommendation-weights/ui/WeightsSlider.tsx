import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  setWeight,
  resetWeights,
  selectWeights,
  type RecommendationWeights,
} from '../model/store';
import { Button } from '@/shared/ui/Button';
import './WeightsSlider.scss';

const buildLabels = (t: (key: string) => string): Record<keyof RecommendationWeights, string> => ({
  genre: t('weights.genre'),
  freshness: t('weights.freshness'),
  popularity: t('weights.popularity'),
});

export const WeightsSlider = () => {
  const dispatch = useAppDispatch();
  const weights = useAppSelector(selectWeights);
  const { t } = useTranslation();
  const LABELS = buildLabels(t);

  const handleChange = useCallback(
    (key: keyof RecommendationWeights, value: number) => {
      dispatch(setWeight({ key, value }));
    },
    [dispatch]
  );

  return (
    <div className="weights-slider">
      <div className="weights-slider__header">
        <h3>{t('weights.title')}</h3>
        <Button variant="ghost" size="sm" onClick={() => dispatch(resetWeights())}>
          {t('weights.reset')}
        </Button>
      </div>
      {(Object.keys(LABELS) as Array<keyof RecommendationWeights>).map((key) => (
        <label key={key} className="weights-slider__row">
          <span className="weights-slider__label">
            {LABELS[key]} <strong>{weights[key]}</strong>
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={weights[key]}
            onChange={(e) => handleChange(key, Number(e.target.value))}
            className="weights-slider__input"
          />
        </label>
      ))}
    </div>
  );
};
