import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import Button from '../../../../shared/components/ui/Button';
import useClassroomStore from '../../../../shared/store/useClassroomStore';
import './GhostSpelling.css';

/**
 * L3 幽灵拼写（重构版）
 * 只显示首尾字母，中间挖空让学生直接填写
 * 每个空位是独立的输入框，自动跳转
 * 
 * @param {boolean} readonly - 是否只读模式（教师端使用）
 */
const GhostSpelling = ({ word, onComplete, readonly = false }) => {
  const { 
    studentState, 
    teacherState,
    studentInputText,
    studentSubmitAnswer,
    resetStudentState,
  } = useClassroomStore();

  const submitted = studentState.isSubmitted;
  const isCorrect = studentState.isCorrect;
  
  // 每个空位的输入值（学生端用本地状态，教师端从 store 读取）
  const [letters, setLetters] = useState([]);
  const inputRefs = useRef([]);
  
  // 教师端：从 store 的 inputText 解析出字母数组
  const displayLetters = readonly 
    ? studentState.inputText.split('').concat(Array(100).fill('')).slice(0, letters.length || 10)
    : letters;

  // 计算单词结构：哪些位置显示字母，哪些位置需要填写
  const wordStructure = useMemo(() => {
    const w = word.word;
    const len = w.length;
    
    // 只显示首尾字母
    return w.split('').map((char, index) => ({
      char,
      index,
      isVisible: index === 0 || index === len - 1, // 只有首尾可见
      isBlank: index !== 0 && index !== len - 1,   // 中间都是空白
    }));
  }, [word]);

  // 需要填写的空位数量
  const blankCount = wordStructure.filter(s => s.isBlank).length;
  
  // 需要填写的正确字母
  const correctLetters = useMemo(() => {
    return wordStructure
      .filter(s => s.isBlank)
      .map(s => s.char.toLowerCase());
  }, [wordStructure]);

  // 重置状态
  useEffect(() => {
    if (!readonly) {
      resetStudentState();
    }
    setLetters(Array(blankCount).fill(''));
    // 自动聚焦第一个输入框（仅学生端）
    if (!readonly) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 300);
    }
  }, [word.id, blankCount, resetStudentState, readonly]);

  // 监听教师命令
  useEffect(() => {
    if (teacherState.command === 'repeat' && !readonly) {
      resetStudentState();
      setLetters(Array(blankCount).fill(''));
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 300);
    }
  }, [teacherState.command, blankCount, resetStudentState, readonly]);

  // 教师显示答案（仅学生端响应）
  useEffect(() => {
    if (teacherState.showAnswer && !submitted && !readonly) {
      setLetters(correctLetters);
      studentInputText(correctLetters.join(''));
      setTimeout(() => {
        studentSubmitAnswer(true);
        setTimeout(() => onComplete(true), 1500);
      }, 500);
    }
  }, [teacherState.showAnswer, readonly]);

  // 处理单个输入框变化（仅学生端）
  const handleLetterChange = useCallback((index, value) => {
    if (submitted || readonly) return;
    
    // 只取最后一个字符，转小写
    const newValue = value.slice(-1).toLowerCase();
    
    setLetters(prev => {
      const newLetters = [...prev];
      newLetters[index] = newValue;
      // 同步到 store
      studentInputText(newLetters.join(''));
      return newLetters;
    });

    // 如果输入了字符，自动跳到下一个输入框
    if (newValue && index < blankCount - 1) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 0);
    }
  }, [submitted, readonly, blankCount, studentInputText]);

  // 处理键盘事件
  const handleKeyDown = useCallback((index, e) => {
    if (submitted) return;

    if (e.key === 'Backspace') {
      if (letters[index] === '' && index > 0) {
        // 当前为空，删除上一个并跳回
        e.preventDefault();
        setLetters(prev => {
          const newLetters = [...prev];
          newLetters[index - 1] = '';
          studentInputText(newLetters.join(''));
          return newLetters;
        });
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < blankCount - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === 'Enter') {
      handleSubmit();
    }
  }, [submitted, letters, blankCount, studentInputText]);

  // 提交答案
  const handleSubmit = () => {
    const userInput = letters.join('').toLowerCase();
    const expectedInput = correctLetters.join('');
    
    if (userInput.length !== expectedInput.length) return;
    
    const correct = userInput === expectedInput;
    
    console.log('🎯 [GhostSpelling] 提交答案:', {
      userInput,
      expectedInput,
      isCorrect: correct
    });
    
    studentSubmitAnswer(correct);
    
    // 无论对错都进入下一题，错题会在轮次结束后统一重做
    setTimeout(() => {
      onComplete(correct);
    }, 1500);
  };

  // 检查是否所有空位都已填写
  const allFilled = letters.every(l => l !== '');

  // 渲染单词骨架
  let blankIndex = 0;
  
  return (
    <div className={`ghost-spelling ${readonly ? 'ghost-spelling--readonly' : ''}`}>
      {/* 只读模式提示 */}
      {readonly && (
        <div className="ghost-spelling__readonly-hint">
          👀 教师观看模式 - 等待学生输入
        </div>
      )}
      
      {/* 单词骨架 - 直接填写 */}
      <div className="ghost-spelling__word-container">
        <div className="ghost-spelling__word">
          {wordStructure.map((item, index) => {
            if (item.isVisible) {
              // 显示固定字母
              return (
                <span 
                  key={index} 
                  className={`ghost-spelling__letter ghost-spelling__letter--fixed ${
                    submitted ? (isCorrect ? 'is-correct' : 'is-wrong') : ''
                  }`}
                >
                  {item.char}
                </span>
              );
            } else {
              // 可编辑的空位
              const currentBlankIndex = blankIndex++;
              const inputValue = displayLetters[currentBlankIndex] || '';
              const isInputCorrect = submitted && inputValue.toLowerCase() === item.char.toLowerCase();
              const isInputWrong = submitted && inputValue.toLowerCase() !== item.char.toLowerCase();
              
              return (
                <input
                  key={index}
                  ref={el => inputRefs.current[currentBlankIndex] = el}
                  type="text"
                  className={`ghost-spelling__letter ghost-spelling__letter--input ${
                    inputValue ? 'has-value' : ''
                  } ${isInputCorrect ? 'is-correct' : ''} ${isInputWrong ? 'is-wrong' : ''} ${readonly ? 'is-readonly' : ''}`}
                  value={inputValue}
                  onChange={(e) => handleLetterChange(currentBlankIndex, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(currentBlankIndex, e)}
                  disabled={submitted || readonly}
                  maxLength={2}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  readOnly={readonly}
                />
              );
            }
          })}
        </div>
      </div>

      {/* 提交按钮（仅学生端显示） */}
      {!submitted && !readonly && (
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!allFilled}
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
                <span>正确答案是 <strong>{word.word}</strong></span>
                <span className="ghost-spelling__feedback-retry">稍后重做</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default GhostSpelling;
