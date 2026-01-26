import React, { useState, useMemo, useEffect } from 'react';
import Card from '../../../shared/components/ui/Card';
import './ContextProbe.css';

/**
 * Phase 1: 精准筛查 - 重构版
 * 极简布局，专注做题
 */
const ContextProbe = ({ word, onComplete }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const context = word.context?.[0] || {};

  // 重置状态
  useEffect(() => {
    setSelectedOption(null);
    setSubmitted(false);
    setIsCorrect(false);
  }, [word.id]);

  // 生成选项（1个正确 + 2个干扰）
  const options = useMemo(() => {
    const correctMeaning = word.meaning?.chinese || '未知';
    
    // 干扰项
    const commonDistractors = [
      '采用', '接受', '影响', '尝试', '改变', '发展', 
      '创造', '保护', '破坏', '建立', '维持', '提供'
    ];
    
    const distractors = [];
    const shuffled = [...commonDistractors].sort(() => Math.random() - 0.5);
    
    for (const distractor of shuffled) {
      if (distractor !== correctMeaning && distractors.length < 2) {
        distractors.push(distractor);
      }
    }
    
    const allOptions = [
      { id: 0, text: correctMeaning, isCorrect: true },
      { id: 1, text: distractors[0], isCorrect: false },
      { id: 2, text: distractors[1], isCorrect: false }
    ];
    
    return allOptions.sort(() => Math.random() - 0.5);
  }, [word]);

  // 高亮目标单词的例句
  const highlightedSentence = useMemo(() => {
    const sentence = context.sentence || '';
    const targetWord = word.word;
    
    const regex = new RegExp(`\\b(${targetWord})\\b`, 'gi');
    const parts = sentence.split(regex);
    
    return parts.map((part, index) => {
      if (part.toLowerCase() === targetWord.toLowerCase()) {
        return <span key={index} className="context-probe__highlight">{part}</span>;
      }
      return part;
    });
  }, [context.sentence, word.word]);

  const handleOptionClick = (optionId) => {
    if (!submitted) {
      setSelectedOption(optionId);
      
      // 自动提交逻辑，提升速度
      const selected = options.find(opt => opt.id === optionId);
      const correct = selected?.isCorrect || false;
      
      setIsCorrect(correct);
      setSubmitted(true);
      
      // 快速切换到下一题
      setTimeout(() => {
        onComplete(correct);
      }, 300);
    }
  };

  return (
    <div className="context-probe-v2">
      {/* 例句卡片 - 模仿图2 */}
      <Card variant="glass" padding="xl" className="sentence-card">
        <div className="sentence-header">
          <span className="icon">📖</span>
          例句：
        </div>
        <div className="sentence-text">
          {highlightedSentence}
        </div>
      </Card>

      {/* 提问 */}
      <div className="question-prompt">
        <span className="icon">🧐</span>
        结合语境，<span className="target-word">{word.word}</span> 是什么意思？
      </div>

      {/* 选项列表 */}
      <div className="options-list">
        {options.map((option, index) => {
          let statusClass = '';
          if (submitted) {
            if (option.isCorrect) statusClass = 'is-correct';
            else if (selectedOption === option.id) statusClass = 'is-wrong';
          } else if (selectedOption === option.id) {
            statusClass = 'is-selected';
          }

          return (
            <button
              key={option.id}
              className={`option-button ${statusClass}`}
              onClick={() => handleOptionClick(option.id)}
              disabled={submitted}
            >
              <span className="letter">{String.fromCharCode(65 + index)}.</span>
              <span className="text">{option.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ContextProbe;
