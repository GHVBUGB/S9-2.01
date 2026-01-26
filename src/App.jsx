import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './apps/demo/Home';
import StudentApp from './apps/student/StudentApp';
import TeacherApp from './apps/teacher/TeacherApp';
import DemoView from './apps/demo/DemoView';
import ViewSwitcher from './shared/components/ui/ViewSwitcher';
// 新增模块页面（同事负责）
import SmartReview from './apps/demo/pages/SmartReview';
import AIContext from './apps/demo/pages/AIContext';
import MilestoneExam from './apps/demo/pages/MilestoneExam';

function App() {
  const location = useLocation();
  const showViewSwitcher = location.pathname !== '/' && 
                           !location.pathname.startsWith('/smart-review') &&
                           !location.pathname.startsWith('/ai-context') &&
                           !location.pathname.startsWith('/milestone');

  return (
    <>
      <Routes>
        {/* 首页 */}
        <Route path="/" element={<Home />} />
        
        {/* Model A/B 课堂（你负责） */}
        <Route path="/student" element={<StudentApp />} />
        <Route path="/teacher" element={<TeacherApp />} />
        <Route path="/demo" element={<DemoView />} />
        
        {/* 额外模块页面（同事负责） */}
        <Route path="/smart-review" element={<SmartReview />} />
        <Route path="/ai-context" element={<AIContext />} />
        <Route path="/milestone" element={<MilestoneExam />} />
      </Routes>
      {showViewSwitcher && <ViewSwitcher />}
    </>
  );
}

export default App;
