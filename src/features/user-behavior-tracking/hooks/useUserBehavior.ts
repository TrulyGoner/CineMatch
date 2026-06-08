import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { trackEvent, selectBehaviorEvents } from '../model/store';
import { createTracker } from '../lib/tracker';
import { useAppDispatch } from '@/app/store';
import { incrementStat } from '@/features/achievements';
import type { UserBehaviorEvent } from '@/entities/analytics/model/types';

export const useUserBehavior = () => {
  const dispatch = useAppDispatch();
  const events = useSelector(selectBehaviorEvents);

  const onTrack = useCallback(
    (event: UserBehaviorEvent) => {
      dispatch(trackEvent(event));
      if (event.type === 'view') {
        dispatch(incrementStat({ viewsLogged: 1 }));
      }
    },
    [dispatch]
  );

  const tracker = useMemo(() => createTracker(onTrack), [onTrack]);

  return { events, tracker };
};
