import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Target } from 'lucide-react';
import './SimpleHeader.css';

/**
 * 简化版顶部导航栏
 * 用于额外功能模块（复习、AI语境、大考、词库等）
 */
const SimpleHeader = ({ onBack, title, mode, progress, track, showBadges = false }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/');
    }
  };

  // 获取车道信息
  const getTrackInfo = () => {
    if (track === 'fast') {
      return { icon: '⚡', label: '闪电车道', color: 'yellow' };
    } else if (track === 'standard') {
      return { icon: '📘', label: '标准车道', color: 'blue' };
    }
    return null;
  };

  const trackInfo = getTrackInfo();

  return (
    <header className="simple-header">
      <div className="simple-header__logo">
        <div className="simple-header__logo-icon">
          <Zap size={18} fill="currentColor" />
        </div>
        <span className="simple-header__logo-text">Jarvis · Vocabulary</span>
      </div>
      
      {title && <div className="simple-header__title">{title}</div>}
      
      <div className="simple-header__right">
        {showBadges && (
          <div className="simple-header__badges">
            {trackInfo && (
              <div className={`simple-header__track-badge ${trackInfo.color}`}>
                <span className="track-icon">{trackInfo.icon}</span>
                <span>{trackInfo.label}</span>
              </div>
            )}
            {mode && (
              <div className={`simple-header__mode-badge ${mode === 'L4' ? 'l4' : 'l5'}`}>
                <Target size={14} />
                <span>MODE: {mode}</span>
              </div>
            )}
            {progress && (
              <div className="simple-header__progress-badge">
                {progress}
              </div>
            )}
          </div>
        )}
        <button onClick={handleBack} className="simple-header__back">
          <ArrowLeft size={16} />
          <span>返回</span>
        </button>
      </div>
    </header>
  );
};

export default SimpleHeader;
