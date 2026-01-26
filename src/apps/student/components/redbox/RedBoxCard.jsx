import React, { useState, useEffect, useRef } from 'react';
import useClassroomStore from '../../../../shared/store/useClassroomStore';
import { Volume2, Mic, CheckCircle2, XCircle } from 'lucide-react';
import './RedBoxCard.css';

/**
 * Red Box 单词卡片组件
 * 极简设计，根据当前步骤显示不同内容
 */
const RedBoxCard = ({ word, step, totalWords, currentIndex }) => {
  const {
    studentState,
    teacherState,
    studentInputText,
    studentSubmitAnswer,
    resetStudentState,
  } = useClassroomStore();

  const [isPlaying, setIsPlaying] = useState(false);
  const [showPhonetic, setShowPhonetic] = useState(false);
  const [showSyllables, setShowSyllables] = useState(false);
  const [showEtymology, setShowEtymology] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attempts, setAttempts] = useState(2);
  const inputRef = useRef(null);

  const inputValue = studentState.inputText || '';
  const submitted = studentState.isSubmitted;
  const isCorrect = studentState.isCorrect;

  // 重置状态（当单词或步骤变化时）
  useEffect(() => {
    setShowPhonetic(false);
    setShowSyllables(false);
    setShowEtymology(false);
    setIsPlaying(false);
    setIsRecording(false);
    setAttempts(2);
    resetStudentState();
  }, [word?.id, step]);

  // 监听教师命令 - 关键：添加 teacherState.command 到依赖数组
  useEffect(() => {
    const cmd = teacherState.command;
    if (!cmd) return;

    console.log('📱 [学生端] 收到教师命令:', cmd);

    switch (cmd) {
      case 'playAudio':
        handlePlayAudio();
        break;
      case 'showPhonetic':
        setShowPhonetic(true);
        break;
      case 'showSyllables':
        setShowSyllables(true);
        break;
      case 'showEtymology':
        setShowEtymology(true);
        break;
      case 'startRecord':
        setIsRecording(true);
        break;
      case 'stopRecord':
        setIsRecording(false);
        break;
      case 'repeat':
        resetStudentState();
        setShowPhonetic(false);
        setShowSyllables(false);
        setShowEtymology(false);
        setAttempts(2);
        inputRef.current?.focus();
        break;
      default:
        break;
    }
  }, [teacherState.command]); // 关键：监听命令变化

  // 监听显示答案
  useEffect(() => {
    if (teacherState.showAnswer && step === 4 && !submitted) {
      studentInputText(word.word);
      studentSubmitAnswer(true);
    }
  }, [teacherState.showAnswer]);

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

  // 处理输入
  const handleInputChange = (e) => {
    if (!submitted) {
      studentInputText(e.target.value);
    }
  };

  // 提交验收
  const handleSubmit = () => {
    if (inputValue.trim() === '') return;
    const correct = inputValue.toLowerCase().trim() === word.word.toLowerCase();
    studentSubmitAnswer(correct);
    if (!correct) {
      setAttempts(prev => prev - 1);
    }
  };

  // 处理回车
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // 渲染音节高亮
  const renderSyllables = () => {
    if (!word?.sound?.syllables) return word?.word;
    const parts = word.sound.syllables.split(' · ');
    return parts.map((part, idx) => (
      <span key={idx} className="redbox-card__syllable">
        {part}
        {idx < parts.length - 1 && <span className="redbox-card__syllable-dot">·</span>}
      </span>
    ));
  };

  // 生成语境挖空句
  const getBlankSentence = () => {
    if (!word?.context?.[0]?.sentence) return '';
    return word.context[0].sentence.replace(
      new RegExp(`\\b${word.word}\\b`, 'gi'),
      '_______'
    );
  };

  if (!word) return null;

  return (
    <div className="redbox-card">
      {/* 进度指示器 */}
      <div className="redbox-card__progress">
        <span className="redbox-card__progress-text">{currentIndex + 1} / {totalWords}</span>
        <div className="redbox-card__progress-dots">
          {[...Array(totalWords)].map((_, i) => (
            <span 
              key={i} 
              className={`redbox-card__dot ${i === currentIndex ? 'redbox-card__dot--active' : ''} ${i < currentIndex ? 'redbox-card__dot--done' : ''}`}
            />
          ))}
        </div>
      </div>

      {/* 主卡片 */}
      <div className={`redbox-card__main redbox-card__main--step${step}`}>
        
        {/* Step 1: 听音 */}
        {step === 1 && (
          <>
            <div className="redbox-card__word-section">
              <span className="redbox-card__word">{word.word}</span>
              <button 
                className={`redbox-card__audio-btn ${isPlaying ? 'redbox-card__audio-btn--playing' : ''}`}
                onClick={handlePlayAudio}
                disabled={isPlaying}
              >
                <Volume2 size={24} />
              </button>
            </div>
            {showPhonetic && (
              <div className="redbox-card__phonetic">{word.sound?.ipa}</div>
            )}
          </>
        )}

        {/* Step 2: 看形 */}
        {step === 2 && (
          <>
            <div className="redbox-card__word-section">
              {showSyllables ? (
                <span className="redbox-card__word redbox-card__word--syllables">
                  {renderSyllables()}
                </span>
              ) : (
                <span className="redbox-card__word">{word.word}</span>
              )}
              <button 
                className={`redbox-card__audio-btn ${isPlaying ? 'redbox-card__audio-btn--playing' : ''}`}
                onClick={handlePlayAudio}
              >
                <Volume2 size={24} />
              </button>
            </div>
            <div className="redbox-card__phonetic">{word.sound?.ipa}</div>
            {showEtymology && word.logic?.etymology && (
              <div className="redbox-card__etymology">
                <p>{word.logic.etymology}</p>
              </div>
            )}
          </>
        )}

        {/* Step 3: 助记 */}
        {step === 3 && (
          <>
            <div className="redbox-card__word-section">
              <span className="redbox-card__word">{word.word}</span>
            </div>
            <div className="redbox-card__mnemonic">
              {teacherState.selectedWeapon === 'compare' && word.logic?.confusables && (
                <div className="redbox-card__mnemonic-content">
                  <h4>📊 形近词对比</h4>
                  <div className="redbox-card__compare-grid">
                    <div className="redbox-card__compare-item redbox-card__compare-item--target">
                      <span>{word.word}</span>
                      <small>{word.meaning?.definitionCn}</small>
                    </div>
                    {word.logic.confusables.map((conf, i) => (
                      <div key={i} className="redbox-card__compare-item">
                        <span>{conf}</span>
                        <small>易混淆</small>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {teacherState.selectedWeapon === 'context' && word.context?.[0] && (
                <div className="redbox-card__mnemonic-content">
                  <h4>📚 语境记忆</h4>
                  <p className="redbox-card__context-sentence">{word.context[0].sentence}</p>
                  <p className="redbox-card__context-cn">{word.context[0].sentenceCn}</p>
                </div>
              )}
              {teacherState.selectedWeapon === 'visual' && word.logic?.mnemonic && (
                <div className="redbox-card__mnemonic-content">
                  <h4>💡 记忆口诀</h4>
                  <p className="redbox-card__mnemonic-text">{word.logic.mnemonic}</p>
                </div>
              )}
              {teacherState.selectedWeapon === 'phonics' && word.sound?.syllables && (
                <div className="redbox-card__mnemonic-content">
                  <h4>🎵 音节拆解</h4>
                  <div className="redbox-card__phonics">
                    {word.sound.syllables.split(' · ').map((s, i) => (
                      <span key={i} className="redbox-card__phonics-part">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {!teacherState.selectedWeapon && (
                <div className="redbox-card__waiting">
                  <p>等待老师选择助记方式...</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Step 4: 验收 */}
        {step === 4 && (
          <>
            <div className="redbox-card__test-section">
              <p className="redbox-card__context-hint">{getBlankSentence()}</p>
              <p className="redbox-card__context-cn">{word.context?.[0]?.sentenceCn}</p>
              <div className="redbox-card__input-wrapper">
                <input
                  ref={inputRef}
                  type="text"
                  className={`redbox-card__input ${
                    submitted ? (isCorrect ? 'redbox-card__input--correct' : 'redbox-card__input--wrong') : ''
                  }`}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="输入单词..."
                  disabled={submitted}
                  autoComplete="off"
                  autoFocus
                />
                {submitted && (
                  <span className="redbox-card__input-icon">
                    {isCorrect ? <CheckCircle2 color="#22c55e" /> : <XCircle color="#ef4444" />}
                  </span>
                )}
              </div>
              {submitted && !isCorrect && (
                <p className="redbox-card__answer">正确答案: <strong>{word.word}</strong></p>
              )}
              {!submitted && (
                <div className="redbox-card__attempts">
                  剩余机会: {'❤️'.repeat(attempts)}{'🖤'.repeat(2 - attempts)}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* 底部操作区 */}
      <div className="redbox-card__footer">
        {step === 1 && (
          <button 
            className={`redbox-card__record-btn ${isRecording ? 'redbox-card__record-btn--recording' : ''}`}
            onClick={() => setIsRecording(!isRecording)}
          >
            <Mic size={28} />
            {isRecording && <span className="redbox-card__record-text">跟读中...</span>}
          </button>
        )}
        
        {step === 3 && teacherState.selectedWeapon && (
          <button className="redbox-card__confirm-btn">
            👍 我记住了
          </button>
        )}
        
        {step === 4 && !submitted && (
          <button 
            className="redbox-card__submit-btn"
            onClick={handleSubmit}
            disabled={!inputValue.trim()}
          >
            提交
          </button>
        )}
        
        {step === 4 && submitted && (
          <div className={`redbox-card__result ${isCorrect ? 'redbox-card__result--success' : 'redbox-card__result--fail'}`}>
            {isCorrect ? '✅ 攻克成功！' : (attempts > 0 ? '❌ 再试一次' : '💔 下次继续')}
          </div>
        )}
      </div>
    </div>
  );
};

export default RedBoxCard;
