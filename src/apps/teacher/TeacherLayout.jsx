import React from 'react';
import MainLayout from '../../shared/components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import WeaponDock from '../../shared/components/weapon/WeaponDock';

/**
 * 教师端布局（7:3）
 */
const TeacherLayout = ({ model = 'A', standalone = false, children }) => {
  return (
    <MainLayout role="teacher">
      {children || <Dashboard model={model} />}
      <WeaponDock />
    </MainLayout>
  );
};

export default TeacherLayout;
