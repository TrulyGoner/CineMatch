import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Content } from '@/entities/content/model/types';
import { ExplorerCard } from './ExplorerCard';
import './ExplorerMode.scss';

const SWIPE_THRESHOLD = 80;

interface ExplorerModeProps {
  current: Content | null;
  queueSize: number;
  remainingCount: number;
  completed: boolean;
  onDecision: (decision: 'like' | 'dislike' | 'skip') => void;
  onReset: () => void;
}

export const ExplorerMode = ({
  current,
  queueSize,
  remainingCount,
  completed,
  onDecision,
  onReset,
}: ExplorerModeProps) => {
  const { t } = useTranslation();
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [animatingOut, setAnimatingOut] = useState<'left' | 'right' | null>(null);
  const startXRef = useRef(0);
  const offsetRef = useRef(0);

  const animating = animatingOut !== null;

  const resetSwipe = useCallback(() => {
    setSwipeOffset(0);
    offsetRef.current = 0;
  }, []);

  const commitDecision = useCallback(
    (decision: 'like' | 'dislike' | 'skip') => {
      if (animating) return;
      if (decision === 'like') {
        setAnimatingOut('right');
        setTimeout(() => { setAnimatingOut(null); onDecision('like'); resetSwipe(); }, 300);
      } else if (decision === 'dislike') {
        setAnimatingOut('left');
        setTimeout(() => { setAnimatingOut(null); onDecision('dislike'); resetSwipe(); }, 300);
      } else {
        onDecision('skip');
        resetSwipe();
      }
    },
    [animating, onDecision, resetSwipe]
  );

  const onPointerUp = useCallback(() => {
    const offset = offsetRef.current;
    if (offset > SWIPE_THRESHOLD) {
      commitDecision('like');
    } else if (offset < -SWIPE_THRESHOLD) {
      commitDecision('dislike');
    } else {
      resetSwipe();
    }
  }, [commitDecision, resetSwipe]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (animating) return;
    e.preventDefault();
    startXRef.current = e.clientX;
    offsetRef.current = 0;

    const onMove = (me: MouseEvent): void => {
      const dx = me.clientX - startXRef.current;
      const clamped = Math.max(-300, Math.min(300, dx));
      offsetRef.current = clamped;
      setSwipeOffset(clamped);
    };

    const onUp = (): void => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      onPointerUp();
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [animating, onPointerUp]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (animating) return;
    const touch = e.touches[0];
    startXRef.current = touch.clientX;
    offsetRef.current = 0;
  }, [animating]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (animating) return;
    const touch = e.touches[0];
    const dx = touch.clientX - startXRef.current;
    const clamped = Math.max(-300, Math.min(300, dx));
    offsetRef.current = clamped;
    setSwipeOffset(clamped);
  }, [animating]);

  const handleTouchEnd = useCallback(() => {
    if (animating) return;
    onPointerUp();
  }, [animating, onPointerUp]);

  const cardStyle: React.CSSProperties = { touchAction: 'none' };
  const showLikeHint = swipeOffset > 30;
  const showDislikeHint = swipeOffset < -30;

  if (animatingOut) {
    cardStyle.transform = `translateX(${animatingOut === 'right' ? '120%' : '-120%'}) rotate(${animatingOut === 'right' ? '15deg' : '-15deg'})`;
    cardStyle.opacity = 0;
    cardStyle.transition = 'transform 0.3s ease, opacity 0.3s ease';
  } else if (swipeOffset !== 0) {
    const rotation = swipeOffset * 0.08;
    cardStyle.transform = `translateX(${swipeOffset}px) rotate(${rotation}deg)`;
    cardStyle.cursor = 'grabbing';
  }

  if (completed) {
    return (
      <div className="explorer-mode explorer-mode--done">
        <div className="explorer-mode__done-icon">🎯</div>
        <h2 className="explorer-mode__done-title">{t('explorer.doneTitle')}</h2>
        <p className="explorer-mode__done-text">{t('explorer.doneText')}</p>
        <button type="button" className="explorer-mode__reset-btn" onClick={onReset}>
          {t('explorer.reset')}
        </button>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="explorer-mode explorer-mode--loading">
        <div className="explorer-mode__loading-spinner" />
        <p>{t('explorer.loading')}</p>
      </div>
    );
  }

  return (
    <div className="explorer-mode">
      <div className="explorer-mode__progress">
        <div className="explorer-mode__progress-bar">
          <div
            className="explorer-mode__progress-fill"
            style={{ width: `${Math.min(100, ((queueSize - remainingCount) / queueSize) * 100)}%` }}
          />
        </div>
        <span className="explorer-mode__progress-label">
          {queueSize - remainingCount} / {queueSize}
        </span>
      </div>

      <div className="explorer-mode__stack">
        <div className="explorer-mode__stack-cards">
          <div className="explorer-mode__stack-card explorer-mode__stack-card--3" />
          <div className="explorer-mode__stack-card explorer-mode__stack-card--2" />
          <div
            className={`explorer-mode__stack-card explorer-mode__stack-card--1 ${swipeOffset !== 0 ? 'explorer-mode__stack-card--dragging' : ''} ${animatingOut ? 'explorer-mode__stack-card--exiting' : ''}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            style={cardStyle}
          >
            {showLikeHint && (
              <div className="explorer-mode__hint-label explorer-mode__hint-label--like">
                ♥ {t('explorer.like')}
              </div>
            )}
            {showDislikeHint && (
              <div className="explorer-mode__hint-label explorer-mode__hint-label--dislike">
                ✕ {t('explorer.dislike')}
              </div>
            )}
            <ExplorerCard item={current} />
          </div>
        </div>
      </div>

      <div className="explorer-mode__actions">
        <button
          type="button"
          className="explorer-mode__btn explorer-mode__btn--dislike"
          onClick={() => commitDecision('dislike')}
          aria-label={t('explorer.dislike')}
        >
          ✕
        </button>
        <button
          type="button"
          className="explorer-mode__btn explorer-mode__btn--skip"
          onClick={() => commitDecision('skip')}
          aria-label={t('explorer.skip')}
        >
          {t('explorer.skip')}
        </button>
        <button
          type="button"
          className="explorer-mode__btn explorer-mode__btn--like"
          onClick={() => commitDecision('like')}
          aria-label={t('explorer.like')}
        >
          ♥
        </button>
      </div>

      <p className="explorer-mode__hint">{t('explorer.hint')}</p>
    </div>
  );
};
