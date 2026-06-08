import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setRating, selectUserRating } from '@/features/user-rating/model/store';
import { incrementStat } from '@/features/achievements';
import { Icon } from '@/shared/ui/Icon';
import './StarRating.scss';

interface StarRatingProps {
  contentKey: string;
  interactive?: boolean;
  size?: 'sm' | 'md';
}

export const StarRating = ({ contentKey, interactive = true, size = 'sm' }: StarRatingProps) => {
  const dispatch = useAppDispatch();
  const currentRating = useAppSelector(selectUserRating(contentKey));
  const { t } = useTranslation();

  const handleClick = useCallback(
    (value: number) => {
      if (!interactive) return;
      const newRating = currentRating === value ? 0 : value;
      dispatch(setRating({ key: contentKey, rating: newRating }));
      if (newRating > 0) {
        dispatch(incrementStat({ ratingsCount: 1 }));
      }
    },
    [dispatch, contentKey, currentRating, interactive]
  );

  return (
    <div className={`star-rating star-rating--${size}`} role="radiogroup" aria-label={t('rating.ariaLabel')}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (currentRating ?? 0);
        return (
          <button
            key={star}
            type="button"
            className={`star-rating__star ${filled ? 'star-rating__star--filled' : ''}`}
            onClick={() => handleClick(star)}
            disabled={!interactive}
            role="radio"
            aria-checked={filled}
            aria-label={`${star} ${t('rating.stars')}`}
          >
            <Icon name={filled ? 'star-filled' : 'star'} size={size === 'sm' ? 14 : 20} />
          </button>
        );
      })}
      {currentRating && currentRating > 0 && <span className="star-rating__value">{currentRating}</span>}
    </div>
  );
};
