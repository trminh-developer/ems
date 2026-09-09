import { User } from '../models';
import apiClient from './apiClient';

export const login = async (email: string, password: string): Promise<User> => {
  const res = await apiClient.post('/auth/login', { email, password });
  localStorage.setItem('hc_access_token', res.data.accessToken);
  localStorage.setItem('hc_refresh_token', res.data.refreshToken);
  return res.data.user;
};

export const register = async (data: any): Promise<User> => {
  const res = await apiClient.post('/auth/register', data);
  localStorage.setItem('hc_access_token', res.data.accessToken);
  localStorage.setItem('hc_refresh_token', res.data.refreshToken);
  return res.data.user;
};

export const logout = async (): Promise<void> => {
  const refreshToken = localStorage.getItem('hc_refresh_token');
  if (refreshToken) {
    try {
      await apiClient.post('/auth/logout', { token: refreshToken });
    } catch (e) {
      console.warn('Logout backend failed', e);
    }
  }
};

export const refreshUser = async (id: string): Promise<User | null> => {
  try {
    const res = await apiClient.get(`/users/${id}`);
    return res.data;
  } catch (e) {
    return null;
  }
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
};

export const updateUserInList = async (user: User): Promise<void> => {
  await apiClient.put(`/users/${user.id}`, user);
};
