import React from 'react';
import useClassroomStore from '../../../shared/store/useClassroomStore';
import Button from '../../../shared/components/ui/Button';
import Card from '../../../shared/components/ui/Card';
import { Layers, Brain, Wand2, Image, CheckCircle2 } from 'lucide-react';
import './WeaponPanel.css';

/**
 * 教师武器面板
 * 
 * 在 Red Box Step 2 时，教师可以选择针对学生错误类型的"武器"：
 * - 对比矩阵：针对形近混淆
 * - 音素强化：针对发音模糊
 * - 语境堆叠：针对语义混淆
 * - 视觉锚点：针对机械遗忘
 */
const WeaponPanel = ({ currentWord, onSelectWeapon }) => {
  const {
    teacherState,
    teacherSelectWeapon,
    teacherSendCommand,
  } = useClassroomStore();

  const weapons = [
    {
      id: 'context',
      name: '语境堆叠',
      icon: <Wand2 size={28} />,
      desc: '多语境例句，深化语义理解',
      forError: '语义混淆',
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)',
    },
    {
      id: 'visual',
      name: '视觉锚点',
      icon: <Image size={28} />,
      desc: '图像+口诀，建立视觉记忆',
      forError: '机械遗忘',
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.1)',
    },
    {
      id: 'compare',
      name: '对比矩阵',
      icon: <Layers size={28} />,
      desc: '形近词对比，区分易混淆词',
      forError: '形近混淆',
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)',
    },
  ];

  const handleSelectWeapon = (weaponId) => {
    teacherSelectWeapon(weaponId);
    if (onSelectWeapon) {
      onSelectWeapon(weaponId);
    }
  };

  const selectedWeapon = teacherState.selectedWeapon;

  return (
    <div className="weapon-panel">
      <div className="weapon-panel__header">
        <h3>🛠️ 精准助记武器库</h3>
        <p>根据学生的错误类型，选择最有效的武器</p>
      </div>

      {/* 学生错误分析（模拟） */}
      {currentWord && (
        <Card variant="outline" padding="sm" className="weapon-panel__analysis">
          <div className="weapon-panel__analysis-header">
            <span>📊 错误类型分析</span>
            <span className="weapon-panel__word">{currentWord.word}</span>
          </div>
          <div className="weapon-panel__analysis-content">
            <div className="weapon-panel__error-tag">
              历史错误: {currentWord.errorCount}次
            </div>
            {currentWord.logic?.confusables && (
              <div className="weapon-panel__error-tag weapon-panel__error-tag--warning">
                存在易混淆词
              </div>
            )}
          </div>
        </Card>
      )}

      {/* 武器选择区 */}
      <div className="weapon-panel__grid">
        {weapons.map((weapon) => (
          <Card
            key={weapon.id}
            variant={selectedWeapon === weapon.id ? 'elevated' : 'outline'}
            padding="md"
            className={`weapon-panel__card ${
              selectedWeapon === weapon.id ? 'weapon-panel__card--selected' : ''
            }`}
            style={{
              '--weapon-color': weapon.color,
              '--weapon-bg': weapon.bgColor,
            }}
            onClick={() => handleSelectWeapon(weapon.id)}
          >
            <div className="weapon-panel__card-icon">
              {weapon.icon}
            </div>
            <div className="weapon-panel__card-info">
              <h4>{weapon.name}</h4>
              <p>{weapon.desc}</p>
              <span className="weapon-panel__card-tag">
                针对: {weapon.forError}
              </span>
            </div>
            {selectedWeapon === weapon.id && (
              <div className="weapon-panel__card-selected">
                <CheckCircle2 size={20} />
                已选择
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* 确认按钮 */}
      {selectedWeapon && (
        <div className="weapon-panel__actions">
          <Button
            variant="primary"
            onClick={() => teacherSendCommand('completeToolbox')}
            className="weapon-panel__confirm-btn"
          >
            ✅ 确认选择，开始助记
          </Button>
        </div>
      )}
    </div>
  );
};

export default WeaponPanel;
