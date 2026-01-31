import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Sparkles, Trophy, ArrowRight } from 'lucide-react';
import './ExtraModules.css';

/**
 * 额外功能模块卡片 - 全新设计
 * 三模块三足鼎立布局
 */
const ExtraModules = () => {
  const navigate = useNavigate();

  // 额外模块数据
  const modules = [
    {
      id: 'smart-review',
      title: '智能\n复习',
      label: '模块 01',
      description: '核心词法矩阵。包含',
      highlights: ['复习入口', '数据全库'],
      highlightColors: ['#6366f1', '#0f172a'],
      description2: '的双向链接。',
      icon: <BookOpen className="module-icon" />,
      iconBg: '#6366f1',
      bgColor: '#eef2ff',
      route: '/review-selection',
      actionText: '进入矩阵',
      actionColor: '#6366f1',
    },
    {
      id: 'ai-context',
      title: '语境\n闭环',
      label: '模块 02',
      description: 'AI 语境闭环训练。通过',
      highlights: ['故事阅读', '仿真练习'],
      highlightColors: ['#f59e0b', '#0f172a'],
      description2: '深层记忆。',
      icon: <Sparkles className="module-icon" />,
      iconBg: '#f59e0b',
      bgColor: '#fffbeb',
      route: '/ai-context',
      actionText: '开启训练',
      actionColor: '#f59e0b',
    },
    {
      id: 'milestone',
      title: '里程碑\n大考',
      label: '模块 03',
      description: '里程碑大考。检验',
      highlights: ['晋升绿灯'],
      highlightColors: ['#10b981'],
      description2: '的资格，一次定胜负的权威考核。',
      icon: <Trophy className="module-icon" />,
      iconBg: '#10b981',
      bgColor: '#ecfdf5',
      route: '/milestone',
      actionText: '进入考场',
      actionColor: '#10b981',
    },
  ];

  return (
    <section className="extra-modules">
      <h3 className="extra-modules__title">更多功能</h3>
      <div className="extra-modules__grid">
        {modules.map((module) => (
          <button
            key={module.id}
            className="module-card"
            onClick={() => navigate(module.route)}
          >
            <div className="module-card__bg" style={{ backgroundColor: module.bgColor }}>
              <div className="module-card__bg-circle"></div>
            </div>
            
            <div className="module-card__content">
              <div className="module-card__icon" style={{ backgroundColor: module.iconBg }}>
                {module.icon}
              </div>
              
              <h3 className="module-card__label">{module.label}</h3>
              <h2 className="module-card__title">{module.title}</h2>
              
              <p className="module-card__description">
                {module.description}
                {module.highlights.map((highlight, idx) => (
                  <span 
                    key={idx}
                    className="module-card__highlight" 
                    style={{ color: module.highlightColors[idx] }}
                  >
                    {highlight}
                  </span>
                ))}
                {module.description2}
              </p>
            </div>
            
            <div className="module-card__action" style={{ color: module.actionColor }}>
              <span>{module.actionText}</span>
              <ArrowRight className="action-arrow" />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default ExtraModules;
