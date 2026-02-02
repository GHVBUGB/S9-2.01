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
  
  /** 词包类型: 'core' (核心词) | 'non-core' (非核心词) */
  wordType: 'core',
  
  /** 非核心词 P3 是否等待重试 */
  p3WaitingForRetry: false,
  
  /** 课堂状态: 'waiting' | 'active' | 'paused' | 'ended' */
  sessionStatus: 'waiting',
  
  /** 本节课的单词列表（新词） */
  wordList: [],
  
  /** 红词列表（Model B 专用） */
  redWords: [],
  
  /** 当前学习阶段: 'Warmup' | 'RedBox' | 'P1' | 'P2' | 'P3' | 'Summary' */
  currentPhase: 'Warmup',
  
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
  
  /** Red Box 当前步骤的 UI 状态（教师控制，学生端响应） */
  redBoxUI: {
    /** Step 1: 是否已播放发音 */
    audioPlayed: false,
    /** Step 1: 是否显示音节 */
    showSyllables: false,
    /** Step 1: 是否显示音标 */
    showPhonetic: false,
    /** Step 2: 当前选择的武器 */
    selectedWeapon: null,
    /** Step 3: 是否显示答案 */
    showAnswer: false,
  },
  
  // ========================================
  // 热身阶段状态
  // ========================================
  
  /** 学生课前状态选择: 'good' | 'normal' | 'tired' | null */
  studentMood: null,
  
  // ========================================
  // P1.5 认读跟读状态
  // ========================================
  
  sightSound: {
    /** 当前跟读单词索引 */
    currentIndex: 0,
    
    /** 已完成跟读的单词 ID 列表 */
    completedWords: [],
    
    /** P1.5 是否已完成 */
    completed: false,
  },
  
  // ========================================
  // 单词流转状态（新流程）
  // ========================================
  
  wordFlow: {
    /** P1 错词 ID 列表 */
    p1WrongWordIds: [],
    
    /** P1 对词 ID 列表 */
    p1CorrectWordIds: [],
    
    /** 当前处理批次: 'wrong' | 'correct' | null */
    currentBatch: null,
    
    /** 当前组索引（从0开始） */
    currentGroupIndex: 0,
    
    /** 每组大小 */
    groupSize: 5,
    
    /** P1 是否已完成分流 */
    p1Finalized: false,
    
    /** 当前组在 P2/P3 中的单词索引 */
    currentWordInGroupIndex: 0,
    
    /** 当前组 P2 的轮次: 1(听音) | 2(闪视) | 3(幽灵拼写) */
    currentGroupP2Round: 1,
  },
  
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
    
    /** Phase 2 错题列表（单词ID数组） */
    p2WrongWords: [],
    
    /** Phase 2 是否处于错题重做轮 */
    p2IsRetryRound: false,
    
    /** Phase 2 错题轮计数（用于触发组件更新） */
    p2RetryCount: 0,
    
    /** Phase 3 当前单词索引 */
    p3WordIndex: 0,
    
    /** Phase 3 是否已完成 */
    p3Completed: false,
    
    /** Phase 3 需要重新验收的单词（从 P2 返回后只验收这些） */
    p3RetryWords: [],
    
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
    
    /** 闪现辨析阶段同步：'ready' | 'countdown' | 'flash' | 'answer' */
    flashPhase: 'ready',
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
      wordType: 'core', // 默认核心词
      sessionStatus: 'active',
      wordList: words,
      redWords: redWordsList,
      currentPhase: 'Warmup', // 所有模式都从热身开始
      studentMood: null, // 重置学生状态
      completedPhases: [],
      currentWordIndex: 0,
      redBoxStep: 1,
      currentRedWordIndex: 0,
      redBoxCompleted: false,
      // 重置 RedBox UI 状态
      redBoxUI: {
        audioPlayed: false,
        showSyllables: false,
        showPhonetic: false,
        selectedWeapon: null,
        showAnswer: false,
      },
      wordResults: {},
      // 重置武器库弹窗
      weaponPopup: {
        isOpen: false,
        weaponId: null,
        word: null,
      },
      // 重置 P1.5 认读跟读状态
      sightSound: {
        currentIndex: 0,
        completedWords: [],
        completed: false,
      },
      // 重置单词流转状态
      wordFlow: {
        p1WrongWordIds: [],
        p1CorrectWordIds: [],
        currentBatch: null,
        currentGroupIndex: 0,
        groupSize: 5,
        p1Finalized: false,
        currentWordInGroupIndex: 0,
        currentGroupP2Round: 1,
      },
      studentState: {
        isOnline: true,
        selectedOption: null,
        isSubmitted: false,
        isCorrect: null,
        inputText: '',
        p2Round: 1,
        p2WordIndex: 0,
        p2WrongWords: [],
        p2IsRetryRound: false,
        p2RetryCount: 0,
        p3WordIndex: 0,
        p3Completed: false,
        p3RetryWords: [],
        attempts: 0,
      },
      teacherState: {
        isOnline: true,
        command: null,
        showAnswer: false,
        feedback: '',
        selectedWeapon: null,
        flashPhase: 'ready',
      },
    });
    
    console.log(`🎓 [Store] 课堂初始化 - 模式: ${mode}, 新词: ${words.length}, 红词: ${redWordsList.length}`);
  },
  
  /** 获取当前单词（P1 阶段使用） */
  getCurrentWord: () => {
    const { wordList, currentWordIndex } = get();
    return wordList[currentWordIndex] || null;
  },
  
  /** 获取当前红词 */
  getCurrentRedWord: () => {
    const { redWords, currentRedWordIndex } = get();
    return redWords[currentRedWordIndex] || null;
  },
  
  /** P1.5阶段当前单词（由SightSoundInput设置） */
  p15CurrentWord: null,
  
  /** 设置P1.5当前单词 */
  setP15CurrentWord: (word) => {
    set({ p15CurrentWord: word });
  },
  
  /** P2阶段当前单词（由P2Container设置） */
  p2CurrentWord: null,
  
  /** 设置P2当前单词 */
  setP2CurrentWord: (word) => {
    set({ p2CurrentWord: word });
  },
  
  /** P3阶段当前单词（由P3Container设置） */
  p3CurrentWord: null,
  
  /** 设置P3当前单词 */
  setP3CurrentWord: (word) => {
    set({ p3CurrentWord: word });
  },
  
  /** 
   * 获取当前阶段正在学习的单词（武器库使用）
   * 根据不同阶段返回正确的单词
   */
  getActiveWord: () => {
    const { currentPhase, wordList, redWords, currentWordIndex, currentRedWordIndex, studentState, p15CurrentWord, p2CurrentWord, p3CurrentWord } = get();
    
    switch (currentPhase) {
      case 'RedBox':
        return redWords[currentRedWordIndex] || null;
      
      case 'P1':
        return wordList[currentWordIndex] || null;
      
      case 'P1.5':
        // P1.5 阶段：使用SightSoundInput设置的当前单词
        return p15CurrentWord;
      
      case 'P2':
        // P2 阶段：使用P2Container设置的当前单词
        return p2CurrentWord;
      
      case 'P3':
        // P3 阶段：使用P3Container设置的当前单词
        return p3CurrentWord;
      
      default:
        return wordList[currentWordIndex] || null;
    }
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
        p2WordIndex: phase === 'P2' ? 0 : state.studentState.p2WordIndex,
        p2WrongWords: phase === 'P2' ? [] : state.studentState.p2WrongWords,
        p2IsRetryRound: phase === 'P2' ? false : state.studentState.p2IsRetryRound,
        p2RetryCount: phase === 'P2' ? 0 : state.studentState.p2RetryCount,
        p3WordIndex: phase === 'P3' ? 0 : state.studentState.p3WordIndex,
        p3Completed: phase === 'P3' ? false : state.studentState.p3Completed,
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
  
  /**
   * 教师强制进入下一阶段
   * - 立即结束当前阶段
   * - P1 阶段：未测试的单词标记为【正确】，然后调用 finalizeP1 分流
   */
  forceNextPhase: () => {
    const { currentPhase, wordList, wordResults, currentWordIndex, redWords, currentRedWordIndex, finalizeP1 } = get();
    
    // P1 阶段特殊处理：使用新的分流逻辑
    if (currentPhase === 'P1') {
      const testedCount = currentWordIndex + (get().studentState.isSubmitted ? 1 : 0);
      console.log(`🎯 [Store] P1 筛查强制结束，已测试 ${testedCount}/${wordList.length} 个单词`);
      console.log(`📝 [Store] 未测试的 ${wordList.length - testedCount} 个单词将标记为正确`);
      
      // 调用 finalizeP1，传入 true 表示将未测试的词标记为正确
      finalizeP1(true);
      
      return { 
        success: true, 
        message: `P1 筛查强制结束，未测试的词已标记为正确`,
        nextPhase: get().currentPhase // finalizeP1 会设置正确的下一阶段
      };
    }
    
    // P1.5 阶段特殊处理：跳过跟读，直接进入 P2
    if (currentPhase === 'P1.5') {
      console.log(`⏭️ [Store] P1.5 跟读强制跳过，进入 P2`);
      get().skipSightSound();
      return { 
        success: true, 
        message: `跟读环节已跳过`,
        nextPhase: 'P2'
      };
    }
    
    // 其他阶段保持原有逻辑
    const phaseOrder = ['RedBox', 'P1', 'P1.5', 'P2', 'P3', 'Summary'];
    const currentIndex = phaseOrder.indexOf(currentPhase);
    
    if (currentIndex === -1 || currentIndex >= phaseOrder.length - 1) {
      console.log('⚠️ [Store] 已经是最后阶段，无法继续');
      return { success: false, message: '已经是最后阶段' };
    }
    
    const nextPhase = phaseOrder[currentIndex + 1];
    
    // 根据当前阶段处理数据截断
    let truncatedData = {};
    let message = '';
    
    if (currentPhase === 'P2') {
      
    } else     if (currentPhase === 'P2') {
      // P2 -> P3: 当前组 P2 强制完成，进入当前组 P3
      const { p2Round, p2WordIndex } = get().studentState;
      
      // 调用 currentGroupP2Complete 进入当前组的 P3
      get().currentGroupP2Complete();
      
      message = `P2 训练强制结束，进入当前组 P3`;
      console.log(`🎯 [Store] ${message}`);
      
      return { success: true, message, nextPhase: 'P3' };
      
    } else if (currentPhase === 'P3') {
      // P3 -> 下一组或 Summary: 调用 advanceToNextGroup
      get().advanceToNextGroup();
      
      message = `P3 验收强制结束，进入下一组/阶段`;
      console.log(`🎯 [Store] ${message}`);
      
      return { success: true, message, nextPhase: get().currentPhase };
      
    } else if (currentPhase === 'RedBox') {
      // RedBox -> P1: 标记未完成的红词
      const updatedResults = { ...wordResults };
      redWords.forEach((word, idx) => {
        if (idx > currentRedWordIndex || (idx === currentRedWordIndex && !updatedResults[word.id]?.redBoxPassed)) {
          updatedResults[word.id] = {
            ...updatedResults[word.id],
            redBoxSkipped: true,
            status: 'red', // 保持红色状态
          };
        }
      });
      
      truncatedData = { wordResults: updatedResults };
      message = `Red Box 攻坚强制结束，已处理 ${currentRedWordIndex + 1}/${redWords.length} 个红词`;
      console.log(`🎯 [Store] ${message}`);
    }
    
    // 执行阶段切换
    set((state) => ({
      ...truncatedData,
      currentPhase: nextPhase,
      currentWordIndex: 0,
      completedPhases: [...state.completedPhases.filter(p => p !== currentPhase), currentPhase],
      studentState: {
        ...state.studentState,
        selectedOption: null,
        isSubmitted: false,
        isCorrect: null,
        inputText: '',
        p2Round: nextPhase === 'P2' ? 1 : state.studentState.p2Round,
        p2WordIndex: nextPhase === 'P2' ? 0 : state.studentState.p2WordIndex,
        p3WordIndex: nextPhase === 'P3' ? 0 : state.studentState.p3WordIndex,
        p3Completed: nextPhase === 'P3' ? false : state.studentState.p3Completed,
        attempts: 0,
      },
      teacherState: {
        ...state.teacherState,
        selectedWeapon: null,
        command: 'forceNextPhase', // 通知学生端
      },
    }));
    
    // 清除指令
    setTimeout(() => {
      set((state) => ({
        teacherState: { ...state.teacherState, command: null },
      }));
    }, 500);
    
    console.log(`✅ [Store] 强制切换到阶段: ${nextPhase}`);
    return { success: true, message, nextPhase };
  },
  
  /** 获取下一阶段信息（用于 UI 显示） */
  getNextPhaseInfo: () => {
    const { currentPhase, classroomMode } = get();
    const phaseOrder = classroomMode === 'B' 
      ? ['Warmup', 'RedBox', 'P1', 'P1.5', 'P2', 'P3', 'Summary'] 
      : ['Warmup', 'P1', 'P1.5', 'P2', 'P3', 'Summary'];
    const currentIndex = phaseOrder.indexOf(currentPhase);
    
    if (currentIndex === -1 || currentIndex >= phaseOrder.length - 1) {
      return null;
    }
    
    const nextPhase = phaseOrder[currentIndex + 1];
    const phaseNames = {
      Warmup: '热身',
      RedBox: '红盒攻坚',
      P1: '精准筛查',
      'P1.5': '认读跟读',
      P2: '集中训练',
      P3: '门神验收',
      Summary: '课堂总结',
    };
    
    return {
      id: nextPhase,
      name: phaseNames[nextPhase],
    };
  },
  
  /** 设置学生课前状态 */
  setStudentMood: (mood) => {
    set({ studentMood: mood });
    console.log(`😊 [Store] 学生状态: ${mood}`);
  },
  
  /** 设置词包类型 */
  setWordType: (type) => {
    set({ wordType: type });
    console.log(`📚 [Store] 词包类型: ${type === 'core' ? '核心词' : '非核心词'}`);
  },
  
  /** 设置非核心词 P3 等待重试状态 */
  setP3WaitingForRetry: (waiting) => {
    set({ p3WaitingForRetry: waiting });
    console.log(`⏸️ [Store] P3 等待重试: ${waiting}`);
  },
  
  /** 教师触发 P3 重试（非核心词） */
  triggerP3Retry: () => {
    set((state) => ({
      p3WaitingForRetry: false,
      teacherState: {
        ...state.teacherState,
        command: 'retryP3NonCore',
      },
    }));
    console.log('🔄 [Store] 教师触发 P3 重试');
    
    // 清除命令
    setTimeout(() => {
      set((state) => ({
        teacherState: { ...state.teacherState, command: null },
      }));
    }, 500);
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
        p2WrongWords: [], // 清空错题列表
        p2IsRetryRound: false, // 重置为首轮
        p2RetryCount: 0, // 重置错题轮计数
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
  
  /** Phase 2: 添加错题 */
  addP2WrongWord: (wordId) => {
    set((state) => ({
      studentState: {
        ...state.studentState,
        p2WrongWords: state.studentState.p2WrongWords.includes(wordId) 
          ? state.studentState.p2WrongWords 
          : [...state.studentState.p2WrongWords, wordId],
      },
    }));
    console.log(`❌ [P2] 添加错题: ${wordId}`);
  },
  
  /** Phase 2: 移除错题（答对时调用） */
  removeP2WrongWord: (wordId) => {
    set((state) => ({
      studentState: {
        ...state.studentState,
        p2WrongWords: state.studentState.p2WrongWords.filter(id => id !== wordId),
      },
    }));
    console.log(`✅ [P2] 移除错题: ${wordId}`);
  },
  
  /** Phase 2: 开始错题重做轮 */
  startP2RetryRound: () => {
    set((state) => ({
      studentState: {
        ...state.studentState,
        p2WordIndex: 0,
        p2IsRetryRound: true,
        p2RetryCount: state.studentState.p2RetryCount + 1, // 递增计数器触发组件更新
        selectedOption: null,
        isSubmitted: false,
        isCorrect: null,
        inputText: '',
        attempts: 0,
      },
    }));
    console.log('🔄 [P2] 开始错题重做轮');
  },
  
  /** Phase 2: 清空错题并准备下一轮错题 */
  resetP2WrongWords: () => {
    set((state) => ({
      studentState: {
        ...state.studentState,
        p2WrongWords: [],
      },
    }));
  },
  
  /** Phase 2: 批量设置错题列表（本轮结束后调用） */
  setP2WrongWords: (wordIds) => {
    set((state) => ({
      studentState: {
        ...state.studentState,
        p2WrongWords: wordIds,
      },
    }));
    console.log(`📋 [P2] 设置错题列表: ${wordIds.length} 个`);
  },
  
  /** Phase 2: 获取当前需要做的单词列表（首轮=全部P2词，错题轮=错题列表） */
  getP2CurrentWords: () => {
    const { wordList, wordResults, studentState } = get();
    const allP2Words = wordList.filter(word => wordResults[word.id]?.needP2);
    
    if (studentState.p2IsRetryRound && studentState.p2WrongWords.length > 0) {
      // 错题轮：只返回错题
      return allP2Words.filter(word => studentState.p2WrongWords.includes(word.id));
    }
    // 首轮：返回所有 P2 单词
    return allP2Words;
  },
  
  /** Phase 3: 进入下一个单词 */
  nextP3Word: () => {
    set((state) => ({
      studentState: {
        ...state.studentState,
        p3WordIndex: state.studentState.p3WordIndex + 1,
        selectedOption: null,
        isSubmitted: false,
        isCorrect: null,
        inputText: '',
        attempts: 0,
      },
    }));
  },
  
  /** Phase 3: 设置完成状态 */
  setP3Completed: (completed) => {
    set((state) => ({
      studentState: {
        ...state.studentState,
        p3Completed: completed,
      },
    }));
  },
  
  /** Phase 3: 设置需要重新验收的单词（从 P3 失败返回 P2 后使用） */
  setP3RetryWords: (wordIds) => {
    set((state) => ({
      studentState: {
        ...state.studentState,
        p3RetryWords: wordIds,
      },
    }));
    console.log(`📋 [P3] 设置重新验收单词: ${wordIds.length} 个`);
  },
  
  /** Phase 3: 清空重新验收单词列表 */
  clearP3RetryWords: () => {
    set((state) => ({
      studentState: {
        ...state.studentState,
        p3RetryWords: [],
      },
    }));
  },
  
  // ========================================
  // Actions: P1.5 认读跟读
  // ========================================
  
  /**
   * 获取 P1.5 需要跟读的单词列表（只跟读 P1 错词）
   */
  getCurrentSightSoundWords: () => {
    const { wordList, wordResults } = get();
    // 只返回 P1 阶段做错的单词
    return wordList.filter(word => wordResults[word.id]?.p1Result === false);
  },
  
  /**
   * P1.5: 进入下一个跟读单词
   */
  nextSightSoundWord: () => {
    const state = get();
    const wordsToRead = get().getCurrentSightSoundWords();
    const currentWord = wordsToRead[state.sightSound.currentIndex];
    
    set((state) => ({
      sightSound: {
        ...state.sightSound,
        currentIndex: state.sightSound.currentIndex + 1,
        completedWords: currentWord 
          ? [...state.sightSound.completedWords, currentWord.id]
          : state.sightSound.completedWords,
      },
    }));
    
    console.log(`🎤 [P1.5] 跟读下一词，索引: ${state.sightSound.currentIndex + 1}`);
  },
  
  /**
   * P1.5: 完成跟读环节，进入 P2
   */
  completeSightSound: () => {
    const { wordFlow } = get();
    
    console.log(`✅ [P1.5] 跟读环节完成，进入 P2`);
    
    set((state) => ({
      sightSound: {
        ...state.sightSound,
        completed: true,
      },
      currentPhase: 'P2',
      completedPhases: [...state.completedPhases.filter(p => p !== 'P1.5'), 'P1.5'],
      studentState: {
        ...state.studentState,
        selectedOption: null,
        isSubmitted: false,
        isCorrect: null,
        inputText: '',
        p2Round: 1,
        p2WordIndex: 0,
        attempts: 0,
      },
    }));
  },
  
  /**
   * P1.5: 教师跳过跟读环节，直接进入 P2
   */
  skipSightSound: () => {
    console.log(`⏭️ [P1.5] 教师跳过跟读环节，直接进入 P2`);
    
    set((state) => ({
      sightSound: {
        ...state.sightSound,
        completed: true,
      },
      currentPhase: 'P2',
      completedPhases: [...state.completedPhases.filter(p => p !== 'P1.5'), 'P1.5'],
      studentState: {
        ...state.studentState,
        selectedOption: null,
        isSubmitted: false,
        isCorrect: null,
        inputText: '',
        p2Round: 1,
        p2WordIndex: 0,
        attempts: 0,
      },
    }));
  },
  
  // ========================================
  // Actions: 单词流转（新流程）
  // ========================================
  
  /**
   * 完成 P1 分流
   * 收集错词和对词，设置当前批次
   * @param {boolean} forceCorrectUntested - 是否将未测试的词标记为正确（教师跳过时为 true）
   */
  finalizeP1: (forceCorrectUntested = false) => {
    const { wordList, wordResults } = get();
    
    // 如果教师跳过，未测试的词标记为正确
    let updatedResults = { ...wordResults };
    if (forceCorrectUntested) {
      wordList.forEach(word => {
        if (updatedResults[word.id]?.p1Result === undefined) {
          updatedResults[word.id] = {
            ...updatedResults[word.id],
            p1Result: true,
            p1Skipped: true,
          };
        }
      });
    }
    
    // 收集错词和对词
    const wrongIds = wordList
      .filter(w => updatedResults[w.id]?.p1Result === false)
      .map(w => w.id);
      
    const correctIds = wordList
      .filter(w => updatedResults[w.id]?.p1Result === true || 
                   updatedResults[w.id]?.p1Result === undefined)
      .map(w => w.id);
    
    console.log(`📊 [Store] P1 分流完成 - 错词: ${wrongIds.length}, 对词: ${correctIds.length}`);
    
    // 更新状态
    const nextBatch = wrongIds.length > 0 ? 'wrong' : 'correct';
    
    // 如果有错词，先进入 P1.5 跟读环节；否则直接进入 P3（对词直接验收）
    const nextPhase = wrongIds.length > 0 ? 'P1.5' : 'P3';
    
    set((state) => ({
      wordResults: updatedResults,
      wordFlow: {
        ...state.wordFlow,
        p1WrongWordIds: wrongIds,
        p1CorrectWordIds: correctIds,
        currentBatch: nextBatch,
        currentGroupIndex: 0,
        p1Finalized: true,
        currentWordInGroupIndex: 0,
        currentGroupP2Round: 1,
      },
      // 重置 P1.5 状态
      sightSound: {
        currentIndex: 0,
        completedWords: [],
        completed: false,
      },
      currentPhase: nextPhase,
      completedPhases: [...state.completedPhases.filter(p => p !== 'P1'), 'P1'],
      studentState: {
        ...state.studentState,
        selectedOption: null,
        isSubmitted: false,
        isCorrect: null,
        inputText: '',
        p2Round: 1,
        p2WordIndex: 0,
        p3WordIndex: 0,
        attempts: 0,
      },
    }));
    
    console.log(`🎯 [Store] 进入 ${nextPhase}，处理批次: ${nextBatch}`);
  },
  
  /**
   * 获取当前组需要处理的单词列表
   */
  getCurrentGroupWords: () => {
    const { wordFlow, wordList } = get();
    const { currentBatch, currentGroupIndex, groupSize, p1WrongWordIds, p1CorrectWordIds } = wordFlow;
    
    if (!currentBatch) return [];
    
    // 获取当前批次的所有词 ID
    const batchIds = currentBatch === 'wrong' ? p1WrongWordIds : p1CorrectWordIds;
    
    // 对于错词批次，分组处理
    if (currentBatch === 'wrong') {
      const startIdx = currentGroupIndex * groupSize;
      const endIdx = startIdx + groupSize;
      const groupIds = batchIds.slice(startIdx, endIdx);
      return wordList.filter(w => groupIds.includes(w.id));
    }
    
    // 对于对词批次，全部一起过 P3
    return wordList.filter(w => batchIds.includes(w.id));
  },
  
  /**
   * 获取当前组信息
   */
  getCurrentGroupInfo: () => {
    const { wordFlow } = get();
    const { currentBatch, currentGroupIndex, groupSize, p1WrongWordIds, p1CorrectWordIds } = wordFlow;
    
    if (currentBatch === 'wrong') {
      const totalGroups = Math.ceil(p1WrongWordIds.length / groupSize);
      const startIdx = currentGroupIndex * groupSize;
      const endIdx = Math.min(startIdx + groupSize, p1WrongWordIds.length);
      const groupSize_actual = endIdx - startIdx;
      
      return {
        batch: 'wrong',
        groupIndex: currentGroupIndex,
        totalGroups,
        groupSize: groupSize_actual,
        totalWords: p1WrongWordIds.length,
        isLastGroup: currentGroupIndex >= totalGroups - 1,
      };
    } else if (currentBatch === 'correct') {
      return {
        batch: 'correct',
        groupIndex: 0,
        totalGroups: 1,
        groupSize: p1CorrectWordIds.length,
        totalWords: p1CorrectWordIds.length,
        isLastGroup: true,
      };
    }
    
    return null;
  },
  
  /**
   * 当前组 P3 完成后，推进到下一组或下一批次
   */
  advanceToNextGroup: () => {
    const { wordFlow } = get();
    const { currentBatch, currentGroupIndex, groupSize, p1WrongWordIds, p1CorrectWordIds } = wordFlow;
    
    console.log(`🔄 [Store] advanceToNextGroup - 当前批次: ${currentBatch}, 组索引: ${currentGroupIndex}`);
    
    if (currentBatch === 'wrong') {
      const totalGroups = Math.ceil(p1WrongWordIds.length / groupSize);
      
      if (currentGroupIndex + 1 < totalGroups) {
        // 还有下一组错词，从 P1.5 跟读开始
        console.log(`📦 [Store] 进入错词组 ${currentGroupIndex + 2}/${totalGroups}，从 P1.5 跟读开始`);
        set((state) => ({
          wordFlow: { 
            ...state.wordFlow, 
            currentGroupIndex: currentGroupIndex + 1,
            currentWordInGroupIndex: 0,
            currentGroupP2Round: 1,
          },
          currentPhase: 'P1.5',
          sightSound: {
            currentIndex: 0,
            completedWords: [],
            completed: false,
          },
          studentState: {
            ...state.studentState,
            selectedOption: null,
            isSubmitted: false,
            isCorrect: null,
            inputText: '',
            p2Round: 1,
            p2WordIndex: 0,
            p3WordIndex: 0,
            attempts: 0,
          },
        }));
      } else {
        // 所有错词组处理完，切换到对词批次
        if (p1CorrectWordIds.length > 0) {
          console.log(`✅ [Store] 错词组全部完成，进入对词 P3`);
          set((state) => ({
            wordFlow: { 
              ...state.wordFlow, 
              currentBatch: 'correct', 
              currentGroupIndex: 0,
              currentWordInGroupIndex: 0,
            },
            currentPhase: 'P3',
            studentState: {
              ...state.studentState,
              selectedOption: null,
              isSubmitted: false,
              isCorrect: null,
              inputText: '',
              p3WordIndex: 0,
              attempts: 0,
            },
          }));
        } else {
          // 没有对词，直接结束
          console.log(`🏁 [Store] 所有单词处理完成，进入 Summary`);
          set((state) => ({
            currentPhase: 'Summary',
            completedPhases: [...state.completedPhases.filter(p => p !== 'P3'), 'P3'],
          }));
        }
      }
    } else if (currentBatch === 'correct') {
      // 对词批次 P3 完成，结束
      console.log(`🏁 [Store] 对词 P3 完成，进入 Summary`);
      set((state) => ({
        currentPhase: 'Summary',
        completedPhases: [...state.completedPhases.filter(p => p !== 'P3'), 'P3'],
      }));
    }
  },
  
  /**
   * 当前组 P2 完成后，进入当前组的 P3
   */
  currentGroupP2Complete: () => {
    console.log(`✅ [Store] 当前组 P2 完成，进入 P3`);
    set((state) => ({
      currentPhase: 'P3',
      wordFlow: {
        ...state.wordFlow,
        currentWordInGroupIndex: 0,
      },
      studentState: {
        ...state.studentState,
        selectedOption: null,
        isSubmitted: false,
        isCorrect: null,
        inputText: '',
        p3WordIndex: 0,
        attempts: 0,
      },
    }));
  },
  
  /**
   * 更新当前组内的单词索引
   */
  setCurrentWordInGroupIndex: (index) => {
    set((state) => ({
      wordFlow: {
        ...state.wordFlow,
        currentWordInGroupIndex: index,
      },
    }));
  },
  
  /**
   * 更新当前组 P2 的轮次
   */
  setCurrentGroupP2Round: (round) => {
    set((state) => ({
      wordFlow: {
        ...state.wordFlow,
        currentGroupP2Round: round,
        currentWordInGroupIndex: 0,
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
      // 重置 UI 状态（每个步骤开始时）
      redBoxUI: {
        audioPlayed: false,
        showSyllables: false,
        showPhonetic: false,
        selectedWeapon: null,
        showAnswer: false,
      },
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
  
  /** 更新 Red Box UI 状态（教师控制） */
  updateRedBoxUI: (updates) => {
    set((state) => ({
      redBoxUI: {
        ...state.redBoxUI,
        ...updates,
      },
    }));
    console.log(`🔴 [Store] RedBox UI 更新:`, updates);
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
      // Red Box 步骤控制（3步：定音定形 -> 精准助记 -> L4验收）
      case 'nextStep':
        if (redBoxStep < 3) {
          set((state) => ({
            redBoxStep: state.redBoxStep + 1,
            // 重置 UI 状态
            redBoxUI: {
              audioPlayed: false,
              showSyllables: false,
              showPhonetic: false,
              selectedWeapon: null,
              showAnswer: false,
            },
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
          // Step 3 完成，进入下一个红词或新词学习
          if (currentRedWordIndex < redWords.length - 1) {
            // 还有下一个红词
            set((state) => ({
              currentRedWordIndex: state.currentRedWordIndex + 1,
              redBoxStep: 1,
              redBoxUI: {
                audioPlayed: false,
                showSyllables: false,
                showPhonetic: false,
                selectedWeapon: null,
                showAnswer: false,
              },
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
              redBoxUI: {
                audioPlayed: false,
                showSyllables: false,
                showPhonetic: false,
                selectedWeapon: null,
                showAnswer: false,
              },
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
            redBoxUI: {
              audioPlayed: false,
              showSyllables: false,
              showPhonetic: false,
              selectedWeapon: null,
              showAnswer: false,
            },
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
            redBoxUI: {
              audioPlayed: false,
              showSyllables: false,
              showPhonetic: false,
              selectedWeapon: null,
              showAnswer: false,
            },
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
            redBoxUI: {
              audioPlayed: false,
              showSyllables: false,
              showPhonetic: false,
              selectedWeapon: null,
              showAnswer: false,
            },
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
  
  /** 设置闪现阶段（教师控制，双端同步） */
  setFlashPhase: (phase) => {
    set((state) => ({
      teacherState: {
        ...state.teacherState,
        flashPhase: phase,
      },
    }));
    console.log(`⚡ [Store] 闪现阶段: ${phase}`);
  },
  
  // ========================================
  // Actions: 武器库弹窗
  // ========================================
  
  /** 打开武器库弹窗（教师端调用）
   * 重要：启动武器库 = 当前单词自动判定为"红灯"（失败）
   * - P2 阶段：该词进入 P2 错题池
   * - P3 阶段：该词进入 P3 失败池（之后需要回 P2 重学）
   */
  openWeaponPopup: (weaponId, word) => {
    const { currentPhase, studentState, wordResults } = get();
    
    set({
      weaponPopup: {
        isOpen: true,
        weaponId,
        word,
      },
    });
    
    // 如果有单词，根据当前阶段标记为红灯
    if (word?.id) {
      console.log(`🚨 [Store] 武器库启动 - 单词 "${word.word}" 自动判定为红灯 (当前阶段: ${currentPhase})`);
      
      if (currentPhase === 'P2') {
        // P2 阶段：标记 weaponUsed，让 P2Container 判定为错题
        const currentResult = get().wordResults[word.id] || {};
        set((state) => ({
          wordResults: {
            ...state.wordResults,
            [word.id]: {
              ...currentResult,
              weaponUsed: true, // 标记使用了武器库
            },
          },
        }));
        console.log(`❌ [P2] 武器库触发 - 单词 "${word.word}" 标记为红灯`);
      } else if (currentPhase === 'P3') {
        // P3 阶段：只标记 weaponUsed，让 P3Container 在 handleWordComplete 时处理
        // 注意：不要在这里修改 p3RetryWords，否则会导致 p3Words 列表立即变化
        const currentResult = wordResults[word.id] || {};
        set((state) => ({
          wordResults: {
            ...state.wordResults,
            [word.id]: {
              ...currentResult,
              weaponUsed: true, // 只标记使用了武器库
            },
          },
        }));
        console.log(`🛠️ [P3] 武器库触发 - 单词 "${word.word}" 标记为武器库使用`);
      }
    }
    
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
