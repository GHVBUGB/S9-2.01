import React from 'react';
import './Button.css';

/**
 * 通用按钮组件
 */
const Button = ({ 
  children, 
  variant = 'primary',  // 'primary' | 'secondary' | 'outline' | 'ghost'
  size = 'md',          // 'sm' | 'md' | 'lg'
  disabled = false,
  loading = false,
  className = '',
  onClick,
  ...props
}) => {
  const classNames = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    disabled && 'btn--disabled',
    loading && 'btn--loading',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button
      className={classNames}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <span className="btn__spinner"></span>}
      <span className="btn__content">{children}</span>
    </button>
  );
};

export default Button;
