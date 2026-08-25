import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
}

const Input: React.FC<InputProps> = ({ label, error, icon, className = '', ...props }) => {
  return (
    <div className="hc-input-group mb-3">
      {label && <label className="hc-input-label">{label}</label>}
      <div className="position-relative">
        {icon && <i className={`bi ${icon} position-absolute top-50 start-0 translate-middle-y ms-3`}></i>}
        <input 
          className={`hc-input form-control ${icon ? 'ps-5' : ''} ${error ? 'is-invalid' : ''} ${className}`} 
          {...props} 
        />
      </div>
      {error && <div className="hc-input-error text-danger mt-1 small">{error}</div>}
    </div>
  );
};

export default Input;
