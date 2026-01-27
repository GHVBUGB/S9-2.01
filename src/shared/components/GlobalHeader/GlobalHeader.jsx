import React, { useState, useEffect, useRef } from 'react';
import { Zap, CheckCircle, User, Clock } from 'lucide-react';
import useClassroomStore from '../../store/useClassroomStore';
import './GlobalHeader.css';

/**
 * 全局顶部导航栏
 * 包含：Logo + 阶段导航 + 课堂计时 + 用户信息
 * @param {string} role - 'student' | 'teacher'
 */
const GlobalHeader = ({ role = 'student' }) => {
  const {
    currentPhase,
    completedPhases,
    classroomMode,
    wordList,
    currentWordIndex,
    studentState,
    sessionStatus,
  } = useClassroomStore();

  // 课堂计时器
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef(null);

  // 课堂开始时启动计时器
  useEffect(() => {
    if (sessionStatus === 'active' && !startTimeRef.current) {
      startTimeRef.current = Date.now();
    }

    if (sessionStatus === 'active') {
      const interval = setInterval(() => {
        if (startTimeRef.current) {
          setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [sessionStatus]);

  // 格式化时间 MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 阶段配置
  const phases = classroomMode === 'B' 
    ? [
        { id: 'RedBox', name: '红盒攻坚', icon: '🔴' },
        { id: 'P1', name: '精准筛查', icon: '🔍' },
        { id: 'P2', name: '集中训练', icon: '📚' },
        { id: 'P3', name: '门神验收', icon: '🚪' },
      ]
    : [
        { id: 'P1', name: '精准筛查', icon: '🔍' },
        { id: 'P2', name: '集中训练', icon: '📚' },
        { id: 'P3', name: '门神验收', icon: '🚪' },
      ];

  // 获取当前阶段进度
  const getProgress = () => {
    if (currentPhase === 'P1') {
      return `${currentWordIndex + 1}/${wordList.length}`;
    }
    if (currentPhase === 'P2') {
      const p2WordIndex = studentState?.p2WordIndex || 0;
      const p2Round = studentState?.p2Round || 1;
      return `第${p2Round}轮`;
    }
    return null;
  };

  const progress = getProgress();

  // 判断阶段状态
  const getPhaseStatus = (phaseId) => {
    if (completedPhases.includes(phaseId)) return 'completed';
    if (phaseId === currentPhase) return 'active';
    return 'pending';
  };

  return (
    <header className="global-header">
      {/* 左侧：Logo */}
      <div className="global-header__logo">
        <Zap className="global-header__logo-icon" size={24} />
        <span className="global-header__logo-text">Jarvis·Vocabulary</span>
      </div>

      {/* 中间：阶段导航 */}
      <nav className="global-header__nav">
        {phases.map((phase, index) => {
          const status = getPhaseStatus(phase.id);
          const isActive = status === 'active';
          const isCompleted = status === 'completed';

          return (
            <React.Fragment key={phase.id}>
              {/* 连接线 */}
              {index > 0 && (
                <div className={`global-header__connector ${isCompleted || isActive ? 'global-header__connector--active' : ''}`} />
              )}
              
              {/* 阶段胶囊 */}
              <div className={`global-header__phase global-header__phase--${status}`}>
                <span className="global-header__phase-icon">{phase.icon}</span>
                <span className="global-header__phase-name">{phase.name}</span>
                
                {/* 当前阶段显示进度 */}
                {isActive && progress && (
                  <span className="global-header__phase-progress">{progress}</span>
                )}
                
                {/* 已完成显示勾 */}
                {isCompleted && (
                  <CheckCircle className="global-header__phase-check" size={14} />
                )}
              </div>
            </React.Fragment>
          );
        })}
      </nav>

      {/* 右侧：计时器 + 用户信息 */}
      <div className="global-header__right">
        {/* 课堂计时器 */}
        <div className="global-header__timer">
          <Clock size={16} className="global-header__timer-icon" />
          <span className="global-header__timer-value">{formatTime(elapsedTime)}</span>
        </div>

        {/* 用户信息 */}
        <div className="global-header__user">
          <div className="global-header__user-info">
            <span className="global-header__user-name">
              {role === 'teacher' ? '王老师' : '小明'}
            </span>
            <span className="global-header__user-role">
              {role === 'teacher' ? 'TEACHER' : 'STUDENT'}
            </span>
          </div>
          <div className="global-header__user-avatar">
            <User size={18} />
          </div>
          <div className="global-header__online-dot" />
        </div>
      </div>
    </header>
  );
};

export default GlobalHeader;
