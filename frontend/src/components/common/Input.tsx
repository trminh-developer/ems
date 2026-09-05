import React, { useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
}

const Input: React.FC<InputProps> = ({ label, error, icon, className = '', type, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="hc-input-group mb-3">
      {label && <label className="hc-input-label">{label}</label>}
      <div className="position-relative">
        {icon && <i className={`bi ${icon} position-absolute top-50 start-0 translate-middle-y ms-3`}></i>}
        <input 
          type={inputType}
          className={`hc-input form-control ${icon ? 'ps-5' : ''} ${error ? 'is-invalid' : ''} ${className}`} 
          style={isPassword ? { paddingRight: '2.5rem' } : undefined}
          {...props} 
        />
        {isPassword && (
          <button 
            type="button"
            className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-muted text-decoration-none px-3"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
          </button>
        )}
      </div>
      {error && <div className="hc-input-error text-danger mt-1 small">{error}</div>}
    </div>
  );
};

export default Input;
