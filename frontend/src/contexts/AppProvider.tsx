import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { MatchProvider } from './MatchContext';
import { ChatProvider } from './ChatContext';
import { NotificationProvider } from './NotificationContext';
import { AlertProvider } from './AlertContext';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
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
  );
};
