import React from 'react';
import MainLayout from '../../shared/components/layout/MainLayout';
import GlobalHeader from '../../shared/components/GlobalHeader';
import Classroom from './pages/Classroom';
import WeaponPopup from '../../shared/components/weapon/WeaponPopup';
import ViewSwitcher from '../../shared/components/ui/ViewSwitcher';
import './StudentLayout.css';

/**
 * 学生端布局
 * 结构：GlobalHeader（顶部导航栏）+ MainLayout（7:3布局）
 */
const StudentLayout = ({ model = 'A', standalone = false, children }) => {
  return (
    <div className="student-layout">
      {/* 全局顶部导航栏 */}
      <GlobalHeader />
      
      {/* 7:3 主布局区域 */}
      <div className="student-layout__content">
        <MainLayout role="student">
          {/* 与教师端保持一致的包裹结构 */}
          <div className="student-layout__main-area">
            {children || <Classroom model={model} />}
          </div>
        </MainLayout>
      </div>
      
      <WeaponPopup />
      
      {/* 视角切换按钮 - 左下角 */}
      {!standalone && <ViewSwitcher />}
    </div>
  );
};

export default StudentLayout;
