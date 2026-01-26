import React, { useState, useEffect, useMemo } from 'react';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import Badge from '../../../../shared/components/ui/Badge';
import Button from '../../../../shared/components/ui/Button';
import FullSpelling from './FullSpelling';
import useClassroomStore from '../../../../shared/store/useClassroomStore';
import './P3Container.css';

/**
 * Phase 3 容器组件
 * 门神验收：统一交付标准
 * 
 * 来源：
 * - P1 跳级生 (疑似熟词)
 * - P2 训练生
 * 
 * 验收通过 → Yellow
 * 验收失败 → Pending，打回 P2
 */
const P3Container = () => {
  const {
    wordList,
    wordResults,
    studentState,
    setPhase,
    updateWordResult,
    resetStudentState,
  } = useClassroomStore();

  // P3 本地状态
  const [currentP3Index, setCurrentP3Index] = useState(0);
  const [p3Results, setP3Results] = useState({}); // { wordId: { passed: bool, source: 'p1_skip'|'p2_trained' } }
  const [isCompleted, setIsCompleted] = useState(false);

  // 获取需要 P3 验收的单词
  // 设计原则：P3 是统一交付标准，所有单词都必须验收！
  const p3Words = useMemo(() => {
    return wordList.map(word => {
      const result = wordResults[word.id] || {};
      
      // 判断单词来源
      let source = 'p2_trained'; // 默认为训练生
      if (result.p1Result === true) {
        // P1 答对的是跳级生（疑似熟词，直接来 P3）
        source = 'p1_skip';
      } else if (result.needP2) {
        // P1 答错需要 P2 训练的是训练生
        source = 'p2_trained';
      }
      
      return {
        ...word,
        source,
      };
    });
  }, [wordList, wordResults]);

  // 当前验收的单词
  const currentWord = p3Words[currentP3Index];

  // 初始化
  useEffect(() => {
    setCurrentP3Index(0);
    setP3Results({});
    setIsCompleted(false);
    resetStudentState();
  }, []);

  // 处理单词验收完成
  const handleWordComplete = (passed, finalStatus) => {
    if (!currentWord) return;

    console.log(`📝 [P3] 单词 ${currentWord.word} 验收结果:`, passed ? '✅ 通过' : '❌ 未通过');

    // 记录结果
    setP3Results(prev => ({
      ...prev,
      [currentWord.id]: {
        passed,
        source: currentWord.source,
        finalStatus,
      }
    }));

    // 更新单词状态到 store
    updateWordResult(currentWord.id, {
      p3Passed: passed,
      status: passed ? 'yellow' : 'pending',
      p3FailedToP2: !passed,
    });

    // 检查是否还有更多单词
    setTimeout(() => {
      if (currentP3Index < p3Words.length - 1) {
        setCurrentP3Index(prev => prev + 1);
        resetStudentState();
      } else {
        // P3 全部完成
        setIsCompleted(true);
        console.log('🎉 [P3] 门神验收全部完成！');
      }
    }, 2000);
  };

  // 计算统计数据
  const stats = useMemo(() => {
    const passed = Object.values(p3Results).filter(r => r.passed).length;
    const failed = Object.values(p3Results).filter(r => !r.passed).length;
    const pending = p3Words.length - passed - failed;
    return { passed, failed, pending };
  }, [p3Results, p3Words.length]);

  // 如果没有需要验收的单词
  if (p3Words.length === 0) {
    return (
      <div className="p3-container p3-container--empty">
        <div className="p3-container__icon">🤔</div>
        <h2>无需验收</h2>
        <p>没有需要 P3 验收的单词</p>
        <Button
          variant="primary"
          onClick={() => setPhase('P1')}
        >
          返回 Phase 1
        </Button>
      </div>
    );
  }

  // P3 完成界面
  if (isCompleted) {
    return (
      <div className="p3-container p3-container--completed">
        <div className="p3-container__summary">
          <div className="p3-container__summary-icon">🚪</div>
          <h2>门神验收完成！</h2>
          
          {/* 统计卡片 */}
          <div className="p3-container__stats">
            <div className="p3-container__stat p3-container__stat--passed">
              <CheckCircle2 size={24} />
              <span className="p3-container__stat-value">{stats.passed}</span>
              <span className="p3-container__stat-label">🟡 Yellow</span>
              <span className="p3-container__stat-desc">变灯成功</span>
            </div>
            <div className="p3-container__stat p3-container__stat--failed">
              <XCircle size={24} />
              <span className="p3-container__stat-value">{stats.failed}</span>
              <span className="p3-container__stat-label">⚪ Pending</span>
              <span className="p3-container__stat-desc">打回 P2</span>
            </div>
          </div>

          {/* 单词列表 */}
          <div className="p3-container__word-list">
            <h3>验收详情</h3>
            <div className="p3-container__word-items">
              {p3Words.map(word => {
                const result = p3Results[word.id];
                return (
                  <div 
                    key={word.id} 
                    className={`p3-container__word-item ${result?.passed ? 'p3-container__word-item--passed' : 'p3-container__word-item--failed'}`}
                  >
                    <span className="p3-container__word-text">{word.word}</span>
                    <Badge variant={word.source === 'p1_skip' ? 'yellow' : 'green'} size="sm">
                      {word.source === 'p1_skip' ? '跳级' : '训练'}
                    </Badge>
                    {result?.passed ? (
                      <Badge variant="yellow" size="sm">🟡 Yellow</Badge>
                    ) : (
                      <Badge variant="gray" size="sm">⚪ Pending</Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="p3-container__actions">
            {stats.failed > 0 ? (
              <Button
                variant="outline"
                onClick={() => setPhase('P2')}
              >
                返回 P2 重练 ({stats.failed}个)
              </Button>
            ) : null}
            <Button
              variant="primary"
              onClick={() => console.log('课堂结束')}
            >
              🎉 完成本节课
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p3-container">
      {/* 顶部进度指示 */}
      <div className="p3-container__header">
        <div className="p3-container__phase-badge">
          Phase 3: 门神验收 🚪
        </div>
        <div className="p3-container__progress">
          单词 {currentP3Index + 1}/{p3Words.length}
        </div>
      </div>

      {/* 进度条 */}
      <div className="p3-container__progress-bar">
        <div 
          className="p3-container__progress-fill"
          style={{ width: `${((currentP3Index + 1) / p3Words.length) * 100}%` }}
        />
      </div>

      {/* 统计概览 */}
      <div className="p3-container__mini-stats">
        <div className="p3-container__mini-stat">
          <CheckCircle2 size={16} />
          <span>{stats.passed} 通过</span>
        </div>
        <div className="p3-container__mini-stat p3-container__mini-stat--failed">
          <XCircle size={16} />
          <span>{stats.failed} 打回</span>
        </div>
        <div className="p3-container__mini-stat p3-container__mini-stat--pending">
          <Clock size={16} />
          <span>{stats.pending} 待验</span>
        </div>
      </div>

      {/* 当前验收内容 */}
      <div className="p3-container__content">
        {currentWord && (
          <FullSpelling
            word={currentWord}
            wordSource={currentWord.source}
            onComplete={handleWordComplete}
          />
        )}
      </div>
    </div>
  );
};

export default P3Container;

