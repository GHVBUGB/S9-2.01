import React, { useState, useEffect, useMemo } from 'react';
import { CheckCircle2, XCircle, Eye, Zap } from 'lucide-react';
import Button from '../../../../shared/components/ui/Button';
import useClassroomStore from '../../../../shared/store/useClassroomStore';
import './FlashRecognize.css';

/**
 * L2 闪视辨析 - 方案A：专业Flash训练流程
 * 阶段1：准备 → 阶段2：倒计时 → 阶段3：闪现 → 阶段4：答题
 * 
 * 双端协作模式：
 * - 教师端：控制"开始闪现"按钮，触发倒计时
 * - 学生端：等待教师指令，只能选择答案
 * 
 * @param {boolean} readonly - 是否只读模式（教师端使用）
 */
const FlashRecognize = ({ word, onComplete, readonly = false }) => {
  const { 
    studentState, 
    teacherState,
    studentSelectOption,
    studentSubmitAnswer,
    resetStudentState,
    setFlashPhase,
  } = useClassroomStore();

  const selectedOption = studentState.selectedOption;
  const submitted = studentState.isSubmitted;
  const isCorrect = studentState.isCorrect;
  
  // 从 store 获取闪现阶段（双端同步）
  const sharedPhase = teacherState.flashPhase || 'ready';
  
  // 本地倒计时状态
  const [countdown, setCountdown] = useState(3);

  // 重置到准备阶段
  useEffect(() => {
    // 只有教师端可以重置共享阶段
    if (readonly) {
      setFlashPhase('ready');
    }
    setCountdown(3);
    if (!readonly) {
      resetStudentState();
    }
  }, [word.id, resetStudentState, readonly, setFlashPhase]);

  // 监听教师命令
  useEffect(() => {
    if (teacherState.command === 'repeat') {
      // 只有教师端可以重置共享阶段
      if (readonly) {
        setFlashPhase('ready');
      }
      setCountdown(3);
      if (!readonly) {
        resetStudentState();
      }
    }
  }, [teacherState.command, resetStudentState, readonly, setFlashPhase]);
  
  // 监听闪现阶段变化（学生端响应教师端的阶段变化）
  useEffect(() => {
    if (!readonly && sharedPhase === 'countdown') {
      // 学生端收到倒计时指令，开始本地倒计时动画（只是视觉效果，不改变共享状态）
      runStudentCountdownAnimation();
    }
  }, [sharedPhase, readonly]);
  
  // 单独监听教师显示答案（只在教师主动点击时触发，仅学生端响应）
  useEffect(() => {
    if (teacherState.showAnswer && !submitted && sharedPhase === 'answer' && !readonly) {
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

  // 学生端倒计时动画（只更新本地 UI，不改变共享状态）
  const runStudentCountdownAnimation = () => {
    setCountdown(3);
    
    let current = 3;
    const countdownInterval = setInterval(() => {
      current--;
      setCountdown(current);
      
      if (current === 0) {
        clearInterval(countdownInterval);
        // 学生端不调用 setFlashPhase，由教师端统一控制
      }
    }, 1000);
  };

  // 教师端倒计时动画（控制共享状态）
  const runTeacherCountdownAnimation = () => {
    setCountdown(3);
    
    let current = 3;
    const countdownInterval = setInterval(() => {
      current--;
      setCountdown(current);
      
      if (current === 0) {
        clearInterval(countdownInterval);
        // 教师端控制阶段切换
        setFlashPhase('flash');
        
        // 0.5秒后进入答题阶段
        setTimeout(() => {
          setFlashPhase('answer');
        }, 500);
      }
    }, 1000);
  };

  // 教师点击开始闪现
  const handleStart = () => {
    // 设置共享阶段为 countdown，双端同步开始倒计时
    setFlashPhase('countdown');
    // 教师端运行倒计时动画（控制阶段切换）
    runTeacherCountdownAnimation();
  };

  // 生成释义选项（4选1）
  const options = useMemo(() => {
    const correctMeaning = word.meaning?.chinese || word.meaning?.definitionCn || '未知';
    
    // 干扰释义词库
    const distractors = [
      '采用', '接受', '影响', '尝试', '改变', '发展', 
      '创造', '保护', '熟练的', '建立', '勇敢的', '完美的',
      '紧张的', '有礼貌的', '普通的', '现代的', '古老的', '重要的'
    ];
    
    // 随机选择3个干扰项（4选1需要3个干扰项）
    const shuffled = distractors
      .filter(d => d !== correctMeaning) // 排除正确答案
      .sort(() => Math.random() - 0.5)
      .slice(0, 3); // 取3个
    
    const allOptions = [
      { id: 0, text: correctMeaning, isCorrect: true },
      { id: 1, text: shuffled[0], isCorrect: false },
      { id: 2, text: shuffled[1], isCorrect: false },
      { id: 3, text: shuffled[2], isCorrect: false },
    ];
    
    // 随机打乱顺序
    return allOptions.sort(() => Math.random() - 0.5);
  }, [word]);

  // 处理选项点击（仅学生端）
  const handleOptionClick = (optionId) => {
    if (!submitted && sharedPhase === 'answer' && !readonly) {
      studentSelectOption(optionId);
    }
  };

  // 提交答案（学生点击确认按钮，仅学生端）
  const handleSubmit = () => {
    if (selectedOption === null || readonly) return;
    
    const selected = options.find(opt => opt.id === selectedOption);
    const correct = selected?.isCorrect === true;
    
    console.log('🎯 [FlashRecognize] 提交答案:', {
      selectedOption,
      selectedText: selected?.text,
      selectedIsCorrect: selected?.isCorrect,
      isCorrect: correct
    });
    
    studentSubmitAnswer(correct);
    
    // 无论对错都进入下一题，错题会在轮次结束后统一重做
    setTimeout(() => {
      onComplete(correct);
    }, 1500);
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
    <div className={`flash-recognize ${readonly ? 'flash-recognize--readonly' : ''}`}>
      {/* 阶段1：准备阶段 */}
      {sharedPhase === 'ready' && (
        <div className="flash-recognize__stage flash-recognize__stage--ready">
          <div className="flash-recognize__ready-icon">
            <Eye size={64} strokeWidth={1.5} />
          </div>
          
          {readonly ? (
            // 教师端：显示开始按钮
            <>
              <h2 className="flash-recognize__ready-title">闪视辨析</h2>
              <p className="flash-recognize__ready-desc">
                点击按钮开始闪现训练<br />
                学生将同步看到闪现动画
              </p>
              <Button 
                variant="primary" 
                onClick={handleStart}
                className="flash-recognize__start-btn"
              >
                <Zap size={20} />
                开始闪现
              </Button>
            </>
          ) : (
            // 学生端：等待教师
            <>
              <h2 className="flash-recognize__ready-title">准备好了吗？</h2>
              <p className="flash-recognize__ready-desc">
                单词将在 <strong>0.5 秒</strong>内闪现<br />
                请集中注意力！
              </p>
              <div className="flash-recognize__waiting">
                <span className="flash-recognize__waiting-icon">⏳</span>
                <span>等待老师开始...</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* 阶段2：倒计时（双端同步显示） */}
      {sharedPhase === 'countdown' && (
        <div className="flash-recognize__stage flash-recognize__stage--countdown">
          <div 
            className={`flash-recognize__countdown flash-recognize__countdown--${countdown}`}
            key={countdown}
          >
            {countdown}
          </div>
        </div>
      )}

      {/* 阶段3：闪现！（双端同步显示） */}
      {sharedPhase === 'flash' && (
        <div className="flash-recognize__stage flash-recognize__stage--flash">
          <div className="flash-recognize__flash-word">
            {word.word.toUpperCase()}
          </div>
        </div>
      )}

      {/* 阶段4：答题阶段 */}
      {sharedPhase === 'answer' && (
        <div className="flash-recognize__stage flash-recognize__stage--answer">
          {/* 教师端只读提示 */}
          {readonly && (
            <div className="flash-recognize__readonly-hint">
              👀 教师观看模式 - 等待学生作答
            </div>
          )}
          
          <div className="flash-recognize__question">
            <span className="flash-recognize__question-icon">🤔</span>
            <span className="flash-recognize__question-text">
              刚才闪现的单词是什么意思？
            </span>
          </div>

          {/* 选项列表 */}
          <div className="flash-recognize__options">
            {options.map((option, index) => (
              <button
                key={option.id}
                className={`${getOptionClass(option)} ${readonly ? 'flash-recognize__option--readonly' : ''}`}
                onClick={() => handleOptionClick(option.id)}
                disabled={submitted || readonly}
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

          {/* 提交按钮（仅学生端显示） */}
          {!submitted && !readonly && (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className="flash-recognize__submit-btn"
            >
              确认答案
            </Button>
          )}

          {/* 反馈信息 */}
          {submitted && (
            <div className={`flash-recognize__feedback ${isCorrect ? 'flash-recognize__feedback--correct' : 'flash-recognize__feedback--wrong'}`}>
              {isCorrect ? (
                <>
                  <CheckCircle2 size={24} />
                  <span>正确！单词是 <strong>{word.word}</strong></span>
                </>
              ) : (
                <>
                  <XCircle size={24} />
                  <span>单词是 <strong>{word.word}</strong>（{word.meaning?.chinese || word.meaning?.definitionCn}），稍后重做</span>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FlashRecognize;
