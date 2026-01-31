/**
 * Mock数据汇总
 * 提供一个统一的数据访问接口
 */

import { MOCK_WORDS, getWordById, getRandomWords } from './mockWords';
import { MOCK_STUDENTS, getStudentById, getRedWords, getYellowWords, getGreenWords } from './mockStudents';
import { MOCK_CLASSROOM_SESSIONS, CLASSROOM_MODELS, getCurrentSession, recommendModel } from './mockClassroom';

/**
 * 默认当前学生（小明）
 */
export const CURRENT_STUDENT_ID = 1;

/**
 * 默认当前教师（王老师）
 */
export const CURRENT_TEACHER = {
  id: 2,
  name: '王老师',
  avatar: null,
  role: 'teacher'
};

/**
 * 获取当前学生信息
 */
export const getCurrentStudent = () => {
  return getStudentById(CURRENT_STUDENT_ID);
};

/**
 * 获取当前学生的单词状态统计
 */
export const getCurrentStudentStats = () => {
  const student = getCurrentStudent();
  if (!student) return null;
  
  return {
    ...student.stats,
    redWords: getRedWords(CURRENT_STUDENT_ID),
    yellowWords: getYellowWords(CURRENT_STUDENT_ID),
    greenWords: getGreenWords(CURRENT_STUDENT_ID)
  };
};

/**
 * 获取当前推荐的课堂模式
 */
export const getCurrentRecommendedModel = () => {
  return recommendModel(CURRENT_STUDENT_ID);
};

/**
 * 获取当前课堂会话
 */
export const getCurrentClassroom = () => {
  return getCurrentSession();
};

/**
 * 数据概览
 */
export const getDataOverview = () => {
  const student = getCurrentStudent();
  const session = getCurrentSession();
  const recommendation = getCurrentRecommendedModel();
  
  return {
    student: {
      id: student?.id,
      name: student?.name,
      totalWords: student?.stats.totalWords,
      redWords: student?.stats.redWords,
      yellowWords: student?.stats.yellowWords,
      greenWords: student?.stats.greenWords
    },
    classroom: {
      model: session?.model || recommendation.model,
      status: session?.status || 'scheduled',
      progress: session?.progress
    },
    words: {
      total: MOCK_WORDS.length,
      inUse: student?.wordStates.length || 0
    }
  };
};

export default {
  // 原始数据
  words: MOCK_WORDS,
  students: MOCK_STUDENTS,
  sessions: MOCK_CLASSROOM_SESSIONS,
  models: CLASSROOM_MODELS,
  teacher: CURRENT_TEACHER,
  
  // 便捷方法
  getWordById,
  getRandomWords,
  getStudentById,
  getCurrentStudent,
  getCurrentStudentStats,
  getCurrentRecommendedModel,
  getCurrentClassroom,
  getDataOverview
};
