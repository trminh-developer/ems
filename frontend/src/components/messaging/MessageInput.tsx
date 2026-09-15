import React, { useState } from 'react';
import Button from '../common/Button';
import { useAlert } from '../../contexts/AlertContext';

interface MessageInputProps {
  onSend: (content: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const [content, setContent] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { showAlert } = useAlert();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (content.trim()) {
      onSend(content.trim());
      setContent('');
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showAlert('File quá lớn. Vui lòng chọn ảnh dưới 5MB.', 'error');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        // Here we could send it as a special image message
        // For now, let's prefix it so the parent component knows it's an image
        // Or if onSend supported types, we would pass 'image'
        onSend(`[IMAGE]${reader.result}`);
      };
      reader.readAsDataURL(file);
    }
    // Clear input
    e.target.value = '';
  };

  return (
    <form className="chat-input-area p-3 bg-white border-top" onSubmit={handleSubmit}>
      <div className="d-flex align-items-end gap-2 bg-light rounded-pill p-1 ps-3 border">
        <button type="button" className="btn btn-link text-muted p-2 rounded-circle hover-bg-white" onClick={handleImageClick}>
          <i className="bi bi-image fs-5"></i>
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept="image/*" 
          onChange={handleFileChange} 
        />
        <button type="button" className="btn btn-link text-muted p-2 rounded-circle hover-bg-white">
          <i className="bi bi-emoji-smile fs-5"></i>
        </button>
        <input 
          type="text" 
          className="form-control border-0 bg-transparent py-2 shadow-none flex-grow-1" 
          placeholder="Nhập tin nhắn..." 
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button 
          type="submit" 
          variant="primary" 
          disabled={!content.trim()} 
          className="rounded-circle p-2 d-flex align-items-center justify-content-center"
          style={{ width: '40px', height: '40px' }}
        >
          <i className="bi bi-send-fill"></i>
        </Button>
      </div>
    </form>
  );
};
