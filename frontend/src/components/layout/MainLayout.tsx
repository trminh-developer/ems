import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileNavigation } from './MobileNavigation';

export const MainLayout: React.FC = () => {
  return (
    <div className="app-layout d-flex flex-column vh-100 bg-light">
      <Navbar />
      <div className="d-flex flex-grow-1 overflow-hidden">
        {/* Đồng bộ: Sidebar luôn luôn nằm bên trái cho cả Guest và User */}
        <div className="d-none d-lg-block h-100">
          <Sidebar />
        </div>
        <main className="app-main flex-grow-1 overflow-auto p-3 p-lg-4">
          <Outlet />
        </main>
      </div>
      <MobileNavigation />
    </div>
  );
};

export default MainLayout;
