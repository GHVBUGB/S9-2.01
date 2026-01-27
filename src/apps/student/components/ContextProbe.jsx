import React, { useState, useMemo, useEffect } from 'react';
import { CheckCircle2, XCircle, Volume2 } from 'lucide-react';
import Button from '../../../shared/components/ui/Button';
import './ContextProbe.css';

/**
 * Phase 1: 语境探针 (Context Probe) - 重构版 UI
 * 模仿 Jarvis 风格，极致简约
 * 
 * @param {Object} word - 当前单词数据
 * @param {Function} onComplete - 完成回调 (isCorrect) => void
 * @param {boolean} readonly - 是否只读模式（教师端使用）
 */
const ContextProbe = ({ word, onComplete, readonly = false }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // 当单词变化时，重置所有状态
  useEffect(() => {
    setSelectedOption(null);
    setSubmitted(false);
    setIsCorrect(false);
  }, [word.id]);

  // 获取例句（使用第一个简单例句）
  const context = word.context?.[0] || {};
  
  // 生成中文释义选项（4选1）
  const options = useMemo(() => {
    const correctMeaning = word.meaning?.chinese || '未知';
    
    // 干扰释义词库
    const commonDistractors = [
      '采用', '接受', '影响', '尝试', '改变', '发展', 
      '创造', '保护', '破坏', '建立', '维持', '提供',
      '紧张的', '有礼貌的', '普通的', '现代的', '古老的', '重要的'
    ];
    
    // 随机选择3个干扰项（4选1需要3个干扰项）
    const distractors = commonDistractors
      .filter(d => d !== correctMeaning) // 排除正确答案
      .sort(() => Math.random() - 0.5)
      .slice(0, 3); // 取3个
    
    const allOptions = [
      { id: 0, text: correctMeaning, isCorrect: true },
      { id: 1, text: distractors[0], isCorrect: false },
      { id: 2, text: distractors[1], isCorrect: false },
      { id: 3, text: distractors[2], isCorrect: false }
    ];
    
    // 随机打乱顺序
    return allOptions.sort(() => Math.random() - 0.5);
  }, [word]);

  // 高亮目标单词的短语
  const highlightedPhrase = useMemo(() => {
    const phrase = context.phrase || '';
    const targetWord = word.word;
    
    const regex = new RegExp(`\\b(${targetWord})\\b`, 'gi');
    const parts = phrase.split(regex);
    
    return parts.map((part, index) => {
      if (part.toLowerCase() === targetWord.toLowerCase()) {
        return <span key={index} className="context-probe__highlight">{part}</span>;
      }
      return part;
    });
  }, [context.phrase, word.word]);

  // 处理选项点击
  const handleOptionClick = (optionId) => {
    if (!submitted && !readonly) {
      setSelectedOption(optionId);
    }
  };

  // 提交答案
  const handleSubmit = () => {
    if (selectedOption === null) return;
    
    const selected = options.find(opt => opt.id === selectedOption);
    const correct = selected?.isCorrect === true;
    
    console.log('🎯 [ContextProbe] 提交答案:', {
      selectedOption,
      selectedText: selected?.text,
      selectedIsCorrect: selected?.isCorrect,
      isCorrect: correct
    });
    
    setIsCorrect(correct);
    setSubmitted(true);
    
    setTimeout(() => {
      onComplete(correct);
    }, 300); // 快速切换到下一题
  };

  return (
    <div className="context-probe">
      {/* 核心内容区域：模仿图1的居中卡片感 */}
      <div className="context-probe__main-card">
        {/* 短语区域 - 极简设计 */}
        <div className="context-probe__sentence-area">
          <div className="context-probe__sentence-header">
            <span className="context-probe__icon-book">📖</span>
            短语：
          </div>
          <div className="context-probe__sentence">
            {highlightedPhrase}
          </div>
        </div>

        {/* 提问区域 */}
        <div className="context-probe__question-box">
          <div className="context-probe__question-prompt">
            <span className="context-probe__icon-hint">🧐</span>
            结合语境，<span className="context-probe__word-target">{word.word}</span> 是什么意思？
          </div>
        </div>

        {/* 选项列表 - 模仿图1的按钮质感 */}
        <div className="context-probe__options-grid">
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
                className={`context-probe__option-btn ${statusClass} ${readonly ? 'is-readonly' : ''}`}
                onClick={() => handleOptionClick(option.id)}
                disabled={submitted || readonly}
              >
                <span className="context-probe__option-letter">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="context-probe__option-text">
                  {option.text}
                </span>
                {submitted && option.isCorrect && <CheckCircle2 size={18} className="icon-status" />}
                {submitted && selectedOption === option.id && !option.isCorrect && <XCircle size={18} className="icon-status" />}
              </button>
            );
          })}
        </div>

        {/* 确认按钮 - 只读模式下不显示 */}
        {!submitted && !readonly && (
          <div className="context-probe__action">
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className="context-probe__confirm-btn"
            >
              确认答案
            </Button>
          </div>
        )}
        
        {/* 只读模式提示 */}
        {readonly && (
          <div className="context-probe__readonly-hint">
            👀 教师观看模式 - 等待学生作答
          </div>
        )}

      </div>
    </div>
  );
};

export default ContextProbe;
