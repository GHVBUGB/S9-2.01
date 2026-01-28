import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/ui/Button';
import Badge from '../../../shared/components/ui/Badge';
import { ArrowLeft, RotateCcw, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import useWordStore from '../../../shared/store/useWordStore';
import { getWordById } from '../../../shared/data/mockWords';
import './SmartReview.css';

/**
 * 智能复习与容错（Phase 4）
 * 双轨制 + 三级容错机制
 */
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
          
          <div className="review-empty">
            <p>暂无复习任务</p>
            <Button onClick={() => navigate('/')}>返回首页</Button>
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
        
        <div className="review-main">
          <div className="start-screen">
            <p className="today-task">今日复习任务</p>
            <h2 className="word-count">{reviewWords.length}</h2>
            <p className="word-label">待复习单词</p>
            <Button size="lg" onClick={() => setReviewState('reviewing')}>
              开始复习
            </Button>
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
        
        <div className="review-main">
          <div className="progress-info">
            <Badge variant="blue">单词进度: {currentIndex + 1} / {reviewWords.length}</Badge>
          </div>
          
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
          
          <div className="answer-input">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="请输入单词拼写..."
              disabled={errorLevel === 3}
              autoFocus
            />
          </div>
          
          <div className="action-buttons">
            <Button size="lg" onClick={handleSubmit} disabled={!userInput.trim() || errorLevel === 3}>
              提交
            </Button>
          </div>
          
          {feedback && (
            <div className={`feedback-message ${feedback.type}`}>
              {feedback.message}
              {feedback.type === 'level3' && (
                <div className="failed-detail">
                  <p><strong>正确答案：</strong>{currentWord.word}</p>
                  <Button onClick={moveToNext}>下一个</Button>
                </div>
              )}
            </div>
          )}
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
        
        <div className="review-main">
          <div className="complete-screen">
            <CheckCircle size={80} className="complete-icon" />
            <h2>今日复习完成！</h2>
            <div className="stats-display">
              <div className="stat-item">
                <span className="stat-num">{stats.passed}</span>
                <span className="stat-text">完美保黄</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">{stats.reset}</span>
                <span className="stat-text">勉强保黄</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">{stats.failed}</span>
                <span className="stat-text">变红灯</span>
              </div>
            </div>
            <Button onClick={() => navigate('/')}>返回首页</Button>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
};

export default SmartReview;
