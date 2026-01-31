/**
 * Mock 单词数据 - 30个单词完整数据
 * 数据来源：word.md
 * 更新时间：2026-01-26
 */

const mockWords = [
  {
    id: 1,
    word_id: 'V2-001',
    word: 'adapt',
    core: {
      syllables: 'a·dapt',
      syllableCount: 2,
      stress: 2,
      partOfSpeech: 'v.',
      isMonosyllabic: false,
    },
    sound: {
      phonetic: '/əˈdæpt/',
      audioUrl: '/audio/adapt.mp3',
    },
    meaning: {
      chinese: '(使)适应',
      english: 'To change your way to fit a new place.',
      synonyms: ['adjust', 'modify', 'accommodate'],
    },
    context: [
      {
        phrase: 'adapt to new changes',
        phraseCn: '适应新的变化',
        sentence: 'It takes time to adapt to a new school.',
        sentenceCn: '适应新学校需要时间。',
        difficulty: 3,
      }
    ],
    logic: {
      mnemonic: 'A大嘴巴是适应，O圆嘴巴是收养。',
      etymology: 'ad(to)+apt(fit)',
      memoryTips: ['adapt 有 a，像张开嘴适应', 'adopt 有 o，像圆圆的怀抱收养'],
    },
    visual: {
      imageUrl: '/images/adapt.jpg',
      description: 'A chameleon changing color on a green leaf.',
    },
    // Phase 2 训练专用数据
    training: {
      distractors: ['adopt', 'adept', 'depth'], // 听音辨形干扰项
      flashMeanings: ['收养', '熟练的'], // 闪视辨析干扰项（自动加正确释义）
    },
  },
  {
    id: 2,
    word_id: 'V2-002',
    word: 'environment',
    core: {
      syllables: 'en·vi·ron·ment',
      syllableCount: 4,
      stress: 2,
      partOfSpeech: 'n.',
      isMonosyllabic: false,
    },
    sound: {
      phonetic: '/ɪnˈvaɪrənmənt/',
      audioUrl: '/audio/environment.mp3',
    },
    meaning: {
      chinese: '环境',
      english: 'The place where people and animals live.',
      synonyms: ['surroundings', 'habitat', 'setting'],
    },
    context: [
      {
        phrase: 'protect the environment',
        phraseCn: '保护环境',
        sentence: 'We must plant trees to save the environment.',
        sentenceCn: '我们必须种树来拯救环境。',
        difficulty: 3,
      }
    ],
    logic: {
      mnemonic: 'en(进)+vi(六)+ron(人)→六人进豪门的环境。',
      etymology: 'environ(surround)+ment',
      memoryTips: ['environment 很长，就像环境包围着我们'],
    },
    visual: {
      imageUrl: '/images/environment.jpg',
      description: 'Hands holding a small green earth.',
    },
    training: {
      distractors: ['government', 'requirement', 'retirement'],
      flashMeanings: ['政府', '要求'],
    },
  },
  {
    id: 3,
    word_id: 'V2-003',
    word: 'nervous',
    core: {
      syllables: 'ner·vous',
      syllableCount: 2,
      stress: 1,
      partOfSpeech: 'adj.',
      isMonosyllabic: false,
    },
    sound: {
      phonetic: '/ˈnɜːrvəs/',
      audioUrl: '/audio/nervous.mp3',
    },
    meaning: {
      chinese: '紧张的',
      english: 'Feeling worried or afraid.',
      synonyms: ['anxious', 'worried', 'tense'],
    },
    context: [
      {
        phrase: 'feel nervous',
        phraseCn: '感到紧张',
        sentence: 'He felt nervous before the big exam.',
        sentenceCn: '在大考前他感到很紧张。',
        difficulty: 2,
      }
    ],
    logic: {
      mnemonic: 'ner(哪儿)+vo(喔)+us(我们)→在哪都紧张。',
      etymology: 'nerv(nerve)+ous',
      memoryTips: ['nervous 有 nerve（神经），神经紧张'],
    },
    visual: {
      imageUrl: '/images/nervous.jpg',
      description: 'A student sweating while looking at a clock.',
    },
    training: {
      distractors: ['service', 'purpose', 'surface'],
      flashMeanings: ['服务', '目的'],
    },
  },
  {
    id: 4,
    word_id: 'V2-004',
    word: 'introduce',
    core: {
      syllables: 'in·tro·duce',
      syllableCount: 3,
      stress: 3,
      partOfSpeech: 'v.',
      isMonosyllabic: false,
    },
    sound: {
      phonetic: '/ˌɪntrəˈdjuːs/',
      audioUrl: '/audio/introduce.mp3',
    },
    meaning: {
      chinese: '介绍',
      english: 'To tell someone another person\'s name.',
      synonyms: ['present', 'acquaint'],
    },
    context: [
      {
        phrase: 'introduce myself',
        phraseCn: '自我介绍',
        sentence: 'Let me introduce myself to the class.',
        sentenceCn: '让我向全班做个自我介绍。',
        difficulty: 2,
      }
    ],
    logic: {
      mnemonic: 'in(里)+tro(去肉)+duce(肚子)→肚里有货要介绍。',
      etymology: 'intro(inward)+duce(lead)',
      memoryTips: ['introduce = intro(引入) + duce(导致)'],
    },
    visual: {
      imageUrl: '/images/introduce.jpg',
      description: 'Two students shaking hands with name tags.',
    },
    training: {
      distractors: ['produce', 'reduce', 'induce'],
      flashMeanings: ['生产', '减少'],
    },
  },
  {
    id: 5,
    word_id: 'V2-005',
    word: 'shy',
    core: {
      syllables: 'shy',
      syllableCount: 1,
      stress: 1,
      partOfSpeech: 'adj.',
      isMonosyllabic: true,
    },
    sound: {
      phonetic: '/ʃaɪ/',
      audioUrl: '/audio/shy.mp3',
    },
    meaning: {
      chinese: '害羞的',
      english: 'Not finding it easy to talk to people.',
      synonyms: ['timid', 'bashful'],
    },
    context: [
      {
        phrase: 'a shy smile',
        phraseCn: '害羞的微笑',
        sentence: 'She is too shy to speak to strangers.',
        sentenceCn: '她太害羞了，不敢和陌生人说话。',
        difficulty: 2,
      }
    ],
    logic: {
      mnemonic: 'sh(谁)+y(呀)→是谁呀？不好意思说。',
      etymology: '古英语sceoh(frightened)',
      memoryTips: ['shy 只有3个字母，像害羞的人说话很少'],
    },
    visual: {
      imageUrl: '/images/shy.jpg',
      description: 'A girl hiding her face behind a book.',
    },
    training: {
      distractors: ['shine', 'high', 'sky'],
      flashMeanings: ['发光', '高的'],
    },
  },
  {
    id: 6,
    word_id: 'V2-006',
    word: 'active',
    core: {
      syllables: 'ac·tive',
      syllableCount: 2,
      stress: 1,
      partOfSpeech: 'adj.',
      isMonosyllabic: false,
    },
    sound: {
      phonetic: '/ˈæktɪv/',
      audioUrl: '/audio/active.mp3',
    },
    meaning: {
      chinese: '活跃的',
      english: 'Moving around a lot; not sitting still.',
      synonyms: ['energetic', 'lively'],
    },
    context: [
      {
        phrase: 'take an active part in',
        phraseCn: '积极参加',
        sentence: 'He is an active boy who loves sports.',
        sentenceCn: '他是个热爱运动的活跃男孩。',
        difficulty: 2,
      }
    ],
    logic: {
      mnemonic: 'ac(一)+ti(踢)+ve(五)→踢五次球很活跃。',
      etymology: 'act(do)+ive',
      memoryTips: ['active = act(行动) + ive，爱行动就活跃'],
    },
    visual: {
      imageUrl: '/images/active.jpg',
      description: 'Kids running and jumping in P.E. class.',
    },
    training: {
      distractors: ['actor', 'action', 'actual'],
      flashMeanings: ['演员', '行动'],
    },
  },
  {
    id: 7,
    word_id: 'V2-007',
    word: 'join',
    core: {
      syllables: 'join',
      syllableCount: 1,
      stress: 1,
      partOfSpeech: 'v.',
      isMonosyllabic: true,
    },
    sound: {
      phonetic: '/dʒɔɪn/',
      audioUrl: '/audio/join.mp3',
    },
    meaning: {
      chinese: '参加；加入',
      english: 'To become a member of a group.',
      synonyms: ['participate', 'enter'],
    },
    context: [
      {
        phrase: 'join the club',
        phraseCn: '加入俱乐部',
        sentence: 'I want to join the art club to draw pictures.',
        sentenceCn: '我想加入美术社团去画画。',
        difficulty: 2,
      }
    ],
    logic: {
      mnemonic: 'j(姐)+o(圈)+in(进)→姐姐进圈加入。',
      etymology: 'Latin jungere(connect)',
      memoryTips: ['join 像连接两个东西'],
    },
    visual: {
      imageUrl: '/images/join.jpg',
      description: 'A puzzle piece fitting into a group.',
    },
    training: {
      distractors: ['joy', 'coin', 'drawing'],
      flashMeanings: ['快乐', '硬币'],
    },
  },
  {
    id: 8,
    word_id: 'V2-008',
    word: 'practice',
    core: {
      syllables: 'prac·tice',
      syllableCount: 2,
      stress: 1,
      partOfSpeech: 'v.',
      isMonosyllabic: false,
    },
    sound: {
      phonetic: '/ˈpræktɪs/',
      audioUrl: '/audio/practice.mp3',
    },
    meaning: {
      chinese: '练习',
      english: 'To do something many times to get better.',
      synonyms: ['rehearse', 'drill', 'exercise'],
    },
    context: [
      {
        phrase: 'practice makes perfect',
        phraseCn: '熟能生巧',
        sentence: 'If you want to win, you must practice every day.',
        sentenceCn: '如果你想赢，必须每天练习。',
        difficulty: 2,
      }
    ],
    logic: {
      mnemonic: 'pr(仆人)+act(动)+ice(冰)→仆人在冰上练。',
      etymology: 'pract(do)+ice',
      memoryTips: ['practice 要反复做(pract)'],
    },
    visual: {
      imageUrl: '/images/practice.jpg',
      description: 'A girl playing violin with musical notes.',
    },
    training: {
      distractors: ['practical', 'plastic', 'promise'],
      flashMeanings: ['实用的', '塑料'],
    },
  },
  {
    id: 9,
    word_id: 'V2-009',
    word: 'improve',
    core: {
      syllables: 'im·prove',
      syllableCount: 2,
      stress: 2,
      partOfSpeech: 'v.',
      isMonosyllabic: false,
    },
    sound: {
      phonetic: '/ɪmˈpruːv/',
      audioUrl: '/audio/improve.mp3',
    },
    meaning: {
      chinese: '改善；提高',
      english: 'To make something better.',
      synonyms: ['enhance', 'better', 'upgrade'],
    },
    context: [
      {
        phrase: 'improve skills',
        phraseCn: '提高技能',
        sentence: 'Reading books can improve your writing.',
        sentenceCn: '读书能提高你的写作水平。',
        difficulty: 3,
      }
    ],
    logic: {
      mnemonic: 'im(我是)+p(胖)+ro(肉)+ve(五)→改善体型。',
      etymology: 'im(in)+prove(good)',
      memoryTips: ['improve = im(进入) + prove(证明)，证明变好了'],
    },
    visual: {
      imageUrl: '/images/improve.jpg',
      description: 'A chart arrow going up showing growth.',
    },
    training: {
      distractors: ['prove', 'move', 'approve'],
      flashMeanings: ['证明', '移动'],
    },
  },
  {
    id: 10,
    word_id: 'V2-010',
    word: 'skill',
    core: {
      syllables: 'skill',
      syllableCount: 1,
      stress: 1,
      partOfSpeech: 'n.',
      isMonosyllabic: true,
    },
    sound: {
      phonetic: '/skɪl/',
      audioUrl: '/audio/skill.mp3',
    },
    meaning: {
      chinese: '技能',
      english: 'Something you can do well.',
      synonyms: ['ability', 'talent'],
    },
    context: [
      {
        phrase: 'communication skill',
        phraseCn: '沟通技巧',
        sentence: 'Cooking is a useful life skill.',
        sentenceCn: '烹饪是一项有用的生活技能。',
        difficulty: 2,
      }
    ],
    logic: {
      mnemonic: 's(死)+kill(杀)→练成绝杀技能。',
      etymology: 'Norse skil(distinction)',
      memoryTips: ['skill = s + kill，像超级杀手的技能'],
    },
    visual: {
      imageUrl: '/images/skill.jpg',
      description: 'A toolbox with hammer and wrench.',
    },
    training: {
      distractors: ['kill', 'skull', 'still'],
      flashMeanings: ['杀死', '头骨'],
    },
  },
  {
    id: 11,
    word_id: 'V2-011',
    word: 'confident',
    core: {
      syllables: 'con·fi·dent',
      syllableCount: 3,
      stress: 1,
      partOfSpeech: 'adj.',
      isMonosyllabic: false,
    },
    sound: {
      phonetic: '/ˈkɒnfɪdənt/',
      audioUrl: '/audio/confident.mp3',
    },
    meaning: {
      chinese: '自信的',
      english: 'Believing in yourself.',
      synonyms: ['self-assured', 'certain'],
    },
    context: [
      {
        phrase: 'be confident about',
        phraseCn: '对...有信心',
        sentence: 'She is confident that she will pass the test.',
        sentenceCn: '她很自信能通过考试。',
        difficulty: 3,
      }
    ],
    logic: {
      mnemonic: 'con(全)+fi(飞)+dent(等)→自信飞起。',
      etymology: 'con(fully)+fid(trust)',
      memoryTips: ['confident = con(完全) + fide(相信)，完全相信自己'],
    },
    visual: {
      imageUrl: '/images/confident.jpg',
      description: 'A superhero standing on a cliff with cape.',
    },
    training: {
      distractors: ['conference', 'context', 'conflict'],
      flashMeanings: ['会议', '背景'],
    },
  },
  {
    id: 12,
    word_id: 'V2-012',
    word: 'challenge',
    core: {
      syllables: 'chal·lenge',
      syllableCount: 2,
      stress: 1,
      partOfSpeech: 'n.',
      isMonosyllabic: false,
    },
    sound: {
      phonetic: '/ˈtʃælɪndʒ/',
      audioUrl: '/audio/challenge.mp3',
    },
    meaning: {
      chinese: '挑战',
      english: 'A new and difficult job to do.',
      synonyms: ['test', 'trial'],
    },
    context: [
      {
        phrase: 'face a challenge',
        phraseCn: '面临挑战',
        sentence: 'Climbing that high mountain is a big challenge.',
        sentenceCn: '爬那座高山是个大挑战。',
        difficulty: 3,
      }
    ],
    logic: {
      mnemonic: 'cha(茶)+ll(两)+enge(天使)→天使喝茶比赛。',
      etymology: 'chall(accusation)+enge',
      memoryTips: ['challenge 挑战很难(chall)'],
    },
    visual: {
      imageUrl: '/images/challenge.jpg',
      description: 'A climber reaching for a rock ledge.',
    },
    training: {
      distractors: ['change', 'channel', 'orange'],
      flashMeanings: ['改变', '频道'],
    },
  },
  {
    id: 13,
    word_id: 'V2-013',
    word: 'solution',
    core: {
      syllables: 'so·lu·tion',
      syllableCount: 3,
      stress: 2,
      partOfSpeech: 'n.',
      isMonosyllabic: false,
    },
    sound: {
      phonetic: '/səˈluːʃn/',
      audioUrl: '/audio/solution.mp3',
    },
    meaning: {
      chinese: '解决办法',
      english: 'The answer to a problem.',
      synonyms: ['answer', 'resolution'],
    },
    context: [
      {
        phrase: 'find a solution',
        phraseCn: '找到解决办法',
        sentence: 'Do you have a solution to this math problem?',
        sentenceCn: '你有这道数学题的解法吗？',
        difficulty: 3,
      }
    ],
    logic: {
      mnemonic: 'so(搜)+lu(路)+tion(神)→搜路神找办法。',
      etymology: 'solv(loosen)+ution',
      memoryTips: ['solution = solve(解决) + tion'],
    },
    visual: {
      imageUrl: '/images/solution.jpg',
      description: 'A key unlocking a maze puzzle.',
    },
    training: {
      distractors: ['pollution', 'resolution', 'evolution'],
      flashMeanings: ['污染', '决心'],
    },
  },
  {
    id: 14,
    word_id: 'V2-014',
    word: 'suggest',
    core: {
      syllables: 'sug·gest',
      syllableCount: 2,
      stress: 2,
      partOfSpeech: 'v.',
      isMonosyllabic: false,
    },
    sound: {
      phonetic: '/səˈdʒest/',
      audioUrl: '/audio/suggest.mp3',
    },
    meaning: {
      chinese: '建议',
      english: 'To give someone an idea.',
      synonyms: ['recommend', 'propose'],
    },
    context: [
      {
        phrase: 'suggest doing sth.',
        phraseCn: '建议做某事',
        sentence: 'I suggest going to the park for a picnic.',
        sentenceCn: '我建议去公园野餐。',
        difficulty: 2,
      }
    ],
    logic: {
      mnemonic: 'sug(傻)+ge(哥)+st(石头)→傻哥摸石头提建议。',
      etymology: 'sug(under)+gest(carry)',
      memoryTips: ['suggest 给出(gest)建议'],
    },
    visual: {
      imageUrl: '/images/suggest.jpg',
      description: 'A lightbulb appearing over a head.',
    },
    training: {
      distractors: ['digest', 'subject', 'success'],
      flashMeanings: ['消化', '主题'],
    },
  },
  {
    id: 15,
    word_id: 'V2-015',
    word: 'accept',
    core: {
      syllables: 'ac·cept',
      syllableCount: 2,
      stress: 2,
      partOfSpeech: 'v.',
      isMonosyllabic: false,
    },
    sound: {
      phonetic: '/əkˈsept/',
      audioUrl: '/audio/accept.mp3',
    },
    meaning: {
      chinese: '接受',
      english: 'To say "yes" to something offered.',
      synonyms: ['receive', 'take'],
    },
    context: [
      {
        phrase: 'accept a gift',
        phraseCn: '接受礼物',
        sentence: 'He was happy to accept the birthday gift.',
        sentenceCn: '他很高兴地接受了生日礼物。',
        difficulty: 2,
      }
    ],
    logic: {
      mnemonic: 'ac(一)+ce(厕)+pt(普通)→普通厕所也能接受。',
      etymology: 'ac(to)+cept(take)',
      memoryTips: ['accept = ac(向) + cept(拿)，向自己拿来就是接受'],
    },
    visual: {
      imageUrl: '/images/accept.jpg',
      description: 'Hands receiving a gift box.',
    },
    training: {
      distractors: ['expect', 'except', 'aspect'],
      flashMeanings: ['期待', '除了'],
    },
  },
  {
    id: 16,
    word_id: 'V2-016',
    word: 'refuse',
    core: {
      syllables: 're·fuse',
      syllableCount: 2,
      stress: 2,
      partOfSpeech: 'v.',
      isMonosyllabic: false,
    },
    sound: {
      phonetic: '/rɪˈfjuːz/',
      audioUrl: '/audio/refuse.mp3',
    },
    meaning: {
      chinese: '拒绝',
      english: 'To say "no" to something.',
      synonyms: ['reject', 'decline'],
    },
    context: [
      {
        phrase: 'refuse to do',
        phraseCn: '拒绝做...',
        sentence: 'She refused to eat food she didn\'t like.',
        sentenceCn: '她拒绝吃她不喜欢的食物。',
        difficulty: 2,
      }
    ],
    logic: {
      mnemonic: 're(阿姨)+fu(服)+se(色)→拒绝这颜色。',
      etymology: 're(back)+fuse(pour)',
      memoryTips: ['refuse = re(回) + fuse(倒)，倒回去就是拒绝'],
    },
    visual: {
      imageUrl: '/images/refuse.jpg',
      description: 'A hand showing a STOP sign to food.',
    },
    training: {
      distractors: ['confuse', 'diffuse', 'rescue'],
      flashMeanings: ['使困惑', '扩散'],
    },
  },
  {
    id: 17,
    word_id: 'V2-017',
    word: 'polite',
    core: {
      syllables: 'po·lite',
      syllableCount: 2,
      stress: 2,
      partOfSpeech: 'adj.',
      isMonosyllabic: false,
    },
    sound: {
      phonetic: '/pəˈlaɪt/',
      audioUrl: '/audio/polite.mp3',
    },
    meaning: {
      chinese: '有礼貌的',
      english: 'Saying "please" and "thank you".',
      synonyms: ['courteous', 'respectful'],
    },
    context: [
      {
        phrase: 'be polite to',
        phraseCn: '对...有礼貌',
        sentence: 'It is polite to open the door for others.',
        sentenceCn: '为他人开门是有礼貌的。',
        difficulty: 2,
      }
    ],
    logic: {
      mnemonic: 'po(婆)+li(立)+te(特)→婆婆站得特礼貌。',
      etymology: 'poli(polish)+ite',
      memoryTips: ['polite = poli(光滑) + te，像打磨过一样礼貌'],
    },
    visual: {
      imageUrl: '/images/polite.jpg',
      description: 'A boy bowing to an old lady.',
    },
    training: {
      distractors: ['pilot', 'police', 'light'],
      flashMeanings: ['飞行员', '警察'],
    },
  },
  {
    id: 18,
    word_id: 'V2-018',
    word: 'communicate',
    core: {
      syllables: 'com·mu·ni·cate',
      syllableCount: 4,
      stress: 2,
      partOfSpeech: 'v.',
      isMonosyllabic: false,
    },
    sound: {
      phonetic: '/kəˈmjuːnɪkeɪt/',
      audioUrl: '/audio/communicate.mp3',
    },
    meaning: {
      chinese: '交流',
      english: 'To share ideas with others.',
      synonyms: ['talk', 'converse'],
    },
    context: [
      {
        phrase: 'communicate with',
        phraseCn: '与...交流',
        sentence: 'We use language to communicate with people.',
        sentenceCn: '我们用语言和人交流。',
        difficulty: 3,
      }
    ],
    logic: {
      mnemonic: 'com(来)+mu(木)+ni(你)+cate(猫)→木头猫交流。',
      etymology: 'commun(common)+icate',
      memoryTips: ['communicate = commun(共同) + icate，共同分享就是交流'],
    },
    visual: {
      imageUrl: '/images/communicate.jpg',
      description: 'Speech bubbles overlapping.',
    },
    training: {
      distractors: ['community', 'computer', 'commute'],
      flashMeanings: ['社区', '电脑'],
    },
  },
  {
    id: 19,
    word_id: 'V2-019',
    word: 'honest',
    core: {
      syllables: 'hon·est',
      syllableCount: 2,
      stress: 1,
      partOfSpeech: 'adj.',
      isMonosyllabic: false,
    },
    sound: {
      phonetic: '/ˈɒnɪst/',
      audioUrl: '/audio/honest.mp3',
    },
    meaning: {
      chinese: '诚实的',
      english: 'Telling the truth; not lying.',
      synonyms: ['truthful', 'sincere'],
    },
    context: [
      {
        phrase: 'an honest boy',
        phraseCn: '一个诚实的男孩',
        sentence: 'To be honest, I broke the window.',
        sentenceCn: '老实说，窗户是我打破的。',
        difficulty: 2,
      }
    ],
    logic: {
      mnemonic: 'h(不发)+one(一)+st(石头)→像石头一样实诚。',
      etymology: 'hon(honor)+est',
      memoryTips: ['honest 的 h 不发音，像诚实的人不说废话'],
    },
    visual: {
      imageUrl: '/images/honest.jpg',
      description: 'Pinocchio with a short normal nose.',
    },
    training: {
      distractors: ['harvest', 'forest', 'honor'],
      flashMeanings: ['收获', '森林'],
    },
  },
  {
    id: 20,
    word_id: 'V2-020',
    word: 'trust',
    core: {
      syllables: 'trust',
      syllableCount: 1,
      stress: 1,
      partOfSpeech: 'v.',
      isMonosyllabic: true,
    },
    sound: {
      phonetic: '/trʌst/',
      audioUrl: '/audio/trust.mp3',
    },
    meaning: {
      chinese: '信任',
      english: 'To believe that someone is good.',
      synonyms: ['believe', 'rely on'],
    },
    context: [
      {
        phrase: 'trust each other',
        phraseCn: '互相信任',
        sentence: 'You can trust him; he never tells lies.',
        sentenceCn: '你可以信任他，他从不撒谎。',
        difficulty: 2,
      }
    ],
    logic: {
      mnemonic: 'tr(突然)+u(你)+st(石头)→变成石头也信你。',
      etymology: 'Norse traust(strong)',
      memoryTips: ['trust 听起来很坚定，像信任一样坚定'],
    },
    visual: {
      imageUrl: '/images/trust.jpg',
      description: 'Target falling back, catcher ready.',
    },
    training: {
      distractors: ['rust', 'dust', 'truth'],
      flashMeanings: ['生锈', '灰尘'],
    },
  },
  {
    id: 21,
    word_id: 'V2-021',
    word: 'secret',
    core: {
      syllables: 'se·cret',
      syllableCount: 2,
      stress: 1,
      partOfSpeech: 'n.',
      isMonosyllabic: false,
    },
    sound: {
      phonetic: '/ˈsiːkrət/',
      audioUrl: '/audio/secret.mp3',
    },
    meaning: {
      chinese: '秘密',
      english: 'Something you must not tell others.',
      synonyms: ['mystery', 'confidential'],
    },
    context: [
      {
        phrase: 'keep a secret',
        phraseCn: '保守秘密',
        sentence: 'Don\'t tell anyone; it is a secret.',
        sentenceCn: '别告诉任何人，这是个秘密。',
        difficulty: 2,
      }
    ],
    logic: {
      mnemonic: 'se(色)+cr(超人)+et(外星人)→超人的秘密。',
      etymology: 'se(apart)+cret(sift)',
      memoryTips: ['secret = se(分开) + cret，分开不让人知道'],
    },
    visual: {
      imageUrl: '/images/secret.jpg',
      description: 'Finger on lips shushing.',
    },
    training: {
      distractors: ['sacred', 'cigarette', 'ticket'],
      flashMeanings: ['神圣的', '香烟'],
    },
  },
  {
    id: 22,
    word_id: 'V2-022',
    word: 'realize',
    core: {
      syllables: 're·al·ize',
      syllableCount: 3,
      stress: 1,
      partOfSpeech: 'v.',
      isMonosyllabic: false,
    },
    sound: {
      phonetic: '/ˈriːəlaɪz/',
      audioUrl: '/audio/realize.mp3',
    },
    meaning: {
      chinese: '意识到',
      english: 'To understand something suddenly.',
      synonyms: ['understand', 'recognize'],
    },
    context: [
      {
        phrase: 'realize the dream',
        phraseCn: '实现梦想',
        sentence: 'I didn\'t realize I lost my keys until I got home.',
        sentenceCn: '直到到家我才意识到钥匙丢了。',
        difficulty: 3,
      }
    ],
    logic: {
      mnemonic: 'real(真)+ize(化)→变真或看清真相。',
      etymology: 'real(real)+ize(make)',
      memoryTips: ['realize = real(真实) + ize，看到真实就是意识到'],
    },
    visual: {
      imageUrl: '/images/realize.jpg',
      description: 'Thought bubble with an exclamation mark.',
    },
    training: {
      distractors: ['really', 'rely', 'release'],
      flashMeanings: ['真正地', '依赖'],
    },
  },
  {
    id: 23,
    word_id: 'V2-023',
    word: 'valuable',
    core: {
      syllables: 'val·u·a·ble',
      syllableCount: 4,
      stress: 1,
      partOfSpeech: 'adj.',
      isMonosyllabic: false,
    },
    sound: {
      phonetic: '/ˈvæljuəbl/',
      audioUrl: '/audio/valuable.mp3',
    },
    meaning: {
      chinese: '宝贵的',
      english: 'Very useful or worth a lot of money.',
      synonyms: ['precious', 'priceless'],
    },
    context: [
      {
        phrase: 'valuable advice',
        phraseCn: '宝贵的建议',
        sentence: 'Time is more valuable than money.',
        sentenceCn: '时间比金钱更宝贵。',
        difficulty: 3,
      }
    ],
    logic: {
      mnemonic: 'val(价值)+u(油)+able(能)→油能值钱。',
      etymology: 'val(strong)+uable',
      memoryTips: ['valuable = value(价值) + able，有价值的'],
    },
    visual: {
      imageUrl: '/images/valuable.jpg',
      description: 'Treasure chest with gold.',
    },
    training: {
      distractors: ['value', 'available', 'variable'],
      flashMeanings: ['价值', '可用的'],
    },
  },
  {
    id: 24,
    word_id: 'V2-024',
    word: 'invite',
    core: {
      syllables: 'in·vite',
      syllableCount: 2,
      stress: 2,
      partOfSpeech: 'v.',
      isMonosyllabic: false,
    },
    sound: {
      phonetic: '/ɪnˈvaɪt/',
      audioUrl: '/audio/invite.mp3',
    },
    meaning: {
      chinese: '邀请',
      english: 'To ask someone to come to a party.',
      synonyms: ['ask', 'welcome'],
    },
    context: [
      {
        phrase: 'invite sb. to',
        phraseCn: '邀请某人去...',
        sentence: 'Did you invite Tom to your birthday party?',
        sentenceCn: '你邀请Tom来你的生日派对了没？',
        difficulty: 2,
      }
    ],
    logic: {
      mnemonic: 'in(里)+vi(六)+te(特)→六个特工邀请你。',
      etymology: 'in(to)+vite(wish)',
      memoryTips: ['invite = in(进) + vite(请)，请进来就是邀请'],
    },
    visual: {
      imageUrl: '/images/invite.jpg',
      description: 'An open invitation card.',
    },
    training: {
      distractors: ['invent', 'invest', 'sight'],
      flashMeanings: ['发明', '投资'],
    },
  },
  {
    id: 25,
    word_id: 'V2-025',
    word: 'celebrate',
    core: {
      syllables: 'cel·e·brate',
      syllableCount: 3,
      stress: 1,
      partOfSpeech: 'v.',
      isMonosyllabic: false,
    },
    sound: {
      phonetic: '/ˈselɪbreɪt/',
      audioUrl: '/audio/celebrate.mp3',
    },
    meaning: {
      chinese: '庆祝',
      english: 'To have a party for a special day.',
      synonyms: ['commemorate', 'observe'],
    },
    context: [
      {
        phrase: 'celebrate the victory',
        phraseCn: '庆祝胜利',
        sentence: 'We will celebrate New Year with fireworks.',
        sentenceCn: '我们要用烟花庆祝新年。',
        difficulty: 2,
      }
    ],
    logic: {
      mnemonic: 'ce(测)+le(了)+br(不如)+ate(吃)→不如吃顿庆祝。',
      etymology: 'celebr(frequent)+ate',
      memoryTips: ['celebrate = celebr(著名) + ate，让它著名就是庆祝'],
    },
    visual: {
      imageUrl: '/images/celebrate.jpg',
      description: 'Cake with candles and confetti.',
    },
    training: {
      distractors: ['separate', 'calibrate', 'celebrity'],
      flashMeanings: ['分开', '校准'],
    },
  },
  {
    id: 26,
    word_id: 'V2-026',
    word: 'decision',
    core: {
      syllables: 'de·ci·sion',
      syllableCount: 3,
      stress: 2,
      partOfSpeech: 'n.',
      isMonosyllabic: false,
    },
    sound: {
      phonetic: '/dɪˈsɪʒn/',
      audioUrl: '/audio/decision.mp3',
    },
    meaning: {
      chinese: '决定',
      english: 'A choice that you make.',
      synonyms: ['choice', 'resolution'],
    },
    context: [
      {
        phrase: 'make a decision',
        phraseCn: '做决定',
        sentence: 'It is a hard decision to choose between the two.',
        sentenceCn: '在两者间选择是个艰难的决定。',
        difficulty: 3,
      }
    ],
    logic: {
      mnemonic: 'de(弟)+ci(刺)+sion(婶)→刺婶婶做决定。',
      etymology: 'de(off)+cis(cut)',
      memoryTips: ['decision = de(断) + cision(切)，切断犹豫就是决定'],
    },
    visual: {
      imageUrl: '/images/decision.jpg',
      description: 'Fork in the road with arrows.',
    },
    training: {
      distractors: ['discussion', 'division', 'precision'],
      flashMeanings: ['讨论', '分开'],
    },
  },
  {
    id: 27,
    word_id: 'V2-027',
    word: 'necessary',
    core: {
      syllables: 'nec·es·sar·y',
      syllableCount: 4,
      stress: 1,
      partOfSpeech: 'adj.',
      isMonosyllabic: false,
    },
    sound: {
      phonetic: '/ˈnesəsəri/',
      audioUrl: '/audio/necessary.mp3',
    },
    meaning: {
      chinese: '必要的',
      english: 'That you must have or do.',
      synonyms: ['essential', 'required'],
    },
    context: [
      {
        phrase: 'it is necessary to do',
        phraseCn: '做...是必要的',
        sentence: 'Water is necessary for life.',
        sentenceCn: '水对生命是必要的。',
        difficulty: 3,
      }
    ],
    logic: {
      mnemonic: 'ne(那)+ce(厕)+ss(两美)+ary(安瑞)→必须去那厕所。',
      etymology: 'ne(not)+cess(go away)',
      memoryTips: ['necessary = ne(不) + cess(走)，不能走开就是必要的'],
    },
    visual: {
      imageUrl: '/images/necessary.jpg',
      description: 'Checklist with all green checks.',
    },
    training: {
      distractors: ['access', 'secretary', 'anniversary'],
      flashMeanings: ['接近', '秘书'],
    },
  },
  {
    id: 28,
    word_id: 'V2-028',
    word: 'avoid',
    core: {
      syllables: 'a·void',
      syllableCount: 2,
      stress: 2,
      partOfSpeech: 'v.',
      isMonosyllabic: false,
    },
    sound: {
      phonetic: '/əˈvɔɪd/',
      audioUrl: '/audio/avoid.mp3',
    },
    meaning: {
      chinese: '避免',
      english: 'To stay away from something.',
      synonyms: ['prevent', 'shun'],
    },
    context: [
      {
        phrase: 'avoid doing sth.',
        phraseCn: '避免做某事',
        sentence: 'You should avoid eating too much candy.',
        sentenceCn: '你应该避免吃太多糖果。',
        difficulty: 2,
      }
    ],
    logic: {
      mnemonic: 'a(一)+voi(窝)+d(弟)→避免见一窝弟弟。',
      etymology: 'a(away)+void(empty)',
      memoryTips: ['avoid = a(远离) + void(空)，远离就是避免'],
    },
    visual: {
      imageUrl: '/images/avoid.jpg',
      description: 'Dodging a flying ball.',
    },
    training: {
      distractors: ['award', 'afford', 'void'],
      flashMeanings: ['奖励', '负担得起'],
    },
  },
  {
    id: 29,
    word_id: 'V2-029',
    word: 'trouble',
    core: {
      syllables: 'trou·ble',
      syllableCount: 2,
      stress: 1,
      partOfSpeech: 'n.',
      isMonosyllabic: false,
    },
    sound: {
      phonetic: '/ˈtrʌbl/',
      audioUrl: '/audio/trouble.mp3',
    },
    meaning: {
      chinese: '麻烦',
      english: 'Problems or difficulties.',
      synonyms: ['problem', 'difficulty'],
    },
    context: [
      {
        phrase: 'be in trouble',
        phraseCn: '处于麻烦中',
        sentence: 'Don\'t cause trouble in the classroom.',
        sentenceCn: '别在教室里惹麻烦。',
        difficulty: 2,
      }
    ],
    logic: {
      mnemonic: 'tr(突)+ou(偶)+ble(伯)→遇伯伯真麻烦。',
      etymology: 'turb(crowd)+le',
      memoryTips: ['trouble = troub(混乱) + le，混乱就是麻烦'],
    },
    visual: {
      imageUrl: '/images/trouble.jpg',
      description: 'Tangled messy knot.',
    },
    training: {
      distractors: ['double', 'travel', 'bubble'],
      flashMeanings: ['双倍的', '旅行'],
    },
  },
  {
    id: 30,
    word_id: 'V2-030',
    word: 'success',
    core: {
      syllables: 'suc·cess',
      syllableCount: 2,
      stress: 2,
      partOfSpeech: 'n.',
      isMonosyllabic: false,
    },
    sound: {
      phonetic: '/səkˈses/',
      audioUrl: '/audio/success.mp3',
    },
    meaning: {
      chinese: '成功',
      english: 'Getting what you wanted.',
      synonyms: ['achievement', 'victory'],
    },
    context: [
      {
        phrase: 'achieve success',
        phraseCn: '获得成功',
        sentence: 'Hard work is the key to success.',
        sentenceCn: '努力是成功的关键。',
        difficulty: 3,
      }
    ],
    logic: {
      mnemonic: 'suc(一直)+cess(走)→一直走就成功。',
      etymology: 'suc(sub)+cess(go)',
      memoryTips: ['success = suc(继续) + cess(进行)，继续就成功'],
    },
    visual: {
      imageUrl: '/images/success.jpg',
      description: 'Person on podium holding trophy.',
    },
    training: {
      distractors: ['process', 'access', 'excess'],
      flashMeanings: ['过程', '接近'],
    },
  },
];

// 辅助函数：根据 ID 获取单词
export const getWordById = (id) => {
  return mockWords.find(word => word.id === id);
};

// 辅助函数：根据 word_id 获取单词
export const getWordByWordId = (wordId) => {
  return mockWords.find(word => word.word_id === wordId);
};

// 辅助函数：获取随机单词
export const getRandomWords = (count = 5) => {
  const shuffled = [...mockWords].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// 辅助函数：根据难度获取单词
export const getWordsByDifficulty = (difficulty) => {
  return mockWords.filter(word => 
    word.context[0]?.difficulty === difficulty
  );
};

// 辅助函数：获取单音节词
export const getMonosyllabicWords = () => {
  return mockWords.filter(word => word.core.isMonosyllabic);
};

// 辅助函数：获取多音节词
export const getPolysyllabicWords = () => {
  return mockWords.filter(word => !word.core.isMonosyllabic);
};

export default mockWords;
