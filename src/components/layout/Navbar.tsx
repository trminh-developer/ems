import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // For dark mode & language simulation
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('vi');

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDarkMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-bs-theme');
    }
  };

  const toggleLanguage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newLang = language === 'vi' ? 'en' : 'vi';
    setLanguage(newLang);
    // Alert user since we don't have a full i18n system yet
    alert(`Đã đổi ngôn ngữ sang: ${newLang === 'vi' ? 'Tiếng Việt' : 'English'}`);
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
          <div className="dropdown" ref={dropdownRef}>
            <button 
              className="btn btn-link p-0 text-decoration-none" 
              type="button" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{ outline: 'none', boxShadow: 'none' }}
            >
              <Avatar src={user.avatar || ''} alt={user.firstName} size="sm" isOnline={user.isOnline} />
            </button>
            
            {isDropdownOpen && (
              <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2 show" style={{ position: 'absolute', right: 0, top: '100%', minWidth: '220px', zIndex: 1050 }}>
                <li>
                  <Link className="dropdown-item py-2 d-flex align-items-center" to="/profile" onClick={() => setIsDropdownOpen(false)}>
                    <i className="bi bi-person me-3 fs-5 text-secondary"></i>
                    <span>Profile</span>
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item py-2 d-flex align-items-center" to="/settings" onClick={() => setIsDropdownOpen(false)}>
                    <i className="bi bi-gear me-3 fs-5 text-secondary"></i>
                    <span>Settings</span>
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item py-2 d-flex align-items-center justify-content-between" onClick={toggleDarkMode}>
                    <div className="d-flex align-items-center">
                      <i className={`bi ${isDarkMode ? 'bi-moon-fill text-primary' : 'bi-moon'} me-3 fs-5 text-secondary`}></i>
                      <span>Dark Mode</span>
                    </div>
                    <div className="form-check form-switch m-0 p-0">
                      <input className="form-check-input ms-0" type="checkbox" checked={isDarkMode} readOnly style={{ marginTop: 0 }} />
                    </div>
                  </button>
                </li>
                <li>
                  <button className="dropdown-item py-2 d-flex align-items-center justify-content-between" onClick={toggleLanguage}>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-globe me-3 fs-5 text-secondary"></i>
                      <span>Language</span>
                    </div>
                    <span className="badge bg-light text-dark border">{language === 'vi' ? 'VI' : 'EN'}</span>
                  </button>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item text-danger py-2 d-flex align-items-center" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-3 fs-5"></i>
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
