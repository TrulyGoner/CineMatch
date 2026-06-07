import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { removeToast, selectToasts, type ToastType } from './store';
import './ToastContainer.scss';

export const ToastContainer = () => {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector(selectToasts);

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          duration={toast.duration ?? 3000}
          onRemove={(id) => dispatch(removeToast(id))}
        />
      ))}
    </div>
  );
};

interface ToastItemProps {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
  onRemove: (id: string) => void;
}

const ToastItem = ({ id, type, message, duration, onRemove }: ToastItemProps) => {
  const handleClose = useCallback(() => onRemove(id), [id, onRemove]);

  useEffect(() => {
    const timer = setTimeout(handleClose, duration);
    return () => clearTimeout(timer);
  }, [duration, handleClose]);

  return (
    <div className={`toast toast--${type}`} role="alert">
      <span className="toast__icon">
        {type === 'success' && '✓'}
        {type === 'error' && '✗'}
        {type === 'info' && 'i'}
      </span>
      <span className="toast__message">{message}</span>
      <button type="button" className="toast__close" onClick={handleClose} aria-label="Close">
        ✕
      </button>
    </div>
  );
};


