import { useEffect, useRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';
import './Modal.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'cinema';
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  variant = 'default',
}: ModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={`modal-overlay modal-overlay--${variant}`}
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      role="presentation"
    >
      <div
        className={`modal modal--${variant} ${className}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <button type="button" className="modal__close" onClick={onClose} aria-label={t('modal.close')}>
          <span className="modal__close-icon" aria-hidden="true" />
        </button>
        {title && <h2 className="modal__title">{title}</h2>}
        <div className="modal__body">{children}</div>
      </div>
    </div>,
    document.body
  );
};
