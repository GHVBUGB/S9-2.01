import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/ui/Button';
import Card from '../../../shared/components/ui/Card';
import Badge from '../../../shared/components/ui/Badge';
import { ArrowLeft, Trophy, Target, Award } from 'lucide-react';
import './MilestoneExam.css';

/**
 * 里程碑大考（Phase 6）
 * 【负责人：同事】
 * 
 * TODO: 实现功能
 * - 阶段性学习成果验收
 * - 综合能力评估
 * - 成就系统
 */
const MilestoneExam = () => {
  const navigate = useNavigate();

  return (
    <div className="milestone-exam">
      {/* 头部导航 */}
      <header className="milestone-exam__header">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="milestone-exam__back-btn"
        >
          <ArrowLeft size={20} />
          返回首页
        </Button>
        <div className="milestone-exam__header-info">
          <div className="milestone-exam__icon">
            <Trophy size={32} />
          </div>
          <div>
            <h1 className="milestone-exam__title">里程碑大考</h1>
            <Badge variant="green" size="md">Phase 6</Badge>
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <div className="milestone-exam__container">
        <Card variant="glass" padding="xl" className="milestone-exam__placeholder">
          <div className="milestone-exam__placeholder-icon">
            <Trophy size={64} />
          </div>
          <h2 className="milestone-exam__placeholder-title">功能开发中...</h2>
          <p className="milestone-exam__placeholder-desc">
            这个模块将实现：
          </p>
          <ul className="milestone-exam__feature-list">
            <li>
              <Target size={16} />
              <span>阶段性学习成果综合验收</span>
            </li>
            <li>
              <Award size={16} />
              <span>多维度能力评估与反馈</span>
            </li>
            <li>
              <Badge variant="green" size="sm">成就系统</Badge>
              <span>学习里程碑与徽章奖励</span>
            </li>
          </ul>
          <div className="milestone-exam__placeholder-hint">
            👨‍💻 请同事在此文件中实现具体功能
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MilestoneExam;

