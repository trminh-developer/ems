import { User } from '../models';
import { users } from '../data';

export const getUsers = async (): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(users), 400);
  });
};

export const getUserById = async (id: string): Promise<User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = users.find((u: User) => u.id === id);
      resolve(user || null);
    }, 300);
  });
};

export const searchUsers = async (query: string): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const q = query.toLowerCase();
      resolve(users.filter((u: User) => u.firstName.toLowerCase().includes(q) || u.lastName.toLowerCase().includes(q)));
    }, 300);
  });
};

export const getRecommendedUsers = async (): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(users), 500);
  });
};

export const getNearbyUsers = async (): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(users), 400);
  });
};
