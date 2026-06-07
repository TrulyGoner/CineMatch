import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { toggleSave, selectIsSaved } from '@/features/saved-content/model/store';
import type { Content } from '@/entities/content/model/types';
import { getContentKey } from '@/features/content-discovery/api/contentApi';
import './SaveButton.scss';

interface SaveButtonProps {
  item: Content;
}

export const SaveButton = ({ item }: SaveButtonProps) => {
  const dispatch = useAppDispatch();
  const key = getContentKey(item);
  const isSaved = useAppSelector(selectIsSaved(key));
  const label = isSaved ? '♥' : '♡';

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      dispatch(toggleSave(key));
    },
    [dispatch, key]
  );

  return (
    <button
      type="button"
      className={`save-btn ${isSaved ? 'save-btn--active' : ''}`}
      onClick={handleClick}
      aria-label={isSaved ? 'Убрать из сохранённых' : 'Сохранить'}
    >
      {label}
    </button>
  );
};
