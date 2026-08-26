import React, { createContext, useReducer, useEffect, ReactNode } from 'react';
import { User, Gender, RelationshipGoal } from '../models';
import { authService } from '../services';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
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
  updateUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initAuth = async () => {
      const cachedUser = authService.getCurrentUser();
      if (cachedUser) {
        // Hiển thị dữ liệu cache trước để không bị loading lâu
        dispatch({ type: 'LOGIN_SUCCESS', payload: cachedUser });
        
        // Sau đó đồng bộ dữ liệu mới nhất từ Supabase
        try {
          const freshUser = await authService.refreshUser(cachedUser.id);
          if (freshUser) {
            // Cập nhật lại storage và state
            if (sessionStorage.getItem('currentUser')) {
              sessionStorage.setItem('currentUser', JSON.stringify(freshUser));
            } else {
              localStorage.setItem('currentUser', JSON.stringify(freshUser));
            }
            dispatch({ type: 'UPDATE_USER', payload: freshUser });
          }
        } catch (err) {
          console.warn('Không thể đồng bộ từ Supabase, dùng dữ liệu cache:', err);
        }
      } else {
        dispatch({ type: 'LOGIN_FAILURE' });
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const user = await authService.login(email, password);
      if (rememberMe) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
      }
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
      localStorage.setItem('currentUser', JSON.stringify(user)); // Default to local for register
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const logout = async () => {
    await authService.logout();
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (user: User) => {
    if (sessionStorage.getItem('currentUser')) {
      sessionStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
    authService.updateUserInList(user);
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
