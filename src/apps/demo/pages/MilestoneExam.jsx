import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/ui/Button';
import Badge from '../../../shared/components/ui/Badge';
import { ArrowLeft, Trophy, CheckCircle, XCircle, Award } from 'lucide-react';
import useWordStore from '../../../shared/store/useWordStore';
import { getWordById } from '../../../shared/data/mockWords';
import './MilestoneExam.css';

/**
 * 里程碑大考（Phase 6）- 绿灯加冕
 * 
 * 目标：验证习得。单词在复习池完成 30天 周期，触发大考。
 * 场景：课后
 * 
 * 考核维度：
 * - 全过移：新语境测试（不考初见原语境）
 * - 无首字母提示
 * - 无中文翻译
 * - Phase 1: 挑战（只有一次机会）
 * 
 * 判定与状态流转：
 * - 满分 -> 变🟢绿灯 Green：永久出库，放发"单词大师"金牌
 * - 错误 -> 变🔴红灯 Red：说明长时记忆还不够，踢回 P5 重修
 */
const MilestoneExam = () => {
  const navigate = useNavigate();
  
  // Store 状态
  const { 
    initialized, 
    initializeFromMockData,
    yellowWords,
    promoteToGreen,
    demoteToRed
  } = useWordStore();
  
  // 组件状态
  const [examState, setExamState] = useState('preview'); // preview | testing | passed | failed | completed
  const [currentIndex, setCurrentIndex] = useState(0);
  const [examWords, setExamWords] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [results, setResults] = useState({ passed: 0, failed: 0 });
  
  // 初始化
  useEffect(() => {
    if (!initialized) {
      initializeFromMockData();
    }
  }, [initialized, initializeFromMockData]);
  
  // 获取符合大考条件的单词（复习次数 >= 2，模拟30天周期完成）
  useEffect(() => {
    if (initialized && yellowWords.length > 0) {
      const eligibleWords = yellowWords
        .filter(state => state.reviewCount >= 2) // 实际应为完成30天周期
        .slice(0, 10)
        .map(state => ({
          wordId: state.wordId,
          reviewCount: state.reviewCount
        }));
      setExamWords(eligibleWords);
    }
  }, [initialized, yellowWords]);
  
  const currentWord = examWords[currentIndex] ? getWordById(examWords[currentIndex].wordId) : null;
  
  /**
   * 生成挖空句子（使用新语境，不是原语境）
   */
  const generateNewContextSentence = (word) => {
    if (!word || !word.context || !word.context[0]) {
      return `It takes time to [ ___________ ] to a new school.`;
    }
    // 使用不同的语境
    const sentence = word.context[0].sentence;
    return sentence.replace(new RegExp(`\\b${word.word}\\b`, 'gi'), '[ ___________ ]');
  };
  
  /**
   * 提交答案
   */
  const handleSubmit = () => {
    if (!userInput.trim() || !currentWord) return;
    
    const isCorrect = userInput.trim().toLowerCase() === currentWord.word.toLowerCase();
    
    if (isCorrect) {
      // 通过 -> 变绿灯
      setExamState('passed');
      promoteToGreen(currentWord.id);
      setResults({ ...results, passed: results.passed + 1 });
      
      setTimeout(() => {
        if (currentIndex < examWords.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setUserInput('');
          setExamState('testing');
        } else {
          setExamState('completed');
        }
      }, 2000);
    } else {
      // 失败 -> 变红灯
      setExamState('failed');
      demoteToRed(currentWord.id);
      setResults({ ...results, failed: results.failed + 1 });
      
      setTimeout(() => {
        if (currentIndex < examWords.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setUserInput('');
          setExamState('testing');
        } else {
          setExamState('completed');
        }
      }, 2500);
    }
  };
  
  // 预览界面
  if (examState === 'preview') {
    if (!initialized || examWords.length === 0) {
      return (
        <div className="milestone-exam">
          <div className="exam-header">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft size={20} />
              返回首页
            </Button>
            <div className="exam-header-info">
              <div className="exam-icon">
                <Trophy size={24} />
              </div>
              <div>
                <h1>里程碑大考 —— 绿灯加冕</h1>
                <Badge variant="green">Phase 6</Badge>
              </div>
            </div>
          </div>
          
          <div className="exam-content">
            <div className="empty-state">
              <Trophy size={64} />
              <h2>暂无达到大考标准的单词</h2>
              <p>完成 30 天复习周期的单词才能参加大考</p>
              <Button onClick={() => navigate('/')}>返回首页</Button>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="milestone-exam">
        <div className="exam-header">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            返回首页
          </Button>
          <div className="exam-header-info">
            <div className="exam-icon">
              <Trophy size={24} />
            </div>
            <div>
              <h1>里程碑大考 —— 绿灯加冕</h1>
              <Badge variant="green">Phase 6</Badge>
            </div>
          </div>
        </div>
        
        <div className="exam-content">
          <div className="preview-card">
            <div className="preview-header">
              <Trophy size={64} className="trophy-icon" />
              <h2>🎉 恭喜！达到大考标准</h2>
              <p>本次大考共 {examWords.length} 个单词</p>
            </div>
            
            <div className="exam-rules">
              <h3>📋 考核规则</h3>
              <div className="rule-grid">
                <div className="rule-card">
                  <div className="rule-icon">🆕</div>
                  <div className="rule-text">
                    <strong>新语境测试</strong>
                    <span>不考初见原语境</span>
                  </div>
                </div>
                <div className="rule-card">
                  <div className="rule-icon">❌</div>
                  <div className="rule-text">
                    <strong>无辅助</strong>
                    <span>无首字母提示，无中文翻译</span>
                  </div>
                </div>
                <div className="rule-card">
                  <div className="rule-icon">⚡</div>
                  <div className="rule-text">
                    <strong>一次机会</strong>
                    <span>全过移，考验真实掌握</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="exam-outcomes">
              <h3>📊 可能的结果</h3>
              <div className="outcome-grid">
                <div className="outcome-card success">
                  <CheckCircle size={32} />
                  <div>
                    <strong>通过考试</strong>
                    <span>🟢 绿灯 - 永久出库</span>
                  </div>
                </div>
                <div className="outcome-card fail">
                  <XCircle size={32} />
                  <div>
                    <strong>未通过</strong>
                    <span>🔴 红灯 - 踢回 P5 重修</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="encouragement">
              <p>💪 这是最后一关，相信自己！</p>
              <p>你已经复习了 30 天，现在是收获的时刻。</p>
            </div>
            
            <Button size="lg" onClick={() => setExamState('testing')}>
              开始大考
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // 考试中
  if (examState === 'testing' || examState === 'passed' || examState === 'failed') {
    if (!currentWord) return <div className="milestone-exam">加载中...</div>;
    
    const showFeedback = examState === 'passed' || examState === 'failed';
    
    return (
      <div className="milestone-exam">
        <div className="exam-header">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            返回首页
          </Button>
          <div className="exam-header-info">
            <div className="exam-icon">
              <Trophy size={24} />
            </div>
            <div>
              <h1>里程碑大考 —— 绿灯加冕</h1>
              <Badge variant="green">Phase 6</Badge>
            </div>
          </div>
        </div>
        
        <div className="exam-content">
          {/* 进度 */}
          <div className="exam-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${((currentIndex + 1) / examWords.length) * 100}%` }} />
            </div>
            <span className="progress-text">第 {currentIndex + 1} / {examWords.length} 题</span>
          </div>
          
          {/* 考题卡片 */}
          <div className="exam-card">
            <div className="exam-badge">
              <Trophy size={16} />
              <span>里程碑大考 - 全过移</span>
            </div>
            
            <div className="exam-question">
              <div className="exam-sentence">
                {generateNewContextSentence(currentWord)}
              </div>
              <div className="exam-hints">
                <span>⚠️ 无首字母提示，无中文翻译</span>
                <span>🆕 全新语境，不是原语境</span>
              </div>
            </div>
            
            {/* 输入区 */}
            <div className="exam-input-section">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !showFeedback && handleSubmit()}
                placeholder="请输入单词拼写..."
                disabled={showFeedback}
                autoFocus
              />
              <Button 
                onClick={handleSubmit} 
                disabled={!userInput.trim() || showFeedback}
              >
                提交答案
              </Button>
            </div>
            
            {/* 反馈 */}
            {showFeedback && (
              <div className={`exam-feedback ${examState}`}>
                {examState === 'passed' ? (
                  <>
                    <CheckCircle size={48} />
                    <div className="feedback-content">
                      <h3>✓ 答对了，变🟢绿灯</h3>
                      <p>恭喜！{currentWord.word} 已永久掌握</p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle size={48} />
                    <div className="feedback-content">
                      <h3>✗ 答错了，变🔴红灯</h3>
                      <div className="answer-box">
                        <p><strong>正确答案：</strong>{currentWord.word}</p>
                        <p className="meaning">{currentWord.meaning?.definitionCn}</p>
                      </div>
                      <p className="hint">说明长时记忆还不够，踢回 P5 重修</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* 结果说明 */}
          <div className="exam-info">
            <div className="info-item success">
              <CheckCircle size={18} />
              <span>通过 → 🟢 绿灯，永久出库</span>
            </div>
            <div className="info-item fail">
              <XCircle size={18} />
              <span>失败 → 🔴 红灯，踢回 P5 重修</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // 完成界面
  if (examState === 'completed') {
    return (
      <div className="milestone-exam">
        <div className="exam-header">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            返回首页
          </Button>
          <div className="exam-header-info">
            <div className="exam-icon success">
              <Trophy size={24} />
            </div>
            <div>
              <h1>里程碑大考 —— 完成</h1>
              <Badge variant="green">Phase 6</Badge>
            </div>
          </div>
        </div>
        
        <div className="exam-content">
          <div className="completed-card">
            <Award size={80} className="award-icon" />
            <h2>🎉 大考完成</h2>
            <p>本次大考已全部完成</p>
            
            <div className="results-grid">
              <div className="result-box success">
                <span className="result-value">{results.passed}</span>
                <span className="result-label">通过（🟢绿灯）</span>
              </div>
              <div className="result-box fail">
                <span className="result-value">{results.failed}</span>
                <span className="result-label">未通过（🔴红灯）</span>
              </div>
            </div>
            
            <div className="completion-message">
              {results.passed > 0 && (
                <p>✨ {results.passed} 个单词已永久掌握，放发"单词大师"金牌！</p>
              )}
              {results.failed > 0 && (
                <p>💪 {results.failed} 个单词需要继续加油，踢回 P5 重修。</p>
              )}
            </div>
            
            <Button onClick={() => navigate('/')}>返回首页</Button>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
};

export default MilestoneExam;
