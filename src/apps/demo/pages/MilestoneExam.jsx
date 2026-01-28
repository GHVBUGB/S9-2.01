import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/ui/Button';
import Badge from '../../../shared/components/ui/Badge';
import { ArrowLeft, Trophy, CheckCircle, XCircle, Award } from 'lucide-react';
import useWordStore from '../../../shared/store/useWordStore';
import { getWordById } from '../../../shared/data/mockWords';
import './MilestoneExam.css';

/**
 * 里程碑大考（Phase 6）- 绿灯加冕
 * 全过移测试：新语境、无提示、一次机会
 */
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
                <h1>里程碑大考 —— 绿灯加冕</h1>
                <Badge variant="green">Phase 6</Badge>
              </div>
            </div>
          </div>
          
          <div className="exam-empty">
            <Trophy size={80} style={{ color: '#cbd5e1' }} />
            <p>暂无达到大考标准的单词</p>
            <Button onClick={() => navigate('/')}>返回首页</Button>
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
              <h1>里程碑大考 —— 绿灯加冕</h1>
              <Badge variant="green">Phase 6</Badge>
            </div>
          </div>
        </div>
        
        <div className="exam-main">
          <div className="start-screen">
            <Trophy size={80} className="trophy-big" />
            <p className="congrats-text">🎉 恭喜！达到大考标准</p>
            <h2 className="exam-count">{examWords.length}</h2>
            <p className="exam-label">个单词待考核</p>
            <Button size="lg" onClick={() => setExamState('testing')}>
              开始大考
            </Button>
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
              <h1>里程碑大考 —— 绿灯加冕</h1>
              <Badge variant="green">Phase 6</Badge>
            </div>
          </div>
        </div>
        
        <div className="exam-main">
          <div className="progress-info">
            <Badge variant="green">第 {currentIndex + 1} / {examWords.length} 题</Badge>
          </div>
          
          <div className="exam-question">
            <div className="question-sentence">
              {generateNewContextSentence(currentWord)}
            </div>
            <p className="exam-hint">⚠️ 无首字母提示，无中文翻译，全新语境</p>
          </div>
          
          <div className="answer-input">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !showResult && handleSubmit()}
              placeholder="请输入单词拼写..."
              disabled={showResult}
              autoFocus
            />
          </div>
          
          <div className="action-buttons">
            <Button size="lg" onClick={handleSubmit} disabled={!userInput.trim() || showResult}>
              提交答案
            </Button>
          </div>
          
          {showResult && (
            <div className={`result-feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
              {isCorrect ? (
                <>
                  <CheckCircle size={48} />
                  <h3>✓ 答对了，变🟢绿灯</h3>
                  <p>恭喜！{currentWord.word} 已永久掌握</p>
                </>
              ) : (
                <>
                  <XCircle size={48} />
                  <h3>✗ 答错了，变🔴红灯</h3>
                  <div className="answer-reveal">
                    <p><strong>正确答案：</strong>{currentWord.word}</p>
                    <p className="word-def">{currentWord.meaning?.definitionCn}</p>
                  </div>
                </>
              )}
            </div>
          )}
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
              <h1>里程碑大考 —— 完成</h1>
              <Badge variant="green">Phase 6</Badge>
            </div>
          </div>
        </div>
        
        <div className="exam-main">
          <div className="complete-screen">
            <Award size={80} className="award-icon" />
            <h2>🎉 大考完成</h2>
            <div className="results-display">
              <div className="result-item pass">
                <span className="result-num">{results.passed}</span>
                <span className="result-text">🟢 通过（绿灯）</span>
              </div>
              <div className="result-item fail">
                <span className="result-num">{results.failed}</span>
                <span className="result-text">🔴 未通过（红灯）</span>
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

export default MilestoneExam;
