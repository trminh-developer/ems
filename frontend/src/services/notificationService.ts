import { Notification } from '../models';
import apiClient from './apiClient';
import { mapNotification } from '../utils/helpers';

export const getNotifications = async (userId: string): Promise<Notification[]> => {
  const res = await apiClient.get('/notifications/' + userId);
  return res.data?.map(mapNotification) || [];
};

export const markAsRead = async (id: string): Promise<void> => {
  await apiClient.put('/notifications/' + id + '/read');
};

export const markAllAsRead = async (userId: string): Promise<void> => {
  await apiClient.put('/notifications/mark-all-read/' + userId);
};

export const getUnreadCount = async (userId: string) => { 
  const res = await apiClient.get('/notifications/unread-count/' + userId); 
  return res.data.count !== undefined ? res.data.count : res.data; 
};

export const createNotification = async (data: { userId: string, type: string, message: string }) => {
  const res = await apiClient.post('/notifications', data);
  return mapNotification(res.data);
};
