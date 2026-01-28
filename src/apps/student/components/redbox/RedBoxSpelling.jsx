import React, { useState, useEffect, useRef, useMemo } from 'react';
import useClassroomStore from '../../../../shared/store/useClassroomStore';
import Button from '../../../../shared/components/ui/Button';
import Card from '../../../../shared/components/ui/Card';
import { CheckCircle2, XCircle, Heart, Skull, RotateCcw } from 'lucide-react';
import './RedBoxSpelling.css';

/**
 * Step 3: Red Box L4 验收
 * 
 * 红词专属验收：
 * - 语境例句 + 无提示输入框
 * - 2次机会：第1次错误提示重试，第2次错误则"回炉"
 * - 通过：Red → Yellow（下课后进入艾宾浩斯复习）
 * - 失败：保持 Red，下节课继续攻坚
 */
const RedBoxSpelling = ({ word, onComplete }) => {
  const {
    studentState,
    teacherState,
    studentInputText,
    studentSubmitAnswer,
    resetStudentState,
  } = useClassroomStore();

  const [attempts, setAttempts] = useState(2);
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef(null);

  const inputValue = studentState.inputText || '';
  const submitted = studentState.isSubmitted;
  const isCorrect = studentState.isCorrect;

  // 语境例句，将目标词替换为挖空
  const contextSentence = useMemo(() => {
    if (!word.context || word.context.length === 0) return '';
    const sentence = word.context[0].sentence;
    return sentence.replace(new RegExp(`\\b${word.word}\\b`, 'gi'), '_______');
  }, [word]);

  // 重置状态
  useEffect(() => {
    resetStudentState();
    setAttempts(2);
    setShowHint(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  }, [word.id, resetStudentState]);

  // 监听教师命令
  useEffect(() => {
    if (teacherState.command === 'repeat') {
      resetStudentState();
      setAttempts(2);
      setShowHint(false);
      inputRef.current?.focus();
    } else if (teacherState.command === 'showHint') {
      // 教师选择显示提示（降低难度）
      setShowHint(true);
    } else if (teacherState.showAnswer) {
      // 教师直接显示答案
      studentInputText(word.word);
      studentSubmitAnswer(true);
      setTimeout(() => onComplete(true), 1500);
    }
  }, [teacherState, word, studentInputText, studentSubmitAnswer, resetStudentState, onComplete]);

  // 处理输入
  const handleInputChange = (e) => {
    if (!submitted) {
      studentInputText(e.target.value);
    }
  };

  // 提交答案
  const handleSubmit = () => {
    if (inputValue.trim() === '') return;

    const correct = inputValue.toLowerCase().trim() === word.word.toLowerCase();
    studentSubmitAnswer(correct);

    if (correct) {
      // 通过！红词攻克成功
      console.log(`Red Box 验收通过: ${word.word}`);
      setTimeout(() => onComplete(true), 2000);
    } else {
      // 错误
      const remainingAttempts = attempts - 1;
      setAttempts(remainingAttempts);

      if (remainingAttempts <= 0) {
        // 机会用尽，回炉
        console.log(`💀 Red Box 验收失败: ${word.word}，回炉重造`);
        setTimeout(() => onComplete(false), 2500);
      } else {
        // 还有机会
        setTimeout(() => {
          resetStudentState();
          setShowHint(true); // 第二次自动显示提示
          inputRef.current?.focus();
        }, 2000);
      }
    }
  };

  // 处理回车提交
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // 生成幽灵提示（首字母 + 骨架）
  const generateGhostHint = () => {
    if (!showHint) return null;
    const letters = word.word.split('');
    return letters.map((letter, idx) => {
      // 显示首字母和最后一个字母
      if (idx === 0 || idx === letters.length - 1) {
        return letter;
      }
      return '_';
    }).join(' ');
  };

  return (
    <div className="redbox-spelling">
      <div className="redbox-spelling__title">
        Step 3: L4 验收
        <span className="redbox-spelling__title-desc">完整拼写验收</span>
      </div>

      {/* 语境例句 */}
      <Card variant="outline" padding="md" className="redbox-spelling__context">
        <div className="redbox-spelling__context-label">语境例句</div>
        <p className="redbox-spelling__context-sentence">{contextSentence}</p>
        <p className="redbox-spelling__context-translation">
          {word.context?.[0]?.sentenceCn || word.meaning?.definitionCn}
        </p>
      </Card>

      {/* 提示区（可选显示） */}
      {showHint && (
        <div className="redbox-spelling__hint">
          <span className="redbox-spelling__hint-label">骨架提示：</span>
          <span className="redbox-spelling__hint-skeleton">
            {generateGhostHint()}
          </span>
        </div>
      )}

      {/* 输入区 */}
      <div className="redbox-spelling__input-section">
        <div className="redbox-spelling__input-label">
          🔤 请输入正确的单词：
        </div>
        <div className="redbox-spelling__input-wrapper">
          <input
            ref={inputRef}
            type="text"
            className={`redbox-spelling__input ${
              submitted
                ? isCorrect
                  ? 'redbox-spelling__input--correct'
                  : 'redbox-spelling__input--wrong'
                : ''
            }`}
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="输入完整单词..."
            disabled={submitted}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          {submitted && (
            <div className="redbox-spelling__input-icon">
              {isCorrect ? (
                <CheckCircle2 size={28} color="var(--color-green)" />
              ) : (
                <XCircle size={28} color="var(--color-red)" />
              )}
            </div>
          )}
        </div>

        {/* 错误时显示正确答案 */}
        {submitted && !isCorrect && (
          <div className="redbox-spelling__answer">
            正确答案是：<strong>{word.word}</strong>
          </div>
        )}
      </div>

      {/* 状态信息 */}
      <div className="redbox-spelling__status">
        <div className="redbox-spelling__attempts">
          <span>剩余机会：</span>
          {[...Array(2)].map((_, i) => (
            <Heart
              key={i}
              size={24}
              className={`redbox-spelling__heart ${
                i < attempts ? 'redbox-spelling__heart--filled' : 'redbox-spelling__heart--empty'
              }`}
              fill={i < attempts ? '#ef4444' : 'none'}
            />
          ))}
        </div>
        <div className="redbox-spelling__error-history">
          <span>历史错误：{word.errorCount}次</span>
        </div>
      </div>

      {/* 提交按钮 */}
      {!submitted && (
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={inputValue.trim() === ''}
          className="redbox-spelling__submit-btn"
        >
          提交验收
        </Button>
      )}

      {/* 反馈信息 */}
      {submitted && (
        <div className={`redbox-spelling__feedback ${
          isCorrect 
            ? 'redbox-spelling__feedback--success' 
            : 'redbox-spelling__feedback--fail'
        }`}>
          {isCorrect ? (
            <>
              <CheckCircle2 size={32} />
              <div className="redbox-spelling__feedback-text">
                <h4>红词攻克成功！</h4>
                <p>Red → Yellow，进入艾宾浩斯复习轨道</p>
              </div>
            </>
          ) : attempts > 0 ? (
            <>
              <RotateCcw size={32} />
              <div className="redbox-spelling__feedback-text">
                <h4>❌ 拼写错误</h4>
                <p>还有 {attempts} 次机会，再试一次！</p>
              </div>
            </>
          ) : (
            <>
              <Skull size={32} />
              <div className="redbox-spelling__feedback-text">
                <h4>💀 机会用尽</h4>
                <p>保持 Red 状态，下节课继续攻坚！</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default RedBoxSpelling;
