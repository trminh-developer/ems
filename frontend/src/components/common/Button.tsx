import React from 'react';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  variant?: 'primary' | 'outline' | 'ghost' | 'warning' | 'secondary' | 'light' | 'danger' | 'success' | 'info' | 'dark' | string;
  icon?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | string;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size,
  icon, 
  children, 
  className = '', 
  ...props 
}) => {
  const customVariants: Record<string, string> = {
    primary: 'btn-hc-primary',
    outline: 'btn-hc-outline',
    ghost: 'btn-hc-ghost',
  };
  
  const variantClass = customVariants[variant] || `btn-${variant}`;
  const sizeClass = size ? `btn-${size}` : '';

  return (
    <button className={`btn ${variantClass} ${sizeClass} ${className}`} {...props}>
      {icon && <i className={`bi ${icon} me-2`}></i>}
      {children}
    </button>
  );
};

export default Button;
