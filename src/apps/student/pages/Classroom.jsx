import React, { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ContextProbe from '../components/ContextProbe';
import P2Container from '../components/phase2/P2Container';
import P3Container from '../components/phase3/P3Container';
import { RedBoxContainer } from '../components/redbox';
import { WeaponPopup } from '../../../shared/components/weapon';
import useClassroomStore from '../../../shared/store/useClassroomStore';
import './Classroom.css';

/**
 * 课堂页面（学生端 + 教师端共用）
 * 使用共享的 useClassroomStore 与教师端联动
 * 支持 Model A（标准新授）和 Model B（攻坚复习）
 * @param {boolean} readonly - 是否只读模式（教师端使用）
 */
const Classroom = ({ readonly = false }) => {
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
        return <RedBoxContainer readonly={readonly} />;
      
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
              readonly={readonly}
            />
          </div>
        );
      
      case 'P2':
        return <P2Container readonly={readonly} />;
      
      case 'P3':
        return <P3Container readonly={readonly} />;
      
      default:
        return <div>未知阶段</div>;
    }
  };

  return (
    <div className="classroom">
      <WeaponPopup />
      
      {/* 学习内容区域 - 导航栏已移至全局 GlobalHeader */}
      <div className="classroom__main-container">
        {renderPhaseContent()}
      </div>
    </div>
  );
};

export default Classroom;
