import React, { useEffect, useState, useRef } from 'react';

interface ImageViewerModalProps {
  src: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({ src, isOpen, onClose }) => {
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !src) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
      style={{ backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 99999, overflow: 'hidden', cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-out' }}
      onClick={onClose}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div 
        style={{ 
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`, 
          transition: isDragging ? 'none' : 'transform 0.2s ease', 
          cursor: scale === 1 ? 'zoom-in' : (isDragging ? 'grabbing' : 'grab'),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (scale === 1) {
            setScale(2.5);
          } else if (!isDragging) {
            // Optional: click to zoom out, but we have buttons
          }
        }}
        onMouseDown={handleMouseDown}
      >
        <img 
          src={src} 
          alt="Fullscreen View" 
          style={{ maxHeight: '90vh', maxWidth: '90vw', objectFit: 'contain', pointerEvents: 'none' }} 
        />
      </div>
      
      {/* Zoom Controls */}
      <div className="position-absolute bottom-0 mb-4 d-flex gap-3 bg-dark bg-opacity-75 p-2 rounded-pill shadow" style={{ zIndex: 100000 }} onClick={e => e.stopPropagation()}>
        <button className="btn btn-sm btn-outline-light rounded-circle" style={{width: '36px', height:'36px'}} onClick={() => { setScale(p => Math.max(0.5, p - 0.5)); setPosition({x:0, y:0}); }}><i className="bi bi-zoom-out"></i></button>
        <span className="text-white align-self-center fw-bold" style={{minWidth: '45px', textAlign: 'center'}}>{Math.round(scale * 100)}%</span>
        <button className="btn btn-sm btn-outline-light rounded-circle" style={{width: '36px', height:'36px'}} onClick={() => setScale(p => Math.min(5, p + 0.5))}><i className="bi bi-zoom-in"></i></button>
        <div className="vr text-white mx-1"></div>
        <button className="btn btn-sm btn-outline-light rounded-circle" style={{width: '36px', height:'36px'}} onClick={() => { setScale(1); setPosition({x:0, y:0}); }}><i className="bi bi-arrow-counterclockwise"></i></button>
      </div>

      <button 
        className="btn-close btn-close-white position-absolute top-0 end-0 m-4 shadow" 
        onClick={onClose}
        style={{ zIndex: 100000, cursor: 'pointer', transform: 'scale(1.2)' }}
      ></button>
    </div>
  );
};
