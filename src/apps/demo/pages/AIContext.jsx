import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import useWordStore from '../../../shared/store/useWordStore';
import { getWordById } from '../../../shared/data/mockWords';
import SimpleHeader from '../components/SimpleHeader';
import ModeSelection from './AIContext/ModeSelection';
import StoryMode from './AIContext/StoryMode';
import ClozeMode from './AIContext/ClozeMode';
import './AIContext.css';

const AIContext = () => {
  const navigate = useNavigate();
  
  const { 
    initialized, 
    initializeFromMockData,
    yellowWords
  } = useWordStore();
  
  const [step, setStep] = useState('selection');
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [words, setWords] = useState([]);
  
  // 调试信息
  console.log('AIContext 组件已加载 - 新版本');
  console.log('当前步骤:', step);
  console.log('初始化状态:', initialized);
  console.log('单词数量:', words.length);

  useEffect(() => {
    if (!initialized) {
      initializeFromMockData();
    }
  }, [initialized, initializeFromMockData]);

  useEffect(() => {
    if (initialized && yellowWords.length > 0) {
      const wordList = yellowWords.slice(0, 5).map(state => getWordById(state.wordId)).filter(Boolean);
      setWords(wordList);
    }
  }, [initialized, yellowWords]);

  const chameleonStory = {
    title: "自然界的伪装大师",
    subtitle: "生物进化系列 / 深度案例 04",
    passage: [
      "Chameleons are amazing animals found in nature. They are famous because they can change their skin color. However, they do not change color just to look pretty. They do it to match their ",
      { slot: 1, text: "[ 1 ]" },
      " . For example, if a chameleon is sitting on a green leaf, it turns green. This helps them hide from ",
      { slot: 2, text: "[ 2 ]" },
      " like snakes or birds. Besides, chameleons also change color to show their feelings. When they are angry, they might turn red. It is a special way to ",
      { slot: 3, text: "[ 3 ]" },
      " with other chameleons without making a sound."
    ],
    questions: [
      {
        options: ["A. water", "B. environment", "C. sky", "D. adoption"],
        answer: 1,
        analysis: "解析 Q1：线索在于 sitting on a green leaf, it turns green。这描述的是变色龙周围的环境，故 environment 为正确答案。"
      },
      {
        options: ["A. friends", "B. plants", "C. enemies", "D. toys"],
        answer: 2,
        analysis: "解析 Q2：文中的蛇（snakes）和鸟（birds）是变色龙的天敌，因此归类为 enemies。"
      },
      {
        options: ["A. fight", "B. communicate", "C. adapt", "D. fly"],
        answer: 1,
        analysis: "解析 Q3：文中提到通过改变颜色来表达愤怒等情感而不发出声音，这是一种非语言的信息交换，即 communicate（交流）。"
      }
    ]
  };

  const storyModeData = {
    stories: [
      {
        group: "Group A: 校园生活 (School Life)",
        title: "Tom's New School",
        content: words.length >= 3 ? [
          "Tom felt nervous. The ",
          { wordId: words[1]?.id, text: words[1]?.word || "environment" },
          " in his new school were very strict. He had to wear a blue uniform. It was hard to ",
          { wordId: words[0]?.id, text: words[0]?.word || "adapt" },
          " at first. But after he passed the exam, he made a new friend, Jerry. Jerry was always ",
          { wordId: words[2]?.id, text: words[2]?.word || "shy" },
          " but very kind."
        ] : [
          "Tom felt nervous. The environment in his new school were very strict. He had to wear a blue uniform. It was hard to adapt at first. But after he passed the exam, he made a new friend, Jerry."
        ],
        question: "Who is Tom's new friend?",
        options: ["A. Jerry", "B. Bob"],
        correctAnswer: 0
      },
      {
        group: "Group B: 自然探索 (Nature Exploration)",
        title: "The Changing Weather",
        content: words.length >= 6 ? [
          "The weather suddenly changed. It is hard for small plants to ",
          { wordId: words[6]?.id, text: words[6]?.word || "survive" },
          " in such a bad ",
          { wordId: words[1]?.id, text: words[1]?.word || "environment" },
          ". We saw some ",
          { wordId: words[9]?.id, text: words[9]?.word || "damage" },
          ". We must protect the animals from ",
          { wordId: words[10]?.id, text: words[10]?.word || "danger" },
          "."
        ] : [
          "The weather suddenly changed. It is hard for small plants to survive in such a bad environment. We saw some damage. We must protect the animals from danger."
        ],
        question: "Is it hard for plants to survive there?",
        options: ["A. Yes", "B. No"],
        correctAnswer: 0
      }
    ]
  };


  const handleModeBAnswer = (idx) => {
    const newSelected = { ...selectedOptions, [activeQuestion + 1]: idx };
    setSelectedOptions(newSelected);
    if (idx === chameleonStory.questions[activeQuestion].answer) {
      if (activeQuestion < chameleonStory.questions.length - 1) {
        setTimeout(() => setActiveQuestion(prev => prev + 1), 600);
      }
    }
  };

  const handleFinish = () => {
    setStep('finish');
  };

  // 选择模式页面
  if (step === 'selection') {
    return (
      <div className="ai-context-page" data-version="v2.0-new">
        <SimpleHeader />
        <div className="context-main">
          <ModeSelection 
            onSelectMode={setStep}
            hasNewStory={true} // 控制是否显示 NEW 标识，可以从后端获取
          />
        </div>
      </div>
    );
  }
  
  // 完成页面
  if (step === 'finish') {
    return (
      <div className="ai-context-page">
        <SimpleHeader />
        
        <main className="context-content">
          <div className="story-mode">
            <div className="completion-container">
              <div className="complete-card">
                <div className="complete-icon">
                  <Sparkles className="trophy-icon" />
                </div>
                <h2 className="complete-title">练习完成！</h2>
                <p className="complete-subtitle">恭喜完成语境闭环训练</p>
                
                <button onClick={() => navigate('/')} className="complete-btn">
                  返回首页
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="ai-context-page">
      <SimpleHeader onBack={() => setStep('selection')} />

      <div className="progress-indicator">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: step === 'mode_a' ? '100%' : `${((activeQuestion + 1) / chameleonStory.questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <main className="context-content">
        {step === 'mode_a' ? (
          <StoryMode 
            storyData={storyModeData} 
            words={words}
            onFinish={handleFinish}
          />
        ) : (
          <ClozeMode
            storyData={chameleonStory}
            activeQuestion={activeQuestion}
            selectedOptions={selectedOptions}
            onQuestionChange={setActiveQuestion}
            onAnswerSelect={handleModeBAnswer}
            onSubmit={handleFinish}
          />
        )}
      </main>

      <footer className="context-footer">
        <span className="footer-text">矩阵交互界面 / 校准版</span>
      </footer>
    </div>
  );
};

export default AIContext;
