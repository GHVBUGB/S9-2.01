# 下一步待办事项 (Next Steps TODO)

## ✅ 已完成 (Completed)

- [x] ReviewSelection 页面重构为两级选择系统
- [x] 第一级：车道选择（标准车道 vs 闪电车道）
- [x] 第二级：模式选择（核心词 vs L2形-义）
- [x] 添加返回按钮功能
- [x] 实现路由参数传递（track, mode, level）
- [x] 完善视觉设计和样式
- [x] 创建文档说明和流程图

---

## 🔄 待实现 (To Do)

### 1. SmartReview 组件适配 ⚠️ 高优先级

**目标**：SmartReview 接收 ReviewSelection 传递的参数并相应调整逻辑

#### 需要修改的文件
- `src/apps/demo/pages/SmartReview.jsx`

#### 具体任务

**1.1 接收路由参数**
```javascript
import { useLocation } from 'react-router-dom';

const SmartReview = () => {
  const location = useLocation();
  const { track, mode, level } = location.state || {
    track: 'standard',
    mode: 'core',
    level: 'L4'
  };
  
  // ...
};
```

**1.2 根据 mode 筛选单词**
```javascript
// 从 yellowWords 中筛选
const filteredWords = useMemo(() => {
  if (mode === 'core') {
    // 筛选核心词（Tag: Core）
    return yellowWords.filter(state => {
      const word = getWordById(state.wordId);
      return word?.tags?.includes('Core');
    });
  } else {
    // 筛选非核心词（Tag: Non-Core）
    return yellowWords.filter(state => {
      const word = getWordById(state.wordId);
      return word?.tags?.includes('Non-Core');
    });
  }
}, [yellowWords, mode]);
```

**1.3 根据 level 确定题型**
```javascript
const getQuestionType = (level, appearanceCount) => {
  if (level === 'L2') {
    return 'L1'; // L2形-义模式固定使用L1语境探针
  }
  
  if (level === 'L5') {
    // 闪电车道核心词
    return appearanceCount > 0 ? 'L4' : 'L5';
  }
  
  if (level === 'L4') {
    // 标准车道核心词
    return appearanceCount > 0 ? 'L4' : 'L5';
  }
};
```

**1.4 调整题目内容**
```javascript
// L1 题型：语境探针（选择题）
if (currentLevel === 'L1') {
  return (
    <MultipleChoice
      sentence={displaySentence}
      options={[
        currentWord.meaning.chinese,
        ...getDistractors(currentWord)
      ]}
      correctAnswer={currentWord.meaning.chinese}
      onAnswer={handleAnswer}
    />
  );
}

// L4 题型：语块拼写
if (currentLevel === 'L4') {
  const phrase = currentWord.context?.[0]?.phrase || currentWord.phrase;
  // 使用短语作为句子
}

// L5 题型：长句拼写
if (currentLevel === 'L5') {
  const sentence = currentWord.context?.[0]?.sentence;
  // 使用完整句子
}
```

**1.5 根据 track 调整复习曲线逻辑**
```javascript
const getNextReviewInterval = (track, reviewCount) => {
  if (track === 'fast') {
    // 闪电车道：Day 1 → Day 15
    return reviewCount === 0 ? 15 : 30;
  } else {
    // 标准车道：1→3→7→15
    if (reviewCount === 0) return 1;
    if (reviewCount === 1) return 3;
    if (reviewCount === 2) return 7;
    if (reviewCount === 3) return 15;
    return 30;
  }
};
```

---

### 2. 单词数据结构更新

**目标**：确保单词数据包含 `tags` 字段用于分类

#### 需要修改的文件
- `src/shared/data/mockWords.js`

#### 任务
```javascript
// 为每个单词添加 tags 字段
{
  id: 1,
  word: 'adapt',
  tags: ['Core'], // 或 ['Non-Core']
  // ... 其他字段
}
```

**建议标记规则**：
- **核心词（Core）**：高频、重要、生产性词汇（如 adapt, achieve, analyze 等）
- **非核心词（Non-Core）**：低频、被动识别词汇（如 obscure, peculiar 等）

---

### 3. L1 题型组件实现

**目标**：创建多选题组件用于 L2 形-义模式

#### 需要创建的文件
- `src/apps/demo/components/MultipleChoice.jsx`
- `src/apps/demo/components/MultipleChoice.css`

#### 功能要求
- 显示语境句子（填空）
- 4个选项（1个正确答案 + 3个干扰项）
- 点击选项提交答案
- 正确/错误反馈动画

---

### 4. useWordStore 状态更新

**目标**：根据车道类型更新复习状态

#### 需要修改的文件
- `src/shared/store/useWordStore.js`

#### 任务
```javascript
// 添加方法处理不同车道的状态转换
reviewSuccessWithTrack: (wordId, track) => {
  const state = get().getWordState(wordId);
  if (!state || state.status !== 'yellow') return;
  
  const reviewCount = state.reviewCount + 1;
  const now = new Date();
  
  // 根据 track 确定下次复习时间
  let nextReviewDays;
  if (track === 'fast') {
    nextReviewDays = reviewCount === 1 ? 15 : 30;
  } else {
    // 标准曲线
    if (reviewCount === 1) nextReviewDays = 3;
    else if (reviewCount === 2) nextReviewDays = 7;
    else nextReviewDays = 15;
  }
  
  const nextReview = new Date(now.getTime() + nextReviewDays * 24 * 60 * 60 * 1000);
  
  // 更新状态...
};
```

---

### 5. Header 组件显示车道信息

**目标**：在复习页面顶部显示当前车道和模式

#### 需要修改的文件
- `src/apps/demo/components/SimpleHeader.jsx`

#### 任务
```javascript
<SimpleHeader 
  mode={currentLevel}
  progress={`${currentIndex + 1} / ${queue.length}`}
  track={track} // 新增
  trackMode={mode} // 新增
  showBadges={true}
/>
```

显示效果：
```
⚡ 闪电车道 | 核心词 L5 | 1 / 3
```

---

### 6. 测试与验证

**需要测试的场景**：

- [ ] 选择标准车道 → 核心词 L4 → 进入复习
- [ ] 选择标准车道 → L2 形-义 → 进入复习
- [ ] 选择闪电车道 → 核心词 L5-L4 → 进入复习
- [ ] 选择闪电车道 → L2 形-义 → 进入复习
- [ ] 返回按钮功能正常
- [ ] 路由参数正确传递
- [ ] SmartReview 根据参数显示正确题型
- [ ] 复习状态正确更新
- [ ] 复习曲线符合设计

---

### 7. "随时挑战键" (Leapfrog Button) 实现

**目标**：实现 7.2.2 增值功能

#### 功能说明
在复习页面提供"闪电挑战"按钮：
- 仅针对 ⭐ 核心词
- 无论处于哪个复习节点，点击后强制弹出 L5 题目
- 成功：复习进度跳2格（如 Day 3 → Day 15）
- 失败：无惩罚，继续当前流程

#### 需要修改的文件
- `src/apps/demo/pages/SmartReview.jsx`

#### UI 位置
```
┌────────────────────────────┐
│  SimpleHeader              │
├────────────────────────────┤
│  [⚡ 我已掌握 - 挑战 L5]    │  ← 新增按钮
├────────────────────────────┤
│  句子显示                   │
│  ...                       │
└────────────────────────────┘
```

---

### 8. 轻量车道 (Light Track) 实现

**目标**：添加第三种车道选项（非核心词专用）

#### 说明
根据原始需求，轻量车道应该是：
- **适用**：非核心词（Phase 3 通过 L4 后自动进入）
- **曲线**：Day 1 → Day 3 → Day 15（减负 50%）
- **题型**：L1 语境探针（语块选义）

目前设计将轻量车道整合到了 "L2 形-义" 模式中。如果需要独立显示，可以：

**选项A**：在第一级添加第三张卡片
```
[标准车道] [闪电车道] [轻量车道]
```

**选项B**：保持现有设计（推荐）
- L2 形-义模式就是轻量车道的实现
- 避免选择过多造成认知负荷

---

### 9. 数据持久化

**目标**：记录用户的车道选择偏好

#### 可选实现
```javascript
// localStorage 保存上次选择
localStorage.setItem('lastTrackSelection', track);
localStorage.setItem('lastModeSelection', mode);

// 下次进入时显示推荐
const lastTrack = localStorage.getItem('lastTrackSelection');
```

---

### 10. 数据统计与分析

**目标**：统计各车道使用情况和效果

#### 可能的指标
- 各车道使用次数
- 各车道通过率
- 闪电车道 L5 挑战成功率
- 复习时间对比

---

## 📝 开发顺序建议

**优先级排序**：

1. **P0 (必须)**：SmartReview 组件适配（任务1）
2. **P0 (必须)**：单词数据 tags 字段（任务2）
3. **P1 (重要)**：L1 题型组件（任务3）
4. **P1 (重要)**：状态管理更新（任务4）
5. **P2 (建议)**：Header 显示增强（任务5）
6. **P2 (建议)**：随时挑战键（任务7）
7. **P3 (优化)**：数据持久化（任务9）
8. **P3 (优化)**：统计分析（任务10）

---

## 🐛 已知问题 (Known Issues)

- [ ] SmartReview 目前不接收路由参数
- [ ] mockWords 数据缺少 tags 字段
- [ ] L1 题型（选择题）未实现
- [ ] 复习曲线逻辑未区分车道类型

---

## 💡 未来增强建议

1. **动画过渡**：车道选择 → 模式选择的平滑过渡动画
2. **进度指示**：显示当前在第几级选择
3. **快捷键**：支持键盘快捷键选择（1/2/3）
4. **车道徽章**：在复习页面显示车道图标
5. **成就系统**：闪电车道成功次数累积徽章
6. **数据可视化**：不同车道的学习曲线对比图

---

**最后更新**: 2026-01-30  
**状态**: 第一阶段完成，等待第二阶段集成
