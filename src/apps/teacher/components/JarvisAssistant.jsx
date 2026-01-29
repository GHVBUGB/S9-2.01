import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, MessageCircle } from 'lucide-react';
import './JarvisAssistant.css';

/**
 * Jarvis 助教组件 - 智能教学引导卡片
 * 科技感徽章设计：初始为发光徽章按钮，点击展开完整面板
 * 流式输出：文字逐字打字机效果显示
 * 
 * @param {Object} script - 当前指引脚本 { title, content, action }
 * @param {string} className - 容器className
 */
const JarvisAssistant = ({ script, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // 流式输出状态
  const [displayedContent, setDisplayedContent] = useState('');
  const [displayedAction, setDisplayedAction] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const typingTimerRef = useRef(null);
  const contentIndexRef = useRef(0);
  const actionIndexRef = useRef(0);

  // 默认脚本（当没有传入时）
  const defaultScript = {
    title: '等待中',
    content: '正在加载教学指引...',
    action: '请稍候'
  };

  const currentScript = script || defaultScript;

  // 切换展开/收起
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // 跳过打字动画，直接显示全部内容
  const skipTyping = () => {
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }
    setDisplayedContent(currentScript.content);
    setDisplayedAction(currentScript.action);
    setIsTyping(false);
    contentIndexRef.current = currentScript.content.length;
    actionIndexRef.current = currentScript.action.length;
  };

  // 流式输出效果
  useEffect(() => {
    if (!isExpanded) return;

    // 清除之前的定时器
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }

    // 重置状态
    setDisplayedContent('');
    setDisplayedAction('');
    setIsTyping(true);
    contentIndexRef.current = 0;
    actionIndexRef.current = 0;

    const fullContent = currentScript.content || '';
    const fullAction = currentScript.action || '';

    // 打字机效果函数
    const typeText = () => {
      // 先打印 content
      if (contentIndexRef.current < fullContent.length) {
        setDisplayedContent(fullContent.slice(0, contentIndexRef.current + 1));
        contentIndexRef.current++;
        typingTimerRef.current = setTimeout(typeText, 30); // 30ms/字符
      } 
      // content 完成后打印 action
      else if (actionIndexRef.current < fullAction.length) {
        setDisplayedAction(fullAction.slice(0, actionIndexRef.current + 1));
        actionIndexRef.current++;
        typingTimerRef.current = setTimeout(typeText, 30); // 30ms/字符
      } 
      // 全部完成
      else {
        setIsTyping(false);
      }
    };

    // 延迟 200ms 开始打字（等待展开动画完成）
    const startTimer = setTimeout(() => {
      typeText();
    }, 200);

    return () => {
      clearTimeout(startTimer);
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, [isExpanded, currentScript.content, currentScript.action]);

  // 徽章模式（收起状态）
  if (!isExpanded) {
    return (
      <div className={`jarvis-badge ${className}`} onClick={toggleExpand}>
        {/* 徽章主体 - 圆角矩形 + 内部光照 */}
        <div className="jarvis-badge__body">
          <span className="jarvis-badge__text">JARVIS</span>
        </div>
      </div>
    );
  }

  // 完整面板模式（展开状态）
  return (
    <div 
      className={`jarvis-assistant ${className} jarvis-assistant--expanded`}
      onClick={isTyping ? skipTyping : undefined}
      style={{ cursor: isTyping ? 'pointer' : 'default' }}
      title={isTyping ? '点击跳过动画' : ''}
    >
      {/* 标题区域 - 图标 + 名称 + 关闭按钮 */}
      <div className="jarvis-assistant__header">
        <div className="jarvis-assistant__icon">
          <Sparkles size={14} />
        </div>
        <div className="jarvis-assistant__title-group">
          <h3 className="jarvis-assistant__title">Jarvis 助教</h3>
          <p className="jarvis-assistant__subtitle">智能教学引导</p>
        </div>
        <button 
          className="jarvis-assistant__close"
          onClick={(e) => {
            e.stopPropagation(); // 防止触发跳过动画
            toggleExpand();
          }}
          aria-label="关闭 Jarvis"
        >
          ×
        </button>
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
          {/* 内容描述 - 流式输出 */}
          <p className="jarvis-assistant__description">
            {displayedContent}
            {isTyping && contentIndexRef.current < currentScript.content.length && (
              <span className="jarvis-assistant__cursor">|</span>
            )}
          </p>
        </div>
        
        {/* 建议行动区域 */}
        {displayedAction && (
          <div className="jarvis-assistant__action">
            <div className="jarvis-assistant__action-header">
              <MessageCircle size={12} />
              <span>建议行动</span>
            </div>
            <p className="jarvis-assistant__action-text">
              {displayedAction}
              {isTyping && actionIndexRef.current < currentScript.action.length && (
                <span className="jarvis-assistant__cursor">|</span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JarvisAssistant;
