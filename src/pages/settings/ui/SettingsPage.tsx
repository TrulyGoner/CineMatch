import { useTranslation } from 'react-i18next';
import { WeightsSlider } from '@/features/recommendation-weights';
import { ABTestToggle } from '@/features/ab-test-toggle';
import { useAppDispatch } from '@/app/store';
import { clearEvents } from '@/features/user-behavior-tracking/model/store';
import { Button } from '@/shared/ui/Button';
import './SettingsPage.scss';

export const SettingsPage = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  return (
    <div className="settings-page">
      <h1>{t('settings.title')}</h1>
      <div className="settings-page__grid">
        <WeightsSlider />
        <div className="settings-page__card">
          <h3>{t('settings.abTest')}</h3>
          <p className="settings-page__hint">
            {t('settings.abTestHint')}
          </p>
          <ABTestToggle />
        </div>
        <div className="settings-page__card">
          <h3>{t('settings.behaviorData')}</h3>
          <p className="settings-page__hint">
            {t('settings.behaviorHint')}
          </p>
          <Button variant="secondary" onClick={() => dispatch(clearEvents())}>
            {t('settings.clearHistory')}
          </Button>
        </div>
      </div>
    </div>
  );
};
