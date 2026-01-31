import React, { useState, useMemo, useEffect, useRef } from 'react';
import { CheckCircle2, XCircle, Volume2 } from 'lucide-react';
import useClassroomStore from '../../../shared/store/useClassroomStore';
import './ContextProbe.css';

/**
 * Phase 1: 语境探针 (Context Probe) - 极简重构版
 * 设计原则：无卡片、大留白、视觉聚焦、高级感
 * 
 * @param {Object} word - 当前单词数据
 * @param {Function} onComplete - 完成回调 (isCorrect) => void
 * @param {boolean} readonly - 是否只读模式（教师端使用）
 * @param {boolean} allowRetry - 是否允许重试（非核心词 P3 时为 true）
 * @param {Function} onRetryNeeded - 答错需要重试时的回调 (非核心词 P3 使用)
 */
const ContextProbe = ({ word, onComplete, readonly = false, allowRetry = false, onRetryNeeded = null }) => {
  const { teacherState } = useClassroomStore();
  
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [waitingForTeacher, setWaitingForTeacher] = useState(false);
  const [voicesReady, setVoicesReady] = useState(false);
  const hasAutoPlayed = useRef(false);
  
  // 预加载语音列表
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesReady(true);
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  // 播放音频
  const playAudio = () => {
    setIsPlaying(true);
    window.speechSynthesis.cancel();
    
    const textToSpeak = word.context?.[0]?.phrase || word.word;
    console.log('🔊 播放音频:', textToSpeak);
    
    const speak = () => {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      const voices = window.speechSynthesis.getVoices();
      const preferredVoices = ['Google US English', 'Microsoft Zira', 'Samantha', 'Alex'];
      for (const voiceName of preferredVoices) {
        const voice = voices.find(v => v.name.includes(voiceName));
        if (voice) {
          utterance.voice = voice;
          break;
        }
      }
      
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setTimeout(() => setIsPlaying(false), 1500);
      
      window.speechSynthesis.speak(utterance);
    };
    
    if (!voicesReady) {
      setTimeout(speak, 100);
    } else {
      speak();
    }
  };

  // 当单词变化时，重置所有状态 + 自动播放音频
  useEffect(() => {
    setSelectedOption(null);
    setSubmitted(false);
    setIsCorrect(false);
    setAttemptCount(0);
    setWaitingForTeacher(false);
    hasAutoPlayed.current = false;
  }, [word.id]);
  
  // 监听教师重试命令（非核心词 P3）
  useEffect(() => {
    if (allowRetry && waitingForTeacher && teacherState?.command === 'retryP3NonCore') {
      // 重置状态让学生重试
      setSelectedOption(null);
      setSubmitted(false);
      setIsCorrect(false);
      setWaitingForTeacher(false);
      console.log('🔄 [ContextProbe] 教师触发重试，题目重置');
    }
  }, [allowRetry, waitingForTeacher, teacherState?.command]);

  // 自动播放音频（仅首次）
  useEffect(() => {
    if (!hasAutoPlayed.current && word.id) {
      hasAutoPlayed.current = true;
      // 延迟播放，等待界面渲染
      const timer = setTimeout(() => {
        playAudio();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [word.id]);

  // 获取例句（使用第一个简单例句）
  const context = word.context?.[0] || {};
  
  // 生成中文释义选项（2选1）
  const options = useMemo(() => {
    const correctMeaning = word.meaning?.chinese || '未知';
    
    // 干扰释义词库
    const commonDistractors = [
      '采用', '接受', '影响', '尝试', '改变', '发展', 
      '创造', '保护', '破坏', '建立', '维持', '提供',
      '紧张的', '有礼貌的', '普通的', '现代的', '古老的', '重要的'
    ];
    
    // 随机选择1个干扰项
    const distractor = commonDistractors
      .filter(d => d !== correctMeaning)
      .sort(() => Math.random() - 0.5)[0];
    
    const allOptions = [
      { id: 0, text: correctMeaning, isCorrect: true },
      { id: 1, text: distractor, isCorrect: false }
    ];
    
    return allOptions.sort(() => Math.random() - 0.5);
  }, [word]);

  // 高亮目标单词的短语
  const highlightedPhrase = useMemo(() => {
    const phrase = context.phrase || '';
    const targetWord = word.word;
    
    const regex = new RegExp(`\\b(${targetWord})\\b`, 'gi');
    const parts = phrase.split(regex);
    
    return parts.map((part, index) => {
      if (part.toLowerCase() === targetWord.toLowerCase()) {
        return <span key={index} className="context-probe__highlight">{part}</span>;
      }
      return part;
    });
  }, [context.phrase, word.word]);

  // 处理选项点击 - 点击即提交
  const handleOptionClick = (optionId) => {
    if (submitted || readonly) return;
    
    setSelectedOption(optionId);
    
    const selected = options.find(opt => opt.id === optionId);
    const correct = selected?.isCorrect === true;
    
    setIsCorrect(correct);
    setSubmitted(true);
    setAttemptCount(prev => prev + 1);
    
    // 重试模式（非核心词 P3）
    if (allowRetry && !correct) {
      // 第1次答错：等待老师指导
      if (attemptCount === 0) {
        console.log('❌ [ContextProbe] 第1次答错，等待老师指导');
        setWaitingForTeacher(true);
        // 通知 P3Container 需要重试
        if (onRetryNeeded) {
          setTimeout(() => onRetryNeeded(), 500);
        }
        return;
      }
      // 第2次答错：直接进入下一题
      else {
        console.log('❌ [ContextProbe] 第2次答错，进入下一题');
        setTimeout(() => {
          onComplete(false);
        }, 800);
        return;
      }
    }
    
    // 正常模式或答对：短暂延迟后进入下一题
    setTimeout(() => {
      onComplete(correct);
    }, 800);
  };

  return (
    <div className="context-probe">
      {/* 音频播放按钮 - 纯图标 */}
      <button 
        className={`context-probe__audio ${isPlaying ? 'is-playing' : ''}`}
        onClick={playAudio}
        disabled={isPlaying}
        aria-label="播放音频"
      >
        <Volume2 size={20} />
      </button>

      {/* 核心短语 - 视觉焦点 */}
      <div className="context-probe__phrase">
        {highlightedPhrase}
      </div>

      {/* 选项区 - 2x2 网格 */}
      <div className="context-probe__options">
        {options.map((option) => {
          let stateClass = '';
          if (submitted) {
            if (option.isCorrect) stateClass = 'is-correct';
            else if (selectedOption === option.id) stateClass = 'is-wrong';
            else stateClass = 'is-dimmed';
          } else if (selectedOption === option.id) {
            stateClass = 'is-selected';
          }

          return (
            <button
              key={option.id}
              className={`context-probe__option ${stateClass} ${readonly ? 'is-readonly' : ''}`}
              onClick={() => handleOptionClick(option.id)}
              disabled={submitted || readonly}
            >
              <span className="context-probe__option-text">{option.text}</span>
              {submitted && option.isCorrect && (
                <CheckCircle2 size={18} className="context-probe__option-icon" />
              )}
              {submitted && selectedOption === option.id && !option.isCorrect && (
                <XCircle size={18} className="context-probe__option-icon" />
              )}
            </button>
          );
        })}
      </div>

      {/* 等待老师指导提示（非核心词 P3 第1次答错） */}
      {waitingForTeacher && !readonly && (
        <div className="context-probe__waiting-hint">
          等待老师指导...
        </div>
      )}

      {/* 只读模式提示 */}
      {readonly && (
        <p className="context-probe__readonly">观察学生操作</p>
      )}
    </div>
  );
};

export default ContextProbe;
