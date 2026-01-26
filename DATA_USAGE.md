# 📊 数据使用说明文档

## 🎯 数据文件总览

本项目现已完整集成 `word.md` 中的 30 个单词数据，并生成了以下数据文件：

### 1. `src/shared/data/mockWords.js` ✅
**30个单词的完整数据**，包含：
- 基础信息：单词、音标、音节、词性、释义
- 训练数据：干扰项（Phase 2 听音辨形）
- 语境数据：短语、例句（Phase 1、Phase 3）
- 记忆数据：口诀、词根、图片描述（武器库）

### 2. `src/shared/data/mockStories.js` ✅
**2个故事数据**（同事负责的 Phase 5）：
- Story 01：社交篇（13个单词）
- Story 02：成长篇（16个单词）

### 3. `src/shared/data/mockClozeTest.js` ✅
**1个完形填空数据**（同事负责的 Phase 6）：
- 主题：野外生存
- 4个挖空题（environment, trouble, communicate, valuable）

---

## 📋 数据字段映射表

| 数据字段 | 用途场景 | 对应组件 | 状态 |
|---------|---------|---------|------|
| `word.word` | 目标单词 | 所有组件 | ✅ |
| `word.sound.phonetic` | 音标显示 | ListenAndChoose | ✅ |
| `word.core.syllables` | 音节拆分 | WeaponPopup（拆音节） | ✅ |
| `word.meaning.chinese` | 中文释义 | ContextProbe, FlashRecognize | ✅ |
| `word.meaning.english` | 英文释义 | 武器库 | ✅ |
| `word.context[0].phrase` | 短语（英文） | ContextProbe（Phase 1） | ⚠️ 需要更新 |
| `word.context[0].phraseCn` | 短语（中文） | ContextProbe（Phase 1） | ⚠️ 需要更新 |
| `word.context[0].sentence` | 例句（英文） | FullSpelling（Phase 3） | ✅ |
| `word.context[0].sentenceCn` | 例句（中文） | FullSpelling（Phase 3） | ✅ |
| `word.training.distractors` | 干扰项（3个） | ListenAndChoose（Phase 2） | ✅ 已更新 |
| `word.training.flashMeanings` | 闪视干扰项 | FlashRecognize（Phase 2） | ⚠️ 需要更新 |
| `word.logic.mnemonic` | 记忆口诀 | WeaponPopup（读口诀） | ✅ |
| `word.logic.etymology` | 词根拆解 | WeaponPopup（讲词根） | ✅ |
| `word.visual.description` | 图片描述 | WeaponPopup（看图片） | ✅ |

---

## 🔄 组件更新状态

### ✅ 已更新组件

#### 1. ListenAndChoose.jsx（听音辨形）
```javascript
// ✅ 现在使用 word.training.distractors
const distractors = word.training?.distractors || [];
// 示例：['adopt', 'adept', 'depth']
```

### ⚠️ 需要更新的组件

#### 2. ContextProbe.jsx（Phase 1 精准筛查）
**当前问题**：可能使用 `context[0].sentence` 作为语境  
**建议修改**：使用 `context[0].phrase` 作为语境（更短更精准）

```javascript
// 建议的修改：
const phrase = word.context[0]?.phrase || ''; // "adapt to new changes"
const phraseCn = word.context[0]?.phraseCn || ''; // "适应新的变化"
```

#### 3. FlashRecognize.jsx（Phase 2 闪视辨析）
**当前问题**：可能随机生成干扰项释义  
**建议修改**：使用 `word.training.flashMeanings` 作为干扰项

```javascript
// 建议的修改：
const distractors = word.training?.flashMeanings || [];
// 示例：['收养', '熟练的']
// 正确答案：word.meaning.chinese（自动加入）
```

---

## 🚀 如何使用新数据

### 在组件中导入数据

```javascript
// 导入单词数据
import mockWords, { getWordById } from '../../../shared/data/mockWords';

// 获取单词
const word = getWordById(1); // 获取 id=1 的单词（adapt）
console.log(word.word); // "adapt"
console.log(word.training.distractors); // ["adopt", "adept", "depth"]
```

### 在组件中使用短语

```javascript
// Phase 1: 使用短语作为语境
const phrase = word.context[0]?.phrase; // "adapt to new changes"
const phraseCn = word.context[0]?.phraseCn; // "适应新的变化"

// 高亮目标单词
const highlightedPhrase = phrase.replace(
  word.word, 
  `<strong>${word.word}</strong>`
);
```

### 在组件中使用干扰项

```javascript
// Phase 2 听音辨形：使用干扰项
const distractors = word.training?.distractors || [];
const options = [
  { text: word.word, isCorrect: true },
  ...distractors.map(d => ({ text: d, isCorrect: false }))
].sort(() => Math.random() - 0.5);
```

---

## 📝 同事的开发指南

### Phase 5: AI个性化语境闭环

**数据文件**：`src/shared/data/mockStories.js`

```javascript
import mockStories from '../../../shared/data/mockStories';

// 获取故事
const story = mockStories[0]; // 社交篇
console.log(story.theme); // "社交篇"
console.log(story.text); // 故事文本（目标词用 ** 包围）

// 解析故事文本
import { parseStoryText } from '../../../shared/data/mockStories';
const { plainText, highlightedWords } = parseStoryText(story.text);
```

### Phase 6: 里程碑大考

**数据文件**：`src/shared/data/mockClozeTest.js`

```javascript
import mockClozeTest, { checkAnswers } from '../../../shared/data/mockClozeTest';

// 获取完形填空
console.log(mockClozeTest.title); // "野外生存"
console.log(mockClozeTest.blanks); // 4个挖空题

// 验证答案
const userAnswers = {
  1: 'environment',
  2: 'trouble',
  3: 'communicate',
  4: 'valuable'
};
const result = checkAnswers(userAnswers);
console.log(result.score); // 4
console.log(result.percentage); // "100.0"
```

---

## 🧪 测试新数据

### 快速测试命令

```bash
# 1. 启动项目
npm run dev

# 2. 打开浏览器访问
http://localhost:5173

# 3. 测试流程
# - 选择 Model A，双屏模式
# - 进入 Phase 1，查看是否显示短语
# - 进入 Phase 2 听音辨形，查看是否显示正确的干扰项
# - 进入 Phase 3，查看是否显示例句
```

### 预期结果

✅ **Phase 1**：应该显示短语（如 "adapt to new changes"）  
✅ **Phase 2 听音辨形**：应该显示准确的形近词（如 adapt, adopt, adept, depth）  
✅ **Phase 2 闪视辨析**：应该显示准确的释义干扰项  
✅ **Phase 3**：应该显示完整例句  
✅ **武器库**：点击"拆音节"应该显示 "a·dapt"  
✅ **武器库**：点击"读口诀"应该显示记忆口诀  

---

## ⚠️ 注意事项

### 1. 单音节词特殊处理

根据 `word.md` 的说明，以下单词是单音节词，不拆分：
- shy, join, skill, trust

在武器库"拆音节"功能中，应该：
```javascript
if (word.core.isMonosyllabic) {
  // 不拆分，整体高亮
  return word.word; // "shy"
} else {
  // 正常拆分
  return word.core.syllables; // "a·dapt"
}
```

### 2. 数据完整性检查

如果数据缺失，组件应该有备用方案：

```javascript
// 良好的防御性编程
const distractors = word.training?.distractors || ['accept', 'except', 'effect'];
const phrase = word.context[0]?.phrase || word.context[0]?.sentence || word.word;
const mnemonic = word.logic?.mnemonic || '暂无记忆口诀';
```

### 3. 图片资源

数据中的 `imageUrl` 目前指向 `/images/` 目录：
```javascript
word.visual.imageUrl; // "/images/adapt.jpg"
```

**如果图片不存在**，应该：
- 显示占位图
- 或使用 `word.visual.description` 作为文字描述

---

## 📚 延伸阅读

- **原始数据**：`word.md`（包含完整的字段说明和示例）
- **数据结构**：`word.md` 第六部分（TypeScript 类型定义）
- **协作指南**：`COLLABORATION.md`

---

**更新时间**：2026-01-26  
**数据版本**：V2.0  
**单词总数**：30个  

🎉 所有数据已完整集成，可以开始测试和开发！

