import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/app/store';
import { selectAchievements } from '@/features/achievements';
import { ACHIEVEMENTS } from '@/features/achievements';
import { Icon } from '@/shared/ui/Icon';
import './AchievementBadge.scss';

export const AchievementBadge = () => {
  const { t } = useTranslation();
  const { unlocked } = useAppSelector(selectAchievements);

  return (
    <div className="achievement-badge">
      <h3 className="achievement-badge__title">{t('achievements.title')}</h3>
      <div className="achievement-badge__grid">
        {ACHIEVEMENTS.map((ach) => {
          const isUnlocked = unlocked.includes(ach.id);
          return (
            <div
              key={ach.id}
              className={`achievement-badge__item ${isUnlocked ? 'achievement-badge__item--unlocked' : 'achievement-badge__item--locked'}`}
              title={isUnlocked ? t(ach.descKey) : '?'}
            >
              <span className="achievement-badge__icon"><Icon name={ach.icon} size={20} /></span>
              <span className="achievement-badge__label">
                {isUnlocked ? t(ach.titleKey) : '?'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
