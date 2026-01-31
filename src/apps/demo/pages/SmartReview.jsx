import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Volume2 } from 'lucide-react';
import useWordStore from '../../../shared/store/useWordStore';
import { getWordById } from '../../../shared/data/mockWords';
import SimpleHeader from '../components/SimpleHeader';
import './SmartReview.css';

const ConfettiCelebration = () => {
  const colors = ['#34d399', '#60a5fa', '#fbbf24', '#f472b6', '#818cf8'];
  return (
    <div className="confetti-container">
      <div className="confetti-glow" />
      {[...Array(20)].map((_, i) => {
        const color = colors[i % colors.length];
        const angle = (Math.random() * 360) * (Math.PI / 180);
        const velocity = 100 + Math.random() * 150;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        const rotate = Math.random() * 720;
        return (
          <div
            key={i}
            className="confetti-piece"
            style={{
              backgroundColor: color,
              animation: `confetti-fall-${i} 1.2s cubic-bezier(0.2, 0.8, 0.3, 1) forwards`,
              '--tx': `${tx}px`,
              '--ty': `${ty}px`,
              '--rotate': `${rotate}deg`
            }}
          />
        );
      })}
    </div>
  );
};

const SmartReview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 接收路由参数，设置默认值
  const { track = 'standard', level = 'L4' } = location.state || {};
  
  const { 
    initialized, 
    initializeFromMockData,
    yellowWords
  } = useWordStore();
  
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionAppearance, setSessionAppearance] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState({ type: 'none', message: '' });
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const inputRef = useRef(null);
  
  useEffect(() => {
    if (!initialized) {
      initializeFromMockData();
    }
  }, [initialized, initializeFromMockData]);
  
  useEffect(() => {
    if (initialized && yellowWords.length > 0) {
      const words = yellowWords.slice(0, 3).map(state => getWordById(state.wordId)).filter(Boolean);
      setQueue(words);
    }
  }, [initialized, yellowWords]);
  
  const currentWord = queue[currentIndex];
  const appearanceCount = currentWord ? (sessionAppearance[currentWord.id] || 0) : 0;
  
  // 根据车道和出现次数决定题型
  const getCurrentLevel = () => {
    if (appearanceCount > 0) {
      // 第二次出现降级为 L4
      return 'L4';
    }
    // 首次出现使用车道指定的等级
    return level;
  };
  
  const currentLevel = getCurrentLevel();

  useEffect(() => {
    if (currentWord) {
      focusInput();
      playAudio(currentWord.word);
    }
  }, [currentIndex, currentWord]);

  const focusInput = () => inputRef.current?.focus();

  const playAudio = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;
    
    const isCorrect = inputValue.toLowerCase().trim() === currentWord.word.toLowerCase();
    
    if (isCorrect) {
      setFeedback({ type: 'success', message: 'Perfect' });
      playAudio(currentWord.word);
      setTimeout(() => handleNext(true), 2500);
    } else {
      const nextAttempt = attempts + 1;
      setAttempts(nextAttempt);
      if (nextAttempt === 1) {
        setFeedback({ type: 'warning', message: '拼写有误，请再试' });
        setInputValue('');
        focusInput();
      } else if (nextAttempt === 2) {
        setFeedback({ type: 'hint', message: '已激活拼写引导' });
        setInputValue('');
        focusInput();
      } else {
        setFeedback({ type: 'wrong', message: '记忆失效' });
      }
    }
  };

  const handleNext = (isSuccess) => {
    // 测试模式：不重新加入队列，答错也继续下一题
    // if (!isSuccess) {
    //   const wordId = currentWord.id;
    //   setSessionAppearance(prev => ({ ...prev, [wordId]: (prev[wordId] || 0) + 1 }));
    //   setQueue(prev => [...prev, currentWord]);
    // }
    if (currentIndex < 2) { // 只有3题，索引0,1,2
      setCurrentIndex(prev => prev + 1);
      setInputValue('');
      setAttempts(0);
      setFeedback({ type: 'none', message: '' });
    } else {
      setIsCompleted(true);
    }
  };

  const renderWordInputs = () => {
    if (!currentWord) return null;
    const wordLength = currentWord.word.length;
    const chars = inputValue.split('');
    const slots = [];
    
    for (let i = 0; i < wordLength; i++) {
      const char = chars[i] || '';
      const isActive = i === chars.length && feedback.type !== 'success' && feedback.type !== 'wrong';
      const isFilled = i < chars.length;
      let hintChar = attempts >= 2 && !isFilled && (i === 0 || i === wordLength - 1) ? currentWord.word[i].toLowerCase() : '';
      
      slots.push(
        <div key={i} className={`word-slot ${isActive ? 'active' : ''} ${isFilled ? 'filled' : ''}`}>
          <span className={`slot-char ${isFilled ? 'filled' : hintChar ? 'hint' : ''}`}>
            {isFilled ? char.toLowerCase() : hintChar}
          </span>
          {isActive && <div className="slot-indicator"></div>}
        </div>
      );
    }
    return slots;
  };

  if (isCompleted || !currentWord) {
    return (
      <div className="review-page completed">
        <div className="completion-card">
          <div className="completion-badge">
            <CheckCircle className="completion-icon" />
          </div>
          <h2 className="completion-title">PHASE COMPLETE</h2>
          <button onClick={() => navigate('/')} className="completion-button">
            返回矩阵中心
          </button>
        </div>
      </div>
    );
  }

  // L4模式使用短语，L5模式使用长句子
  const sentence = currentLevel === 'L4' 
    ? (currentWord.context?.[0]?.phrase || currentWord.phrase || currentWord.context?.[0]?.sentence || '')
    : (currentWord.context?.[0]?.sentence || currentWord.phrase || '');
  
  // 确保正确替换单词，使用单词边界匹配
  const wordPattern = new RegExp(`\\b${currentWord.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
  const displaySentence = sentence.replace(wordPattern, '____');

  return (
    <div className={`review-page ${feedback.type === 'success' ? 'success-bg' : ''}`}>
      <SimpleHeader 
        mode={currentLevel}
        progress={`${currentIndex + 1} / ${queue.length}`}
        track={track}
        showBadges={true}
      />

      <main className="review-main">
        <div className={`sentence-display ${feedback.type === 'success' ? 'faded' : ''}`}>
          <div className="sentence-text sentence" lang="en">
            {displaySentence.includes('____') ? (
              displaySentence.split('____').map((part, i, arr) => (
                <React.Fragment key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span className="blank-dots" aria-hidden="true">
                      {Array.from({ length: currentWord.word.length }).map((_, idx) => (
                        <span key={idx} className="dot" />
                      ))}
                    </span>
                  )}
                </React.Fragment>
              ))
            ) : (
              displaySentence
            )}
          </div>
          <div className="word-meaning-row">
            <div className="meaning-card">
              {currentWord.core?.partOfSpeech && (
                <span className="meaning-card__pos">{currentWord.core.partOfSpeech}</span>
              )}
              <span className="meaning-card__text">{currentWord.meaning?.definitionCn || currentWord.meaning?.chinese}</span>
            </div>
            <button 
              onClick={() => playAudio(currentWord.word)} 
              className={`audio-button ${isPlaying ? 'playing' : ''}`}
              aria-label="Play audio"
              type="button"
            >
              <Volume2 className={`audio-icon ${isPlaying ? 'pulse' : ''}`} />
            </button>
          </div>
        </div>

        <div className="input-area">
          <form onSubmit={handleSubmit} className="input-form">
            <input 
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => {
                const val = e.target.value.replace(/[^a-zA-Z]/g, '').toLowerCase();
                if (val.length <= currentWord.word.length) setInputValue(val);
              }}
              autoFocus
              className="hidden-input"
              disabled={feedback.type === 'success' || feedback.type === 'wrong'}
            />
            <div onClick={focusInput} className="word-slots">
              {renderWordInputs()}
            </div>
            {(feedback.type === 'none' || feedback.type === 'hint' || feedback.type === 'warning') && 
             inputValue.length === currentWord.word.length && (
              <button type="submit" className="submit-button">
                确认拼写
              </button>
            )}
          </form>
          
          <div className="feedback-area">
            {feedback.type === 'warning' && (
              <div className="feedback-message warning">
                <span className="feedback-icon">⚠️</span>
                <span className="feedback-text">{feedback.message}</span>
              </div>
            )}
            {feedback.type === 'wrong' && (
              <div className="feedback-wrong">
                <div className="wrong-answer">{currentWord.word}</div>
                <button onClick={() => handleNext(false)} className="next-button">
                  <span>移入强化矩阵 · 下一题</span>
                  <ArrowLeft className="next-icon" />
                </button>
              </div>
            )}
            {feedback.type === 'success' && (
              <div className="feedback-success">
                <ConfettiCelebration />
                <div className="success-word">{currentWord.word}</div>
                <span className="success-label">Matrix Synced</span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SmartReview;
