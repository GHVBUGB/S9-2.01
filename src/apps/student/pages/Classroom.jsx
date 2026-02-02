import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import WarmupStage from '../components/WarmupStage';
import ContextProbe from '../components/ContextProbe';
import { SightSoundInput } from '../components/phase1_5';
import P2Container from '../components/phase2/P2Container';
import P3Container from '../components/phase3/P3Container';
import { RedBoxContainer } from '../components/redbox';
import { WeaponPopup } from '../../../shared/components/weapon';
import useClassroomStore from '../../../shared/store/useClassroomStore';
import { StudentReviewReport } from '../components/reviewReport/StudentReviewReport';
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
  const navigate = useNavigate();
  const model = searchParams.get('model') || 'A';
  const [showReport, setShowReport] = useState(false);

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
    // 如果 currentPhase 为空或未定义，显示加载状态并尝试初始化
    if (!currentPhase) {
      console.warn('[Classroom] currentPhase is null/undefined:', {
        currentPhase,
        type: typeof currentPhase,
        classroomMode,
        wordListLength: wordList.length
      });
      // 如果还没有初始化，尝试初始化
      if (wordList.length === 0) {
        initClassroom(model, 30);
      }
      return <div className="classroom__loading">初始化中...</div>;
    }

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
        // 未知阶段 - 显示复习报告（课程结束）
        // 记录详细的调试信息
        console.log('[Classroom] Unknown phase detected - showing report:', {
          currentPhase,
          type: typeof currentPhase,
          classroomMode,
          wordListLength: wordList.length,
          currentWordIndex,
          sessionStatus,
          allPhases
        });
        
        // 如果报告还未显示，则显示报告
        if (!showReport) {
          setTimeout(() => {
            setShowReport(true);
          }, 100);
        }
        
        return null; // 不渲染任何内容，报告会以弹窗形式显示
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
      
      {/* 课程结束报告弹窗 */}
      {showReport && (
        <StudentReviewReport 
          onClose={() => {
            setShowReport(false);
            // 关闭报告后返回首页
            navigate('/');
          }} 
        />
      )}
    </div>
  );
};

export default Classroom;
