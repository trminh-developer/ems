import React from 'react';
import { useTranslation } from 'react-i18next';
import { NotificationList } from '../components/notification';
import { Button, Loading, EmptyState } from '../components/common';
import { useNotifications } from '../hooks/useNotifications';

const NotificationsView = () => {
  const { t } = useTranslation();
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications();

  if (isLoading) return <Loading text={t('notifications.loading')} />;

  return (
    <div className="notifications-view fade-in">
      <div className="hc-card">
        <div className="hc-card-header d-flex justify-content-between align-items-center">
          <h4 className="mb-0">
            {t('notifications.title')} 
            {unreadCount > 0 && <span className="badge bg-danger ms-2">{unreadCount}</span>}
          </h4>
          {notifications && notifications.length > 0 && (
            <Button className="btn-sm btn-outline-primary" onClick={markAllAsRead}>
              {t('notifications.mark_all_read')}
            </Button>
          )}
        </div>
        <div className="hc-card-body p-0">
          {notifications && notifications.length > 0 ? (
            <NotificationList notifications={notifications} onMarkAsRead={markAsRead} onMarkAllAsRead={markAllAsRead} />
          ) : (
            <div className="p-4">
              <EmptyState icon="bi bi-bell-slash" title={t('notifications.empty_title')} description="" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsView;
