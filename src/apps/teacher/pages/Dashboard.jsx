import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Card from '../../../shared/components/ui/Card';
import Badge from '../../../shared/components/ui/Badge';
import Button from '../../../shared/components/ui/Button';
import RedBoxControl from '../components/RedBoxControl';
import { WeaponDock } from '../../../shared/components/weapon';
import useClassroomStore from '../../../shared/store/useClassroomStore';
import { SkipForward, RotateCcw, Eye, EyeOff, CheckCircle2, XCircle, Clock, FastForward, AlertTriangle } from 'lucide-react';
import './Dashboard.css';

/**
 * 教师端看板页面
 * 实时显示学生状态，提供教师控制功能
 * 支持 Model A（标准新授）和 Model B（攻坚复习）
 */
const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const model = searchParams.get('model') || 'A';
  
  // 强制进入下一阶段确认弹窗状态
  const [showForceConfirm, setShowForceConfirm] = useState(false);
  const [forceResult, setForceResult] = useState(null);

  // 从共享 store 获取状态
  const {
    classroomMode,
    wordList,
    redWords,
    currentPhase,
    completedPhases,
    currentWordIndex,
    wordResults,
    studentState,
    teacherState,
    sessionStatus,
    redBoxStep,
    currentRedWordIndex,
    // Actions
    getCurrentWord,
    getCurrentRedWord,
    teacherSendCommand,
    teacherToggleAnswer,
    getP2Words,
    getWordStats,
    getP1Progress,
    getRedBoxProgress,
    forceNextPhase,
    getNextPhaseInfo,
  } = useClassroomStore();
  
  // 获取下一阶段信息
  const nextPhaseInfo = getNextPhaseInfo();

  // 获取当前单词（新词或红词）
  const currentWord = currentPhase === 'RedBox' ? getCurrentRedWord() : getCurrentWord();
  
  // 获取统计数据
  const wordStats = getWordStats();
  const p1Progress = getP1Progress();
  const p2Words = getP2Words();
  const redBoxProgress = getRedBoxProgress();

  // 获取 P3 验收单词列表
  const p3Words = useMemo(() => {
    return wordList.map(word => {
      const result = wordResults[word.id] || {};
      let source = 'p2_trained';
      if (result.p1Result === true) {
        source = 'p1_skip';
      }
      return {
        ...word,
        source,
        p3Passed: result.p3Passed,
      };
    });
  }, [wordList, wordResults]);

  // P3 验收统计
  const p3Stats = useMemo(() => {
    const passed = p3Words.filter(w => w.p3Passed === true).length;
    const failed = p3Words.filter(w => w.p3Passed === false).length;
    const pending = p3Words.length - passed - failed;
    return { passed, failed, pending, total: p3Words.length };
  }, [p3Words]);

  // 阶段名称映射
  const phaseNames = {
    RedBox: '🔴 Red Box 攻坚',
    P1: '精准筛查',
    P2: '集中训练',
    P3: '门神验收',
  };

  // P2 轮次名称
  const p2RoundNames = {
    1: '第一轮：听音辨形 🎧',
    2: '第二轮：闪视辨析 👁',
    3: '第三轮：幽灵拼写 📝',
  };

  // 渲染 Model 标签
  const renderModelBadge = () => {
    if (classroomMode === 'B') {
      return (
        <Badge variant="red" className="dashboard__model-badge">
          🔴 Model B 攻坚复习课
        </Badge>
      );
    }
    return (
      <Badge variant="green" className="dashboard__model-badge">
        🟢 Model A 标准新授课
      </Badge>
    );
  };

  return (
    <div className="dashboard">
      {/* 顶部标题栏 */}
      <div className="dashboard__header">
        <h1 className="dashboard__title">教师工作台</h1>
        {renderModelBadge()}
        <div className="dashboard__session-status">
          <Badge variant={sessionStatus === 'active' ? 'green' : 'yellow'}>
            {sessionStatus === 'active' ? '上课中' : '等待中'}
          </Badge>
        </div>
      </div>
      
      {/* 常驻武器库面板 */}
      <div className="dashboard__weapon-dock">
        <WeaponDock />
      </div>
      
      {/* Red Box 控制面板（仅 Model B 且在 RedBox 阶段） */}
      {currentPhase === 'RedBox' && (
        <RedBoxControl />
      )}

      {/* 非 Red Box 阶段：学生状态 + 通用控制 */}
      {currentPhase !== 'RedBox' && (
        <>
          {/* 学生实时状态 */}
          <Card variant="elevated" padding="lg" className="dashboard__student-status">
            <div className="dashboard__status-header">
              <h2>👨‍🎓 学生实时状态</h2>
              <Badge variant={studentState.isOnline ? 'green' : 'red'} dot>
                {studentState.isOnline ? '在线' : '离线'}
              </Badge>
            </div>
            
            <div className="dashboard__status-grid">
              {/* 当前阶段 */}
              <div className="dashboard__status-item">
                <span className="dashboard__status-label">当前阶段</span>
                <span className="dashboard__status-value dashboard__status-value--highlight">
                  {phaseNames[currentPhase]}
                </span>
              </div>
              
              {/* 当前单词 */}
              <div className="dashboard__status-item">
                <span className="dashboard__status-label">当前单词</span>
                <span className="dashboard__status-value dashboard__status-value--word">
                  {currentWord?.word || '-'}
                </span>
              </div>
              
              {/* 单词进度 / P2 轮次 */}
              <div className="dashboard__status-item">
                <span className="dashboard__status-label">
                  {currentPhase === 'P2' ? 'P2 训练轮次' : '单词进度'}
                </span>
                <span className="dashboard__status-value">
                  {currentPhase === 'P2' ? (
                    <>{p2RoundNames[studentState.p2Round]}</>
                  ) : (
                    <>{currentWordIndex + 1} / {wordList.length}</>
                  )}
                </span>
              </div>
              
              {/* P2 轮次单词进度 */}
              {currentPhase === 'P2' && (
                <div className="dashboard__status-item">
                  <span className="dashboard__status-label">轮次单词进度</span>
                  <span className="dashboard__status-value">
                    {studentState.p2WordIndex + 1} / {p2Words.length}
                  </span>
                </div>
              )}
              
              {/* 答题状态 */}
              <div className="dashboard__status-item">
                <span className="dashboard__status-label">答题状态</span>
                <span className="dashboard__status-value">
                  {!studentState.isSubmitted ? (
                    studentState.selectedOption !== null ? (
                      <Badge variant="yellow">已选择，未提交</Badge>
                    ) : studentState.inputText ? (
                      <Badge variant="yellow">输入中: {studentState.inputText}</Badge>
                    ) : (
                      <Badge variant="yellow">思考中...</Badge>
                    )
                  ) : studentState.isCorrect ? (
                    <Badge variant="green">✅ 回答正确</Badge>
                  ) : (
                    <Badge variant="red">❌ 回答错误</Badge>
                  )}
                </span>
              </div>
            </div>
          </Card>

          {/* 通用控制面板 */}
          <Card variant="bordered" padding="md" className="dashboard__controls">
            <h3 className="dashboard__card-title">🎮 课堂控制</h3>
            <div className="dashboard__control-buttons">
              <Button 
                variant="outline" 
                onClick={() => teacherSendCommand('next')}
                disabled={!studentState.isSubmitted}
              >
                <SkipForward size={16} />
                下一题
              </Button>
              <Button 
                variant="outline"
                onClick={() => teacherSendCommand('repeat')}
              >
                <RotateCcw size={16} />
                重做本题
              </Button>
              <Button 
                variant={teacherState.showAnswer ? 'primary' : 'outline'}
                onClick={teacherToggleAnswer}
              >
                {teacherState.showAnswer ? <EyeOff size={16} /> : <Eye size={16} />}
                {teacherState.showAnswer ? '隐藏答案' : '显示答案'}
              </Button>
            </div>
          </Card>
        </>
      )}
      
      {/* 强制进入下一阶段按钮 - 全局显示 */}
      {nextPhaseInfo && currentPhase !== 'Summary' && (
        <Card variant="bordered" padding="md" className="dashboard__force-next">
          <div className="dashboard__force-next-header">
            <h3 className="dashboard__card-title">⚡ 阶段控制</h3>
            <Badge variant="yellow" size="sm">教师专属</Badge>
          </div>
          <div className="dashboard__force-next-info">
            <span className="dashboard__force-next-current">
              当前: <strong>{phaseNames[currentPhase]}</strong>
            </span>
            <span className="dashboard__force-next-arrow">→</span>
            <span className="dashboard__force-next-target">
              下一阶段: <strong>{nextPhaseInfo.name}</strong>
            </span>
          </div>
          <div className="dashboard__force-next-progress">
            {currentPhase === 'P1' && (
              <span>当前进度: {currentWordIndex + (studentState.isSubmitted ? 1 : 0)} / {wordList.length} 单词已测试</span>
            )}
            {currentPhase === 'P2' && (
              <span>当前进度: 第{studentState.p2Round}轮 第{studentState.p2WordIndex + 1}词</span>
            )}
            {currentPhase === 'P3' && (
              <span>当前进度: {wordList.filter(w => wordResults[w.id]?.p3Passed !== undefined).length} / {wordList.length} 单词已验收</span>
            )}
            {currentPhase === 'RedBox' && (
              <span>当前进度: {currentRedWordIndex + 1} / {redWords.length} 红词</span>
            )}
          </div>
          <Button 
            variant="warning"
            size="lg"
            className="dashboard__force-next-btn"
            onClick={() => setShowForceConfirm(true)}
          >
            <FastForward size={20} />
            强制进入下一阶段
          </Button>
          <p className="dashboard__force-next-hint">
            ⚠️ 点击后将立即结束当前阶段，未完成的单词将被跳过
          </p>
        </Card>
      )}
      
      {/* 强制进入下一阶段确认弹窗 */}
      {showForceConfirm && (
        <div className="dashboard__modal-overlay" onClick={() => setShowForceConfirm(false)}>
          <div className="dashboard__modal" onClick={(e) => e.stopPropagation()}>
            <div className="dashboard__modal-header">
              <AlertTriangle size={24} className="dashboard__modal-icon" />
              <h3>确认强制进入下一阶段？</h3>
            </div>
            <div className="dashboard__modal-body">
              <p>此操作将：</p>
              <ul>
                <li>立即结束 <strong>{phaseNames[currentPhase]}</strong> 阶段</li>
                <li>进入 <strong>{nextPhaseInfo?.name}</strong> 阶段</li>
                <li>未完成的单词将被跳过，不会进入后续阶段</li>
              </ul>
              {currentPhase === 'P1' && (
                <p className="dashboard__modal-warning">
                  当前已测试 <strong>{currentWordIndex + (studentState.isSubmitted ? 1 : 0)}</strong> / {wordList.length} 个单词，
                  剩余 <strong>{wordList.length - currentWordIndex - (studentState.isSubmitted ? 1 : 0)}</strong> 个单词将被跳过。
                </p>
              )}
              <p className="dashboard__modal-danger">⚠️ 此操作不可撤销！</p>
            </div>
            <div className="dashboard__modal-footer">
              <Button variant="outline" onClick={() => setShowForceConfirm(false)}>
                取消
              </Button>
              <Button 
                variant="danger"
                onClick={() => {
                  const result = forceNextPhase();
                  setForceResult(result);
                  setShowForceConfirm(false);
                  // 3秒后清除结果提示
                  setTimeout(() => setForceResult(null), 3000);
                }}
              >
                <FastForward size={16} />
                确认，进入下一阶段
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* 操作结果提示 */}
      {forceResult && (
        <div className={`dashboard__toast ${forceResult.success ? 'dashboard__toast--success' : 'dashboard__toast--error'}`}>
          {forceResult.success ? '✅' : '❌'} {forceResult.message}
        </div>
      )}

      {/* 统计面板 */}
      <div className="dashboard__grid">
        {/* Red Box 进度（仅 Model B） */}
        {classroomMode === 'B' && (
          <Card variant="bordered" padding="md" className="dashboard__card--redbox">
            <h3 className="dashboard__card-title">🔴 Red Box 攻坚进度</h3>
            <div className="dashboard__progress-bar dashboard__progress-bar--red">
              <div 
                className="dashboard__progress-fill dashboard__progress-fill--red"
                style={{ width: `${redBoxProgress.percentage}%` }}
              />
            </div>
            <div className="dashboard__redbox-stats">
              <div className="dashboard__stat-item">
                <span className="dashboard__stat-label">进度</span>
                <span className="dashboard__stat-value">
                  {redBoxProgress.completed} / {redBoxProgress.total}
                </span>
              </div>
              <div className="dashboard__stat-item">
                <span className="dashboard__stat-label">清扫率</span>
                <span className={`dashboard__stat-value ${
                  redBoxProgress.clearRate >= 80 ? 'text-green' : 
                  redBoxProgress.clearRate >= 50 ? 'text-yellow' : 'text-red'
                }`}>
                  {redBoxProgress.clearRate}%
                </span>
              </div>
            </div>
            {redWords.length > 0 && (
              <ul className="dashboard__word-list dashboard__word-list--red">
                {redWords.map((word, idx) => {
                  const result = wordResults[word.id];
                  const status = result?.redBoxPassed === true ? 'cleared' : 
                                 result?.redBoxPassed === false ? 'failed' : 
                                 idx === currentRedWordIndex ? 'current' : 'pending';
                  return (
                    <li key={word.id} className={`dashboard__word-item dashboard__word-item--${status}`}>
                      <span>{word.word}</span>
                      <span className="dashboard__word-error">错{word.errorCount}次</span>
                      {status === 'cleared' && <Badge variant="yellow" size="sm">攻克 ✓</Badge>}
                      {status === 'failed' && <Badge variant="red" size="sm">待续</Badge>}
                      {status === 'current' && <Badge variant="red" size="sm">进行中</Badge>}
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        )}

        {/* 单词状态统计 */}
        <Card variant="bordered" padding="md">
          <h3 className="dashboard__card-title">📊 单词状态统计</h3>
          <div className="dashboard__stats">
            <div className="dashboard__stat-item">
              <span className="dashboard__stat-label">⚪ Pending</span>
              <span className="dashboard__stat-value">{wordStats.pending || wordList.length}</span>
            </div>
            <div className="dashboard__stat-item">
              <Badge variant="yellow">Yellow</Badge>
              <span className="dashboard__stat-value">{wordStats.yellow}</span>
            </div>
            <div className="dashboard__stat-item">
              <Badge variant="red">Red</Badge>
              <span className="dashboard__stat-value">{wordStats.red}</span>
            </div>
          </div>
        </Card>
        
        {/* Phase 1 进度 */}
        <Card variant="bordered" padding="md">
          <h3 className="dashboard__card-title">🔍 P1 筛查进度</h3>
          <div className="dashboard__progress-bar">
            <div 
              className="dashboard__progress-fill"
              style={{ width: `${p1Progress.percentage}%` }}
            />
          </div>
          <p className="dashboard__progress-text">
            {p1Progress.completed} / {p1Progress.total} ({p1Progress.percentage}%)
          </p>
        </Card>
        
        {/* P2 训练列表 */}
        <Card variant="bordered" padding="md">
          <h3 className="dashboard__card-title">📚 待训练单词 (P2)</h3>
          {p2Words.length > 0 ? (
            <ul className="dashboard__word-list">
              {p2Words.map(word => (
                <li key={word.id} className="dashboard__word-item">
                  <span>{word.word}</span>
                  <Badge variant="red" size="sm">需训练</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-secondary text-sm">
              {currentPhase === 'P1' ? '筛查中...' : '无需训练的单词'}
            </p>
          )}
        </Card>

        {/* P3 验收监控 */}
        {(currentPhase === 'P3' || p3Words.length > 0) && (
          <Card variant="bordered" padding="md">
            <h3 className="dashboard__card-title">🚪 P3 验收监控</h3>
            <div className="dashboard__p3-stats">
              <div className="dashboard__p3-stat dashboard__p3-stat--passed">
                <CheckCircle2 size={16} />
                <span>{p3Stats.passed}</span>
                <span className="dashboard__p3-stat-label">🟡 通过</span>
              </div>
              <div className="dashboard__p3-stat dashboard__p3-stat--failed">
                <XCircle size={16} />
                <span>{p3Stats.failed}</span>
                <span className="dashboard__p3-stat-label">⚪ 打回</span>
              </div>
              <div className="dashboard__p3-stat dashboard__p3-stat--pending">
                <Clock size={16} />
                <span>{p3Stats.pending}</span>
                <span className="dashboard__p3-stat-label">待验</span>
              </div>
            </div>
            {p3Words.length > 0 && (
              <ul className="dashboard__word-list dashboard__word-list--p3">
                {p3Words.map(word => (
                  <li key={word.id} className="dashboard__word-item">
                    <span>{word.word}</span>
                    <Badge variant={word.source === 'p1_skip' ? 'yellow' : 'green'} size="sm">
                      {word.source === 'p1_skip' ? '跳级' : '训练'}
                    </Badge>
                    {word.p3Passed === true && <Badge variant="yellow" size="sm">🟡 Yellow</Badge>}
                    {word.p3Passed === false && <Badge variant="gray" size="sm">⚪ 打回</Badge>}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
