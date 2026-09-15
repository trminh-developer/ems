import React from 'react';
import { Notification, NotificationType } from '../../models';
import Avatar from '../common/Avatar';
import { formatTime } from '../../utils/helpers';

interface NotificationItemProps {
  notification: Notification;
  onClick?: () => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = React.memo(({ notification, onClick }) => {
  // Backend may return snake_case or camelCase
  const isRead = notification.isRead ?? (notification as any).is_read ?? false;
  const timestamp = notification.timestamp ?? (notification as any).created_at ?? '';
  const fromUser = notification.fromUser;

  const getIcon = () => {
    const type = notification.type as string;
    if (type === NotificationType.LIKE || type === 'like') return <i className="bi bi-heart-fill text-danger"></i>;
    if (type === NotificationType.MATCH || type === 'match') return <i className="bi bi-stars text-primary"></i>;
    if (type === NotificationType.MESSAGE || type === 'message') return <i className="bi bi-chat-dots-fill text-success"></i>;
    if (type === NotificationType.PROFILE_VIEW || type === 'profile_view') return <i className="bi bi-eye-fill text-info"></i>;
    if (type === NotificationType.SUPER_LIKE || type === 'super_like') return <i className="bi bi-star-fill text-warning"></i>;
    return <i className="bi bi-bell-fill text-secondary"></i>;
  };

  return (
    <div 
      className={`notification-item p-3 d-flex align-items-start gap-3 cursor-pointer border-bottom ${isRead ? 'bg-white' : 'bg-light'}`}
      onClick={onClick}
    >
      <div className="position-relative">
        {fromUser ? (
          <Avatar src={fromUser.avatar || ''} alt={fromUser.firstName || 'User'} size="md" />
        ) : (
          <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white" style={{ width: '44px', height: '44px', fontSize: '1.2rem' }}>
            {getIcon()}
          </div>
        )}
      </div>
      
      <div className="flex-grow-1 min-w-0">
        <p className={`mb-1 ${!isRead ? 'fw-bold' : ''}`}>
          {notification.message}
        </p>
        <small className="text-muted">{timestamp ? formatTime(timestamp) : ''}</small>
      </div>

      {!isRead && (
        <div className="bg-primary rounded-circle mt-2" style={{ width: '8px', height: '8px' }}></div>
      )}
    </div>
  );
});
