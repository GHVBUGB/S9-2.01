import React, { useState, useEffect, useRef, useMemo } from 'react';
import useClassroomStore from '../../../../shared/store/useClassroomStore';
import { Volume2, CheckCircle2, XCircle, Heart, Layers, Wand2, Lightbulb, Brain } from 'lucide-react';
import './RedBoxCard.css';

/**
 * Red Box 单词卡片组件
 * 
 * 新设计（三步流程）：
 * - Step 1: 定音定形（听音、看形、建立音形对应）
 * - Step 2: 精准助记（教师选择武器：音节/词根/口诀/语境）
 * - Step 3: L4 验收（完整拼写验收）
 * 
 * 支持 readonly 模式（教师端监控学生输入）
 */
const RedBoxCard = ({ word, step, totalWords, currentIndex, readonly = false }) => {
  const {
    studentState,
    teacherState,
    redBoxUI,
    studentInputText,
    studentSubmitAnswer,
    resetStudentState,
    updateWordResult,
  } = useClassroomStore();

  const [isPlaying, setIsPlaying] = useState(false);
  const [attempts, setAttempts] = useState(2);
  const inputRef = useRef(null);

  const inputValue = studentState.inputText || '';
  const submitted = studentState.isSubmitted;
  const isCorrect = studentState.isCorrect;

  // 重置状态（当单词变化时）
  useEffect(() => {
    setAttempts(2);
    setIsPlaying(false);
  }, [word?.id]);

  // 监听教师命令
  useEffect(() => {
    const cmd = teacherState.command;
    if (!cmd) return;

    console.log('📱 [学生端] 收到教师命令:', cmd);

    switch (cmd) {
      case 'playAudio':
        handlePlayAudio();
        break;
      case 'repeat':
        resetStudentState();
        setAttempts(2);
        if (!readonly) {
          inputRef.current?.focus();
        }
        break;
      case 'showAnswer':
        if (!submitted && !readonly) {
          studentInputText(word.word);
          studentSubmitAnswer(true);
          updateWordResult(word.id, 'redbox', true);
        }
        break;
      default:
        break;
    }
  }, [teacherState.command]);

  // 播放发音
  const handlePlayAudio = () => {
    if (!word?.word || isPlaying) return;
    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(word.word);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    utterance.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  // 处理输入（仅学生端）
  const handleInputChange = (e) => {
    if (!submitted && !readonly) {
      studentInputText(e.target.value);
    }
  };

  // 提交验收
  const handleSubmit = () => {
    if (inputValue.trim() === '' || readonly) return;
    const correct = inputValue.toLowerCase().trim() === word.word.toLowerCase();
    studentSubmitAnswer(correct);
    
    if (correct) {
      updateWordResult(word.id, 'redbox', true);
    } else {
      setAttempts(prev => {
        const newAttempts = prev - 1;
        if (newAttempts <= 0) {
          updateWordResult(word.id, 'redbox', false);
        }
        return newAttempts;
      });
    }
  };

  // 处理回车
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !readonly) {
      handleSubmit();
    }
  };

  // 渲染音节高亮
  const renderSyllables = () => {
    if (!word?.sound?.syllables) return word?.word;
    // 支持多种分隔符格式：'·' 或 ' · ' 或 '-'
    const parts = word.sound.syllables.split(/[·\-]/).map(s => s.trim()).filter(Boolean);
    return parts.map((part, idx) => (
      <span key={idx} className="redbox-card__syllable">
        {part}
        {idx < parts.length - 1 && <span className="redbox-card__syllable-dot">·</span>}
      </span>
    ));
  };

  // 生成语境挖空句
  const getBlankSentence = useMemo(() => {
    if (!word?.context?.[0]?.sentence) return '';
    return word.context[0].sentence.replace(
      new RegExp(`\\b${word.word}\\b`, 'gi'),
      '_______'
    );
  }, [word]);

  // 武器图标映射
  const weaponIcons = {
    phonics: <Layers size={20} />,
    context: <Wand2 size={20} />,
    visual: <Lightbulb size={20} />,
    compare: <Brain size={20} />,
  };

  if (!word) return null;

  return (
    <div className={`redbox-card ${readonly ? 'redbox-card--readonly' : ''}`}>
      {/* 顶部进度条 */}
      <div className="redbox-card__header">
        <div className="redbox-card__progress-bar">
          {[...Array(totalWords)].map((_, i) => (
            <div 
              key={i}
              className={`redbox-card__progress-dot ${i === currentIndex ? 'is-active' : ''} ${i < currentIndex ? 'is-done' : ''}`}
            />
          ))}
        </div>
        <div className="redbox-card__progress-text">
          红词 {currentIndex + 1}/{totalWords}
        </div>
      </div>

      {/* 主卡片 */}
      <div className={`redbox-card__main redbox-card__main--step${step}`}>
        
        {/* Step 1: 定音定形 */}
        {step === 1 && (
          <div className="redbox-card__step1">
            <div className="redbox-card__word-display">
              {redBoxUI.showSyllables ? (
                <span className="redbox-card__word redbox-card__word--syllables">
                  {renderSyllables()}
                </span>
              ) : (
                <span className="redbox-card__word">{word.word}</span>
              )}
              <button 
                className={`redbox-card__audio-btn ${isPlaying ? 'is-playing' : ''}`}
                onClick={handlePlayAudio}
                disabled={isPlaying}
              >
                <Volume2 size={24} />
              </button>
            </div>
            
            {redBoxUI.showPhonetic && (
              <div className="redbox-card__phonetic">{word.sound?.ipa}</div>
            )}

            <div className="redbox-card__meaning">
              {word.meaning?.definitionCn}
            </div>

            {!redBoxUI.audioPlayed && !redBoxUI.showSyllables && !redBoxUI.showPhonetic && (
              <div className="redbox-card__hint">
                👆 等待老师操作
              </div>
            )}
          </div>
        )}

        {/* Step 2: 精准助记 */}
        {step === 2 && (
          <div className="redbox-card__step2">
            <div className="redbox-card__word-mini">
              {word.word}
              <button 
                className={`redbox-card__audio-btn-sm ${isPlaying ? 'is-playing' : ''}`}
                onClick={handlePlayAudio}
              >
                <Volume2 size={18} />
              </button>
            </div>

            {redBoxUI.selectedWeapon ? (
              <div className="redbox-card__weapon-content">
                <div className="redbox-card__weapon-header">
                  {weaponIcons[redBoxUI.selectedWeapon]}
                  <span>
                    {redBoxUI.selectedWeapon === 'phonics' && '音节拆解'}
                    {redBoxUI.selectedWeapon === 'context' && '语境记忆'}
                    {redBoxUI.selectedWeapon === 'visual' && '记忆口诀'}
                    {redBoxUI.selectedWeapon === 'compare' && '形近对比'}
                  </span>
                </div>

                {/* 音节拆解 */}
                {redBoxUI.selectedWeapon === 'phonics' && (
                  <div className="redbox-card__phonics">
                    {word.sound?.syllables?.split(/[·\-]/).map(s => s.trim()).filter(Boolean).map((s, i) => (
                      <span key={i} className="redbox-card__phonics-part">{s}</span>
                    ))}
                  </div>
                )}

                {/* 语境记忆 */}
                {redBoxUI.selectedWeapon === 'context' && word.context?.[0] && (
                  <div className="redbox-card__context">
                    <p className="redbox-card__context-en">{word.context[0].sentence}</p>
                    <p className="redbox-card__context-cn">{word.context[0].sentenceCn}</p>
                  </div>
                )}

                {/* 记忆口诀 */}
                {redBoxUI.selectedWeapon === 'visual' && (
                  <div className="redbox-card__mnemonic">
                    <p>{word.logic?.mnemonic || '暂无口诀'}</p>
                  </div>
                )}

                {/* 形近对比 */}
                {redBoxUI.selectedWeapon === 'compare' && (
                  <div className="redbox-card__compare">
                    <div className="redbox-card__compare-item redbox-card__compare-item--target">
                      <span>{word.word}</span>
                      <small>{word.meaning?.definitionCn}</small>
                    </div>
                    {word.logic?.confusables?.map((conf, i) => (
                      <div key={i} className="redbox-card__compare-item">
                        <span>{conf}</span>
                        <small>易混淆</small>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="redbox-card__waiting">
                <div className="redbox-card__waiting-icon">🛠️</div>
                <p>等待老师选择助记武器...</p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: L4 验收 */}
        {step === 3 && (
          <div className="redbox-card__step3">
            {/* 语境提示 */}
            <div className="redbox-card__test-context">
              <p className="redbox-card__test-sentence">{getBlankSentence}</p>
              <p className="redbox-card__test-cn">{word.context?.[0]?.sentenceCn}</p>
            </div>

            {/* 输入区 */}
            <div className="redbox-card__input-section">
              <div className="redbox-card__input-wrapper">
                <input
                  ref={inputRef}
                  type="text"
                  className={`redbox-card__input ${
                    submitted ? (isCorrect ? 'is-correct' : 'is-wrong') : ''
                  }`}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder={readonly ? '监控学生输入...' : '输入完整单词...'}
                  disabled={submitted || readonly}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
                {submitted && (
                  <span className="redbox-card__input-icon">
                    {isCorrect ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                  </span>
                )}
              </div>

              {/* 错误时显示正确答案 */}
              {submitted && !isCorrect && (
                <div className="redbox-card__answer">
                  正确答案：<strong>{word.word}</strong>
                </div>
              )}
            </div>

            {/* 状态信息 */}
            <div className="redbox-card__status">
              <div className="redbox-card__attempts">
                {[...Array(2)].map((_, i) => (
                  <Heart
                    key={i}
                    size={20}
                    className={i < attempts ? 'is-filled' : ''}
                    fill={i < attempts ? '#ef4444' : 'none'}
                    stroke={i < attempts ? '#ef4444' : '#d1d5db'}
                  />
                ))}
              </div>
              
              {!readonly && !submitted && (
                <button 
                  className="redbox-card__submit-btn"
                  onClick={handleSubmit}
                  disabled={!inputValue.trim()}
                >
                  提交验收
                </button>
              )}
            </div>

            {/* 结果反馈 */}
            {submitted && (
              <div className={`redbox-card__feedback ${isCorrect ? 'is-success' : 'is-fail'}`}>
                {isCorrect ? (
                  <>
                    <CheckCircle2 size={24} />
                    <span>🎉 红词攻克成功！</span>
                  </>
                ) : attempts > 0 ? (
                  <>
                    <XCircle size={24} />
                    <span>再试一次，还有 {attempts} 次机会</span>
                  </>
                ) : (
                  <>
                    <XCircle size={24} />
                    <span>💪 下节课继续攻坚</span>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RedBoxCard;
