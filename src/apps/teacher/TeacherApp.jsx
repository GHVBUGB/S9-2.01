import React from 'react';
import TeacherLayout from './TeacherLayout';
import Dashboard from './pages/Dashboard';

/**
 * 教师端应用
 */
const TeacherApp = () => {
  return (
    <TeacherLayout>
      <Dashboard />
    </TeacherLayout>
  );
};

export default TeacherApp;

