import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, XCircle, Volume2 } from 'lucide-react';
import useClassroomStore from '../../../../shared/store/useClassroomStore';
import './FullSpelling.css';

/**
 * L4 全拼写验收 - 极简重构版
 * 设计原则：无卡片、大留白、视觉聚焦、高级感
 * 核心逻辑：原语块回环 + 音义索形
 * 
 * 判定逻辑：
 * - 拼对 → Yellow (变灯成功)
 * - 拼错1次 → 再试一次
 * - 拼错2次 → Pending (打回 P2)
 * 
 * @param {Object} word - 当前单词数据
 * @param {string} wordSource - 单词来源
 * @param {Function} onComplete - 完成回调 (isCorrect, finalStatus) => void
 * @param {boolean} readonly - 是否只读模式（教师端使用）
 */
const FullSpelling = ({ word, wordSource, onComplete, readonly = false }) => {
  const {
    studentState,
    teacherState,
    studentInputText,
    studentSubmitAnswer,
    resetStudentState,
  } = useClassroomStore();

  const inputValue = studentState.inputText;
  const submitted = studentState.isSubmitted;
  const isCorrect = studentState.isCorrect;

  // 本地状态：尝试次数
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 2;

  // 音频播放状态
  const [isPlaying, setIsPlaying] = useState(false);
  const hasAutoPlayed = useRef(false);

  const inputRef = useRef(null);

  // 播放音频
  const playAudio = () => {
    if (!word?.word || isPlaying) return;
    setIsPlaying(true);
    
    const utterance = new SpeechSynthesisUtterance(word.word);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    utterance.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  // 重置状态 + 自动播放音频
  useEffect(() => {
    if (!readonly) {
      resetStudentState();
      setAttempts(0);
      hasAutoPlayed.current = false;
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [word.id]);

  // 自动播放音频（仅首次）
  useEffect(() => {
    if (!hasAutoPlayed.current && word.id && !readonly) {
      hasAutoPlayed.current = true;
      const timer = setTimeout(() => {
        playAudio();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [word.id]);

  // 监听教师命令
  useEffect(() => {
    if (teacherState.command === 'repeat' && !readonly) {
      resetStudentState();
      setAttempts(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [teacherState.command]);
  
  // 监听教师显示答案
  useEffect(() => {
    if (teacherState.showAnswer && !submitted && !readonly) {
      studentInputText(word.word);
      setTimeout(() => {
        studentSubmitAnswer(true);
        setTimeout(() => onComplete(true, 'yellow'), 800);
      }, 300);
    }
  }, [teacherState.showAnswer]);

  // 获取短语，挖空目标单词
  const getBlankPhrase = () => {
    const context = word.context?.[0] || {};
    const phrase = context.phrase || '';
    const targetWord = word.word;

    if (!targetWord) return { before: phrase, after: '' };

    const regex = new RegExp(`\\b${targetWord}\\b`, 'i');
    const match = phrase.match(regex);

    if (match) {
      const index = match.index;
      const before = phrase.slice(0, index);
      const after = phrase.slice(index + targetWord.length);
      return { before, after };
    }

    return { before: phrase, after: '' };
  };

  const { before, after } = getBlankPhrase();
  const context = word.context?.[0] || {};

  // 处理输入
  const handleInputChange = (e) => {
    if (!submitted && !readonly) {
      studentInputText(e.target.value.toLowerCase());
    }
  };

  // 提交答案
  const handleSubmit = () => {
    if (inputValue.trim() === '' || readonly || submitted) return;

    const userInput = inputValue.toLowerCase().trim();
    const expectedWord = word.word.toLowerCase();
    const correct = userInput === expectedWord;
    const newAttempts = attempts + 1;

    console.log('🎯 [FullSpelling] 提交:', {
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
      }, 800);
    } else {
      // 拼错
      setAttempts(newAttempts);

      if (newAttempts >= maxAttempts) {
        // 第2次拼错 → 打回 Pending
        studentSubmitAnswer(false);
        setTimeout(() => {
          onComplete(false, 'pending');
        }, 1200);
      } else {
        // 第1次拼错 → 再试一次
        studentSubmitAnswer(false);
        setTimeout(() => {
          resetStudentState();
          setTimeout(() => {
            inputRef.current?.focus();
          }, 100);
        }, 800);
      }
    }
  };

  // 处理回车提交
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="full-spelling">
      {/* 音频播放按钮 */}
      <button 
        className={`full-spelling__audio ${isPlaying ? 'is-playing' : ''}`}
        onClick={playAudio}
        disabled={isPlaying || readonly}
      >
        <Volume2 size={20} />
      </button>

      {/* 短语 - 输入框嵌入其中 */}
      <div className="full-spelling__phrase">
        <span className="full-spelling__phrase-text">
          {before}
          <input
            ref={inputRef}
            type="text"
            className={`full-spelling__inline-input ${
              submitted ? (isCorrect ? 'is-correct' : 'is-wrong') : ''
            } ${readonly ? 'is-readonly' : ''}`}
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={submitted || readonly}
            readOnly={readonly}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
            style={{
              width: inputValue ? `${Math.max(inputValue.length * 0.6, 1.2)}em` : '2em'
            }}
          />
          {after}
        </span>
      </div>

      {/* 中文翻译 + 词性 */}
      <p className="full-spelling__meaning">
        {context.phraseCn}
        <span className="full-spelling__pos">{word.core?.partOfSpeech}</span>
      </p>

      {/* 反馈图标 */}
      {submitted && (
        <div className={`full-spelling__feedback ${isCorrect ? 'is-correct' : 'is-wrong'}`}>
          {isCorrect ? (
            <CheckCircle2 size={32} />
          ) : (
            <XCircle size={32} />
          )}
        </div>
      )}

      {/* 只读模式提示 */}
      {readonly && (
        <p className="full-spelling__readonly">观察学生操作</p>
      )}
    </div>
  );
};

export default FullSpelling;
