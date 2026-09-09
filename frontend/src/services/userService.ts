import { User } from '../models';
import apiClient from './apiClient';

export const getUsers = async (): Promise<User[]> => {
  const res = await apiClient.get('/users');
  return res.data;
};

export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const res = await apiClient.get(`/users/${id}`);
    return res.data;
  } catch (e) {
    return null;
  }
};

export const getUserByUsername = async (username: string): Promise<User | null> => {
  try {
    const res = await apiClient.get(`/users/username/${username}`);
    return res.data;
  } catch (e) {
    return null;
  }
};

export const getRecommendedUsers = async (currentUserId: string, limit = 10): Promise<User[]> => {
  const res = await apiClient.get('/users/recommended', { params: { limit } });
  return res.data;
};

export const getNearbyUsers = async (currentUserId: string, limit = 10, maxDistance?: number): Promise<User[]> => {
  const res = await apiClient.get('/users/nearby', { params: { limit, maxDistance } });
  return res.data;
};

export const searchUsers = async (query: string): Promise<User[]> => {
  const res = await apiClient.get('/users/search', { params: { q: query } });
  return res.data;
};

export const blockUser = async (blockerId: string, blockedId: string): Promise<void> => {
  await apiClient.post('/users/block', { blockedId });
};

export const reportUser = async (reporterId: string, reportedId: string, reason: string, details?: string): Promise<void> => {
  await apiClient.post('/users/report', { reportedId, reason, details });
};
