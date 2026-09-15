import React, { createContext, useReducer, useEffect, ReactNode } from 'react';
import { User, Gender, RelationshipGoal } from '../models';
import { authService } from '../services';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
}

type AuthAction =
  | { type: 'INIT_START' }
  | { type: 'INIT_FINISH'; payload?: User }
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'INIT_START':
      return { ...state, isInitialized: false };
    case 'INIT_FINISH':
      return { 
        ...state, 
        user: action.payload || null, 
        isAuthenticated: !!action.payload, 
        isInitialized: true 
      };
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload, isAuthenticated: true, isLoading: false };
    case 'LOGIN_FAILURE':
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, isLoading: false };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

export interface AuthContextType extends AuthState {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// localStorage chỉ lưu userId để biết đang đăng nhập, KHÔNG lưu data user
const SESSION_KEY = 'hc_session_uid';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Khi mở app: kiểm tra session → fetch data MỚI NHẤT từ Supabase
  useEffect(() => {
    const initAuth = async () => {
      dispatch({ type: 'INIT_START' });
      const userId = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
      if (userId) {
        try {
          const freshUser = await authService.refreshUser(userId);
          if (freshUser) {
            authService.setCurrentUser(freshUser);
            dispatch({ type: 'INIT_FINISH', payload: freshUser });
          } else {
            localStorage.removeItem(SESSION_KEY);
            sessionStorage.removeItem(SESSION_KEY);
            authService.setCurrentUser(null);
            dispatch({ type: 'INIT_FINISH' });
          }
        } catch (err) {
          console.error('Lỗi kết nối server:', err);
          authService.setCurrentUser(null);
          dispatch({ type: 'INIT_FINISH' });
        }
      } else {
        authService.setCurrentUser(null);
        dispatch({ type: 'INIT_FINISH' });
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const user = await authService.login(email, password);
      // Chỉ lưu userId, KHÔNG lưu toàn bộ data
      if (rememberMe) {
        localStorage.setItem(SESSION_KEY, user.id);
      } else {
        sessionStorage.setItem(SESSION_KEY, user.id);
      }
      authService.setCurrentUser(user);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const register = async (data: any) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const user = await authService.register(data);
      localStorage.setItem(SESSION_KEY, user.id);
      authService.setCurrentUser(user);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const logout = async () => {
    await authService.logout();
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    // Hủy token ở client (OAuth 2.0 Security)
    localStorage.removeItem('hc_access_token');
    localStorage.removeItem('hc_refresh_token');
    sessionStorage.removeItem('hc_access_token');
    sessionStorage.removeItem('hc_refresh_token');
    
    // Xóa cả key cũ nếu còn sót
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    authService.setCurrentUser(null);
    dispatch({ type: 'LOGOUT' });
  };

  // Cập nhật: ghi lên Supabase TRƯỚC → sau đó mới cập nhật UI
  const updateUser = async (user: User) => {
    try {
      await authService.updateUserInList(user);
      authService.setCurrentUser(user);
      dispatch({ type: 'UPDATE_USER', payload: user });
    } catch (err) {
      console.error('Lỗi lưu dữ liệu lên server:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
