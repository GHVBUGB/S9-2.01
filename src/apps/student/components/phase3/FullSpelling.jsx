import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, XCircle, Heart, AlertTriangle } from 'lucide-react';
import Button from '../../../../shared/components/ui/Button';
import Badge from '../../../../shared/components/ui/Badge';
import useClassroomStore from '../../../../shared/store/useClassroomStore';
import './FullSpelling.css';

/**
 * L4 全拼写验收组件
 * 无提示盲打：语境例句 + 空白输入框
 * 
 * 判定逻辑：
 * - 拼对 → Yellow (变灯成功)
 * - 拼错1次 → 再试一次
 * - 拼错2次 → Pending (打回 P2)
 * 
 * @param {boolean} readonly - 是否只读模式（教师端使用）
 */
const FullSpelling = ({ word, wordSource, onComplete, readonly = false }) => {
  // 从 store 获取状态
  const {
    studentState,
    teacherState,
    studentInputText,
    studentSubmitAnswer,
    resetStudentState,
  } = useClassroomStore();

  // 使用 store 状态
  const inputValue = studentState.inputText;
  const submitted = studentState.isSubmitted;
  const isCorrect = studentState.isCorrect;

  // 本地状态：尝试次数
  const [attempts, setAttempts] = useState(0);
  const [showRetryHint, setShowRetryHint] = useState(false);
  const maxAttempts = 2;

  const inputRef = useRef(null);

  // 重置状态（仅学生端）
  useEffect(() => {
    if (!readonly) {
      resetStudentState();
      setAttempts(0);
      setShowRetryHint(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [word.id, resetStudentState, readonly]);

  // 监听教师命令（仅学生端响应）
  useEffect(() => {
    if (teacherState.command === 'repeat' && !readonly) {
      // 重做本题
      resetStudentState();
      setAttempts(0);
      setShowRetryHint(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [teacherState.command, resetStudentState, readonly]);
  
  // 单独监听教师显示答案（仅学生端响应）
  useEffect(() => {
    if (teacherState.showAnswer && !submitted && !readonly) {
      // 教师点击显示答案 - 自动填入正确答案并提交
      studentInputText(word.word);
      setTimeout(() => {
        studentSubmitAnswer(true);
        setTimeout(() => onComplete(true, 'yellow'), 1500);
      }, 500);
    }
  }, [teacherState.showAnswer, readonly]);

  // 获取短语，挖空目标单词
  const getBlankPhrase = () => {
    const context = word.context?.[0] || {};
    const phrase = context.phrase || '';
    const targetWord = word.word;

    if (!targetWord) return { before: phrase, after: '' };

    // 创建正则表达式匹配目标单词（不区分大小写）
    const regex = new RegExp(`\\b${targetWord}\\b`, 'i');
    const match = phrase.match(regex);

    if (match) {
      const index = match.index;
      const before = phrase.slice(0, index);
      const after = phrase.slice(index + targetWord.length);
      return { before, after, blankLength: targetWord.length };
    }

    return { before: phrase, after: '', blankLength: targetWord.length };
  };

  const { before, after, blankLength } = getBlankPhrase();
  const context = word.context?.[0] || {};

  // 处理输入（仅学生端）
  const handleInputChange = (e) => {
    if (!submitted && !readonly) {
      studentInputText(e.target.value.toLowerCase());
    }
  };

  // 提交答案（学生点击提交验收按钮，仅学生端）
  const handleSubmit = () => {
    if (inputValue.trim() === '' || readonly) return;

    const userInput = inputValue.toLowerCase().trim();
    const expectedWord = word.word.toLowerCase();
    const correct = userInput === expectedWord;
    const newAttempts = attempts + 1;

    console.log('🎯 [FullSpelling] 提交答案:', {
      userInput,
      expectedWord,
      isCorrect: correct,
      attempt: newAttempts
    });

    if (correct) {
      // 拼对 → Yellow
      studentSubmitAnswer(true);
      setTimeout(() => {
        onComplete(true, 'yellow');
      }, 1500);
    } else {
      // 拼错
      setAttempts(newAttempts);

      if (newAttempts >= maxAttempts) {
        // 第2次拼错 → 打回 Pending
        studentSubmitAnswer(false);
        setTimeout(() => {
          onComplete(false, 'pending');
        }, 2000);
      } else {
        // 第1次拼错 → 再试一次
        setShowRetryHint(true);
        resetStudentState();
        setTimeout(() => {
          setShowRetryHint(false);
          inputRef.current?.focus();
        }, 1500);
      }
    }
  };

  // 处理回车提交
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // 渲染剩余机会
  const renderHearts = () => {
    const remaining = maxAttempts - attempts;
    return (
      <div className="full-spelling__hearts">
        {Array.from({ length: maxAttempts }).map((_, i) => (
          <Heart
            key={i}
            size={20}
            className={`full-spelling__heart ${i < remaining ? 'full-spelling__heart--active' : 'full-spelling__heart--lost'}`}
            fill={i < remaining ? 'var(--color-red)' : 'none'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={`full-spelling ${readonly ? 'full-spelling--readonly' : ''}`}>
      {/* 教师端只读提示 */}
      {readonly && (
        <div className="full-spelling__readonly-hint">
          👀 教师观看模式 - 实时监控学生输入
        </div>
      )}
      
      {/* 头部信息 - 只保留剩余机会 */}
      <div className="full-spelling__header">
        <div className="full-spelling__chances">
          <span className="full-spelling__chances-label">剩余机会:</span>
          {renderHearts()}
        </div>
      </div>

      {/* 短语 */}
      <div className="full-spelling__context">
        <p className="full-spelling__context-label">📖 短语:</p>
        <div className="full-spelling__sentence">
          <span className="full-spelling__sentence-text">
            {before}
            <span className="full-spelling__blank">[ _______ ]</span>
            {after}
          </span>
        </div>
        <p className="full-spelling__sentence-cn">{context.phraseCn}</p>
      </div>

      {/* 输入区域 */}
      <div className="full-spelling__input-section">
        <div className="full-spelling__input-wrapper">
          <input
            ref={inputRef}
            type="text"
            className={`full-spelling__input ${
              submitted
                ? isCorrect
                  ? 'full-spelling__input--correct'
                  : 'full-spelling__input--wrong'
                : showRetryHint
                  ? 'full-spelling__input--retry'
                  : ''
            } ${readonly ? 'full-spelling__input--readonly' : ''}`}
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={readonly ? '等待学生输入...' : '输入完整单词...'}
            disabled={submitted || readonly}
            readOnly={readonly}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          {submitted && (
            <div className="full-spelling__input-icon">
              {isCorrect ? (
                <CheckCircle2 size={24} color="var(--color-green)" />
              ) : (
                <XCircle size={24} color="var(--color-red)" />
              )}
            </div>
          )}
        </div>

        {/* 字母分隔显示 */}
        {inputValue && !submitted && (
          <div className="full-spelling__letter-display">
            {inputValue.split('').map((letter, index) => (
              <span key={index} className="full-spelling__letter">
                {letter}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 提交按钮（仅学生端显示） */}
      {!submitted && !showRetryHint && !readonly && (
        <Button
          variant="primary"
          onClick={() => handleSubmit()}
          disabled={inputValue.trim() === ''}
          className="full-spelling__submit-btn"
        >
          🎯 提交验收
        </Button>
      )}

      {/* 重试提示 */}
      {showRetryHint && (
        <div className="full-spelling__retry-hint">
          <AlertTriangle size={20} />
          <span>拼写错误，再试一次！正确答案是 <strong>{blankLength}</strong> 个字母</span>
        </div>
      )}

      {/* 反馈信息 */}
      {submitted && (
        <div className={`full-spelling__feedback ${isCorrect ? 'full-spelling__feedback--correct' : 'full-spelling__feedback--wrong'}`}>
          {isCorrect ? (
            <>
              <CheckCircle2 size={28} />
              <div className="full-spelling__feedback-content">
                <h4>🎉 验收通过！</h4>
                <p>单词 <strong>{word.word}</strong> 变灯 → 🟡 Yellow</p>
                <p className="full-spelling__feedback-sub">进入 [课后 AI 复习池]</p>
              </div>
            </>
          ) : (
            <>
              <XCircle size={28} />
              <div className="full-spelling__feedback-content">
                <h4>😔 验收未通过</h4>
                <p>正确答案: <strong>{word.word}</strong></p>
                <p className="full-spelling__feedback-sub">
                  {wordSource === 'p1_skip' 
                    ? '🏃 P1跳级生 → 去 P2 补课' 
                    : '📚 P2训练生 → 踢回 P2 重练'}
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FullSpelling;

