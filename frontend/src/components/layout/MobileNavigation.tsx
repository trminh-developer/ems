import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';

export const MobileNavigation: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <nav className="mobile-nav bg-white border-top fixed-bottom d-lg-none px-2 pb-safe">
      <div className="mobile-nav-items d-flex justify-content-around align-items-center h-100">
        <NavLink 
          to="/" 
          title={t('nav.home')}
          className={({ isActive }) => `mobile-nav-link text-decoration-none d-flex align-items-center justify-content-center ${isActive ? 'text-danger active' : 'text-muted'}`}
        >
          <i className="bi bi-house fs-4"></i>
        </NavLink>

        <NavLink 
          to="/discover" 
          title={t('nav.discover')}
          className={({ isActive }) => `mobile-nav-link text-decoration-none d-flex align-items-center justify-content-center ${isActive ? 'text-danger active' : 'text-muted'}`}
        >
          <i className="bi bi-compass fs-4"></i>
        </NavLink>

        <NavLink 
          to="/search" 
          title={t('nav.search')}
          className={({ isActive }) => `mobile-nav-link text-decoration-none d-flex align-items-center justify-content-center ${isActive ? 'text-danger active' : 'text-muted'}`}
        >
          <i className="bi bi-search fs-4"></i>
        </NavLink>

        {user && (
          <>
            <NavLink 
              to="/matches" 
              title={t('nav.matches')}
              className={({ isActive }) => `mobile-nav-link text-decoration-none d-flex align-items-center justify-content-center ${isActive ? 'text-danger active' : 'text-muted'}`}
            >
              <i className="bi bi-heart fs-4"></i>
            </NavLink>

            <NavLink 
              to="/feed" 
              title={t('nav.feed')}
              className={({ isActive }) => `mobile-nav-link text-decoration-none d-flex align-items-center justify-content-center ${isActive ? 'text-danger active' : 'text-muted'}`}
            >
              <i className="bi bi-journal-text fs-4"></i>
            </NavLink>

            <NavLink 
              to="/messages" 
              title={t('nav.messages')}
              className={({ isActive }) => `mobile-nav-link text-decoration-none d-flex align-items-center justify-content-center ${isActive ? 'text-danger active' : 'text-muted'}`}
            >
              <i className="bi bi-chat-dots fs-4"></i>
            </NavLink>

            <NavLink 
              to="/profile" 
              title={t('nav.profile')}
              className={({ isActive }) => `mobile-nav-link text-decoration-none d-flex align-items-center justify-content-center ${isActive ? 'text-danger active' : 'text-muted'}`}
            >
              <i className="bi bi-person fs-4"></i>
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default MobileNavigation;
