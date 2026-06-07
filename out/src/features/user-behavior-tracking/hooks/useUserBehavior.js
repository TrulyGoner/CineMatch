import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { trackEvent, selectBehaviorEvents } from '../model/store';
import { createTracker } from '../lib/tracker';
import { useAppDispatch } from '@/app/store';
export const useUserBehavior = () => {
    const dispatch = useAppDispatch();
    const events = useSelector(selectBehaviorEvents);
    const onTrack = useCallback((event) => {
        dispatch(trackEvent(event));
    }, [dispatch]);
    const tracker = useMemo(() => createTracker(onTrack), [onTrack]);
    return { events, tracker };
};
