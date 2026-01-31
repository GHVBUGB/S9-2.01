import React from 'react';
import { Trophy } from 'lucide-react';
import './ExamComplete.css';

/**
 * 里程碑大考完成页面组件
 */
const ExamComplete = ({ results, totalWords, onBackHome }) => {
  const yellowCount = totalWords - results.green - results.red;

  return (
    <div className="complete-card">
      <div className="complete-icon">
        <Trophy className="trophy-icon" />
      </div>
      <h2 className="complete-title">🏆 大考完成！</h2>
      <p className="complete-subtitle">恭喜完成里程碑大考！</p>
      
      <div className="complete-results">
        <div className="result-box green">
          <div className="result-number">{results.green}</div>
          <div className="result-label">🟢 绿灯</div>
        </div>
        <div className="result-box yellow">
          <div className="result-number">{yellowCount}</div>
          <div className="result-label">🟡 黄灯</div>
        </div>
        <div className="result-box red">
          <div className="result-number">{results.red}</div>
          <div className="result-label">🔴 红灯</div>
        </div>
      </div>
      
      <button onClick={onBackHome} className="complete-btn">
        返回首页
      </button>
    </div>
  );
};

export default ExamComplete;
