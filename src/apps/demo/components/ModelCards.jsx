import React from 'react';
import Card from '../../../shared/components/ui/Card';
import Badge from '../../../shared/components/ui/Badge';
import { Clock, Target, AlertCircle, CheckCircle } from 'lucide-react';
import './ModelCards.css';

/**
 * Model A/B 课程模式卡片
 * 【负责人：你】- 只有你需要修改这个文件
 */
const ModelCards = ({ selectedModel, onSelectModel }) => {
  // 课程模式数据
  const models = [
    {
      id: 'A',
      name: 'Model A',
      subtitle: '标准新授课',
      description: '正常推进新课，核心指标是 Input（吞吐量）',
      duration: '55分钟',
      condition: '无红词积压',
      indicator: 'Input 吞吐量',
      indicatorIcon: <Target size={16} />,
      color: 'blue',
      phases: [
        { name: 'Warm-up', duration: '5\'', color: '#60A5FA' },
        { name: 'New Content', duration: '45\'', color: '#3B82F6' },
        { name: 'Summary', duration: '5\'', color: '#1D4ED8' },
      ],
      features: [
        'P1 精准筛查 → P2 AI训练 → P3 门神验收',
        '新词学习为主',
        '标准化45分钟核心内容',
      ],
    },
    {
      id: 'B',
      name: 'Model B',
      subtitle: '攻坚复习课',
      description: '优先偿还认知负债，核心指标是 Clearance（销项率）',
      duration: '55分钟',
      condition: '有红词积压',
      indicator: 'Clearance 销项率',
      indicatorIcon: <AlertCircle size={16} />,
      color: 'red',
      phases: [
        { name: 'Red Box', duration: '15\'', color: '#EF4444', isRedBox: true },
        { name: 'New Content', duration: '35\'', color: '#3B82F6' },
        { name: 'Summary', duration: '5\'', color: '#1D4ED8' },
      ],
      features: [
        'Red Box 优先攻坚红词',
        '压缩新授时间保证复习',
        '强化 P4-P6 复习路径',
      ],
    },
  ];

  return (
    <section className="model-cards">
      <h2 className="model-cards__title">选择课程模式</h2>
      <div className="model-cards__grid">
        {models.map((model) => (
          <Card
            key={model.id}
            variant="glass"
            className={`model-card ${selectedModel === model.id ? 'model-card--selected' : ''}`}
            onClick={() => onSelectModel(model.id)}
            role="button"
            tabIndex={0}
            aria-pressed={selectedModel === model.id}
          >
            {/* 卡片头部 */}
            <div className="model-card__header">
              <div className="model-card__title-row">
                <h3 className="model-card__name">{model.name}</h3>
                <Badge variant={model.color} size="sm">{model.subtitle}</Badge>
              </div>
              <p className="model-card__description">{model.description}</p>
            </div>

            {/* 适用条件和时长 */}
            <div className="model-card__meta">
              <div className="model-card__meta-item">
                <Clock size={16} />
                <span>{model.duration}</span>
              </div>
              <div className="model-card__meta-item">
                {model.id === 'A' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                <span>适用条件：{model.condition}</span>
              </div>
            </div>

            {/* 核心指标 */}
            <div className="model-card__indicator">
              {model.indicatorIcon}
              <span>{model.indicator}</span>
            </div>

            {/* 时间线可视化 */}
            <div className="model-card__timeline">
              {model.phases.map((phase, idx) => (
                <div
                  key={idx}
                  className={`model-card__phase ${phase.isRedBox ? 'model-card__phase--redbox' : ''}`}
                  style={{
                    flex: parseInt(phase.duration) / 55,
                    background: phase.color,
                  }}
                >
                  <span className="model-card__phase-name">{phase.name}</span>
                  <span className="model-card__phase-duration">{phase.duration}</span>
                </div>
              ))}
            </div>

            {/* 核心特性 */}
            <ul className="model-card__features">
              {model.features.map((feature, idx) => (
                <li key={idx} className="model-card__feature">
                  <CheckCircle size={14} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* 选中状态指示 */}
            {selectedModel === model.id && (
              <div className="model-card__selected-badge">
                <CheckCircle size={20} />
                <span>已选择</span>
              </div>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ModelCards;
