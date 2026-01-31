# Review Selection 复习选择页面重构说明

## 概述
根据 **三轨制矩阵 (The Triple-Track Matrix)** 理论，将复习选择页面重构为**一键进入**系统。用户选择车道后直接进入复习界面开始答题。

## 重构逻辑

### 车道选择 (Track Selection)

用户选择复习车道类型后**直接进入复习**：

#### 1. 标准车道 (Standard Track) 📘
- **适用对象**：⭐ 核心词（常态）
- **复习曲线**：1→3→7→15（强艾宾浩斯）
- **题型**：L4 全拼写（原语块盲打）
- **逻辑**：稳扎稳打，确保拼写无误
- **理论支撑**：间隔重复 (Spaced Repetition) - 未熟练项必须遵守遗忘曲线加固

#### 2. 闪电车道 (Fast Lane) ⚡
- **适用对象**：⭐ 核心词（优等生）
- **复习曲线**：Day 1 → Day 15（跳过Day 3、Day 7，减负50%）
- **题型**：L5 全拼写（短句迁移版）
- **逻辑**：能做迁移，证明已深度掌握，免除机械训练
- **理论支撑**：必要的困难 (Desirable Difficulties) - Bjork理论，高难度初始提取产生更强记忆保持

#### 3. 词库管理 (保留)
- 全库矩阵管理入口
- 显示在底部，横跨两列

---

## 技术实现

### 路由参数传递
点击车道后直接跳转到 `SmartReview`，使用 `react-router-dom` 的 `state` 传递参数：

```javascript
const handleTrackSelection = (track) => {
  navigate('/smart-review', { 
    state: { 
      track: track,              // 'standard' | 'fast'
      level: track === 'standard' ? 'L4' : 'L5'
    }
  });
};
```

### SmartReview 接收参数
```javascript
const location = useLocation();
const { track = 'standard', level = 'L4' } = location.state || {};

// 根据车道和出现次数决定题型
const getCurrentLevel = () => {
  if (appearanceCount > 0) {
    return 'L4'; // 第二次出现降级为 L4
  }
  return level; // 首次使用车道指定的等级
};
```

### 视觉设计

#### 车道选择页面
- 两张大卡片并排显示
- 标准车道：蓝色主题 (#3b82f6)
- 闪电车道：黄色主题 (#fbbf24)
- 词库入口：灰色主题，占满一行
- 按钮文案：直接说明"进入XX车道复习"

#### 复习页面 Header
- 左侧：Logo "Jarvis · Vocabulary"
- 右侧徽章组：
  - 车道徽章：显示当前车道（📘 标准车道 / ⚡ 闪电车道）
  - 模式徽章：显示题型等级（MODE: L4 / MODE: L5）
  - 进度徽章：显示当前题目进度（1 / 3）

### CSS 关键样式

**ReviewSelection 新增类名：**
- `.track-card` - 车道卡片
- `.track-features` - 车道特性列表
- `.track-spec` - 车道规格说明文本
- `.full-width` - 词库卡片横跨两列

**SimpleHeader 新增类名：**
- `.simple-header__track-badge` - 车道徽章
- `.simple-header__track-badge.blue` - 标准车道样式
- `.simple-header__track-badge.yellow` - 闪电车道样式
- `.track-icon` - 车道图标

**颜色主题：**
- 蓝色：`.blue` - 标准车道 (#3b82f6)
- 黄色：`.yellow` - 闪电车道 (#f59e0b)
- 灰色：`.gray` - 词库 (#94a3b8)

---

## 用户交互流程

```
1. 进入 ReviewSelection
   ↓
2. 看到三个选项：
   - 标准车道 📘 [进入标准车道复习]
   - 闪电车道 ⚡ [进入闪电车道复习]
   - 词库管理 📚 [查看单词库]
   ↓
3a. 点击"进入标准车道复习"
    ↓
    直接跳转到 SmartReview
    参数：{ track: 'standard', level: 'L4' }
    ↓
    开始 L4 题型复习（首次）
    如答错重复出现，则降级为 L4

3b. 点击"进入闪电车道复习"
    ↓
    直接跳转到 SmartReview
    参数：{ track: 'fast', level: 'L5' }
    ↓
    开始 L5 题型复习（首次）
    如答错重复出现，则降级为 L4

3c. 点击"查看单词库"
    ↓
    跳转到 WordLibrary
```

---

## 理论依据

### 三轨制矩阵核心原则

**单词属性决定"车道"，学生能力决定"速度"**

| 轨道类型 | 触发条件 | 复习次数 | 减负比例 |
|---------|---------|---------|---------|
| 轻量车道 | 非核心词 | 2次 | 50% |
| 标准车道 | 核心词（常态） | 4次 | - |
| 闪电车道 | 核心词（Day 1 L5通过） | 2次 | 50% |

### 科学支撑

1. **间隔重复 (Spaced Repetition)**
   - 对于核心生产性词汇，必须严格遵守记忆遗忘曲线
   - 1→3→7→15的间隔确保长期记忆固化

2. **必要的困难 (Desirable Difficulties)**
   - Bjork理论：提高初始提取难度（L5迁移测试）
   - 验证深层掌握度，剔除无效重复

3. **认知负荷理论 (Cognitive Load Theory)**
   - 启动效应 (Priming Effect)：对消极词汇，只需低强度语境刺激维持再认能力
   - 非核心词不值得占用过多心智资源

---

## 已完成整合

SmartReview 组件已完成基础整合：
1. ✅ 接收 `track` 和 `level` 参数
2. ✅ 根据 `level` 决定首次题型（L4 或 L5）
3. ✅ 答错后重复出现自动降级为 L4
4. ✅ Header 显示车道徽章和题型徽章

待优化功能：
1. ⏳ 根据 `track` 调整复习曲线（标准：1→3→7→15，闪电：1→15）
2. ⏳ 实现"随时挑战键"功能（Phase 4 分流逻辑）
3. ⏳ 添加 L2 形-义模式（选择题型）

---

## 文件修改记录

### 修改文件
1. `src/apps/demo/pages/ReviewSelection.jsx`
   - ✅ 简化为一级选择（车道选择）
   - ✅ 点击车道直接跳转到 SmartReview
   - ✅ 通过路由 state 传递 track 和 level 参数

2. `src/apps/demo/pages/ReviewSelection.css`
   - ✅ 添加车道卡片样式
   - ✅ 添加车道特性列表样式
   - ✅ 新增蓝色和黄色主题配色

3. `src/apps/demo/pages/SmartReview.jsx`
   - ✅ 接收路由参数（track, level）
   - ✅ 根据 level 决定首次题型
   - ✅ 实现答错降级逻辑
   - ✅ 传递 track 参数给 Header

4. `src/apps/demo/components/SimpleHeader.jsx`
   - ✅ 接收 track 参数
   - ✅ 显示车道徽章（标准车道/闪电车道）
   - ✅ 动态显示车道图标和颜色

5. `src/apps/demo/components/SimpleHeader.css`
   - ✅ 添加车道徽章样式
   - ✅ 支持蓝色和黄色主题
   - ✅ 响应式适配

### 未修改文件
- `useWordStore.js` - 状态管理保持不变（复习曲线逻辑待后续优化）
- `App.jsx` - 路由配置保持不变

---

## 测试检查项

- [x] 车道选择界面正常显示
- [x] 点击标准车道直接进入复习
- [x] 点击闪电车道直接进入复习
- [x] 路由跳转参数正确传递
- [x] SmartReview 接收参数并调整题型
- [x] Header 显示车道徽章
- [x] 标准车道首次使用 L4 题型
- [x] 闪电车道首次使用 L5 题型
- [x] 答错后重复出现自动降级为 L4
- [x] 词库管理入口正常工作

---

**创建时间**: 2026-01-30  
**最后更新**: 2026-01-30  
**作者**: AI Assistant  
**版本**: v2.0 - 简化为一级选择，车道直达
