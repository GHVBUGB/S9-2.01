import React from 'react';
import './ModeSelection.css';

/**
 * AI语境训练模式选择组件
 * 故事精读 vs 完形填空
 */
const ModeSelection = ({ onSelectMode, hasNewStory = true }) => {
  const modes = [
    {
      id: 'mode_a',
      label: '故事精读模式',
      title: 'ModeA:\n剧情式微阅读',
      description: '你刚才背的主角,现在就在剧中',
      actionText: '开启激活',
      className: 'mode-a',
      hasNew: hasNewStory // 是否有新文章
    },
    {
      id: 'mode_b',
      label: '逻辑演练模式',
      title: 'Mode B:\n仿真真题演练',
      description: '你刚才背的单词,就是这道中考常考题型的答案。',
      actionText: '进入测试',
      className: 'mode-b',
      hasNew: false
    }
  ];

  return (
    <div className="mode-grid">
      {modes.map((mode) => (
        <button
          key={mode.id}
          className={`mode-card ${mode.className}`}
          onClick={() => onSelectMode(mode.id)}
        >
          {mode.hasNew && <div className="mode-new-badge">NEW</div>}
          <div className="mode-content">
            <span className="mode-label">{mode.label}</span>
            <h2 className="mode-title">{mode.title}</h2>
            <p className="mode-description">{mode.description}</p>
          </div>
          <div className="mode-action">
            <span className="action-text">{mode.actionText}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ModeSelection;
