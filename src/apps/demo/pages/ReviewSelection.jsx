import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Target, Zap } from 'lucide-react';
import useWordStore from '../../../shared/store/useWordStore';
import SimpleHeader from '../components/SimpleHeader';
import './ReviewSelection.css';

const ReviewSelection = () => {
  const navigate = useNavigate();
  const { initialized, initializeFromMockData, redWords, yellowWords, greenWords } = useWordStore();
  
  // 初始化数据
  useEffect(() => {
    if (!initialized) {
      initializeFromMockData();
    }
  }, [initialized, initializeFromMockData]);
  
  const stats = {
    toReview: yellowWords?.length || 0,
    total: (redWords?.length || 0) + (yellowWords?.length || 0) + (greenWords?.length || 0)
  };

  // 直接进入复习的处理函数
  const handleTrackSelection = (track) => {
    navigate('/smart-review', { 
      state: { 
        track: track,
        level: track === 'standard' ? 'L4' : 'L5'
      }
    });
  };

  return (
    <div className="review-selection-page">
      <SimpleHeader />

      {/* 渐变光晕背景 */}
      <div className="selection-bg-glow" />

      <div className="selection-grid three-columns">
        {/* 标准车道 */}
        <div className="selection-card track-card standard">
          <div className="card-bg-circle blue" />
          <div className="card-content">
            <div className="card-icon-box blue">
              <Target className="card-icon" />
            </div>
            <h3 className="card-label">Standard Track</h3>
            <h2 className="card-title">标准车道 📘</h2>
            <p className="card-description">
              稳扎稳打复习模式<br/>
              <span className="track-spec">曲线：1→3→7→15（强艾宾浩斯）</span><br/>
              <span className="track-spec">题型：L4 全拼写（原语块盲打）</span>
            </p>
            <div className="track-features">
              <div className="feature-item">✓ 核心词（常态）</div>
              <div className="feature-item">✓ 间隔重复加固</div>
              <div className="feature-item">✓ 确保拼写无误</div>
            </div>
          </div>
          <div>
            <button 
              onClick={() => handleTrackSelection('standard')} 
              className="card-action-btn primary"
            >
              进入标准车道复习
            </button>
          </div>
        </div>

        {/* 闪电车道 */}
        <div className="selection-card track-card fast">
          <div className="card-bg-circle yellow" />
          <div className="card-content">
            <div className="card-icon-box yellow">
              <Zap className="card-icon" />
            </div>
            <h3 className="card-label yellow">Fast Lane</h3>
            <h2 className="card-title">闪电车道 ⚡</h2>
            <p className="card-description">
              抢跑复习模式（减负50%）<br/>
              <span className="track-spec">曲线：Day 1 → Day 15（跳过Day 3、7）</span><br/>
              <span className="track-spec">题型：L5 全拼写（短句迁移版）</span>
            </p>
            <div className="track-features">
              <div className="feature-item">⚡ 核心词（优等生）</div>
              <div className="feature-item">⚡ 能力迁移验证</div>
              <div className="feature-item">⚡ 免除机械训练</div>
            </div>
          </div>
          <div>
            <button 
              onClick={() => handleTrackSelection('fast')} 
              className="card-action-btn primary yellow"
            >
              进入闪电车道复习
            </button>
          </div>
        </div>

        {/* 词库入口 - 简约美化版 */}
        <div className="selection-card library-card">
          <div className="card-bg-circle purple" />
          <div className="card-content">
            <div className="card-icon-box purple">
              <BookOpen className="card-icon" />
            </div>
            <h3 className="card-label purple">Word Library</h3>
            <h2 className="card-title">单词库 📚</h2>
            <p className="card-description">
              共 <span className="highlight-number total">{stats.total}</span> 个单词
            </p>
            <div className="progress-section">
              <div className="progress-bar-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill green" 
                    style={{ width: `${stats.total > 0 ? (greenWords?.length || 0) / stats.total * 100 : 0}%` }}
                  />
                  <div 
                    className="progress-fill yellow" 
                    style={{ width: `${stats.total > 0 ? (yellowWords?.length || 0) / stats.total * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div className="stats-row">
                <div className="stat-chip green">
                  <span className="stat-dot green"></span>
                  <span className="stat-text">{greenWords?.length || 0} 已掌握</span>
                </div>
                <div className="stat-chip yellow">
                  <span className="stat-dot yellow"></span>
                  <span className="stat-text">{yellowWords?.length || 0} 复习中</span>
                </div>
                <div className="stat-chip red">
                  <span className="stat-dot red"></span>
                  <span className="stat-text">{redWords?.length || 0} 需加强</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <button onClick={() => navigate('/word-library')} className="card-action-btn primary purple">
              查看单词库
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSelection;
