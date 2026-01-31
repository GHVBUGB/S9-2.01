import React, { useState, useEffect, useMemo } from 'react';
import { CheckCircle2, XCircle, Eye, RotateCcw } from 'lucide-react';
import useClassroomStore from '../../../../shared/store/useClassroomStore';
import './FlashRecognize.css';

/**
 * L2 闪视辨析 (Form-to-Meaning) - 极简重构版
 * 设计原则：无卡片、大留白、视觉聚焦、高级感
 * 核心逻辑：形 → 义（看词选义）
 * 
 * 流程：
 * - ready: 学生端只显示眼睛动画，教师端显示眼睛+开始按钮
 * - flash: 卡片正面显示单词 0.5秒，然后自动翻转
 * - flipped: 卡片背面（问号）+ 选项，教师可点击"再闪"
 * 
 * @param {Object} word - 当前单词数据
 * @param {Function} onComplete - 完成回调 (isCorrect) => void
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
  
  // 本地状态：卡片是否正在显示正面（闪现中）
  const [isShowingWord, setIsShowingWord] = useState(false);

  // 重置到准备阶段（只在单词变化时）
  useEffect(() => {
    if (readonly) {
      setFlashPhase('ready');
    }
    setIsShowingWord(false);
    if (!readonly) {
      resetStudentState();
    }
  }, [word.id]);

  // 监听教师命令（重做）
  useEffect(() => {
    if (teacherState.command === 'repeat') {
      if (readonly) {
        setFlashPhase('ready');
      }
      setIsShowingWord(false);
      if (!readonly) {
        resetStudentState();
      }
    }
  }, [teacherState.command]);
  
  // 监听闪现阶段变化 - 同步翻转状态
  useEffect(() => {
    if (sharedPhase === 'flash') {
      // 显示单词正面
      setIsShowingWord(true);
      
      // 0.5秒后翻转到背面
      const timer = setTimeout(() => {
        setIsShowingWord(false);
        // 只有教师端控制阶段切换
        if (readonly) {
          setFlashPhase('flipped');
        }
      }, 500);
      return () => clearTimeout(timer);
    } else if (sharedPhase === 'flipped') {
      // 确保背面状态
      setIsShowingWord(false);
    }
  }, [sharedPhase, readonly, setFlashPhase]);
  
  // 监听教师显示答案
  useEffect(() => {
    if (teacherState.showAnswer && !submitted && sharedPhase === 'flipped' && !readonly) {
      const correctOpt = options.find(opt => opt.isCorrect);
      if (correctOpt) {
        studentSelectOption(correctOpt.id);
        setTimeout(() => {
          studentSubmitAnswer(true);
          setTimeout(() => onComplete(true), 800);
        }, 300);
      }
    }
  }, [teacherState.showAnswer]);

  // 教师点击开始
  const handleStart = () => {
    setFlashPhase('flash');
  };

  // 教师点击再闪一次
  const handleReflash = () => {
    setFlashPhase('flash');
  };

  // 生成释义选项（3选1）
  const options = useMemo(() => {
    const correctMeaning = word.meaning?.chinese || word.meaning?.definitionCn || '未知';
    
    // 干扰释义词库
    const distractors = [
      '采用', '接受', '影响', '尝试', '改变', '发展', 
      '创造', '保护', '熟练的', '建立', '勇敢的', '完美的',
      '紧张的', '有礼貌的', '普通的', '现代的', '古老的', '重要的'
    ];
    
    // 随机选择2个干扰项（3选1需要2个干扰项）
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

  // 处理选项点击 - 点击即提交
  const handleOptionClick = (optionId) => {
    if (submitted || sharedPhase !== 'flipped' || readonly) return;
    
    studentSelectOption(optionId);
    
    const selected = options.find(opt => opt.id === optionId);
    const correct = selected?.isCorrect === true;
    
    console.log('🎯 [FlashRecognize] 选择:', {
      selectedText: selected?.text,
      correctMeaning: word.meaning?.chinese,
      isCorrect: correct
    });
    
    studentSubmitAnswer(correct);
    
    // 短暂延迟后进入下一题
    setTimeout(() => {
      onComplete(correct);
    }, 800);
  };

  // 获取选项状态类名
  const getOptionStateClass = (option) => {
    if (submitted) {
      if (option.isCorrect) return 'is-correct';
      if (selectedOption === option.id) return 'is-wrong';
      return 'is-dimmed';
    }
    if (selectedOption === option.id) return 'is-selected';
    return '';
  };

  return (
    <div className="flash-recognize">
      {/* 阶段1：准备阶段 */}
      {sharedPhase === 'ready' && (
        <div className="flash-recognize__ready">
          {/* 跳动的眼睛图标 */}
          <div className="flash-recognize__eye">
            <Eye size={64} strokeWidth={1.5} />
          </div>
          
          {/* 教师端：开始按钮 */}
          {readonly && (
            <button 
              className="flash-recognize__start-btn"
              onClick={handleStart}
            >
              开始
            </button>
          )}
        </div>
      )}

      {/* 阶段2&3：闪现 + 翻转 + 答题 */}
      {(sharedPhase === 'flash' || sharedPhase === 'flipped') && (
        <div className="flash-recognize__main">
          {/* 卡片区域（含再闪按钮） */}
          <div className="flash-recognize__card-area">
            {/* 翻转卡片 */}
            <div className={`flash-recognize__card ${!isShowingWord ? 'is-flipped' : ''}`}>
              <div className="flash-recognize__card-inner">
                {/* 卡片正面：单词 */}
                <div className="flash-recognize__card-front">
                  <span className="flash-recognize__word">{word.word}</span>
                </div>
                {/* 卡片背面：问号 */}
                <div className="flash-recognize__card-back">
                  <span className="flash-recognize__question-mark">?</span>
                </div>
              </div>
            </div>

            {/* 教师端：再闪按钮（翻转后显示） */}
            {readonly && sharedPhase === 'flipped' && !submitted && (
              <button 
                className="flash-recognize__reflash-btn"
                onClick={handleReflash}
                title="再闪一次"
              >
                <RotateCcw size={20} />
              </button>
            )}
          </div>

          {/* 翻转后显示选项 */}
          {sharedPhase === 'flipped' && (
            <div className="flash-recognize__options">
              {options.map((option, index) => (
                <button
                  key={option.id}
                  className={`flash-recognize__option ${getOptionStateClass(option)} ${readonly ? 'is-readonly' : ''}`}
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
                    <CheckCircle2 size={18} className="flash-recognize__option-icon" />
                  )}
                  {submitted && selectedOption === option.id && !option.isCorrect && (
                    <XCircle size={18} className="flash-recognize__option-icon" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 只读模式提示 */}
      {readonly && sharedPhase === 'flipped' && (
        <p className="flash-recognize__readonly">观察学生操作</p>
      )}
    </div>
  );
};

export default FlashRecognize;
