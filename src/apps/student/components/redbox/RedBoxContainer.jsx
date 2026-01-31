import React, { useMemo } from 'react';
import useClassroomStore from '../../../../shared/store/useClassroomStore';
import RedBoxCard from './RedBoxCard';
import Card from '../../../../shared/components/ui/Card';
import Badge from '../../../../shared/components/ui/Badge';
import { Sparkles, Trophy } from 'lucide-react';
import './RedBoxContainer.css';

/**
 * Red Box 攻坚容器
 * 
 * 新设计（三步流程）：
 * - Step 1: 定音定形（听音、看形、建立音形对应）
 * - Step 2: 精准助记（教师选择武器：音节/词根/口诀/语境）
 * - Step 3: L4 验收（完整拼写验收）
 * 
 * 状态完全由 store 管理，确保双端同步
 * 支持 readonly 模式（教师端监控）
 */
const RedBoxContainer = ({ readonly = false }) => {
  const {
    redWords,
    redBoxStep,
    currentRedWordIndex,
    wordResults,
    redBoxCompleted,
    completeRedBox,
  } = useClassroomStore();

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

  // 完成界面
  if (redBoxCompleted) {
    return (
      <div className="redbox-summary">
        <Card variant="elevated" padding="lg" className="redbox-summary__card">
          <div className="redbox-summary__icon">
            <Trophy size={48} />
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

          {!readonly && (
            <button
              className="redbox-summary__btn"
              onClick={() => completeRedBox()}
            >
              <Sparkles size={18} />
              进入新词学习
            </button>
          )}
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
        readonly={readonly}
      />
    </div>
  );
};

export default RedBoxContainer;
