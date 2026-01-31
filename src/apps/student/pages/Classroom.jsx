import React, { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import WarmupStage from '../components/WarmupStage';
import ContextProbe from '../components/ContextProbe';
import { SightSoundInput } from '../components/phase1_5';
import P2Container from '../components/phase2/P2Container';
import P3Container from '../components/phase3/P3Container';
import { RedBoxContainer } from '../components/redbox';
import { WeaponPopup } from '../../../shared/components/weapon';
import useClassroomStore from '../../../shared/store/useClassroomStore';
import './Classroom.css';

// 检测武器面板是否打开
const useWeaponPanelOpen = () => {
  const { weaponPopup } = useClassroomStore();
  return weaponPopup?.isOpen && weaponPopup?.word;
};

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
    wordFlow,
    initClassroom,
    getCurrentWord,
    studentSubmitAnswer,
    nextWord,
    setPhase,
    finalizeP1,
    getP2Words,
    getWordStats,
    getRedBoxProgress,
  } = useClassroomStore();

  // 只在首次加载时初始化，视角切换不重新初始化
  useEffect(() => {
    // 只有当没有数据时才初始化
    if (wordList.length === 0) {
      initClassroom(model, 30);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 空依赖数组，只在组件首次挂载时执行

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
      // P1 所有词完成，进行分流
      setTimeout(() => {
        finalizeP1(false); // 正常完成，不强制标记未测试的词
      }, 2000);
    }
  };

  const allPhases = useMemo(() => {
    if (classroomMode === 'B') {
      return ['Warmup', 'RedBox', 'P1', 'P1.5', 'P2', 'P3'];
    }
    return ['Warmup', 'P1', 'P1.5', 'P2', 'P3'];
  }, [classroomMode]);

  const renderPhaseContent = () => {
    switch (currentPhase) {
      case 'Warmup':
        return <WarmupStage readonly={readonly} />;
      
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
      
      case 'P1.5':
        return (
          <div className="classroom__phase-content">
            <SightSoundInput readonly={readonly} />
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

  const isWeaponOpen = useWeaponPanelOpen();

  return (
    <div className="classroom">
      {/* 学习内容区域 - 导航栏已移至全局 GlobalHeader */}
      <div className={`classroom__main-container ${isWeaponOpen ? 'classroom__main-container--squeezed' : ''} ${readonly ? 'classroom__main-container--teacher' : ''}`}>
        <div className="classroom__content-wrapper">
          {renderPhaseContent()}
        </div>
        
        {/* 武器面板 - 内嵌在内容区底部 */}
        <WeaponPopup isTeacher={readonly} />
      </div>
    </div>
  );
};

export default Classroom;
