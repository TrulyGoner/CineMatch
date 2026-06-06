import type { UserBehaviorEvent } from '@/entities/analytics/model/types';
import type { ContentMetrics } from '@/entities/content/model/types';

export const computeContentMetrics = (
  contentId: number,
  events: UserBehaviorEvent[]
): ContentMetrics => {
  let clickCount = 0;
  let viewDuration = 0;
  let lastInteracted = 0;

  for (const event of events) {
    if (event.contentId !== contentId) continue;

    if (event.type === 'click') {
      clickCount += 1;
      lastInteracted = Math.max(lastInteracted, event.timestamp);
    }

    if (event.type === 'view' && event.duration) {
      viewDuration += event.duration;
      lastInteracted = Math.max(lastInteracted, event.timestamp);
    }
  }

  return { clickCount, viewDuration, lastInteracted };
};
