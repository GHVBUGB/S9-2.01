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
            <div className="tooltip-pos">{word.core?.partOfSpeech || word.meaning?.partOfSpeech || word.pos || 'v.'}</div>
            <div className="tooltip-meaning">{word.meaning?.chinese || word.meaning?.definitionCn}</div>
            <div className="tooltip-phrase">"{word.context?.[0]?.sentence || word.phrase}"</div>
            <div className="tooltip-arrow"></div>
          </div>
        </div>
      )}
    </span>
  );
};

export default WordTooltip;
