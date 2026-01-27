import React, { useState, useEffect } from 'react';
import useClassroomStore from '../../../../shared/store/useClassroomStore';
import Button from '../../../../shared/components/ui/Button';
import Card from '../../../../shared/components/ui/Card';
import { Wand2, Brain, Layers, Image, CheckCircle2, Lock, Unlock } from 'lucide-react';
import './ToolboxStep.css';

/**
 * Step 2: 精准助记（教师武器面板）
 * 
 * 教师根据学生的错误类型，选择对应的"武器"来攻克红词：
 * - 形近混淆 → 对比矩阵
 * - 发音模糊 → 音素强化
 * - 语义混淆 → 语境堆叠
 * - 机械遗忘 → 视觉锚点
 * 
 * 学生端：展示教师选择的助记材料
 */
const ToolboxStep = ({ word, onComplete }) => {
  const {
    studentState,
    teacherState,
    studentSelectOption,
    resetStudentState,
  } = useClassroomStore();

  const [selectedWeapon, setSelectedWeapon] = useState(null);
  const [weaponRevealed, setWeaponRevealed] = useState(false);
  const [understood, setUnderstood] = useState(false);

  // 武器列表
  const weapons = [
    {
      id: 'compare',
      name: '对比矩阵',
      icon: <Layers size={24} />,
      desc: '形近词对比',
      color: '#ef4444',
      forError: '形近混淆',
    },
    {
      id: 'phonics',
      name: '音素强化',
      icon: <Brain size={24} />,
      desc: '发音训练',
      color: '#f59e0b',
      forError: '发音模糊',
    },
    {
      id: 'context',
      name: '语境堆叠',
      icon: <Wand2 size={24} />,
      desc: '多语境记忆',
      color: '#10b981',
      forError: '语义混淆',
    },
    {
      id: 'visual',
      name: '视觉锚点',
      icon: <Image size={24} />,
      desc: '图像记忆',
      color: '#8b5cf6',
      forError: '机械遗忘',
    },
  ];

  // 重置状态
  useEffect(() => {
    setSelectedWeapon(null);
    setWeaponRevealed(false);
    setUnderstood(false);
  }, [word.id]);

  // 监听教师选择的武器
  useEffect(() => {
    if (teacherState.selectedWeapon) {
      setSelectedWeapon(teacherState.selectedWeapon);
      setWeaponRevealed(true);
    }
    if (teacherState.command === 'completeToolbox') {
      handleComplete();
    }
  }, [teacherState]);

  // 生成武器内容（根据所选武器类型）
  const generateWeaponContent = () => {
    if (!selectedWeapon) return null;

    switch (selectedWeapon) {
      case 'compare':
        // 对比矩阵：显示易混淆词对比
        return (
          <div className="toolbox-content toolbox-content--compare">
            <h4>📊 形近词对比</h4>
            <div className="toolbox-compare-grid">
              <div className="toolbox-compare-item toolbox-compare-item--target">
                <span className="toolbox-compare-word">{word.word}</span>
                <span className="toolbox-compare-meaning">{word.meaning?.definitionCn}</span>
              </div>
              {word.logic?.confusables?.map((conf, idx) => (
                <div key={idx} className="toolbox-compare-item toolbox-compare-item--confusable">
                  <span className="toolbox-compare-word">{conf}</span>
                  <span className="toolbox-compare-label">易混淆词 {idx + 1}</span>
                </div>
              ))}
            </div>
            <div className="toolbox-tip">
              💡 仔细观察它们的拼写差异！
            </div>
          </div>
        );

      case 'phonics':
        // 音素强化：音节逐个强调
        return (
          <div className="toolbox-content toolbox-content--phonics">
            <h4>🎵 音素强化训练</h4>
            <div className="toolbox-phonics-display">
              <div className="toolbox-phonics-word">
                {word.sound?.syllables?.split(' · ').map((syllable, idx) => (
                  <span key={idx} className="toolbox-phonics-syllable">
                    {syllable}
                  </span>
                ))}
              </div>
              <div className="toolbox-phonics-ipa">
                {word.sound?.ipa}
              </div>
            </div>
            <div className="toolbox-phonics-tips">
              <p>🔊 重点发音：</p>
              <ul>
                <li>注意重音在第 {Math.ceil(word.sound?.syllables?.split(' · ').length / 2) || 1} 个音节</li>
                <li>跟着老师大声朗读 3 遍</li>
              </ul>
            </div>
          </div>
        );

      case 'context':
        // 语境堆叠：多个例句
        return (
          <div className="toolbox-content toolbox-content--context">
            <h4>📚 语境堆叠</h4>
            <div className="toolbox-context-sentences">
              {word.context?.map((ctx, idx) => (
                <div key={idx} className="toolbox-context-item">
                  <p className="toolbox-context-en">
                    {ctx.sentence.replace(
                      new RegExp(`\\b${word.word}\\b`, 'gi'),
                      `【${word.word}】`
                    )}
                  </p>
                  <p className="toolbox-context-cn">{ctx.sentenceCn}</p>
                </div>
              ))}
              {/* 额外例句 */}
              <div className="toolbox-context-item toolbox-context-item--extra">
                <p className="toolbox-context-en">
                  Remember: {word.meaning?.definitionCn} = <strong>{word.word}</strong>
                </p>
              </div>
            </div>
          </div>
        );

      case 'visual':
        // 视觉锚点：助记口诀 + 图像
        return (
          <div className="toolbox-content toolbox-content--visual">
            <h4>🎨 视觉锚点</h4>
            <div className="toolbox-visual-mnemonic">
              <div className="toolbox-mnemonic-card">
                <span className="toolbox-mnemonic-emoji">💡</span>
                <p className="toolbox-mnemonic-text">
                  {word.logic?.mnemonic || '暂无助记口诀'}
                </p>
              </div>
            </div>
            {word.visual?.imageDescription && (
              <div className="toolbox-visual-image">
                <div className="toolbox-image-placeholder">
                  🖼️ {word.visual.imageDescription}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // 确认理解
  const handleUnderstand = () => {
    setUnderstood(true);
    studentSelectOption('understood');
  };

  // 完成此步骤
  const handleComplete = () => {
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  return (
    <div className="toolbox-step">
      <div className="toolbox-step__title">
        <span className="toolbox-step__title-icon">🛠️</span>
        Step 2: 精准助记
        <span className="toolbox-step__title-desc">
          {weaponRevealed ? '请仔细学习' : '等待老师选择助记工具...'}
        </span>
      </div>

      {/* 武器选择区（等待教师选择） */}
      {!weaponRevealed && (
        <div className="toolbox-step__waiting">
          <Card variant="outline" padding="lg" className="toolbox-waiting-card">
            <div className="toolbox-waiting-icon">
              <Lock size={48} color="var(--color-neutral-400)" />
            </div>
            <h3>等待老师选择助记工具</h3>
            <p>老师正在分析你的错误类型，选择最适合的"武器"...</p>
            
            <div className="toolbox-weapons-preview">
              {weapons.map(weapon => (
                <div 
                  key={weapon.id} 
                  className="toolbox-weapon-preview"
                  style={{ '--weapon-color': weapon.color }}
                >
                  {weapon.icon}
                  <span>{weapon.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* 武器内容展示区 */}
      {weaponRevealed && selectedWeapon && (
        <div className="toolbox-step__content">
          <Card variant="elevated" padding="lg" className="toolbox-content-card">
            <div className="toolbox-content-header">
              <div className="toolbox-selected-weapon">
                <Unlock size={20} color="var(--color-green)" />
                <span>老师选择了：</span>
                <span 
                  className="toolbox-weapon-name"
                  style={{ '--weapon-color': weapons.find(w => w.id === selectedWeapon)?.color }}
                >
                  {weapons.find(w => w.id === selectedWeapon)?.icon}
                  {weapons.find(w => w.id === selectedWeapon)?.name}
                </span>
              </div>
            </div>

            {generateWeaponContent()}
          </Card>
        </div>
      )}

      {/* 底部操作 */}
      {weaponRevealed && (
        <div className="toolbox-step__footer">
          {!understood ? (
            <Button
              variant="primary"
              onClick={handleUnderstand}
              className="toolbox-understand-btn"
            >
              ✋ 我理解了，准备验收
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleComplete}
              className="toolbox-complete-btn"
            >
              <CheckCircle2 size={18} />
              进入 L4 验收
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ToolboxStep;
