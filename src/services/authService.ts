import { User } from '../models';
import { currentUser } from '../data';

export const login = async (email: string, password: string): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(currentUser as User), 400);
  });
};

export const register = async (data: any): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(currentUser as User), 400);
  });
};

export const logout = async (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 300);
  });
};

export const forgotPassword = async (email: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 300);
  });
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};
