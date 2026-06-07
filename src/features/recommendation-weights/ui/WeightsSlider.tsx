import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  setWeight,
  resetWeights,
  savePreset,
  applyPreset,
  deletePreset,
  selectWeights,
  selectPresets,
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
  const presets = useAppSelector(selectPresets);
  const { t } = useTranslation();
  const LABELS = buildLabels(t);
  const [presetName, setPresetName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (key: keyof RecommendationWeights, value: number) => {
      dispatch(setWeight({ key, value }));
    },
    [dispatch]
  );

  const handleSavePreset = useCallback(() => {
    const name = presetName.trim();
    if (!name) return;
    dispatch(savePreset({ name }));
    setPresetName('');
  }, [dispatch, presetName]);

  const handleApplyPreset = useCallback(
    (name: string) => {
      dispatch(applyPreset({ name }));
    },
    [dispatch]
  );

  const handleDeletePreset = useCallback(
    (name: string) => {
      dispatch(deletePreset({ name }));
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

      <div className="weights-slider__presets">
        <h4>{t('presets.title')}</h4>
        <div className="weights-slider__preset-form">
          <input
            ref={inputRef}
            type="text"
            className="weights-slider__preset-input"
            placeholder={t('presets.namePlaceholder')}
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSavePreset(); }}
          />
          <Button variant="primary" size="sm" onClick={handleSavePreset} disabled={!presetName.trim()}>
            {t('presets.save')}
          </Button>
        </div>
        {presets.length > 0 && (
          <ul className="weights-slider__preset-list">
            {presets.map((p) => (
              <li key={p.name} className="weights-slider__preset-item">
                <span className="weights-slider__preset-name">{p.name}</span>
                <div className="weights-slider__preset-actions">
                  <Button variant="ghost" size="sm" onClick={() => handleApplyPreset(p.name)}>
                    {t('presets.apply')}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeletePreset(p.name)}>
                    {t('presets.delete')}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
