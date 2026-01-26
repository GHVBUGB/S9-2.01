import React from 'react';
import { Users, GraduationCap, Monitor } from 'lucide-react';
import './ViewSelector.css';

/**
 * 视角选择器组件
 * 【共享组件】- 很少需要修改
 */
const ViewSelector = ({ viewMode, onViewModeChange }) => {
  const viewOptions = [
    {
      id: 'demo',
      name: '双屏模式',
      description: '同时查看学生端和教师端',
      icon: <Users size={24} />,
    },
    {
      id: 'student',
      name: '学生视角',
      description: '体验学生的学习流程',
      icon: <GraduationCap size={24} />,
    },
    {
      id: 'teacher',
      name: '教师视角',
      description: '查看教师监控面板',
      icon: <Monitor size={24} />,
    },
  ];

  return (
    <section className="view-selector">
      <h3 className="view-selector__title">选择演示视角</h3>
      <div className="view-selector__options">
        {viewOptions.map((option) => (
          <button
            key={option.id}
            className={`view-selector__option ${
              viewMode === option.id ? 'view-selector__option--active' : ''
            }`}
            onClick={() => onViewModeChange(option.id)}
            aria-pressed={viewMode === option.id}
          >
            {option.icon}
            <span className="view-selector__option-name">{option.name}</span>
            <span className="view-selector__option-desc">{option.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default ViewSelector;

