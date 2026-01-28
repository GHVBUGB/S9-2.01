import React from 'react';
import MainLayout from '../../shared/components/layout/MainLayout';
import GlobalHeader from '../../shared/components/GlobalHeader';
import Classroom from '../student/pages/Classroom';
import ViewSwitcher from '../../shared/components/ui/ViewSwitcher';
import WeaponPopup from '../../shared/components/weapon/WeaponPopup';
import TeacherVideoControls from './components/TeacherVideoControls';
import TeacherToolbar from './components/TeacherToolbar';
import JarvisAssistant from './components/JarvisAssistant';
import useClassroomStore from '../../shared/store/useClassroomStore';
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

  // 根据当前阶段和单词生成助教脚本（临时 mock）
  const getJarvisScript = () => {
    const { studentState } = useClassroomStore.getState();
    const p2Round = studentState?.p2Round || 1;

    if (currentPhase === 'P1' && currentWord) {
      return {
        title: '语境探针',
        content: `结合这个搭配（${currentWord.context?.[0]?.phrase || currentWord.word}），引导学生猜测 ${currentWord.word} 的意思。`,
        action: `问学生："看到这个搭配，你觉得 ${currentWord.word} 是什么意思？"`
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

  // 视频区控制组件（包含控制面板 + 助教）
  const videoControlsWithJarvis = (
    <>
      <TeacherVideoControls />
      <JarvisAssistant script={getJarvisScript()} />
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
      
      {/* 武器库弹窗（学生端也会显示） */}
      <WeaponPopup />
      
      {/* 视角切换按钮 - 左下角 */}
      {!standalone && <ViewSwitcher />}
    </div>
  );
};

export default TeacherLayout;
