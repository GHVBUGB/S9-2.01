import React from 'react';
import StudentLayout from './StudentLayout';
import Classroom from './pages/Classroom';

/**
 * 学生端应用
 */
const StudentApp = () => {
  return (
    <StudentLayout>
      <Classroom />
    </StudentLayout>
  );
};

export default StudentApp;

