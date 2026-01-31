<<<<<<< HEAD
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Volume2, CheckCircle2, XCircle } from 'lucide-react';
import useClassroomStore from '../../../../shared/store/useClassroomStore';
import './ListenAndChoose.css';

/**
 * L2 听音辨形 (Sound-to-Form) - 极简重构版
 * 设计原则：无卡片、大留白、视觉聚焦、高级感
 * 核心逻辑：音 → 形（听音选词）
 * 
 * @param {Object} word - 当前单词数据
 * @param {Function} onComplete - 完成回调 (isCorrect) => void
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

  // ✅ 使用 store 的状态
  const selectedOption = studentState.selectedOption;
  const submitted = studentState.isSubmitted;
  const isCorrect = studentState.isCorrect;
  
  // 🔊 音频播放状态（本地状态）
  const [isPlaying, setIsPlaying] = useState(false);
  const hasAutoPlayed = useRef(false);

  // 播放音频
  const playAudio = () => {
    setIsPlaying(true);
    // TODO: 接入真实音频 API
    console.log('🔊 播放音频:', word.sound?.ipa);
    
    // 模拟播放时间
    setTimeout(() => {
      setIsPlaying(false);
    }, 1000);
  };

  // 重置状态（仅学生端）
  useEffect(() => {
    if (!readonly) {
      resetStudentState();
      hasAutoPlayed.current = false;
    }
  }, [word.id, resetStudentState, readonly]);

  // 自动播放音频（仅首次，仅学生端）
  useEffect(() => {
    if (!hasAutoPlayed.current && word.id && !readonly) {
      hasAutoPlayed.current = true;
      const timer = setTimeout(() => {
        playAudio();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [word.id, readonly]);

  // ✅ 监听教师命令（仅学生端响应）
  useEffect(() => {
    if (teacherState.command === 'repeat' && !readonly) {
      resetStudentState();
      hasAutoPlayed.current = false;
      setTimeout(() => playAudio(), 100);
    }
  }, [teacherState.command, resetStudentState, readonly]);
  
  // 监听教师显示答案（仅学生端响应）
  useEffect(() => {
    if (teacherState.showAnswer && !submitted && !readonly) {
      const correctOpt = options.find(opt => opt.isCorrect);
      if (correctOpt) {
        studentSelectOption(correctOpt.id);
        setTimeout(() => {
          studentSubmitAnswer(true);
          setTimeout(() => onComplete(true), 800);
        }, 300);
      }
    }
  }, [teacherState.showAnswer, readonly]);

  // 生成形近词选项（3选1）
  const options = useMemo(() => {
    const correctWord = word.word;
    
    // ✅ 使用数据表中的干扰项
    let distractors = word.training?.distractors || [];
    
    // 确保有2个干扰项（3选1需要2个干扰项）
    if (distractors.length < 2) {
      console.warn(`Word "${correctWord}" missing distractors in training data, using fallback`);
      const backup = ['accept', 'except', 'effect', 'affect', 'adopt', 'adapt'];
      distractors = [...distractors, ...backup]
        .filter(d => d !== correctWord)
        .slice(0, 2);
    } else if (distractors.length > 2) {
      distractors = distractors
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
    }
    
    const allOptions = [
      { id: 0, text: correctWord, isCorrect: true },
      ...distractors.map((d, i) => ({ id: i + 1, text: d, isCorrect: false }))
    ];
    
    return allOptions.sort(() => Math.random() - 0.5);
  }, [word]);

  // 处理选项点击 - 点击即提交（参考 P1）
  const handleOptionClick = (optionId) => {
    if (submitted || readonly) return;
    
    studentSelectOption(optionId);
    
    const selected = options.find(opt => opt.id === optionId);
    const correct = selected?.isCorrect === true;
    
    console.log('🎯 [ListenAndChoose] 选择:', {
      selectedText: selected?.text,
      correctWord: word.word,
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
    <div className="listen-choose">
      {/* 播放按钮 - 视觉焦点 */}
      <button 
        className={`listen-choose__audio ${isPlaying ? 'is-playing' : ''}`}
        onClick={playAudio}
        disabled={isPlaying}
        aria-label="播放音频"
      >
        <Volume2 size={36} />
      </button>

      {/* 选项区 - 横排 3 选项 */}
      <div className="listen-choose__options">
        {options.map((option, index) => {
          // 是否选错了（用于显示正确答案的翻译）
          const showMeaning = submitted && !isCorrect && option.isCorrect;
          
          return (
            <button
              key={option.id}
              className={`listen-choose__option ${getOptionStateClass(option)} ${showMeaning ? 'is-expanded' : ''} ${readonly ? 'is-readonly' : ''}`}
              onClick={() => handleOptionClick(option.id)}
              disabled={submitted || readonly}
            >
              <div className="listen-choose__option-main">
                <span className="listen-choose__option-label">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="listen-choose__option-text">
                  {option.text}
                </span>
                {submitted && option.isCorrect && (
                  <CheckCircle2 size={18} className="listen-choose__option-icon" />
                )}
                {submitted && selectedOption === option.id && !option.isCorrect && (
                  <XCircle size={18} className="listen-choose__option-icon" />
                )}
              </div>
              {/* 选错时显示正确答案的翻译 */}
              {showMeaning && (
                <div className="listen-choose__option-meaning">
                  {word.meaning?.chinese || word.meaning}
                  <span className="listen-choose__option-pos">{word.core?.partOfSpeech}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 只读模式提示 */}
      {readonly && (
        <p className="listen-choose__readonly">观察学生操作</p>
      )}
    </div>
  );
};

export default ListenAndChoose;
=======
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Volume2, CheckCircle2, XCircle } from 'lucide-react';
import useClassroomStore from '../../../../shared/store/useClassroomStore';
import './ListenAndChoose.css';

/**
 * L2 听音辨形 (Sound-to-Form) - 极简重构版
 * 设计原则：无卡片、大留白、视觉聚焦、高级感
 * 核心逻辑：音 → 形（听音选词）
 * 
 * @param {Object} word - 当前单词数据
 * @param {Function} onComplete - 完成回调 (isCorrect) => void
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

  // ✅ 使用 store 的状态
  const selectedOption = studentState.selectedOption;
  const submitted = studentState.isSubmitted;
  const isCorrect = studentState.isCorrect;
  
  // 🔊 音频播放状态（本地状态）
  const [isPlaying, setIsPlaying] = useState(false);
  const [voicesReady, setVoicesReady] = useState(false);
  const hasAutoPlayed = useRef(false);
  
  // 预加载语音列表
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) setVoicesReady(true);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  // 播放音频
  const playAudio = () => {
    setIsPlaying(true);
    window.speechSynthesis.cancel();
    
    console.log('🔊 播放音频:', word.word);
    
    const speak = () => {
      const utterance = new SpeechSynthesisUtterance(word.word);
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
      utterance.onerror = () => setTimeout(() => setIsPlaying(false), 1000);
      
      window.speechSynthesis.speak(utterance);
    };
    
    if (!voicesReady) {
      setTimeout(speak, 100);
    } else {
      speak();
    }
  };

  // 重置状态（仅学生端）
  useEffect(() => {
    if (!readonly) {
      resetStudentState();
      hasAutoPlayed.current = false;
    }
  }, [word.id, resetStudentState, readonly]);

  // 自动播放音频（仅首次，仅学生端）
  useEffect(() => {
    if (!hasAutoPlayed.current && word.id && !readonly) {
      hasAutoPlayed.current = true;
      const timer = setTimeout(() => {
        playAudio();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [word.id, readonly]);

  // ✅ 监听教师命令（仅学生端响应）
  useEffect(() => {
    if (teacherState.command === 'repeat' && !readonly) {
      resetStudentState();
      hasAutoPlayed.current = false;
      setTimeout(() => playAudio(), 100);
    }
  }, [teacherState.command, resetStudentState, readonly]);
  
  // 监听教师显示答案（仅学生端响应）
  useEffect(() => {
    if (teacherState.showAnswer && !submitted && !readonly) {
      const correctOpt = options.find(opt => opt.isCorrect);
      if (correctOpt) {
        studentSelectOption(correctOpt.id);
        setTimeout(() => {
          studentSubmitAnswer(true);
          setTimeout(() => onComplete(true), 800);
        }, 300);
      }
    }
  }, [teacherState.showAnswer, readonly]);

  // 生成形近词选项（3选1）
  const options = useMemo(() => {
    const correctWord = word.word;
    
    // ✅ 使用数据表中的干扰项
    let distractors = word.training?.distractors || [];
    
    // 确保有2个干扰项（3选1需要2个干扰项）
    if (distractors.length < 2) {
      console.warn(`Word "${correctWord}" missing distractors in training data, using fallback`);
      const backup = ['accept', 'except', 'effect', 'affect', 'adopt', 'adapt'];
      distractors = [...distractors, ...backup]
        .filter(d => d !== correctWord)
        .slice(0, 2);
    } else if (distractors.length > 2) {
      distractors = distractors
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
    }
    
    const allOptions = [
      { id: 0, text: correctWord, isCorrect: true },
      ...distractors.map((d, i) => ({ id: i + 1, text: d, isCorrect: false }))
    ];
    
    return allOptions.sort(() => Math.random() - 0.5);
  }, [word]);

  // 处理选项点击 - 点击即提交（参考 P1）
  const handleOptionClick = (optionId) => {
    if (submitted || readonly) return;
    
    studentSelectOption(optionId);
    
    const selected = options.find(opt => opt.id === optionId);
    const correct = selected?.isCorrect === true;
    
    console.log('🎯 [ListenAndChoose] 选择:', {
      selectedText: selected?.text,
      correctWord: word.word,
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
    <div className="listen-choose">
      {/* 播放按钮 - 视觉焦点 */}
      <button 
        className={`listen-choose__audio ${isPlaying ? 'is-playing' : ''}`}
        onClick={playAudio}
        disabled={isPlaying}
        aria-label="播放音频"
      >
        <Volume2 size={36} />
      </button>

      {/* 选项区 - 横排 3 选项 */}
      <div className="listen-choose__options">
        {options.map((option, index) => {
          // 是否选错了（用于显示正确答案的翻译）
          const showMeaning = submitted && !isCorrect && option.isCorrect;
          
          return (
            <button
              key={option.id}
              className={`listen-choose__option ${getOptionStateClass(option)} ${showMeaning ? 'is-expanded' : ''} ${readonly ? 'is-readonly' : ''}`}
              onClick={() => handleOptionClick(option.id)}
              disabled={submitted || readonly}
            >
              <div className="listen-choose__option-main">
                <span className="listen-choose__option-label">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="listen-choose__option-text">
                  {option.text}
                </span>
                {submitted && option.isCorrect && (
                  <CheckCircle2 size={18} className="listen-choose__option-icon" />
                )}
                {submitted && selectedOption === option.id && !option.isCorrect && (
                  <XCircle size={18} className="listen-choose__option-icon" />
                )}
              </div>
              {/* 选错时显示正确答案的翻译 */}
              {showMeaning && (
                <div className="listen-choose__option-meaning">
                  {word.meaning?.chinese || word.meaning}
                  <span className="listen-choose__option-pos">{word.core?.partOfSpeech}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 只读模式提示 */}
      {readonly && (
        <p className="listen-choose__readonly">观察学生操作</p>
      )}
    </div>
  );
};

export default ListenAndChoose;
>>>>>>> origin/feature/phase1-3-updates
