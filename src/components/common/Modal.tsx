import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="hc-modal-overlay" onClick={onClose}>
      <div className="hc-modal" onClick={e => e.stopPropagation()}>
        <div className="hc-modal-header">
          {title && <h5 className="mb-0">{title}</h5>}
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
        <div className="hc-modal-body">
          {children}
        </div>
        {footer && (
          <div className="hc-modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
