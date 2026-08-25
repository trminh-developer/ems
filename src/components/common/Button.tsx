import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  icon?: string;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  icon, 
  children, 
  className = '', 
  ...props 
}) => {
  const variantClass = {
    primary: 'btn-hc-primary',
    outline: 'btn-hc-outline',
    ghost: 'btn-hc-ghost',
  }[variant];

  return (
    <button className={`btn ${variantClass} ${className}`} {...props}>
      {icon && <i className={`bi ${icon} me-2`}></i>}
      {children}
    </button>
  );
};

export default Button;
