import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Content } from '@/entities/content/model/types';
import { ExplorerCard } from './ExplorerCard';
import { Icon } from '@/shared/ui/Icon';
import './ExplorerMode.scss';

const SWIPE_THRESHOLD = 80;

interface ExplorerModeProps {
  current: Content | null;
  nextItems: Content[];
  queueSize: number;
  completed: boolean;
  seenCount: number;
  makeDecision: (content: Content, decision: 'like' | 'dislike' | 'skip') => void;
  onReset: () => void;
}

const getStackTransform = (depth: number, progress: number, animatingOut: unknown, step: number): string => {
  const baseScale = 1 - (depth + 1) * 0.04;
  const targetScale = 1 - depth * 0.04;
  const baseY = (depth + 1) * step;
  const targetY = depth * step;

  if (animatingOut || progress >= 1) {
    return `scale(${targetScale}) translateY(${targetY}px)`;
  }

  const scale = baseScale + (targetScale - baseScale) * progress;
  const y = baseY + (targetY - baseY) * progress;
  return `scale(${scale}) translateY(${y}px)`;
};

export const ExplorerMode = ({
  current,
  nextItems,
  queueSize,
  completed,
  seenCount,
  makeDecision,
  onReset,
}: ExplorerModeProps) => {
  const { t } = useTranslation();
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [animatingOut, setAnimatingOut] = useState<'left' | 'right' | null>(null);
  const startXRef = useRef(0);
  const offsetRef = useRef(0);
  const decisionLockRef = useRef(false);
  const [isMobile] = useState(() => window.matchMedia('(max-width: 480px)').matches);

  const animating = animatingOut !== null;
  const step = isMobile ? 6 : 8;
  const progress = swipeOffset === 0 ? 0 : Math.min(Math.abs(swipeOffset) / SWIPE_THRESHOLD, 1);

  const resetSwipe = useCallback(() => {
    setSwipeOffset(0);
    offsetRef.current = 0;
  }, []);

  const commitDecision = useCallback(
    (decision: 'like' | 'dislike' | 'skip') => {
      if (animating || decisionLockRef.current) return;
      if (!current) return;
      decisionLockRef.current = true;

      if (decision === 'skip') {
        makeDecision(current, 'skip');
        resetSwipe();
        decisionLockRef.current = false;
        return;
      }

      const direction = decision === 'like' ? 'right' : 'left';
      setAnimatingOut(direction);

      setTimeout(() => {
        setAnimatingOut(null);
        makeDecision(current, decision);
        resetSwipe();
        decisionLockRef.current = false;
      }, 300);
    },
    [animating, current, makeDecision, resetSwipe]
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
    if (animating || decisionLockRef.current) return;
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
    if (animating || decisionLockRef.current) return;
    const touch = e.touches[0];
    startXRef.current = touch.clientX;
    offsetRef.current = 0;
  }, [animating]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (animating || decisionLockRef.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - startXRef.current;
    const clamped = Math.max(-300, Math.min(300, dx));
    offsetRef.current = clamped;
    setSwipeOffset(clamped);
  }, [animating]);

  const handleTouchEnd = useCallback(() => {
    if (animating || decisionLockRef.current) return;
    onPointerUp();
  }, [animating, onPointerUp]);

  const cardStyle: React.CSSProperties = { touchAction: 'none' };

  if (animatingOut) {
    cardStyle.transform = `translateX(${animatingOut === 'right' ? '120%' : '-120%'}) rotate(${animatingOut === 'right' ? '15deg' : '-15deg'})`;
    cardStyle.opacity = 0;
    cardStyle.transition = 'transform 0.3s ease, opacity 0.3s ease';
  } else if (swipeOffset !== 0) {
    const rotation = swipeOffset * 0.08;
    cardStyle.transform = `translateX(${swipeOffset}px) rotate(${rotation}deg)`;
    cardStyle.transition = 'none';
  }

  const showLikeHint = swipeOffset > 30;
  const showDislikeHint = swipeOffset < -30;
  const stackTrans = swipeOffset !== 0 ? 'none' : undefined;

  if (completed) {
    return (
      <div className="explorer-mode explorer-mode--done">
        <div className="explorer-mode__done-icon"><Icon name="target" size={48} /></div>
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
            style={{ width: `${Math.min(100, (seenCount / queueSize) * 100)}%` }}
          />
        </div>
        <span className="explorer-mode__progress-label">
          {seenCount} / {queueSize}
        </span>
      </div>

      <div className="explorer-mode__stack">
        <div className="explorer-mode__stack-cards">
          {nextItems[2] && (
            <div
              className="explorer-mode__stack-card explorer-mode__stack-card--4"
              style={{ transform: getStackTransform(2, progress, animatingOut, step), transition: stackTrans }}
            >
              <ExplorerCard item={nextItems[2]} dimmed />
            </div>
          )}
          {nextItems[1] && (
            <div
              className="explorer-mode__stack-card explorer-mode__stack-card--3"
              style={{ transform: getStackTransform(1, progress, animatingOut, step), transition: stackTrans }}
            >
              <ExplorerCard item={nextItems[1]} dimmed />
            </div>
          )}
          {nextItems[0] && (
            <div
              className="explorer-mode__stack-card explorer-mode__stack-card--2"
              style={{ transform: getStackTransform(0, progress, animatingOut, step), transition: stackTrans }}
            >
              <ExplorerCard item={nextItems[0]} dimmed />
            </div>
          )}
          <div
            key={current.id}
            className={`explorer-mode__stack-card explorer-mode__stack-card--1 ${animatingOut ? 'explorer-mode__stack-card--exiting' : ''}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            style={cardStyle}
          >
            {showLikeHint && (
              <div className="explorer-mode__hint-label explorer-mode__hint-label--like">
                <Icon name="heart-filled" /> {t('explorer.like')}
              </div>
            )}
            {showDislikeHint && (
              <div className="explorer-mode__hint-label explorer-mode__hint-label--dislike">
                <Icon name="x" /> {t('explorer.dislike')}
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
          <Icon name="x" size={24} />
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
          <Icon name="heart-filled" size={24} />
        </button>
      </div>

      <p className="explorer-mode__hint">{t('explorer.hint')}</p>
    </div>
  );
};
