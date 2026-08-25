import React from 'react';

interface BadgeProps {
  count?: number;
  text?: string;
  variant?: 'primary' | 'success' | 'danger' | 'warning';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ 
  count, 
  text, 
  variant = 'danger',
  className = '' 
}) => {
  const content = count !== undefined ? (count > 99 ? '99+' : count) : text;
  
  if (!content && content !== 0) return null;

  return (
    <span className={`badge bg-${variant} rounded-pill ${className}`}>
      {content}
    </span>
  );
};

export default Badge;
