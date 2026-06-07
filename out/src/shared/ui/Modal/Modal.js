import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';
import './Modal.scss';
export const Modal = ({ isOpen, onClose, title, children, className = '', variant = 'default', }) => {
    const overlayRef = useRef(null);
    const { t } = useTranslation();
    useEffect(() => {
        if (!isOpen)
            return undefined;
        const onKeyDown = (e) => {
            if (e.key === 'Escape')
                onClose();
        };
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.body.style.overflow = '';
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [isOpen, onClose]);
    if (!isOpen)
        return null;
    return createPortal(React.createElement("div", { className: `modal-overlay modal-overlay--${variant}`, ref: overlayRef, onClick: (e) => {
            if (e.target === overlayRef.current)
                onClose();
        }, role: "presentation" },
        React.createElement("div", { className: `modal modal--${variant} ${className}`.trim(), role: "dialog", "aria-modal": "true", "aria-label": title },
            React.createElement("button", { type: "button", className: "modal__close", onClick: onClose, "aria-label": t('modal.close') },
                React.createElement("span", { className: "modal__close-icon", "aria-hidden": "true" })),
            title && React.createElement("h2", { className: "modal__title" }, title),
            React.createElement("div", { className: "modal__body" }, children))), document.body);
};
