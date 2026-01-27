import React from 'react';
import TeacherLayout from './TeacherLayout';

/**
 * 教师端应用（重构版）
 * 
 * 教师端现在显示和学生端相同的内容（只读模式），
 * 核心控制功能（武器库、下一阶段）放在视频区域下方。
 */
const TeacherApp = () => {
  // 不传 children，TeacherLayout 会自动使用 <Classroom readonly />
  return <TeacherLayout />;
};

export default TeacherApp;

