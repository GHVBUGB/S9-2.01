import React, { useState } from 'react';
import { Volume2, ChevronDown, ChevronUp } from 'lucide-react';
import Badge from '../../../shared/components/ui/Badge';
import './WordCard.css';

/**
 * 单词卡片组件
 * 实现六维数据的渐进式披露
 * 
 * @param {Object} word - 单词数据对象（包含六维数据）
 * @param {string} status - 单词状态：'red' | 'yellow' | 'green'
 * @param {Function} onInteraction - 交互回调函数
 * @param {boolean} showAudio - 是否显示音频按钮
 * @param {string} className - 自定义样式类
 */
const WordCard = ({ 
  word, 
  status = 'red', 
  onInteraction = () => {}, 
  showAudio = true,
  className = '' 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // 处理展开/收起
  const handleToggleExpand = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    onInteraction({ 
      type: newState ? 'expand' : 'collapse', 
      wordId: word.id,
      timestamp: Date.now()
    });
  };

  // 处理音频播放
  const handlePlayAudio = (e) => {
    e.stopPropagation(); // 防止触发卡片点击
    onInteraction({ 
      type: 'play_audio', 
      wordId: word.id,
      timestamp: Date.now()
    });
    
    // TODO: 后续接入真实音频API
    console.log('🔊 播放音频:', word.sound?.audio_url);
  };

  // 状态文本映射
  const statusTextMap = {
    red: '🔴 待修补',
    yellow: '🟡 复习中',
    green: '🟢 已掌握'
  };

  // 获取第一个例句（默认显示最简单的）
  const primaryContext = word.context?.[0] || {};

  return (
    <div className={`word-card ${className}`} onClick={handleToggleExpand}>
      {/* 状态标识 */}
      <div className="word-card__header">
        <Badge variant={status} size="sm">
          {statusTextMap[status]}
        </Badge>
      </div>

      {/* 配图插画 - 暂时隐藏 */}
      {/* {word.visual?.imageUrl && (
        <div className="word-card__image">
          <img 
            src={word.visual.imageUrl} 
            alt={word.visual.imageAlt || word.word}
          />
        </div>
      )} */}

      {/* 单词核心信息 */}
      <div className="word-card__core">
        <div className="word-card__word">
          {word.word}
        </div>
        
        {/* 音标 - 展开时显示 */}
        {isExpanded && word.sound?.ipa && (
          <div className="word-card__phonetic">
            <span className="word-card__ipa">{word.sound.ipa}</span>
            {showAudio && (
              <button 
                className="word-card__audio-btn"
                onClick={handlePlayAudio}
                aria-label="播放发音"
              >
                <Volume2 size={20} />
              </button>
            )}
          </div>
        )}

        {/* 词性 + 翻译 */}
        <div className="word-card__translation">
          {word.meaning?.partOfSpeech} {word.meaning?.definitionCn}
        </div>
      </div>

      {/* 语境例句 - 始终显示 */}
      <div className="word-card__context">
        <div className="word-card__context-title">📖 语境例句</div>
        <p className="word-card__context-cn">{primaryContext.sentenceCn}</p>
        <p className="word-card__context-en">{primaryContext.sentence}</p>
      </div>

      {/* 助记和词源 - 展开时显示 */}
      {isExpanded && (
        <div className="word-card__extended">
          {/* 助记技巧 */}
          {word.logic?.mnemonic && (
            <div className="word-card__section">
              <div className="word-card__section-title">💡 助记技巧</div>
              <p className="word-card__section-content">{word.logic.mnemonic}</p>
            </div>
          )}

          {/* 词源故事 */}
          {word.logic?.etymology && (
            <div className="word-card__section">
              <div className="word-card__section-title">📚 词源故事</div>
              <p className="word-card__section-content">{word.logic.etymology}</p>
            </div>
          )}

          {/* 词根拆解 */}
          {word.logic?.breakdown && (
            <div className="word-card__section">
              <div className="word-card__section-title">🔍 词根拆解</div>
              <p className="word-card__section-content">{word.logic.breakdown}</p>
            </div>
          )}
        </div>
      )}

      {/* 展开/收起按钮 */}
      <div className="word-card__toggle">
        {isExpanded ? (
          <>
            <span>收起</span>
            <ChevronUp size={16} />
          </>
        ) : (
          <>
            <span>点击查看音标和助记</span>
            <ChevronDown size={16} />
          </>
        )}
      </div>
    </div>
  );
};

export default WordCard;

