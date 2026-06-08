import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { toggleSave, selectIsSaved } from '@/features/saved-content/model/store';
import { incrementStat } from '@/features/achievements';
import type { Content } from '@/entities/content/model/types';
import { Icon } from '@/shared/ui/Icon';
import { getContentKey } from '@/features/content-discovery/api/contentApi';
import './SaveButton.scss';

interface SaveButtonProps {
  item: Content;
}

export const SaveButton = ({ item }: SaveButtonProps) => {
  const dispatch = useAppDispatch();
  const key = getContentKey(item);
  const isSaved = useAppSelector(selectIsSaved(key));

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      dispatch(toggleSave(key));
      if (!isSaved) {
        dispatch(incrementStat({ savedCount: 1 }));
      }
    },
    [dispatch, key, isSaved]
  );

  return (
    <button
      type="button"
      className={`save-btn ${isSaved ? 'save-btn--active' : ''}`}
      onClick={handleClick}
      aria-label={isSaved ? 'Убрать из сохранённых' : 'Сохранить'}
    >
      <Icon name={isSaved ? 'heart-filled' : 'heart'} size={16} />
    </button>
  );
};
