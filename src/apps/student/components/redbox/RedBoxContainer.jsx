import React, { useState, useMemo } from 'react';
import useClassroomStore from '../../../../shared/store/useClassroomStore';
import RedBoxCard from './RedBoxCard';
import Card from '../../../../shared/components/ui/Card';
import Button from '../../../../shared/components/ui/Button';
import Badge from '../../../../shared/components/ui/Badge';
import { Sparkles } from 'lucide-react';
import './RedBoxContainer.css';

/**
 * Red Box 攻坚容器
 * 
 * 状态完全由 store 管理，确保双端同步：
 * - redWords: 红词列表
 * - redBoxStep: 当前步骤 (1-4)
 * - currentRedWordIndex: 当前红词索引
 */
const RedBoxContainer = () => {
  const {
    redWords,
    redBoxStep,
    currentRedWordIndex,
    wordResults,
    completeRedBox,
  } = useClassroomStore();

  const [showSummary, setShowSummary] = useState(false);

  // 当前处理的红词
  const currentWord = redWords[currentRedWordIndex];

  // 统计结果
  const redBoxStats = useMemo(() => {
    const stats = {
      total: redWords.length,
      cleared: 0,
      failed: 0,
    };
    
    redWords.forEach(word => {
      const result = wordResults[word.id];
      if (result?.redBoxPassed === true) {
        stats.cleared++;
      } else if (result?.redBoxPassed === false) {
        stats.failed++;
      }
    });
    
    stats.clearRate = stats.total > 0 
      ? Math.round((stats.cleared / stats.total) * 100) 
      : 0;
    
    return stats;
  }, [redWords, wordResults]);

  // 总结界面
  if (showSummary) {
    return (
      <div className="redbox-summary">
        <Card variant="elevated" padding="lg" className="redbox-summary__card">
          <div className="redbox-summary__icon">
            {redBoxStats.clearRate >= 80 ? '🎉' : redBoxStats.clearRate >= 50 ? '👍' : '💪'}
          </div>
          <h2>Red Box 攻坚完成！</h2>
          
          <div className="redbox-summary__rate">
            <span className="redbox-summary__rate-label">清扫率</span>
            <span className={`redbox-summary__rate-value redbox-summary__rate-value--${
              redBoxStats.clearRate >= 80 ? 'green' : redBoxStats.clearRate >= 50 ? 'yellow' : 'red'
            }`}>
              {redBoxStats.clearRate}%
            </span>
          </div>

          <div className="redbox-summary__stats">
            <div className="redbox-summary__stat">
              <Badge variant="green">✅ 攻克</Badge>
              <span>{redBoxStats.cleared}</span>
            </div>
            <div className="redbox-summary__stat">
              <Badge variant="red">❌ 待续</Badge>
              <span>{redBoxStats.failed}</span>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={() => completeRedBox()}
            className="redbox-summary__btn"
          >
            <Sparkles size={18} />
            进入新词学习
          </Button>
        </Card>
      </div>
    );
  }

  if (!currentWord) {
    return <div className="redbox-loading">加载红词数据...</div>;
  }

  return (
    <div className="redbox-container">
      <RedBoxCard
        word={currentWord}
        step={redBoxStep}
        totalWords={redWords.length}
        currentIndex={currentRedWordIndex}
      />
    </div>
  );
};

export default RedBoxContainer;
