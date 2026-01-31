# 单词流转逻辑重构设计文档

## 一、新流程概述

```
Phase 1（30个词 - 所有词做一遍）
    │
    │  教师点击"下一阶段" → 未做的题判定为【正确】
    │
    ├─→ P1 错词 ──→ 分组（5个/组）
    │                  │
    │                  ├─→ 组1(5个) → P2(三环节) → P3(不退回)
    │                  │
    │                  └─→ 组2(剩余) → P2(三环节) → P3(不退回)
    │
    └─→ P1 对词 ──→ 直接 P3(门神) → 完成 ✓（失败也直接结束）
```

---

## 二、新增状态

### Store 新增字段

```javascript
// 单词流转状态
wordFlow: {
  /** P1 错词 ID 列表 */
  p1WrongWordIds: [],
  
  /** P1 对词 ID 列表 */
  p1CorrectWordIds: [],
  
  /** 当前处理批次: 'wrong' | 'correct' | null */
  currentBatch: null,
  
  /** 当前组索引（从0开始） */
  currentGroupIndex: 0,
  
  /** 每组大小 */
  groupSize: 5,
  
  /** P1 是否已完成分流 */
  p1Finalized: false,
}
```

---

## 三、核心逻辑

### 3.1 P1 结束处理

```javascript
finalizeP1() {
  // 1. 收集 P1 错词和对词
  const wrongIds = wordList
    .filter(w => wordResults[w.id]?.p1Result === false)
    .map(w => w.id);
    
  const correctIds = wordList
    .filter(w => wordResults[w.id]?.p1Result === true || 
                 wordResults[w.id]?.p1Result === undefined) // 未做的判定为正确
    .map(w => w.id);
  
  // 2. 更新状态
  set({
    wordFlow: {
      p1WrongWordIds: wrongIds,
      p1CorrectWordIds: correctIds,
      currentBatch: wrongIds.length > 0 ? 'wrong' : 'correct',
      currentGroupIndex: 0,
      p1Finalized: true,
    }
  });
  
  // 3. 决定下一阶段
  if (wrongIds.length > 0) {
    setPhase('P2'); // 有错词，先过 P2
  } else {
    setPhase('P3'); // 无错词，直接过 P3
  }
}
```

### 3.2 获取当前处理的单词列表

```javascript
getCurrentBatchWords() {
  const { wordFlow, wordList } = get();
  const { currentBatch, currentGroupIndex, groupSize, p1WrongWordIds, p1CorrectWordIds } = wordFlow;
  
  // 获取当前批次的所有词
  const batchIds = currentBatch === 'wrong' ? p1WrongWordIds : p1CorrectWordIds;
  
  // 对于错词批次，分组处理
  if (currentBatch === 'wrong') {
    const startIdx = currentGroupIndex * groupSize;
    const endIdx = startIdx + groupSize;
    const groupIds = batchIds.slice(startIdx, endIdx);
    return wordList.filter(w => groupIds.includes(w.id));
  }
  
  // 对于对词批次，全部一起过 P3
  return wordList.filter(w => batchIds.includes(w.id));
}
```

### 3.3 组/批次推进

```javascript
advanceToNextGroup() {
  const { wordFlow } = get();
  const { currentBatch, currentGroupIndex, groupSize, p1WrongWordIds, p1CorrectWordIds } = wordFlow;
  
  if (currentBatch === 'wrong') {
    const totalGroups = Math.ceil(p1WrongWordIds.length / groupSize);
    
    if (currentGroupIndex + 1 < totalGroups) {
      // 还有下一组错词
      set({
        wordFlow: { ...wordFlow, currentGroupIndex: currentGroupIndex + 1 },
        currentPhase: 'P2', // 重新开始 P2
      });
    } else {
      // 所有错词处理完，切换到对词批次
      set({
        wordFlow: { ...wordFlow, currentBatch: 'correct', currentGroupIndex: 0 },
        currentPhase: 'P3', // 对词直接 P3
      });
    }
  } else if (currentBatch === 'correct') {
    // 对词批次完成
    setPhase('Summary');
  }
}
```

---

## 四、组件修改

### 4.1 Classroom.jsx

- P1 完成后调用 `finalizeP1()` 而不是直接 `setPhase('P2')`
- 教师点击"下一阶段"时，未做的题标记为正确后再调用 `finalizeP1()`

### 4.2 P2Container.jsx

- 使用 `getCurrentBatchWords()` 获取当前需要训练的单词
- 完成后根据当前批次决定下一步：
  - 错词批次 → P3
  - 对词批次 → 不会进入 P2

### 4.3 P3Container.jsx

- 使用 `getCurrentBatchWords()` 获取当前需要验收的单词
- P3 失败不退回 P2
- 完成后调用 `advanceToNextGroup()` 决定下一步

---

## 五、教师控制

### "下一阶段"按钮逻辑

```javascript
// 当教师在 P1 点击"下一阶段"时
if (currentPhase === 'P1') {
  // 1. 未做的题全部标记为正确
  wordList.forEach(word => {
    if (wordResults[word.id]?.p1Result === undefined) {
      wordResults[word.id] = { ...wordResults[word.id], p1Result: true };
    }
  });
  
  // 2. 调用 finalizeP1 进行分流
  finalizeP1();
}
```

---

## 六、实现步骤

1. ✅ 设计文档
2. ✅ 修改 Store：添加 wordFlow 状态和相关 actions
3. ✅ 修改 Classroom.jsx：P1 完成后调用 finalizeP1
4. ✅ 修改 P2Container.jsx：使用新的单词获取逻辑
5. ✅ 修改 P3Container.jsx：使用新的单词获取逻辑，不退回 P2
6. ✅ 修改教师控制逻辑：处理"下一阶段"按钮
7. [ ] 测试流程

---

**文档版本**：v1.1  
**创建时间**：2026-01-27  
**更新时间**：2026-01-27
