import React, { useState, useEffect, useRef } from 'react';
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
 * 
 * 每轮逻辑：
 * 1. 首轮：遍历所有 P2 单词，记录错题
 * 2. 错题轮：只做错的单词，做对的移除
 * 3. 全部正确后进入下一轮
 * 
 * @param {boolean} readonly - 是否只读模式（教师端使用）
 */
const P2Container = ({ readonly = false }) => {
  const {
    studentState,
    getP2Words,
    setPhase,
    nextP2Round,
    nextP2Word,
    resetP2WrongWords,
  } = useClassroomStore();

  // 获取需要 P2 训练的单词（全部）
  const allP2Words = getP2Words();
  
  // 从 store 获取当前轮次和单词索引
  const currentRound = studentState.p2Round;
  const currentWordIndex = studentState.p2WordIndex;
  const isRetryRound = studentState.p2IsRetryRound;
  const retryCount = studentState.p2RetryCount;
  const storeWrongWords = studentState.p2WrongWords;
  
  // 本地状态：本轮固定的单词列表（不会在做题过程中变化）
  const [roundWords, setRoundWords] = useState([]);
  // 本地状态：本轮的错题收集（做完一轮后才更新到 store）
  const roundWrongWordsRef = useRef(new Set());
  
  // 当轮次或错题轮状态变化时，固定本轮的单词列表
  useEffect(() => {
    let wordsForThisRound;
    if (isRetryRound && storeWrongWords.length > 0) {
      // 错题轮：使用 store 中的错题列表
      wordsForThisRound = allP2Words.filter(w => storeWrongWords.includes(w.id));
    } else {
      // 首轮：使用全部 P2 单词
      wordsForThisRound = allP2Words;
    }
    setRoundWords(wordsForThisRound);
    // 重置本轮错题收集
    roundWrongWordsRef.current = new Set();
    console.log(`📍 [P2] 本轮单词固定: ${wordsForThisRound.map(w => w.word).join(', ')} (retryCount: ${retryCount})`);
  }, [currentRound, isRetryRound, retryCount]); // 使用 retryCount 代替 storeWrongWords.length
  
  // 当前训练的单词
  const currentWord = roundWords[currentWordIndex];
  
  // 初始化 P2
  useEffect(() => {
    console.log(`📍 [P2Container] 挂载，当前进度: 第${currentRound}轮 第${currentWordIndex + 1}词 ${isRetryRound ? '(错题轮)' : '(首轮)'}`);
  }, []);

  // 轮次名称
  const roundNames = {
    1: '第一轮：听音辨形 🎧',
    2: '第二轮：闪视辨析 👁',
    3: '第三轮：幽灵拼写 📝',
  };

  // 处理单词完成
  const handleWordComplete = (isCorrect) => {
    const totalInCurrentList = roundWords.length;
    console.log(`📝 [P2] 第${currentRound}轮${isRetryRound ? '(错题)' : ''} 单词${currentWordIndex + 1}/${totalInCurrentList} 完成:`, isCorrect ? '正确 ✓' : '错误 ✗');
    
    // 检查当前单词是否被武器库标记为错误（即使学生答对了）
    const storeCurrentWrongWords = useClassroomStore.getState().studentState.p2WrongWords;
    const weaponMarkedWrong = currentWord && storeCurrentWrongWords.includes(currentWord.id);
    
    // 记录本题结果到本轮错题集
    // 如果答错 或 被武器库标记，都算作错题
    if (((!isCorrect) || weaponMarkedWrong) && currentWord) {
      roundWrongWordsRef.current.add(currentWord.id);
      if (weaponMarkedWrong && isCorrect) {
        console.log(`🚨 [P2] 单词 "${currentWord.word}" 被武器库标记为红灯，即使答对也算错题`);
      }
    }
    // 注意：答对且未被武器库标记时，不需要加入错题
    
    // 检查当前列表是否还有更多单词
    if (currentWordIndex < totalInCurrentList - 1) {
      // 进入当前列表的下一个单词
      setTimeout(() => {
        nextP2Word();
      }, 1500);
    } else {
      // 本轮遍历完成
      const newWrongWords = Array.from(roundWrongWordsRef.current);
      console.log(`✅ [P2] 第${currentRound}轮${isRetryRound ? '错题轮' : '首轮'}遍历完成！本轮错题: ${newWrongWords.length}`);
      
      setTimeout(() => {
        // 更新 store 中的错题列表为本轮的错题
        useClassroomStore.getState().setP2WrongWords(newWrongWords);
        
        if (newWrongWords.length > 0) {
          // 还有错题，开始错题重做轮
          console.log(`🔄 [P2] 还有 ${newWrongWords.length} 个错题，开始重做`);
          useClassroomStore.getState().startP2RetryRound();
        } else {
          // 全部正确，进入下一轮或下一阶段
          if (currentRound < 3) {
            console.log(`✅ [P2] 第${currentRound}轮全部正确！进入下一轮`);
            nextP2Round();
          } else {
            console.log('✅ [P2] 全部训练完成！进入 Phase 3');
            setPhase('P3');
          }
        }
      }, 2000);
    }
  };

  // 如果没有需要训练的单词，直接进入 P3
  if (allP2Words.length === 0) {
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

  if (roundWords.length === 0 || !currentWord) {
    return <div className="p2-container__loading">加载中...</div>;
  }

  // 渲染当前轮次的训练组件
  const renderRoundContent = () => {
    switch (currentRound) {
      case 1:
        return (
          <ListenAndChoose 
            word={currentWord}
            onComplete={handleWordComplete}
            readonly={readonly}
          />
        );
      case 2:
        return (
          <FlashRecognize 
            word={currentWord}
            onComplete={handleWordComplete}
            readonly={readonly}
          />
        );
      case 3:
        return (
          <GhostSpelling 
            word={currentWord}
            onComplete={handleWordComplete}
            readonly={readonly}
          />
        );
      default:
        return null;
    }
  };

  // 构建进度显示文本
  const getProgressText = () => {
    const roundName = roundNames[currentRound];
    const progress = `单词 ${currentWordIndex + 1}/${roundWords.length}`;
    if (isRetryRound) {
      return `${roundName} - ${progress} (错题重做)`;
    }
    return `${roundName} - ${progress}`;
  };

  return (
    <div className="p2-container">
      {/* 进度药丸 */}
      <div className="p2-container__progress-wrapper">
        <div className={`p2-container__progress-pill ${isRetryRound ? 'p2-container__progress-pill--retry' : ''}`}>
          {getProgressText()}
        </div>
      </div>

      {/* 白色卡片包裹训练内容 */}
      <div className="p2-container__card">
        {renderRoundContent()}
      </div>
    </div>
  );
};

export default P2Container;
