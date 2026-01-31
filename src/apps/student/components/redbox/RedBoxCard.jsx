<<<<<<< HEAD
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
    if (inputValue.trim() === '' || readonly || submitted) return;

    const userInput = inputValue.toLowerCase().trim();
    const expectedWord = word.word.toLowerCase();
    const correct = userInput === expectedWord;

    console.log('🎯 [RedBox验收] 提交:', {
      userInput,
      expectedWord,
      isCorrect: correct,
      attemptsLeft: attempts
    });

    if (correct) {
      // 拼对 → 攻克成功
      studentSubmitAnswer(true);
      updateWordResult(word.id, 'redbox', true);
    } else {
      // 拼错 → 减少生命值
      const newAttempts = attempts - 1;
      setAttempts(newAttempts);
      
      if (newAttempts <= 0) {
        // 生命值用完 → 失败
        studentSubmitAnswer(false);
        updateWordResult(word.id, 'redbox', false);
      } else {
        // 还有生命值 → 再试一次
        studentSubmitAnswer(false);
        setTimeout(() => {
          resetStudentState();
          setTimeout(() => {
            inputRef.current?.focus();
          }, 100);
        }, 800);
      }
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

  // 生成语境挖空句（拆分为前后两部分，用于内嵌输入框）
  const getBlankPhrase = useMemo(() => {
    const sentence = word?.context?.[0]?.sentence || '';
    const targetWord = word.word;

    if (!targetWord) return { before: sentence, after: '' };

    const regex = new RegExp(`\\b${targetWord}\\b`, 'i');
    const match = sentence.match(regex);

    if (match) {
      const index = match.index;
      const before = sentence.slice(0, index);
      const after = sentence.slice(index + targetWord.length);
      return { before, after };
    }

    return { before: sentence, after: '' };
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
      {/* 顶部进度药丸 - 统一格式 */}
      <div className="redbox-card__progress-wrapper">
        <div className="redbox-card__progress-pill">
          单词进度: {currentIndex + 1} / {totalWords}
        </div>
      </div>

      {/* 主卡片 */}
      <div className={`redbox-card__main redbox-card__main--step${step}`}>
        
        {/* Step 1: 定音定形 */}
        {step === 1 && (
          <div className="redbox-card__step1">
            {/* 音频按钮 - 单独在上方 */}
            <button 
              className={`redbox-card__audio-btn ${isPlaying ? 'is-playing' : ''}`}
              onClick={handlePlayAudio}
              disabled={isPlaying}
            >
              <Volume2 size={24} />
            </button>

            {/* 单词显示 */}
            <div className="redbox-card__word-display">
              {redBoxUI.showSyllables ? (
                <span className="redbox-card__word redbox-card__word--syllables">
                  {renderSyllables()}
                </span>
              ) : (
                <span className="redbox-card__word">{word.word}</span>
              )}
            </div>
            
            {redBoxUI.showPhonetic && (
              <div className="redbox-card__phonetic">{word.sound?.ipa}</div>
            )}

            <div className="redbox-card__meaning">
              {word.meaning?.partOfSpeech && (
                <span className="redbox-card__pos">{word.meaning.partOfSpeech}</span>
              )}
              {word.meaning?.definitionCn}
            </div>

            {!redBoxUI.audioPlayed && !redBoxUI.showSyllables && !redBoxUI.showPhonetic && (
              <div className="redbox-card__hint">
                等待老师操作
              </div>
            )}
          </div>
        )}

        {/* Step 2: 精准助记 */}
        {step === 2 && (
          <div className="redbox-card__step2">
            {/* 音频按钮 - 单独在上方 */}
            <button 
              className={`redbox-card__audio-btn-sm ${isPlaying ? 'is-playing' : ''}`}
              onClick={handlePlayAudio}
            >
              <Volume2 size={20} />
            </button>

            {/* 单词显示 */}
            <div className="redbox-card__word-mini">
              {word.word}
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
                <p>等待老师选择助记武器...</p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: L4 验收 - 内嵌输入框设计 */}
        {step === 3 && (
          <div className="redbox-card__step3">
            {/* 挖空例句 - 内嵌输入框 */}
            <div className="redbox-card__test-phrase">
              <span className="redbox-card__test-phrase-text">
                {getBlankPhrase.before}
              </span>
              <input
                ref={inputRef}
                type="text"
                className={`redbox-card__inline-input ${
                  submitted ? (isCorrect ? 'is-correct' : 'is-wrong') : ''
                } ${readonly ? 'is-readonly' : ''}`}
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder=""
                disabled={submitted || readonly}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck="false"
                size={Math.max(word.word?.length || 8, 8)}
              />
              <span className="redbox-card__test-phrase-text">
                {getBlankPhrase.after}
              </span>
            </div>

            {/* 中文翻译 */}
            <div className="redbox-card__test-cn">
              {word.context?.[0]?.sentenceCn}
            </div>

            {/* 错误时显示正确答案 */}
            {submitted && !isCorrect && (
              <div className="redbox-card__answer">
                正确答案：<strong>{word.word}</strong>
              </div>
            )}

            {/* 生命值 - 显示已用次数 */}
            <div className="redbox-card__attempts">
              {[...Array(2)].map((_, i) => (
                <Heart
                  key={i}
                  size={20}
                  className={i < (2 - attempts) ? 'is-filled' : ''}
                  fill={i < (2 - attempts) ? '#ef4444' : 'none'}
                  stroke={i < (2 - attempts) ? '#ef4444' : '#d1d5db'}
                />
              ))}
            </div>

            {/* 结果反馈 */}
            {submitted && (
              <div className={`redbox-card__feedback ${isCorrect ? 'is-success' : 'is-fail'}`}>
                {isCorrect ? (
                  <>
                    <CheckCircle2 size={24} />
                    <span>攻克成功！</span>
                  </>
                ) : attempts > 0 ? (
                  <>
                    <XCircle size={24} />
                    <span>再试一次，还有 {attempts} 次机会</span>
                  </>
                ) : (
                  <>
                    <XCircle size={24} />
                    <span>下节课继续攻坚</span>
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
=======
import React, { useState, useEffect, useRef, useMemo } from 'react';
import useClassroomStore from '../../../../shared/store/useClassroomStore';
import { Volume2, CheckCircle2, XCircle, Heart, Layers, Wand2, Lightbulb, Brain, Image } from 'lucide-react';
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
  const [voicesReady, setVoicesReady] = useState(false);
  const inputRef = useRef(null);

  const inputValue = studentState.inputText || '';
  const submitted = studentState.isSubmitted;
  const isCorrect = studentState.isCorrect;
  
  // 预加载语音列表
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) setVoicesReady(true);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

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

  // 处理输入（仅学生端）
  const handleInputChange = (e) => {
    if (!submitted && !readonly) {
      studentInputText(e.target.value);
    }
  };

  // 提交验收
  const handleSubmit = () => {
    if (inputValue.trim() === '' || readonly || submitted) return;

    const userInput = inputValue.toLowerCase().trim();
    const expectedWord = word.word.toLowerCase();
    const correct = userInput === expectedWord;

    console.log('🎯 [RedBox验收] 提交:', {
      userInput,
      expectedWord,
      isCorrect: correct,
      attemptsLeft: attempts
    });

    if (correct) {
      // 拼对 → 攻克成功
      studentSubmitAnswer(true);
      updateWordResult(word.id, 'redbox', true);
    } else {
      // 拼错 → 减少生命值
      const newAttempts = attempts - 1;
      setAttempts(newAttempts);
      
      if (newAttempts <= 0) {
        // 生命值用完 → 失败
        studentSubmitAnswer(false);
        updateWordResult(word.id, 'redbox', false);
      } else {
        // 还有生命值 → 再试一次
        studentSubmitAnswer(false);
        setTimeout(() => {
          resetStudentState();
          setTimeout(() => {
            inputRef.current?.focus();
          }, 100);
        }, 800);
      }
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

  // 生成语境挖空句（拆分为前后两部分，用于内嵌输入框）
  const getBlankPhrase = useMemo(() => {
    const sentence = word?.context?.[0]?.sentence || '';
    const targetWord = word.word;

    if (!targetWord) return { before: sentence, after: '' };

    const regex = new RegExp(`\\b${targetWord}\\b`, 'i');
    const match = sentence.match(regex);

    if (match) {
      const index = match.index;
      const before = sentence.slice(0, index);
      const after = sentence.slice(index + targetWord.length);
      return { before, after };
    }

    return { before: sentence, after: '' };
  }, [word]);

  // 武器图标映射
  const weaponIcons = {
    phonics: <Layers size={20} />,
    context: <Wand2 size={20} />,
    visual: <Lightbulb size={20} />,
    compare: <Brain size={20} />,
    image: <Image size={20} />,
  };

  if (!word) return null;

  return (
    <div className={`redbox-card ${readonly ? 'redbox-card--readonly' : ''}`}>
      {/* 顶部进度药丸 - 统一格式 */}
      <div className="redbox-card__progress-wrapper">
        <div className="redbox-card__progress-pill">
          单词进度: {currentIndex + 1} / {totalWords}
        </div>
      </div>

      {/* 主卡片 */}
      <div className={`redbox-card__main redbox-card__main--step${step}`}>
        
        {/* Step 1: 定音定形 */}
        {step === 1 && (
          <div className="redbox-card__step1">
            {/* 音频按钮 - 单独在上方 */}
            <button 
              className={`redbox-card__audio-btn ${isPlaying ? 'is-playing' : ''}`}
              onClick={handlePlayAudio}
              disabled={isPlaying}
            >
              <Volume2 size={24} />
            </button>

            {/* 单词显示 */}
            <div className="redbox-card__word-display">
              {redBoxUI.showSyllables ? (
                <span className="redbox-card__word redbox-card__word--syllables">
                  {renderSyllables()}
                </span>
              ) : (
                <span className="redbox-card__word">{word.word}</span>
              )}
            </div>
            
            {redBoxUI.showPhonetic && (
              <div className="redbox-card__phonetic">{word.sound?.ipa}</div>
            )}

            <div className="redbox-card__meaning">
              {word.meaning?.partOfSpeech && (
                <span className="redbox-card__pos">{word.meaning.partOfSpeech}</span>
              )}
              {word.meaning?.definitionCn}
            </div>

            {!redBoxUI.audioPlayed && !redBoxUI.showSyllables && !redBoxUI.showPhonetic && (
              <div className="redbox-card__hint">
                等待老师操作
              </div>
            )}
          </div>
        )}

        {/* Step 2: 精准助记 */}
        {step === 2 && (
          <div className="redbox-card__step2">
            {/* 音频按钮 - 单独在上方 */}
            <button 
              className={`redbox-card__audio-btn-sm ${isPlaying ? 'is-playing' : ''}`}
              onClick={handlePlayAudio}
            >
              <Volume2 size={20} />
            </button>

            {/* 单词显示 */}
            <div className="redbox-card__word-mini">
              {word.word}
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
                    {redBoxUI.selectedWeapon === 'image' && '图片助记'}
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

                {/* 图片助记 */}
                {redBoxUI.selectedWeapon === 'image' && (
                  word.visual?.imageUrl ? (
                    <div className="redbox-card__image-display">
                      <img 
                        src={word.visual.imageUrl} 
                        alt={word.visual.imageDescription || word.word}
                        className="redbox-card__image"
                      />
                      {word.visual.imageDescription && (
                        <p className="redbox-card__image-desc">{word.visual.imageDescription}</p>
                      )}
                    </div>
                  ) : (
                    <div className="redbox-card__image-placeholder">
                      <Image size={48} strokeWidth={1.5} />
                      <p>暂未上传</p>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="redbox-card__waiting">
                <p>等待老师选择助记武器...</p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: L4 验收 - 内嵌输入框设计 */}
        {step === 3 && (
          <div className="redbox-card__step3">
            {/* 挖空例句 - 内嵌输入框 */}
            <div className="redbox-card__test-phrase">
              <span className="redbox-card__test-phrase-text">
                {getBlankPhrase.before}
              </span>
              
              {/* 答对时显示波浪动画字母 */}
              {submitted && isCorrect ? (
                <span className="redbox-card__wave-letters">
                  {word.word.split('').map((letter, index) => (
                    <span 
                      key={index} 
                      className="redbox-card__wave-letter"
                      style={{ animationDelay: `${index * 0.06}s` }}
                    >
                      {letter}
                    </span>
                  ))}
                </span>
              ) : (
                <input
                  ref={inputRef}
                  type="text"
                  className={`redbox-card__inline-input ${
                    submitted ? (isCorrect ? 'is-correct' : 'is-wrong') : ''
                  } ${readonly ? 'is-readonly' : ''}`}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder=""
                  disabled={submitted || readonly}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  size={Math.max(word.word?.length || 8, 8)}
                />
              )}
              
              <span className="redbox-card__test-phrase-text">
                {getBlankPhrase.after}
              </span>
            </div>

            {/* 中文翻译 */}
            <div className="redbox-card__test-cn">
              {word.context?.[0]?.sentenceCn}
            </div>

            {/* 错误时显示正确答案 */}
            {submitted && !isCorrect && (
              <div className="redbox-card__answer">
                正确答案：<strong>{word.word}</strong>
              </div>
            )}

            {/* 生命值 - 显示已用次数 */}
            <div className="redbox-card__attempts">
              {[...Array(2)].map((_, i) => (
                <Heart
                  key={i}
                  size={20}
                  className={i < (2 - attempts) ? 'is-filled' : ''}
                  fill={i < (2 - attempts) ? '#ef4444' : 'none'}
                  stroke={i < (2 - attempts) ? '#ef4444' : '#d1d5db'}
                />
              ))}
            </div>

            {/* 结果反馈 */}
            {submitted && (
              <div className={`redbox-card__feedback ${isCorrect ? 'is-success' : 'is-fail'}`}>
                {isCorrect ? (
                  <>
                    <CheckCircle2 size={24} />
                    <span>攻克成功！</span>
                  </>
                ) : attempts > 0 ? (
                  <>
                    <XCircle size={24} />
                    <span>再试一次，还有 {attempts} 次机会</span>
                  </>
                ) : (
                  <>
                    <XCircle size={24} />
                    <span>下节课继续攻坚</span>
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
>>>>>>> origin/feature/phase1-3-updates
