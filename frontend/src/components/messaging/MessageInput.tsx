import React, { useState, useRef, useEffect } from 'react';
import Button from '../common/Button';
import { useAlert } from '../../contexts/AlertContext';
import { 
  AttachmentMenu, 
  IconMenu, 
  ImageEditorModal, 
  VideoEditorModal, 
  LocationShareModal 
} from './MessageFeatures';

interface MessageInputProps {
  onSend: (content: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const [content, setContent] = useState('');
  const { showAlert } = useAlert();

  // Menu states
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showIconMenu, setShowIconMenu] = useState(false);

  // Modal states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const containerRef = useRef<HTMLFormElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowAttachMenu(false);
        setShowIconMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (content.trim()) {
      onSend(content.trim());
      setContent('');
      setShowIconMenu(false);
    }
  };

  const handleSendImage = (base64: string) => {
    onSend(`[IMAGE]${base64}`);
  };

  const handleSendVideo = (url: string) => {
    onSend(`[VIDEO]${url}`);
  };

  const handleSendLocation = (type: 'current' | 'live') => {
    if (type === 'current') {
      onSend(`[LOCATION]📍 Đã chia sẻ vị trí hiện tại`);
    } else {
      onSend(`[LIVE_LOCATION]📡 Đang chia sẻ vị trí trực tiếp (60 phút)`);
    }
  };

  return (
    <form ref={containerRef} className="chat-input-area p-3 bg-white border-top position-relative" onSubmit={handleSubmit}>
      {/* Menus */}
      {showAttachMenu && (
        <AttachmentMenu 
          onClose={() => setShowAttachMenu(false)}
          onSelectImage={(file) => {
            if (file.size > 5 * 1024 * 1024) return showAlert('File ảnh quá lớn (tối đa 5MB)', 'error');
            setImageFile(file);
          }}
          onSelectVideo={(file) => {
            if (file.size > 20 * 1024 * 1024) return showAlert('File video quá lớn (tối đa 20MB)', 'error');
            setVideoFile(file);
          }}
          onSelectLocation={() => setShowLocationModal(true)}
        />
      )}

      {showIconMenu && (
        <IconMenu 
          onClose={() => setShowIconMenu(false)}
          onSelectIcon={(icon) => setContent(prev => prev + icon)}
          onSelectSticker={(url) => onSend(`[STICKER]${url}`)}
          onSelectGif={(url) => onSend(`[GIF]${url}`)}
        />
      )}

      {/* Input Bar */}
      <div className="d-flex align-items-end gap-2 bg-light rounded-pill p-1 ps-2 border">
        <button 
          type="button" 
          className={`btn btn-link p-2 rounded-circle hover-bg-white ${showAttachMenu ? 'text-primary bg-white shadow-sm' : 'text-muted'}`}
          onClick={() => {
            setShowAttachMenu(!showAttachMenu);
            setShowIconMenu(false);
          }}
        >
          <i className="bi bi-plus-lg fs-5"></i>
        </button>

        <button 
          type="button" 
          className={`btn btn-link p-2 rounded-circle hover-bg-white ${showIconMenu ? 'text-primary bg-white shadow-sm' : 'text-muted'}`}
          onClick={() => {
            setShowIconMenu(!showIconMenu);
            setShowAttachMenu(false);
          }}
        >
          <i className="bi bi-emoji-smile fs-5"></i>
        </button>

        <input 
          type="text" 
          className="form-control border-0 bg-transparent py-2 shadow-none flex-grow-1" 
          placeholder="Nhập tin nhắn..." 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => {
            setShowAttachMenu(false);
            setShowIconMenu(false);
          }}
        />

        <Button 
          type="submit" 
          variant="primary" 
          disabled={!content.trim()} 
          className="rounded-circle p-2 d-flex align-items-center justify-content-center"
          style={{ width: '40px', height: '40px', marginRight: '2px' }}
        >
          <i className="bi bi-send-fill"></i>
        </Button>
      </div>

      {/* Modals */}
      <ImageEditorModal 
        isOpen={!!imageFile} 
        file={imageFile} 
        onClose={() => setImageFile(null)} 
        onSend={handleSendImage} 
      />
      
      <VideoEditorModal 
        isOpen={!!videoFile} 
        file={videoFile} 
        onClose={() => setVideoFile(null)} 
        onSend={handleSendVideo} 
      />
      
      <LocationShareModal 
        isOpen={showLocationModal} 
        onClose={() => setShowLocationModal(false)} 
        onSendLocation={handleSendLocation} 
      />
    </form>
  );
};
