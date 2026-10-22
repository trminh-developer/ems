import React, { ReactNode } from 'react';
import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from './AuthContext';
import { MatchProvider } from './MatchContext';
import { ChatProvider } from './ChatContext';
import { NotificationProvider } from './NotificationContext';
import { AlertProvider } from './AlertContext';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <AlertProvider>
        <AuthProvider>
          <MatchProvider>
            <ChatProvider>
              <NotificationProvider>
                {children}
              </NotificationProvider>
            </ChatProvider>
          </MatchProvider>
        </AuthProvider>
      </AlertProvider>
    </ThemeProvider>
  );
};

