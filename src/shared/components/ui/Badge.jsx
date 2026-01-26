import React from 'react';
import './Badge.css';

/**
 * 徽章组件（状态指示）
 */
const Badge = ({ 
  children, 
  variant = 'default',  // 'default' | 'red' | 'yellow' | 'green' | 'primary'
  size = 'md',          // 'sm' | 'md' | 'lg'
  dot = false,          // 是否显示为圆点
  className = '',
  ...props
}) => {
  const classNames = [
    'badge',
    `badge--${variant}`,
    `badge--${size}`,
    dot && 'badge--dot',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <span className={classNames} {...props}>
      {!dot && children}
    </span>
  );
};

export default Badge;

