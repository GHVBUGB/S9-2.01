import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Users, GraduationCap, Monitor, Home, ChevronUp, ChevronDown } from 'lucide-react';
import './ViewSwitcher.css';

/**
 * 视角切换组件
 * 固定在左下角，提供学生端/教师端/双屏模式切换
 * 使用 Portal 渲染到 body，确保不受父元素影响
 */
const ViewSwitcher = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const model = searchParams.get('model') || 'A';
  const currentPath = location.pathname;

  // 判断当前视角
  const getCurrentView = () => {
    if (currentPath.includes('/student')) return 'student';
    if (currentPath.includes('/teacher')) return 'teacher';
    if (currentPath.includes('/demo')) return 'demo';
    return 'home';
  };

  const currentView = getCurrentView();

  const viewOptions = [
    {
      id: 'student',
      label: '学生视角',
      icon: GraduationCap,
      path: `/student?model=${model}`,
      color: '#0063F2',
    },
    {
      id: 'teacher',
      label: '教师视角',
      icon: Users,
      path: `/teacher?model=${model}`,
      color: '#FFBE1B',
    },
    {
      id: 'demo',
      label: '双屏模式',
      icon: Monitor,
      path: `/demo?model=${model}`,
      color: '#26B7FF',
    },
    {
      id: 'home',
      label: '返回首页',
      icon: Home,
      path: '/',
      color: '#757575',
    },
  ];

  const handleSwitch = (path) => {
    navigate(path);
    setIsExpanded(false);
  };

  const currentOption = viewOptions.find(v => v.id === currentView) || viewOptions[0];
  const CurrentIcon = currentOption.icon;

  // 内联样式确保组件显示
  const containerStyle = {
    position: 'fixed',
    left: '24px',
    bottom: '24px',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 18px',
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '100px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
  };

  const optionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 16px',
    background: 'rgba(255, 255, 255, 0.95)',
    color: '#334155',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    borderRadius: '100px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
  };

  const content = (
    <div style={containerStyle}>
      {/* 展开的选项列表 */}
      {isExpanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {viewOptions
            .filter(v => v.id !== currentView)
            .map(option => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  style={optionStyle}
                  onClick={() => handleSwitch(option.path)}
                >
                  <Icon size={18} style={{ color: option.color }} />
                  <span>{option.label}</span>
                </button>
              );
            })}
        </div>
      )}

      {/* 当前视角按钮 */}
      <button
        style={buttonStyle}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CurrentIcon size={20} style={{ color: currentOption.color }} />
        <span>{currentOption.label}</span>
        {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>
    </div>
  );

  // 使用 Portal 渲染到 body，确保不受父元素 overflow 影响
  return createPortal(content, document.body);
};

export default ViewSwitcher;
