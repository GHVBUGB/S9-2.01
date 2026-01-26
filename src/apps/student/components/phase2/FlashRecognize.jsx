import React, { useState, useEffect, useMemo } from 'react';
import { CheckCircle2, XCircle, Eye } from 'lucide-react';
import Button from '../../../../shared/components/ui/Button';
import useClassroomStore from '../../../../shared/store/useClassroomStore';
import './FlashRecognize.css';

/**
 * L2 闪视辨析
 * 单词闪现0.5秒 + 3选1释义
 * 目的：形 → 义，练直觉
 */
const FlashRecognize = ({ word, onComplete }) => {
  // ✅ 从 store 获取状态和 actions
  const { 
    studentState, 
    teacherState,
    studentSelectOption,
    studentSubmitAnswer,
    resetStudentState,
  } = useClassroomStore();

  // ✅ 使用 store 的状态
  const selectedOption = studentState.selectedOption;
  const submitted = studentState.isSubmitted;
  const isCorrect = studentState.isCorrect;
  
  // 闪现阶段状态（仍然用本地状态）
  const [phase, setPhase] = useState('ready'); // ready, flash, hidden, answer

  // 重置状态并开始闪现
  useEffect(() => {
    setPhase('ready');
    resetStudentState();
    
    // 自动开始闪现
    const timer = setTimeout(() => {
      startFlash();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [word.id, resetStudentState]);

  // ✅ 监听教师命令
  useEffect(() => {
    if (!teacherState.command) return;

    if (teacherState.command === 'repeat') {
      // 教师点击重做
      resetStudentState();
      setPhase('ready');
      setTimeout(startFlash, 500);
    } else if (teacherState.showAnswer && !submitted && phase === 'answer') {
      // 教师点击显示答案
      const correctOpt = options.find(opt => opt.isCorrect);
      if (correctOpt) {
        handleOptionClick(correctOpt.id);
        setTimeout(() => {
          handleSubmit(true); // 强制提交为正确
        }, 500);
      }
    }
  }, [teacherState.command, teacherState.showAnswer, phase]);

  // 开始闪现
  const startFlash = () => {
    setPhase('flash');
    
    // 0.5秒后隐藏
    setTimeout(() => {
      setPhase('hidden');
      
      // 再0.3秒后显示选项
      setTimeout(() => {
        setPhase('answer');
      }, 300);
    }, 500);
  };

  // 生成释义选项
  const options = useMemo(() => {
    const correctMeaning = word.meaning?.definitionCn || '未知';
    
    // 干扰项
    const distractors = [
      '采用', '接受', '影响', '尝试', '改变', '发展', 
      '创造', '保护', '熟练的', '建立', '勇敢的', '完美的'
    ];
    
    const shuffled = distractors
      .filter(d => d !== correctMeaning)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    
    const allOptions = [
      { id: 0, text: correctMeaning, isCorrect: true },
      { id: 1, text: shuffled[0], isCorrect: false },
      { id: 2, text: shuffled[1], isCorrect: false },
    ];
    
    return allOptions.sort(() => Math.random() - 0.5);
  }, [word]);

  // 处理选项点击
  const handleOptionClick = (optionId) => {
    if (!submitted && phase === 'answer') {
      studentSelectOption(optionId); // ✅ 更新到 store，教师端立即看到
    }
  };

  // 提交答案
  const handleSubmit = (forceCorrect = false) => {
    if (selectedOption === null) return;
    
    const selected = options.find(opt => opt.id === selectedOption);
    const correct = forceCorrect || (selected?.isCorrect || false);
    
    studentSubmitAnswer(correct); // ✅ 更新到 store，教师端立即看到
    
    setTimeout(() => {
      onComplete(correct);
      if (!correct) {
        // 错误时重新闪现
        setTimeout(() => {
          resetStudentState();
          setPhase('ready');
          setTimeout(startFlash, 500);
        }, 2000);
      }
    }, 1500);
  };

  // 重新闪现
  const handleReflash = () => {
    setPhase('ready');
    setTimeout(startFlash, 300);
  };

  // 获取选项样式
  const getOptionClass = (option) => {
    const classes = ['flash-recognize__option'];
    
    if (!submitted) {
      if (selectedOption === option.id) {
        classes.push('flash-recognize__option--selected');
      }
    } else {
      if (option.isCorrect) {
        classes.push('flash-recognize__option--correct');
      } else if (selectedOption === option.id && !option.isCorrect) {
        classes.push('flash-recognize__option--wrong');
      }
    }
    
    return classes.join(' ');
  };

  return (
    <div className="flash-recognize">
      {/* 闪现区域 */}
      <div className="flash-recognize__display">
        {phase === 'ready' && (
          <div className="flash-recognize__ready">
            <Eye size={48} />
            <span>准备好...</span>
          </div>
        )}
        
        {phase === 'flash' && (
          <div className="flash-recognize__word">
            {word.word}
          </div>
        )}
        
        {phase === 'hidden' && (
          <div className="flash-recognize__hidden">
            ???
          </div>
        )}
        
        {phase === 'answer' && (
          <div className="flash-recognize__hidden">
            <span>???</span>
            <button 
              className="flash-recognize__reflash-btn"
              onClick={handleReflash}
            >
              再看一次
            </button>
          </div>
        )}
      </div>

      {/* 提示文字 */}
      {phase === 'answer' && (
        <>
          <div className="flash-recognize__instruction">
            刚才看到的单词是什么意思？
          </div>

          {/* 选项列表 */}
          <div className="flash-recognize__options">
            {options.map((option, index) => (
              <button
                key={option.id}
                className={getOptionClass(option)}
                onClick={() => handleOptionClick(option.id)}
                disabled={submitted}
              >
                <span className="flash-recognize__option-label">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="flash-recognize__option-text">
                  {option.text}
                </span>
                {submitted && option.isCorrect && (
                  <CheckCircle2 className="flash-recognize__option-icon" size={20} />
                )}
                {submitted && selectedOption === option.id && !option.isCorrect && (
                  <XCircle className="flash-recognize__option-icon" size={20} />
                )}
              </button>
            ))}
          </div>

          {/* 提交按钮 */}
          {!submitted && (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className="flash-recognize__submit-btn"
            >
              确认
            </Button>
          )}

          {/* 反馈信息 */}
          {submitted && (
            <div className={`flash-recognize__feedback ${isCorrect ? 'flash-recognize__feedback--correct' : 'flash-recognize__feedback--wrong'}`}>
              {isCorrect ? (
                <>
                  <CheckCircle2 size={24} />
                  <span>正确！单词是 <strong>{word.word}</strong>，进入下一步...</span>
                </>
              ) : (
                <>
                  <XCircle size={24} />
                  <span>错误，单词是 <strong>{word.word}</strong>（{word.meaning?.definitionCn}），再试一次</span>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FlashRecognize;

