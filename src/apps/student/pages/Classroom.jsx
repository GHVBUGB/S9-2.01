import React, { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import PhaseNavigator from '../components/PhaseNavigator';
import ContextProbe from '../components/ContextProbe';
import P2Container from '../components/phase2/P2Container';
import P3Container from '../components/phase3/P3Container';
import { RedBoxContainer } from '../components/redbox';
import { WeaponPopup } from '../../../shared/components/weapon';
import useClassroomStore from '../../../shared/store/useClassroomStore';
import './Classroom.css';

/**
 * 学生端课堂页面 - 重构版布局
 * 采用顶部通栏导航 + 7:3 左右分栏
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
    initClassroom,
    getCurrentWord,
    studentSubmitAnswer,
    nextWord,
    setPhase,
  } = useClassroomStore();

  useEffect(() => {
    if (sessionStatus === 'waiting' || wordList.length === 0) {
      initClassroom(model, 30);
    }
  }, [model, sessionStatus, wordList.length, initClassroom]);

  const currentWord = getCurrentWord();

  const handleP1WordComplete = (isCorrect) => {
    studentSubmitAnswer(isCorrect);
    
    if (currentWordIndex < wordList.length - 1) {
      setTimeout(() => {
        nextWord();
      }, 300); // 极速响应
    } else {
      setTimeout(() => {
        setPhase('P2');
      }, 1000);
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
          <ContextProbe 
            word={currentWord}
            onComplete={handleP1WordComplete}
          />
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
    <div className="classroom-layout">
      <WeaponPopup />
      
      {/* 1. 顶部全局导航栏 - 整合进度 */}
      <header className="classroom-header">
        <div className="classroom-header__left">
          <div className="classroom-brand">⚡ Jarvis</div>
          <div className="classroom-mode">
            {classroomMode === 'B' ? (
              <span className="mode-tag mode-tag--b">Model B 攻坚复习</span>
            ) : (
              <span className="mode-tag mode-tag--a">Model A 标准新授</span>
            )}
          </div>
        </div>

        <div className="classroom-header__center">
          <PhaseNavigator 
            currentPhase={currentPhase}
            completedPhases={completedPhases}
            phases={allPhases}
            currentWordIndex={currentWordIndex}
            totalWords={wordList.length}
            showRedBox={classroomMode === 'B'}
          />
        </div>

        <div className="classroom-header__right">
          <div className="user-profile">
            <span className="user-name">Alex Johnson</span>
            <div className="user-avatar">AJ</div>
          </div>
        </div>
      </header>
      
      {/* 2. 核心内容区 */}
      <main className="classroom-main">
        {renderPhaseContent()}
      </main>
    </div>
  );
};

export default Classroom;
