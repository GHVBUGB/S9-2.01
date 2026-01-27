import React from 'react';
import MainLayout from '../../shared/components/layout/MainLayout';
import GlobalHeader from '../../shared/components/GlobalHeader';
import Classroom from '../student/pages/Classroom';
import ViewSwitcher from '../../shared/components/ui/ViewSwitcher';
import WeaponPopup from '../../shared/components/weapon/WeaponPopup';
import TeacherVideoControls from './components/TeacherVideoControls';
import './TeacherLayout.css';

/**
 * 教师端布局（重构版）
 * 
 * 结构：
 * - GlobalHeader（顶部导航栏）
 * - MainLayout（7:3布局）
 *   - 左侧：复用学生端 Classroom（只读模式）
 *   - 右侧：视频面板 + 控制按钮（武器库、下一阶段）
 */
const TeacherLayout = ({ model = 'A', standalone = false, children }) => {
  return (
    <div className="teacher-layout">
      {/* 全局顶部导航栏 */}
      <GlobalHeader role="teacher" />
      
      {/* 7:3 主布局区域 */}
      <div className="teacher-layout__content">
        <MainLayout 
          role="teacher"
          videoControls={<TeacherVideoControls />}
        >
          {/* 教师端复用学生端内容，readonly 模式 */}
          {children || <Classroom readonly />}
        </MainLayout>
      </div>
      
      {/* 武器库弹窗（学生端也会显示） */}
      <WeaponPopup />
      
      {/* 视角切换按钮 - 左下角 */}
      {!standalone && <ViewSwitcher />}
    </div>
  );
};

export default TeacherLayout;
