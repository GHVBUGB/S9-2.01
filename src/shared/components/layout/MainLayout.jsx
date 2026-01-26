import React from 'react';
import ContentArea from './ContentArea';
import VideoPanel from './VideoPanel';
import './MainLayout.css';

/**
 * 7:3 主布局组件
 * 左侧70%内容区 + 右侧30%视频面板
 */
const MainLayout = ({ 
  children, 
  role = 'student',  // 'student' | 'teacher'
  className = ''
}) => {
  return (
    <div className={`main-layout ${className}`}>
      {/* 左侧内容区 (70%) */}
      <ContentArea role={role}>
        {children}
      </ContentArea>
      
      {/* 右侧视频面板 (30%) */}
      <VideoPanel role={role} />
    </div>
  );
};

export default MainLayout;

