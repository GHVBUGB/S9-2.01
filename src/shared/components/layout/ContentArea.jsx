import React from 'react';
import './ContentArea.css';

/**
 * 内容区组件 (70%)
 * 用于展示学习内容、题型、状态看板等
 */
const ContentArea = ({ children, role = 'student' }) => {
  return (
    <div className={`content-area content-area--${role}`}>
      <div className="content-area__inner">
        {children}
      </div>
    </div>
  );
};

export default ContentArea;

