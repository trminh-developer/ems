import { Profile, User } from '../models';
import { users } from '../data';

export const getProfile = async (userId: string): Promise<Profile | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = users.find((u: User) => u.id === userId);
      if (user) {
        resolve({
          ...user,
          profileCompletion: 85,
          totalLikes: 10,
          totalMatches: 5,
          joinedDate: '2023-01-01T00:00:00Z',
        });
      } else {
        resolve(null);
      }
    }, 400);
  });
};

export const updateProfile = async (userId: string, data: Partial<Profile>): Promise<Profile> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find((u: User) => u.id === userId);
      if (user) {
        resolve({
          ...user,
          ...data,
          profileCompletion: 90,
          totalLikes: 10,
          totalMatches: 5,
          joinedDate: '2023-01-01T00:00:00Z',
        });
      } else {
        reject(new Error('User not found'));
      }
    }, 500);
  });
};

export const getProfileCompletion = (userId: string): number => {
  return 85;
};
