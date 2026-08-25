import React from 'react';
import { User } from '../../models';
import { calculateAge } from '../../utils/helpers';
import InterestBadge from '../user/InterestBadge';

interface DiscoverCardProps {
  user: User;
  onLike: () => void;
  onDislike: () => void;
  onSuperLike: () => void;
  onViewProfile: () => void;
}

export const DiscoverCard: React.FC<DiscoverCardProps> = ({ user, onLike, onDislike, onSuperLike, onViewProfile }) => {
  const age = calculateAge(user.dateOfBirth);
  // Prefer photos array, fallback to avatar
  const mainPhoto = user.photos?.[0] || user.avatar;

  return (
    <div className="discover-card position-relative w-100 overflow-hidden rounded-4 shadow-lg bg-dark cursor-pointer" style={{ height: '70vh', maxHeight: '600px' }} onClick={onViewProfile}>
      <img src={mainPhoto} alt={user.firstName} className="w-100 h-100 object-fit-cover" />
      
      <div className="discover-card-overlay position-absolute bottom-0 start-0 w-100 p-4 text-white" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}>
        <h2 className="fw-bold mb-1 d-flex align-items-center gap-2 text-white">
          {user.firstName}, {age}
          {user.isVerified && <i className="bi bi-patch-check-fill text-primary fs-5"></i>}
        </h2>
        
        <p className="mb-2 fs-6 opacity-75">
          <i className="bi bi-geo-alt me-1"></i> {user.location.city}, {user.location.country}
        </p>

        {user.profession && (
          <p className="mb-3 fs-6 opacity-75">
            <i className="bi bi-briefcase me-1"></i> {user.profession}
          </p>
        )}

        {user.interests && user.interests.length > 0 && (
          <div className="d-flex flex-wrap gap-2 mb-3">
            {user.interests.slice(0, 3).map(interest => (
              <InterestBadge key={interest.id} interest={interest} variant="light" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
