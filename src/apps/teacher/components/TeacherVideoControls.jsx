import React, { useState } from 'react';
import { 
  Wrench, FastForward, X, Scissors, Lightbulb, Image, Sprout, AlertTriangle,
  Volume2, Eye, Layers, Brain, Wand2, ChevronRight, RotateCcw, SkipForward
} from 'lucide-react';
import useClassroomStore from '../../../shared/store/useClassroomStore';
import Badge from '../../../shared/components/ui/Badge';
import './TeacherVideoControls.css';

/**
 * 教师端视频区控制面板
 * 
 * RedBox 阶段：显示专属控制面板（武器库扩展模式）
 * 其他阶段：显示常规武器库 + 下一阶段按钮
 */
const TeacherVideoControls = () => {
  const [showWeapons, setShowWeapons] = useState(false);
  const [showForceConfirm, setShowForceConfirm] = useState(false);
  
  const {
    currentPhase,
    getActiveWord,
    weaponPopup,
    openWeaponPopup,
    closeWeaponPopup,
    forceNextPhase,
    getNextPhaseInfo,
    wordList,
    currentWordIndex,
    studentState,
    // RedBox 专属
    redWords,
    redBoxStep,
    currentRedWordIndex,
    redBoxUI,
    updateRedBoxUI,
    teacherSendCommand,
    teacherSelectWeapon,
    teacherState,
    getCurrentRedWord,
  } = useClassroomStore();

  // 获取当前阶段正在学习的单词
  const currentWord = getActiveWord();
  const nextPhaseInfo = getNextPhaseInfo();
  const currentRedWord = getCurrentRedWord();

  // 阶段名称
  const phaseNames = {
    RedBox: 'Red Box',
    P1: '精准筛查',
    P2: '集中训练',
    P3: '门神验收',
    Summary: '课堂总结',
  };

  // RedBox 步骤名称
  const redBoxStepNames = ['定音定形', '精准助记', 'L4 验收'];

  // 武器列表（常规武器库）
  const weapons = [
    { id: 'syllables', name: '拆音节', icon: <Scissors size={18} />, field: 'core.syllables' },
    { id: 'mnemonic', name: '读口诀', icon: <Lightbulb size={18} />, field: 'logic.mnemonic' },
    { id: 'image', name: '看图片', icon: <Image size={18} />, field: 'visual.imageUrl' },
    { id: 'etymology', name: '讲词根', icon: <Sprout size={18} />, field: 'logic.etymology' },
  ];

  // RedBox Step 2 武器（精准助记阶段）
  const redBoxWeapons = [
    { id: 'context', name: '语境', icon: <Wand2 size={16} /> },
    { id: 'visual', name: '口诀', icon: <Lightbulb size={16} /> },
    { id: 'compare', name: '对比', icon: <Brain size={16} /> },
  ];

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

  // 处理武器点击（常规武器库）
  const handleWeaponClick = (weaponId) => {
    if (!currentWord) return;
    openWeaponPopup(weaponId, currentWord);
    // 不关闭武器库，让老师可以连续选择不同武器
  };

  // 处理强制进入下一阶段
  const handleForceNext = () => {
    forceNextPhase();
    setShowForceConfirm(false);
  };

  // 计算当前进度
  const getProgress = () => {
    if (currentPhase === 'RedBox') {
      return `${currentRedWordIndex + 1}/${redWords.length}`;
    }
    const tested = currentWordIndex + (studentState.isSubmitted ? 1 : 0);
    return `${tested}/${wordList.length}`;
  };

  // ========================================
  // RedBox Step 1: 定音定形操作
  // ========================================
  const handlePlayAudio = () => {
    updateRedBoxUI({ audioPlayed: true });
    teacherSendCommand('playAudio');
  };

  const handleShowSyllables = () => {
    updateRedBoxUI({ showSyllables: true });
    teacherSendCommand('showSyllables');
  };

  const handleShowPhonetic = () => {
    updateRedBoxUI({ showPhonetic: true });
    teacherSendCommand('showPhonetic');
  };

  // ========================================
  // RedBox Step 2: 精准助记操作
  // ========================================
  const handleSelectWeapon = (weaponId) => {
    updateRedBoxUI({ selectedWeapon: weaponId });
    teacherSelectWeapon(weaponId);
  };

  // ========================================
  // RedBox Step 3: L4 验收操作
  // ========================================
  const handleShowAnswer = () => {
    updateRedBoxUI({ showAnswer: true });
    teacherSendCommand('showAnswer');
  };

  const handleRepeat = () => {
    updateRedBoxUI({ showAnswer: false });
    teacherSendCommand('repeat');
  };

  // ========================================
  // RedBox 阶段专属控制面板
  // ========================================
  if (currentPhase === 'RedBox') {
    return (
      <div className="teacher-video-controls teacher-video-controls--redbox">
        {/* 标题栏 */}
        <div className="redbox-panel__header">
          <div className="redbox-panel__title">
            <span className="redbox-panel__badge">🔴</span>
            Red Box 攻坚
          </div>
          <div className="redbox-panel__progress">
            {currentRedWordIndex + 1} / {redWords.length}
          </div>
        </div>

        {/* 当前单词 */}
        {currentRedWord && (
          <div className="redbox-panel__word">
            <span className="redbox-panel__word-text">{currentRedWord.word}</span>
            <span className="redbox-panel__word-meaning">{currentRedWord.meaning?.definitionCn}</span>
          </div>
        )}

        {/* 步骤指示器 */}
        <div className="redbox-panel__steps">
          {redBoxStepNames.map((name, idx) => (
            <div 
              key={idx}
              className={`redbox-panel__step ${redBoxStep === idx + 1 ? 'is-active' : ''} ${redBoxStep > idx + 1 ? 'is-done' : ''}`}
            >
              <span className="redbox-panel__step-num">{idx + 1}</span>
              <span className="redbox-panel__step-name">{name}</span>
            </div>
          ))}
        </div>

        {/* Step 1: 定音定形操作 */}
        {redBoxStep === 1 && (
          <div className="redbox-panel__actions">
            <div className="redbox-panel__action-label">👂 听音识形</div>
            <div className="redbox-panel__action-grid">
              <button 
                className={`redbox-panel__action-btn ${redBoxUI.audioPlayed ? 'is-done' : ''}`}
                onClick={handlePlayAudio}
              >
                <Volume2 size={18} />
                <span>播放发音</span>
              </button>
              <button 
                className={`redbox-panel__action-btn ${redBoxUI.showSyllables ? 'is-done' : ''}`}
                onClick={handleShowSyllables}
              >
                <Layers size={18} />
                <span>显示音节</span>
              </button>
              <button 
                className={`redbox-panel__action-btn ${redBoxUI.showPhonetic ? 'is-done' : ''}`}
                onClick={handleShowPhonetic}
              >
                <Eye size={18} />
                <span>显示音标</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: 精准助记操作 */}
        {redBoxStep === 2 && (
          <div className="redbox-panel__actions">
            <div className="redbox-panel__action-label">🛠️ 选择助记武器</div>
            <div className="redbox-panel__weapon-grid">
              {redBoxWeapons.map((weapon) => (
                <button
                  key={weapon.id}
                  className={`redbox-panel__weapon-btn ${redBoxUI.selectedWeapon === weapon.id ? 'is-active' : ''}`}
                  onClick={() => handleSelectWeapon(weapon.id)}
                >
                  {weapon.icon}
                  <span>{weapon.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: L4 验收操作 */}
        {redBoxStep === 3 && (
          <div className="redbox-panel__actions">
            <div className="redbox-panel__action-label">✍️ 验收操作</div>
            <div className="redbox-panel__action-grid">
              <button 
                className={`redbox-panel__action-btn ${redBoxUI.showAnswer ? 'is-done' : ''}`}
                onClick={handleShowAnswer}
              >
                <Eye size={18} />
                <span>显示答案</span>
              </button>
              <button 
                className="redbox-panel__action-btn"
                onClick={handleRepeat}
              >
                <RotateCcw size={18} />
                <span>重新验收</span>
              </button>
            </div>
            {/* 学生状态 */}
            <div className="redbox-panel__student-status">
              <span>学生输入：</span>
              <span className="redbox-panel__student-input">
                {studentState.inputText || '等待输入...'}
              </span>
              {studentState.isSubmitted && (
                <Badge 
                  variant={studentState.isCorrect ? 'green' : 'red'} 
                  size="sm"
                >
                  {studentState.isCorrect ? '✅ 正确' : '❌ 错误'}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* 下一步按钮 */}
        <button 
          className="redbox-panel__next-btn"
          onClick={() => teacherSendCommand('nextStep')}
        >
          <ChevronRight size={18} />
          {redBoxStep < 3 
            ? `进入 Step ${redBoxStep + 1}: ${redBoxStepNames[redBoxStep]}` 
            : (currentRedWordIndex < redWords.length - 1 
                ? '下一个红词' 
                : '🎓 完成红盒，进入新词')}
        </button>

        {/* 跳过按钮 */}
        <button 
          className="redbox-panel__skip-btn"
          onClick={() => setShowForceConfirm(true)}
        >
          <SkipForward size={14} />
          跳过 Red Box
        </button>

        {/* 确认弹窗 */}
        {showForceConfirm && (
          <div className="teacher-video-controls__confirm-overlay" onClick={() => setShowForceConfirm(false)}>
            <div className="teacher-video-controls__confirm" onClick={(e) => e.stopPropagation()}>
              <div className="teacher-video-controls__confirm-header">
                <AlertTriangle size={20} />
                <span>确认跳过 Red Box？</span>
              </div>
              <div className="teacher-video-controls__confirm-body">
                <p>跳过后将直接进入 <strong>精准筛查</strong> 阶段</p>
                <p className="teacher-video-controls__confirm-warning">
                  未完成的红词将保持 Red 状态
                </p>
              </div>
              <div className="teacher-video-controls__confirm-actions">
                <button onClick={() => setShowForceConfirm(false)}>取消</button>
                <button className="is-danger" onClick={handleForceNext}>
                  确认跳过
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ========================================
  // 其他阶段：常规控制面板
  // ========================================
  return (
    <div className="teacher-video-controls">
      {/* 当前状态信息 */}
      <div className="teacher-video-controls__status">
        <span className="teacher-video-controls__phase">{phaseNames[currentPhase]}</span>
        <span className="teacher-video-controls__progress">{getProgress()}</span>
        {currentWord && (
          <span className="teacher-video-controls__word">{currentWord.word}</span>
        )}
      </div>

      {/* 控制按钮区 */}
      <div className="teacher-video-controls__buttons">
        {/* 武器库按钮 */}
        <div className="teacher-video-controls__weapon-wrapper">
          <button
            className={`teacher-video-controls__btn teacher-video-controls__btn--weapon ${showWeapons ? 'is-active' : ''}`}
            onClick={() => setShowWeapons(!showWeapons)}
          >
            <Wrench size={18} />
            <span>武器库</span>
          </button>

          {/* 武器库弹出面板 */}
          {showWeapons && (
            <div className="teacher-video-controls__weapon-popup">
              <div className="teacher-video-controls__weapon-header">
                <span>选择武器</span>
                <button onClick={() => setShowWeapons(false)}>
                  <X size={16} />
                </button>
              </div>
              <div className="teacher-video-controls__weapon-grid">
                {weapons.map((weapon) => {
                  const available = isResourceAvailable(weapon.field);
                  const isActive = weaponPopup.isOpen && weaponPopup.weaponId === weapon.id;
                  
                  return (
                    <button
                      key={weapon.id}
                      className={`teacher-video-controls__weapon-btn ${!available ? 'is-disabled' : ''} ${isActive ? 'is-active' : ''}`}
                      onClick={() => handleWeaponClick(weapon.id)}
                      disabled={!available}
                    >
                      {weapon.icon}
                      <span>{weapon.name}</span>
                    </button>
                  );
                })}
              </div>
              {weaponPopup.isOpen && (
                <button 
                  className="teacher-video-controls__close-popup"
                  onClick={closeWeaponPopup}
                >
                  关闭弹窗
                </button>
              )}
            </div>
          )}
        </div>

        {/* 下一阶段按钮 */}
        {nextPhaseInfo && (
          <button
            className="teacher-video-controls__btn teacher-video-controls__btn--next"
            onClick={() => setShowForceConfirm(true)}
          >
            <FastForward size={18} />
            <span>下一阶段</span>
          </button>
        )}
      </div>

      {/* 确认弹窗 */}
      {showForceConfirm && (
        <div className="teacher-video-controls__confirm-overlay" onClick={() => setShowForceConfirm(false)}>
          <div className="teacher-video-controls__confirm" onClick={(e) => e.stopPropagation()}>
            <div className="teacher-video-controls__confirm-header">
              <AlertTriangle size={20} />
              <span>确认进入下一阶段？</span>
            </div>
            <div className="teacher-video-controls__confirm-body">
              <p>
                当前: <strong>{phaseNames[currentPhase]}</strong> → 
                下一阶段: <strong>{nextPhaseInfo?.name}</strong>
              </p>
              <p className="teacher-video-controls__confirm-warning">
                未完成的单词将被跳过
              </p>
            </div>
            <div className="teacher-video-controls__confirm-actions">
              <button onClick={() => setShowForceConfirm(false)}>取消</button>
              <button className="is-danger" onClick={handleForceNext}>
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherVideoControls;
