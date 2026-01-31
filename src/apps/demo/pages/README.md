# Demo Pages 模块结构说明

## 📁 文件组织规范

本目录包含 Demo 应用的所有页面组件。每个复杂页面都被拆分成独立的子模块，便于维护和复用。

## 🗂️ 目录结构

```
pages/
├── AIContext/              # AI语境训练模块
│   ├── index.js           # 模块导出
│   ├── ModeSelection.jsx  # 模式选择组件
│   ├── ModeSelection.css
│   ├── StoryMode.jsx      # 故事精读模式
│   ├── StoryMode.css
│   ├── ClozeMode.jsx      # 完形填空模式
│   ├── ClozeMode.css
│   ├── WordTooltip.jsx    # 单词提示浮层
│   └── WordTooltip.css
│
├── SmartReview/           # 智能复习模块
│   ├── index.js
│   ├── ConfettiCelebration.jsx  # 庆祝动画
│   ├── ConfettiCelebration.css
│   ├── WordInput.jsx      # 单词输入组件
│   └── WordInput.css
│
├── MilestoneExam/         # 里程碑大考模块
│   ├── index.js
│   ├── ExamPreview.jsx    # 考试预览页
│   ├── ExamPreview.css
│   ├── ExamComplete.jsx   # 考试完成页
│   └── ExamComplete.css
│
├── WordLibrary/           # 词库管理模块
│   ├── index.js
│   ├── FilterChips.jsx    # 筛选器组件
│   ├── FilterChips.css
│   ├── WordTable.jsx      # 单词表格
│   └── WordTable.css
│
├── AIContext.jsx          # AI语境主页面
├── AIContext.css
├── SmartReview.jsx        # 智能复习主页面
├── SmartReview.css
├── MilestoneExam.jsx      # 里程碑大考主页面
├── MilestoneExam.css
├── WordLibrary.jsx        # 词库管理主页面
├── WordLibrary.css
├── ReviewSelection.jsx    # 复习选择页
├── ReviewSelection.css
└── README.md              # 本文档
```

## 📋 命名规范

### 文件命名
- **页面组件**: PascalCase，如 `AIContext.jsx`
- **子组件**: PascalCase，如 `ModeSelection.jsx`
- **样式文件**: 与组件同名，如 `ModeSelection.css`
- **索引文件**: `index.js` (用于导出模块)

### 组件命名
- **页面组件**: 功能描述 + 可选后缀，如 `AIContext`, `SmartReview`
- **UI组件**: 功能描述，如 `WordTooltip`, `FilterChips`
- **容器组件**: 功能 + Mode/Container，如 `StoryMode`, `ClozeMode`

### CSS类命名
- **BEM规范**: `block__element--modifier`
- **示例**: 
  - `.mode-card` (块)
  - `.mode-card__title` (元素)
  - `.mode-card--active` (修饰符)

## 🎯 模块职责

### AIContext 模块
**路由**: `/ai-context`
**功能**: AI语境闭环训练，包含故事精读和完形填空两种模式

**子组件**:
- `ModeSelection`: 训练模式选择界面
- `StoryMode`: 故事精读模式，支持单词悬停提示
- `ClozeMode`: 完形填空模式，支持选项选择和解析
- `WordTooltip`: 单词悬停提示组件（可复用）

### SmartReview 模块
**路由**: `/smart-review`
**功能**: 智能复习系统，基于记忆曲线的拼写练习

**子组件**:
- `ConfettiCelebration`: 答对时的庆祝动画效果
- `WordInput`: 单词拼写输入组件，支持字母槽位显示

### MilestoneExam 模块
**路由**: `/milestone`
**功能**: 里程碑大考，检验学习成果

**子组件**:
- `ExamPreview`: 考试开始前的预览页面
- `ExamComplete`: 考试完成后的结果展示页面

### WordLibrary 模块
**路由**: `/word-library`
**功能**: 词库管理中心，查看所有单词状态

**子组件**:
- `FilterChips`: 单词状态筛选器（全部/红/黄/绿）
- `WordTable`: 单词列表表格，支持发音和状态显示

### ReviewSelection 模块
**路由**: `/review-selection`
**功能**: 复习入口选择页面，连接复习和词库两个功能

**特点**: 单文件组件，无需拆分

## 🔧 使用指南

### 导入方式

**推荐方式** (使用索引文件):
```javascript
import { ModeSelection, StoryMode } from './AIContext';
```

**直接导入**:
```javascript
import ModeSelection from './AIContext/ModeSelection';
```

### 添加新组件

1. 在对应模块文件夹下创建组件文件
2. 创建对应的CSS文件
3. 在 `index.js` 中导出组件
4. 在主页面中导入使用

### 修改现有组件

1. 找到对应的子组件文件
2. 修改组件逻辑或样式
3. 确保不影响其他使用该组件的地方

## 📝 维护建议

### 何时拆分组件？
- 单个文件超过 300 行代码
- 某段代码在多处重复使用
- 某个功能模块相对独立
- 需要单独测试某个功能

### 何时保持单文件？
- 组件逻辑简单（< 200 行）
- 没有可复用的子模块
- 组件之间耦合度高

### 代码质量检查
- ✅ 每个组件职责单一
- ✅ 组件间通过 props 通信
- ✅ CSS 类名遵循 BEM 规范
- ✅ 文件命名清晰一致
- ✅ 适当的注释和文档

## 🚀 下一步优化建议

1. **性能优化**: 使用 `React.memo` 优化子组件渲染
2. **类型安全**: 添加 PropTypes 或 TypeScript
3. **测试覆盖**: 为关键组件添加单元测试
4. **样式优化**: 考虑使用 CSS Modules 或 styled-components
5. **国际化**: 提取文本到语言包

---

**最后更新**: 2026-01-29
**维护者**: 开发团队
