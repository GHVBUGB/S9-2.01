import React from 'react';
import MainLayout from '../../shared/components/layout/MainLayout';
import GlobalHeader from '../../shared/components/GlobalHeader';
import Classroom from '../student/pages/Classroom';
import ViewSwitcher from '../../shared/components/ui/ViewSwitcher';
import TeacherVideoControls from './components/TeacherVideoControls';
import TeacherToolbar from './components/TeacherToolbar';
import JarvisAssistant from './components/JarvisAssistant';
import useClassroomStore from '../../shared/store/useClassroomStore';
import { getStep1Script, getStep2Script, getStep3Script } from '../../shared/data/mockJarvisScripts';
import { getWeaponJarvisScript } from '../../shared/data/mockWeaponJarvisScripts';
import './TeacherLayout.css';

/**
 * 教师端布局（重构版）
 * 
 * 结构：
 * - GlobalHeader（顶部导航栏）
 * - MainLayout（7:3布局）
 *   - 左侧：复用学生端 Classroom（只读模式）
 *   - 右侧：视频面板 + 控制按钮 + Jarvis助教
 */
const TeacherLayout = ({ model = 'A', standalone = false, children }) => {
  const { currentPhase, getActiveWord } = useClassroomStore();
  const currentWord = getActiveWord();

  // 根据当前阶段和单词生成助教脚本
  const getJarvisScript = () => {
    const { 
      studentState, 
      studentMood, 
      redBoxStep, 
      redBoxUI,
      getCurrentRedWord,
      weaponPopup 
    } = useClassroomStore.getState();
    const p2Round = studentState?.p2Round || 1;

    // 🛠️ 优先级最高：武器库打开时返回武器教学提示
    if (weaponPopup?.isOpen && weaponPopup?.word) {
      const wordKey = weaponPopup.word.word?.toLowerCase();
      const weaponId = weaponPopup.weaponId;
      const script = getWeaponJarvisScript(wordKey, weaponId);
      return script;
    }

    // Warmup 阶段：根据学生状态给建议
    if (currentPhase === 'Warmup') {
      const moodAdvice = {
        good: {
          title: '学生状态良好',
          content: '学生状态很好，可以按正常节奏进行教学。',
          action: '点击"开始上课"进入学习阶段。'
        },
        normal: {
          title: '学生状态一般',
          content: '学生状态一般，建议适当增加互动，保持学生注意力。',
          action: '适当放慢节奏，多鼓励学生。点击"开始上课"继续。'
        },
        tired: {
          title: '学生有些疲惫',
          content: '学生反馈有点累，建议放慢节奏，增加趣味性互动。',
          action: '考虑简化部分练习，多给予正面反馈。点击"开始上课"继续。'
        },
        null: {
          title: '等待学生反馈',
          content: '等待学生选择今日状态，以便调整教学节奏。',
          action: '提示学生选择今日状态后，点击"开始上课"。'
        }
      };
      return moodAdvice[studentMood] || moodAdvice.null;
    }

    // RedBox 阶段：根据步骤和操作返回对应话术
    if (currentPhase === 'RedBox') {
      const redWord = getCurrentRedWord();
      const wordKey = redWord?.word?.toLowerCase();
      
      if (!wordKey) {
        return {
          title: '红盒攻坚',
          content: '准备开始红词攻坚训练。',
          action: '选择对应的操作按钮开始教学。'
        };
      }

      // Step 1: 定音定形
      if (redBoxStep === 1) {
        // 根据最近的操作返回话术
        if (redBoxUI.showPhonetic) {
          const script = getStep1Script(wordKey, 'showPhonetic');
          if (script) return script;
        }
        if (redBoxUI.showSyllables) {
          const script = getStep1Script(wordKey, 'showSyllables');
          if (script) return script;
        }
        if (redBoxUI.audioPlayed) {
          const script = getStep1Script(wordKey, 'playAudio');
          if (script) return script;
        }
        // 默认提示
        return {
          title: '定音定形',
          content: `当前单词：${redWord.word}，先让学生听发音，建立音形对应。`,
          action: '点击"播放发音"开始教学。'
        };
      }

      // Step 2: 精准助记
      if (redBoxStep === 2) {
        const selectedWeapon = redBoxUI.selectedWeapon;
        if (selectedWeapon) {
          const script = getStep2Script(wordKey, selectedWeapon);
          if (script) return script;
        }
        // 默认提示
        return {
          title: '精准助记',
          content: `选择一个武器来帮助学生记忆 ${redWord.word}。`,
          action: '根据学生情况选择：语境、口诀、对比或图片武器。'
        };
      }

      // Step 3: L4 验收
      if (redBoxStep === 3) {
        const { isSubmitted, isCorrect, attempts } = studentState;
        if (isSubmitted) {
          if (isCorrect) {
            const script = getStep3Script(wordKey, 'correct');
            if (script) return script;
          } else {
            // 根据尝试次数返回不同话术
            const resultKey = attempts >= 2 ? 'wrong2' : 'wrong1';
            const script = getStep3Script(wordKey, resultKey);
            if (script) return script;
          }
        }
        // 默认提示
        return {
          title: 'L4 验收',
          content: `学生正在拼写 ${redWord.word}，观察输入情况。`,
          action: '等待学生完成输入，如需提示可显示答案。'
        };
      }
    }

    if (currentPhase === 'P1' && currentWord) {
      return {
        title: '语境探针',
        content: `结合这个搭配（${currentWord.context?.[0]?.phrase || currentWord.word}），引导学生猜测 ${currentWord.word} 的意思。`,
        action: `问学生："看到这个搭配，你觉得 ${currentWord.word} 是什么意思？"`
      };
    }
    
    // P1.5 认读跟读阶段
    if (currentPhase === 'P1.5') {
      const { sightSound, getCurrentSightSoundWords } = useClassroomStore.getState();
      const wordsToRead = getCurrentSightSoundWords?.() || [];
      const currentSightWord = wordsToRead[sightSound?.currentIndex || 0];
      
      if (currentSightWord) {
        return {
          title: '认读跟读',
          content: `学生正在跟读 "${currentSightWord.word}"，这是建立"眼-耳-口"肌肉映射的关键环节。此环节以鼓励为主，不设严苛门槛。`,
          action: `引导学生："Follow me! 张嘴跟读一遍！" 观察学生发音，给予正向反馈。`
        };
      }
      
      return {
        title: '认读跟读',
        content: '学生正在进行错词跟读训练，帮助建立正确的发音记忆。',
        action: '观察学生跟读情况，必要时可示范发音或跳过此环节。'
      };
    }
    
    if (currentPhase === 'P2') {
      // P2 各轮次差异化脚本
      const p2Scripts = {
        1: {
          title: '听音辨形',
          content: '学生正在进行听音辨形训练，测试音素感知能力。',
          action: '问学生："请选择你听到的单词。"'
        },
        2: {
          title: '闪视辨析',
          content: '学生正在进行闪视辨析训练，建立形-义直连。',
          action: '问学生："刚才闪过的是什么意思？"'
        },
        3: {
          title: '幽灵拼写',
          content: '学生正在进行幽灵拼写训练，强化字母序列记忆。',
          action: '如果学生遇到困难，可以使用武器库进行干预。'
        }
      };
      return p2Scripts[p2Round] || p2Scripts[1];
    }
    if (currentPhase === 'P3') {
      return {
        title: '门神验收',
        content: '学生正在进行门神验收，这是最终检验环节。',
        action: '观察学生拼写情况，必要时给予鼓励。'
      };
    }
    return {
      title: '等待中',
      content: '等待学生进入学习状态...',
      action: '请耐心等待'
    };
  };

  // 视频区控制组件（Jarvis 单独居中显示）
  const videoControlsWithJarvis = (
    <>
      {/* Jarvis 徽章 - 居中显示 */}
      <div className="teacher-layout__jarvis-wrapper">
        <JarvisAssistant script={getJarvisScript()} />
      </div>
      
      {/* 教师控制面板 */}
      <TeacherVideoControls />
    </>
  );

  return (
    <div className="teacher-layout">
      {/* 全局顶部导航栏 */}
      <GlobalHeader role="teacher" />
      
      {/* 7:3 主布局区域 */}
      <div className="teacher-layout__content">
        <MainLayout 
          role="teacher"
          videoControls={videoControlsWithJarvis}
        >
          {/* 教师端复用学生端内容，readonly 模式 */}
          <div className="teacher-layout__main-area">
            {children || <Classroom readonly />}
            {/* 底部工具栏 - 悬浮在内容区 */}
            <TeacherToolbar />
          </div>
        </MainLayout>
      </div>
      
      {/* 视角切换按钮 - 左下角 */}
      {!standalone && <ViewSwitcher />}
    </div>
  );
};

export default TeacherLayout;
