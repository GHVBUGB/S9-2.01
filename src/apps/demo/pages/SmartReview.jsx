import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/ui/Button';
import Card from '../../../shared/components/ui/Card';
import Badge from '../../../shared/components/ui/Badge';
import { ArrowLeft, RotateCcw, Clock, TrendingUp } from 'lucide-react';
import './SmartReview.css';

/**
 * 智能复习与容错（Phase 4）
 * 【负责人：同事】
 * 
 * TODO: 实现功能
 * - 艾宾浩斯曲线复习系统
 * - Yellow 词管理
 * - 三级容错机制
 */
const SmartReview = () => {
  const navigate = useNavigate();

  return (
    <div className="smart-review">
      {/* 头部导航 */}
      <header className="smart-review__header">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="smart-review__back-btn"
        >
          <ArrowLeft size={20} />
          返回首页
        </Button>
        <div className="smart-review__header-info">
          <div className="smart-review__icon">
            <RotateCcw size={32} />
          </div>
          <div>
            <h1 className="smart-review__title">智能复习与容错</h1>
            <Badge variant="blue" size="md">Phase 4</Badge>
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <div className="smart-review__container">
        <Card variant="glass" padding="xl" className="smart-review__placeholder">
          <div className="smart-review__placeholder-icon">
            <RotateCcw size={64} />
          </div>
          <h2 className="smart-review__placeholder-title">功能开发中...</h2>
          <p className="smart-review__placeholder-desc">
            这个模块将实现：
          </p>
          <ul className="smart-review__feature-list">
            <li>
              <Clock size={16} />
              <span>基于艾宾浩斯曲线的智能复习推送</span>
            </li>
            <li>
              <TrendingUp size={16} />
              <span>Yellow 词管理与巩固</span>
            </li>
            <li>
              <Badge variant="yellow" size="sm">三级容错</Badge>
              <span>软反馈 → 脚手架 → 硬中断</span>
            </li>
          </ul>
          <div className="smart-review__placeholder-hint">
            👨‍💻 请同事在此文件中实现具体功能
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SmartReview;

