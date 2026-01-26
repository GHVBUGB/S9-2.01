import React from 'react';
import MainLayout from '../../shared/components/layout/MainLayout';
import Classroom from './pages/Classroom';
import WeaponPopup from '../../shared/components/weapon/WeaponPopup';

/**
 * 学生端布局（7:3）
 */
const StudentLayout = ({ model = 'A', standalone = false, children }) => {
  return (
    <>
      <MainLayout role="student">
        {children || <Classroom model={model} />}
      </MainLayout>
      <WeaponPopup />
    </>
  );
};

export default StudentLayout;
