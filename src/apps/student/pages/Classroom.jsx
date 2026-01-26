import React, { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Card from '../../../shared/components/ui/Card';
import Badge from '../../../shared/components/ui/Badge';
import Button from '../../../shared/components/ui/Button';
import PhaseNavigator from '../components/PhaseNavigator';
import ContextProbe from '../components/ContextProbe';
import P2Container from '../components/phase2/P2Container';
import P3Container from '../components/phase3/P3Container';
import { RedBoxContainer } from '../components/redbox';
import { WeaponPopup } from '../../../shared/components/weapon';
import useClassroomStore from '../../../shared/store/useClassroomStore';
import './Classroom.css';

/**
 * 学生端课堂页面
 * 使用共享的 useClassroomStore 与教师端联动
 * 支持 Model A（标准新授）和 Model B（攻坚复习）
 */
const Classroom = () => {
  const [searchParams] = useSearchParams();
  const model = searchParams.get('model') || 'A';

  const {
    classroomMode,
    wordList,
    currentPhase,
    completedPhases,
    currentWordIndex,
    sessionStatus,
    redBoxCompleted,
    initClassroom,
    getCurrentWord,
    studentSubmitAnswer,
    nextWord,
    setPhase,
    getP2Words,
    getWordStats,
    getRedBoxProgress,
  } = useClassroomStore();

  useEffect(() => {
    if (sessionStatus === 'waiting' || wordList.length === 0) {
      initClassroom(model, 30); // 使用完整的30个单词
    }
  }, [model]);

  const currentWord = getCurrentWord();
  const wordStats = getWordStats();
  const redBoxProgress = getRedBoxProgress();

  const handleP1WordComplete = (isCorrect) => {
    studentSubmitAnswer(isCorrect);
    
    if (currentWordIndex < wordList.length - 1) {
      setTimeout(() => {
        nextWord();
      }, 1500);
    } else {
      setTimeout(() => {
        setPhase('P2');
      }, 2000);
    }
  };

  const allPhases = useMemo(() => {
    if (classroomMode === 'B') {
      return ['RedBox', 'P1', 'P2', 'P3'];
    }
    return ['P1', 'P2', 'P3'];
  }, [classroomMode]);

  const renderPhaseContent = () => {
    switch (currentPhase) {
      case 'RedBox':
        return <RedBoxContainer />;
      
      case 'P1':
        if (!currentWord) {
          return <div className="classroom__loading">加载中...</div>;
        }
        return (
          <div className="classroom__phase-content">
            <div className="classroom__progress-wrapper">
              <div className="classroom__progress-pill">
                单词进度: {currentWordIndex + 1} / {wordList.length}
              </div>
            </div>
            <ContextProbe 
              word={currentWord}
              onComplete={handleP1WordComplete}
            />
          </div>
        );
      
      case 'P2':
        return <P2Container />;
      
      case 'P3':
        return <P3Container />;
      
      default:
        return <div>未知阶段</div>;
    }
  };

  return (
    <div className="classroom">
      <WeaponPopup />
      
      {/* 顶部状态栏 - 模仿图1极简风 */}
      <div className="classroom__header-minimal">
        <div className="classroom__brand">⚡ Jarvis</div>
        <div className="classroom__model-info">
          {classroomMode === 'B' ? (
            <span className="classroom__mode-tag classroom__mode-tag--b">🔴 Model B 攻坚复习</span>
          ) : (
            <span className="classroom__mode-tag classroom__mode-tag--a">🟢 Model A 标准新授</span>
          )}
        </div>
        <div className="classroom__user-info">
          <span>Alex Johnson</span>
          <span className="user-role">STUDENT</span>
          <div className="user-avatar">AJ</div>
        </div>
      </div>
      
      {/* 核心导航 */}
      <div className="classroom__nav-container">
        <PhaseNavigator 
          currentPhase={currentPhase}
          completedPhases={completedPhases}
          phases={allPhases}
          showRedBox={classroomMode === 'B'}
        />
      </div>

      {/* 学习内容区域 */}
      <div className="classroom__main-container">
        {renderPhaseContent()}
      </div>
      
      {/* 底部信息 (仅在非核心环节显示，或保持极简) */}
      {currentPhase !== 'P1' && (
        <div className="classroom__footer-info">
          {/* 这里可以保留之前的统计卡片，或者隐藏以保持纯净 */}
        </div>
      )}
    </div>
  );
};

export default Classroom;
