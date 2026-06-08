import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setSortBy, selectSortBy } from '../model/store';
import './ContentSort.scss';

const OPTIONS = ['default', 'rating', 'releaseDate', 'popularity'] as const;

export const ContentSort = () => {
  const dispatch = useAppDispatch();
  const sortBy = useAppSelector(selectSortBy);
  const { t } = useTranslation();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(setSortBy(e.target.value as typeof sortBy));
    },
    [dispatch]
  );

  return (
    <div className="content-sort">
      <label className="content-sort__label" htmlFor="content-sort-select">
        {t('sort.label')}
      </label>
      <select
        id="content-sort-select"
        className="content-sort__select"
        value={sortBy}
        onChange={handleChange}
      >
        {OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {t(`sort.${opt}`)}
          </option>
        ))}
      </select>
    </div>
  );
};
