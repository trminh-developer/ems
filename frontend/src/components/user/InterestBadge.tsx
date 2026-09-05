import React from 'react';
import { Interest } from '../../models';

interface InterestBadgeProps {
  interest: Interest;
  variant?: 'default' | 'light';
}

export const InterestBadge: React.FC<InterestBadgeProps> = ({ interest, variant = 'default' }) => {
  const bgClass = variant === 'light' ? 'bg-light text-dark border' : 'bg-secondary text-white';
  
  return (
    <span className={`interest-badge badge rounded-pill px-3 py-2 fw-normal d-flex align-items-center gap-2 ${bgClass}`}>
      {interest.icon && <i className={`bi ${interest.icon}`}></i>}
      <span>{interest.name}</span>
    </span>
  );
};

export default InterestBadge;
