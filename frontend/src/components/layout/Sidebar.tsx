import React from 'react';
import { NavLink } from 'react-router-dom';
// @ts-ignore
import { useNotifications } from '../../hooks/useNotifications';
// @ts-ignore
import { useChat } from '../../hooks/useChat';
import Badge from '../common/Badge';

interface SidebarProps {
  onNavClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNavClick }) => {
  const { unreadCount } = useNotifications();
  // @ts-ignore
  const { conversations } = useChat();

  const unreadMessagesCount = 0; // Calculate from conversations in real app

  return (
    <aside className="app-sidebar bg-white border-end d-flex flex-column py-4">
      <div className="sidebar-section mb-4 px-3">
        <h6 className="sidebar-section-title text-muted text-uppercase fs-7 fw-bold mb-3 px-3">Main</h6>
        <nav className="sidebar-nav d-flex flex-column gap-1">
          <NavLink to="/" onClick={onNavClick} className={({ isActive }) => `sidebar-nav-link text-decoration-none d-flex align-items-center gap-3 px-3 py-2 rounded-3 ${isActive ? 'active bg-danger text-white' : 'text-dark hover-bg-light'}`}>
            <i className="bi bi-house fs-5"></i>
            <span className="fw-medium">Home</span>
          </NavLink>
          <NavLink to="/discover" onClick={onNavClick} className={({ isActive }) => `sidebar-nav-link text-decoration-none d-flex align-items-center gap-3 px-3 py-2 rounded-3 ${isActive ? 'active bg-danger text-white' : 'text-dark hover-bg-light'}`}>
            <i className="bi bi-compass fs-5"></i>
            <span className="fw-medium">Discover</span>
          </NavLink>
          <NavLink to="/search" onClick={onNavClick} className={({ isActive }) => `sidebar-nav-link text-decoration-none d-flex align-items-center gap-3 px-3 py-2 rounded-3 ${isActive ? 'active bg-danger text-white' : 'text-dark hover-bg-light'}`}>
            <i className="bi bi-search fs-5"></i>
            <span className="fw-medium">Search</span>
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-section mb-4 px-3">
        <h6 className="sidebar-section-title text-muted text-uppercase fs-7 fw-bold mb-3 px-3">Social</h6>
        <nav className="sidebar-nav d-flex flex-column gap-1">
          <NavLink to="/feed" onClick={onNavClick} className={({ isActive }) => `sidebar-nav-link text-decoration-none d-flex align-items-center gap-3 px-3 py-2 rounded-3 ${isActive ? 'active bg-danger text-white' : 'text-dark hover-bg-light'}`}>
            <i className="bi bi-journal-text fs-5"></i>
            <span className="fw-medium">Bảng tin</span>
          </NavLink>
          <NavLink to="/matches" onClick={onNavClick} className={({ isActive }) => `sidebar-nav-link text-decoration-none d-flex align-items-center gap-3 px-3 py-2 rounded-3 ${isActive ? 'active bg-danger text-white' : 'text-dark hover-bg-light'}`}>
            <i className="bi bi-heart fs-5"></i>
            <span className="fw-medium">Matches</span>
          </NavLink>
          <NavLink to="/likes" onClick={onNavClick} className={({ isActive }) => `sidebar-nav-link text-decoration-none d-flex align-items-center gap-3 px-3 py-2 rounded-3 ${isActive ? 'active bg-danger text-white' : 'text-dark hover-bg-light'}`}>
            <i className="bi bi-stars fs-5 text-warning"></i>
            <span className="fw-medium">Lượt thích</span>
          </NavLink>
          <NavLink to="/messages" onClick={onNavClick} className={({ isActive }) => `sidebar-nav-link text-decoration-none d-flex align-items-center justify-content-between px-3 py-2 rounded-3 ${isActive ? 'active bg-danger text-white' : 'text-dark hover-bg-light'}`}>
            <div className="d-flex align-items-center gap-3">
              <i className="bi bi-chat-dots fs-5"></i>
              <span className="fw-medium">Messages</span>
            </div>
            {unreadMessagesCount > 0 && <Badge variant="primary" text={unreadMessagesCount.toString()} />}
          </NavLink>
          <NavLink to="/notifications" onClick={onNavClick} className={({ isActive }) => `sidebar-nav-link text-decoration-none d-flex align-items-center justify-content-between px-3 py-2 rounded-3 ${isActive ? 'active bg-danger text-white' : 'text-dark hover-bg-light'}`}>
            <div className="d-flex align-items-center gap-3">
              <i className="bi bi-bell fs-5"></i>
              <span className="fw-medium">Notifications</span>
            </div>
            {unreadCount > 0 && <Badge variant="danger" text={unreadCount.toString()} />}
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-section mt-auto px-3">
        <h6 className="sidebar-section-title text-muted text-uppercase fs-7 fw-bold mb-3 px-3">Account</h6>
        <nav className="sidebar-nav d-flex flex-column gap-1">
          <NavLink to="/profile" onClick={onNavClick} className={({ isActive }) => `sidebar-nav-link text-decoration-none d-flex align-items-center gap-3 px-3 py-2 rounded-3 ${isActive ? 'active bg-danger text-white' : 'text-dark hover-bg-light'}`}>
            <i className="bi bi-person fs-5"></i>
            <span className="fw-medium">Profile</span>
          </NavLink>
          <NavLink to="/settings" onClick={onNavClick} className={({ isActive }) => `sidebar-nav-link text-decoration-none d-flex align-items-center gap-3 px-3 py-2 rounded-3 ${isActive ? 'active bg-danger text-white' : 'text-dark hover-bg-light'}`}>
            <i className="bi bi-gear fs-5"></i>
            <span className="fw-medium">Settings</span>
          </NavLink>
          <NavLink to="/premium" onClick={onNavClick} className={({ isActive }) => `sidebar-nav-link text-decoration-none d-flex align-items-center gap-3 px-3 py-2 rounded-3 ${isActive ? 'active bg-warning text-white' : 'text-dark hover-bg-light'}`}>
            <i className="bi bi-gem fs-5 text-warning"></i>
            <span className="fw-medium fw-bold text-warning">Premium</span>
          </NavLink>
        </nav>
      </div>
    </aside>
  );
};
