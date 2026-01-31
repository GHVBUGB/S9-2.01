import React from 'react';
import { Trophy, Target, CheckCircle } from 'lucide-react';
import './ExamPreview.css';

/**
 * 里程碑大考预览页面组件
 */
const ExamPreview = ({ wordCount, onStart }) => {
  const features = [
    { icon: <Trophy className="feature-icon" />, label: "全新语境", desc: "AI 生成全新句子" },
    { icon: <Target className="feature-icon" />, label: "无提示挑战", desc: "无首字母、无中文" },
    { icon: <CheckCircle className="feature-icon" />, label: "一次定胜负", desc: "答对绿灯/答错红灯" }
  ];

  return (
    <div className="preview-card">
      <div className="preview-bg-circle" />
      
      <div className="preview-content">
        <div className="preview-icon">
          <Trophy className="trophy-icon" />
        </div>
        <h3 className="preview-label">MILESTONE EXAM</h3>
        <h2 className="preview-title">里程碑大考 🏆</h2>
        <p className="preview-subtitle">检验学习成果，冲刺绿灯</p>
        
        <div className="preview-features">
          {features.map((item, i) => (
            <div key={i} className="preview-feature">
              <div className="feature-icon-box">{item.icon}</div>
              <div className="feature-text">
                <div className="feature-title">{item.label}</div>
                <div className="feature-desc">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="preview-stats">
          <div className="preview-stat-box">
            <div className="stat-number">{wordCount}</div>
            <div className="stat-label">待考核单词</div>
          </div>
          <div className="preview-stat-box">
            <div className="stat-number">0</div>
            <div className="stat-label">已完成</div>
          </div>
        </div>

        <button onClick={onStart} className="preview-start-btn">
          开始大考
        </button>
      </div>
    </div>
  );
};

export default ExamPreview;
