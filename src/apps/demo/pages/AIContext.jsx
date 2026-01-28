import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/ui/Button';
import Badge from '../../../shared/components/ui/Badge';
import { ArrowLeft, Sparkles, BookOpen, CheckCircle } from 'lucide-react';
import useWordStore from '../../../shared/store/useWordStore';
import { getWordById } from '../../../shared/data/mockWords';
import './AIContext.css';

const AIContext = () => {
  const navigate = useNavigate();
  
  const { 
    initialized, 
    initializeFromMockData,
    yellowWords
  } = useWordStore();
  
  const [mode, setMode] = useState('select');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [practiceWords, setPracticeWords] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  
  useEffect(() => {
    if (!initialized) {
      initializeFromMockData();
    }
  }, [initialized, initializeFromMockData]);
  
  useEffect(() => {
    if (initialized && yellowWords.length > 0) {
      const words = yellowWords.slice(0, 5).map(state => ({
        wordId: state.wordId
      }));
      setPracticeWords(words);
    }
  }, [initialized, yellowWords]);
  
  const currentWord = practiceWords[currentIndex] ? getWordById(practiceWords[currentIndex].wordId) : null;
  
  const getModeAStory = (word) => {
    return {
      title: "Tom 的新生活",
      content: `Tom moved to a new city. It was hard to ${word.word} to his new school. But soon, he made a new friend, Jerry. They played soccer together.`
    };
  };
  
  const getModeBQuestion = (word) => {
    return {
      passage: "A chameleon is a special animal. It can change color to fit the [ 1 ]. This helps it to [ 2 ] to different places.",
      questions: [
        {
          num: 1,
          options: [
            { label: 'A', text: 'water', isCorrect: false },
            { label: 'B', text: 'environment', isCorrect: true },
            { label: 'C', text: 'sky', isCorrect: false }
          ]
        },
        {
          num: 2,
          options: [
            { label: 'A', text: 'fly', isCorrect: false },
            { label: 'B', text: 'jump', isCorrect: false },
            { label: 'C', text: word.word, isCorrect: true }
          ]
        }
      ]
    };
  };
  
  const handleSelectMode = (selectedMode) => {
    setMode(selectedMode);
    setCurrentIndex(0);
    setCompletedCount(0);
  };
  
  const handleNext = () => {
    setCompletedCount(completedCount + 1);
    if (currentIndex < practiceWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setMode('completed');
    }
  };
  
  // 选择模式界面
  if (mode === 'select') {
    if (!initialized || practiceWords.length === 0) {
      return (
        <div className="ai-context-page">
          <div className="context-header">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft size={20} />
              返回首页
            </Button>
            <div className="header-title">
              <div className="title-icon yellow">
                <Sparkles size={24} />
              </div>
              <div>
                <h1>AI 个性化语境闭环</h1>
                <Badge variant="yellow">增值服务</Badge>
              </div>
            </div>
          </div>
          
          <div className="context-content">
            <h2 className="section-title">今日计划</h2>
            <div className="empty-state">
              <p>暂无可用的黄灯单词</p>
              <Button onClick={() => navigate('/')}>返回首页</Button>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="ai-context-page">
        <div className="context-header">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            返回首页
          </Button>
          <div className="header-title">
            <div className="title-icon yellow">
              <Sparkles size={24} />
            </div>
            <div>
              <h1>AI 个性化语境闭环</h1>
              <Badge variant="yellow">增值服务</Badge>
            </div>
          </div>
        </div>
        
        <div className="context-content">
          <h2 className="section-title">选择练习模式</h2>
          <div className="mode-grid">
            <div className="mode-card" onClick={() => handleSelectMode('modeA')}>
              <BookOpen size={48} className="mode-icon" />
              <h3>Mode A</h3>
              <p className="mode-desc">剧情式微阅读</p>
            </div>
            <div className="mode-card" onClick={() => handleSelectMode('modeB')}>
              <CheckCircle size={48} className="mode-icon" />
              <h3>Mode B</h3>
              <p className="mode-desc">仿真题演练</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Mode A - 剧情式微阅读
  if (mode === 'modeA') {
    if (!currentWord) return <div className="ai-context-page">加载中...</div>;
    
    const story = getModeAStory(currentWord);
    
    return (
      <div className="ai-context-page">
        <div className="context-header">
          <Button variant="ghost" onClick={() => setMode('select')}>
            <ArrowLeft size={20} />
            返回
          </Button>
          <div className="header-title">
            <div className="title-icon yellow">
              <Sparkles size={24} />
            </div>
            <div>
              <h1>AI 个性化语境闭环</h1>
              <Badge variant="yellow">Mode A</Badge>
            </div>
          </div>
        </div>
        
        <div className="context-content">
          <h2 className="section-title">今日计划</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <p className="stat-label">已练习</p>
              <div className="stat-value">
                <span className="current">{completedCount}</span>
                <span className="divider">/</span>
                <span className="total">{practiceWords.length}</span>
              </div>
            </div>
          </div>
          
          <div className="practice-area">
            <div className="story-card">
              <h3 className="story-title">📖 {story.title}</h3>
              <p className="story-content">{story.content}</p>
            </div>
            
            <Button size="lg" className="action-btn" onClick={handleNext}>
              下一个
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Mode B - 仿真题演练
  if (mode === 'modeB') {
    if (!currentWord) return <div className="ai-context-page">加载中...</div>;
    
    const question = getModeBQuestion(currentWord);
    
    return (
      <div className="ai-context-page">
        <div className="context-header">
          <Button variant="ghost" onClick={() => setMode('select')}>
            <ArrowLeft size={20} />
            返回
          </Button>
          <div className="header-title">
            <div className="title-icon yellow">
              <Sparkles size={24} />
            </div>
            <div>
              <h1>AI 个性化语境闭环</h1>
              <Badge variant="yellow">Mode B</Badge>
            </div>
          </div>
        </div>
        
        <div className="context-content">
          <h2 className="section-title">今日计划</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <p className="stat-label">已练习</p>
              <div className="stat-value">
                <span className="current">{completedCount}</span>
                <span className="divider">/</span>
                <span className="total">{practiceWords.length}</span>
              </div>
            </div>
          </div>
          
          <div className="practice-area">
            <div className="passage-card">
              <p className="passage-text">{question.passage}</p>
            </div>
            
            <div className="questions">
              {question.questions.map((q, idx) => (
                <div key={idx} className="question-box">
                  <p className="question-num">{q.num}.</p>
                  <div className="options">
                    {q.options.map((opt) => (
                      <div key={opt.label} className="option">
                        {opt.label}. {opt.text}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <Button size="lg" className="action-btn" onClick={handleNext}>
              下一个
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // 完成界面
  if (mode === 'completed') {
    return (
      <div className="ai-context-page">
        <div className="context-header">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            返回首页
          </Button>
          <div className="header-title">
            <div className="title-icon yellow">
              <Sparkles size={24} />
            </div>
            <div>
              <h1>AI 个性化语境闭环</h1>
              <Badge variant="yellow">增值服务</Badge>
            </div>
          </div>
        </div>
        
        <div className="context-content">
          <h2 className="section-title">今日计划</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <p className="stat-label">已练习</p>
              <div className="stat-value completed">
                <span className="current">{practiceWords.length}</span>
                <span className="divider">/</span>
                <span className="total">{practiceWords.length}</span>
              </div>
              <div className="complete-message">
                <Sparkles size={24} />
                <span>练习完成！</span>
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

export default AIContext;
