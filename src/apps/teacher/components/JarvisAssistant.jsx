import React from 'react';
import { Sparkles, MessageCircle } from 'lucide-react';
import './JarvisAssistant.css';

/**
 * Jarvis 助教组件 - 智能教学引导卡片
 * 为教师提供实时的教学脚本和建议行动
 * 
 * @param {Object} script - 当前指引脚本 { title, content, action }
 * @param {string} className - 容器className
 */
const JarvisAssistant = ({ script, className = '' }) => {
  // 默认脚本（当没有传入时）
  const defaultScript = {
    title: '等待中',
    content: '正在加载教学指引...',
    action: '请稍候'
  };

  const currentScript = script || defaultScript;

  return (
    <div className={`jarvis-assistant ${className}`}>
      {/* 标题区域 - 图标 + 名称 */}
      <div className="jarvis-assistant__header">
        <div className="jarvis-assistant__icon">
          <Sparkles size={14} />
        </div>
        <div className="jarvis-assistant__title-group">
          <h3 className="jarvis-assistant__title">Jarvis 助教</h3>
          <p className="jarvis-assistant__subtitle">智能教学引导</p>
        </div>
      </div>
      
      {/* 指引内容区域 */}
      <div className="jarvis-assistant__content">
        {/* 状态标题 + 主要内容 */}
        <div className="jarvis-assistant__section">
          {/* 状态小圆点 + 标题 */}
          <div className="jarvis-assistant__status">
            <span className="jarvis-assistant__status-dot" />
            <span className="jarvis-assistant__status-text">{currentScript.title}</span>
          </div>
          {/* 内容描述 */}
          <p className="jarvis-assistant__description">
            {currentScript.content}
          </p>
        </div>
        
        {/* 建议行动区域 */}
        <div className="jarvis-assistant__action">
          <div className="jarvis-assistant__action-header">
            <MessageCircle size={12} />
            <span>建议行动</span>
          </div>
          <p className="jarvis-assistant__action-text">
            {currentScript.action}
          </p>
        </div>
      </div>
    </div>
  );
};

export default JarvisAssistant;
