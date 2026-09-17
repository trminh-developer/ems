import React, { useState } from 'react';
import { Modal } from '../../common';

interface LocationShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendLocation: (type: 'current' | 'live') => void;
}

export const LocationShareModal: React.FC<LocationShareModalProps> = ({ isOpen, onClose, onSendLocation }) => {
  const [isLocating, setIsLocating] = useState(false);

  const handleShare = (type: 'current' | 'live') => {
    setIsLocating(true);
    // Mocking a geolocation delay
    setTimeout(() => {
      setIsLocating(false);
      onSendLocation(type);
      onClose();
    }, 1000);
  };

  return (
    <Modal isOpen={isOpen} title="Chia sẻ Vị trí" onClose={onClose}>
      <div className="d-flex flex-column gap-3 py-2">
        <div className="text-center mb-3 text-muted">
          <i className="bi bi-geo-alt-fill text-danger" style={{ fontSize: '3rem' }}></i>
          <p className="mt-2">Cho phép ứng dụng truy cập vị trí của bạn để chia sẻ với đối phương.</p>
        </div>

        <button 
          className="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2 p-3"
          onClick={() => handleShare('live')}
          disabled={isLocating}
        >
          {isLocating ? <span className="spinner-border spinner-border-sm"></span> : <i className="bi bi-broadcast"></i>}
          Chia sẻ vị trí trực tiếp trong 60 phút
        </button>

        <button 
          className="btn btn-primary d-flex align-items-center justify-content-center gap-2 p-3"
          onClick={() => handleShare('current')}
          disabled={isLocating}
        >
          {isLocating ? <span className="spinner-border spinner-border-sm"></span> : <i className="bi bi-pin-map-fill"></i>}
          Gửi vị trí hiện tại
        </button>
      </div>
    </Modal>
  );
};
