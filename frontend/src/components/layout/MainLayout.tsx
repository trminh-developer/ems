import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileNavigation } from './MobileNavigation';
// @ts-ignore
import { useAuth } from '../../hooks/useAuth';

export const MainLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Optionally redirect to login or return simple layout for unauthenticated
    return <Outlet />;
  }

  return (
    <div className="app-layout d-flex flex-column vh-100 bg-light">
      <Navbar />
      <div className="d-flex flex-grow-1 overflow-hidden">
        <div className="d-none d-md-block h-100">
          <Sidebar />
        </div>
        <main className="app-main flex-grow-1 overflow-auto p-3 p-md-4">
          <Outlet />
        </main>
      </div>
      <MobileNavigation />
    </div>
  );
};
