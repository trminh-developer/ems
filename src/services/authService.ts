import { User, Gender, RelationshipGoal } from '../models';
import { currentUser, users as mockUsers } from '../data';

// Helper to get users list from local storage
const getUsersList = (): User[] => {
  const usersJson = localStorage.getItem('mockUsersList');
  if (usersJson) {
    return JSON.parse(usersJson);
  }
  // Initialize with the hardcoded mock users
  localStorage.setItem('mockUsersList', JSON.stringify(mockUsers));
  return mockUsers;
};

// Helper to save users list
const saveUsersList = (users: User[]) => {
  localStorage.setItem('mockUsersList', JSON.stringify(users));
};

export const login = async (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsersList();
      const user = users.find(u => u.email === email);
      if (user) {
        // If we want to check password, we could check here. For now, any password works for an existing email.
        resolve(user);
      } else {
        reject(new Error('Tài khoản chưa được đăng ký! Vui lòng đăng ký tài khoản.'));
      }
    }, 400);
  });
};

export const register = async (data: any): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsersList();
      const userExists = users.some(u => u.email === data.email);
      
      if (userExists) {
        reject(new Error('Email này đã được sử dụng! Vui lòng đăng nhập.'));
      } else {
        const newUser: User = {
          id: 'user_' + new Date().getTime(),
          username: data.email.split('@')[0],
          email: data.email,
          firstName: data.firstName || 'Người dùng',
          lastName: data.lastName || 'Mới',
          avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 90)}.jpg`,
          coverPhoto: '',
          gender: Gender.OTHER,
          dateOfBirth: '2000-01-01',
          location: { city: 'Hà Nội', country: 'Việt Nam' },
          bio: 'Thành viên mới',
          interests: [],
          photos: [],
          relationshipGoal: RelationshipGoal.NOT_SURE,
          isOnline: true,
          lastActive: new Date().toISOString(),
        };
        
        users.push(newUser);
        saveUsersList(users);
        resolve(newUser);
      }
    }, 400);
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

export const updateUserInList = (updatedUser: User): void => {
  const users = getUsersList();
  const index = users.findIndex(u => u.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    saveUsersList(users);
  }
};
