import React from 'react';
import useClassroomStore from '../../../shared/store/useClassroomStore';
import Badge from '../../../shared/components/ui/Badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  Mic, 
  Eye, 
  Layers, 
  Brain, 
  Wand2, 
  Image,
  SkipForward,
  RotateCcw,
} from 'lucide-react';
import './RedBoxControl.css';

/**
 * 教师端 Red Box 控制面板
 * 所有操作通过 teacherSendCommand 发送，确保双端同步
 */
const RedBoxControl = () => {
  const {
    redWords,
    redBoxStep,
    currentRedWordIndex,
    studentState,
    teacherState,
    teacherSendCommand,
    teacherSelectWeapon,
    teacherToggleAnswer,
    getCurrentRedWord,
  } = useClassroomStore();

  const currentWord = getCurrentRedWord();
  
  // 步骤名称
  const stepLabels = ['听音', '看形', '助记', '验收'];

  // 武器列表
  const weapons = [
    { id: 'compare', name: '对比', icon: <Layers size={16} /> },
    { id: 'phonics', name: '音节', icon: <Brain size={16} /> },
    { id: 'context', name: '语境', icon: <Wand2 size={16} /> },
    { id: 'visual', name: '口诀', icon: <Image size={16} /> },
  ];

  if (!currentWord) return null;

  return (
    <div className="redbox-ctrl">
      {/* 当前单词显示 */}
      <div className="redbox-ctrl__word-display">
        <span className="redbox-ctrl__word">{currentWord.word}</span>
        <span className="redbox-ctrl__meta">
          {currentWord.meaning?.definitionCn}
        </span>
      </div>

      {/* 单词导航 */}
      <div className="redbox-ctrl__nav">
        <button 
          className="redbox-ctrl__nav-btn"
          onClick={() => teacherSendCommand('prevWord')}
          disabled={currentRedWordIndex === 0}
        >
          <ChevronLeft size={20} />
          上一个
        </button>
        <button 
          className="redbox-ctrl__nav-btn redbox-ctrl__nav-btn--primary"
          onClick={() => teacherSendCommand('nextWord')}
        >
          下一个
          <ChevronRight size={20} />
        </button>
      </div>

      {/* 操作按钮组 */}
      <div className="redbox-ctrl__actions">
        {/* Step 1: 听音 */}
        {redBoxStep === 1 && (
          <>
            <button className="redbox-ctrl__action-btn" onClick={() => teacherSendCommand('playAudio')}>
              <Volume2 size={18} />
              <span>播放</span>
            </button>
            <button className="redbox-ctrl__action-btn" onClick={() => teacherSendCommand('showPhonetic')}>
              <Eye size={18} />
              <span>音标</span>
            </button>
            <button className="redbox-ctrl__action-btn" onClick={() => teacherSendCommand('startRecord')}>
              <Mic size={18} />
              <span>跟读</span>
            </button>
          </>
        )}

        {/* Step 2: 看形 */}
        {redBoxStep === 2 && (
          <>
            <button className="redbox-ctrl__action-btn" onClick={() => teacherSendCommand('playAudio')}>
              <Volume2 size={18} />
              <span>播放</span>
            </button>
            <button className="redbox-ctrl__action-btn" onClick={() => teacherSendCommand('showSyllables')}>
              <Layers size={18} />
              <span>音节</span>
            </button>
            <button className="redbox-ctrl__action-btn" onClick={() => teacherSendCommand('showEtymology')}>
              <Brain size={18} />
              <span>词源</span>
            </button>
          </>
        )}

        {/* Step 3: 助记 - 武器选择 */}
        {redBoxStep === 3 && (
          <div className="redbox-ctrl__weapons">
            {weapons.map(weapon => (
              <button
                key={weapon.id}
                className={`redbox-ctrl__weapon-btn ${
                  teacherState.selectedWeapon === weapon.id ? 'redbox-ctrl__weapon-btn--active' : ''
                }`}
                onClick={() => teacherSelectWeapon(weapon.id)}
              >
                {weapon.icon}
                <span>{weapon.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Step 4: 验收 */}
        {redBoxStep === 4 && (
          <>
            <button className="redbox-ctrl__action-btn" onClick={() => teacherSendCommand('repeat')}>
              <RotateCcw size={18} />
              <span>重做</span>
            </button>
            <button 
              className={`redbox-ctrl__action-btn ${teacherState.showAnswer ? 'redbox-ctrl__action-btn--active' : ''}`}
              onClick={teacherToggleAnswer}
            >
              <Eye size={18} />
              <span>答案</span>
            </button>
          </>
        )}
      </div>

      {/* 进入下一步按钮 - 通过命令同步双端 */}
      <button 
        className="redbox-ctrl__next-step"
        onClick={() => teacherSendCommand('nextStep')}
      >
        <SkipForward size={18} />
        {redBoxStep < 4 
          ? `进入${stepLabels[redBoxStep]}` 
          : (currentRedWordIndex === redWords.length - 1 
              ? '🎓 进入新词学习' 
              : '完成验收')}
      </button>

      {/* 学生状态简洁显示 */}
      <div className="redbox-ctrl__status">
        <span>学生状态:</span>
        {studentState.isSubmitted ? (
          <Badge variant={studentState.isCorrect ? 'green' : 'red'} size="sm">
            {studentState.isCorrect ? '✅ 正确' : '❌ 错误'}
          </Badge>
        ) : (
          <Badge variant="yellow" size="sm">等待中...</Badge>
        )}
      </div>
    </div>
  );
};

export default RedBoxControl;
