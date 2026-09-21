import React, { useState } from 'react';
import { Message, MessageStatus, MessageType } from '../../models';
import { formatTime } from '../../utils/helpers';
import { useAlert } from '../../contexts/AlertContext';
import { MessageMap } from './MessageMap';

interface MessageBubbleProps {
  message: Message;
  isSent: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = React.memo(({ message, isSent }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { showAlert } = useAlert();

  const renderStatus = () => {
    if (!isSent) return null;
    switch (message.status) {
      case MessageStatus.SENT: return <i className="bi bi-check text-muted ms-1"></i>;
      case MessageStatus.DELIVERED: return <i className="bi bi-check-all text-muted ms-1"></i>;
      case MessageStatus.SEEN: return <i className="bi bi-check-all text-primary ms-1"></i>;
      default: return null;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    showAlert('Đã sao chép tin nhắn', 'success');
    setDropdownOpen(false);
  };

  const handleDelete = () => {
    showAlert('Đã xóa tin nhắn phía bạn', 'info');
    setDropdownOpen(false);
  };

  const handleRecall = () => {
    showAlert('Đã thu hồi tin nhắn', 'warning');
    setDropdownOpen(false);
  };

  const closeDropdown = () => setDropdownOpen(false);

  return (
    <div
      className={`d-flex ${isSent ? 'justify-content-end' : 'justify-content-start'} mb-3 position-relative`}
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => { setShowOptions(false); closeDropdown(); }}
    >
      <div
        className={`message-bubble p-3 rounded-4 shadow-sm position-relative ${isSent ? 'message-bubble-sent bg-primary text-white rounded-bottom-end-0' : 'message-bubble-received bg-white text-dark rounded-bottom-start-0 border'}`}
        style={{ maxWidth: '75%' }}
      >
        {message.type === MessageType.IMAGE || message.content.startsWith('[IMAGE]') ? (
          <div className="mb-2">
            <img src={message.content.replace('[IMAGE]', '')} alt="Sent image" className="img-fluid rounded" style={{ maxHeight: '300px' }} />
          </div>
        ) : message.content.startsWith('[VIDEO]') ? (
          <div className="mb-2">
            <video src={message.content.replace('[VIDEO]', '')} controls className="img-fluid rounded" style={{ maxHeight: '300px' }} />
          </div>
        ) : message.content.startsWith('[STICKER]') || message.content.startsWith('[GIF]') ? (
          <div className="mb-2 bg-transparent p-0 shadow-none border-0">
            <img src={message.content.replace('[STICKER]', '').replace('[GIF]', '')} alt="Sticker/GIF" style={{ maxWidth: '150px' }} />
          </div>
        ) : message.content.startsWith('[LOCATION]') || message.content.startsWith('[LIVE_LOCATION]') ? (
          <div>
            <div className="mb-1 text-break d-flex align-items-center gap-2">
              <i className={`bi fs-3 ${message.content.startsWith('[LIVE]') ? 'bi-broadcast text-danger' : 'bi-pin-map-fill text-warning'}`}></i>
              <span>{message.content.replace(/\[.*?\]/, '')}</span>
            </div>
            {/* Display a small static map for effect. In a real app, lat/lng would be parsed from content. */}
            <MessageMap lat={16.047079} lng={108.206230} />
          </div>
        ) : (
          <p className="mb-1 text-break">{message.content}</p>
        )}
        <div className={`d-flex align-items-center justify-content-end small ${isSent ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: '0.7rem' }}>
          <span>{formatTime(message.timestamp)}</span>
          {renderStatus()}
        </div>
      </div>

      {showOptions && (
        <div className={`d-flex align-items-center position-relative ${isSent ? 'me-2 order-first' : 'ms-2 order-last'}`}>
          <button
            className="btn btn-sm rounded-circle text-muted p-1 border-0 bg-transparent"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <i className="bi bi-three-dots-vertical"></i>
          </button>

          {dropdownOpen && (
            <div
              className={`dropdown-menu show shadow-sm border-0 position-absolute ${isSent ? 'end-100 top-0 me-1' : 'start-100 top-0 ms-1'}`}
              style={{ zIndex: 1000, minWidth: '160px', fontSize: '0.875rem' }}
            >
              <button className="dropdown-item" onClick={() => { showAlert('Chức năng trả lời sẽ sớm ra mắt!', 'info'); closeDropdown(); }}>
                <i className="bi bi-reply me-2"></i> Trả lời
              </button>
              {message.type !== MessageType.IMAGE && (
                <button className="dropdown-item" onClick={handleCopy}>
                  <i className="bi bi-copy me-2"></i> Sao chép
                </button>
              )}
              {isSent && (
                <button className="dropdown-item text-danger" onClick={handleRecall}>
                  <i className="bi bi-arrow-counterclockwise me-2"></i> Thu hồi
                </button>
              )}
              <button className="dropdown-item text-danger" onClick={handleDelete}>
                <i className="bi bi-trash me-2"></i> Xóa phía bạn
              </button>
              {!isSent && (
                <button className="dropdown-item text-warning" onClick={() => { showAlert('Đã gửi báo cáo vi phạm!', 'warning'); closeDropdown(); }}>
                  <i className="bi bi-flag me-2"></i> Báo cáo
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
});
