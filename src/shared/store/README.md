# Store使用指南

## 状态机Store (useWordStore)

### 初始化

```javascript
import { useWordStore } from '@/shared/store';

function MyComponent() {
  const initializeFromMockData = useWordStore(state => state.initializeFromMockData);
  
  useEffect(() => {
    initializeFromMockData();
  }, []);
}
```

### 查询状态

```javascript
// 获取单词状态
const wordState = useWordStore(state => state.getWordState(wordId));

// 获取颜色状态
const status = useWordStore(state => state.getWordStatus(wordId));

// 获取统计信息
const stats = useWordStore(state => state.getStats());

// 获取需要复习的单词
const dueWords = useWordStore(state => state.getDueWords());
```

### 状态转换

```javascript
// Phase 3验收通过 → Yellow
transitionToYellow(wordId);

// 验收失败 → Red
transitionToRed(wordId, ['错误拼写1', '错误拼写2']);

// Red Box修补成功 → Yellow
rescueToYellow(wordId);

// 复习达标 → Green
transitionToGreen(wordId);

// 复习成功（保持Yellow）
reviewSuccess(wordId);

// 复习失败 → Red
reviewFailToRed(wordId, ['错误拼写']);
```

### 状态转换流程图

```
初始 → P1-P3 → Yellow → 复习5次+30天 → Green
                ↓
                错误≥2次
                ↓
               Red → Red Box → Yellow
```

## 学习进度Store (useLearningStore)

### 开始课堂

```javascript
import { useLearningStore } from '@/shared/store';

function ClassroomPage() {
  const startClassroom = useLearningStore(state => state.startClassroom);
  
  const handleStart = () => {
    // 开始Model A课堂，使用随机单词
    startClassroom('A');
    
    // 或指定单词列表
    startClassroom('A', [1, 2, 3, 4, 5]);
  };
}
```

### 管理进度

```javascript
// 获取当前Phase
const currentPhase = useLearningStore(state => state.currentPhase);

// 进入下一个Phase
const nextPhase = useLearningStore(state => state.nextPhase);

// 获取当前单词
const currentWordId = useLearningStore(state => state.currentWordId);

// 下一个单词
const nextWord = useLearningStore(state => state.nextWord);

// 获取进度
const progress = useLearningStore(state => state.getProgress());
const accuracy = useLearningStore(state => state.getAccuracy());
```

### 答题交互

```javascript
// 设置题目
setCurrentQuestion(questionData);

// 更新答案
setUserAnswer(answer);

// 提交答案
const record = submitAnswer(answer, isCorrect);
```

### 生成报告

```javascript
// 完成课堂
completeClassroom();

// 生成报告
const report = generateReport();
console.log(report);
// {
//   model: 'A',
//   totalWords: 15,
//   completedWords: 15,
//   accuracy: '85.5',
//   totalTime: 3300,
//   ...
// }
```

## UI状态Store (useUIStore)

### 加载状态

```javascript
import { useUIStore } from '@/shared/store';

const { setLoading } = useUIStore();

// 显示加载
setLoading(true, '正在加载...');

// 隐藏加载
setLoading(false);
```

### 弹窗控制

```javascript
const { openModal, closeModal } = useUIStore();

// 打开Assist弹窗
openModal('assist');

// 关闭弹窗
closeModal('assist');

// 关闭所有弹窗
closeAllModals();
```

### 提示消息

```javascript
const { showToast } = useUIStore();

// 成功提示
showToast('success', '答案正确！');

// 错误提示
showToast('error', '答案错误，请重试');

// 信息提示
showToast('info', '提示：注意单词的拼写');
```

### 动画触发

```javascript
const { triggerAnimation } = useUIStore();

// 触发亮灯动画
triggerAnimation('lightUp');

// 触发庆祝动画
triggerAnimation('celebrate');

// 触发震动动画
triggerAnimation('shake');
```

### 反馈显示

```javascript
const { showFeedback, hideFeedback } = useUIStore();

// 显示正确反馈
showFeedback('correct', '太棒了！');

// 显示错误反馈
showFeedback('incorrect', '再试一次');

// 隐藏反馈
hideFeedback();
```

## 组合使用示例

### Phase 3验收流程

```javascript
function Phase3Check() {
  const currentWordId = useLearningStore(state => state.currentWordId);
  const submitAnswer = useLearningStore(state => state.submitAnswer);
  const errorCount = useLearningStore(state => state.errorCount);
  const transitionToYellow = useWordStore(state => state.transitionToYellow);
  const transitionToRed = useWordStore(state => state.transitionToRed);
  const triggerAnimation = useUIStore(state => state.triggerAnimation);
  const showToast = useUIStore(state => state.showToast);
  
  const handleSubmit = (answer, correctAnswer) => {
    const isCorrect = answer.toLowerCase() === correctAnswer.toLowerCase();
    
    // 记录答案
    submitAnswer(answer, isCorrect);
    
    if (isCorrect) {
      // 正确 → Yellow
      transitionToYellow(currentWordId);
      triggerAnimation('lightUp');
      showToast('success', '太棒了！单词已进入复习队列');
    } else {
      // 错误
      if (errorCount + 1 >= 2) {
        // 错误≥2次 → Red
        transitionToRed(currentWordId, [answer]);
        showToast('error', '这个单词需要在下节课修补');
      } else {
        // 还可以再试
        triggerAnimation('shake');
        showToast('info', '再试一次');
      }
    }
  };
  
  return (
    // ... UI
  );
}
```

### Phase 4复习流程

```javascript
function Phase4Review() {
  const currentWordId = useLearningStore(state => state.currentWordId);
  const reviewSuccess = useWordStore(state => state.reviewSuccess);
  const reviewSuccessWithReset = useWordStore(state => state.reviewSuccessWithReset);
  const reviewFailToRed = useWordStore(state => state.reviewFailToRed);
  
  const handleReviewResult = (userAnswer, correctAnswer) => {
    const accuracy = calculateAccuracy(userAnswer, correctAnswer);
    
    if (accuracy === 100) {
      // Level 0: 完全正确
      reviewSuccess(currentWordId);
    } else if (accuracy > 80) {
      // Level 1: 手滑提示
      showHandSlipHint();
    } else if (accuracy >= 50) {
      // Level 2: 降级助推
      showSkeletonHint();
      // 如果助推后成功
      reviewSuccessWithReset(currentWordId);
    } else {
      // Level 3: 熔断锁定
      reviewFailToRed(currentWordId, [userAnswer]);
    }
  };
  
  return (
    // ... UI
  );
}
```

## 数据流

```
用户操作 → useLearningStore (记录进度)
        ↓
    submitAnswer (判断正确性)
        ↓
    useWordStore (状态转换)
        ↓
    useUIStore (UI反馈)
        ↓
    更新界面
```

