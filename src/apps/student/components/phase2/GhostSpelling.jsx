import React, { useState, useEffect, useMemo, useRef } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import Button from '../../../../shared/components/ui/Button';
import useClassroomStore from '../../../../shared/store/useClassroomStore';
import './GhostSpelling.css';

/**
 * L3 幽灵拼写
 * 骨架提示 + 补全字母
 * 目的：形 → 形，架梯子
 */
const GhostSpelling = ({ word, onComplete }) => {
  // ✅ 从 store 获取状态和 actions
  const { 
    studentState, 
    teacherState,
    studentInputText,
    studentSubmitAnswer,
    resetStudentState,
  } = useClassroomStore();

  // ✅ 使用 store 的状态
  const inputValue = studentState.inputText;
  const submitted = studentState.isSubmitted;
  const isCorrect = studentState.isCorrect;
  
  const inputRef = useRef(null);

  // 重置状态
  useEffect(() => {
    resetStudentState();
    // 自动聚焦输入框
    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  }, [word.id, resetStudentState]);

  // ✅ 监听教师命令
  useEffect(() => {
    if (!teacherState.command) return;

    if (teacherState.command === 'repeat') {
      // 教师点击重做
      resetStudentState();
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    } else if (teacherState.showAnswer && !submitted) {
      // 教师点击显示答案
      studentInputText(missingLetters);
      setTimeout(() => {
        handleSubmit(true); // 强制提交为正确
      }, 500);
    }
  }, [teacherState.command, teacherState.showAnswer]);

  // 生成骨架（保留首尾和部分字母）
  const skeleton = useMemo(() => {
    const w = word.word;
    const len = w.length;
    
    if (len <= 3) {
      // 短词：只显示首字母
      return w[0] + ' _'.repeat(len - 1);
    } else if (len <= 5) {
      // 中等词：显示首尾
      return w[0] + ' _ '.repeat(len - 2) + w[len - 1];
    } else {
      // 长词：显示首尾和中间一个字母
      const midIndex = Math.floor(len / 2);
      let result = '';
      for (let i = 0; i < len; i++) {
        if (i === 0 || i === len - 1 || i === midIndex) {
          result += w[i];
        } else {
          result += ' _ ';
        }
      }
      return result;
    }
  }, [word]);

  // 计算需要填写的字母
  const missingLetters = useMemo(() => {
    const w = word.word;
    const len = w.length;
    
    if (len <= 3) {
      return w.slice(1);
    } else if (len <= 5) {
      return w.slice(1, -1);
    } else {
      const midIndex = Math.floor(len / 2);
      let missing = '';
      for (let i = 0; i < len; i++) {
        if (i !== 0 && i !== len - 1 && i !== midIndex) {
          missing += w[i];
        }
      }
      return missing;
    }
  }, [word]);

  // 处理输入
  const handleInputChange = (e) => {
    if (!submitted) {
      studentInputText(e.target.value.toLowerCase()); // ✅ 更新到 store，教师端立即看到
    }
  };

  // 提交答案
  const handleSubmit = (forceCorrect = false) => {
    if (inputValue.trim() === '') return;
    
    // 检查输入是否正确
    const correct = forceCorrect || (inputValue.toLowerCase() === missingLetters.toLowerCase());
    
    studentSubmitAnswer(correct); // ✅ 更新到 store，教师端立即看到
    
    setTimeout(() => {
      onComplete(correct);
      if (!correct) {
        // 错误时重试
        setTimeout(() => {
          resetStudentState();
          inputRef.current?.focus();
        }, 2500);
      }
    }, 1500);
  };

  // 处理回车提交
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="ghost-spelling">
      {/* 提示信息 */}
      <div className="ghost-spelling__hint">
        <span className="ghost-spelling__hint-icon">💡</span>
        <span className="ghost-spelling__hint-text">
          提示：{word.meaning?.definitionCn} ({word.meaning?.partOfSpeech})
        </span>
      </div>

      {/* 骨架展示 */}
      <div className="ghost-spelling__skeleton-container">
        <div className="ghost-spelling__skeleton">
          {skeleton.split('').map((char, index) => (
            <span 
              key={index} 
              className={`ghost-spelling__char ${char === '_' ? 'ghost-spelling__char--blank' : 'ghost-spelling__char--letter'}`}
            >
              {char === '_' ? '_' : char}
            </span>
          ))}
        </div>
      </div>

      {/* 输入区域 */}
      <div className="ghost-spelling__input-section">
        <div className="ghost-spelling__instruction">
          补全缺失的字母：
        </div>
        <div className="ghost-spelling__input-wrapper">
          <input
            ref={inputRef}
            type="text"
            className={`ghost-spelling__input ${
              submitted 
                ? isCorrect 
                  ? 'ghost-spelling__input--correct' 
                  : 'ghost-spelling__input--wrong'
                : ''
            }`}
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={`输入 ${missingLetters.length} 个字母...`}
            disabled={submitted}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          {submitted && (
            <div className="ghost-spelling__input-icon">
              {isCorrect ? (
                <CheckCircle2 size={24} color="var(--color-green)" />
              ) : (
                <XCircle size={24} color="var(--color-red)" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* 提交按钮 */}
      {!submitted && (
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={inputValue.trim() === ''}
          className="ghost-spelling__submit-btn"
        >
          检查
        </Button>
      )}

      {/* 反馈信息 */}
      {submitted && (
        <div className={`ghost-spelling__feedback ${isCorrect ? 'ghost-spelling__feedback--correct' : 'ghost-spelling__feedback--wrong'}`}>
          {isCorrect ? (
            <>
              <CheckCircle2 size={24} />
              <div className="ghost-spelling__feedback-content">
                <span>正确！🎉</span>
                <span className="ghost-spelling__feedback-word">{word.word}</span>
              </div>
            </>
          ) : (
            <>
              <XCircle size={24} />
              <div className="ghost-spelling__feedback-content">
                <span>错误，正确答案是 <strong>{missingLetters}</strong></span>
                <span className="ghost-spelling__feedback-word">{word.word}</span>
                <span className="ghost-spelling__feedback-retry">再试一次</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default GhostSpelling;

