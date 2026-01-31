# 🚀 快速参考卡片

## 用户使用流程

```
1. 访问复习选择页面
   → http://localhost:5173/review-selection

2. 选择车道
   📘 标准车道 → L4 短语拼写 → 曲线 1→3→7→15
   ⚡ 闪电车道 → L5 句子拼写 → 曲线 1→15（减负50%）

3. 开始答题
   答对 → 完成 ✓
   答错 → 降级为 L4，再次出现

4. 完成复习
   → 返回矩阵中心
```

---

## 开发者快速定位

### 主要文件位置

```
📁 复习选择页面
├── src/apps/demo/pages/ReviewSelection.jsx
└── src/apps/demo/pages/ReviewSelection.css

📁 智能复习页面
├── src/apps/demo/pages/SmartReview.jsx
└── src/apps/demo/pages/SmartReview.css

📁 顶部导航栏
├── src/apps/demo/components/SimpleHeader.jsx
└── src/apps/demo/components/SimpleHeader.css

📁 路由配置
└── src/App.jsx

📁 状态管理
└── src/shared/store/useWordStore.js

📁 文档
├── IMPLEMENTATION_COMPLETE.md   ← 完整实现总结
├── REVIEW_SELECTION_REFACTOR.md ← 重构说明
├── REVIEW_FLOW_DIAGRAM.md       ← 流程图
├── NEXT_STEPS_TODO.md           ← 待办事项
└── QUICK_REFERENCE.md           ← 本文档
```

---

## 关键代码片段

### 1. 车道选择跳转
```javascript
// ReviewSelection.jsx
const handleTrackSelection = (track) => {
  navigate('/smart-review', { 
    state: { 
      track: track,
      level: track === 'standard' ? 'L4' : 'L5'
    }
  });
};
```

### 2. 接收路由参数
```javascript
// SmartReview.jsx
const location = useLocation();
const { track = 'standard', level = 'L4' } = location.state || {};
```

### 3. 动态题型逻辑
```javascript
// SmartReview.jsx
const getCurrentLevel = () => {
  if (appearanceCount > 0) {
    return 'L4'; // 答错降级
  }
  return level; // 首次使用车道等级
};
```

### 4. 车道徽章显示
```javascript
// SimpleHeader.jsx
const getTrackInfo = () => {
  if (track === 'fast') {
    return { icon: '⚡', label: '闪电车道', color: 'yellow' };
  } else if (track === 'standard') {
    return { icon: '📘', label: '标准车道', color: 'blue' };
  }
  return null;
};
```

---

## CSS 关键类名

### ReviewSelection
```css
.selection-card         /* 卡片容器 */
.track-card            /* 车道卡片 */
.track-features        /* 车道特性列表 */
.card-bg-circle.blue   /* 标准车道背景 */
.card-bg-circle.yellow /* 闪电车道背景 */
.full-width           /* 词库横跨两列 */
```

### SimpleHeader
```css
.simple-header__track-badge       /* 车道徽章 */
.simple-header__track-badge.blue  /* 标准车道样式 */
.simple-header__track-badge.yellow /* 闪电车道样式 */
.simple-header__mode-badge        /* 题型徽章 */
.simple-header__progress-badge    /* 进度徽章 */
```

---

## 调试技巧

### 1. 查看路由参数
```javascript
// 在 SmartReview.jsx 中添加
console.log('Route state:', location.state);
```

### 2. 查看当前题型
```javascript
// 在 SmartReview.jsx 中添加
console.log('Current level:', currentLevel);
console.log('Appearance count:', appearanceCount);
```

### 3. 检查车道信息
```javascript
// 在 SimpleHeader.jsx 中添加
console.log('Track info:', trackInfo);
```

---

## 常见问题排查

### ❓ 点击车道按钮没有跳转
**检查：**
1. `handleTrackSelection` 函数是否正确绑定
2. `navigate` 是否正确导入
3. 控制台是否有错误信息

### ❓ Header 没有显示车道徽章
**检查：**
1. `track` 参数是否正确传递
2. `SimpleHeader` 是否接收 `track` prop
3. `getTrackInfo()` 返回值是否正确

### ❓ 题型没有按预期切换
**检查：**
1. `level` 参数是否正确接收
2. `getCurrentLevel()` 逻辑是否正确
3. `appearanceCount` 是否正确计算

### ❓ 样式显示不正常
**检查：**
1. CSS 文件是否正确导入
2. 类名是否拼写正确
3. 浏览器开发者工具查看应用的样式

---

## 快速启动

```bash
# 1. 确保依赖已安装
npm install

# 2. 启动开发服务器
npm run dev

# 3. 访问页面
浏览器打开: http://localhost:5173/review-selection

# 4. 开始测试
点击标准车道或闪电车道按钮
```

---

## 数据流向图（简化版）

```
ReviewSelection
    │
    ├─ 标准车道 → { track: 'standard', level: 'L4' }
    │                        ↓
    └─ 闪电车道 → { track: 'fast', level: 'L5' }
                             ↓
                      SmartReview
                             ↓
                   getCurrentLevel()
                    ├─ 首次 → level
                    └─ 重复 → 'L4'
                             ↓
                      显示对应题型
                    ├─ L4 → phrase
                    └─ L5 → sentence
```

---

## 颜色参考

```css
/* 标准车道 - 蓝色 */
--blue-light: #dbeafe;    /* 背景圆 */
--blue-main: #3b82f6;     /* 图标、徽章 */

/* 闪电车道 - 黄色 */
--yellow-light: #fef3c7;  /* 背景圆 */
--yellow-main: #fbbf24;   /* 图标 */
--yellow-dark: #f59e0b;   /* 按钮、徽章 */

/* 词库 - 灰色 */
--gray-light: #f8fafc;    /* 背景圆 */
--gray-medium: #f1f5f9;   /* 图标背景 */
--gray-dark: #94a3b8;     /* 文字、徽章 */

/* 通用 */
--text-dark: #0f172a;     /* 主要文字 */
--text-medium: #64748b;   /* 次要文字 */
```

---

## 性能优化提示

1. **图标优化**：使用 `lucide-react` 按需导入
2. **样式优化**：CSS 按页面分离，避免全局污染
3. **路由优化**：使用 React Router 的 lazy loading（如需）
4. **状态优化**：使用 Zustand 集中管理状态

---

## 浏览器兼容性

| 浏览器 | 版本 | 支持度 |
|--------|------|--------|
| Chrome | 90+ | ✅ 完全支持 |
| Edge | 90+ | ✅ 完全支持 |
| Firefox | 88+ | ✅ 完全支持 |
| Safari | 14+ | ✅ 完全支持 |
| Mobile | iOS 14+, Android 10+ | ✅ 完全支持 |

---

## 快速链接

- 📖 [完整实现总结](./IMPLEMENTATION_COMPLETE.md)
- 🔄 [重构说明](./REVIEW_SELECTION_REFACTOR.md)
- 📊 [流程图](./REVIEW_FLOW_DIAGRAM.md)
- ✅ [待办事项](./NEXT_STEPS_TODO.md)

---

**更新时间**: 2026-01-30  
**版本**: v2.0
