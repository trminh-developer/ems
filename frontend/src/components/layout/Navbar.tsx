import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import { userService } from '../../services';
import { User } from '../../models';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  // For dark mode & language simulation
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('hc_theme') === 'dark';
  });
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('hc_lang') || 'vi';
  });

  // Apply initial theme on mount
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-bs-theme');
    }
  }, []);

  // Handle clicking outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
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
    localStorage.setItem('hc_theme', newDarkMode ? 'dark' : 'light');
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
    localStorage.setItem('hc_lang', newLang);
    alert(`Đã đổi ngôn ngữ sang: ${newLang === 'vi' ? 'Tiếng Việt' : 'English'}`);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const fetchSuggestions = async () => {
        try {
          const allUsers = await userService.getUsers();
          const q = searchQuery.toLowerCase().trim();
          const filtered = allUsers.filter(u => 
            (u.username || '').toLowerCase().includes(q) || 
            (u.firstName || '').toLowerCase().includes(q) || 
            (u.lastName || '').toLowerCase().includes(q)
          ).slice(0, 5);
          setSuggestions(filtered);
          setShowSuggestions(true);
        } catch (err) {
          console.error(err);
        }
      };
      
      const timer = setTimeout(() => {
        fetchSuggestions();
      }, 300); // debounce 300ms
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (username: string) => {
    navigate(`/profile/${username}`);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  return (
    <nav className="app-navbar d-flex align-items-center justify-content-between px-3 px-md-4">
      <Link to="/" className="navbar-brand text-decoration-none d-flex align-items-center gap-2">
        <img src="/logo-heartconnect.png" alt="HeartConnect Logo" height="36" />
        <span className="fw-bold fs-4 text-dark d-none d-sm-block">HeartConnect</span>
      </Link>

      <div ref={searchContainerRef} className="navbar-search position-relative d-none d-md-flex align-items-center bg-light rounded-pill px-3 py-2 flex-grow-1 mx-4" style={{ maxWidth: '400px' }}>
        <i className="bi bi-search text-muted me-2"></i>
        <input 
          type="text" 
          className="border-0 bg-transparent flex-grow-1 outline-none" 
          placeholder="Search..." 
          style={{ outline: 'none' }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
          onFocus={() => searchQuery.trim().length > 0 && setShowSuggestions(true)}
        />
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="position-absolute bg-white rounded shadow-sm border w-100" style={{ top: '110%', left: 0, zIndex: 1050, overflow: 'hidden' }}>
            <ul className="list-unstyled m-0">
              {suggestions.map((u) => (
                <li key={u.id} className="p-2 border-bottom hover-bg-light cursor-pointer" style={{ cursor: 'pointer' }} onClick={() => handleSuggestionClick(u.username || u.id)}>
                  <div className="d-flex align-items-center gap-2">
                    <Avatar src={u.avatar || ''} alt={u.firstName} size="sm" isOnline={u.isOnline} />
                    <div className="d-flex flex-column">
                      <span className="fw-medium text-dark" style={{ fontSize: '14px' }}>{u.firstName} {u.lastName}</span>
                      <span className="text-muted" style={{ fontSize: '12px' }}>@{u.username}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="navbar-actions d-flex align-items-center gap-3 gap-md-4">
        <button 
          className="btn btn-link text-dark p-0 text-decoration-none" 
          title="Tải lại dữ liệu"
          onClick={() => window.location.reload()}
        >
          <i className="bi bi-arrow-clockwise fs-5"></i>
        </button>

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
                <li>
                  <Link className="dropdown-item py-2 d-flex align-items-center" to="/premium" onClick={() => setIsDropdownOpen(false)}>
                    <i className="bi bi-gem me-3 fs-5 text-warning"></i>
                    <span className="fw-bold text-warning">Premium</span>
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
