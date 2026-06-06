import { useAppDispatch, useAppSelector } from '@/app/store';
import { toggleMode, selectABTestMode } from '../model/store';
import './ABTestToggle.scss';

export const ABTestToggle = () => {
  const dispatch = useAppDispatch();
  const mode = useAppSelector(selectABTestMode);

  return (
    <div className="ab-test-toggle">
      <span className="ab-test-toggle__label">A/B тест</span>
      <button
        type="button"
        className={`ab-test-toggle__switch ${mode === 'random' ? 'ab-test-toggle__switch--b' : ''}`}
        onClick={() => dispatch(toggleMode())}
        aria-label="Переключить режим A/B теста"
      >
        <span className="ab-test-toggle__thumb" />
      </button>
      <span className="ab-test-toggle__mode">
        {mode === 'personalized' ? 'A: Персонализация' : 'B: Случайные'}
      </span>
    </div>
  );
};
