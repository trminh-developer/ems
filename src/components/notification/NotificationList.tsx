import React from 'react';
import { Notification } from '../../models';
import { NotificationItem } from './NotificationItem';
import Button from '../common/Button';

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({ notifications, onMarkAsRead, onMarkAllAsRead }) => {
  return (
    <div className="notification-list h-100 d-flex flex-column bg-white">
      <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
        <h5 className="mb-0 fw-bold">Notifications</h5>
        {notifications.some(n => !n.isRead) && (
          <Button variant="ghost" onClick={onMarkAllAsRead} className="btn-sm text-primary">
            Mark all as read
          </Button>
        )}
      </div>

      <div className="flex-grow-1 overflow-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted mt-5">
            <i className="bi bi-bell-slash fs-1 mb-3 d-block opacity-50"></i>
            <p>No notifications yet.</p>
          </div>
        ) : (
          <div className="list-group list-group-flush">
            {notifications.map(notification => (
              <NotificationItem 
                key={notification.id} 
                notification={notification} 
                onClick={() => onMarkAsRead(notification.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
