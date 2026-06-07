import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  setSearchQuery,
  setSelectedGenre,
  selectSearchQuery,
  selectSelectedGenre,
} from '../model/store';
import { useUserBehavior } from '@/features/user-behavior-tracking';
import { useDebounce } from '@/shared/hooks/useDebounce';
import './ContentSearchFilter.scss';

const GENRE_OPTIONS = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Drama',
  'Fantasy',
  'Horror',
  'Romance',
  'Sci-Fi',
  'Thriller',
];

export const ContentSearchFilter = () => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(selectSearchQuery);
  const selectedGenre = useAppSelector(selectSelectedGenre);
  const { tracker } = useUserBehavior();
  const { t } = useTranslation();

  const debouncedQuery = useDebounce(searchQuery, 300);

  const handleSearchChange = useCallback(
    (value: string) => {
      dispatch(setSearchQuery(value));
    },
    [dispatch]
  );

  useEffect(() => {
    if (debouncedQuery.trim()) {
      tracker.trackSearch(debouncedQuery.trim());
    }
  }, [debouncedQuery, tracker]);

  const handleGenreClick = useCallback(
    (genre: string) => {
      const next = selectedGenre === genre ? null : genre;
      dispatch(setSelectedGenre(next));
      if (next) tracker.trackFilter(next);
    },
    [dispatch, selectedGenre, tracker]
  );

  return (
    <div className="content-search-filter">
      <input
        type="search"
        className="content-search-filter__input"
        placeholder={t('content.searchPlaceholder')}
        value={searchQuery}
        onChange={(e) => handleSearchChange(e.target.value)}
        aria-label={t('content.searchAria')}
      />

      <div className="content-search-filter__genres">
        {GENRE_OPTIONS.map((genre) => (
          <button
            key={genre}
            type="button"
            className={`content-search-filter__chip ${
              selectedGenre === genre ? 'content-search-filter__chip--active' : ''
            }`}
            onClick={() => handleGenreClick(genre)}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
};
