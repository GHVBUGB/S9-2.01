import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/ui/Button';
import Badge from '../../../shared/components/ui/Badge';
import { ArrowLeft, RotateCcw, Calendar, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import useWordStore from '../../../shared/store/useWordStore';
import { getWordById } from '../../../shared/data/mockWords';
import './SmartReview.css';

/**
 * 智能复习与容错（Phase 4）
 * 
 * 设计理念：
 * - 双轨制策略：快车道（Day 1首测即过）和标准车道（Day 1首测失败）
 * - 三级容错：Level 1 手滑提示 → Level 2 降级助推 → Level 3 熔断锁定
 * - 艾宾浩斯曲线：Day 1 -> Day 3 -> Day 7 -> Day 15 -> Day 30
 */
const SmartReview = () => {
  const navigate = useNavigate();
  
  // Store 状态
  const { 
    initialized, 
    initializeFromMockData,
    yellowWords, 
    reviewSuccess,
    reviewSuccessWithReset,
    reviewFailToRed
  } = useWordStore();
  
  // 组件状态
  const [reviewState, setReviewState] = useState('preview'); // preview | reviewing | completed
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewWords, setReviewWords] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [errorLevel, setErrorLevel] = useState(0); // 0: 正常, 1: Level1, 2: Level2, 3: Level3
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [stats, setStats] = useState({ total: 0, passed: 0, reset: 0, failed: 0 });
  
  // 初始化
  useEffect(() => {
    if (!initialized) {
      initializeFromMockData();
    }
  }, [initialized, initializeFromMockData]);
  
  // 获取需要复习的单词
  useEffect(() => {
    if (initialized && yellowWords.length > 0) {
      const words = yellowWords.slice(0, 10).map(state => ({
        wordId: state.wordId,
        reviewCount: state.reviewCount,
        track: state.reviewCount === 0 ? 'fast' : 'standard' // 快车道 vs 标准车道
      }));
      setReviewWords(words);
      setStats({ ...stats, total: words.length });
    }
  }, [initialized, yellowWords]);
  
  const currentWord = reviewWords[currentIndex] ? getWordById(reviewWords[currentIndex].wordId) : null;
  
  /**
   * 生成挖空句子
   */
  const generateBlankSentence = (sentence, word) => {
    if (!sentence || !word) return '';
    return sentence.replace(new RegExp(`\\b${word}\\b`, 'gi'), '___________');
  };
  
  /**
   * 渲染骨架提示（Level 2）
   */
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
  
  /**
   * 提交答案
   */
  const handleSubmit = () => {
    if (!userInput.trim() || !currentWord) return;
    
    const isCorrect = userInput.trim().toLowerCase() === currentWord.word.toLowerCase();
    
    if (isCorrect) {
      // 正确答案
      if (errorLevel === 0) {
        // 完美通过
        setFeedback({ type: 'perfect', message: '✓ 正确！完美保黄' });
        reviewSuccess(currentWord.id);
        setStats({ ...stats, passed: stats.passed + 1 });
      } else if (errorLevel === 2) {
        // Level 2 后改对，勉强保黄但重置周期
        setFeedback({ type: 'reset', message: '✓ 正确，勉强保黄（复习周期重置为 Day 1）' });
        reviewSuccessWithReset(currentWord.id);
        setStats({ ...stats, reset: stats.reset + 1 });
      }
      
      setTimeout(() => moveToNext(), 2000);
    } else {
      // 错误答案 - 升级容错等级
      if (errorLevel === 0) {
        // Level 1: 手滑提示
        setErrorLevel(1);
        setFeedback({ type: 'level1', message: '可能点错了，再试一次～（不判错）' });
        setUserInput('');
      } else if (errorLevel === 1) {
        // Level 2: 降级助推，显示骨架
        setErrorLevel(2);
        setShowSkeleton(true);
        setFeedback({ type: 'level2', message: '看看骨架提示，能想起来吗？' });
        setUserInput('');
      } else if (errorLevel === 2) {
        // Level 3: 熔断锁定
        setErrorLevel(3);
        setFeedback({ type: 'level3', message: '❌ 熔断锁定 - 变红灯，需要老师修复' });
        reviewFailToRed(currentWord.id, []);
        setStats({ ...stats, failed: stats.failed + 1 });
      }
    }
  };
  
  /**
   * 进入下一个单词
   */
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
        <div className="smart-review">
          <div className="review-header">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft size={20} />
              返回首页
            </Button>
            <div className="review-header-info">
              <div className="review-icon">
                <RotateCcw size={24} />
              </div>
              <div>
                <h1>智能复习与容错</h1>
                <Badge variant="blue">Phase 4</Badge>
              </div>
            </div>
          </div>
          
          <div className="review-content">
            <div className="empty-state">
              <Calendar size={64} />
              <h2>暂无复习任务</h2>
              <p>完成学习后，系统会根据艾宾浩斯曲线自动推送复习任务</p>
              <Button onClick={() => navigate('/')}>返回首页</Button>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="smart-review">
        <div className="review-header">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            返回首页
          </Button>
          <div className="review-header-info">
            <div className="review-icon">
              <RotateCcw size={24} />
            </div>
            <div>
              <h1>智能复习与容错</h1>
              <Badge variant="blue">Phase 4</Badge>
            </div>
          </div>
        </div>
        
        <div className="review-content">
          <div className="preview-card">
            <div className="preview-header">
              <Calendar size={48} />
              <h2>今日复习任务</h2>
              <p>按艾宾浩斯曲线自动推送</p>
            </div>
            
            <div className="preview-stats">
              <div className="stat-item">
                <span className="stat-number">{reviewWords.length}</span>
                <span className="stat-label">待复习单词</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">~{Math.ceil(reviewWords.length * 0.5)}</span>
                <span className="stat-label">分钟</span>
              </div>
            </div>
            
            <div className="review-rules">
              <h3>🎯 三级容错机制</h3>
              <div className="rule-list">
                <div className="rule-item level1">
                  <Badge variant="yellow" size="sm">Level 1</Badge>
                  <span>手滑提示 - 震动提示，再给一次机会（不判错）</span>
                </div>
                <div className="rule-item level2">
                  <Badge variant="orange" size="sm">Level 2</Badge>
                  <span>降级助推 - 骨架提示，答对后勉强保黄但打回 Day 1</span>
                </div>
                <div className="rule-item level3">
                  <Badge variant="red" size="sm">Level 3</Badge>
                  <span>熔断锁定 - 变红灯，踢回 P5 等待老师修复</span>
                </div>
              </div>
            </div>
            
            <Button size="lg" onClick={() => setReviewState('reviewing')}>
              开始复习 ({reviewWords.length} 个单词)
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // 复习中
  if (reviewState === 'reviewing') {
    if (!currentWord) {
      return <div className="smart-review">加载中...</div>;
    }
    
    return (
      <div className="smart-review">
        <div className="review-header">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            返回首页
          </Button>
          <div className="review-header-info">
            <div className="review-icon">
              <RotateCcw size={24} />
            </div>
            <div>
              <h1>智能复习与容错</h1>
              <Badge variant="blue">Phase 4</Badge>
            </div>
          </div>
        </div>
        
        <div className="review-content">
          {/* 进度 */}
          <div className="review-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${((currentIndex + 1) / reviewWords.length) * 100}%` }} />
            </div>
            <span className="progress-text">{currentIndex + 1} / {reviewWords.length}</span>
          </div>
          
          {/* 复习卡片 */}
          <div className="review-card">
            <div className="card-header">
              <Badge variant="yellow">L4 全拼写</Badge>
              <span className="track-badge">{reviewWords[currentIndex]?.track === 'fast' ? '🚄 快车道' : '🚂 标准车道'}</span>
            </div>
            
            <div className="question">
              <div className="sentence">
                {currentWord.context?.[0]?.sentence ? 
                  generateBlankSentence(currentWord.context[0].sentence, currentWord.word) : 
                  '请拼写单词：___________'
                }
              </div>
              <div className="translation">{currentWord.meaning?.definitionCn || currentWord.meaning?.chinese}</div>
            </div>
            
            {/* Level 2 骨架提示 */}
            {showSkeleton && errorLevel === 2 && (
              <div className="skeleton-box">
                <h4>💡 骨架提示（绿色字母已显示）</h4>
                {renderSkeleton(currentWord.word)}
              </div>
            )}
            
            {/* 输入区 */}
            <div className="input-section">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="请输入单词拼写..."
                disabled={errorLevel === 3}
                autoFocus
              />
              <Button onClick={handleSubmit} disabled={!userInput.trim() || errorLevel === 3}>
                提交
              </Button>
            </div>
            
            {/* 反馈信息 */}
            {feedback && (
              <div className={`feedback feedback-${feedback.type}`}>
                {feedback.type === 'level1' && <AlertTriangle size={20} />}
                {feedback.type === 'level2' && <AlertTriangle size={20} />}
                {feedback.type === 'level3' && <XCircle size={20} />}
                {(feedback.type === 'perfect' || feedback.type === 'reset') && <CheckCircle size={20} />}
                <span>{feedback.message}</span>
                
                {feedback.type === 'level3' && (
                  <div className="failed-info">
                    <div className="answer-reveal">
                      <p><strong>正确答案：</strong>{currentWord.word}</p>
                      <p>{currentWord.meaning?.definitionCn}</p>
                    </div>
                    <Button onClick={moveToNext}>我知道了，下一个</Button>
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
      <div className="smart-review">
        <div className="review-header">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            返回首页
          </Button>
          <div className="review-header-info">
            <div className="review-icon">
              <RotateCcw size={24} />
            </div>
            <div>
              <h1>智能复习与容错</h1>
              <Badge variant="blue">Phase 4</Badge>
            </div>
          </div>
        </div>
        
        <div className="review-content">
          <div className="completed-card">
            <CheckCircle size={64} className="completed-icon" />
            <h2>今日复习完成！</h2>
            <p>已完成 {stats.total} 个单词的复习</p>
            
            <div className="stats-grid">
              <div className="stat-box perfect">
                <span className="stat-value">{stats.passed}</span>
                <span className="stat-label">完美保黄</span>
              </div>
              <div className="stat-box reset">
                <span className="stat-value">{stats.reset}</span>
                <span className="stat-label">勉强保黄（重置）</span>
              </div>
              <div className="stat-box failed">
                <span className="stat-value">{stats.failed}</span>
                <span className="stat-label">变红灯</span>
              </div>
            </div>
            
            <div className="next-review">
              <Calendar size={20} />
              <span>下次复习时间将根据艾宾浩斯曲线自动推送</span>
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
