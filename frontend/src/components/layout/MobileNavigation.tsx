import React from 'react';
import { NavLink } from 'react-router-dom';

export const MobileNavigation: React.FC = () => {
  return (
    <nav className="mobile-nav bg-white border-top fixed-bottom d-lg-none py-2 px-3 pb-safe">
      <div className="mobile-nav-items d-flex justify-content-between align-items-center">
        <NavLink to="/" className={({ isActive }) => `mobile-nav-link text-decoration-none d-flex flex-column align-items-center gap-1 ${isActive ? 'text-danger' : 'text-muted'}`}>
          <i className="bi bi-house fs-4"></i>
        </NavLink>
        <NavLink to="/discover" className={({ isActive }) => `mobile-nav-link text-decoration-none d-flex flex-column align-items-center gap-1 ${isActive ? 'text-danger' : 'text-muted'}`}>
          <i className="bi bi-compass fs-4"></i>
        </NavLink>
        <NavLink to="/matches" className={({ isActive }) => `mobile-nav-link text-decoration-none d-flex flex-column align-items-center gap-1 ${isActive ? 'text-danger' : 'text-muted'}`}>
          <i className="bi bi-heart fs-4"></i>
        </NavLink>
        <NavLink to="/feed" className={({ isActive }) => `mobile-nav-link text-decoration-none d-flex flex-column align-items-center gap-1 ${isActive ? 'text-danger' : 'text-muted'}`}>
          <i className="bi bi-journal-text fs-4"></i>
        </NavLink>
        <NavLink to="/messages" className={({ isActive }) => `mobile-nav-link text-decoration-none d-flex flex-column align-items-center gap-1 ${isActive ? 'text-danger' : 'text-muted'}`}>
          <i className="bi bi-chat-dots fs-4"></i>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `mobile-nav-link text-decoration-none d-flex flex-column align-items-center gap-1 ${isActive ? 'text-danger' : 'text-muted'}`}>
          <i className="bi bi-person fs-4"></i>
        </NavLink>
      </div>
    </nav>
  );
};
