import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Volume2, VolumeX } from 'lucide-react';
import './VideoWindow.css';

/**
 * 视频窗口组件 - 支持跨阶段平滑过渡动画
 * 使用 Framer Motion 的 layoutId 实现共享元素动画
 */
const VideoWindow = ({ 
  // 新增 props
  layoutId,
  className = '',
  showOnlineStatus = true,
  statusText = '在线',
  placeholderText = '视频连线中...',
  disableLayoutAnimation = false,
  style = {},
  
  // 兼容旧 props
  name = '', 
  role = 'student',
  avatar = null,
  isCurrent = false,
  isMicOn = true,
  isVideoOn = true
}) => {
  const [isMuted, setIsMuted] = useState(false);

  // 如果传入了 name，优先使用 name 作为占位文字
  const finalPlaceholderText = name ? `${name} 连线中...` : placeholderText;
  
  // 角色文字映射
  const finalStatusText = statusText || (role === 'teacher' ? '教师在线' : '学生在线');

  return (
    <motion.div
      layoutId={disableLayoutAnimation ? undefined : layoutId}
      className={`video-window ${className}`}
      style={style}
      transition={{
        layout: {
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1] // cubic-bezier 缓动
        }
      }}
    >
      {/* 背景渐变 */}
      <div className="video-window__background">
        {avatar ? (
          <img src={avatar} alt={name} className="video-window__avatar" />
        ) : (
          <div className="video-window__placeholder">
            <div className="video-window__placeholder-icon">
              <User size={28} />
            </div>
            <p className="video-window__placeholder-text">{finalPlaceholderText}</p>
          </div>
        )}
      </div>

      {/* 左上角：在线状态（毛玻璃效果）*/}
      {showOnlineStatus && (
        <div className="video-window__status">
          <span className="video-window__status-dot" />
          <span className="video-window__status-text">{finalStatusText}</span>
        </div>
      )}

      {/* 右下角：静音按钮（毛玻璃效果）*/}
      <div className="video-window__mute-btn-wrapper">
        <button 
          className={`video-window__mute-btn ${isMuted ? 'video-window__mute-btn--muted' : ''}`}
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
      </div>
    </motion.div>
  );
};

export default VideoWindow;
