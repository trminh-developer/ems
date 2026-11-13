import { User } from '../models';
import apiClient from './apiClient';
import type { UserProfileUpdate } from '../models';

import { mapUser } from '../utils/helpers';

export const login = async (email: string, password: string): Promise<User> => {
  try {
    const res = await apiClient.post('/auth/login', { email, password });
            return mapUser(res.data.user);
  } catch (err: any) {
    throw new Error(err.response?.data?.error || err.message || 'Login failed');
  }
};

export const register = async (data: any): Promise<User> => {
  try {
    const res = await apiClient.post('/auth/register', data);
            return mapUser(res.data.user);
  } catch (err: any) {
    throw new Error(err.response?.data?.error || err.message || 'Registration failed');
  }
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
    const res = await apiClient.get('/auth/me');
    return mapUser(res.data);
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

export const updateUserInList = async (id: string, changes: UserProfileUpdate): Promise<User> => {
  const res = await apiClient.put(`/users/${id}`, changes);
  return mapUser(res.data.user);
};

export const forgotPassword = async (email: string) => { await apiClient.post('/auth/forgot-password', { email }); };
export const verifyOTP = async (email: string, otp: string) => { await apiClient.post('/auth/verify-otp', { email, otp }); };
export const resetPassword = async (email: string, password: string) => { await apiClient.post('/auth/reset-password', { email, password }); };


