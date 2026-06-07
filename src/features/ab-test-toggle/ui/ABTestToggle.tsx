import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { toggleMode, selectABTestMode } from '../model/store';
import './ABTestToggle.scss';

export const ABTestToggle = () => {
  const dispatch = useAppDispatch();
  const mode = useAppSelector(selectABTestMode);
  const { t } = useTranslation();

  return (
    <div className="ab-test-toggle">
      <span className="ab-test-toggle__label">{t('abTest.label')}</span>
      <button
        type="button"
        className={`ab-test-toggle__switch ${mode === 'random' ? 'ab-test-toggle__switch--b' : ''}`}
        onClick={() => dispatch(toggleMode())}
        aria-label={t('abTest.aria')}
      >
        <span className="ab-test-toggle__thumb" />
      </button>
      <span className="ab-test-toggle__mode">
        {mode === 'personalized' ? t('abTest.modeA') : t('abTest.modeB')}
      </span>
    </div>
  );
};
