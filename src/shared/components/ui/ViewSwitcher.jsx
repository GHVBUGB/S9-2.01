import React from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Users, GraduationCap, Monitor } from 'lucide-react';
import './ViewSwitcher.css';

/**
 * 视角切换组件 - 极简版
 * 固定在左下角，直接显示三个按钮，一键切换
 */
const ViewSwitcher = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const model = searchParams.get('model') || 'A';
  const currentPath = location.pathname;

  // 判断当前视角
  const getCurrentView = () => {
    if (currentPath.includes('/student')) return 'student';
    if (currentPath.includes('/teacher')) return 'teacher';
    if (currentPath.includes('/demo')) return 'demo';
    return 'student';
  };

  const currentView = getCurrentView();

  const viewOptions = [
    {
      id: 'student',
      label: '学生',
      icon: GraduationCap,
      path: `/student?model=${model}`,
    },
    {
      id: 'teacher',
      label: '教师',
      icon: Users,
      path: `/teacher?model=${model}`,
    },
    {
      id: 'demo',
      label: '双屏',
      icon: Monitor,
      path: `/demo?model=${model}`,
    },
  ];

  const handleSwitch = (path) => {
    navigate(path);
  };

  const content = (
    <div className="view-switcher">
      {viewOptions.map(option => {
        const Icon = option.icon;
        const isActive = currentView === option.id;
        return (
          <button
            key={option.id}
            className={`view-switcher__btn ${isActive ? 'is-active' : ''}`}
            onClick={() => handleSwitch(option.path)}
          >
            <Icon size={18} />
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );

  return createPortal(content, document.body);
};

export default ViewSwitcher;
