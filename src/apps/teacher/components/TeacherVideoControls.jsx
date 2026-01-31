<<<<<<< HEAD
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
    const newState = !redBoxUI.showSyllables;
    updateRedBoxUI({ showSyllables: newState });
    teacherSendCommand(newState ? 'showSyllables' : 'hideSyllables');
  };

  const handleShowPhonetic = () => {
    const newState = !redBoxUI.showPhonetic;
    updateRedBoxUI({ showPhonetic: newState });
    teacherSendCommand(newState ? 'showPhonetic' : 'hidePhonetic');
  };

  // ========================================
  // RedBox Step 2: 精准助记操作
  // ========================================
  const handleSelectWeapon = (weaponId) => {
    // 如果点击的是当前已选中的武器，则取消选择
    const newWeapon = redBoxUI.selectedWeapon === weaponId ? null : weaponId;
    updateRedBoxUI({ selectedWeapon: newWeapon });
    teacherSelectWeapon(newWeapon);
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
            武器库
          </div>
          <div className="redbox-panel__progress">
            {currentRedWordIndex + 1} / {redWords.length}
          </div>
        </div>

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
            <div className="redbox-panel__action-label">听音识形</div>
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
                <span>{redBoxUI.showSyllables ? '隐藏音节' : '显示音节'}</span>
              </button>
              <button 
                className={`redbox-panel__action-btn ${redBoxUI.showPhonetic ? 'is-done' : ''}`}
                onClick={handleShowPhonetic}
              >
                <Eye size={18} />
                <span>{redBoxUI.showPhonetic ? '隐藏音标' : '显示音标'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: 精准助记操作 */}
        {redBoxStep === 2 && (
          <div className="redbox-panel__actions">
            <div className="redbox-panel__action-label">选择助记武器</div>
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
            <div className="redbox-panel__action-label">验收操作</div>
            <div className="redbox-panel__action-grid">
              <button 
                className={`redbox-panel__action-btn ${redBoxUI.showAnswer ? 'is-done' : ''}`}
                onClick={handleShowAnswer}
                disabled={redBoxUI.showAnswer}
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
                  {studentState.isCorrect ? '正确' : '错误'}
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
                ? '下一个单词' 
                : '完成，进入新词学习')}
        </button>

        {/* 跳过按钮 */}
        <button 
          className="redbox-panel__skip-btn"
          onClick={() => setShowForceConfirm(true)}
        >
          <SkipForward size={14} />
          跳过武器库
        </button>

        {/* 确认弹窗 */}
        {showForceConfirm && (
          <div className="teacher-video-controls__confirm-overlay" onClick={() => setShowForceConfirm(false)}>
            <div className="teacher-video-controls__confirm" onClick={(e) => e.stopPropagation()}>
              <div className="teacher-video-controls__confirm-header">
                <AlertTriangle size={20} />
                <span>确认跳过武器库？</span>
              </div>
              <div className="teacher-video-controls__confirm-body">
                <p>跳过后将直接进入 <strong>精准筛查</strong> 阶段</p>
                <p className="teacher-video-controls__confirm-warning">
                  未完成的单词将保持待攻克状态
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
  // 其他阶段：不显示控制面板（武器库移到底部工具栏）
  // ========================================
  return null;
};

export default TeacherVideoControls;
=======
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
    studentMood,
    classroomMode,
    setPhase,
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
    Warmup: '热身',
    RedBox: 'Red Box',
    P1: '精准筛查',
    P2: '集中训练',
    P3: '门神验收',
    Summary: '课堂总结',
  };

  // 学生状态标签
  const moodLabels = {
    good: { label: '很好', color: '#10b981' },
    normal: { label: '一般', color: '#f59e0b' },
    tired: { label: '有点累', color: '#94a3b8' },
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
    { id: 'image', name: '图片', icon: <Image size={16} /> },
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
    const newState = !redBoxUI.showSyllables;
    updateRedBoxUI({ showSyllables: newState });
    teacherSendCommand(newState ? 'showSyllables' : 'hideSyllables');
  };

  const handleShowPhonetic = () => {
    const newState = !redBoxUI.showPhonetic;
    updateRedBoxUI({ showPhonetic: newState });
    teacherSendCommand(newState ? 'showPhonetic' : 'hidePhonetic');
  };

  // ========================================
  // RedBox Step 2: 精准助记操作
  // ========================================
  const handleSelectWeapon = (weaponId) => {
    // 如果点击的是当前已选中的武器，则取消选择
    const newWeapon = redBoxUI.selectedWeapon === weaponId ? null : weaponId;
    updateRedBoxUI({ selectedWeapon: newWeapon });
    teacherSelectWeapon(newWeapon);
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
  // Warmup 阶段不显示右侧控制面板（按钮在内容区）
  // ========================================
  if (currentPhase === 'Warmup') {
    return null;
  }

  // ========================================
  // RedBox 阶段专属控制面板
  // ========================================
  if (currentPhase === 'RedBox') {
    return (
      <div className="teacher-video-controls teacher-video-controls--redbox">
        {/* 标题栏 */}
        <div className="redbox-panel__header">
          <div className="redbox-panel__title">
            武器库
          </div>
          <div className="redbox-panel__progress">
            {currentRedWordIndex + 1} / {redWords.length}
          </div>
        </div>

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
            <div className="redbox-panel__action-label">听音识形</div>
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
                <span>{redBoxUI.showSyllables ? '隐藏音节' : '显示音节'}</span>
              </button>
              <button 
                className={`redbox-panel__action-btn ${redBoxUI.showPhonetic ? 'is-done' : ''}`}
                onClick={handleShowPhonetic}
              >
                <Eye size={18} />
                <span>{redBoxUI.showPhonetic ? '隐藏音标' : '显示音标'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: 精准助记操作 */}
        {redBoxStep === 2 && (
          <div className="redbox-panel__actions">
            <div className="redbox-panel__action-label">选择助记武器</div>
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
            <div className="redbox-panel__action-label">验收操作</div>
            <div className="redbox-panel__action-grid">
              <button 
                className={`redbox-panel__action-btn ${redBoxUI.showAnswer ? 'is-done' : ''}`}
                onClick={handleShowAnswer}
                disabled={redBoxUI.showAnswer}
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
                  {studentState.isCorrect ? '正确' : '错误'}
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
                ? '下一个单词' 
                : '完成，进入新词学习')}
        </button>

        {/* 跳过按钮 */}
        <button 
          className="redbox-panel__skip-btn"
          onClick={() => setShowForceConfirm(true)}
        >
          <SkipForward size={14} />
          跳过武器库
        </button>

        {/* 确认弹窗 */}
        {showForceConfirm && (
          <div className="teacher-video-controls__confirm-overlay" onClick={() => setShowForceConfirm(false)}>
            <div className="teacher-video-controls__confirm" onClick={(e) => e.stopPropagation()}>
              <div className="teacher-video-controls__confirm-header">
                <AlertTriangle size={20} />
                <span>确认跳过武器库？</span>
              </div>
              <div className="teacher-video-controls__confirm-body">
                <p>跳过后将直接进入 <strong>精准筛查</strong> 阶段</p>
                <p className="teacher-video-controls__confirm-warning">
                  未完成的单词将保持待攻克状态
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
  // 其他阶段：不显示控制面板（武器库移到底部工具栏）
  // ========================================
  return null;
};

export default TeacherVideoControls;
>>>>>>> origin/feature/phase1-3-updates
