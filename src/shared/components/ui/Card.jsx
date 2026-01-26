import React from 'react';
import './Card.css';

/**
 * 卡片容器组件
 */
const Card = ({ 
  children, 
  variant = 'default',  // 'default' | 'elevated' | 'bordered'
  padding = 'md',       // 'none' | 'sm' | 'md' | 'lg'
  className = '',
  onClick,
  ...props
}) => {
  const classNames = [
    'card',
    `card--${variant}`,
    `card--padding-${padding}`,
    onClick && 'card--clickable',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div
      className={classNames}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;

