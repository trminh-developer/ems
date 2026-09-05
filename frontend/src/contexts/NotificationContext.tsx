import React, { createContext, useReducer, useEffect, ReactNode } from 'react';
import { Notification } from '../models';
import { notificationService } from '../services';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
}

type NotificationAction =
  | { type: 'LOAD_NOTIFICATIONS_START' }
  | { type: 'LOAD_NOTIFICATIONS_SUCCESS'; payload: { notifications: Notification[], unreadCount: number } }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'MARK_ALL_AS_READ' };

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
};

const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case 'LOAD_NOTIFICATIONS_START':
      return { ...state, isLoading: true };
    case 'LOAD_NOTIFICATIONS_SUCCESS':
      return { ...state, notifications: action.payload.notifications, unreadCount: action.payload.unreadCount, isLoading: false };
    case 'MARK_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => n.id === action.payload ? { ...n, isRead: true } : n),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
    case 'MARK_ALL_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, isRead: true })),
        unreadCount: 0,
      };
    default:
      return state;
  }
};

export interface NotificationContextType extends NotificationState {
  loadNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  const loadNotifications = async () => {
    dispatch({ type: 'LOAD_NOTIFICATIONS_START' });
    const notifications = await notificationService.getNotifications();
    const unreadCount = await notificationService.getUnreadCount();
    dispatch({ type: 'LOAD_NOTIFICATIONS_SUCCESS', payload: { notifications, unreadCount } });
  };

  const markAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    dispatch({ type: 'MARK_AS_READ', payload: id });
  };

  const markAllAsRead = async () => {
    await notificationService.markAllAsRead();
    dispatch({ type: 'MARK_ALL_AS_READ' });
  };

  return (
    <NotificationContext.Provider value={{ ...state, loadNotifications, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};
