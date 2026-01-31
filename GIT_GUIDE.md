# 🚀 Git 上传指南

## 📋 目录

1. [首次上传到 GitHub](#首次上传到-github)
2. [日常开发流程](#日常开发流程)
3. [分支管理](#分支管理)
4. [常用命令速查](#常用命令速查)
5. [问题排查](#问题排查)

---

## 首次上传到 GitHub

### Step 1: 在 GitHub 上创建仓库

1. 访问 [GitHub](https://github.com/)
2. 点击右上角 ➕ → **New repository**
3. 填写仓库信息：
   - **Repository name**: `s9-VocabularyLesson2.0-v1.0`
   - **Description**: `51Talk 单词学习产品 V2.0 - 双端实时互动教学系统`
   - **Visibility**: Private（推荐）或 Public
   - **不要勾选** "Initialize this repository with a README"（我们已经有代码了）
4. 点击 **Create repository**

### Step 2: 初始化本地 Git 仓库

在项目根目录执行：

```bash
# 1. 初始化 Git 仓库（如果还没初始化）
git init

# 2. 添加所有文件到暂存区
git add .

# 3. 提交初始代码
git commit -m "chore: 初始化项目 - Model A/B 核心功能完成"

# 4. 设置默认分支为 main
git branch -M main

# 5. 关联远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/s9-VocabularyLesson2.0-v1.0.git

# 6. 推送到 GitHub
git push -u origin main
```

### Step 3: 创建 .gitignore 文件（如果没有）

在项目根目录创建 `.gitignore` 文件：

```bash
# 创建 .gitignore
cat > .gitignore << 'EOF'
# 依赖
node_modules/
package-lock.json
yarn.lock
pnpm-lock.yaml

# 构建产物
dist/
dist-ssr/
*.local

# 编辑器
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# 日志
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# 环境变量
.env
.env.local
.env.*.local

# 测试
coverage/
.nyc_output/

# 临时文件
*.tmp
.cache/
EOF

# 提交 .gitignore
git add .gitignore
git commit -m "chore: 添加 .gitignore"
git push
```

---

## 日常开发流程

### 你的工作流程（Model A/B）

```bash
# 1. 创建你的功能分支（首次）
git checkout -b feature/phase1-3-updates

# 2. 开发过程中频繁提交
git add .
git commit -m "feat: 优化 Phase 2 听音辨形交互"

# 3. 推送到远程仓库
git push origin feature/phase1-3-updates

# 4. 如果 main 分支有更新，同步到你的分支
git checkout main
git pull origin main
git checkout feature/phase1-3-updates
git merge main

# 5. 完成后在 GitHub 上创建 Pull Request
# 访问仓库页面，点击 "Compare & pull request"
```

### 同事的工作流程（额外模块）

```bash
# 1. 克隆仓库
git clone https://github.com/YOUR_USERNAME/s9-VocabularyLesson2.0-v1.0.git
cd s9-VocabularyLesson2.0-v1.0

# 2. 安装依赖
npm install

# 3. 创建功能分支
git checkout -b feature/extra-modules

# 4. 开发过程中频繁提交
git add .
git commit -m "feat: 实现 Phase 4 智能复习功能"

# 5. 推送到远程仓库
git push origin feature/extra-modules

# 6. 完成后创建 Pull Request
```

---

## 分支管理

### 分支命名规范

```
main                          # 主分支（受保护）
├── feature/phase1-3-updates  # 你的功能分支
├── feature/extra-modules     # 同事的功能分支
├── hotfix/fix-phase2-bug     # 紧急修复分支
└── release/v1.0.0            # 发布分支
```

### 分支类型说明

| 类型 | 命名格式 | 用途 | 示例 |
|------|---------|------|------|
| `feature/` | `feature/功能名称` | 新功能开发 | `feature/phase4-review` |
| `fix/` | `fix/问题描述` | Bug 修复 | `fix/redbox-interaction` |
| `hotfix/` | `hotfix/紧急问题` | 紧急修复 | `hotfix/production-crash` |
| `refactor/` | `refactor/重构内容` | 代码重构 | `refactor/classroom-store` |
| `docs/` | `docs/文档类型` | 文档更新 | `docs/collaboration-guide` |

---

## 常用命令速查

### 基础操作

```bash
# 查看状态
git status

# 查看修改内容
git diff

# 查看提交历史
git log --oneline --graph

# 撤销工作区修改
git checkout -- <文件名>

# 撤销暂存区修改
git reset HEAD <文件名>
```

### 分支操作

```bash
# 查看所有分支
git branch -a

# 创建新分支
git checkout -b <分支名>

# 切换分支
git checkout <分支名>

# 删除本地分支
git branch -d <分支名>

# 删除远程分支
git push origin --delete <分支名>
```

### 同步操作

```bash
# 拉取远程更新
git pull origin main

# 推送到远程
git push origin <分支名>

# 强制推送（谨慎使用！）
git push -f origin <分支名>

# 获取远程分支信息
git fetch origin
```

### 冲突解决

```bash
# 1. 尝试合并时遇到冲突
git merge main
# Auto-merging src/App.jsx
# CONFLICT (content): Merge conflict in src/App.jsx

# 2. 查看冲突文件
git status

# 3. 手动编辑冲突文件，保留需要的内容
# 冲突标记：
# <<<<<<< HEAD
# 你的修改
# =======
# 对方的修改
# >>>>>>> main

# 4. 标记为已解决
git add <冲突文件>

# 5. 完成合并
git commit -m "merge: 解决与 main 分支的冲突"
```

---

## 提交信息规范

### Commit Message 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

| Type | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat: 添加 Phase 2 闪视辨析功能` |
| `fix` | Bug 修复 | `fix: 修复 P3 拼写验证逻辑错误` |
| `refactor` | 重构 | `refactor: 重构 RedBox 卡片组件` |
| `style` | 样式调整 | `style: 优化 Phase 1 UI 布局` |
| `docs` | 文档更新 | `docs: 更新协作指南` |
| `test` | 测试相关 | `test: 添加 Phase 2 单元测试` |
| `chore` | 构建/工具 | `chore: 更新依赖版本` |
| `perf` | 性能优化 | `perf: 优化单词数据加载速度` |

### 示例

```bash
# 好的提交信息 ✅
git commit -m "feat(phase2): 实现听音辨形四选一功能"
git commit -m "fix(redbox): 修复教师点击音标学生端不显示的问题"
git commit -m "refactor(home): 拆分 ModelCards 和 ExtraModules 组件"

# 不好的提交信息 ❌
git commit -m "更新"
git commit -m "修改了一些东西"
git commit -m "fix bug"
```

---

## 问题排查

### Q1: `git push` 时提示 "failed to push"

**原因**：远程仓库有新的提交，你的本地代码落后了。

**解决**：
```bash
# 先拉取远程更新
git pull origin <分支名>

# 如果有冲突，解决冲突后再推送
git push origin <分支名>
```

### Q2: 提示 "remote: Permission denied"

**原因**：没有权限或 SSH 密钥配置问题。

**解决**：
```bash
# 方法 1: 使用 HTTPS（推荐）
git remote set-url origin https://github.com/YOUR_USERNAME/s9-VocabularyLesson2.0-v1.0.git

# 方法 2: 配置 SSH（一次性配置）
# 生成 SSH 密钥
ssh-keygen -t ed25519 -C "your_email@example.com"

# 添加公钥到 GitHub
# 访问 GitHub Settings → SSH and GPG keys → New SSH key
# 粘贴 ~/.ssh/id_ed25519.pub 的内容
```

### Q3: 不小心提交了敏感信息

**解决**：
```bash
# 1. 如果还没推送，撤销最后一次提交
git reset --soft HEAD^

# 2. 如果已推送，需要强制覆盖（谨慎！）
git reset --hard HEAD^
git push -f origin <分支名>

# 3. 如果多次提交都有问题，使用 filter-branch
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch <敏感文件>" \
  --prune-empty --tag-name-filter cat -- --all
```

### Q4: 想要回退到之前的某个版本

**解决**：
```bash
# 1. 查看提交历史
git log --oneline

# 2. 回退到指定版本（保留修改）
git reset --soft <commit_id>

# 3. 回退到指定版本（丢弃修改）
git reset --hard <commit_id>

# 4. 推送到远程（需要强制推送）
git push -f origin <分支名>
```

### Q5: 忘记切换分支，在 main 上开发了

**解决**：
```bash
# 1. 暂存当前修改
git stash

# 2. 切换到正确的分支
git checkout feature/phase1-3-updates

# 3. 恢复修改
git stash pop
```

---

## 快速上传脚本

创建一个 `quick_push.sh` 脚本：

```bash
#!/bin/bash
# 快速提交并推送脚本

# 获取当前分支
BRANCH=$(git branch --show-current)

# 提示输入提交信息
echo "当前分支: $BRANCH"
read -p "请输入提交信息: " MESSAGE

# 如果没有输入，使用默认信息
if [ -z "$MESSAGE" ]; then
    MESSAGE="chore: 更新代码"
fi

# 执行提交和推送
git add .
git commit -m "$MESSAGE"
git push origin $BRANCH

echo "✅ 代码已推送到 $BRANCH 分支"
```

使用方法：

```bash
# 1. 赋予执行权限（首次）
chmod +x quick_push.sh

# 2. 执行脚本
./quick_push.sh
```

---

## 团队协作最佳实践

### ✅ DO（推荐）

1. **小步提交**：每完成一个小功能就提交一次
2. **清晰的提交信息**：使用规范的 commit message
3. **频繁推送**：每天至少推送一次
4. **及时同步**：每天开始工作前 `git pull` 拉取最新代码
5. **使用分支**：永远不要直接在 main 上开发
6. **代码审查**：通过 Pull Request 进行代码审查

### ❌ DON'T（避免）

1. **大批量提交**：不要积累太多修改一次性提交
2. **模糊的提交信息**：避免 "更新"、"修改" 这样的描述
3. **长时间不推送**：容易丢失代码或产生冲突
4. **强制推送 main**：绝对不要 `git push -f origin main`
5. **忽略 .gitignore**：不要提交 `node_modules/`, `.env` 等
6. **直接修改他人代码**：先沟通，再通过 PR 修改

---

## 📚 延伸阅读

- [Git 官方文档](https://git-scm.com/doc)
- [GitHub 官方指南](https://docs.github.com/)
- [Pro Git 书籍（中文版）](https://git-scm.com/book/zh/v2)
- [Git 可视化学习](https://learngitbranching.js.org/)

---

**祝 Git 使用顺利！遇到问题随时查阅本指南。🚀**
