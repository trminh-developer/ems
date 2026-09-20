import React, { useEffect } from 'react';

interface ImageViewerModalProps {
  src: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({ src, isOpen, onClose }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !src) return null;

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
      style={{ backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 9999, cursor: 'zoom-out' }}
      onClick={onClose}
    >
      <img 
        src={src} 
        alt="Fullscreen View" 
        style={{ maxHeight: '90%', maxWidth: '90%', objectFit: 'contain', cursor: 'default' }} 
        onClick={(e) => e.stopPropagation()} 
      />
      <button 
        className="btn-close btn-close-white position-absolute top-0 end-0 m-4" 
        onClick={onClose}
        style={{ zIndex: 10000, cursor: 'pointer' }}
      ></button>
    </div>
  );
};
