/**
 * Mock 故事数据 - Mode A 剧情式微阅读
 * 数据来源：word.md (Mode A)
 * 用途：Phase 5 AI个性化语境闭环（同事负责的模块）
 * 更新时间：2026-01-26
 */

const mockStories = [
  {
    id: 'story-01',
    theme: '社交篇',
    themeEn: 'Social Life',
    description: '通过一个新生Tom的社交故事，学习13个社交相关单词',
    targetWords: [
      'introduce', 'shy', 'polite', 'invite', 'accept', 
      'join', 'active', 'communicate', 'honest', 'trust', 
      'secret', 'realize', 'decision'
    ],
    wordCount: 13,
    difficulty: 2, // 1-易, 2-中, 3-难
    
    // 故事文本（目标词用 ** 包围标记）
    text: `Tom was a new student. He was too **shy** to **introduce** himself to the class. But Mary was very **polite**. She decided to **invite** Tom to lunch. Tom was happy to **accept**. He decided to **join** the conversation. They started to **communicate** about their hobbies. Tom **realized** that Mary was an **honest** girl. He could **trust** her with his **secret**. Finally, Tom made a **decision** to become an **active** member of the class.`,
    
    // 验证题（事实核查）
    question: {
      type: 'factual', // factual: 事实核查, inference: 推理题
      text: 'Who invited Tom to lunch?',
      textCn: '谁邀请Tom吃午饭？',
      options: [
        {
          label: 'A',
          text: 'Mary',
          textCn: 'Mary',
          isCorrect: true,
          explanation: '文中明确提到 "She decided to invite Tom to lunch"',
        },
        {
          label: 'B',
          text: 'A teacher',
          textCn: '一位老师',
          isCorrect: false,
          explanation: '文中没有提到老师',
        },
      ],
    },
    
    // 教学配置
    pedagogy: {
      scaffolding: '目标词加粗，句式简单（最多2个从句）',
      maxClauses: 2,
      targetWordStyle: 'bold', // bold: 加粗, highlight: 高亮, underline: 下划线
    },
  },
  
  {
    id: 'story-02',
    theme: '成长篇',
    themeEn: 'Growth & Sports',
    description: '通过Tom踢足球的成长故事，学习16个成长相关单词',
    targetWords: [
      'adapt', 'environment', 'nervous', 'challenge', 
      'practice', 'improve', 'skill', 'confident', 
      'success', 'celebrate', 'necessary', 'avoid', 
      'trouble', 'valuable', 'solution', 'suggest'
    ],
    wordCount: 16,
    difficulty: 3,
    
    text: `It takes time to **adapt** to a new **environment**. Before the soccer game, Tom felt **nervous**. It was a big **challenge**. The coach **suggested** that it was **necessary** to **practice** more. Tom tried hard to **improve** his **skill**. He wanted to **avoid** making **trouble** for the team. He found a **solution** to run faster. On the game day, he felt **confident**. The team achieved great **success**. It was a **valuable** victory, and they decided to **celebrate** together.`,
    
    question: {
      type: 'factual',
      text: 'How did Tom feel on the game day?',
      textCn: 'Tom在比赛当天感觉如何？',
      options: [
        {
          label: 'A',
          text: 'Nervous',
          textCn: '紧张',
          isCorrect: false,
          explanation: '文中提到比赛前(before the game)紧张，但比赛当天(on the game day)已经自信了',
        },
        {
          label: 'B',
          text: 'Confident',
          textCn: '自信',
          isCorrect: true,
          explanation: '文中明确提到 "On the game day, he felt confident"',
        },
      ],
    },
    
    pedagogy: {
      scaffolding: '目标词加粗，句式简单（最多2个从句）',
      maxClauses: 2,
      targetWordStyle: 'bold',
    },
  },
];

// 辅助函数：根据 ID 获取故事
export const getStoryById = (id) => {
  return mockStories.find(story => story.id === id);
};

// 辅助函数：根据难度获取故事
export const getStoriesByDifficulty = (difficulty) => {
  return mockStories.filter(story => story.difficulty === difficulty);
};

// 辅助函数：根据主题获取故事
export const getStoryByTheme = (theme) => {
  return mockStories.find(story => story.theme === theme || story.themeEn === theme);
};

// 辅助函数：获取所有故事包含的单词
export const getAllStoryWords = () => {
  const allWords = new Set();
  mockStories.forEach(story => {
    story.targetWords.forEach(word => allWords.add(word));
  });
  return Array.from(allWords);
};

// 辅助函数：解析故事文本，提取高亮单词的位置
export const parseStoryText = (text) => {
  const words = [];
  const regex = /\*\*(.*?)\*\*/g;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    words.push({
      word: match[1],
      start: match.index,
      end: match.index + match[0].length,
      cleanWord: match[1],
    });
  }
  
  return {
    plainText: text.replace(/\*\*/g, ''), // 移除标记的纯文本
    highlightedWords: words,
  };
};

export default mockStories;

