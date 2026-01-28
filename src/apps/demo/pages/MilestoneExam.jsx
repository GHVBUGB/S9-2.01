import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/ui/Button';
import Badge from '../../../shared/components/ui/Badge';
import { ArrowLeft, Trophy, CheckCircle, XCircle } from 'lucide-react';
import useWordStore from '../../../shared/store/useWordStore';
import { getWordById } from '../../../shared/data/mockWords';
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
  
  const [examState, setExamState] = useState('preview');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [examWords, setExamWords] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [results, setResults] = useState({ passed: 0, failed: 0 });
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  
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
        .map(state => ({ wordId: state.wordId }));
      setExamWords(eligibleWords);
    }
  }, [initialized, yellowWords]);
  
  const currentWord = examWords[currentIndex] ? getWordById(examWords[currentIndex].wordId) : null;
  
  const generateNewContextSentence = (word) => {
    if (!word || !word.context || !word.context[0]) {
      return `It takes time to [ ___________ ] to a new school.`;
    }
    const sentence = word.context[0].sentence;
    return sentence.replace(new RegExp(`\\b${word.word}\\b`, 'gi'), '[ ___________ ]');
  };
  
  const handleSubmit = () => {
    if (!userInput.trim() || !currentWord) return;
    
    const correct = userInput.trim().toLowerCase() === currentWord.word.toLowerCase();
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      promoteToGreen(currentWord.id);
      setResults({ ...results, passed: results.passed + 1 });
    } else {
      demoteToRed(currentWord.id);
      setResults({ ...results, failed: results.failed + 1 });
    }
    
    setCompletedCount(completedCount + 1);
    
    setTimeout(() => {
      if (currentIndex < examWords.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setUserInput('');
        setShowResult(false);
      } else {
        setExamState('completed');
      }
    }, 2500);
  };
  
  // 预览界面
  if (examState === 'preview') {
    if (!initialized || examWords.length === 0) {
      return (
        <div className="milestone-exam-page">
          <div className="exam-header">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft size={20} />
              返回首页
            </Button>
            <div className="header-title">
              <div className="title-icon green">
                <Trophy size={24} />
              </div>
              <div>
                <h1>里程碑大考</h1>
                <Badge variant="green">Phase 6</Badge>
              </div>
            </div>
          </div>
          
          <div className="exam-content">
            <h2 className="section-title">今日计划</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <p className="stat-label">已考核</p>
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
      <div className="milestone-exam-page">
        <div className="exam-header">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            返回首页
          </Button>
          <div className="header-title">
            <div className="title-icon green">
              <Trophy size={24} />
            </div>
            <div>
              <h1>里程碑大考</h1>
              <Badge variant="green">Phase 6</Badge>
            </div>
          </div>
        </div>
        
        <div className="exam-content">
          <h2 className="section-title">今日计划</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <p className="stat-label">已考核</p>
              <div className="stat-value">
                <span className="current">0</span>
                <span className="divider">/</span>
                <span className="total">{examWords.length}</span>
              </div>
              <Button size="lg" className="action-btn" onClick={() => setExamState('testing')}>
                大考
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // 考试中
  if (examState === 'testing') {
    if (!currentWord) return <div className="milestone-exam-page">加载中...</div>;
    
    return (
      <div className="milestone-exam-page">
        <div className="exam-header">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            返回首页
          </Button>
          <div className="header-title">
            <div className="title-icon green">
              <Trophy size={24} />
            </div>
            <div>
              <h1>里程碑大考</h1>
              <Badge variant="green">Phase 6</Badge>
            </div>
          </div>
        </div>
        
        <div className="exam-content">
          <h2 className="section-title">今日计划</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <p className="stat-label">已考核</p>
              <div className="stat-value">
                <span className="current">{completedCount}</span>
                <span className="divider">/</span>
                <span className="total">{examWords.length}</span>
              </div>
            </div>
          </div>
          
          <div className="word-practice">
            <div className="word-display">
              <div className="sentence-blank">
                {generateNewContextSentence(currentWord)}
              </div>
              <p className="exam-hint">⚠️ 无首字母提示，无中文翻译，全新语境</p>
            </div>
            
            <div className="answer-section">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !showResult && handleSubmit()}
                placeholder="请输入单词拼写..."
                disabled={showResult}
                autoFocus
              />
              <Button size="lg" onClick={handleSubmit} disabled={!userInput.trim() || showResult}>
                提交答案
              </Button>
            </div>
            
            {showResult && (
              <div className={`result-box ${isCorrect ? 'correct' : 'incorrect'}`}>
                {isCorrect ? (
                  <>
                    <CheckCircle size={32} />
                    <div>
                      <h3>✓ 答对了，变🟢绿灯</h3>
                      <p>恭喜！{currentWord.word} 已永久掌握</p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle size={32} />
                    <div>
                      <h3>✗ 答错了，变🔴红灯</h3>
                      <p><strong>正确答案：</strong>{currentWord.word}</p>
                      <p className="word-def">{currentWord.meaning?.definitionCn}</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // 完成界面
  if (examState === 'completed') {
    return (
      <div className="milestone-exam-page">
        <div className="exam-header">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            返回首页
          </Button>
          <div className="header-title">
            <div className="title-icon green">
              <Trophy size={24} />
            </div>
            <div>
              <h1>里程碑大考</h1>
              <Badge variant="green">Phase 6</Badge>
            </div>
          </div>
        </div>
        
        <div className="exam-content">
          <h2 className="section-title">今日计划</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <p className="stat-label">已考核</p>
              <div className="stat-value completed">
                <span className="current">{examWords.length}</span>
                <span className="divider">/</span>
                <span className="total">{examWords.length}</span>
              </div>
              <div className="complete-message">
                <Trophy size={24} />
                <span>大考完成！</span>
              </div>
              <div className="result-summary">
                <div className="result-item">
                  <span className="result-label">🟢 通过（绿灯）</span>
                  <span className="result-num">{results.passed}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">🔴 未通过（红灯）</span>
                  <span className="result-num">{results.failed}</span>
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

export default MilestoneExam;
