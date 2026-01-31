import { create } from 'zustand';
import { MOCK_CLASSROOM_SESSIONS, CLASSROOM_MODELS } from '../data/mockClassroom';
import { getRandomWords } from '../data/mockWords';

/**
 * 学习进度Store
 * 管理课堂会话、Phase流程、学习进度
 */

const useLearningStore = create((set, get) => ({
  // ========== 课堂会话 ==========
  
  // 当前课堂模式 ('A' | 'B')
  classroomModel: 'A',
  
  // 课堂配置
  classroomConfig: CLASSROOM_MODELS.A,
  
  // 当前会话ID
  sessionId: null,
  
  // 课堂状态 ('idle' | 'in_progress' | 'completed')
  classroomStatus: 'idle',
  
  // ========== Phase管理 ==========
  
  // 当前Phase (1-6)
  currentPhase: 1,
  
  // 当前单词列表
  wordList: [],
  
  // 当前单词索引
  currentWordIndex: 0,
  
  // 当前单词ID
  currentWordId: null,
  
  // 已完成单词列表
  completedWords: [],
  
  // ========== 学习进度 ==========
  
  // 当前题目数据
  currentQuestion: null,
  
  // 用户答案
  userAnswer: '',
  
  // 答题历史（用于统计）
  answerHistory: [],
  
  // 当前单词的尝试次数
  attemptCount: 0,
  
  // 当前单词的错误次数
  errorCount: 0,
  
  // ========== 时间管理 ==========
  
  // 课堂开始时间
  startTime: null,
  
  // 当前Phase开始时间
  phaseStartTime: null,
  
  // 已用时间（秒）
  elapsedTime: 0,
  
  // ========== 初始化 ==========
  
  /**
   * 开始新课堂
   */
  startClassroom: (model = 'A', wordIds = null) => {
    const config = CLASSROOM_MODELS[model];
    const words = wordIds || getRandomWords(config.targetWords).map(w => w.id);
    
    set({
      classroomModel: model,
      classroomConfig: config,
      classroomStatus: 'in_progress',
      currentPhase: 1,
      wordList: words,
      currentWordIndex: 0,
      currentWordId: words[0],
      completedWords: [],
      startTime: new Date().toISOString(),
      phaseStartTime: new Date().toISOString(),
      elapsedTime: 0,
      answerHistory: []
    });
  },
  
  /**
   * 从Mock数据加载会话
   */
  loadSession: (sessionId) => {
    const session = MOCK_CLASSROOM_SESSIONS.find(s => s.id === sessionId);
    if (!session) return;
    
    set({
      sessionId: session.id,
      classroomModel: session.model,
      classroomConfig: session.config,
      classroomStatus: session.status,
      wordList: session.wordList,
      currentWordIndex: session.progress.currentWord ? 
        session.wordList.indexOf(session.progress.currentWord) : 0,
      currentWordId: session.progress.currentWord,
      completedWords: session.progress.completedWords,
      startTime: session.startTime
    });
  },
  
  // ========== Phase流程控制 ==========
  
  /**
   * 进入下一个Phase
   */
  nextPhase: () => {
    const currentPhase = get().currentPhase;
    if (currentPhase >= 6) return;
    
    set({
      currentPhase: currentPhase + 1,
      phaseStartTime: new Date().toISOString()
    });
  },
  
  /**
   * 跳转到指定Phase
   */
  goToPhase: (phase) => {
    if (phase < 1 || phase > 6) return;
    
    set({
      currentPhase: phase,
      phaseStartTime: new Date().toISOString()
    });
  },
  
  // ========== 单词导航 ==========
  
  /**
   * 进入下一个单词
   */
  nextWord: () => {
    const { wordList, currentWordIndex, currentWordId, completedWords } = get();
    
    // 将当前单词标记为已完成
    if (currentWordId && !completedWords.includes(currentWordId)) {
      set({
        completedWords: [...completedWords, currentWordId]
      });
    }
    
    // 移动到下一个单词
    const nextIndex = currentWordIndex + 1;
    if (nextIndex >= wordList.length) {
      // 所有单词完成，进入Summary或结束
      set({
        currentWordIndex: wordList.length,
        currentWordId: null,
        classroomStatus: 'completed'
      });
      return;
    }
    
    set({
      currentWordIndex: nextIndex,
      currentWordId: wordList[nextIndex],
      attemptCount: 0,
      errorCount: 0,
      userAnswer: ''
    });
  },
  
  /**
   * 跳转到指定单词
   */
  goToWord: (wordId) => {
    const { wordList } = get();
    const index = wordList.indexOf(wordId);
    if (index === -1) return;
    
    set({
      currentWordIndex: index,
      currentWordId: wordId,
      attemptCount: 0,
      errorCount: 0,
      userAnswer: ''
    });
  },
  
  // ========== 答题交互 ==========
  
  /**
   * 设置当前题目
   */
  setCurrentQuestion: (question) => {
    set({ currentQuestion: question });
  },
  
  /**
   * 更新用户答案
   */
  setUserAnswer: (answer) => {
    set({ userAnswer: answer });
  },
  
  /**
   * 提交答案
   */
  submitAnswer: (answer, isCorrect) => {
    const { currentWordId, currentPhase, attemptCount, errorCount, answerHistory } = get();
    
    const record = {
      wordId: currentWordId,
      phase: currentPhase,
      answer,
      isCorrect,
      timestamp: new Date().toISOString(),
      attemptNumber: attemptCount + 1
    };
    
    set({
      answerHistory: [...answerHistory, record],
      attemptCount: attemptCount + 1,
      errorCount: isCorrect ? errorCount : errorCount + 1,
      userAnswer: ''
    });
    
    return record;
  },
  
  /**
   * 重置当前单词的尝试
   */
  resetAttempts: () => {
    set({
      attemptCount: 0,
      errorCount: 0,
      userAnswer: ''
    });
  },
  
  // ========== 进度计算 ==========
  
  /**
   * 获取进度百分比
   */
  getProgress: () => {
    const { wordList, completedWords } = get();
    if (wordList.length === 0) return 0;
    return (completedWords.length / wordList.length) * 100;
  },
  
  /**
   * 获取剩余单词数
   */
  getRemainingWords: () => {
    const { wordList, completedWords } = get();
    return wordList.length - completedWords.length;
  },
  
  /**
   * 获取准确率
   */
  getAccuracy: () => {
    const { answerHistory } = get();
    if (answerHistory.length === 0) return 0;
    
    const correct = answerHistory.filter(h => h.isCorrect).length;
    return (correct / answerHistory.length) * 100;
  },
  
  // ========== 时间管理 ==========
  
  /**
   * 更新已用时间
   */
  updateElapsedTime: () => {
    const { startTime } = get();
    if (!startTime) return;
    
    const elapsed = Math.floor((new Date() - new Date(startTime)) / 1000);
    set({ elapsedTime: elapsed });
  },
  
  /**
   * 获取剩余时间
   */
  getRemainingTime: () => {
    const { classroomConfig, elapsedTime } = get();
    const totalTime = classroomConfig.duration * 60; // 转换为秒
    return Math.max(0, totalTime - elapsedTime);
  },
  
  // ========== 课堂结束 ==========
  
  /**
   * 完成课堂
   */
  completeClassroom: () => {
    set({
      classroomStatus: 'completed',
      currentPhase: 6
    });
  },
  
  /**
   * 生成课堂报告
   */
  generateReport: () => {
    const {
      classroomModel,
      wordList,
      completedWords,
      answerHistory,
      startTime,
      elapsedTime
    } = get();
    
    const totalAnswers = answerHistory.length;
    const correctAnswers = answerHistory.filter(h => h.isCorrect).length;
    const accuracy = totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 0;
    
    return {
      model: classroomModel,
      totalWords: wordList.length,
      completedWords: completedWords.length,
      accuracy: accuracy.toFixed(1),
      totalTime: elapsedTime,
      startTime,
      endTime: new Date().toISOString(),
      answerHistory
    };
  },
  
  // ========== 重置 ==========
  
  /**
   * 重置Store
   */
  reset: () => {
    set({
      classroomModel: 'A',
      classroomConfig: CLASSROOM_MODELS.A,
      sessionId: null,
      classroomStatus: 'idle',
      currentPhase: 1,
      wordList: [],
      currentWordIndex: 0,
      currentWordId: null,
      completedWords: [],
      currentQuestion: null,
      userAnswer: '',
      answerHistory: [],
      attemptCount: 0,
      errorCount: 0,
      startTime: null,
      phaseStartTime: null,
      elapsedTime: 0
    });
  }
}));

export default useLearningStore;
