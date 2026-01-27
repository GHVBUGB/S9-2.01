import React from 'react';
import { User, Mic, MicOff, Video, VideoOff } from 'lucide-react';
import './VideoWindow.css';

/**
 * 单个视频窗口组件
 */
const VideoWindow = ({ 
  name = '', 
  role = 'student',  // 'student' | 'teacher'
  avatar = null, 
  isCurrent = false, // 是否是当前用户
  isMicOn = true,
  isVideoOn = true
}) => {
  return (
    <div className={`video-window ${isCurrent ? 'video-window--current' : ''}`}>
      {/* 视频区域 */}
      <div className="video-window__video">
        {avatar ? (
          <img src={avatar} alt={name} className="video-window__avatar" />
        ) : (
          <div className="video-window__placeholder">
            <User size={48} strokeWidth={1.5} />
          </div>
        )}
      </div>
      
      {/* 信息叠加层 */}
      <div className="video-window__overlay">
        {/* 角色标签 */}
        <div className="video-window__role-badge">
          {role === 'teacher' ? '教师' : '学生'}
        </div>
        
        {/* 底部信息栏 */}
        <div className="video-window__info">
          <span className="video-window__name">{name}</span>
          <div className="video-window__controls">
            {isMicOn ? (
              <Mic size={14} />
            ) : (
              <MicOff size={14} className="video-window__control--off" />
            )}
            {isVideoOn ? (
              <Video size={14} />
            ) : (
              <VideoOff size={14} className="video-window__control--off" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoWindow;
