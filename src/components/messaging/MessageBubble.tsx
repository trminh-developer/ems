import React from 'react';
import { Message, MessageStatus, MessageType } from '../../models';
import { formatTime } from '../../utils/helpers';

interface MessageBubbleProps {
  message: Message;
  isSent: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = React.memo(({ message, isSent }) => {
  const renderStatus = () => {
    if (!isSent) return null;
    switch (message.status) {
      case MessageStatus.SENT: return <i className="bi bi-check text-muted ms-1"></i>;
      case MessageStatus.DELIVERED: return <i className="bi bi-check-all text-muted ms-1"></i>;
      case MessageStatus.SEEN: return <i className="bi bi-check-all text-primary ms-1"></i>;
      default: return null;
    }
  };

  return (
    <div className={`d-flex ${isSent ? 'justify-content-end' : 'justify-content-start'}`}>
      <div 
        className={`message-bubble p-3 rounded-4 shadow-sm position-relative ${isSent ? 'message-bubble-sent bg-primary text-white rounded-bottom-end-0' : 'message-bubble-received bg-white text-dark rounded-bottom-start-0 border'}`}
        style={{ maxWidth: '75%' }}
      >
        {message.type === 'image' || message.type === MessageType.IMAGE ? (
          <div className="mb-2">
            <img src={message.content} alt="Sent image" className="img-fluid rounded" style={{ maxHeight: '300px' }} />
          </div>
        ) : (
          <p className="mb-1 text-break">{message.content}</p>
        )}
        <div className={`d-flex align-items-center justify-content-end small ${isSent ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: '0.7rem' }}>
          <span>{formatTime(message.timestamp)}</span>
          {renderStatus()}
        </div>
      </div>
    </div>
  );
});
