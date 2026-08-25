import { Notification } from '../models';
import { notifications } from '../data';

export const getNotifications = async (): Promise<Notification[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(notifications), 400);
  });
};

export const markAsRead = async (notificationId: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 300);
  });
};

export const markAllAsRead = async (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 400);
  });
};

export const getUnreadCount = async (): Promise<number> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(notifications.filter((n: Notification) => !n.isRead).length);
    }, 300);
  });
};
