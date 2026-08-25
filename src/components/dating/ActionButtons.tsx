import React from 'react';

interface ActionButtonProps {
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const LikeButton: React.FC<ActionButtonProps> = ({ onClick, size = 'md' }) => {
  const sizeClass = size === 'sm' ? 'btn-sm p-2' : size === 'lg' ? 'btn-lg p-4' : 'p-3';
  return (
    <button className={`action-btn action-btn-like btn btn-light rounded-circle shadow-sm ${sizeClass}`} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <i className="bi bi-heart-fill text-danger fs-3"></i>
    </button>
  );
};

export const DislikeButton: React.FC<ActionButtonProps> = ({ onClick, size = 'md' }) => {
  const sizeClass = size === 'sm' ? 'btn-sm p-2' : size === 'lg' ? 'btn-lg p-4' : 'p-3';
  return (
    <button className={`action-btn action-btn-dislike btn btn-light rounded-circle shadow-sm ${sizeClass}`} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <i className="bi bi-x-lg text-dark fs-3"></i>
    </button>
  );
};

export const SuperLikeButton: React.FC<ActionButtonProps> = ({ onClick, size = 'md' }) => {
  const sizeClass = size === 'sm' ? 'btn-sm p-2' : size === 'lg' ? 'btn-lg p-3' : 'p-2';
  return (
    <button className={`action-btn action-btn-superlike btn btn-light rounded-circle shadow-sm ${sizeClass}`} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <i className="bi bi-star-fill text-primary fs-4"></i>
    </button>
  );
};
