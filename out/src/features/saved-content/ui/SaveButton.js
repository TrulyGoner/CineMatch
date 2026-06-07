import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { toggleSave, selectIsSaved } from '@/features/saved-content/model/store';
import { getContentKey } from '@/features/content-discovery/api/contentApi';
import './SaveButton.scss';
export const SaveButton = ({ item }) => {
    const dispatch = useAppDispatch();
    const key = getContentKey(item);
    const isSaved = useAppSelector(selectIsSaved(key));
    const label = isSaved ? '♥' : '♡';
    const handleClick = useCallback((e) => {
        e.stopPropagation();
        dispatch(toggleSave(key));
    }, [dispatch, key]);
    return (React.createElement("button", { type: "button", className: `save-btn ${isSaved ? 'save-btn--active' : ''}`, onClick: handleClick, "aria-label": isSaved ? 'Убрать из сохранённых' : 'Сохранить' }, label));
};
