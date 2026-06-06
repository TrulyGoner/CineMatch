import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { trackEvent, selectBehaviorEvents } from '../model/store';
import { createTracker } from '../lib/tracker';
export const useUserBehavior = () => {
    const dispatch = useDispatch();
    const events = useSelector(selectBehaviorEvents);
    const onTrack = useCallback((event) => {
        dispatch(trackEvent(event));
    }, [dispatch]);
    const tracker = useMemo(() => createTracker(onTrack), [onTrack]);
    return { events, tracker };
};
