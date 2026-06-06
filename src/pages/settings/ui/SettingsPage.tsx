import { WeightsSlider } from '@/features/recommendation-weights';
import { ABTestToggle } from '@/features/ab-test-toggle';
import { useAppDispatch } from '@/app/store';
import { clearEvents } from '@/features/user-behavior-tracking/model/store';
import { Button } from '@/shared/ui/Button';
import './SettingsPage.scss';

export const SettingsPage = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="settings-page">
      <h1>Настройки</h1>
      <div className="settings-page__grid">
        <WeightsSlider />
        <div className="settings-page__card">
          <h3>A/B тест рекомендаций</h3>
          <p className="settings-page__hint">
            Режим A — персонализированные рекомендации. Режим B — случайная подборка.
          </p>
          <ABTestToggle />
        </div>
        <div className="settings-page__card">
          <h3>Данные поведения</h3>
          <p className="settings-page__hint">
            Очистить историю кликов и просмотров из localStorage.
          </p>
          <Button variant="secondary" onClick={() => dispatch(clearEvents())}>
            Очистить историю
          </Button>
        </div>
      </div>
    </div>
  );
};
