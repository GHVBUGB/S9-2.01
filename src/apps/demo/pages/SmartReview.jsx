import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/ui/Button';
import Badge from '../../../shared/components/ui/Badge';
import { ArrowLeft, RotateCcw, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import useWordStore from '../../../shared/store/useWordStore';
import { getWordById } from '../../../shared/data/mockWords';
import './SmartReview.css';

const SmartReview = () => {
  const navigate = useNavigate();
  
  const { 
    initialized, 
    initializeFromMockData,
    yellowWords, 
    reviewSuccess,
    reviewSuccessWithReset,
    reviewFailToRed
  } = useWordStore();
  
  const [reviewState, setReviewState] = useState('preview');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewWords, setReviewWords] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [errorLevel, setErrorLevel] = useState(0);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [stats, setStats] = useState({ total: 0, passed: 0, reset: 0, failed: 0 });
  const [completedCount, setCompletedCount] = useState(0);
  
  useEffect(() => {
    if (!initialized) {
      initializeFromMockData();
    }
  }, [initialized, initializeFromMockData]);
  
  useEffect(() => {
    if (initialized && yellowWords.length > 0) {
      const words = yellowWords.slice(0, 10).map(state => ({
        wordId: state.wordId,
        reviewCount: state.reviewCount,
        track: state.reviewCount === 0 ? 'fast' : 'standard'
      }));
      setReviewWords(words);
      setStats({ ...stats, total: words.length });
    }
  }, [initialized, yellowWords]);
  
  const currentWord = reviewWords[currentIndex] ? getWordById(reviewWords[currentIndex].wordId) : null;
  
  const generateBlankSentence = (sentence, word) => {
    if (!sentence || !word) return '';
    return sentence.replace(new RegExp(`\\b${word}\\b`, 'gi'), '___________');
  };
  
  const renderSkeleton = (word) => {
    if (!word) return null;
    const chars = word.split('');
    return (
      <div className="skeleton-hint">
        {chars.map((char, i) => (
          <span key={i} className={i === 0 || i === chars.length - 1 || i % 2 === 0 ? 'shown' : 'hidden'}>
            {i === 0 || i === chars.length - 1 || i % 2 === 0 ? char : '_'}
          </span>
        ))}
      </div>
    );
  };
  
  const handleSubmit = () => {
    if (!userInput.trim() || !currentWord) return;
    
    const isCorrect = userInput.trim().toLowerCase() === currentWord.word.toLowerCase();
    
    if (isCorrect) {
      if (errorLevel === 0) {
        setFeedback({ type: 'perfect', message: '✓ 正确！完美保黄' });
        reviewSuccess(currentWord.id);
        setStats({ ...stats, passed: stats.passed + 1 });
      } else if (errorLevel === 2) {
        setFeedback({ type: 'reset', message: '✓ 正确，勉强保黄（复习周期重置为 Day 1）' });
        reviewSuccessWithReset(currentWord.id);
        setStats({ ...stats, reset: stats.reset + 1 });
      }
      setCompletedCount(completedCount + 1);
      setTimeout(() => moveToNext(), 2000);
    } else {
      if (errorLevel === 0) {
        setErrorLevel(1);
        setFeedback({ type: 'level1', message: '可能点错了，再试一次～（不判错）' });
        setUserInput('');
      } else if (errorLevel === 1) {
        setErrorLevel(2);
        setShowSkeleton(true);
        setFeedback({ type: 'level2', message: '看看骨架提示，能想起来吗？' });
        setUserInput('');
      } else if (errorLevel === 2) {
        setErrorLevel(3);
        setFeedback({ type: 'level3', message: '❌ 熔断锁定 - 变红灯，需要老师修复' });
        reviewFailToRed(currentWord.id, []);
        setStats({ ...stats, failed: stats.failed + 1 });
        setCompletedCount(completedCount + 1);
      }
    }
  };
  
  const moveToNext = () => {
    if (currentIndex < reviewWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
      resetWordState();
    } else {
      setReviewState('completed');
    }
  };
  
  const resetWordState = () => {
    setUserInput('');
    setErrorLevel(0);
    setShowSkeleton(false);
    setFeedback(null);
  };
  
  // 预览界面
  if (reviewState === 'preview') {
    if (!initialized || reviewWords.length === 0) {
      return (
        <div className="smart-review-page">
          <div className="review-header">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft size={20} />
              返回首页
            </Button>
            <div className="header-title">
              <div className="title-icon">
                <RotateCcw size={24} />
              </div>
              <div>
                <h1>智能复习与容错</h1>
                <Badge variant="blue">Phase 4</Badge>
              </div>
            </div>
          </div>
          
          <div className="review-content">
            <h2 className="section-title">今日计划</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <p className="stat-label">已复习</p>
                <div className="stat-value">
                  <span className="current">0</span>
                  <span className="divider">/</span>
                  <span className="total">0</span>
                </div>
                <Button size="lg" onClick={() => navigate('/')}>返回首页</Button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="smart-review-page">
        <div className="review-header">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            返回首页
          </Button>
          <div className="header-title">
            <div className="title-icon">
              <RotateCcw size={24} />
            </div>
            <div>
              <h1>智能复习与容错</h1>
              <Badge variant="blue">Phase 4</Badge>
            </div>
          </div>
        </div>
        
        <div className="review-content">
          <h2 className="section-title">今日计划</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <p className="stat-label">已复习</p>
              <div className="stat-value">
                <span className="current">0</span>
                <span className="divider">/</span>
                <span className="total">{reviewWords.length}</span>
              </div>
              <Button size="lg" className="action-btn" onClick={() => setReviewState('reviewing')}>
                复习
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // 复习中
  if (reviewState === 'reviewing') {
    if (!currentWord) return <div className="smart-review-page">加载中...</div>;
    
    return (
      <div className="smart-review-page">
        <div className="review-header">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            返回首页
          </Button>
          <div className="header-title">
            <div className="title-icon">
              <RotateCcw size={24} />
            </div>
            <div>
              <h1>智能复习与容错</h1>
              <Badge variant="blue">Phase 4</Badge>
            </div>
          </div>
        </div>
        
        <div className="review-content">
          <h2 className="section-title">今日计划</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <p className="stat-label">已复习</p>
              <div className="stat-value">
                <span className="current">{completedCount}</span>
                <span className="divider">/</span>
                <span className="total">{reviewWords.length}</span>
              </div>
            </div>
          </div>
          
          <div className="word-practice">
            <div className="word-display">
              <div className="sentence-blank">
                {currentWord.context?.[0]?.sentence ? 
                  generateBlankSentence(currentWord.context[0].sentence, currentWord.word) : 
                  '请拼写单词：___________'
                }
              </div>
              <div className="word-meaning">{currentWord.meaning?.definitionCn || currentWord.meaning?.chinese}</div>
            </div>
            
            {showSkeleton && errorLevel === 2 && (
              <div className="skeleton-display">
                <p className="skeleton-title">💡 骨架提示</p>
                {renderSkeleton(currentWord.word)}
              </div>
            )}
            
            <div className="answer-section">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="请输入单词拼写..."
                disabled={errorLevel === 3}
                autoFocus
              />
              <Button size="lg" onClick={handleSubmit} disabled={!userInput.trim() || errorLevel === 3}>
                提交
              </Button>
            </div>
            
            {feedback && (
              <div className={`feedback-box ${feedback.type}`}>
                {feedback.message}
                {feedback.type === 'level3' && (
                  <div className="failed-info">
                    <p><strong>正确答案：</strong>{currentWord.word}</p>
                    <Button onClick={moveToNext}>下一个</Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // 完成界面
  if (reviewState === 'completed') {
    return (
      <div className="smart-review-page">
        <div className="review-header">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            返回首页
          </Button>
          <div className="header-title">
            <div className="title-icon">
              <RotateCcw size={24} />
            </div>
            <div>
              <h1>智能复习与容错</h1>
              <Badge variant="blue">Phase 4</Badge>
            </div>
          </div>
        </div>
        
        <div className="review-content">
          <h2 className="section-title">今日计划</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <p className="stat-label">已复习</p>
              <div className="stat-value completed">
                <span className="current">{reviewWords.length}</span>
                <span className="divider">/</span>
                <span className="total">{reviewWords.length}</span>
              </div>
              <div className="complete-message">
                <CheckCircle size={24} />
                <span>今日复习完成！</span>
              </div>
              <div className="result-summary">
                <div className="result-item">
                  <span className="result-label">完美保黄</span>
                  <span className="result-num">{stats.passed}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">勉强保黄</span>
                  <span className="result-num">{stats.reset}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">变红灯</span>
                  <span className="result-num">{stats.failed}</span>
                </div>
              </div>
              <Button size="lg" className="action-btn" onClick={() => navigate('/')}>
                返回首页
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
};

export default SmartReview;
