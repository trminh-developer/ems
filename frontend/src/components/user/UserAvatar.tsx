import React from 'react';
import { User } from '../../models';
import Avatar from '../common/Avatar';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showOnline?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 'md', showOnline = true }) => {
  return (
    <Avatar 
      src={user.avatar || ''} 
      alt={`${user.firstName} ${user.lastName}`} 
      size={size} 
      isOnline={showOnline ? user.isOnline : undefined} 
    />
  );
};
