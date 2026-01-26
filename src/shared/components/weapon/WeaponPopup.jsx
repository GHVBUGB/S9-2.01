import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import useClassroomStore from '../../store/useClassroomStore';
import { Volume2, X, Scissors, Lightbulb, Image, Sprout } from 'lucide-react';
import './WeaponPopup.css';

/**
 * 学生端武器库弹窗卡片
 * 
 * 功能：
 * - 教师触发后弹出
 * - 显示当前单词的详细信息
 * - 根据武器类型展示对应内容
 */
const WeaponPopup = () => {
  const { weaponPopup, closeWeaponPopup } = useClassroomStore();
  const { isOpen, weaponId, word } = weaponPopup;

  const [isPlaying, setIsPlaying] = useState(false);

  // 关闭时重置
  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
    }
  }, [isOpen]);

  // 播放发音
  const handlePlayAudio = () => {
    if (!word?.word) return;
    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(word.word);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    utterance.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  // 武器图标
  const weaponIcons = {
    syllables: <Scissors size={20} />,
    mnemonic: <Lightbulb size={20} />,
    image: <Image size={20} />,
    etymology: <Sprout size={20} />,
  };

  // 武器标题
  const weaponTitles = {
    syllables: '拆音节',
    mnemonic: '读口诀',
    image: '看图片',
    etymology: '讲词根',
  };

  if (!isOpen || !word) return null;

  // 渲染音节内容
  const renderSyllables = () => {
    const syllables = word.core?.syllables;  // 修正：syllables 在 core 下
    if (!syllables) return null;

    const parts = syllables.split('·');  // 修正：分隔符是 · 而不是 ' · '
    return (
      <div className="weapon-popup__syllables">
        {parts.map((part, idx) => (
          <span key={idx} className="weapon-popup__syllable">
            {part}
            {idx < parts.length - 1 && <span className="weapon-popup__syllable-dot">·</span>}
          </span>
        ))}
      </div>
    );
  };

  // 渲染内容
  const renderContent = () => {
    switch (weaponId) {
      case 'syllables':
        return (
          <div className="weapon-popup__content weapon-popup__content--syllables">
            <p className="weapon-popup__label">音节拆解</p>
            {renderSyllables()}
            <p className="weapon-popup__phonetic">{word.sound?.ipa}</p>
            <p className="weapon-popup__tip">
              💡 <strong>记忆技巧：</strong>按音节拆分记忆，每个音节单独发音
            </p>
          </div>
        );

      case 'mnemonic':
        return (
          <div className="weapon-popup__content weapon-popup__content--mnemonic">
            <p className="weapon-popup__label">记忆口诀</p>
            <div className="weapon-popup__mnemonic-box">
              <p className="weapon-popup__mnemonic-text">
                {word.logic?.mnemonic || '暂无口诀'}
              </p>
            </div>
            {word.logic?.confusables && word.logic.confusables.length > 0 && (
              <div className="weapon-popup__confusables">
                <p className="weapon-popup__confusables-label">⚠️ 易混淆词：</p>
                <div className="weapon-popup__confusables-list">
                  {word.logic.confusables.map((w, i) => (
                    <span key={i} className="weapon-popup__confusable">{w}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'image':
        return (
          <div className="weapon-popup__content weapon-popup__content--image">
            <p className="weapon-popup__label">图像记忆</p>
            {word.visual?.imageUrl ? (
              <div className="weapon-popup__image-container">
                <img 
                  src={word.visual.imageUrl} 
                  alt={word.word}
                  className="weapon-popup__image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="weapon-popup__image-placeholder" style={{ display: 'none' }}>
                  <Image size={48} />
                  <span>图片加载失败</span>
                </div>
              </div>
            ) : (
              <div className="weapon-popup__image-placeholder">
                <Image size={48} />
                <span>暂无图片</span>
              </div>
            )}
            {word.visual?.imageDescription && (
              <p className="weapon-popup__image-desc">{word.visual.imageDescription}</p>
            )}
          </div>
        );

      case 'etymology':
        return (
          <div className="weapon-popup__content weapon-popup__content--etymology">
            <p className="weapon-popup__label">词根词源</p>
            <div className="weapon-popup__etymology-box">
              <p className="weapon-popup__etymology-text">
                {word.logic?.etymology || '暂无词源信息'}
              </p>
            </div>
            <p className="weapon-popup__tip">
              🌱 理解词根有助于记忆同族词汇
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  // 使用 Portal 渲染到 body，避免被父容器的 overflow:hidden 裁剪
  return createPortal(
    <div className="weapon-popup-overlay" onClick={closeWeaponPopup}>
      <div className="weapon-popup" onClick={(e) => e.stopPropagation()}>
        {/* 头部 */}
        <div className="weapon-popup__header">
          <div className="weapon-popup__header-left">
            <span className="weapon-popup__weapon-icon">
              {weaponIcons[weaponId]}
            </span>
            <span className="weapon-popup__weapon-title">
              {weaponTitles[weaponId]}
            </span>
          </div>
          <button className="weapon-popup__close" onClick={closeWeaponPopup}>
            <X size={20} />
          </button>
        </div>

        {/* 单词展示 */}
        <div className="weapon-popup__word-section">
          <span className="weapon-popup__word">{word.word}</span>
          <button 
            className={`weapon-popup__audio-btn ${isPlaying ? 'weapon-popup__audio-btn--playing' : ''}`}
            onClick={handlePlayAudio}
            disabled={isPlaying}
          >
            <Volume2 size={24} />
          </button>
        </div>

        {/* 释义 */}
        <div className="weapon-popup__meaning">
          <span className="weapon-popup__pos">{word.meaning?.partOfSpeech}</span>
          <span className="weapon-popup__def">{word.meaning?.definitionCn}</span>
        </div>

        {/* 内容区 */}
        {renderContent()}

        {/* 语境例句 */}
        {word.context?.[0] && (
          <div className="weapon-popup__context">
            <p className="weapon-popup__context-label">📖 例句：</p>
            <p className="weapon-popup__context-en">{word.context[0].sentence}</p>
            <p className="weapon-popup__context-cn">{word.context[0].sentenceCn}</p>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default WeaponPopup;

