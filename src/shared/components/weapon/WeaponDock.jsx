import React from 'react';
import useClassroomStore from '../../store/useClassroomStore';
import { Scissors, Lightbulb, Image, Sprout, X } from 'lucide-react';
import './WeaponDock.css';

/**
 * 教师端常驻武器库面板
 * 
 * 功能：
 * - 固定显示在教师端界面
 * - 4个武器按钮：拆音节、读口诀、看图片、讲词根
 * - 点击后触发学生端弹窗
 * - 资源缺失时按钮置灰
 */
const WeaponDock = () => {
  const {
    getActiveWord,
    weaponPopup,
    openWeaponPopup,
    closeWeaponPopup,
  } = useClassroomStore();

  // 获取当前阶段正在学习的单词
  const currentWord = getActiveWord();

  // 武器列表
  const weapons = [
    {
      id: 'syllables',
      name: '拆音节',
      icon: <Scissors size={20} />,
      field: 'core.syllables',  // 修正：syllables 在 core 下
      description: '解决读音和拼写结构',
      defaultHighlight: true,
    },
    {
      id: 'mnemonic',
      name: '读口诀',
      icon: <Lightbulb size={20} />,
      field: 'logic.mnemonic',
      description: '解决易混词',
      defaultHighlight: false,
    },
    {
      id: 'image',
      name: '看图片',
      icon: <Image size={20} />,
      field: 'visual.imageUrl',
      description: '解决具象词',
      defaultHighlight: false,
    },
    {
      id: 'etymology',
      name: '讲词根',
      icon: <Sprout size={20} />,
      field: 'logic.etymology',
      description: '解决学术词',
      defaultHighlight: false,
    },
  ];

  // 检查资源是否可用
  const isResourceAvailable = (field) => {
    if (!currentWord) return false;
    const parts = field.split('.');
    let value = currentWord;
    for (const part of parts) {
      value = value?.[part];
      if (value === undefined || value === null) return false;
    }
    return Boolean(value);
  };

  // 处理武器点击
  const handleWeaponClick = (weaponId) => {
    if (!currentWord) return;
    openWeaponPopup(weaponId, currentWord);
  };

  if (!currentWord) {
    return (
      <div className="weapon-dock weapon-dock--empty">
        <div className="weapon-dock__header">
          <span className="weapon-dock__title">🛠️ 武器库</span>
        </div>
        <p className="weapon-dock__empty-text">暂无当前单词</p>
      </div>
    );
  }

  return (
    <div className="weapon-dock">
      <div className="weapon-dock__header">
        <span className="weapon-dock__title">🛠️ 武器库</span>
        <span className="weapon-dock__word">{currentWord.word}</span>
      </div>

      <div className="weapon-dock__weapons">
        {weapons.map((weapon) => {
          const available = isResourceAvailable(weapon.field);
          const isActive = weaponPopup.isOpen && weaponPopup.weaponId === weapon.id;
          
          return (
            <button
              key={weapon.id}
              className={`weapon-dock__btn ${!available ? 'weapon-dock__btn--disabled' : ''} ${isActive ? 'weapon-dock__btn--active' : ''} ${weapon.defaultHighlight && available ? 'weapon-dock__btn--highlight' : ''}`}
              onClick={() => handleWeaponClick(weapon.id)}
              disabled={!available}
              title={available ? weapon.description : '资源不可用'}
            >
              <span className="weapon-dock__btn-icon">{weapon.icon}</span>
              <span className="weapon-dock__btn-name">{weapon.name}</span>
            </button>
          );
        })}
      </div>

      {weaponPopup.isOpen && (
        <button 
          className="weapon-dock__close-btn"
          onClick={closeWeaponPopup}
        >
          <X size={16} />
          关闭弹窗
        </button>
      )}
    </div>
  );
};

export default WeaponDock;

