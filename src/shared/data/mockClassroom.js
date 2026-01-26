/**
 * Mock课堂会话数据
 * 包含Model A/B配置和课堂状态
 */

/**
 * 课堂会话配置
 * @typedef {Object} ClassroomSession
 * @property {string} id - 会话ID
 * @property {'A'|'B'} model - 课堂模式
 * @property {number} teacherId - 教师ID
 * @property {number[]} studentIds - 学生ID列表
 * @property {string} startTime - 开始时间
 * @property {string} status - 状态
 * @property {Object} config - 配置信息
 */

export const CLASSROOM_MODELS = {
  A: {
    name: 'Model A: 标准新授课',
    description: '红词积压 ≤ 15个，核心目标为Input（吞吐量）',
    duration: 55,  // 分钟
    phases: [
      { name: 'Warm-up', duration: 5, time: '00:00-05:00' },
      { name: 'Batch 1', duration: 15, time: '05:00-20:00', words: 5 },
      { name: 'Batch 2', duration: 15, time: '20:00-35:00', words: 5 },
      { name: 'Batch 3', duration: 15, time: '35:00-50:00', words: 5 },
      { name: 'Summary', duration: 5, time: '50:00-55:00' }
    ],
    targetWords: 15,  // 目标新词数量
    minAccuracy: 0.80,  // 最低通过率80%
    redWordThreshold: 15,  // 红词阈值
    features: {
      warmup: true,
      batch: 3,
      summary: true,
      redBox: false
    }
  },
  
  B: {
    name: 'Model B: 攻坚复习课',
    description: '红词积压 > 15个，必须先清"认知债"',
    duration: 65,  // 分钟
    phases: [
      { name: 'Red Box', duration: 15, time: '00:00-15:00', maxWords: 15 },
      { name: 'Transition', duration: 10, time: '15:00-25:00' },
      { name: 'New Content', duration: 35, time: '25:00-60:00', words: 10 },
      { name: 'Summary', duration: 5, time: '60:00-65:00' }
    ],
    targetWords: 10,  // 目标新词数量（比Model A少）
    minAccuracy: 0.75,  // 最低通过率75%
    redBoxClearRate: 0.80,  // Red Box清空率80%
    features: {
      warmup: false,
      batch: 1,
      summary: true,
      redBox: true
    }
  }
};

export const MOCK_CLASSROOM_SESSIONS = [
  {
    id: 'session_001',
    model: 'A',
    teacherId: 2,  // 王老师
    studentIds: [1],  // 小明
    startTime: '2026-01-23T10:00:00Z',
    status: 'in_progress',  // 'scheduled' | 'in_progress' | 'completed'
    
    config: {
      ...CLASSROOM_MODELS.A,
      currentPhase: 'Batch 1',
      currentPhaseStartTime: '2026-01-23T10:05:00Z',
      wordsCompleted: 3,
      wordsTotal: 15,
      accuracy: 0.85
    },
    
    // 当前课堂的单词列表
    wordList: [1, 2, 3, 9, 10, 11, 13, 15],  // 单词ID列表
    
    // 实时进度
    progress: {
      phase: 'Batch 1',
      completedWords: [1, 2, 3],
      currentWord: 9,
      remainingWords: [10, 11, 13, 15],
      timeElapsed: 20,  // 分钟
      timeRemaining: 35
    }
  },
  
  {
    id: 'session_002',
    model: 'B',
    teacherId: 2,
    studentIds: [1],
    startTime: '2026-01-24T14:00:00Z',
    status: 'scheduled',
    
    config: {
      ...CLASSROOM_MODELS.B,
      redWordsToFix: [4],  // 需要修补的红词
      newWords: [3, 9, 10, 11, 13],  // 新授单词
      redBoxClearTarget: 1
    },
    
    wordList: [4, 3, 9, 10, 11, 13],
    
    progress: {
      phase: 'Not Started',
      completedWords: [],
      currentWord: null,
      remainingWords: [4, 3, 9, 10, 11, 13],
      timeElapsed: 0,
      timeRemaining: 65
    }
  }
];

/**
 * 获取课堂会话
 */
export const getClassroomSession = (sessionId) => {
  return MOCK_CLASSROOM_SESSIONS.find(session => session.id === sessionId);
};

/**
 * 获取当前进行中的课堂
 */
export const getCurrentSession = () => {
  return MOCK_CLASSROOM_SESSIONS.find(session => session.status === 'in_progress');
};

/**
 * 根据学生状态推荐课堂模式
 */
export const recommendModel = (studentId) => {
  // 这里会结合 mockStudents.js 中的数据
  // 简化版：根据红词率和积压量判断
  const redWordRate = 0.11;  // 从学生数据获取
  const reviewBacklog = 4;
  
  if (redWordRate > 0.15 || reviewBacklog > 20) {
    return {
      model: 'B',
      reason: `红词率${(redWordRate * 100).toFixed(0)}%，积压${reviewBacklog}个单词`,
      config: CLASSROOM_MODELS.B
    };
  }
  
  return {
    model: 'A',
    reason: `红词率${(redWordRate * 100).toFixed(0)}%，积压${reviewBacklog}个单词`,
    config: CLASSROOM_MODELS.A
  };
};

/**
 * Red Box流程配置
 */
export const RED_BOX_CONFIG = {
  maxWords: 15,  // 最多处理15个红词
  timeLimit: 15,  // 15分钟时间限制
  steps: [
    {
      step: 1,
      name: '定音定形',
      required: true,
      actions: ['展示音节切分', '教练话术引导']
    },
    {
      step: 2,
      name: '精准助记',
      required: false,
      actions: ['拆音节', '读口诀', '看图片', '讲词根']
    },
    {
      step: 3,
      name: '拼写销项',
      required: true,
      actions: ['L4盲打界面', '判定结果']
    }
  ],
  clearCriteria: {
    minAccuracy: 1.0,  // 必须100%正确
    maxAttempts: 2  // 最多2次尝试
  }
};

/**
 * 三级容错漏斗配置（Phase 4）
 */
export const TOLERANCE_FUNNEL_CONFIG = {
  level1: {
    name: '手滑提示',
    trigger: '正确率 > 80%（错误1个字母）',
    action: '微震 + 气泡提示',
    result: '允许原地修正',
    stateChange: null
  },
  level2: {
    name: '降级助推',
    trigger: '正确率 50%-80%（错误2个字母）',
    action: '显示骨架提示',
    result: '助推成功后勉强保黄',
    stateChange: 'Yellow周期重置'
  },
  level3: {
    name: '熔断锁定',
    trigger: '正确率 < 50%（错误≥3个字母）',
    action: '显示正确答案 + 锁定',
    result: '状态转为Red',
    stateChange: 'Yellow → Red'
  }
};

/**
 * 艾宾浩斯复习周期配置
 */
export const REVIEW_CYCLE_CONFIG = {
  cycles: [
    { cycle: 1, days: 3, label: '3天后第一次复习' },
    { cycle: 2, days: 7, label: '7天后第二次复习' },
    { cycle: 3, days: 30, label: '30天后长期巩固' }
  ],
  minReviews: 5,  // 最少复习5次才能进入P6
  greenCriteria: {
    reviewCount: 5,
    daysPassed: 30,
    accuracy: 0.90
  }
};

