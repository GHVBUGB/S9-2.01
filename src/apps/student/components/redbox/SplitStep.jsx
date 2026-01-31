import React, { useState, useEffect } from 'react';
import useClassroomStore from '../../../../shared/store/useClassroomStore';
import Button from '../../../../shared/components/ui/Button';
import Card from '../../../../shared/components/ui/Card';
import { Volume2, Play, CheckCircle2 } from 'lucide-react';
import './SplitStep.css';

/**
 * Step 1: 定音定形
 * 
 * 目的：帮助学生建立单词的"音形对应"
 * 内容展示：
 * - 音节拆解（高亮显示）
 * - 音频播放
 * - 形态分析（词根词缀）
 */
const SplitStep = ({ word, onComplete }) => {
  const {
    studentState,
    teacherState,
    studentSelectOption,
    resetStudentState,
  } = useClassroomStore();

  const [showSyllables, setShowSyllables] = useState(false);
  const [showEtymology, setShowEtymology] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [voicesReady, setVoicesReady] = useState(false);
  
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

  // 重置状态
  useEffect(() => {
    setShowSyllables(false);
    setShowEtymology(false);
    setAudioPlayed(false);
    setIsComplete(false);
  }, [word.id]);

  // 监听教师命令
  useEffect(() => {
    if (teacherState.command === 'revealSyllables') {
      setShowSyllables(true);
    } else if (teacherState.command === 'revealEtymology') {
      setShowEtymology(true);
    } else if (teacherState.command === 'playAudio') {
      handlePlayAudio();
    } else if (teacherState.command === 'completeSplit') {
      handleComplete();
    }
  }, [teacherState.command]);

  // 播放音频（优化版本）
  const handlePlayAudio = () => {
    console.log(`🔊 播放音频: ${word.word}`);
    setAudioPlayed(true);
    window.speechSynthesis.cancel();
    
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
      
      window.speechSynthesis.speak(utterance);
    };
    
    if (!voicesReady) {
      setTimeout(speak, 100);
    } else {
      speak();
    }
  };

  // 渐进披露：点击显示音节
  const handleRevealSyllables = () => {
    setShowSyllables(true);
    studentSelectOption('syllables_revealed');
  };

  // 渐进披露：点击显示词源
  const handleRevealEtymology = () => {
    setShowEtymology(true);
    studentSelectOption('etymology_revealed');
  };

  // 完成此步骤
  const handleComplete = () => {
    setIsComplete(true);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  // 检查是否可以完成
  const canComplete = audioPlayed && showSyllables && showEtymology;

  return (
    <div className="split-step">
      <div className="split-step__title">
        <span className="split-step__title-icon">🔤</span>
        Step 1: 定音定形
        <span className="split-step__title-desc">建立音形对应</span>
      </div>

      <div className="split-step__content">
        {/* 音频播放区 */}
        <Card variant="outline" padding="md" className="split-step__audio-section">
          <div className="split-step__section-label">
            <Volume2 size={18} />
            听音识词
          </div>
          <div className="split-step__audio-controls">
            <Button
              variant={audioPlayed ? 'secondary' : 'primary'}
              onClick={handlePlayAudio}
              className="split-step__play-btn"
            >
              <Play size={20} />
              {audioPlayed ? '再听一遍' : '点击听发音'}
            </Button>
            {audioPlayed && (
              <div className="split-step__audio-feedback">
                <CheckCircle2 size={16} color="var(--color-green)" />
                <span>已播放</span>
              </div>
            )}
          </div>
          <div className="split-step__phonetic">
            <span className="split-step__ipa">{word.sound?.ipa}</span>
          </div>
        </Card>

        {/* 音节拆解区 */}
        <Card variant="outline" padding="md" className="split-step__syllables-section">
          <div className="split-step__section-label">
            音节拆解
          </div>
          {showSyllables ? (
            <div className="split-step__syllables-display">
              <div className="split-step__syllables-word">
                {word.sound?.syllables?.split(' · ').map((syllable, idx) => (
                  <span 
                    key={idx} 
                    className="split-step__syllable"
                    style={{ animationDelay: `${idx * 0.15}s` }}
                  >
                    {syllable}
                    {idx < word.sound?.syllables?.split(' · ').length - 1 && (
                      <span className="split-step__syllable-dot">·</span>
                    )}
                  </span>
                ))}
              </div>
              <div className="split-step__syllables-count">
                共 {word.sound?.syllables?.split(' · ').length || 0} 个音节
              </div>
            </div>
          ) : (
            <Button 
              variant="ghost" 
              onClick={handleRevealSyllables}
              className="split-step__reveal-btn"
            >
              点击查看音节拆解
            </Button>
          )}
        </Card>

        {/* 词源分析区 */}
        <Card variant="outline" padding="md" className="split-step__etymology-section">
          <div className="split-step__section-label">
            🧬 词源分析
          </div>
          {showEtymology ? (
            <div className="split-step__etymology-display">
              <p className="split-step__etymology-text">
                {word.logic?.etymology || '暂无词源信息'}
              </p>
              {word.logic?.confusables && word.logic.confusables.length > 0 && (
                <div className="split-step__confusables">
                  <span className="split-step__confusables-label">易混淆词:</span>
                  {word.logic.confusables.map((conf, idx) => (
                    <span key={idx} className="split-step__confusable-word">
                      {conf}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Button 
              variant="ghost" 
              onClick={handleRevealEtymology}
              className="split-step__reveal-btn"
            >
              点击查看词源分析
            </Button>
          )}
        </Card>
      </div>

      {/* 完成按钮 */}
      <div className="split-step__footer">
        {canComplete ? (
          <Button
            variant="primary"
            onClick={handleComplete}
            className={`split-step__complete-btn ${isComplete ? 'split-step__complete-btn--done' : ''}`}
            disabled={isComplete}
          >
            {isComplete ? (
              <>
                <CheckCircle2 size={18} />
                完成！进入下一步...
              </>
            ) : (
              '✅ 我记住了，继续'
            )}
          </Button>
        ) : (
          <div className="split-step__hint">
            请完成以上所有步骤后继续
          </div>
        )}
      </div>
    </div>
  );
};

export default SplitStep;
