import React, { useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const AdminLayout = () => {
  useEffect(() => { document.title = 'HeartConnect Admin'; }, []);
  const location = useLocation();

  const isActive = (path: string) => location.pathname.includes(path) ? 'active' : 'text-white';

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#1a1a1a' }}>
      {/* Sidebar */}
      <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark border-end border-secondary" style={{ width: '250px' }}>
        <a href="/admin" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
          <span className="fs-5 fw-bold" style={{ color: '#ff6b6b' }}>HeartConnect Admin</span>
        </a>
        <hr className="border-secondary" />
        <ul className="nav nav-pills flex-column mb-auto gap-2">
          <li className="nav-item">
            <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active bg-primary' : 'text-white'}`}>
              <i className="bi bi-speedometer2 me-2"></i> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/users" className={`nav-link ${isActive('/admin/users')} ${location.pathname.includes('/admin/users') ? 'bg-primary' : ''}`}>
              <i className="bi bi-people me-2"></i> Users (Phase 1)
            </Link>
          </li>
                    <li>
            <Link to="/admin/verifications" className={
av-link  }>
              <i className="bi bi-shield-check me-2"></i> Verifications
            </Link>
          </li>
          <hr className="border-secondary my-1" />
          <li className="nav-item">
            <span className="nav-link text-muted small text-uppercase fw-bold pb-1 pt-3">Phase 2: Content</span>
          </li>
          <li>
            <Link to="/admin/feed" className={
av-link  }>
              <i className="bi bi-postcard-heart me-2"></i> Feed & Posts
            </Link>
          </li>
          <li>
            <Link to="/admin/reports" className={
av-link  }>
              <i className="bi bi-exclamation-triangle me-2"></i> Báo cáo/Tickets
            </Link>
          </li>
          <hr className="border-secondary my-1" />
          <li className="nav-item">
            <span className="nav-link text-muted small text-uppercase fw-bold pb-1 pt-3">Phase 3 & 4</span>
          </li>
          <li>
            <Link to="/admin/analytics" className={
av-link  }>
              <i className="bi bi-graph-up me-2"></i> Thống kê & VIP
            </Link>
          </li>
          <li>
            <Link to="/admin/settings" className={
av-link  }>
              <i className="bi bi-gear me-2"></i> Cài đặt hệ thống
            </Link>
          </li>
        </ul>
        <hr className="border-secondary" />
        <div className="dropdown">
          <Link to="/" className="d-flex align-items-center text-white text-decoration-none">
            <i className="bi bi-box-arrow-left me-2"></i>
            <strong>Thoát về App</strong>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;



