/**
 * Mock单词数据
 * 六维原子数据模型：Core / Sound / Meaning / Context / Logic / Visual
 */

/**
 * 单词数据结构定义
 * @typedef {Object} Word
 * @property {number} id - 单词ID
 * @property {string} word - 单词文本
 * @property {number} difficulty - 难度等级 (1-5)
 * @property {Object} core - Core维度：音节
 * @property {Object} sound - Sound维度：音标和音频
 * @property {Object} meaning - Meaning维度：释义
 * @property {Object[]} context - Context维度：语境例句
 * @property {Object} logic - Logic维度：助记和词源
 * @property {Object} visual - Visual维度：图片
 */

export const MOCK_WORDS = [
  {
    id: 1,
    word: 'adapt',
    difficulty: 3,
    
    // Core: 音节切分
    core: {
      syllables: 'a·dapt',
      syllableCount: 2,
      stress: 2  // 重音在第2个音节
    },
    
    // Sound: 音标和音频
    sound: {
      ipa: '/əˈdæpt/',
      audioUrl: '/audio/adapt.mp3',
      phonetic: 'uh-DAPT'
    },
    
    // Meaning: 释义
    meaning: {
      partOfSpeech: 'v.',
      definitionCn: '适应；调整',
      definitionEn: 'to change behavior or ideas to fit new situations',
      synonyms: ['adjust', 'modify', 'accommodate']
    },
    
    // Context: 语境例句（多个难度级别）
    context: [
      {
        id: 1,
        sentence: 'It takes time to adapt.',
        sentenceCn: '适应需要时间。',
        level: 1  // CEFR A1
      },
      {
        id: 2,
        sentence: 'Animals adapt to their environment.',
        sentenceCn: '动物适应它们的环境。',
        level: 2  // CEFR A2
      },
      {
        id: 3,
        sentence: 'We must adapt our strategy to the market.',
        sentenceCn: '我们必须调整策略以适应市场。',
        level: 3  // CEFR B1
      }
    ],
    
    // Logic: 助记和词源
    logic: {
      mnemonic: 'add力量 → adapt适应',
      etymology: '来自拉丁语 adaptare (to fit)',
      breakdown: 'ad-(to) + apt(fit) = 使适合'
    },
    
    // Visual: 图片
    visual: {
      imageUrl: '/images/adapt.jpg',
      imageAlt: '变色龙适应环境改变颜色'
    }
  },
  
  {
    id: 2,
    word: 'brave',
    difficulty: 2,
    
    core: {
      syllables: 'brave',
      syllableCount: 1,
      stress: 1
    },
    
    sound: {
      ipa: '/breɪv/',
      audioUrl: '/audio/brave.mp3',
      phonetic: 'BRAYV'
    },
    
    meaning: {
      partOfSpeech: 'adj.',
      definitionCn: '勇敢的',
      definitionEn: 'showing courage; not afraid',
      synonyms: ['courageous', 'fearless', 'bold']
    },
    
    context: [
      {
        id: 1,
        sentence: 'She is very brave.',
        sentenceCn: '她非常勇敢。',
        level: 1
      },
      {
        id: 2,
        sentence: 'The brave soldier saved many lives.',
        sentenceCn: '勇敢的士兵救了许多人的生命。',
        level: 2
      }
    ],
    
    logic: {
      mnemonic: 'brave勇敢 → 不怕危险',
      etymology: '来自意大利语 bravo (wild, brave)',
      breakdown: 'brave = 勇敢面对'
    },
    
    visual: {
      imageUrl: '/images/brave.jpg',
      imageAlt: '勇敢的消防员'
    }
  },
  
  {
    id: 3,
    word: 'create',
    difficulty: 2,
    
    core: {
      syllables: 'cre·ate',
      syllableCount: 2,
      stress: 2
    },
    
    sound: {
      ipa: '/kriˈeɪt/',
      audioUrl: '/audio/create.mp3',
      phonetic: 'kree-AYT'
    },
    
    meaning: {
      partOfSpeech: 'v.',
      definitionCn: '创造；创作',
      definitionEn: 'to make something new',
      synonyms: ['make', 'produce', 'build']
    },
    
    context: [
      {
        id: 1,
        sentence: 'Artists create beautiful paintings.',
        sentenceCn: '艺术家创作美丽的画作。',
        level: 2
      },
      {
        id: 2,
        sentence: 'We need to create a new plan.',
        sentenceCn: '我们需要制定一个新计划。',
        level: 2
      }
    ],
    
    logic: {
      mnemonic: 'create创造 → 从无到有',
      etymology: '来自拉丁语 creare (to make)',
      breakdown: 'cre-(grow) + ate(动词) = 创造'
    },
    
    visual: {
      imageUrl: '/images/create.jpg',
      imageAlt: '艺术家在创作'
    }
  },
  
  {
    id: 4,
    word: 'difficult',
    difficulty: 3,
    
    core: {
      syllables: 'dif·fi·cult',
      syllableCount: 3,
      stress: 1
    },
    
    sound: {
      ipa: '/ˈdɪfɪkəlt/',
      audioUrl: '/audio/difficult.mp3',
      phonetic: 'DIF-i-kult'
    },
    
    meaning: {
      partOfSpeech: 'adj.',
      definitionCn: '困难的；艰难的',
      definitionEn: 'hard to do or understand',
      synonyms: ['hard', 'challenging', 'tough']
    },
    
    context: [
      {
        id: 1,
        sentence: 'This question is difficult.',
        sentenceCn: '这个问题很难。',
        level: 1
      },
      {
        id: 2,
        sentence: 'Learning Chinese is difficult but rewarding.',
        sentenceCn: '学习中文很难但很有收获。',
        level: 3
      }
    ],
    
    logic: {
      mnemonic: 'difficult困难 → 不容易做',
      etymology: '来自拉丁语 difficilis (hard)',
      breakdown: 'dif-(not) + ficult(easy) = 不容易'
    },
    
    visual: {
      imageUrl: '/images/difficult.jpg',
      imageAlt: '攀登陡峭山峰'
    }
  },
  
  {
    id: 5,
    word: 'energy',
    difficulty: 2,
    
    core: {
      syllables: 'en·er·gy',
      syllableCount: 3,
      stress: 1
    },
    
    sound: {
      ipa: '/ˈenərdʒi/',
      audioUrl: '/audio/energy.mp3',
      phonetic: 'EN-er-jee'
    },
    
    meaning: {
      partOfSpeech: 'n.',
      definitionCn: '能量；精力',
      definitionEn: 'power or strength to do things',
      synonyms: ['power', 'strength', 'vigor']
    },
    
    context: [
      {
        id: 1,
        sentence: 'I have no energy today.',
        sentenceCn: '我今天没有精力。',
        level: 2
      },
      {
        id: 2,
        sentence: 'Solar energy is clean and renewable.',
        sentenceCn: '太阳能是清洁和可再生的。',
        level: 3
      }
    ],
    
    logic: {
      mnemonic: 'energy能量 → 做事的力量',
      etymology: '来自希腊语 energeia (activity)',
      breakdown: 'en-(in) + ergy(work) = 内在力量'
    },
    
    visual: {
      imageUrl: '/images/energy.jpg',
      imageAlt: '闪电能量'
    }
  },
  
  {
    id: 6,
    word: 'famous',
    difficulty: 2,
    
    core: {
      syllables: 'fa·mous',
      syllableCount: 2,
      stress: 1
    },
    
    sound: {
      ipa: '/ˈfeɪməs/',
      audioUrl: '/audio/famous.mp3',
      phonetic: 'FAY-muhs'
    },
    
    meaning: {
      partOfSpeech: 'adj.',
      definitionCn: '著名的；出名的',
      definitionEn: 'known by many people',
      synonyms: ['well-known', 'renowned', 'celebrated']
    },
    
    context: [
      {
        id: 1,
        sentence: 'He is a famous actor.',
        sentenceCn: '他是一位著名演员。',
        level: 1
      },
      {
        id: 2,
        sentence: 'Paris is famous for the Eiffel Tower.',
        sentenceCn: '巴黎以埃菲尔铁塔而闻名。',
        level: 2
      }
    ],
    
    logic: {
      mnemonic: 'famous出名 → 很多人知道',
      etymology: '来自拉丁语 fama (fame)',
      breakdown: 'fam(fame) + ous(形容词) = 有名的'
    },
    
    visual: {
      imageUrl: '/images/famous.jpg',
      imageAlt: '明星在红毯上'
    }
  },
  
  {
    id: 7,
    word: 'giant',
    difficulty: 2,
    
    core: {
      syllables: 'gi·ant',
      syllableCount: 2,
      stress: 1
    },
    
    sound: {
      ipa: '/ˈdʒaɪənt/',
      audioUrl: '/audio/giant.mp3',
      phonetic: 'JY-uhnt'
    },
    
    meaning: {
      partOfSpeech: 'n./adj.',
      definitionCn: '巨人；巨大的',
      definitionEn: 'very large person or thing',
      synonyms: ['huge', 'enormous', 'massive']
    },
    
    context: [
      {
        id: 1,
        sentence: 'The giant is very tall.',
        sentenceCn: '这个巨人非常高。',
        level: 1
      },
      {
        id: 2,
        sentence: 'We saw a giant panda at the zoo.',
        sentenceCn: '我们在动物园看到了一只大熊猫。',
        level: 2
      }
    ],
    
    logic: {
      mnemonic: 'giant巨人 → 非常大',
      etymology: '来自希腊语 gigas (giant)',
      breakdown: 'giant = 巨大的人或物'
    },
    
    visual: {
      imageUrl: '/images/giant.jpg',
      imageAlt: '巨大的建筑物'
    }
  },
  
  {
    id: 8,
    word: 'honest',
    difficulty: 3,
    
    core: {
      syllables: 'hon·est',
      syllableCount: 2,
      stress: 1
    },
    
    sound: {
      ipa: '/ˈɑnɪst/',
      audioUrl: '/audio/honest.mp3',
      phonetic: 'ON-ist'
    },
    
    meaning: {
      partOfSpeech: 'adj.',
      definitionCn: '诚实的；正直的',
      definitionEn: 'truthful and sincere',
      synonyms: ['truthful', 'sincere', 'genuine']
    },
    
    context: [
      {
        id: 1,
        sentence: 'She is an honest person.',
        sentenceCn: '她是一个诚实的人。',
        level: 2
      },
      {
        id: 2,
        sentence: 'To be honest, I don\'t know the answer.',
        sentenceCn: '说实话，我不知道答案。',
        level: 2
      }
    ],
    
    logic: {
      mnemonic: 'honest诚实 → 说真话',
      etymology: '来自拉丁语 honestus (honorable)',
      breakdown: 'honest = 值得尊敬的 = 诚实的'
    },
    
    visual: {
      imageUrl: '/images/honest.jpg',
      imageAlt: '握手表示诚信'
    }
  },
  
  {
    id: 9,
    word: 'imagine',
    difficulty: 3,
    
    core: {
      syllables: 'i·mag·ine',
      syllableCount: 3,
      stress: 2
    },
    
    sound: {
      ipa: '/ɪˈmædʒɪn/',
      audioUrl: '/audio/imagine.mp3',
      phonetic: 'i-MAJ-in'
    },
    
    meaning: {
      partOfSpeech: 'v.',
      definitionCn: '想象；设想',
      definitionEn: 'to form a picture in your mind',
      synonyms: ['picture', 'envision', 'conceive']
    },
    
    context: [
      {
        id: 1,
        sentence: 'Imagine a world without war.',
        sentenceCn: '想象一个没有战争的世界。',
        level: 2
      },
      {
        id: 2,
        sentence: 'Can you imagine living on Mars?',
        sentenceCn: '你能想象住在火星上吗？',
        level: 3
      }
    ],
    
    logic: {
      mnemonic: 'imagine想象 → 心中有画面',
      etymology: '来自拉丁语 imaginari (to picture)',
      breakdown: 'imag(image) + ine(动词) = 在脑中成像'
    },
    
    visual: {
      imageUrl: '/images/imagine.jpg',
      imageAlt: '孩子在做梦想象'
    }
  },
  
  {
    id: 10,
    word: 'journey',
    difficulty: 2,
    
    core: {
      syllables: 'jour·ney',
      syllableCount: 2,
      stress: 1
    },
    
    sound: {
      ipa: '/ˈdʒɜrni/',
      audioUrl: '/audio/journey.mp3',
      phonetic: 'JUR-nee'
    },
    
    meaning: {
      partOfSpeech: 'n.',
      definitionCn: '旅程；旅行',
      definitionEn: 'a trip from one place to another',
      synonyms: ['trip', 'voyage', 'expedition']
    },
    
    context: [
      {
        id: 1,
        sentence: 'We went on a long journey.',
        sentenceCn: '我们进行了一次长途旅行。',
        level: 2
      },
      {
        id: 2,
        sentence: 'Life is a journey, not a destination.',
        sentenceCn: '生活是一段旅程，而不是目的地。',
        level: 3
      }
    ],
    
    logic: {
      mnemonic: 'journey旅程 → 一天的路程',
      etymology: '来自法语 journée (day\'s travel)',
      breakdown: 'journ(day) + ey(名词) = 一天的旅程'
    },
    
    visual: {
      imageUrl: '/images/journey.jpg',
      imageAlt: '公路旅行'
    }
  },
  
  {
    id: 11,
    word: 'knowledge',
    difficulty: 4,
    
    core: {
      syllables: 'knowl·edge',
      syllableCount: 2,
      stress: 1
    },
    
    sound: {
      ipa: '/ˈnɑlɪdʒ/',
      audioUrl: '/audio/knowledge.mp3',
      phonetic: 'NOL-ij'
    },
    
    meaning: {
      partOfSpeech: 'n.',
      definitionCn: '知识；学问',
      definitionEn: 'information and understanding',
      synonyms: ['information', 'learning', 'wisdom']
    },
    
    context: [
      {
        id: 1,
        sentence: 'Knowledge is power.',
        sentenceCn: '知识就是力量。',
        level: 2
      },
      {
        id: 2,
        sentence: 'She has great knowledge of history.',
        sentenceCn: '她对历史有很深的了解。',
        level: 3
      }
    ],
    
    logic: {
      mnemonic: 'knowledge知识 → 知道的东西',
      etymology: '来自古英语 cnāwan (to know)',
      breakdown: 'know(知道) + ledge(名词) = 所知道的'
    },
    
    visual: {
      imageUrl: '/images/knowledge.jpg',
      imageAlt: '书籍和学习'
    }
  },
  
  {
    id: 12,
    word: 'lucky',
    difficulty: 1,
    
    core: {
      syllables: 'luck·y',
      syllableCount: 2,
      stress: 1
    },
    
    sound: {
      ipa: '/ˈlʌki/',
      audioUrl: '/audio/lucky.mp3',
      phonetic: 'LUK-ee'
    },
    
    meaning: {
      partOfSpeech: 'adj.',
      definitionCn: '幸运的',
      definitionEn: 'having good fortune',
      synonyms: ['fortunate', 'blessed', 'favored']
    },
    
    context: [
      {
        id: 1,
        sentence: 'You are so lucky!',
        sentenceCn: '你太幸运了！',
        level: 1
      },
      {
        id: 2,
        sentence: 'I was lucky to find my keys.',
        sentenceCn: '我很幸运找到了我的钥匙。',
        level: 2
      }
    ],
    
    logic: {
      mnemonic: 'lucky幸运 → 运气好',
      etymology: '来自中古荷兰语 luc (happiness)',
      breakdown: 'luck(运气) + y(形容词) = 有运气的'
    },
    
    visual: {
      imageUrl: '/images/lucky.jpg',
      imageAlt: '四叶草'
    }
  },
  
  {
    id: 13,
    word: 'modern',
    difficulty: 3,
    
    core: {
      syllables: 'mod·ern',
      syllableCount: 2,
      stress: 1
    },
    
    sound: {
      ipa: '/ˈmɑdərn/',
      audioUrl: '/audio/modern.mp3',
      phonetic: 'MOD-ern'
    },
    
    meaning: {
      partOfSpeech: 'adj.',
      definitionCn: '现代的；当代的',
      definitionEn: 'of the present or recent time',
      synonyms: ['contemporary', 'current', 'recent']
    },
    
    context: [
      {
        id: 1,
        sentence: 'This is a modern building.',
        sentenceCn: '这是一栋现代建筑。',
        level: 2
      },
      {
        id: 2,
        sentence: 'Modern technology has changed our lives.',
        sentenceCn: '现代科技改变了我们的生活。',
        level: 3
      }
    ],
    
    logic: {
      mnemonic: 'modern现代 → 时髦的',
      etymology: '来自拉丁语 modernus (of today)',
      breakdown: 'mod(mode) + ern(形容词) = 时尚的'
    },
    
    visual: {
      imageUrl: '/images/modern.jpg',
      imageAlt: '现代化城市'
    }
  },
  
  {
    id: 14,
    word: 'nature',
    difficulty: 2,
    
    core: {
      syllables: 'na·ture',
      syllableCount: 2,
      stress: 1
    },
    
    sound: {
      ipa: '/ˈneɪtʃər/',
      audioUrl: '/audio/nature.mp3',
      phonetic: 'NAY-chur'
    },
    
    meaning: {
      partOfSpeech: 'n.',
      definitionCn: '自然；大自然',
      definitionEn: 'the physical world including plants and animals',
      synonyms: ['environment', 'wilderness', 'outdoors']
    },
    
    context: [
      {
        id: 1,
        sentence: 'I love nature.',
        sentenceCn: '我热爱大自然。',
        level: 1
      },
      {
        id: 2,
        sentence: 'We should protect nature and wildlife.',
        sentenceCn: '我们应该保护自然和野生动物。',
        level: 2
      }
    ],
    
    logic: {
      mnemonic: 'nature自然 → 天生的',
      etymology: '来自拉丁语 natura (birth, nature)',
      breakdown: 'nat(born) + ure(名词) = 天生的东西'
    },
    
    visual: {
      imageUrl: '/images/nature.jpg',
      imageAlt: '美丽的自然风景'
    }
  },
  
  {
    id: 15,
    word: 'perfect',
    difficulty: 3,
    
    core: {
      syllables: 'per·fect',
      syllableCount: 2,
      stress: 1
    },
    
    sound: {
      ipa: '/ˈpɜrfɪkt/',
      audioUrl: '/audio/perfect.mp3',
      phonetic: 'PUR-fikt'
    },
    
    meaning: {
      partOfSpeech: 'adj.',
      definitionCn: '完美的；完全的',
      definitionEn: 'having no mistakes or flaws',
      synonyms: ['flawless', 'ideal', 'excellent']
    },
    
    context: [
      {
        id: 1,
        sentence: 'Nobody is perfect.',
        sentenceCn: '没有人是完美的。',
        level: 2
      },
      {
        id: 2,
        sentence: 'It\'s a perfect day for a picnic.',
        sentenceCn: '这是野餐的完美日子。',
        level: 2
      }
    ],
    
    logic: {
      mnemonic: 'perfect完美 → 完全做好',
      etymology: '来自拉丁语 perfectus (completed)',
      breakdown: 'per-(completely) + fect(made) = 完全做好的'
    },
    
    visual: {
      imageUrl: '/images/perfect.jpg',
      imageAlt: '完美的钻石'
    }
  }
];

/**
 * 根据ID获取单词
 */
export const getWordById = (id) => {
  return MOCK_WORDS.find(word => word.id === id);
};

/**
 * 根据难度获取单词列表
 */
export const getWordsByDifficulty = (difficulty) => {
  return MOCK_WORDS.filter(word => word.difficulty === difficulty);
};

/**
 * 随机获取指定数量的单词
 */
export const getRandomWords = (count = 10) => {
  const shuffled = [...MOCK_WORDS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

