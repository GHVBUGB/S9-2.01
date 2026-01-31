import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Volume2, Check } from 'lucide-react';
import useClassroomStore from '../../../../shared/store/useClassroomStore';
import './SightSoundInput.css';

/**
 * L1.5 认读跟读 (Sight & Sound Input) - 极简重构版
 * 设计原则：无卡片、大留白、视觉聚焦、高级感（与 ContextProbe 一致）
 * 
 * 核心逻辑：视听输入 -> 学生自主跟读 (Input to Output)
 * 单词范围：只跟读 P1 错词
 * 
 * @param {boolean} readonly - 是否只读模式（教师端使用）
 */

// 状态阶段枚举
const PHASE = {
  READY: 'ready',
  PLAYING: 'playing',
  DISPLAYED: 'displayed', // 播放后停留展示
};

const SightSoundInput = ({ readonly = false }) => {
  const {
    sightSound,
    wordFlow,
    getCurrentGroupWords,
    getCurrentGroupInfo,
    nextSightSoundWord,
    completeSightSound,
    skipSightSound,
    teacherState,
  } = useClassroomStore();

  // P1.5 跟读使用当前组的单词（5个一组）
  const groupWords = getCurrentGroupWords ? getCurrentGroupWords() : [];
  const groupInfo = getCurrentGroupInfo ? getCurrentGroupInfo() : null;
  const currentIndex = sightSound?.currentIndex || 0;
  const currentWord = groupWords[currentIndex];
  
  const [phase, setPhase] = useState(PHASE.READY);
  const [voicesReady, setVoicesReady] = useState(false);
  const autoNextTimerRef = useRef(null);
  
  // 预加载语音列表（解决第一次发音异常的问题）
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesReady(true);
        console.log('✅ 语音引擎已加载，共', voices.length, '个语音');
      }
    };
    
    // 立即尝试加载
    loadVoices();
    
    // 监听语音列表变化
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // 重置状态
  useEffect(() => {
    setPhase(PHASE.READY);
  }, [currentIndex, currentWord?.id]);

  // 监听教师跳过
  useEffect(() => {
    if (teacherState?.command === 'skipSightSound' && !readonly) {
      skipSightSound?.();
    }
  }, [teacherState?.command, readonly, skipSightSound]);

  // 下一词
  const handleNext = useCallback(() => {
    if (autoNextTimerRef.current) {
      clearTimeout(autoNextTimerRef.current);
    }
    if (currentIndex < groupWords.length - 1) {
      nextSightSoundWord?.();
    } else {
      // 当前组跟读完成，进入 P2
      completeSightSound?.();
    }
  }, [currentIndex, groupWords.length, nextSightSoundWord, completeSightSound]);

  // 播放音频 - 使用优化的浏览器 TTS（最可靠）
  const playAudio = useCallback(() => {
    if (!currentWord) return;
    
    setPhase(PHASE.PLAYING);
    
    // 停止当前播放
    window.speechSynthesis.cancel();
    
    const speak = () => {
      const utterance = new SpeechSynthesisUtterance(currentWord.word);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // 选择最佳语音
      const voices = window.speechSynthesis.getVoices();
      const preferredVoices = [
        'Google US English',
        'Microsoft Zira - English (United States)',
        'Samantha',
        'Alex'
      ];
      
      for (const voiceName of preferredVoices) {
        const voice = voices.find(v => v.name.includes(voiceName));
        if (voice) {
          utterance.voice = voice;
          console.log('🔊 使用语音:', voice.name);
          break;
        }
      }
      
      utterance.onend = () => {
        setPhase(PHASE.DISPLAYED);
      };
      
      utterance.onerror = (e) => {
        console.warn('语音播放错误:', e);
        setTimeout(() => {
          setPhase(PHASE.DISPLAYED);
        }, 1200);
      };
      
      window.speechSynthesis.speak(utterance);
    };
    
    // 如果语音未准备好，等待一下
    if (!voicesReady) {
      console.log('⏳ 等待语音引擎加载...');
      setTimeout(speak, 100);
    } else {
      speak();
    }
  }, [currentWord, voicesReady]);

  // 自动播放
  useEffect(() => {
    if (phase === PHASE.READY && currentWord && !readonly) {
      const timer = setTimeout(playAudio, 600);
      return () => clearTimeout(timer);
    }
  }, [phase, currentWord, readonly, playAudio]);

  // 教师控制
  const handleTeacherPlay = () => readonly && playAudio();
  const handleTeacherSkip = () => readonly && skipSightSound?.();

  // 无错词
  if (!currentWord || groupWords.length === 0) {
    return (
      <div className="sight-sound">
        <div className="sight-sound__empty">
          <Check size={48} strokeWidth={1.5} />
          <h2>太棒了！</h2>
          <p>第一轮筛查全部正确，跳过跟读环节</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sight-sound">
      {/* 进度药丸 - 与 P2 保持一致 */}
      <div className="sight-sound__progress-wrapper">
        <div className="sight-sound__progress-pill">
          {groupInfo && groupInfo.batch === 'wrong' && (
            <span className="sight-sound__group-badge">
              生词第{groupInfo.groupIndex + 1}组
            </span>
          )}
          跟读进度: {currentIndex + 1} / {groupWords.length}
        </div>
      </div>

      {/* 主内容区域 - 垂直居中 */}
      <div className="sight-sound__content">
        {/* 核心单词 - 大字号视觉焦点 */}
        <div className={`sight-sound__word ${phase === PHASE.PLAYING ? 'is-playing' : ''}`}>
          {currentWord.word}
        </div>

        {/* 音标 - 修正路径 */}
        <div className="sight-sound__phonetic">
          {currentWord.sound?.phonetic || currentWord.phonetic || `/ˈwɜːrd/`}
        </div>

        {/* 中文释义 */}
        <div className="sight-sound__meaning">
          <span className="sight-sound__pos">
            {currentWord.core?.partOfSpeech || currentWord.partOfSpeech || 'v.'}
          </span>
          <span className="sight-sound__chinese">
            {currentWord.meaning?.chinese || currentWord.meaning?.definitionCn || '释义'}
          </span>
        </div>

        {/* 交互区域 */}
        <div className="sight-sound__action">
          {/* 学生端 - 仅播放时显示提示 */}
          {!readonly && phase === PHASE.PLAYING && (
            <div className="sight-sound__playing">
              <Volume2 size={32} className="sight-sound__volume-icon" />
              <span className="sight-sound__hint">请跟读单词</span>
            </div>
          )}

          {/* 教师端控制 */}
          {readonly && (
            <div className="sight-sound__teacher-controls">
              <button className="sight-sound__teacher-btn" onClick={handleTeacherPlay}>
                <Volume2 size={18} />
                播放音频
              </button>
              <button 
                className="sight-sound__teacher-btn sight-sound__teacher-btn--primary" 
                onClick={handleNext}
              >
                下一个
              </button>
              <button className="sight-sound__teacher-btn sight-sound__teacher-btn--skip" onClick={handleTeacherSkip}>
                跳过跟读
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SightSoundInput;
