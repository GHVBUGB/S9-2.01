import React from 'react';
import { Lightbulb, CheckCircle } from 'lucide-react';
import './ClozeMode.css';

/**
 * 完形填空模式组件
 */
const ClozeMode = ({ 
  storyData, 
  activeQuestion, 
  selectedOptions, 
  onQuestionChange,
  onAnswerSelect,
  onSubmit 
}) => {
  // 检查是否所有题目都答完了
  const allAnswered = Object.keys(selectedOptions).length === storyData.questions.length;
  
  // 计算答对和答错的数量
  let correctCount = 0;
  let incorrectCount = 0;
  
  if (allAnswered) {
    storyData.questions.forEach((question, index) => {
      const questionNumber = index + 1;
      const selectedAnswer = selectedOptions[questionNumber];
      if (selectedAnswer === question.answer) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });
  }
  
  // 只有在全部答对或全部答错时才显示解析
  const shouldShowAnalysis = allAnswered && (
    correctCount === storyData.questions.length || 
    incorrectCount === storyData.questions.length
  );

  return (
    <div className="cloze-mode">
      <div className="cloze-article">
        <header className="cloze-header">
          <h2 className="cloze-title">{storyData.title}</h2>
          <div className="cloze-divider"></div>
        </header>

        <div className="cloze-passage">
          {storyData.passage.map((part, i) => {
            if (typeof part === 'string') return <span key={i} className="passage-text">{part}</span>;
            const isCurrent = part.slot === (activeQuestion + 1);
            const isAnswered = !!selectedOptions[part.slot];
            return (
              <span 
                key={i} 
                onClick={() => onQuestionChange(part.slot - 1)}
                className={`passage-blank ${isCurrent ? 'current' : ''} ${isAnswered ? 'answered' : ''}`}
              >
                {isAnswered ? storyData.questions[part.slot-1].options[selectedOptions[part.slot]].split('. ')[1] : part.text}
              </span>
            );
          })}
        </div>

        {Object.keys(selectedOptions).length === storyData.questions.length && (
          <div className="cloze-submit">
            <button onClick={onSubmit} className="submit-btn">
              提交最终验证
            </button>
          </div>
        )}

      </div>

      <div className="cloze-sidebar">
        <div className="sidebar-sticky">
          <div className="question-header">
            <div className="question-dots">
              {storyData.questions.map((_, i) => (
                <div key={i} className={`dot ${i === activeQuestion ? 'active' : ''}`} />
              ))}
            </div>
          </div>

          <div className="options-list">
            {storyData.questions[activeQuestion].options.map((opt, i) => {
              const isSelected = selectedOptions[activeQuestion + 1] === i;
              const isCorrect = i === storyData.questions[activeQuestion].answer;
              return (
                <button 
                  key={i} 
                  onClick={() => onAnswerSelect(i)}
                  className={`option-btn ${isSelected ? (isCorrect ? 'correct' : 'incorrect') : ''}`}
                >
                  <span className="option-text">{opt}</span>
                  {isSelected && isCorrect && <CheckCircle className="check-icon" />}
                </button>
              );
            })}
          </div>

          {shouldShowAnalysis && (
            <div className="analysis-box">
              <div className="analysis-arrow"></div>
              <div className="analysis-header">
                <Lightbulb className="analysis-icon" />
                <span className="analysis-label">解析提示</span>
              </div>
              <p className="analysis-text">
                {storyData.questions[activeQuestion].analysis}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClozeMode;
