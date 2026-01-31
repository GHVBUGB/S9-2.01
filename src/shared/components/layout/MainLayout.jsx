import React from 'react';
import ContentArea from './ContentArea';
import VideoPanel from './VideoPanel';
import './MainLayout.css';

/**
 * 7:3 主布局组件
 * 左侧70%内容区 + 右侧30%视频面板
 * 
 * @param {React.ReactNode} children - 内容区子组件
 * @param {string} role - 角色：'student' | 'teacher'
 * @param {React.ReactNode} videoControls - 视频面板下方的控制区域
 * @param {string} className - 额外的 CSS 类名
 */
const MainLayout = ({ 
  children, 
  role = 'student',
  videoControls = null,
  className = ''
}) => {
  return (
    <div className={`main-layout ${className}`}>
      {/* 左侧内容区 (70%) */}
      <ContentArea role={role}>
        {children}
      </ContentArea>
      
      {/* 右侧视频面板 (30%) */}
      <VideoPanel role={role} controls={videoControls} />
    </div>
  );
};

export default MainLayout;
