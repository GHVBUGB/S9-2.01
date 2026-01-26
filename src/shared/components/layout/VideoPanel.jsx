import React from 'react';
import VideoWindow from '../video/VideoWindow';
import './VideoPanel.css';

/**
 * 视频面板组件 (30%)
 * 包含双视频窗口：上方对方视频 + 下方自己视频
 */
const VideoPanel = ({ role = 'student' }) => {
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
      <div className="video-panel__inner">
        {/* 对方视频 */}
        <div className="video-panel__video video-panel__video--other">
          <VideoWindow {...topVideo} />
        </div>
        
        {/* 自己视频 */}
        <div className="video-panel__video video-panel__video--self">
          <VideoWindow {...bottomVideo} />
        </div>
      </div>
    </div>
  );
};

export default VideoPanel;

