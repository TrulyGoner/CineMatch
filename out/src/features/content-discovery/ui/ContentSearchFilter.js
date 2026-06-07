import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setSearchQuery, setSelectedGenre, selectSearchQuery, selectSelectedGenre, } from '../model/store';
import { selectAllContent } from '../model/store';
import { useUserBehavior } from '@/features/user-behavior-tracking';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { getContentKey } from '@/features/content-discovery/api/contentApi';
import { useContentDetail } from '@/features/content-detail';
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
    const allContent = useAppSelector(selectAllContent);
    const { tracker } = useUserBehavior();
    const { t } = useTranslation();
    const { open } = useContentDetail();
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const inputRef = useRef(null);
    const listRef = useRef(null);
    const debouncedQuery = useDebounce(searchQuery, 300);
    const suggestions = useMemo(() => {
        if (searchQuery.trim().length < 2)
            return [];
        const q = searchQuery.toLowerCase();
        const seen = new Set();
        return allContent
            .filter((c) => {
            const key = getContentKey(c);
            if (seen.has(key))
                return false;
            seen.add(key);
            return c.title.toLowerCase().includes(q);
        })
            .slice(0, 6);
    }, [searchQuery, allContent]);
    const handleSearchChange = useCallback((value) => {
        dispatch(setSearchQuery(value));
        setShowSuggestions(true);
        setFocusedIndex(-1);
    }, [dispatch]);
    const handleSelectSuggestion = useCallback((title) => {
        dispatch(setSearchQuery(title));
        setShowSuggestions(false);
    }, [dispatch]);
    const handleOpenItem = useCallback((id, genre) => {
        const item = allContent.find((c) => c.id === id);
        if (item) {
            tracker.trackClick(item.id, item.genres[0]);
            open(item);
        }
        setShowSuggestions(false);
        dispatch(setSearchQuery(''));
    }, [allContent, tracker, open, dispatch]);
    useEffect(() => {
        if (debouncedQuery.trim()) {
            tracker.trackSearch(debouncedQuery.trim());
        }
    }, [debouncedQuery, tracker]);
    const handleGenreClick = useCallback((genre) => {
        const next = selectedGenre === genre ? null : genre;
        dispatch(setSelectedGenre(next));
        if (next)
            tracker.trackFilter(next);
    }, [dispatch, selectedGenre, tracker]);
    const handleKeyDown = useCallback((e) => {
        if (!showSuggestions || suggestions.length === 0)
            return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setFocusedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
        }
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setFocusedIndex((prev) => Math.max(prev - 1, 0));
        }
        else if (e.key === 'Enter' && focusedIndex >= 0) {
            e.preventDefault();
            const item = suggestions[focusedIndex];
            handleOpenItem(item.id, item.genres[0]);
        }
        else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    }, [showSuggestions, suggestions, focusedIndex, handleOpenItem]);
    useEffect(() => {
        if (focusedIndex >= 0 && listRef.current) {
            const el = listRef.current.children[focusedIndex];
            el?.scrollIntoView({ block: 'nearest' });
        }
    }, [focusedIndex]);
    return (React.createElement("div", { className: "content-search-filter" },
        React.createElement("div", { className: "content-search-filter__input-wrap" },
            React.createElement("input", { ref: inputRef, type: "search", className: "content-search-filter__input", placeholder: t('content.searchPlaceholder'), value: searchQuery, onChange: (e) => handleSearchChange(e.target.value), onFocus: () => setShowSuggestions(true), onBlur: () => setTimeout(() => setShowSuggestions(false), 200), onKeyDown: handleKeyDown, "aria-label": t('content.searchAria'), autoComplete: "off" }),
            showSuggestions && suggestions.length > 0 && (React.createElement("ul", { ref: listRef, className: "content-search-filter__suggestions" }, suggestions.map((item, i) => (React.createElement("li", { key: getContentKey(item) },
                React.createElement("button", { type: "button", className: `content-search-filter__suggestion ${i === focusedIndex ? 'content-search-filter__suggestion--focused' : ''}`, onMouseDown: (e) => {
                        e.preventDefault();
                        handleOpenItem(item.id, item.genres[0]);
                    } },
                    React.createElement("span", { className: "content-search-filter__suggestion-title" }, item.title),
                    React.createElement("span", { className: "content-search-filter__suggestion-type" }, item.mediaType === 'tv' ? 'TV' : 'Film')))))))),
        React.createElement("div", { className: "content-search-filter__genres" }, GENRE_OPTIONS.map((genre) => (React.createElement("button", { key: genre, type: "button", className: `content-search-filter__chip ${selectedGenre === genre ? 'content-search-filter__chip--active' : ''}`, onClick: () => handleGenreClick(genre) }, genre))))));
};
