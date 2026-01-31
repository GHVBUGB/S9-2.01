<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Search, 
  BookOpen, 
  DoorOpen, 
  Target,
  CheckCircle, 
  User, 
  Clock 
} from 'lucide-react';
import useClassroomStore from '../../store/useClassroomStore';
import './GlobalHeader.css';

/**
 * 全局顶部导航栏 - 毛玻璃效果 + 弹簧动画
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

  // 阶段配置 - 使用 lucide-react 图标
  const phases = classroomMode === 'B' 
    ? [
        { id: 'RedBox', name: '红盒攻坚', icon: Target },
        { id: 'P1', name: '精准筛查', icon: Search },
        { id: 'P2', name: '集中训练', icon: BookOpen },
        { id: 'P3', name: '门神验收', icon: DoorOpen },
      ]
    : [
        { id: 'P1', name: '精准筛查', icon: Search },
        { id: 'P2', name: '集中训练', icon: BookOpen },
        { id: 'P3', name: '门神验收', icon: DoorOpen },
      ];

  // 获取当前阶段进度
  const getProgress = () => {
    if (currentPhase === 'P1') {
      return `${currentWordIndex + 1}/${wordList.length}`;
    }
    if (currentPhase === 'P2') {
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

  // 用户名缩写
  const userName = role === 'teacher' ? '王老师' : '小明';
  const userInitials = role === 'teacher' ? '王' : 'XM';

  return (
    <header className="global-header">
      {/* 左侧：Logo */}
      <div className="global-header__logo">
        <div className="global-header__logo-icon-wrapper">
          <Zap size={18} fill="currentColor" />
        </div>
        <span className="global-header__logo-text">Jarvis · Vocabulary</span>
      </div>

      {/* 中间：阶段导航 - 毛玻璃容器 */}
      <nav className="global-header__nav">
        <div className="global-header__nav-container">
          {phases.map((phase) => {
            const status = getPhaseStatus(phase.id);
            const isActive = status === 'active';
            const isCompleted = status === 'completed';
            const Icon = phase.icon;

            return (
              <button
                key={phase.id}
                className={`global-header__phase global-header__phase--${status}`}
              >
                {/* 激活状态的白色药丸背景（带弹簧动画） */}
                {isActive && (
                  <motion.div
                    layoutId="phase-active-pill"
                    className="global-header__phase-pill"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                <span className="global-header__phase-content">
                  <Icon 
                    size={14} 
                    strokeWidth={2.5} 
                    className="global-header__phase-icon"
                  />
                  <span className="global-header__phase-name">{phase.name}</span>
                  
                  {/* 当前阶段显示进度 */}
                  {isActive && progress && (
                    <span className="global-header__phase-progress">{progress}</span>
                  )}
                  
                  {/* 已完成显示勾 */}
                  {isCompleted && (
                    <CheckCircle size={12} className="global-header__phase-check" />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 右侧：计时器 + 用户信息 */}
      <div className="global-header__right">
        {/* 课堂计时器 */}
        <div className="global-header__timer">
          <div className="global-header__timer-dot" />
          <span className="global-header__timer-value">{formatTime(elapsedTime)}</span>
        </div>

        {/* 用户信息 */}
        <div className="global-header__user">
          <div className="global-header__user-info">
            <span className="global-header__user-name">{userName}</span>
            <span className="global-header__user-role">
              {role === 'teacher' ? 'TEACHER' : 'STUDENT'}
            </span>
          </div>
          <div className="global-header__user-avatar">
            {userInitials}
          </div>
        </div>
      </div>
    </header>
  );
};

export default GlobalHeader;
=======
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Search, 
  BookOpen, 
  DoorOpen, 
  Target,
  CheckCircle, 
  User, 
  Clock 
} from 'lucide-react';
import useClassroomStore from '../../store/useClassroomStore';
import './GlobalHeader.css';

/**
 * 全局顶部导航栏 - 毛玻璃效果 + 弹簧动画
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

  // 阶段配置 - 使用 lucide-react 图标
  // 注：P1.5 显示在"集中训练"中，因为它是 P2 的一部分（跟读环节）
  const phases = classroomMode === 'B' 
    ? [
        { id: 'RedBox', name: '红盒攻坚', icon: Target },
        { id: 'P1', name: '精准筛查', icon: Search },
        { id: 'P2', name: '集中训练', icon: BookOpen, includesP15: true },
        { id: 'P3', name: '门神验收', icon: DoorOpen },
      ]
    : [
        { id: 'P1', name: '精准筛查', icon: Search },
        { id: 'P2', name: '集中训练', icon: BookOpen, includesP15: true },
        { id: 'P3', name: '门神验收', icon: DoorOpen },
      ];

  // 获取当前阶段进度
  const getProgress = (phaseId) => {
    if (phaseId === 'P1' && currentPhase === 'P1') {
      return `${currentWordIndex + 1}/${wordList.length}`;
    }
    // P1.5 显示在 P2 导航项中
    if (phaseId === 'P2' && currentPhase === 'P1.5') {
      return '跟读';
    }
    if (phaseId === 'P2' && currentPhase === 'P2') {
      const p2Round = studentState?.p2Round || 1;
      return `第${p2Round}轮`;
    }
    return null;
  };

  // 判断阶段状态
  const getPhaseStatus = (phaseId) => {
    if (completedPhases.includes(phaseId)) return 'completed';
    // P1.5 属于 P2 大阶段，所以当 P1.5 激活时，P2 也显示为激活
    if (phaseId === 'P2' && currentPhase === 'P1.5') return 'active';
    if (phaseId === currentPhase) return 'active';
    return 'pending';
  };

  // 用户名缩写
  const userName = role === 'teacher' ? '王老师' : '小明';
  const userInitials = role === 'teacher' ? '王' : 'XM';

  return (
    <header className="global-header">
      {/* 左侧：Logo */}
      <div className="global-header__logo">
        <div className="global-header__logo-icon-wrapper">
          <Zap size={18} fill="currentColor" />
        </div>
        <span className="global-header__logo-text">Jarvis · Vocabulary</span>
      </div>

      {/* 中间：阶段导航 - 毛玻璃容器 */}
      <nav className="global-header__nav">
        <div className="global-header__nav-container">
          {phases.map((phase) => {
            const status = getPhaseStatus(phase.id);
            const isActive = status === 'active';
            const isCompleted = status === 'completed';
            const Icon = phase.icon;

            return (
              <button
                key={phase.id}
                className={`global-header__phase global-header__phase--${status}`}
              >
                {/* 激活状态的白色药丸背景（带弹簧动画） */}
                {isActive && (
                  <motion.div
                    layoutId="phase-active-pill"
                    className="global-header__phase-pill"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                <span className="global-header__phase-content">
                  <Icon 
                    size={14} 
                    strokeWidth={2.5} 
                    className="global-header__phase-icon"
                  />
                  <span className="global-header__phase-name">{phase.name}</span>
                  
                  {/* 当前阶段显示进度 */}
                  {isActive && getProgress(phase.id) && (
                    <span className="global-header__phase-progress">{getProgress(phase.id)}</span>
                  )}
                  
                  {/* 已完成显示勾 */}
                  {isCompleted && (
                    <CheckCircle size={12} className="global-header__phase-check" />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 右侧：计时器 + 用户信息 */}
      <div className="global-header__right">
        {/* 课堂计时器 */}
        <div className="global-header__timer">
          <div className="global-header__timer-dot" />
          <span className="global-header__timer-value">{formatTime(elapsedTime)}</span>
        </div>

        {/* 用户信息 */}
        <div className="global-header__user">
          <div className="global-header__user-info">
            <span className="global-header__user-name">{userName}</span>
            <span className="global-header__user-role">
              {role === 'teacher' ? 'TEACHER' : 'STUDENT'}
            </span>
          </div>
          <div className="global-header__user-avatar">
            {userInitials}
          </div>
        </div>
      </div>
    </header>
  );
};

export default GlobalHeader;
>>>>>>> origin/feature/phase1-3-updates
