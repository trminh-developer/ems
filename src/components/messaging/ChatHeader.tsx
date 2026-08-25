import React from 'react';
import { User } from '../../models';
import Avatar from '../common/Avatar';

interface ChatHeaderProps {
  user: User;
  onBack?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ user, onBack }) => {
  return (
    <div className="chat-header p-3 bg-white border-bottom d-flex align-items-center gap-3 shadow-sm z-index-1">
      {onBack && (
        <button className="btn btn-link text-dark p-0 d-md-none" onClick={onBack}>
          <i className="bi bi-chevron-left fs-4"></i>
        </button>
      )}
      
      <Avatar src={user.avatar || ''} alt={user.firstName} size="md" isOnline={user.isOnline} />
      
      <div className="flex-grow-1">
        <h6 className="mb-0 fw-bold">{user.firstName} {user.lastName}</h6>
        {user.isOnline ? (
          <small className="text-success">Online</small>
        ) : (
          <small className="text-muted">Offline</small>
        )}
      </div>

      <button className="btn btn-link text-muted p-2">
        <i className="bi bi-three-dots-vertical fs-5"></i>
      </button>
    </div>
  );
};
