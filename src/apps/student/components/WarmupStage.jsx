import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Flame, Zap, TrendingUp, ChevronRight, Star, Sparkles } from 'lucide-react';
import useClassroomStore from '../../../shared/store/useClassroomStore';
import './WarmupStage.css';

/**
 * 热身阶段组件
 * 课前欢迎页面，融合参考设计的动效
 * 
 * @param {boolean} readonly - 是否只读模式（教师端使用）
 */
const WarmupStage = ({ readonly = false }) => {
  const { 
    wordList, 
    redWords, 
    classroomMode,
    wordType,
    studentMood,
    setStudentMood,
    setWordType,
    setPhase
  } = useClassroomStore();

  // 教师端开始上课
  const handleStartClass = () => {
    const nextPhase = classroomMode === 'B' ? 'RedBox' : 'P1';
    setPhase(nextPhase);
  };

  // 模拟挑战天数
  const challengeDay = 15;
  
  // 根据角色显示不同名字
  const displayName = readonly ? '王老师' : '小明';

  // 状态选项
  const moodOptions = [
    { id: 'good', label: '很好', color: '#10b981' },
    { id: 'normal', label: '一般', color: '#f59e0b' },
    { id: 'tired', label: '有点累', color: '#94a3b8' },
  ];

  const handleMoodSelect = (moodId) => {
    if (!readonly) {
      setStudentMood(moodId);
    }
  };

  // 绘制笑脸 SVG
  const renderMoodIcon = (moodId, isSelected) => {
    const option = moodOptions.find(opt => opt.id === moodId);
    const color = isSelected ? option.color : '#cbd5e1';
    
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle 
          cx="16" cy="16" r="14" 
          fill={isSelected ? `${color}15` : '#f8fafc'}
          stroke={color}
          strokeWidth="1.5"
        />
        {moodId === 'tired' ? (
          <>
            <path d="M10 13 L12 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M20 14 L22 13" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="11" cy="13" r="1.5" fill={color} />
            <circle cx="21" cy="13" r="1.5" fill={color} />
          </>
        )}
        {moodId === 'good' && (
          <path d="M10 19 Q16 24 22 19" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
        )}
        {moodId === 'normal' && (
          <path d="M10 21 L22 21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        )}
        {moodId === 'tired' && (
          <path d="M10 22 Q16 19 22 22" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
        )}
      </svg>
    );
  };

  // 标签呼吸动效配置
  const tagBreathAnimation = (delay = 0) => ({
    scale: [1, 1.03, 1],
    boxShadow: [
      '0 0 0 0 rgba(0, 180, 238, 0)',
      '0 0 0 4px rgba(0, 180, 238, 0.12)',
      '0 0 0 0 rgba(0, 180, 238, 0)'
    ]
  });

  const tagTransition = (delay = 0) => ({
    duration: 2.5,
    repeat: Infinity,
    ease: "easeInOut",
    delay
  });

  return (
    <div className="warmup-stage">
      <div className="warmup-stage__container">
        
        {/* 挑战天数徽章 */}
        <motion.div 
          className="warmup-stage__badge"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="warmup-stage__badge-dot" />
          <span>单词挑战第 {challengeDay} 天</span>
        </motion.div>
        
        {/* 欢迎标题 */}
        <motion.div 
          className="warmup-stage__header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="warmup-stage__title">欢迎回来，</h1>
          <h1 className="warmup-stage__name">{displayName}</h1>
        </motion.div>
        
        {/* 词包类型选择（仅教师端显示） */}
        {readonly && (
          <motion.div 
            className="warmup-stage__word-type"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <button
              className={`warmup-stage__word-type-btn ${wordType === 'core' ? 'warmup-stage__word-type-btn--active' : ''}`}
              onClick={() => setWordType('core')}
            >
              <Star size={16} />
              <span>核心词</span>
            </button>
            <button
              className={`warmup-stage__word-type-btn ${wordType === 'non-core' ? 'warmup-stage__word-type-btn--active' : ''}`}
              onClick={() => setWordType('non-core')}
            >
              <Sparkles size={16} />
              <span>非核心词</span>
            </button>
          </motion.div>
        )}
        
        {/* 标签行 - 呼吸动效 */}
        <motion.div 
          className="warmup-stage__tags"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <motion.div 
            className="warmup-stage__tag"
            animate={tagBreathAnimation(0)}
            transition={tagTransition(0)}
          >
            <BookOpen size={15} />
            <span>新词学习</span>
          </motion.div>
          
          {classroomMode === 'B' && redWords.length > 0 && (
            <motion.div 
              className="warmup-stage__tag warmup-stage__tag--yellow"
              animate={{
                scale: [1, 1.03, 1],
                boxShadow: [
                  '0 0 0 0 rgba(253, 231, 0, 0)',
                  '0 0 0 4px rgba(253, 231, 0, 0.15)',
                  '0 0 0 0 rgba(253, 231, 0, 0)'
                ]
              }}
              transition={tagTransition(0.3)}
            >
              <Zap size={15} />
              <span>红盒攻坚</span>
            </motion.div>
          )}
          
          <motion.div 
            className="warmup-stage__tag"
            animate={tagBreathAnimation(0.6)}
            transition={tagTransition(0.6)}
          >
            <TrendingUp size={15} />
            <span>巩固训练</span>
          </motion.div>
        </motion.div>
        
        {/* 信息卡片 */}
        <motion.div 
          className="warmup-stage__info-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="warmup-stage__info-block">
            <div className="warmup-stage__info-label">今日目标</div>
            <div className="warmup-stage__info-value">{wordList.length} 个单词</div>
          </div>
          {classroomMode === 'B' && redWords.length > 0 && (
            <div className="warmup-stage__info-block">
              <div className="warmup-stage__info-label">待攻克</div>
              <div className="warmup-stage__info-value">{redWords.length} 个红词</div>
            </div>
          )}
        </motion.div>
        
        {/* 开始上课按钮（仅教师端显示） */}
        {readonly && (
          <motion.button
            className="warmup-stage__start-btn"
            onClick={handleStartClass}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ChevronRight size={20} />
            <span>开始上课</span>
          </motion.button>
        )}
        
        {/* 课前互动（仅学生端显示） */}
        {!readonly && (
          <motion.div 
            className="warmup-stage__mood-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="warmup-stage__mood-label">今天状态怎么样？</div>
            <div className="warmup-stage__mood-options">
              {moodOptions.map(option => (
                <motion.button
                  key={option.id}
                  className={`warmup-stage__mood-btn ${
                    studentMood === option.id ? 'warmup-stage__mood-btn--selected' : ''
                  }`}
                  onClick={() => handleMoodSelect(option.id)}
                  style={{ '--mood-color': option.color }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {renderMoodIcon(option.id, studentMood === option.id)}
                  <span>{option.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* 教师端：显示学生状态 */}
        {readonly && studentMood && (
          <motion.div 
            className="warmup-stage__student-status"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <span className="warmup-stage__status-label">学生状态</span>
            <span 
              className="warmup-stage__status-value"
              style={{ '--mood-color': moodOptions.find(o => o.id === studentMood)?.color }}
            >
              {moodOptions.find(o => o.id === studentMood)?.label || '未选择'}
            </span>
          </motion.div>
        )}
        
        {/* 等待提示（仅学生端） */}
        {!readonly && (
          <motion.div 
            className="warmup-stage__waiting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <span className="warmup-stage__waiting-dot" />
            <span>等待老师开始上课</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WarmupStage;
