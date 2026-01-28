import React, { useState, useEffect, useMemo } from 'react';
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
 * 
 * @param {boolean} readonly - 是否只读模式（教师端使用）
 */
const P3Container = ({ readonly = false }) => {
  const {
    wordList,
    wordResults,
    studentState,
    setPhase,
    nextP3Word,
    setP3Completed,
    setP3RetryWords,
    clearP3RetryWords,
  } = useClassroomStore();

  // 从 store 获取 P3 状态
  const currentP3Index = studentState.p3WordIndex;
  const isCompleted = studentState.p3Completed;
  const p3RetryWords = studentState.p3RetryWords || [];
  
  // P3 结果仍然用本地状态（因为这是派生数据，可以从 wordResults 重建）
  const [p3Results, setP3Results] = useState({});

  // 获取需要 P3 验收的单词
  // 如果有 p3RetryWords，只验收这些词（从 P2 返回的情况）
  const p3Words = useMemo(() => {
    // 决定要验收的单词范围
    let wordsToVerify = wordList;
    
    if (p3RetryWords.length > 0) {
      // 只验收从 P3 失败返回后需要重新验收的词
      // 注意：确保类型匹配（p3RetryWords 可能是字符串或数字）
      wordsToVerify = wordList.filter(w => 
        p3RetryWords.some(retryId => Number(retryId) === w.id)
      );
      console.log(`📍 [P3] 只验收返回的 ${wordsToVerify.length} 个词, p3RetryWords:`, p3RetryWords);
    }
    
    return wordsToVerify.map(word => {
      const result = wordResults[word.id] || {};
      
      // 判断单词来源
      let source = 'p2_trained'; // 默认为训练生
      if (result.p1Result === true && !result.p3FailedToP2) {
        // P1 答对且没有被 P3 打回过的是跳级生
        source = 'p1_skip';
      } else if (result.needP2 || result.p3FailedToP2) {
        // P1 答错或被 P3 打回过的是训练生
        source = 'p2_trained';
      }
      
      return {
        ...word,
        source,
      };
    });
  }, [wordList, wordResults, p3RetryWords]);

  // 当前验收的单词
  const currentWord = p3Words[currentP3Index];

  // 初始化（从 wordResults 重建 p3Results，以便视图切换时恢复）
  useEffect(() => {
    // 从 wordResults 重建已完成的 P3 结果
    const rebuiltResults = {};
    p3Words.forEach(word => {
      const result = wordResults[word.id];
      if (result?.p3Passed !== undefined) {
        rebuiltResults[word.id] = {
          passed: result.p3Passed,
          source: word.source,
        };
      }
    });
    setP3Results(rebuiltResults);
    console.log(`📍 [P3Container] 挂载，当前进度: 第${currentP3Index + 1}/${p3Words.length}词`);
  }, []);

  // 处理单词验收完成
  const handleWordComplete = (passed, finalStatus) => {
    if (!currentWord) return;

    // 检查是否被武器库标记（即使学生答对也算失败）
    const currentWordResult = useClassroomStore.getState().wordResults[currentWord.id] || {};
    const weaponMarkedFailed = currentWordResult.weaponUsed === true;
    
    // 最终结果：被武器库标记的一律算失败
    const finalPassed = weaponMarkedFailed ? false : passed;
    
    if (weaponMarkedFailed && passed) {
      console.log(`🚨 [P3] 单词 "${currentWord.word}" 被武器库标记为红灯，即使答对也算失败`);
    }
    console.log(`📝 [P3] 单词 ${currentWord.word} 验收结果:`, finalPassed ? '✅ 通过' : '❌ 未通过');

    // 记录本地结果（用于显示统计）
    setP3Results(prev => ({
      ...prev,
      [currentWord.id]: {
        passed: finalPassed,
        source: currentWord.source,
        finalStatus,
        weaponUsed: weaponMarkedFailed,
      }
    }));

    // 更新单词状态到 store（使用批量更新以确保所有字段正确设置）
    useClassroomStore.getState().updateWordResults({
      [currentWord.id]: {
        ...currentWordResult,
        p3Passed: finalPassed,
        source: currentWord.source,
        status: finalPassed ? 'yellow' : 'pending',
        p3FailedToP2: !finalPassed,
        needP2: !finalPassed, // 通过的不再需要 P2，失败的需要重新训练
        weaponUsed: false, // 重置武器库标记（已处理）
      }
    });

    // 检查是否还有更多单词
    setTimeout(() => {
      if (currentP3Index < p3Words.length - 1) {
        nextP3Word(); // 使用 store action
      } else {
        // P3 全部完成
        setP3Completed(true); // 使用 store action
        // 如果是重新验收模式，清空列表
        if (p3RetryWords.length > 0) {
          clearP3RetryWords();
        }
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
  
  // 获取失败的单词 ID 列表（确保是数字类型）
  const failedWordIds = useMemo(() => {
    return Object.entries(p3Results)
      .filter(([_, result]) => !result.passed)
      .map(([id, _]) => Number(id));
  }, [p3Results]);
  
  // 返回 P2 重练失败的词
  const handleReturnToP2 = () => {
    console.log(`🔄 [P3] 返回 P2 重练，失败单词: ${failedWordIds.length} 个`);
    
    // 设置这些词为需要重新验收
    setP3RetryWords(failedWordIds);
    
    // 标记这些词需要 P2 训练
    failedWordIds.forEach(wordId => {
      useClassroomStore.getState().updateWordResults({
        [wordId]: {
          ...wordResults[wordId],
          needP2: true,
          p3FailedToP2: true,
        }
      });
    });
    
    // 切换到 P2
    setPhase('P2');
  };
  
  // 完成本节课
  const handleComplete = () => {
    console.log('🎉 [P3] 本节课完成！');
    // 清空重新验收列表
    clearP3RetryWords();
    // TODO: 跳转到总结页面或结束
  };

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

  // P3 完成界面 - 极简风格
  if (isCompleted) {
    const passRate = p3Words.length > 0 
      ? Math.round((stats.passed / p3Words.length) * 100) 
      : 0;

    return (
      <div className="p3-container p3-container--completed">
        <div className="p3-complete">
          {/* 标题 */}
          <h2 className="p3-complete__title">验收完成</h2>
          
          {/* 通过率 */}
          <div className="p3-complete__rate">{passRate}%</div>
          
          {/* 统计 */}
          <p className="p3-complete__stats">
            {stats.passed} 通过
            {stats.failed > 0 && <span className="p3-complete__stats-sep">·</span>}
            {stats.failed > 0 && <span className="p3-complete__stats-failed">{stats.failed} 待重练</span>}
          </p>

          {/* 操作按钮 */}
          <div className="p3-complete__actions">
            {stats.failed > 0 && (
              <button
                className="p3-complete__btn p3-complete__btn--outline"
                onClick={() => handleReturnToP2()}
              >
                重练 ({stats.failed})
              </button>
            )}
            <button
              className="p3-complete__btn p3-complete__btn--primary"
              onClick={() => handleComplete()}
            >
              完成本节课
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p3-container">
      {/* 进度药丸 - 统一格式 */}
      <div className="p3-container__progress-wrapper">
        <div className="p3-container__progress-pill">
          单词进度: {currentP3Index + 1} / {p3Words.length}
        </div>
      </div>

      {/* 验收内容（无卡片包裹，直接显示在背景上） */}
      {currentWord && (
        <FullSpelling
          word={currentWord}
          wordSource={currentWord.source}
          onComplete={handleWordComplete}
          readonly={readonly}
        />
      )}
    </div>
  );
};

export default P3Container;

