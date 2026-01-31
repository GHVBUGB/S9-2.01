/**
 * Jarvis 话术数据
 * RedBox 阶段各步骤的辅助话术
 */

export const jarvisScripts = {
  // ========================================
  // Step 1: 定音定形
  // ========================================
  step1: {
    adapt: {
      playAudio: {
        title: '播放发音',
        content: '听好了，重音在后头！别读平了，要有"弹跳感"。',
        action: '引导学生跟读2-3遍，注意重音位置。'
      },
      showSyllables: {
        title: '显示音节',
        content: '像切水果一样切开：a-dapt。注意结尾 pt，像轻轻吐口水。',
        action: '让学生按音节慢读，建立音形对应。'
      },
      showPhonetic: {
        title: '显示音标',
        content: '盯着这个蝴蝶音 /æ/，嘴巴张大，像要吃个大汉堡！',
        action: '示范 /æ/ 发音，让学生模仿。'
      }
    },
    environment: {
      playAudio: {
        title: '播放发音',
        content: '这是一个"大长腿"单词，中间的 n 很容易躲猫猫，别漏读！',
        action: '强调中间的 ron 音节，避免漏读 n。'
      },
      showSyllables: {
        title: '显示音节',
        content: '拆成四节：en-vi-ron-ment。像爬楼梯一样，一阶一阶念清楚。',
        action: '让学生逐节读，最后连起来。'
      },
      showPhonetic: {
        title: '显示音标',
        content: '重点锁定 /aɪ/，发音像"爱"，爱护环境的"爱"。',
        action: '用"爱护环境"帮助记忆 /aɪ/ 发音。'
      }
    },
    challenge: {
      playAudio: {
        title: '播放发音',
        content: '听到了吗？开头要脆，结尾要像踩刹车一样停在 /dʒ/ 上。',
        action: '让学生注意开头的爆破音和结尾的塞擦音。'
      },
      showSyllables: {
        title: '显示音节',
        content: '中间藏了两根"棍子" ll，少写一根这挑战就输了哦。',
        action: '强调 ll 双写，这是拼写易错点。'
      },
      showPhonetic: {
        title: '显示音标',
        content: '结尾的 /dʒ/ 震动声带，像手机震动那种感觉。',
        action: '让学生把手放喉咙感受震动。'
      }
    }
  },

  // ========================================
  // Step 2: 精准助记
  // ========================================
  step2: {
    adapt: {
      context: {
        title: '语境武器',
        content: '想象一下你刚转学，谁都不认识的尴尬... 没错，你需要 adapt！',
        action: '让学生描述自己适应新环境的经历。'
      },
      visual: {
        title: '口诀武器',
        content: '来，看中间的字母：A 像不像张着大嘴巴？大嘴巴吃四方，到哪都能"适应"！如果是 O，那是张圆了嘴等人喂，那是"收养"。大嘴适应，圆嘴收养，别搞混！',
        action: '让学生重复口诀，加深记忆。'
      },
      compare: {
        title: '对比武器',
        content: '这里有三个"高仿号"！记住咱们的核心A：中间是 A (大嘴) 才是适应；如果是 O (圆嘴) 就是收养 (adopt)；如果是 E (Expert) 就是专家 (adept)。至于 depth (深度)，那是深不见底的 p，长相差远啦！',
        action: '让学生对比三个词，找出字母差异。'
      },
      image: {
        title: '图片武器',
        content: '看这只变色龙，它能根据环境改变颜色，这就是 adapt 的最佳代言人！',
        action: '让学生描述图片，建立视觉记忆。'
      }
    },
    environment: {
      context: {
        title: '语境武器',
        content: '地球都要流浪了！快种树！这就是在保护我们的 environment。',
        action: '聊聊环保话题，让单词有情感联结。'
      },
      visual: {
        title: '口诀武器',
        content: '咱们拆开看：en是进，vi是罗马数字6，ron谐音"人"。脑补一下：六个人进了豪门别墅，那"环境"肯定差不了！这么一拆，拼写是不是顺手多了？',
        action: '让学生边说口诀边写单词。'
      },
      compare: {
        title: '对比武器',
        content: '这一堆词屁股后面都挂着 -ment，像政府(government)、要求(requirement)。别被马甲骗了，看头不看尾！只有 En(进)+vi(六) 开头的，才是咱们的"环境"。认头不认尾，绝对不踩雷！',
        action: '让学生说出其他 -ment 结尾的词。'
      },
      image: {
        title: '图片武器',
        content: '双手捧着小小的地球，我们都是环境的守护者！',
        action: '让学生描述图片，感受环保责任。'
      }
    },
    challenge: {
      context: {
        title: '语境武器',
        content: '看着那座陡峭的山峰，腿软了吗？这就叫 big challenge！',
        action: '让学生分享自己面临的挑战。'
      },
      visual: {
        title: '口诀武器',
        content: '这个脑洞绝了：cha是茶，ll是两，enge长得像Angel天使。想象一下：天使喝两杯茶都要搞个比赛？这也太卷了，确实是个大"挑战"啊！',
        action: '让学生边说口诀边空写单词。'
      },
      compare: {
        title: '对比武器',
        content: '最容易混的是 change (改变)。你瞧，Challenge 比它多了 ll (两条腿)。想"改变"很容易，但要"挑战"？你得迈开 ll (两条腿) 拼命跑才行！至于 channel (频道) 和 orange (橘子)，一个是水渠一个是吃的，别饿晕了眼选错咯！',
        action: '让学生对比 change 和 challenge。'
      },
      image: {
        title: '图片武器',
        content: '攀岩者正在挑战悬崖，每一步都是 challenge！',
        action: '让学生描述攀岩的紧张感。'
      }
    }
  },

  // ========================================
  // Step 3: L4 验收
  // ========================================
  step3: {
    adapt: {
      correct: {
        title: '答对了',
        content: 'Bingo！这种变色龙级别的词都难不倒你，适应能力满分！',
        action: '给予表扬，准备下一个单词。'
      },
      wrong1: {
        title: '第1次错误',
        content: '哎呀，是不是把"大嘴 A"写成"圆嘴 O"了？再给你一次机会，张大嘴！',
        action: '提示关键字母 A，鼓励再试。'
      },
      wrong2: {
        title: '第2次错误',
        content: '没事，这词确实容易"脸盲"。先放它一马，记录在案，下轮让老师带你修。',
        action: '标记为红词，下节课继续攻坚。'
      }
    },
    environment: {
      correct: {
        title: '答对了',
        content: 'Unbelievable！这么长的词你居然盲打全对？你的键盘在冒火！',
        action: '大力表扬，这是个难词！'
      },
      wrong1: {
        title: '第1次错误',
        content: '别急，是不是中间那个偷偷摸摸的 n (ron) 漏掉了？再听一遍：en-vi-ron...',
        action: '重放音节，提示 ron 部分。'
      },
      wrong2: {
        title: '第2次错误',
        content: '这里的 n 确实太狡猾了。系统已标记，咱们回头专门开个小灶练它。',
        action: '标记为红词，记录易错点。'
      }
    },
    challenge: {
      correct: {
        title: '答对了',
        content: 'K.O.! 双写 l 没漏，ge 也没错，这个大 Boss 被你单刷了！',
        action: '庆祝攻克难关！'
      },
      wrong1: {
        title: '第1次错误',
        content: '只有 l 是成双成对的哦！是不是少写了一根？再检查一下中间！',
        action: '提示 ll 双写，鼓励再试。'
      },
      wrong2: {
        title: '第2次错误',
        content: '看来这个"挑战"确实有点硬。不急，我们先把红灯亮着，稍后继续攻坚。',
        action: '标记为红词，保持积极态度。'
      }
    }
  }
};

/**
 * 获取 Step 1 话术
 * @param {string} wordKey - 单词 (adapt/environment/challenge)
 * @param {string} action - 操作 (playAudio/showSyllables/showPhonetic)
 */
export const getStep1Script = (wordKey, action) => {
  return jarvisScripts.step1[wordKey]?.[action] || null;
};

/**
 * 获取 Step 2 话术
 * @param {string} wordKey - 单词 (adapt/environment/challenge)
 * @param {string} weapon - 武器 (context/visual/compare/image)
 */
export const getStep2Script = (wordKey, weapon) => {
  return jarvisScripts.step2[wordKey]?.[weapon] || null;
};

/**
 * 获取 Step 3 话术
 * @param {string} wordKey - 单词 (adapt/environment/challenge)
 * @param {string} result - 结果 (correct/wrong1/wrong2)
 */
export const getStep3Script = (wordKey, result) => {
  return jarvisScripts.step3[wordKey]?.[result] || null;
};

export default jarvisScripts;
