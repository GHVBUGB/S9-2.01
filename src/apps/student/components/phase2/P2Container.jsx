import React, { useState, useEffect } from 'react';
import ListenAndChoose from './ListenAndChoose';
import FlashRecognize from './FlashRecognize';
import GhostSpelling from './GhostSpelling';
import useClassroomStore from '../../../../shared/store/useClassroomStore';
import './P2Container.css';

/**
 * Phase 2 容器组件
 * 三轮训练模式：
 * - 第一轮：所有单词的听音辨形
 * - 第二轮：所有单词的闪视辨析
 * - 第三轮：所有单词的幽灵拼写
 */
const P2Container = () => {
  const {
    studentState,
    getP2Words,
    setPhase,
    setP2RoundAndWord,
    nextP2Round,
    nextP2Word,
  } = useClassroomStore();

  // 获取需要 P2 训练的单词
  const p2Words = getP2Words();
  
  // 从 store 获取当前轮次和单词索引
  const currentRound = studentState.p2Round;
  const currentWordIndex = studentState.p2WordIndex;
  
  // 当前训练的单词
  const currentWord = p2Words[currentWordIndex];
  
  // 初始化 P2
  useEffect(() => {
    setP2RoundAndWord(1, 0);
  }, []);

  // 轮次名称
  const roundNames = {
    1: '第一轮：听音辨形 🎧',
    2: '第二轮：闪视辨析 👁',
    3: '第三轮：幽灵拼写 📝',
  };

  // 处理单词完成
  const handleWordComplete = (isCorrect) => {
    console.log(`📝 [P2] 第${currentRound}轮 单词${currentWordIndex + 1}/${p2Words.length} 完成:`, isCorrect ? '正确 ✓' : '错误 ✗');
    
    if (isCorrect) {
      // 检查当前轮次是否还有更多单词
      if (currentWordIndex < p2Words.length - 1) {
        // 进入当前轮次的下一个单词
        setTimeout(() => {
          nextP2Word();
        }, 1000);
      } else {
        // 当前轮次完成
        console.log(`✅ [P2] 第${currentRound}轮完成！`);
        
        if (currentRound < 3) {
          // 进入下一轮
          setTimeout(() => {
            nextP2Round();
          }, 2000);
        } else {
          // P2 全部完成，进入 P3
          console.log('✅ [P2] 全部训练完成！进入 Phase 3');
          setTimeout(() => {
            setPhase('P3');
          }, 2000);
        }
      }
    }
    // 错误时由各组件内部处理重试逻辑
  };

  // 如果没有需要训练的单词，直接进入 P3
  if (p2Words.length === 0) {
    return (
      <div className="p2-container p2-container--empty">
        <div className="p2-container__icon">🎉</div>
        <h2>太棒了！</h2>
        <p>所有单词在 P1 都答对了，无需训练</p>
        <button 
          className="p2-container__skip-btn"
          onClick={() => setPhase('P3')}
        >
          直接进入 Phase 3 门神验收
        </button>
      </div>
    );
  }

  if (!currentWord) {
    return <div>加载中...</div>;
  }

  // 渲染当前轮次的训练组件
  const renderRoundContent = () => {
    switch (currentRound) {
      case 1:
        return (
          <ListenAndChoose 
            word={currentWord}
            onComplete={handleWordComplete}
          />
        );
      case 2:
        return (
          <FlashRecognize 
            word={currentWord}
            onComplete={handleWordComplete}
          />
        );
      case 3:
        return (
          <GhostSpelling 
            word={currentWord}
            onComplete={handleWordComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p2-container">
      {/* 顶部进度指示 */}
      <div className="p2-container__header">
        <div className="p2-container__phase-badge">
          Phase 2: 集中训练 📚
        </div>
        <div className="p2-container__progress">
          {roundNames[currentRound]} - 单词 {currentWordIndex + 1}/{p2Words.length}
        </div>
      </div>

      {/* 轮次指示器 */}
      <div className="p2-container__rounds">
        {[1, 2, 3].map((round) => (
          <div 
            key={round}
            className={`p2-container__round ${
              round === currentRound ? 'p2-container__round--active' : ''
            } ${round < currentRound ? 'p2-container__round--completed' : ''}`}
          >
            <div className="p2-container__round-number">
              {round < currentRound ? '✓' : `第${round}轮`}
            </div>
            <div className="p2-container__round-name">
              {round === 1 && '🎧 听音辨形'}
              {round === 2 && '👁 闪视辨析'}
              {round === 3 && '📝 幽灵拼写'}
            </div>
            {round === currentRound && (
              <div className="p2-container__round-progress">
                <div 
                  className="p2-container__round-progress-bar"
                  style={{ width: `${((currentWordIndex + 1) / p2Words.length) * 100}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ❌ 移除"当前单词信息"，避免泄露答案 */}

      {/* 当前轮次内容 */}
      <div className="p2-container__content">
        {renderRoundContent()}
      </div>
    </div>
  );
};

export default P2Container;
