import React from 'react';
import { User } from '../../models';
import Avatar from '../common/Avatar';
import { calculateAge } from '../../utils/helpers';
import Button from '../common/Button';
import InterestBadge from './InterestBadge';

interface UserCardProps {
  user: User;
  onLike?: () => void;
  onMessage?: () => void;
  onClick?: () => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onLike, onMessage, onClick }) => {
  const age = calculateAge(user.dateOfBirth);

  return (
    <div className="hc-card h-100 cursor-pointer shadow-sm border-0 bg-white rounded-3 overflow-hidden" onClick={onClick}>
      <div className="hc-card-body p-4 d-flex flex-column align-items-center text-center">
        <Avatar src={user.avatar || ''} alt={(user.firstName || user.username)} size="xl" isOnline={user.isOnline} className="mb-3 shadow-sm" />
        
        <h5 className="mb-1 fw-bold">
          {(user.firstName || user.username)} {user.lastName}, {age}
        </h5>
        
        <p className="text-muted small mb-2 d-flex align-items-center gap-1">
          <i className="bi bi-geo-alt"></i> {user.location?.city}, {user.location?.country}
        </p>
        
        {user.profession && (
          <p className="text-muted small mb-3">{user.profession}</p>
        )}

        {user.interests && user.interests.length > 0 && (
          <div className="d-flex flex-wrap justify-content-center gap-2 mb-4 mt-auto">
            {user.interests.slice(0, 3).map(interest => (
              <InterestBadge key={interest.id} interest={interest} variant="light" />
            ))}
          </div>
        )}

        <div className="d-flex gap-2 w-100 mt-auto">
          {onMessage && (
            <Button variant="outline" className="flex-grow-1" onClick={(e) => { e.stopPropagation(); onMessage(); }}>
              <i className="bi bi-chat-dots me-2"></i> Message
            </Button>
          )}
          {onLike && (
            <Button variant="primary" className="flex-grow-1" onClick={(e) => { e.stopPropagation(); onLike(); }}>
              <i className="bi bi-heart me-2"></i> Like
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

