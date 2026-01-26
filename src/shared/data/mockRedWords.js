/**
 * Mock 红词数据
 * 红词 = 历史遗留的错词（之前课程学过但没记住的词）
 * 
 * 在 Model B（攻坚复习课）中，这些红词会在 Red Box 阶段优先处理
 */

export const mockRedWords = [
  {
    id: 'red_1',
    word: 'efficient',
    status: 'red',
    lastError: '2024-01-20',
    errorCount: 3,
    // 六维数据
    sound: {
      ipa: '/ɪˈfɪʃnt/',
      syllables: 'ef · fi · cient',
      audioUrl: '/audio/efficient.mp3',
    },
    meaning: {
      partOfSpeech: 'adj.',
      definitionEn: 'working well without wasting time or resources',
      definitionCn: '高效的；有效率的',
    },
    context: [
      {
        sentence: 'She is an efficient worker who always meets deadlines.',
        sentenceCn: '她是一个高效的员工，总是能按时完成任务。',
        blankPosition: [3, 4],
      }
    ],
    logic: {
      mnemonic: 'e-ffi-cient：e像眼睛👁️，ffi像火苗🔥，cient像科学家 → 眼睛盯着火苗的科学家，工作很高效！',
      etymology: '来自拉丁语 efficere (完成)，ef- (出) + facere (做) = 做出成果',
      confusables: ['effective', 'sufficient'],
    },
    visual: {
      imageUrl: '/images/efficient.jpg',
      imageDescription: '一个高效工作的办公室场景',
    },
  },
  {
    id: 'red_2',
    word: 'necessary',
    status: 'red',
    lastError: '2024-01-18',
    errorCount: 4,
    sound: {
      ipa: '/ˈnesəseri/',
      syllables: 'nec · es · sa · ry',
      audioUrl: '/audio/necessary.mp3',
    },
    meaning: {
      partOfSpeech: 'adj.',
      definitionEn: 'needed in order to achieve a result',
      definitionCn: '必要的；必需的',
    },
    context: [
      {
        sentence: 'It is necessary to learn English for international communication.',
        sentenceCn: '为了国际交流，学习英语是必要的。',
        blankPosition: [2, 3],
      }
    ],
    logic: {
      mnemonic: 'ne-ces-sary：一件衬衫(one Collar)，两只袖子(two Sleeves) → 1C + 2S = necessary！',
      etymology: '来自拉丁语 necessarius，necesse (不可避免的)',
      confusables: ['necessarily', 'necessity'],
    },
    visual: {
      imageUrl: null, // 无图片
      imageDescription: null,
    },
  },
  {
    id: 'red_3',
    word: 'separate',
    status: 'red',
    lastError: '2024-01-15',
    errorCount: 2,
    sound: {
      ipa: '/ˈseprət/',
      syllables: 'sep · a · rate',
      audioUrl: '/audio/separate.mp3',
    },
    meaning: {
      partOfSpeech: 'v./adj.',
      definitionEn: 'to divide into parts; not joined or connected',
      definitionCn: '分开；分离的',
    },
    context: [
      {
        sentence: 'Please separate the white clothes from the colored ones.',
        sentenceCn: '请把白色衣服和彩色衣服分开。',
        blankPosition: [1, 2],
      }
    ],
    logic: {
      mnemonic: 'sep-a-rate：中间有个a，就像一堵墙把两边"分开"了！记住：separ-A-te，A在中间！',
      etymology: '来自拉丁语 separare，se- (分开) + parare (准备)',
      confusables: ['seperate (错误拼写)', 'desperate'],
    },
    visual: {
      imageUrl: '/images/separate.jpg',
      imageDescription: '两个分开的圆圈',
    },
  },
];

/**
 * 获取所有红词
 */
export const getAllRedWords = () => mockRedWords;

/**
 * 根据 ID 获取红词
 */
export const getRedWordById = (id) => mockRedWords.find(w => w.id === id);

/**
 * 获取红词数量
 */
export const getRedWordCount = () => mockRedWords.length;

/**
 * 检查是否有红词积压（触发 Model B 的条件）
 */
export const hasRedWordsBacklog = () => mockRedWords.length > 0;

export default mockRedWords;

