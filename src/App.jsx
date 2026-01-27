import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './apps/demo/Home';
import DemoView from './apps/demo/DemoView';
import StudentApp from './apps/student/StudentApp';
import TeacherApp from './apps/teacher/TeacherApp';

/**
 * 主应用路由
 */
const App = () => {
  return (
    <Routes>
      {/* 首页：课程模式选择 */}
      <Route path="/" element={<Home />} />
      
      {/* Demo 双屏视图 */}
      <Route path="/demo" element={<DemoView />} />
      
      {/* 学生端 */}
      <Route path="/student" element={<StudentApp />} />
      
      {/* 教师端 */}
      <Route path="/teacher" element={<TeacherApp />} />
      
      {/* 404 重定向到首页 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
