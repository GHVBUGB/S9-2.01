/**
 * Mock 完形填空数据 - Mode B 仿真完形填空
 * 数据来源：word.md (Mode B)
 * 用途：Phase 6 里程碑大考（同事负责的模块）
 * 更新时间：2026-01-26
 */

const mockClozeTest = {
  id: 'cloze-01',
  title: '野外生存',
  titleEn: 'Surviving in the Wild',
  description: '通过动物野外生存的故事，考察4个高频词的理解和应用',
  difficulty: 3, // 1-易, 2-中, 3-难
  wordCount: 105, // 文章总词数
  
  // 考察的目标词
  targetWords: ['environment', 'trouble', 'communicate', 'valuable'],
  
  // 文章文本（使用 [1], [2], [3], [4] 作为挖空占位符）
  text: `Animals live in a wild world. They must learn to change their habits to fit their new [1]. For example, when winter comes, it is hard to find food. If animals do not move or sleep, they might be in big [2].

Also, living together is important. Wolves use sounds to [3] with each other. This helps them hunt and stay safe. Helping each other is a [4] skill for survival.`,
  
  // 挖空题目配置
  blanks: [
    {
      index: 1,
      answer: 'environment',
      answerCn: '环境',
      partOfSpeech: 'n.',
      
      // 线索提示
      clue: '前文的 "wild world" 和后文的 "winter comes"',
      clueCn: '指生存环境',
      
      // 四个选项（1正确 + 1强干扰 + 2弱干扰）
      options: [
        {
          label: 'A',
          text: 'government',
          textCn: '政府',
          isCorrect: false,
          distractorType: 'weak', // weak: 弱干扰（词形相似但意义无关）
          reason: '词形相似但语义不符',
        },
        {
          label: 'B',
          text: 'retirement',
          textCn: '退休',
          isCorrect: false,
          distractorType: 'weak',
          reason: '词尾相似但意义无关',
        },
        {
          label: 'C',
          text: 'environment',
          textCn: '环境',
          isCorrect: true,
          distractorType: null,
          reason: '符合语境，指动物的生存环境',
        },
        {
          label: 'D',
          text: 'decision',
          textCn: '决定',
          isCorrect: false,
          distractorType: 'weak',
          reason: '意义不符',
        },
      ],
      
      // 解析
      explanation: '线索是前文的 "wild world" 和后文的 "winter comes"，指生存环境。',
      explanationEn: 'Clues: "wild world" and "winter comes" indicate living environment.',
    },
    
    {
      index: 2,
      answer: 'trouble',
      answerCn: '麻烦/困难',
      partOfSpeech: 'n.',
      
      clue: '找不到食物会导致困难',
      clueCn: '语境逻辑推理',
      
      options: [
        {
          label: 'A',
          text: 'double',
          textCn: '双倍',
          isCorrect: false,
          distractorType: 'weak',
          reason: '词形相似但意义无关',
        },
        {
          label: 'B',
          text: 'bubble',
          textCn: '泡泡',
          isCorrect: false,
          distractorType: 'weak',
          reason: '词形相似但意义无关',
        },
        {
          label: 'C',
          text: 'success',
          textCn: '成功',
          isCorrect: false,
          distractorType: 'strong', // strong: 强干扰（语义相反或易混淆）
          reason: '语义相反，找不到食物是困难而非成功',
        },
        {
          label: 'D',
          text: 'trouble',
          textCn: '麻烦',
          isCorrect: true,
          distractorType: null,
          reason: '找不到食物会陷入困境',
        },
      ],
      
      explanation: '语境逻辑推理：找不到食物会导致困难，而不是成功。',
      explanationEn: 'Context logic: not finding food leads to trouble, not success.',
    },
    
    {
      index: 3,
      answer: 'communicate',
      answerCn: '交流',
      partOfSpeech: 'v.',
      
      clue: '"use sounds" 声音是交流的媒介',
      clueCn: '核心线索',
      
      options: [
        {
          label: 'A',
          text: 'communicate',
          textCn: '交流',
          isCorrect: true,
          distractorType: null,
          reason: '用声音交流符合语境',
        },
        {
          label: 'B',
          text: 'celebrate',
          textCn: '庆祝',
          isCorrect: false,
          distractorType: 'weak',
          reason: '词形相似但意义不符',
        },
        {
          label: 'C',
          text: 'practice',
          textCn: '练习',
          isCorrect: false,
          distractorType: 'weak',
          reason: '意义不符合语境',
        },
        {
          label: 'D',
          text: 'invite',
          textCn: '邀请',
          isCorrect: false,
          distractorType: 'weak',
          reason: '意义不符合语境',
        },
      ],
      
      explanation: '核心线索是 "use sounds"，声音是交流的媒介。',
      explanationEn: 'Key clue: "use sounds" - sounds are for communication.',
    },
    
    {
      index: 4,
      answer: 'valuable',
      answerCn: '宝贵的',
      partOfSpeech: 'adj.',
      
      clue: '帮助彼此能 "stay safe"，这是有价值的技能',
      clueCn: '语境推理',
      
      options: [
        {
          label: 'A',
          text: 'nervous',
          textCn: '紧张的',
          isCorrect: false,
          distractorType: 'weak',
          reason: '形容词但意义不符',
        },
        {
          label: 'B',
          text: 'valuable',
          textCn: '宝贵的',
          isCorrect: true,
          distractorType: null,
          reason: '帮助生存是宝贵的技能',
        },
        {
          label: 'C',
          text: 'shy',
          textCn: '害羞的',
          isCorrect: false,
          distractorType: 'weak',
          reason: '形容词但意义不符',
        },
        {
          label: 'D',
          text: 'active',
          textCn: '活跃的',
          isCorrect: false,
          distractorType: 'weak',
          reason: '形容词但意义不够准确',
        },
      ],
      
      explanation: '帮助彼此能 "stay safe"，这显然是有价值 (valuable) 的技能。',
      explanationEn: 'Helping each other "stay safe" is clearly a valuable skill.',
    },
  ],
  
  // 教学配置
  pedagogy: {
    strategy: '1 正确 + 1 强干扰 + 2 弱干扰',
    firstSentenceRule: '首句不挖空（降低难度）',
    wordCountRange: [100, 120],
    difficulty: 'intermediate', // beginner, intermediate, advanced
  },
};

// 辅助函数：获取挖空题目
export const getBlankByIndex = (index) => {
  return mockClozeTest.blanks.find(blank => blank.index === index);
};

// 辅助函数：获取所有正确答案
export const getAllAnswers = () => {
  return mockClozeTest.blanks.map(blank => ({
    index: blank.index,
    answer: blank.answer,
    answerCn: blank.answerCn,
  }));
};

// 辅助函数：验证用户答案
export const checkAnswers = (userAnswers) => {
  // userAnswers: { 1: 'environment', 2: 'trouble', ... }
  const results = [];
  let correctCount = 0;
  
  mockClozeTest.blanks.forEach(blank => {
    const userAnswer = userAnswers[blank.index];
    const isCorrect = userAnswer === blank.answer;
    
    if (isCorrect) correctCount++;
    
    results.push({
      index: blank.index,
      userAnswer,
      correctAnswer: blank.answer,
      isCorrect,
      explanation: blank.explanation,
    });
  });
  
  return {
    results,
    score: correctCount,
    total: mockClozeTest.blanks.length,
    percentage: (correctCount / mockClozeTest.blanks.length * 100).toFixed(1),
  };
};

// 辅助函数：解析文本，返回分段文本（按挖空分割）
export const parseTextSegments = (text) => {
  const segments = [];
  const regex = /\[(\d+)\]/g;
  let lastIndex = 0;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    // 添加挖空前的文本
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        content: text.substring(lastIndex, match.index),
      });
    }
    
    // 添加挖空
    segments.push({
      type: 'blank',
      index: parseInt(match[1]),
      placeholder: `[${match[1]}]`,
    });
    
    lastIndex = match.index + match[0].length;
  }
  
  // 添加最后一段文本
  if (lastIndex < text.length) {
    segments.push({
      type: 'text',
      content: text.substring(lastIndex),
    });
  }
  
  return segments;
};

export default mockClozeTest;
