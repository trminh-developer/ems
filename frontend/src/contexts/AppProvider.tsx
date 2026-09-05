import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { MatchProvider } from './MatchContext';
import { ChatProvider } from './ChatContext';
import { NotificationProvider } from './NotificationContext';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <MatchProvider>
        <ChatProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </ChatProvider>
      </MatchProvider>
    </AuthProvider>
  );
};
