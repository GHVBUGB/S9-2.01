import React from 'react';
import { Search, Dumbbell, CheckCircle2, LayoutGrid } from 'lucide-react';
import './PhaseNavigator.css';

/**
 * 阶段导航栏 - 模仿图3的胶囊样式
 * 整合了单词进度显示
 */
const PhaseNavigator = ({ currentPhase, completedPhases = [], phases = [], currentWordIndex = 0, totalWords = 0, showRedBox = false }) => {
  
  // 基础阶段定义
  const allPhases = [
    { id: 'P1', name: '精准筛查', icon: <Search size={18} /> },
    { id: 'P2', name: '集中训练', icon: <Dumbbell size={18} /> },
    { id: 'P3', name: '门神验收', icon: <CheckCircle2 size={18} /> },
  ];

  // 如果是 Model B，前面加一个红盒子阶段
  const displayPhases = showRedBox 
    ? [{ id: 'RedBox', name: '攻坚复习', icon: <LayoutGrid size={18} /> }, ...allPhases]
    : allPhases;

  return (
    <div className="phase-navigator-container">
      <div className="phase-navigator">
        {displayPhases.map((phase, index) => {
          const isActive = currentPhase === phase.id;
          const isCompleted = completedPhases.includes(phase.id);
          
          return (
            <React.Fragment key={phase.id}>
              <div className={`phase-item ${isActive ? 'is-active' : ''} ${isCompleted ? 'is-completed' : ''}`}>
                <div className="phase-item__icon">
                  {phase.icon}
                </div>
                <span className="phase-item__name">{phase.name}</span>
              </div>
              {index < displayPhases.length - 1 && <div className="phase-connector" />}
            </React.Fragment>
          );
        })}
      </div>

      {/* 单词进度整合在导航栏右侧 */}
      {totalWords > 0 && (
        <div className="phase-navigator__progress">
          <span className="progress-label">单词进度:</span>
          <span className="progress-value">{currentWordIndex + 1} / {totalWords}</span>
        </div>
      )}
    </div>
  );
};

export default PhaseNavigator;
