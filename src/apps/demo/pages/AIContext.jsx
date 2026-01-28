import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/ui/Button';
import Badge from '../../../shared/components/ui/Badge';
import { ArrowLeft, Sparkles, BookOpen, CheckCircle } from 'lucide-react';
import useWordStore from '../../../shared/store/useWordStore';
import { getWordById } from '../../../shared/data/mockWords';
import './AIContext.css';

/**
 * AI 个性化语境闭环（增值服务）
 * Mode A: 剧情式微阅读 - 该得爽（Daily）
 * Mode B: 仿真题演练 - 做得对（Weekly）
 */
const AIContext = () => {
  const navigate = useNavigate();
  
  const { 
    initialized, 
    initializeFromMockData,
    yellowWords
  } = useWordStore();
  
  const [mode, setMode] = useState('select'); // select | modeA | modeB | completed
  const [currentIndex, setCurrentIndex] = useState(0);
  const [practiceWords, setPracticeWords] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  
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
  
  // Mode A 示例故事
  const getModeAStory = (word) => {
    return {
      title: "Tom 的新生活",
      content: `Tom moved to a new city. It was hard to ${word.word} to his new school. But soon, he made a new friend, Jerry. They played soccer together.`,
      blanks: [
        { text: word.word, isTarget: true },
        { text: 'adjust', isTarget: false },
        { text: 'avoid', isTarget: false }
      ]
    };
  };
  
  // Mode B 示例题目
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
    setStats({ correct: 0, total: 0 });
  };
  
  const handleAnswer = (isCorrect) => {
    setShowResult(true);
    if (isCorrect) {
      setStats({ ...stats, correct: stats.correct + 1, total: stats.total + 1 });
    } else {
      setStats({ ...stats, total: stats.total + 1 });
    }
    
    setTimeout(() => {
      if (currentIndex < practiceWords.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedOption(null);
        setShowResult(false);
      } else {
        setMode('completed');
      }
    }, 2000);
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
          
          <div className="context-empty">
            <p>暂无可用的黄灯单词</p>
            <Button onClick={() => navigate('/')}>返回首页</Button>
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
        
        <div className="context-main">
          <div className="mode-select">
            <h2 className="select-title">选择练习模式</h2>
            <div className="mode-cards">
              <div className="mode-card" onClick={() => handleSelectMode('modeA')}>
                <BookOpen size={48} className="mode-icon" />
                <h3>Mode A</h3>
                <p className="mode-name">剧情式微阅读</p>
                <p className="mode-desc">该得爽 - 每日故事</p>
              </div>
              <div className="mode-card" onClick={() => handleSelectMode('modeB')}>
                <CheckCircle size={48} className="mode-icon" />
                <h3>Mode B</h3>
                <p className="mode-name">仿真题演练</p>
                <p className="mode-desc">做得对 - 模拟考试</p>
              </div>
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
              <Badge variant="yellow">Mode A - 剧情式</Badge>
            </div>
          </div>
        </div>
        
        <div className="context-main">
          <div className="progress-info">
            <Badge variant="yellow">进度: {currentIndex + 1} / {practiceWords.length}</Badge>
          </div>
          
          <div className="story-display">
            <h3 className="story-title">📖 {story.title}</h3>
            <p className="story-content">{story.content}</p>
          </div>
          
          <div className="question-box">
            <p className="question-text">✓ 清晰对长难句的恐惧，验证单词在任意句子的真实义。</p>
          </div>
          
          <div className="action-buttons">
            <Button size="lg" onClick={() => handleAnswer(true)}>
              我理解了，下一个
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
              <Badge variant="yellow">Mode B - 仿真题</Badge>
            </div>
          </div>
        </div>
        
        <div className="context-main">
          <div className="progress-info">
            <Badge variant="yellow">进度: {currentIndex + 1} / {practiceWords.length}</Badge>
          </div>
          
          <div className="passage-display">
            <p className="passage-text">{question.passage}</p>
          </div>
          
          <div className="questions-list">
            {question.questions.map((q, idx) => (
              <div key={idx} className="question-item">
                <p className="question-num">{q.num}.</p>
                <div className="options-list">
                  {q.options.map((opt) => (
                    <button
                      key={opt.label}
                      className={`option-btn ${selectedOption === `${idx}-${opt.label}` ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedOption(`${idx}-${opt.label}`);
                        setTimeout(() => handleAnswer(opt.isCorrect), 500);
                      }}
                      disabled={showResult}
                    >
                      {opt.label}. {opt.text}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {showResult && (
            <div className={`result-box ${stats.total > 0 ? 'correct' : ''}`}>
              <CheckCircle size={24} />
              <span>回答正确！</span>
            </div>
          )}
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
        
        <div className="context-main">
          <div className="complete-screen">
            <Sparkles size={80} className="complete-icon" />
            <h2>练习完成！</h2>
            <div className="final-stats">
              <div className="stat-box">
                <span className="stat-num">{stats.total}</span>
                <span className="stat-label">完成题目</span>
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

export default AIContext;
