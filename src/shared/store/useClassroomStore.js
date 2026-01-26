import { create } from 'zustand';
import { getRandomWords } from '../data/mockWords';
import { getAllRedWords } from '../data/mockRedWords';

/**
 * 课堂共享状态 Store
 * 学生端和教师端共享此 store，实现双端联动
 * 
 * 支持 Model A（标准新授）和 Model B（攻坚复习）
 */
const useClassroomStore = create((set, get) => ({
  // ========================================
  // 课堂基础信息
  // ========================================
  
  /** 课堂模式: 'A' (标准新授) | 'B' (攻坚复习) */
  classroomMode: 'A',
  
  /** 课堂状态: 'waiting' | 'active' | 'paused' | 'ended' */
  sessionStatus: 'waiting',
  
  /** 本节课的单词列表（新词） */
  wordList: [],
  
  /** 红词列表（Model B 专用） */
  redWords: [],
  
  /** 当前学习阶段: 'P1' | 'P2' | 'P3' | 'RedBox' | 'Summary' */
  currentPhase: 'P1',
  
  /** 已完成的阶段 */
  completedPhases: [],
  
  /** 当前单词索引 */
  currentWordIndex: 0,
  
  // ========================================
  // Red Box 专属状态（Model B）
  // ========================================
  
  /** Red Box 当前步骤: 1(定音定形) | 2(精准助记) | 3(L4验收) */
  redBoxStep: 1,
  
  /** Red Box 当前红词索引 */
  currentRedWordIndex: 0,
  
  /** Red Box 是否完成 */
  redBoxCompleted: false,
  
  // ========================================
  // 武器库弹窗状态（教师触发，学生端显示）
  // ========================================
  
  weaponPopup: {
    /** 弹窗是否打开 */
    isOpen: false,
    
    /** 当前使用的武器: 'syllables' | 'mnemonic' | 'image' | 'etymology' */
    weaponId: null,
    
    /** 目标单词对象 */
    word: null,
  },
  
  // ========================================
  // 学生端状态（教师端可见）
  // ========================================
  
  studentState: {
    /** 是否在线 */
    isOnline: true,
    
    /** 当前选中的选项 */
    selectedOption: null,
    
    /** 是否已提交答案 */
    isSubmitted: false,
    
    /** 答案是否正确 */
    isCorrect: null,
    
    /** 当前输入的文本（用于拼写题） */
    inputText: '',
    
    /** Phase 2 当前训练轮次: 1(听音), 2(闪视), 3(幽灵拼写) */
    p2Round: 1,
    
    /** Phase 2 当前轮次中的单词索引 */
    p2WordIndex: 0,
    
    /** 拼写尝试次数 */
    attempts: 0,
  },
  
  // ========================================
  // 教师端状态（学生端可响应）
  // ========================================
  
  teacherState: {
    /** 是否在线 */
    isOnline: true,
    
    /** 教师指令: null | 'next' | 'repeat' | 'skip' | 'pause' | 'nextRedWord' | 'showHint' | 'revealSyllables' | 'revealEtymology' | 'playAudio' | 'completeSplit' | 'completeToolbox' */
    command: null,
    
    /** 是否显示答案 */
    showAnswer: false,
    
    /** 教师批注/反馈 */
    feedback: '',
    
    /** 选择的武器（Red Box Step 2） */
    selectedWeapon: null,
  },
  
  // ========================================
  // 单词学习结果记录
  // ========================================
  
  /** 
   * 单词结果: { [wordId]: { p1Result, needP2, p2Completed, p3Result, status, redBoxPassed, ... } }
   * status: 'pending' | 'yellow' | 'red' | 'green'
   */
  wordResults: {},
  
  // ========================================
  // Actions: 课堂控制
  // ========================================
  
  /** 初始化课堂 */
  initClassroom: (mode = 'A', wordCount = 5) => {
    const words = getRandomWords(wordCount);
    const redWordsList = mode === 'B' ? getAllRedWords() : [];
    
    set({
      classroomMode: mode,
      sessionStatus: 'active',
      wordList: words,
      redWords: redWordsList,
      currentPhase: mode === 'B' ? 'RedBox' : 'P1', // Model B 从 Red Box 开始
      completedPhases: [],
      currentWordIndex: 0,
      redBoxStep: 1,
      currentRedWordIndex: 0,
      redBoxCompleted: false,
      wordResults: {},
      // 重置武器库弹窗
      weaponPopup: {
        isOpen: false,
        weaponId: null,
        word: null,
      },
      studentState: {
        isOnline: true,
        selectedOption: null,
        isSubmitted: false,
        isCorrect: null,
        inputText: '',
        p2Round: 1,
        p2WordIndex: 0,
        attempts: 0,
      },
      teacherState: {
        isOnline: true,
        command: null,
        showAnswer: false,
        feedback: '',
        selectedWeapon: null,
      },
    });
    
    console.log(`🎓 [Store] 课堂初始化 - 模式: ${mode}, 新词: ${words.length}, 红词: ${redWordsList.length}`);
  },
  
  /** 获取当前单词 */
  getCurrentWord: () => {
    const { wordList, currentWordIndex } = get();
    return wordList[currentWordIndex] || null;
  },
  
  /** 获取当前红词 */
  getCurrentRedWord: () => {
    const { redWords, currentRedWordIndex } = get();
    return redWords[currentRedWordIndex] || null;
  },
  
  // ========================================
  // Actions: 学生端操作
  // ========================================
  
  /** 学生选择选项 */
  studentSelectOption: (optionId) => {
    set((state) => ({
      studentState: {
        ...state.studentState,
        selectedOption: optionId,
      },
    }));
  },
  
  /** 学生提交答案 */
  studentSubmitAnswer: (isCorrect) => {
    const { currentWordIndex, wordList, currentPhase } = get();
    const currentWord = wordList[currentWordIndex];
    
    set((state) => ({
      studentState: {
        ...state.studentState,
        isSubmitted: true,
        isCorrect,
        attempts: state.studentState.attempts + 1,
      },
      // 记录结果（仅针对新词阶段）
      wordResults: currentWord ? {
        ...state.wordResults,
        [currentWord.id]: {
          ...state.wordResults[currentWord.id],
          [`${currentPhase.toLowerCase()}Result`]: isCorrect,
          needP2: currentPhase === 'P1' ? !isCorrect : state.wordResults[currentWord.id]?.needP2,
          status: currentPhase === 'P3' && isCorrect ? 'yellow' : 'pending',
        },
      } : state.wordResults,
    }));
  },
  
  /** 学生输入文本（拼写题） */
  studentInputText: (text) => {
    set((state) => ({
      studentState: {
        ...state.studentState,
        inputText: text,
      },
    }));
  },
  
  /** 重置学生答题状态（切换到下一题时调用） */
  resetStudentState: () => {
    set((state) => ({
      studentState: {
        ...state.studentState,
        selectedOption: null,
        isSubmitted: false,
        isCorrect: null,
        inputText: '',
        attempts: 0,
      },
    }));
  },
  
  // ========================================
  // Actions: 阶段与进度控制
  // ========================================
  
  /** 进入下一个单词 */
  nextWord: () => {
    const { currentWordIndex, wordList } = get();
    
    if (currentWordIndex < wordList.length - 1) {
      set((state) => ({
        currentWordIndex: state.currentWordIndex + 1,
        studentState: {
          ...state.studentState,
          selectedOption: null,
          isSubmitted: false,
          isCorrect: null,
          inputText: '',
          attempts: 0,
        },
      }));
      return true;
    }
    return false; // 没有更多单词了
  },
  
  /** 切换到指定阶段 */
  setPhase: (phase) => {
    set((state) => ({
      currentPhase: phase,
      currentWordIndex: 0,
      completedPhases: state.currentPhase !== phase 
        ? [...state.completedPhases.filter(p => p !== state.currentPhase), state.currentPhase]
        : state.completedPhases,
      studentState: {
        ...state.studentState,
        selectedOption: null,
        isSubmitted: false,
        isCorrect: null,
        inputText: '',
        p2Round: phase === 'P2' ? 1 : state.studentState.p2Round,
        p2WordIndex: 0,
        attempts: 0,
      },
      // 重置教师武器选择
      teacherState: {
        ...state.teacherState,
        selectedWeapon: null,
        command: null,
      },
    }));
    console.log(`📍 [Store] 阶段切换到: ${phase}`);
  },
  
  /** Phase 2: 更新轮次和单词索引 */
  setP2RoundAndWord: (round, wordIndex) => {
    set((state) => ({
      studentState: {
        ...state.studentState,
        p2Round: round,
        p2WordIndex: wordIndex,
        selectedOption: null,
        isSubmitted: false,
        isCorrect: null,
        inputText: '',
        attempts: 0,
      },
    }));
  },
  
  /** Phase 2: 进入下一轮 */
  nextP2Round: () => {
    set((state) => ({
      studentState: {
        ...state.studentState,
        p2Round: Math.min(state.studentState.p2Round + 1, 3),
        p2WordIndex: 0,
        selectedOption: null,
        isSubmitted: false,
        isCorrect: null,
        inputText: '',
        attempts: 0,
      },
    }));
  },
  
  /** Phase 2: 进入下一个单词（同一轮次） */
  nextP2Word: () => {
    set((state) => ({
      studentState: {
        ...state.studentState,
        p2WordIndex: state.studentState.p2WordIndex + 1,
        selectedOption: null,
        isSubmitted: false,
        isCorrect: null,
        inputText: '',
        attempts: 0,
      },
    }));
  },
  
  // ========================================
  // Actions: Red Box 操作（Model B）
  // ========================================
  
  /** 设置 Red Box 步骤 */
  setRedBoxStep: (step) => {
    set((state) => ({
      redBoxStep: step,
      studentState: {
        ...state.studentState,
        selectedOption: null,
        isSubmitted: false,
        isCorrect: null,
        inputText: '',
        attempts: 0,
      },
      teacherState: {
        ...state.teacherState,
        selectedWeapon: null,
        command: null,
      },
    }));
    console.log(`🔴 [Store] Red Box Step: ${step}`);
  },
  
  /** 设置当前红词索引 */
  setCurrentRedWordIndex: (index) => {
    set({
      currentRedWordIndex: index,
    });
  },
  
  /** 完成 Red Box 阶段，进入新词学习 */
  completeRedBox: () => {
    set((state) => ({
      redBoxCompleted: true,
      currentPhase: 'P1', // 进入新词的 P1 阶段
      currentWordIndex: 0,
      completedPhases: [...state.completedPhases, 'RedBox'],
      studentState: {
        ...state.studentState,
        selectedOption: null,
        isSubmitted: false,
        isCorrect: null,
        inputText: '',
        attempts: 0,
      },
      teacherState: {
        ...state.teacherState,
        selectedWeapon: null,
        command: null,
      },
    }));
    console.log('✅ [Store] Red Box 完成，进入新词学习');
  },
  
  // ========================================
  // Actions: 教师端操作
  // ========================================
  
  /** 教师发送指令 */
  teacherSendCommand: (command) => {
    const { redBoxStep, currentRedWordIndex, redWords, nextWord, resetStudentState } = get();
    
    console.log(`👨‍🏫 [Store] 教师指令: ${command}`);
    
    // 先设置命令，让组件可以响应
    set((state) => ({
      teacherState: {
        ...state.teacherState,
        command,
      },
    }));
    
    // 执行需要同步双端的指令
    switch (command) {
      case 'next':
        nextWord();
        break;
      case 'skip':
        nextWord();
        break;
      case 'repeat':
        resetStudentState();
        break;
      // Red Box 步骤控制
      case 'nextStep':
        if (redBoxStep < 4) {
          set((state) => ({
            redBoxStep: state.redBoxStep + 1,
            studentState: {
              ...state.studentState,
              selectedOption: null,
              isSubmitted: false,
              isCorrect: null,
              inputText: '',
            },
          }));
          console.log(`🔴 [Store] Red Box 进入步骤: ${redBoxStep + 1}`);
        } else {
          // Step 4 完成，进入下一个红词或新词学习
          if (currentRedWordIndex < redWords.length - 1) {
            // 还有下一个红词
            set((state) => ({
              currentRedWordIndex: state.currentRedWordIndex + 1,
              redBoxStep: 1,
              studentState: {
                ...state.studentState,
                selectedOption: null,
                isSubmitted: false,
                isCorrect: null,
                inputText: '',
              },
            }));
            console.log(`🔴 [Store] Red Box 下一个红词: ${currentRedWordIndex + 1}`);
          } else {
            // 所有红词完成，进入新词学习（P1）
            set((state) => ({
              currentPhase: 'P1',
              completedPhases: [...state.completedPhases, 'RedBox'],
              currentWordIndex: 0,
              redBoxStep: 1, // 重置（为下次使用）
              currentRedWordIndex: 0, // 重置
              studentState: {
                ...state.studentState,
                selectedOption: null,
                isSubmitted: false,
                isCorrect: null,
                inputText: '',
              },
            }));
            console.log('✅ [Store] Red Box 全部完成，进入新词学习 P1');
          }
        }
        break;
      case 'prevStep':
        if (redBoxStep > 1) {
          set((state) => ({
            redBoxStep: state.redBoxStep - 1,
            studentState: {
              ...state.studentState,
              selectedOption: null,
              isSubmitted: false,
              isCorrect: null,
              inputText: '',
            },
          }));
        }
        break;
      case 'nextWord':
        if (currentRedWordIndex < redWords.length - 1) {
          set((state) => ({
            currentRedWordIndex: state.currentRedWordIndex + 1,
            redBoxStep: 1,
            studentState: {
              ...state.studentState,
              selectedOption: null,
              isSubmitted: false,
              isCorrect: null,
              inputText: '',
            },
          }));
          console.log(`🔴 [Store] Red Box 切换到红词: ${currentRedWordIndex + 1}`);
        }
        break;
      case 'prevWord':
        if (currentRedWordIndex > 0) {
          set((state) => ({
            currentRedWordIndex: state.currentRedWordIndex - 1,
            redBoxStep: 1,
            studentState: {
              ...state.studentState,
              selectedOption: null,
              isSubmitted: false,
              isCorrect: null,
              inputText: '',
            },
          }));
          console.log(`🔴 [Store] Red Box 切换到红词: ${currentRedWordIndex - 1}`);
        }
        break;
      default:
        // 其他指令（playAudio, showPhonetic 等）由组件自行处理
        break;
    }
    
    // 清除指令（延迟500ms，确保组件有时间响应）
    setTimeout(() => {
      set((state) => ({
        teacherState: { ...state.teacherState, command: null },
      }));
    }, 500);
  },
  
  /** 教师选择武器（Red Box Step 2） */
  teacherSelectWeapon: (weaponId) => {
    set((state) => ({
      teacherState: {
        ...state.teacherState,
        selectedWeapon: weaponId,
      },
    }));
    console.log(`🛠️ [Store] 教师选择武器: ${weaponId}`);
  },
  
  /** 教师显示/隐藏答案 */
  teacherToggleAnswer: () => {
    set((state) => ({
      teacherState: {
        ...state.teacherState,
        showAnswer: !state.teacherState.showAnswer,
      },
    }));
  },
  
  /** 教师发送反馈 */
  teacherSendFeedback: (feedback) => {
    set((state) => ({
      teacherState: {
        ...state.teacherState,
        feedback,
      },
    }));
  },
  
  // ========================================
  // Actions: 武器库弹窗
  // ========================================
  
  /** 打开武器库弹窗（教师端调用） */
  openWeaponPopup: (weaponId, word) => {
    set({
      weaponPopup: {
        isOpen: true,
        weaponId,
        word,
      },
    });
    console.log(`🛡️ [Store] 武器库弹窗打开: ${weaponId} - ${word?.word}`);
  },
  
  /** 关闭武器库弹窗 */
  closeWeaponPopup: () => {
    set({
      weaponPopup: {
        isOpen: false,
        weaponId: null,
        word: null,
      },
    });
    console.log('🛡️ [Store] 武器库弹窗关闭');
  },
  
  /** 切换武器库弹窗的武器 */
  switchWeaponInPopup: (weaponId) => {
    set((state) => ({
      weaponPopup: {
        ...state.weaponPopup,
        weaponId,
      },
    }));
    console.log(`🛡️ [Store] 武器库切换武器: ${weaponId}`);
  },
  
  // ========================================
  // Actions: 单词结果管理
  // ========================================
  
  /** 更新单词结果（支持新词和红词） */
  updateWordResult: (wordId, phase, passed, source = null, failedToRetrain = false) => {
    set((state) => {
      const updates = {
        ...state.wordResults[wordId],
      };
      
      if (phase === 'p1') {
        updates.p1Result = passed;
        updates.needP2 = !passed;
      } else if (phase === 'p2') {
        updates.p2Completed = true;
      } else if (phase === 'p3') {
        updates.p3Passed = passed;
        updates.source = source;
        updates.p3FailedToP2 = failedToRetrain;
        updates.status = passed ? 'yellow' : 'pending';
      } else if (phase === 'redbox') {
        updates.redBoxPassed = passed;
        updates.source = 'red_word';
        updates.status = passed ? 'yellow' : 'red';
      }
      
      return {
        wordResults: {
          ...state.wordResults,
          [wordId]: updates,
        },
      };
    });
    console.log(`📝 [Store] 单词 ${wordId} ${phase} 结果更新: ${passed ? '通过' : '未通过'}`);
  },
  
  /** 批量更新单词结果 */
  updateWordResults: (updates) => {
    set((state) => ({
      wordResults: {
        ...state.wordResults,
        ...updates,
      },
    }));
  },
  
  // ========================================
  // Getters: 统计与查询
  // ========================================
  
  /** 获取需要 P2 训练的单词列表 */
  getP2Words: () => {
    const { wordList, wordResults } = get();
    return wordList.filter(word => wordResults[word.id]?.needP2);
  },
  
  /** 获取 Phase 1 的进度 */
  getP1Progress: () => {
    const { wordList, wordResults } = get();
    const completed = wordList.filter(word => wordResults[word.id]?.p1Result !== undefined).length;
    return {
      completed,
      total: wordList.length,
      percentage: wordList.length > 0 ? Math.round((completed / wordList.length) * 100) : 0,
    };
  },
  
  /** 获取 Red Box 进度 */
  getRedBoxProgress: () => {
    const { redWords, wordResults } = get();
    const completed = redWords.filter(word => 
      wordResults[word.id]?.redBoxPassed !== undefined
    ).length;
    const cleared = redWords.filter(word => 
      wordResults[word.id]?.redBoxPassed === true
    ).length;
    
    return {
      completed,
      cleared,
      total: redWords.length,
      percentage: redWords.length > 0 ? Math.round((completed / redWords.length) * 100) : 0,
      clearRate: redWords.length > 0 ? Math.round((cleared / redWords.length) * 100) : 0,
    };
  },
  
  /** 获取各状态单词数量 */
  getWordStats: () => {
    const { wordResults } = get();
    const results = Object.values(wordResults);
    return {
      pending: results.filter(r => r.status === 'pending' || !r.status).length,
      yellow: results.filter(r => r.status === 'yellow').length,
      red: results.filter(r => r.status === 'red').length,
      green: results.filter(r => r.status === 'green').length,
    };
  },
}));

export default useClassroomStore;
