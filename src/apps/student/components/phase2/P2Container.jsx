import React, { useState, useEffect, useRef } from 'react';
import ListenAndChoose from './ListenAndChoose';
import FlashRecognize from './FlashRecognize';
import GhostSpelling from './GhostSpelling';
import useClassroomStore from '../../../../shared/store/useClassroomStore';
import './P2Container.css';

/**
 * Phase 2 容器组件（新流程）
 * 
 * 三轮训练模式：
 * - 第一轮：所有单词的听音辨形
 * - 第二轮：所有单词的闪视辨析
 * - 第三轮：所有单词的幽灵拼写
 * 
 * 新流程：
 * - 只处理当前组的错词（由 getCurrentGroupWords 返回）
 * - P2 完成后进入当前组的 P3
 * - 不再有全局的 P2 单词列表
 * 
 * @param {boolean} readonly - 是否只读模式（教师端使用）
 */
const P2Container = ({ readonly = false }) => {
  const {
    studentState,
    wordFlow,
    getCurrentGroupWords,
    getCurrentGroupInfo,
    currentGroupP2Complete,
    nextP2Round,
    nextP2Word,
    resetP2WrongWords,
  } = useClassroomStore();

  // 获取当前组需要训练的单词
  const groupWords = getCurrentGroupWords();
  const groupInfo = getCurrentGroupInfo();
  
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
    // 直接从 store 获取最新的数据（避免闭包问题）
    const latestState = useClassroomStore.getState();
    const latestWrongWords = latestState.studentState.p2WrongWords;
    const latestGroupWords = latestState.getCurrentGroupWords();
    
    let wordsForThisRound;
    if (isRetryRound && latestWrongWords.length > 0) {
      // 错题轮：使用 store 中的错题列表（限定在当前组内）
      wordsForThisRound = latestGroupWords.filter(w => latestWrongWords.includes(w.id));
    } else {
      // 首轮：使用当前组的全部单词
      wordsForThisRound = latestGroupWords;
    }
    setRoundWords(wordsForThisRound);
    // 重置本轮错题收集
    roundWrongWordsRef.current = new Set();
    console.log(`📍 [P2] 本轮单词固定: ${wordsForThisRound.map(w => w.word).join(', ')} (retryCount: ${retryCount}, wrongWords: ${latestWrongWords.length})`);
  }, [currentRound, isRetryRound, retryCount]);
  
  // 当前训练的单词
  const currentWord = roundWords[currentWordIndex];
  
  // 初始化 P2
  useEffect(() => {
    console.log(`📍 [P2Container] 挂载，当前进度: 第${currentRound}轮 第${currentWordIndex + 1}词 ${isRetryRound ? '(错题轮)' : '(首轮)'}`);
  }, []);


  // 处理单词完成
  const handleWordComplete = (isCorrect) => {
    const totalInCurrentList = roundWords.length;
    console.log(`📝 [P2] 第${currentRound}轮${isRetryRound ? '(错题)' : ''} 单词${currentWordIndex + 1}/${totalInCurrentList} 完成:`, isCorrect ? '正确 ✓' : '错误 ✗');
    
    // 检查当前单词是否被武器库标记为错误（通过 wordResults 中的 weaponUsed 字段判断）
    const wordResult = useClassroomStore.getState().wordResults[currentWord?.id] || {};
    const weaponMarkedWrong = wordResult.weaponUsed === true;
    
    // 记录本题结果到本轮错题集
    // 如果答错 或 被武器库标记，都算作错题
    if (((!isCorrect) || weaponMarkedWrong) && currentWord) {
      roundWrongWordsRef.current.add(currentWord.id);
      console.log(`❌ [P2] 单词 "${currentWord.word}" 记入本轮错题集 (当前错题: ${Array.from(roundWrongWordsRef.current).length})`);
      if (weaponMarkedWrong) {
        console.log(`🚨 [P2] 单词 "${currentWord.word}" 被武器库标记为红灯`);
        // 清除武器库标记（已处理）
        useClassroomStore.getState().updateWordResults({
          [currentWord.id]: {
            ...wordResult,
            weaponUsed: false,
          }
        });
      }
    } else if (isCorrect && currentWord) {
      console.log(`✅ [P2] 单词 "${currentWord.word}" 答对，不计入错题`);
    }
    
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
          // 全部正确，进入下一轮或当前组的 P3
          if (currentRound < 3) {
            console.log(`✅ [P2] 第${currentRound}轮全部正确！进入下一轮`);
            nextP2Round();
          } else {
            console.log('✅ [P2] 当前组训练完成！进入当前组的 P3');
            currentGroupP2Complete();
          }
        }
      }, 2000);
    }
  };

  // 如果没有需要训练的单词（不应该发生在新流程中）
  if (groupWords.length === 0) {
    return (
      <div className="p2-container p2-container--empty">
        <div className="p2-container__icon">✓</div>
        <h2>当前组训练完成</h2>
        <p>正在进入门神验收...</p>
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

  return (
    <div className="p2-container">
      {/* 进度药丸 - 统一格式 */}
      <div className="p2-container__progress-wrapper">
        <div className="p2-container__progress-pill">
          {groupInfo && groupInfo.batch === 'wrong' && (
            <span className="p2-container__group-badge">
              生词第{groupInfo.groupIndex + 1}组
            </span>
          )}
          单词进度: {currentWordIndex + 1} / {roundWords.length}
        </div>
      </div>

      {/* 训练内容（无卡片包裹，直接显示在背景上） */}
      {renderRoundContent()}
    </div>
  );
};

export default P2Container;
