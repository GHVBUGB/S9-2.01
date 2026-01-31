import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import useClassroomStore from '../../../../shared/store/useClassroomStore';
import './GhostSpelling.css';

/**
 * L3 幽灵拼写 (Ghost Spelling) - 极简重构版
 * 设计原则：无卡片、大留白、视觉聚焦、高级感
 * 核心逻辑：形(残缺)+义 → 形(完整)
 * 
 * 界面：只显示单词骨架（部分字母 + 下划线）
 * 交互：键盘直接输入，自动跳转，即时反馈
 * 
 * @param {Object} word - 当前单词数据
 * @param {Function} onComplete - 完成回调 (isCorrect) => void
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
  
  // 每个空位的输入值
  const [letters, setLetters] = useState([]);
  const inputRefs = useRef([]);
  const hasAutoSubmitted = useRef(false);
  
  // 教师端：从 store 的 inputText 解析出字母数组
  const displayLetters = readonly 
    ? studentState.inputText.split('').concat(Array(100).fill('')).slice(0, letters.length || 10)
    : letters;

  // 计算单词结构：哪些位置显示字母，哪些位置需要填写
  const wordStructure = useMemo(() => {
    if (!word?.word) return [];
    const w = word.word;
    const len = w.length;
    
    // 只显示首尾字母
    return w.split('').map((char, index) => ({
      char,
      index,
      isVisible: index === 0 || index === len - 1,
      isBlank: index !== 0 && index !== len - 1,
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
    hasAutoSubmitted.current = false;
    if (!readonly) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 300);
    }
  }, [word.id, blankCount]);

  // 当 submitted 变为 false 时（重试），重置自动提交标记
  useEffect(() => {
    if (!submitted) {
      hasAutoSubmitted.current = false;
    }
  }, [submitted]);

  // 监听 letters 变化，检查是否全部填完并自动提交
  useEffect(() => {
    if (readonly || submitted || hasAutoSubmitted.current) return;
    if (blankCount === 0) return;
    
    // 检查是否全部填完（只要有 blankCount 个非空字母）
    const filledCount = letters.filter(l => l !== '').length;
    const allFilled = filledCount === blankCount;
    
    console.log('📝 [GhostSpelling] 检查填写状态:', {
      letters,
      filledCount,
      blankCount,
      allFilled
    });
    
    if (allFilled) {
      hasAutoSubmitted.current = true;
      
      const userInput = letters.join('').toLowerCase();
      const expectedInput = correctLetters.join('');
      const correct = userInput === expectedInput;
      
      console.log('🎯 [GhostSpelling] 自动提交:', {
        userInput,
        expectedInput,
        isCorrect: correct
      });
      
      // 延迟一点提交，让用户看到最后输入的字母
      setTimeout(() => {
        studentSubmitAnswer(correct);
        
        setTimeout(() => {
          onComplete(correct);
        }, 1000);
      }, 200);
    }
  }, [letters]);

  // 监听教师命令
  useEffect(() => {
    if (teacherState.command === 'repeat' && !readonly) {
      resetStudentState();
      setLetters(Array(blankCount).fill(''));
      hasAutoSubmitted.current = false;
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 300);
    }
  }, [teacherState.command]);

  // 教师显示答案
  useEffect(() => {
    if (teacherState.showAnswer && !submitted && !readonly) {
      setLetters(correctLetters);
      studentInputText(correctLetters.join(''));
      hasAutoSubmitted.current = true;
      setTimeout(() => {
        studentSubmitAnswer(true);
        setTimeout(() => onComplete(true), 800);
      }, 300);
    }
  }, [teacherState.showAnswer]);

  // 处理单个输入框变化
  const handleLetterChange = useCallback((index, value) => {
    if (submitted || readonly) return;
    
    const newValue = value.slice(-1).toLowerCase();
    
    setLetters(prev => {
      const newLetters = [...prev];
      newLetters[index] = newValue;
      studentInputText(newLetters.join(''));
      return newLetters;
    });

    // 自动跳到下一个输入框
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
    }
  }, [submitted, letters, blankCount, studentInputText]);

  // 渲染单词骨架
  let blankIndex = 0;
  
  // 防止 word 为空
  if (!word?.word || wordStructure.length === 0) {
    return <div className="ghost-spelling">加载中...</div>;
  }
  
  return (
    <div className="ghost-spelling">
      {/* 中文翻译 + 词性 */}
      <p className="ghost-spelling__meaning">
        {word.meaning?.chinese || word.meaning}
        <span className="ghost-spelling__pos">{word.core?.partOfSpeech}</span>
      </p>
      
      {/* 单词骨架 - 超大字体，居中显示 */}
      <div className="ghost-spelling__skeleton">
        {wordStructure.map((item, index) => {
          if (item.isVisible) {
            // 固定显示的字母
            return (
              <span 
                key={index} 
                className={`ghost-spelling__char ghost-spelling__char--fixed ${
                  submitted ? (isCorrect ? 'is-correct' : 'is-wrong') : ''
                }`}
              >
                {item.char}
              </span>
            );
          } else {
            // 可输入的空位
            const currentBlankIndex = blankIndex++;
            const inputValue = displayLetters[currentBlankIndex] || '';
            const isInputCorrect = submitted && inputValue.toLowerCase() === item.char.toLowerCase();
            const isInputWrong = submitted && inputValue.toLowerCase() !== item.char.toLowerCase();
            
            return (
              <span key={index} className="ghost-spelling__blank">
                <input
                  ref={el => inputRefs.current[currentBlankIndex] = el}
                  type="text"
                  className={`ghost-spelling__input ${
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
                <span className={`ghost-spelling__underline ${isInputWrong ? 'is-wrong' : ''}`} />
              </span>
            );
          }
        })}
      </div>

      {/* 反馈图标 */}
      {submitted && (
        <div className={`ghost-spelling__feedback ${isCorrect ? 'is-correct' : 'is-wrong'}`}>
          {isCorrect ? (
            <CheckCircle2 size={32} />
          ) : (
            <XCircle size={32} />
          )}
        </div>
      )}

      {/* 只读模式提示 */}
      {readonly && (
        <p className="ghost-spelling__readonly">观察学生操作</p>
      )}
    </div>
  );
};

export default GhostSpelling;
