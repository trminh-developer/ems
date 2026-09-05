import React from 'react';

interface LoadingProps {
  text?: string;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({ text, className = '' }) => {
  return (
    <div className={`d-flex flex-column align-items-center justify-content-center p-4 ${className}`}>
      <div className="loading-spinner spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      {text && <div className="mt-3 text-muted">{text}</div>}
    </div>
  );
};

export default Loading;
