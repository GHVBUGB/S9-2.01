import React, { useState } from 'react';
import { 
  Scissors, Lightbulb, Image, Sprout, 
  ChevronRight, AlertTriangle, X, RotateCcw 
} from 'lucide-react';
import useClassroomStore from '../../../shared/store/useClassroomStore';
import './TeacherToolbar.css';

/**
 * 教师端底部工具栏 - 毛玻璃悬浮设计
 * 包含：4个武器横排 + 下一阶段圆形按钮
 */
const TeacherToolbar = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  
  const {
    currentPhase,
    wordType,
    p3WaitingForRetry,
    getActiveWord,
    weaponPopup,
    openWeaponPopup,
    closeWeaponPopup,
    forceNextPhase,
    getNextPhaseInfo,
    triggerP3Retry,
  } = useClassroomStore();

  const currentWord = getActiveWord();
  const nextPhaseInfo = getNextPhaseInfo();

  // 武器列表
  const weapons = [
    { id: 'syllables', name: '拆音节', icon: <Scissors size={20} />, field: 'core.syllables' },
    { id: 'mnemonic', name: '读口诀', icon: <Lightbulb size={20} />, field: 'logic.mnemonic' },
    { id: 'image', name: '看图片', icon: <Image size={20} />, field: 'visual.imageUrl' },
    { id: 'etymology', name: '讲词根', icon: <Sprout size={20} />, field: 'logic.etymology' },
  ];

  // 阶段名称
  const phaseNames = {
    RedBox: 'Red Box',
    P1: '精准筛查',
    P2: '集中训练',
    P3: '门神验收',
    Summary: '课堂总结',
  };

  // 检查资源是否可用
  const isResourceAvailable = (field) => {
    if (!currentWord) return false;
    const parts = field.split('.');
    let value = currentWord;
    for (const part of parts) {
      value = value?.[part];
      if (value === undefined || value === null) return false;
    }
    return Boolean(value);
  };

  // 处理武器点击
  const handleWeaponClick = (weaponId) => {
    if (!currentWord) return;
    
    // 如果当前已打开该武器，则关闭
    if (weaponPopup.isOpen && weaponPopup.weaponId === weaponId) {
      closeWeaponPopup();
    } else {
      openWeaponPopup(weaponId, currentWord);
    }
  };

  // 处理下一阶段
  const handleNextPhase = () => {
    forceNextPhase();
    setShowConfirm(false);
  };
  
  // 处理 P3 重试（非核心词）
  const handleRetry = () => {
    triggerP3Retry();
  };
  
  // 判断是否显示重试按钮
  const showRetryButton = currentPhase === 'P3' && wordType === 'non-core' && p3WaitingForRetry;

  // Warmup 和 RedBox 阶段不显示此工具栏
  if (currentPhase === 'Warmup' || currentPhase === 'RedBox') {
    return null;
  }

  return (
    <>
      <div className="teacher-toolbar">
        {/* 武器区 */}
        <div className="teacher-toolbar__weapons">
          {weapons.map((weapon) => {
            const available = isResourceAvailable(weapon.field);
            const isActive = weaponPopup.isOpen && weaponPopup.weaponId === weapon.id;
            
            return (
              <button
                key={weapon.id}
                className={`teacher-toolbar__weapon ${isActive ? 'is-active' : ''} ${!available ? 'is-disabled' : ''}`}
                onClick={() => handleWeaponClick(weapon.id)}
                disabled={!available}
                title={weapon.name}
              >
                {weapon.icon}
                <span>{weapon.name}</span>
              </button>
            );
          })}
        </div>

        {/* 再试一次按钮（非核心词 P3，学生第1次答错时显示） */}
        {showRetryButton && (
          <button
            className="teacher-toolbar__retry"
            onClick={handleRetry}
            title="让学生再试一次"
          >
            <RotateCcw size={20} />
            <span>再试一次</span>
          </button>
        )}

        {/* 下一阶段按钮 */}
        {nextPhaseInfo && !showRetryButton && (
          <button
            className="teacher-toolbar__next"
            onClick={() => setShowConfirm(true)}
            title={`下一阶段: ${nextPhaseInfo.name}`}
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      {/* 确认弹窗 */}
      {showConfirm && (
        <div className="teacher-toolbar__overlay" onClick={() => setShowConfirm(false)}>
          <div className="teacher-toolbar__confirm" onClick={(e) => e.stopPropagation()}>
            <button className="teacher-toolbar__confirm-close" onClick={() => setShowConfirm(false)}>
              <X size={18} />
            </button>
            <div className="teacher-toolbar__confirm-icon">
              <AlertTriangle size={24} />
            </div>
            <h3>确认进入下一阶段？</h3>
            <p>
              当前: <strong>{phaseNames[currentPhase]}</strong> → 
              下一阶段: <strong>{nextPhaseInfo?.name}</strong>
            </p>
            <p className="teacher-toolbar__confirm-warning">
              未完成的单词将被跳过
            </p>
            <div className="teacher-toolbar__confirm-actions">
              <button onClick={() => setShowConfirm(false)}>取消</button>
              <button className="is-primary" onClick={handleNextPhase}>确认</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TeacherToolbar;
