import React from 'react';
import { Notification, NotificationType } from '../../models';
import Avatar from '../common/Avatar';
import { formatTime } from '../../utils/helpers';

interface NotificationItemProps {
  notification: Notification;
  onClick?: () => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = React.memo(({ notification, onClick }) => {
  const getIcon = () => {
    switch (notification.type) {
      case NotificationType.LIKE: return <i className="bi bi-heart-fill text-danger"></i>;
      case NotificationType.MATCH: return <i className="bi bi-stars text-primary"></i>;
      case NotificationType.MESSAGE: return <i className="bi bi-chat-dots-fill text-success"></i>;
      case NotificationType.PROFILE_VIEW: return <i className="bi bi-eye-fill text-info"></i>;
      case NotificationType.SUPER_LIKE: return <i className="bi bi-star-fill text-warning"></i>;
      default: return <i className="bi bi-bell-fill text-secondary"></i>;
    }
  };

  return (
    <div 
      className={`notification-item p-3 d-flex align-items-start gap-3 cursor-pointer border-bottom ${notification.isRead ? 'bg-white' : 'bg-light'}`}
      onClick={onClick}
    >
      <div className="position-relative">
        <Avatar src={notification.fromUser.avatar || ''} alt={notification.fromUser.firstName} size="md" />
        <div className="notification-icon position-absolute bottom-0 end-0 bg-white rounded-circle shadow-sm d-flex align-items-center justify-content-center border" style={{ width: '24px', height: '24px', right: '-4px', bottom: '-4px', fontSize: '0.7rem' }}>
          {getIcon()}
        </div>
      </div>
      
      <div className="flex-grow-1 min-w-0">
        <p className={`mb-1 ${!notification.isRead ? 'fw-bold' : ''}`}>
          {notification.message}
        </p>
        <small className="text-muted">{formatTime(notification.timestamp)}</small>
      </div>

      {!notification.isRead && (
        <div className="bg-primary rounded-circle mt-2" style={{ width: '8px', height: '8px' }}></div>
      )}
    </div>
  );
});
