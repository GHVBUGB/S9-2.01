import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, Monitor, LayoutGrid } from 'lucide-react';
import './ViewSwitcher.css';

/**
 * 视角切换器组件
 * 固定在左下角，用于在学生端/教师端/双屏模式之间切换
 */
const ViewSwitcher = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const buttons = [
    { 
      id: 'student', 
      path: '/student',
      label: '学生视角', 
      icon: GraduationCap 
    },
    { 
      id: 'teacher', 
      path: '/teacher',
      label: '教师视角', 
      icon: Monitor 
    },
    { 
      id: 'demo', 
      path: '/demo?model=A',
      label: '双屏模式', 
      icon: LayoutGrid 
    },
  ];
  
  const isActive = (path) => {
    if (path.startsWith('/demo')) {
      return location.pathname === '/demo';
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <div className="view-switcher">
      {buttons.map((btn) => {
        const Icon = btn.icon;
        const active = isActive(btn.path);
        
        return (
          <button
            key={btn.id}
            onClick={() => navigate(btn.path)}
            className={`view-switcher__btn ${active ? 'view-switcher__btn--active' : ''}`}
          >
            <Icon size={16} />
            <span>{btn.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ViewSwitcher;

