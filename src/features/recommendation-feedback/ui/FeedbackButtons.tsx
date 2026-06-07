import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  toggleLike,
  toggleDislike,
  markNotInterested,
  selectIsLiked,
  selectIsDisliked,
} from '@/features/recommendation-feedback/model/store';
import './FeedbackButtons.scss';

interface FeedbackButtonsProps {
  contentKey: string;
  onNotInterested?: () => void;
}

export const FeedbackButtons = ({ contentKey, onNotInterested }: FeedbackButtonsProps) => {
  const dispatch = useAppDispatch();
  const isLiked = useAppSelector(selectIsLiked(contentKey));
  const isDisliked = useAppSelector(selectIsDisliked(contentKey));
  const { t } = useTranslation();

  const handleLike = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      dispatch(toggleLike(contentKey));
    },
    [dispatch, contentKey]
  );

  const handleDislike = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      dispatch(toggleDislike(contentKey));
    },
    [dispatch, contentKey]
  );

  const handleNotInterested = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      dispatch(markNotInterested(contentKey));
      onNotInterested?.();
    },
    [dispatch, contentKey, onNotInterested]
  );

  return (
    <div className="feedback-buttons">
      <button
        type="button"
        className={`feedback-buttons__btn ${isLiked ? 'feedback-buttons__btn--liked' : ''}`}
        onClick={handleLike}
        aria-label={t('feedback.like')}
      >
        👍
      </button>
      <button
        type="button"
        className={`feedback-buttons__btn ${isDisliked ? 'feedback-buttons__btn--disliked' : ''}`}
        onClick={handleDislike}
        aria-label={t('feedback.dislike')}
      >
        👎
      </button>
      <button
        type="button"
        className="feedback-buttons__btn feedback-buttons__btn--hide"
        onClick={handleNotInterested}
        aria-label={t('feedback.notInterested')}
      >
        ✕
      </button>
    </div>
  );
};
