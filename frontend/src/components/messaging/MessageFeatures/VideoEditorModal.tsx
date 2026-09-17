import React, { useState, useEffect } from 'react';
import { Modal } from '../../common';

interface VideoEditorModalProps {
  isOpen: boolean;
  file: File | null;
  onClose: () => void;
  onSend: (videoUrl: string) => void;
}

export const VideoEditorModal: React.FC<VideoEditorModalProps> = ({ isOpen, file, onClose, onSend }) => {
  const [preview, setPreview] = useState<string>('');
  const [hasAudio, setHasAudio] = useState(true);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const handleSend = () => {
    onSend(preview);
    onClose();
  };

  if (!file) return null;

  return (
    <Modal isOpen={isOpen} title="Chỉnh sửa Video" onClose={onClose}>
      <div className="d-flex flex-column gap-3">
        {/* Toolbar */}
        <div className="d-flex justify-content-between align-items-center bg-light p-2 rounded">
          <div className="btn-group">
            <button className="btn btn-outline-primary btn-sm">
              <i className="bi bi-scissors me-1"></i> Cắt video (Trim)
            </button>
          </div>
          
          <button 
            className={`btn btn-sm ${hasAudio ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setHasAudio(!hasAudio)}
          >
            <i className={`bi ${hasAudio ? 'bi-volume-up' : 'bi-volume-mute'} me-1`}></i> 
            Âm thanh
          </button>
        </div>

        {/* Player */}
        <div className="bg-dark rounded d-flex justify-content-center align-items-center" style={{ minHeight: '400px', overflow: 'hidden' }}>
          {preview && (
            <video 
              src={preview} 
              controls 
              muted={!hasAudio}
              style={{ maxWidth: '100%', maxHeight: '400px' }}
            />
          )}
        </div>

        {/* Actions */}
        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-secondary" onClick={onClose}>Hủy</button>
          <button className="btn btn-primary" onClick={handleSend}>
            <i className="bi bi-send-fill me-2"></i> Gửi video
          </button>
        </div>
      </div>
    </Modal>
  );
};
