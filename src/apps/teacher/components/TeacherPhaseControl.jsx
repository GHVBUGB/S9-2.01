import React, { useState } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import useClassroomStore from '../../../shared/store/useClassroomStore';
import Button from '../../../shared/components/ui/Button';
import './TeacherPhaseControl.css';

/**
 * 教师端阶段控制按钮
 * 常驻悬浮按钮，允许老师随时跳转到下一阶段
 */
const TeacherPhaseControl = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  
  const {
    currentPhase,
    classroomMode,
    setPhase,
    wordList,
    currentWordIndex,
  } = useClassroomStore();

  // 阶段配置
  const phaseConfig = {
    'RedBox': { name: '红盒攻坚', next: 'P1', nextName: 'P1 精准筛查' },
    'P1': { name: 'P1 精准筛查', next: 'P2', nextName: 'P2 多维训练' },
    'P2': { name: 'P2 多维训练', next: 'P3', nextName: 'P3 验收闯关' },
    'P3': { name: 'P3 验收闯关', next: null, nextName: '完成课程' },
  };

  const currentConfig = phaseConfig[currentPhase];
  const isLastPhase = !currentConfig?.next;

  // 获取当前阶段进度
  const getProgress = () => {
    if (currentPhase === 'P1') {
      return `${currentWordIndex + 1}/${wordList.length}`;
    }
    return null;
  };

  const handleNextPhase = () => {
    if (isLastPhase) {
      // 完成课程
      alert('🎉 课程已完成！');
      return;
    }
    setShowConfirm(true);
  };

  const confirmNextPhase = () => {
    if (currentConfig?.next) {
      setPhase(currentConfig.next);
      setShowConfirm(false);
    }
  };

  const cancelNextPhase = () => {
    setShowConfirm(false);
  };

  const progress = getProgress();

  return (
    <>
      {/* 悬浮按钮 */}
      <div className="teacher-phase-control">
        <button 
          className={`phase-control-btn ${isLastPhase ? 'phase-control-btn--complete' : ''}`}
          onClick={handleNextPhase}
        >
          <div className="phase-control-btn__current">
            <span className="phase-control-btn__label">当前</span>
            <span className="phase-control-btn__phase">
              {currentConfig?.name}
              {progress && <span className="phase-control-btn__progress"> ({progress})</span>}
            </span>
          </div>
          <div className="phase-control-btn__divider"></div>
          <div className="phase-control-btn__next">
            {isLastPhase ? (
              <>
                <CheckCircle size={20} />
                <span>完成课程</span>
              </>
            ) : (
              <>
                <span>{currentConfig?.nextName}</span>
                <ArrowRight size={20} />
              </>
            )}
          </div>
        </button>
      </div>

      {/* 确认对话框 */}
      {showConfirm && (
        <div className="phase-control-modal">
          <div className="phase-control-modal__overlay" onClick={cancelNextPhase}></div>
          <div className="phase-control-modal__content">
            <h3 className="phase-control-modal__title">
              确定进入下一阶段吗？
            </h3>
            <p className="phase-control-modal__message">
              当前 <strong>{currentConfig?.name}</strong>
              {progress && ` 仅完成 ${progress} 个单词`}。
              <br />
              进入 <strong>{currentConfig?.nextName}</strong> 后，将使用当前已完成的单词数据继续教学。
            </p>
            <div className="phase-control-modal__actions">
              <Button variant="secondary" onClick={cancelNextPhase}>
                取消
              </Button>
              <Button variant="primary" onClick={confirmNextPhase}>
                确认进入
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TeacherPhaseControl;
