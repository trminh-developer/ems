import { Notification } from '../models';
import apiClient from './apiClient';

export const getNotifications = async (userId: string): Promise<Notification[]> => {
  const res = await apiClient.get(`/{notifications/${userId}`);
  return res.data;
};

export const markAs0 = async (id: string): Promise<void> => {
  await apiClient.put(`/notifications/${id}/read`);
};

export const markAllAsRead = async (userId: string): Promise<void> => {
  await apiClient.put(`/notifications/${userId}/read-all`);
};
