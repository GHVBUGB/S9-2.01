import React, { useState } from 'react';
import './WordTooltip.css';

/**
 * 单词提示浮层组件
 * 鼠标悬停显示单词释义和例句
 */
const WordTooltip = ({ word, children }) => {
  const [show, setShow] = useState(false);

  return (
    <span 
      className="word-tooltip-wrapper"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className={`word-tooltip-trigger ${show ? 'active' : ''}`}>
        {children}
      </span>
      {show && (
        <div className="word-tooltip-content">
          <div className="tooltip-inner">
            <div className="tooltip-pos">{word.pos || 'v.'}</div>
            <div className="tooltip-meaning">{word.meaning?.definitionCn || word.meaning?.chinese}</div>
            <div className="tooltip-phrase">"{word.phrase || word.context?.[0]?.sentence}"</div>
            <div className="tooltip-arrow"></div>
          </div>
        </div>
      )}
    </span>
  );
};

export default WordTooltip;
