import React, { useState, useEffect, useMemo } from 'react';
import { Volume2, CheckCircle2, XCircle } from 'lucide-react';
import Button from '../../../../shared/components/ui/Button';
import useClassroomStore from '../../../../shared/store/useClassroomStore';
import './ListenAndChoose.css';

/**
 * L2 听音辨形
 * 播放音频 + 4选1形近词
 * 目的：音 → 形，防混淆
 * 
 * @param {boolean} readonly - 是否只读模式（教师端使用）
 */
const ListenAndChoose = ({ word, onComplete, readonly = false }) => {
  // ✅ 从 store 获取状态和 actions
  const { 
    studentState, 
    teacherState,
    studentSelectOption,
    studentSubmitAnswer,
    resetStudentState,
  } = useClassroomStore();

  // ✅ 使用 store 的状态，而不是本地状态
  const selectedOption = studentState.selectedOption;
  const submitted = studentState.isSubmitted;
  const isCorrect = studentState.isCorrect;
  
  // 🔊 音频播放状态（仍然用本地状态）
  const [isPlaying, setIsPlaying] = useState(false);

  // 重置状态并自动播放音频（仅学生端）
  useEffect(() => {
    if (!readonly) {
      resetStudentState();
      playAudio();
    }
  }, [word.id, resetStudentState, readonly]);

  // ✅ 监听教师命令（仅学生端响应）
  useEffect(() => {
    if (teacherState.command === 'repeat' && !readonly) {
      // 教师点击重做
      resetStudentState();
      playAudio();
    }
  }, [teacherState.command, resetStudentState, readonly]);
  
  // 单独监听教师显示答案（仅学生端响应）
  useEffect(() => {
    if (teacherState.showAnswer && !submitted && !readonly) {
      // 教师点击显示答案 - 自动选中正确选项并提交
      const correctOpt = options.find(opt => opt.isCorrect);
      if (correctOpt) {
        studentSelectOption(correctOpt.id);
        setTimeout(() => {
          studentSubmitAnswer(true);
          setTimeout(() => onComplete(true), 1500);
        }, 500);
      }
    }
  }, [teacherState.showAnswer, readonly]);

  // 生成形近词选项（4选1）
  const options = useMemo(() => {
    const correctWord = word.word;
    
    // ✅ 使用数据表中的干扰项
    let distractors = word.training?.distractors || [];
    
    // 确保有3个干扰项（4选1需要3个干扰项）
    if (distractors.length < 3) {
      console.warn(`Word "${correctWord}" missing distractors in training data, using fallback`);
      // 备用：使用通用形近词
      const backup = ['accept', 'except', 'effect', 'affect', 'adopt', 'adapt'];
      distractors = [...distractors, ...backup]
        .filter(d => d !== correctWord) // 排除正确答案
        .slice(0, 3); // 取3个
    } else if (distractors.length > 3) {
      // 如果干扰项超过3个，随机选3个
      distractors = distractors
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
    }
    
    const allOptions = [
      { id: 0, text: correctWord, isCorrect: true },
      ...distractors.map((d, i) => ({ id: i + 1, text: d, isCorrect: false }))
    ];
    
    // 随机打乱顺序
    return allOptions.sort(() => Math.random() - 0.5);
  }, [word]);

  // 播放音频
  const playAudio = () => {
    setIsPlaying(true);
    // 模拟音频播放（实际项目中接入真实音频）
    console.log('🔊 播放音频:', word.sound?.ipa);
    
    // 模拟播放时间
    setTimeout(() => {
      setIsPlaying(false);
    }, 1000);
  };

  // 处理选项点击（仅学生端）
  const handleOptionClick = (optionId) => {
    if (!submitted && !readonly) {
      studentSelectOption(optionId); // ✅ 更新到 store，教师端立即看到
    }
  };

  // 提交答案（学生点击确认按钮，仅学生端）
  const handleSubmit = () => {
    if (selectedOption === null || readonly) return;
    
    const selected = options.find(opt => opt.id === selectedOption);
    const correct = selected?.isCorrect === true;
    
    console.log('🎯 [ListenAndChoose] 提交答案:', {
      selectedOption,
      selectedText: selected?.text,
      selectedIsCorrect: selected?.isCorrect,
      correctWord: word.word,
      isCorrect: correct
    });
    
    studentSubmitAnswer(correct);
    
    // 延迟回调 - 无论对错都进入下一题，错题会在轮次结束后统一重做
    setTimeout(() => {
      onComplete(correct);
    }, 1500);
  };

  // 获取选项样式
  const getOptionClass = (option) => {
    const classes = ['listen-choose__option'];
    
    if (!submitted) {
      if (selectedOption === option.id) {
        classes.push('listen-choose__option--selected');
      }
    } else {
      if (option.isCorrect) {
        classes.push('listen-choose__option--correct');
      } else if (selectedOption === option.id && !option.isCorrect) {
        classes.push('listen-choose__option--wrong');
      }
    }
    
    return classes.join(' ');
  };

  return (
    <div className={`listen-choose ${readonly ? 'listen-choose--readonly' : ''}`}>
      {/* 教师端只读提示 */}
      {readonly && (
        <div className="listen-choose__readonly-hint">
          👀 教师观看模式 - 等待学生作答
        </div>
      )}
      
      {/* 音频播放区域 */}
      <div className="listen-choose__audio-section">
        <button 
          className={`listen-choose__audio-btn ${isPlaying ? 'listen-choose__audio-btn--playing' : ''}`}
          onClick={playAudio}
          disabled={isPlaying}
        >
          <Volume2 size={32} />
        </button>
        <div className="listen-choose__ipa">
          {word.sound?.ipa || '/.../ '}
        </div>
        <button 
          className="listen-choose__replay-btn"
          onClick={playAudio}
          disabled={isPlaying}
        >
          再听一次
        </button>
      </div>

      {/* 提示文字 */}
      <div className="listen-choose__instruction">
        选出你听到的单词：
      </div>

      {/* 选项列表 (2x2 网格) */}
      <div className="listen-choose__options">
        {options.map((option, index) => (
          <button
            key={option.id}
            className={`${getOptionClass(option)} ${readonly ? 'listen-choose__option--readonly' : ''}`}
            onClick={() => handleOptionClick(option.id)}
            disabled={submitted || readonly}
          >
            <span className="listen-choose__option-label">
              {String.fromCharCode(65 + index)}.
            </span>
            <span className="listen-choose__option-text">
              {option.text}
            </span>
            {submitted && option.isCorrect && (
              <CheckCircle2 className="listen-choose__option-icon" size={20} />
            )}
            {submitted && selectedOption === option.id && !option.isCorrect && (
              <XCircle className="listen-choose__option-icon" size={20} />
            )}
          </button>
        ))}
      </div>

      {/* 提交按钮（仅学生端显示） */}
      {!submitted && !readonly && (
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={selectedOption === null}
          className="listen-choose__submit-btn"
        >
          确认
        </Button>
      )}

      {/* 反馈信息 */}
      {submitted && (
        <div className={`listen-choose__feedback ${isCorrect ? 'listen-choose__feedback--correct' : 'listen-choose__feedback--wrong'}`}>
          {isCorrect ? (
            <>
              <CheckCircle2 size={24} />
              <span>正确！进入下一题...</span>
            </>
          ) : (
            <>
              <XCircle size={24} />
              <span>正确答案是 <strong>{word.word}</strong>，稍后重做</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ListenAndChoose;

