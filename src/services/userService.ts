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
    setTimeout(() => {
      // Lấy user hiện tại từ local storage để lọc sở thích
      const currentUserStr = localStorage.getItem('currentUser');
      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        const preferredGenders = currentUser.datingPreference?.preferredGender || [];
        
        let recommended = users.filter((u: User) => {
          // Bỏ qua chính mình
          if (u.id === currentUser.id) return false;
          
          // Lọc theo giới tính mong muốn (nếu có set)
          if (preferredGenders.length > 0 && !preferredGenders.includes(u.gender)) {
            return false;
          }
          
          return true;
        });
        resolve(recommended);
      } else {
        resolve(users);
      }
    }, 500);
  });
};

export const getNearbyUsers = async (): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(users), 400);
  });
};
