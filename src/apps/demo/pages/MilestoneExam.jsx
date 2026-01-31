import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target } from 'lucide-react';
import useWordStore from '../../../shared/store/useWordStore';
import { getWordById } from '../../../shared/data/mockWords';
import SimpleHeader from '../components/SimpleHeader';
import ExamPreview from './MilestoneExam/ExamPreview';
import ExamComplete from './MilestoneExam/ExamComplete';
import './MilestoneExam.css';

const MilestoneExam = () => {
  const navigate = useNavigate();
  
  const { 
    initialized, 
    initializeFromMockData,
    yellowWords,
    promoteToGreen,
    demoteToRed
  } = useWordStore();
  
  const [step, setStep] = useState('preview');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState({ type: null, message: '' });
  const [results, setResults] = useState({ green: 0, red: 0 });
  
  const inputRef = useRef(null);
  
  useEffect(() => {
    if (!initialized) {
      initializeFromMockData();
    }
  }, [initialized, initializeFromMockData]);
  
  useEffect(() => {
    if (initialized && yellowWords.length > 0) {
      const eligibleWords = yellowWords
        .filter(state => state.reviewCount >= 2)
        .slice(0, 10)
        .map(state => getWordById(state.wordId))
        .filter(Boolean);
      setTargetWords(eligibleWords);
    }
  }, [initialized, yellowWords]);
  
  const [targetWords, setTargetWords] = useState([]);
  const currentWord = targetWords[currentIndex];

  useEffect(() => {
    if (step === 'testing' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [step, currentIndex]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || feedback.type) return;

    const userAnswer = inputValue.toLowerCase().trim();
    const correctAnswer = currentWord.word.toLowerCase().trim();
    const isCorrect = userAnswer === correctAnswer;
    
    // 详细调试日志
    console.log('=== 大考答题验证 ===');
    console.log('原始输入值:', inputValue);
    console.log('用户输入（处理后）:', `"${userAnswer}"`);
    console.log('用户输入长度:', userAnswer.length);
    console.log('用户输入字符:', Array.from(userAnswer).join(', '));
    console.log('正确答案:', `"${correctAnswer}"`);
    console.log('正确答案长度:', correctAnswer.length);
    console.log('正确答案字符:', Array.from(correctAnswer).join(', '));
    console.log('是否完全相等:', isCorrect);
    console.log('当前单词对象:', currentWord);
    console.log('当前题号:', currentIndex + 1, '/', targetWords.length);
    
    if (isCorrect) {
      setFeedback({ type: 'success', message: `✅ 答对了，变🟢绿灯` });
      promoteToGreen(currentWord.id);
      setResults(prev => ({ ...prev, green: prev.green + 1 }));
      
      console.log('答对！2秒后跳转...');
      
      // 答对了，2秒后自动下一题
      const timer = setTimeout(() => {
        console.log('执行跳转...');
        setFeedback({ type: null, message: '' });
        setInputValue('');
        if (currentIndex < targetWords.length - 1) {
          setCurrentIndex(prev => prev + 1);
          console.log('跳转到下一题:', currentIndex + 2);
        } else {
          setStep('completed');
          console.log('考试完成！');
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    } else {
      setFeedback({ 
        type: 'error', 
        message: `❌ 答错了，变🔴红灯`,
        correctWord: currentWord.word,
        meaning: currentWord.meaning?.definitionCn || currentWord.meaning?.chinese
      });
      demoteToRed(currentWord.id);
      setResults(prev => ({ ...prev, red: prev.red + 1 }));
      
      console.log('答错！3秒后跳转...');
      
      // 答错了，3秒后自动下一题
      const timer = setTimeout(() => {
        console.log('执行跳转...');
        setFeedback({ type: null, message: '' });
        setInputValue('');
        if (currentIndex < targetWords.length - 1) {
          setCurrentIndex(prev => prev + 1);
          console.log('跳转到下一题:', currentIndex + 2);
        } else {
          setStep('completed');
          console.log('考试完成！');
        }
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  };

  // 预览页面
  if (step === 'preview') {
    return (
      <div className="exam-page preview">
        <SimpleHeader />
        <div className="preview-bg-decoration" />
        <div className="preview-container">
          <ExamPreview 
            wordCount={targetWords.length}
            onStart={() => setStep('testing')}
          />
        </div>
      </div>
    );
  }

  // 完成页面
  if (step === 'completed') {
    return (
      <div className="exam-page completed">
        <SimpleHeader />
        <ExamComplete
          results={results}
          totalWords={targetWords.length}
          onBackHome={() => navigate('/')}
        />
      </div>
    );
  }

  // 考试中
  if (!currentWord) return <div className="exam-page">加载中...</div>;
  
  const sentence = currentWord.context?.[0]?.sentence || currentWord.phrase || '';
  // 转义特殊字符并确保单词边界匹配
  const escapedWord = currentWord.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const wordPattern = new RegExp(`\\b${escapedWord}\\b`, 'gi');
  // 只替换第一个匹配的单词
  const displaySentence = sentence.replace(wordPattern, '____');
  const wordLength = currentWord.word.length;

  return (
    <div className="exam-page testing">
      <SimpleHeader 
        mode="EXAM"
        progress={`${currentIndex + 1} / ${targetWords.length}`}
        showBadges={true}
      />

      <main className="exam-main">
        <div className="exam-sentence">
          <span className="sentence-text sentence" lang="en">
            {displaySentence.includes('____') ? (
              displaySentence.split('____').map((part, i, arr) => (
                <React.Fragment key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span className="blank-dots" aria-hidden="true">
                      {Array.from({ length: wordLength }).map((_, idx) => (
                        <span key={idx} className="dot" />
                      ))}
                    </span>
                  )}
                </React.Fragment>
              ))
            ) : (
              displaySentence
            )}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="exam-form">
          <div className="input-wrapper">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => {
                const val = e.target.value;
                console.log('输入变化:', val);
                setInputValue(val);
              }}
              disabled={!!feedback.type}
              placeholder="输入单词拼写..."
              className="exam-input"
              autoComplete="off"
              spellCheck="false"
              style={{
                '--input-length': inputValue.length || 1
              }}
            />
            <div 
              className="input-line"
              style={{
                '--input-length': inputValue.length || 1
              }}
            ></div>
          </div>
          <div className="exam-feedback-area">
            {feedback.type ? (
              <div className={`exam-feedback ${feedback.type}`}>
                <div className="feedback-message">{feedback.message}</div>
                {feedback.type === 'success' ? (
                  <div className="feedback-detail">恭喜！{currentWord.word} 已永久掌握</div>
                ) : (
                  <div className="feedback-detail-wrong">
                    <div className="correct-answer">{feedback.correctWord || currentWord.word}</div>
                    <div className="word-meaning">({feedback.meaning || currentWord.meaning?.definitionCn || currentWord.meaning?.chinese})</div>
                  </div>
                )}
                <button 
                  onClick={() => {
                    setFeedback({ type: null, message: '' });
                    setInputValue('');
                    if (currentIndex < targetWords.length - 1) {
                      setCurrentIndex(prev => prev + 1);
                    } else {
                      setStep('completed');
                    }
                  }}
                  className="exam-next-btn"
                  style={{ marginTop: '1rem' }}
                >
                  {currentIndex < targetWords.length - 1 ? '下一题' : '查看结果'}
                </button>
              </div>
            ) : (
              inputValue.trim() && (
                <button type="submit" className="exam-submit-btn">
                  确认拼写
                </button>
              )
            )}
          </div>
        </form>
      </main>
    </div>
  );
};

export default MilestoneExam;
