import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
// @ts-ignore
import { useAuth } from '../../hooks/useAuth';
// @ts-ignore
import { useNotifications } from '../../hooks/useNotifications';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="app-navbar d-flex align-items-center justify-content-between px-3 px-md-4">
      <Link to="/" className="navbar-brand text-decoration-none d-flex align-items-center gap-2">
        <i className="bi bi-heart-fill text-danger fs-4"></i>
        <span className="fw-bold fs-4 text-dark d-none d-sm-block">HeartConnect</span>
      </Link>

      <div className="navbar-search d-none d-md-flex align-items-center bg-light rounded-pill px-3 py-2 flex-grow-1 mx-4" style={{ maxWidth: '400px' }}>
        <i className="bi bi-search text-muted me-2"></i>
        <input type="text" className="border-0 bg-transparent flex-grow-1 outline-none" placeholder="Search..." style={{ outline: 'none' }} />
      </div>

      <div className="navbar-actions d-flex align-items-center gap-3 gap-md-4">
        <Link to="/notifications" className="text-dark position-relative text-decoration-none">
          <i className="bi bi-bell fs-5"></i>
          {unreadCount > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
              {unreadCount}
            </span>
          )}
        </Link>
        
        <Link to="/messages" className="text-dark position-relative text-decoration-none">
          <i className="bi bi-chat-dots fs-5"></i>
        </Link>

        {user && (
          <div className="dropdown">
            <button className="btn btn-link p-0 text-decoration-none dropdown-toggle-none" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ outline: 'none', boxShadow: 'none' }}>
              <Avatar src={user.avatar || ''} alt={user.firstName} size="sm" isOnline={user.isOnline} />
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2">
              <li><Link className="dropdown-item py-2" to="/profile"><i className="bi bi-person me-2"></i>Profile</Link></li>
              <li><Link className="dropdown-item py-2" to="/settings"><i className="bi bi-gear me-2"></i>Settings</Link></li>
              <li><hr className="dropdown-divider" /></li>
              <li><button className="dropdown-item text-danger py-2" onClick={handleLogout}><i className="bi bi-box-arrow-right me-2"></i>Logout</button></li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};
