import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { WeightsSlider } from '@/features/recommendation-weights';
import { ABTestToggle } from '@/features/ab-test-toggle';
import { AchievementBadge } from '@/features/achievements';
import { useAppDispatch } from '@/app/store';
import { clearEvents } from '@/features/user-behavior-tracking/model/store';
import { resetAchievements } from '@/features/achievements';
import { Button } from '@/shared/ui/Button';
import { STORAGE_KEYS } from '@/shared/config/constants';
import { localStorageManager } from '@/shared/storage/localStorageManager';
import './SettingsPage.scss';

export const SettingsPage = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const handleExport = useCallback(() => {
    const keys = Object.values(STORAGE_KEYS);
    const data: Record<string, unknown> = {};
    for (const key of keys) {
      const val = localStorageManager.get(key);
      if (val !== null && val !== undefined) data[key] = val;
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cinematch-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleResetAll = useCallback(() => {
    if (!window.confirm(t('settings.resetConfirm'))) return;
    const keys = Object.values(STORAGE_KEYS);
    for (const key of keys) {
      localStorageManager.remove(key);
    }
    dispatch(clearEvents());
    dispatch(resetAchievements());
    window.location.reload();
  }, [dispatch, t]);

  return (
    <div className="settings-page">
      <h1>{t('settings.title')}</h1>
      <div className="settings-page__grid">
        <WeightsSlider />

        <div className="settings-page__card">
          <h3>{t('settings.abTest')}</h3>
          <p className="settings-page__hint">{t('settings.abTestHint')}</p>
          <ABTestToggle />
        </div>

        <div className="settings-page__card">
          <h3>{t('settings.behaviorData')}</h3>
          <p className="settings-page__hint">{t('settings.behaviorHint')}</p>
          <div className="settings-page__actions">
            <Button variant="secondary" onClick={() => dispatch(clearEvents())}>
              {t('settings.clearHistory')}
            </Button>
          </div>
        </div>

        <div className="settings-page__card">
          <h3>{t('settings.exportTitle')}</h3>
          <p className="settings-page__hint">{t('settings.exportHint')}</p>
          <div className="settings-page__actions">
            <Button variant="secondary" onClick={handleExport}>
              {t('settings.exportButton')}
            </Button>
          </div>
        </div>

        <div className="settings-page__card settings-page__card--danger">
          <h3>{t('settings.resetTitle')}</h3>
          <p className="settings-page__hint">{t('settings.resetHint')}</p>
          <div className="settings-page__actions">
            <Button variant="secondary" onClick={handleResetAll}>
              {t('settings.resetButton')}
            </Button>
          </div>
        </div>

        <div className="settings-page__card">
          <h3>{t('settings.achievementsTitle')}</h3>
          <p className="settings-page__hint">{t('settings.achievementsHint')}</p>
          <AchievementBadge />
        </div>
      </div>
    </div>
  );
};
