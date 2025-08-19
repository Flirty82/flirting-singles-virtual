import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Button from './Button';
import './Modal.css';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    showCloseButton = true,
    confirmButtonText = 'Confirm',
    size = 'medium',
    onConfirm,
    className = '',
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;

        const modalContent = (
            <div className={`modal ${size} ${className}`}>
                <div className="modal-header">
                    <h2>{title}</h2>
                    {showCloseButton && (
                        <button className="close-button" onClick={onClose}>
                            &times;
                        </button>
                    )}
                </div>
                <div className="modal-body">{children}</div>
                <div className="modal-footer">
                    {onConfirm && (
                        <Button onClick={onConfirm} variant="primary">
                            {confirmButtonText}
                        </Button>
                    )}
                    <Button onClick={onClose} variant="secondary">
                        Close
                    </Button>
                </div>
            </div>
        );

        return ReactDOM.createPortal(
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    {modalContent}
                </div>
            </div>,
            document.getElementById('modal-root')
        );
    }

    return null;
};

export default Modal;
