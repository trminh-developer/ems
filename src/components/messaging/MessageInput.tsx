import React, { useState } from 'react';
import Button from '../common/Button';

interface MessageInputProps {
  onSend: (content: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSend(content.trim());
      setContent('');
    }
  };

  return (
    <form className="chat-input-area p-3 bg-white border-top" onSubmit={handleSubmit}>
      <div className="d-flex align-items-end gap-2 bg-light rounded-pill p-1 ps-3 border">
        <button type="button" className="btn btn-link text-muted p-2 rounded-circle hover-bg-white">
          <i className="bi bi-emoji-smile fs-5"></i>
        </button>
        <input 
          type="text" 
          className="form-control border-0 bg-transparent py-2 shadow-none flex-grow-1" 
          placeholder="Type a message..." 
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
