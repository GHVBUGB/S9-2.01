import React, { useEffect, useState } from 'react';
import useClassroomStore from '../../store/useClassroomStore';
import { Volume2, X, Scissors, Lightbulb, Image as ImageIcon, Sprout } from 'lucide-react';
import './WeaponPopup.css';

/**
 * 武器库内嵌面板
 * 
 * 功能：
 * - 教师触发后在内容区下方展开
 * - 内容区向上挤压（动画）
 * - 显示当前单词的详细信息
 * - 根据武器类型展示对应内容
 * 
 * @param {boolean} isTeacher - 是否为教师端（用于调整位置避开工具栏）
 */
const WeaponPopup = ({ isTeacher = false }) => {
  const { weaponPopup, closeWeaponPopup } = useClassroomStore();
  const { isOpen, weaponId, word } = weaponPopup;

  const [isPlaying, setIsPlaying] = useState(false);
  const [voicesReady, setVoicesReady] = useState(false);

  // 预加载语音
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) setVoicesReady(true);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  // 关闭时重置
  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
    }
  }, [isOpen]);

  // 监听单词变化，确保内容更新
  useEffect(() => {
    if (word) {
      setIsPlaying(false);
      // 强制组件重新渲染以显示新单词的内容
    }
  }, [word?.id, word?.word]);

  // 播放发音（优化版本）
  const handlePlayAudio = () => {
    if (!word?.word || isPlaying) return;
    setIsPlaying(true);
    window.speechSynthesis.cancel();
    
    const speak = () => {
      const utterance = new SpeechSynthesisUtterance(word.word);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      const voices = window.speechSynthesis.getVoices();
      const preferredVoices = ['Google US English', 'Microsoft Zira', 'Samantha', 'Alex'];
      for (const voiceName of preferredVoices) {
        const voice = voices.find(v => v.name.includes(voiceName));
        if (voice) {
          utterance.voice = voice;
          break;
        }
      }
      
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    };
    
    if (!voicesReady) {
      setTimeout(speak, 100);
    } else {
      speak();
    }
  };

  // 武器图标
  const weaponIcons = {
    syllables: <Scissors size={18} />,
    mnemonic: <Lightbulb size={18} />,
    image: <ImageIcon size={18} />,
    etymology: <Sprout size={18} />,
  };

  // 武器标题
  const weaponTitles = {
    syllables: '拆音节',
    mnemonic: '读口诀',
    image: '看图片',
    etymology: '讲词根',
  };

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
                  <ImageIcon size={48} />
                  <span>图片加载失败</span>
                </div>
              </div>
            ) : (
              <div className="weapon-popup__image-placeholder">
                <ImageIcon size={48} />
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

  const showPanel = isOpen && word;

  // 内嵌式面板渲染
  return (
    <div className={`weapon-panel ${showPanel ? 'weapon-panel--open' : ''} ${isTeacher ? 'weapon-panel--teacher' : ''}`}>
      {showPanel && (
        <div className="weapon-panel__inner">
          {/* 标题栏 */}
          <div className="weapon-panel__header">
            <div className="weapon-panel__title-group">
              <span className="weapon-panel__icon">{weaponIcons[weaponId]}</span>
              <span className="weapon-panel__title">{weaponTitles[weaponId]}</span>
            </div>
            <button className="weapon-panel__close" onClick={closeWeaponPopup}>
              <X size={18} />
            </button>
          </div>

          {/* 主内容区 - 横向排列 */}
          <div className="weapon-panel__body">
            {/* 左侧：单词信息 */}
            <div className="weapon-panel__word-info">
              <div className="weapon-panel__word-row">
                <span className="weapon-panel__word">{word.word}</span>
                <button 
                  className={`weapon-panel__audio ${isPlaying ? 'weapon-panel__audio--playing' : ''}`}
                  onClick={handlePlayAudio}
                >
                  <Volume2 size={20} />
                </button>
              </div>
              <div className="weapon-panel__meaning">
                <span className="weapon-panel__pos">{word.meaning?.partOfSpeech}</span>
                <span className="weapon-panel__def">{word.meaning?.definitionCn}</span>
              </div>
              {/* 例句 */}
              {word.context?.[0] && (
                <div className="weapon-panel__example">
                  <p className="weapon-panel__example-en">{word.context[0].sentence}</p>
                  <p className="weapon-panel__example-cn">{word.context[0].sentenceCn}</p>
                </div>
              )}
            </div>

            {/* 分隔线 */}
            <div className="weapon-panel__divider"></div>

            {/* 右侧：武器内容 */}
            <div className="weapon-panel__weapon-content">
              {renderContent()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeaponPopup;

