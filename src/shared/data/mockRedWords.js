/**
 * Mock 红词数据
 * 红词 = 历史遗留的错词（之前课程学过但没记住的词）
 * 
 * 在 Model B（攻坚复习课）中，这些红词会在 Red Box 阶段优先处理
 * 
 * 数据字段参考 word.md
 */

export const mockRedWords = [
  {
    id: 'V2-001',
    word: 'adapt',
    status: 'red',
    lastError: '2024-01-20',
    errorCount: 3,
    // 六维数据
    sound: {
      ipa: '/əˈdæpt/',
      syllables: 'a·dapt',
      audioUrl: '/audio/adapt.mp3',
    },
    meaning: {
      partOfSpeech: 'v.',
      definitionEn: 'To change your way to fit a new place.',
      definitionCn: '(使)适应',
    },
    context: [
      {
        sentence: 'It takes time to adapt to a new school.',
        sentenceCn: '适应新学校需要时间。',
        blankPosition: [4, 5],
      }
    ],
    logic: {
      mnemonic: 'A大嘴巴是适应，O圆嘴巴是收养。',
      etymology: 'ad(to)+apt(fit)',
      confusables: ['adopt', 'adept', 'depth'],
    },
    visual: {
      imageUrl: '/picture/adapt.png',
      imageDescription: 'A chameleon changing color on a green leaf.',
    },
    phrase: {
      en: 'adapt to new changes',
      cn: '适应新的变化',
    },
  },
  {
    id: 'V2-002',
    word: 'environment',
    status: 'red',
    lastError: '2024-01-18',
    errorCount: 4,
    sound: {
      ipa: '/ɪnˈvaɪrənmənt/',
      syllables: 'en·vi·ron·ment',
      audioUrl: '/audio/environment.mp3',
    },
    meaning: {
      partOfSpeech: 'n.',
      definitionEn: 'The place where people and animals live.',
      definitionCn: '环境',
    },
    context: [
      {
        sentence: 'We must plant trees to save the environment.',
        sentenceCn: '我们必须种树来拯救环境。',
        blankPosition: [7, 8],
      }
    ],
    logic: {
      mnemonic: 'en(进)+vi(六)+ron(人)→六人进豪门的环境。',
      etymology: 'environ(surround)+ment',
      confusables: ['government', 'requirement', 'retirement'],
    },
    visual: {
      imageUrl: '/picture/environment.png',
      imageDescription: 'Hands holding a small green earth.',
    },
    phrase: {
      en: 'protect the environment',
      cn: '保护环境',
    },
  },
  {
    id: 'V2-012',
    word: 'challenge',
    status: 'red',
    lastError: '2024-01-15',
    errorCount: 2,
    sound: {
      ipa: '/ˈtʃælɪndʒ/',
      syllables: 'chal·lenge',
      audioUrl: '/audio/challenge.mp3',
    },
    meaning: {
      partOfSpeech: 'n.',
      definitionEn: 'A new and difficult job to do.',
      definitionCn: '挑战',
    },
    context: [
      {
        sentence: 'Climbing that high mountain is a big challenge.',
        sentenceCn: '爬那座高山是个大挑战。',
        blankPosition: [7, 8],
      }
    ],
    logic: {
      mnemonic: 'cha(茶)+ll(两)+enge(天使)→天使喝茶比赛。',
      etymology: 'chall(accusation)+enge',
      confusables: ['change', 'channel', 'orange'],
    },
    visual: {
      imageUrl: '/picture/challenge.png',
      imageDescription: 'A climber reaching for a rock ledge.',
    },
    phrase: {
      en: 'face a challenge',
      cn: '面临挑战',
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
