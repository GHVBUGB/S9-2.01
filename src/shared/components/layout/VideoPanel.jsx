import React from 'react';
import VideoWindow from '../video/VideoWindow';
import './VideoPanel.css';

/**
 * 视频面板组件 (30%)
 * 包含双视频窗口：上方对方视频 + 下方自己视频
 * 
 * @param {string} role - 角色：'student' | 'teacher'
 * @param {React.ReactNode} controls - 可选的控制区域（显示在视频下方）
 */
const VideoPanel = ({ role = 'student', controls = null }) => {
  // 根据角色确定视频顺序
  const isStudent = role === 'student';
  
  const topVideo = {
    name: isStudent ? '王老师' : '小明',
    role: isStudent ? 'teacher' : 'student',
    avatar: null,
    isCurrent: false
  };
  
  const bottomVideo = {
    name: isStudent ? '小明' : '王老师', 
    role: isStudent ? 'student' : 'teacher',
    avatar: null,
    isCurrent: true
  };

  return (
    <div className="video-panel">
      {/* 视频窗口区域 */}
      <div className="video-panel__videos">
        {/* 对方视频 */}
        <div className="video-panel__video-wrapper">
          <VideoWindow 
            {...topVideo} 
            layoutId={isStudent ? 'teacher-video' : 'student-video'}
            showOnlineStatus={true}
          />
        </div>
        
        {/* 自己视频 */}
        <div className="video-panel__video-wrapper">
          <VideoWindow 
            {...bottomVideo} 
            layoutId={isStudent ? 'student-video' : 'teacher-video'}
            showOnlineStatus={true}
          />
        </div>
      </div>
      
      {/* 控制区域（教师端使用） */}
      {controls && (
        <div className="video-panel__controls">
          {controls}
        </div>
      )}
    </div>
  );
};

export default VideoPanel;
