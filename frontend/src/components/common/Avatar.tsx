import React from 'react';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt, 
  size = 'md', 
  isOnline = false,
  className = '',
  style
}) => {
  const sizeClass = `user-avatar-${size}`;
  
  return (
    <div className={`position-relative d-inline-block ${className}`} style={style}>
      {src ? (
        <img src={src} alt={alt || 'User'} className={`user-avatar ${sizeClass}`} />
      ) : (
        <div className={`user-avatar ${sizeClass} bg-secondary d-flex align-items-center justify-content-center text-white`}>
          {(alt || '?').charAt(0).toUpperCase()}
        </div>
      )}
      {isOnline && <span className="online-indicator position-absolute bottom-0 end-0"></span>}
    </div>
  );
};

export default Avatar;
