import React, { useEffect } from 'react';

interface ToastProps {
  show?: boolean;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ 
  show = true,
  message, 
  type = 'info', 
  onClose,
  duration = 3000 
}) => {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  const borderClass = {
    success: 'border-success',
    error: 'border-danger',
    warning: 'border-warning',
    info: 'border-info',
  }[type];

  const iconClass = {
    success: 'bi-check-circle text-success',
    error: 'bi-exclamation-circle text-danger',
    warning: 'bi-exclamation-triangle text-warning',
    info: 'bi-info-circle text-info',
  }[type];

  return (
    <div className={`hc-toast border-start border-4 ${borderClass} shadow-sm fade-in position-fixed bottom-0 end-0 m-3 p-3 bg-white rounded`}>
      <div className="d-flex align-items-center">
        <i className={`bi ${iconClass} fs-4 me-3`}></i>
        <div className="flex-grow-1">{message}</div>
        <button type="button" className="btn-close ms-2" onClick={onClose}></button>
      </div>
    </div>
  );
};

export default Toast;
