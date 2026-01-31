import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import StudentLayout from '../student/StudentLayout';
import TeacherLayout from '../teacher/TeacherLayout';
import Badge from '../../shared/components/ui/Badge';
import ViewSwitcher from '../../shared/components/ui/ViewSwitcher';
import './DemoView.css';

/**
 * Demo双屏视图：左学生端 + 右教师端
 */
const DemoView = () => {
  const [searchParams] = useSearchParams();
  const model = searchParams.get('model') || 'A'; // A or B
  
  const modelInfo = useMemo(() => {
    if (model === 'B') {
      return {
        name: 'Model B: 攻坚复习课',
        badge: 'red',
        desc: '红词积压 > 15个，先Red Box攻坚再新授'
      };
    }
    return {
      name: 'Model A: 标准新授课',
      badge: 'green',
      desc: '红词积压 ≤ 15个，标准55分钟流程'
    };
  }, [model]);
  
  return (
    <div className="demo-view">
      {/* 顶部模式指示器 */}
      <div className="demo-view__header">
        <div className="demo-view__header-content">
          <Badge variant={modelInfo.badge} size="lg">
            {modelInfo.name}
          </Badge>
          <span className="demo-view__header-desc">{modelInfo.desc}</span>
        </div>
      </div>
      
      {/* 双屏容器 */}
      <div className="demo-view__split">
        {/* 学生端 (左侧) */}
        <div className="demo-view__panel demo-view__panel--student">
          <div className="demo-view__panel-label">👨‍🎓 学生端视角</div>
          <StudentLayout model={model} standalone />
        </div>
        
        {/* 教师端 (右侧) */}
        <div className="demo-view__panel demo-view__panel--teacher">
          <div className="demo-view__panel-label">👨‍🏫 教师端视角</div>
          <TeacherLayout model={model} standalone />
        </div>
      </div>
      
      {/* 视角切换按钮 - 左下角 */}
      <ViewSwitcher />
    </div>
  );
};

export default DemoView;
