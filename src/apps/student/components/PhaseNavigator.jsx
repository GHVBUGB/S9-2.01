import React from 'react';
import { Search, Dumbbell, CheckCircle, RotateCcw, AlertCircle, Trophy, Flame } from 'lucide-react';
import './PhaseNavigator.css';

/**
 * Phase 阶段导航栏
 * 展示学习流程的阶段
 * 支持 Model A（P1-P6）和 Model B（RedBox + P1-P3）
 * 
 * @param {string} currentPhase - 当前激活的阶段 (RedBox | P1-P6)
 * @param {Array} completedPhases - 已完成的阶段列表 ['RedBox', 'P1', 'P2', ...]
 * @param {Array} phases - 要显示的阶段列表，默认为标准六阶段
 * @param {boolean} showRedBox - 是否显示 Red Box 阶段（Model B）
 */
const PhaseNavigator = ({ 
  currentPhase = 'P1', 
  completedPhases = [], 
  phases = null,
  showRedBox = false 
}) => {
  
  // 完整的阶段配置
  const allPhasesConfig = {
    RedBox: {
      id: 'RedBox',
      name: 'Red Box',
      icon: Flame,
      description: 'Attack',
      color: '#ef4444'
    },
    P1: {
      id: 'P1',
      name: '精准筛查',
      icon: Search,
      description: 'Filter'
    },
    P2: {
      id: 'P2',
      name: '集中训练',
      icon: Dumbbell,
      description: 'Train'
    },
    P3: {
      id: 'P3',
      name: '门神验收',
      icon: CheckCircle,
      description: 'Check'
    },
    P4: {
      id: 'P4',
      name: '螺旋复习',
      icon: RotateCcw,
      description: 'Review'
    },
    P5: {
      id: 'P5',
      name: '紧急救援',
      icon: AlertCircle,
      description: 'Rescue'
    },
    P6: {
      id: 'P6',
      name: '里程碑考',
      icon: Trophy,
      description: 'Milestone'
    }
  };

  // 根据 props 确定要显示的阶段
  const displayPhases = phases || (showRedBox 
    ? ['RedBox', 'P1', 'P2', 'P3'] 
    : ['P1', 'P2', 'P3', 'P4', 'P5', 'P6']
  );

  // 获取要渲染的阶段配置
  const phasesToRender = displayPhases.map(phaseId => allPhasesConfig[phaseId]).filter(Boolean);

  // 判断阶段状态
  const getPhaseStatus = (phaseId) => {
    if (phaseId === currentPhase) return 'active';
    if (completedPhases.includes(phaseId)) return 'completed';
    return 'pending';
  };

  // 获取阶段样式类
  const getPhaseClass = (phaseId) => {
    const status = getPhaseStatus(phaseId);
    const isRedBox = phaseId === 'RedBox';
    return `phase-navigator__item phase-navigator__item--${status} ${isRedBox ? 'phase-navigator__item--redbox' : ''}`;
  };

  return (
    <div className="phase-navigator">
      <div className="phase-navigator__track">
        {phasesToRender.map((phase, index) => {
          const Icon = phase.icon;
          const status = getPhaseStatus(phase.id);
          
          return (
            <React.Fragment key={phase.id}>
              <div className={getPhaseClass(phase.id)}>
                <div 
                  className="phase-navigator__icon"
                  style={phase.color && status === 'active' ? { backgroundColor: phase.color } : {}}
                >
                  <Icon size={18} />
                </div>
                <div className="phase-navigator__label">
                  {phase.name}
                </div>
                {status === 'completed' && (
                  <div className="phase-navigator__check">✓</div>
                )}
              </div>
              {/* 连接线 */}
              {index < phasesToRender.length - 1 && (
                <div className={`phase-navigator__connector ${
                  completedPhases.includes(phase.id) ? 'phase-navigator__connector--completed' : ''
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default PhaseNavigator;
