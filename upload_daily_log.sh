#!/bin/bash

# 上传日报到 AIEC-agent-hub 脚本
# 使用方法: ./upload_daily_log.sh

echo "📝 开始上传日报到 GitHub..."

# 设置变量
DAILY_LOG_FILE="2026-01-23.md"
REPO_PATH="$HOME/Documents/AIEC-agent-hub"
TARGET_PATH="成员日志 members/中国团队 china-team/周行健Bryce"

# 检查仓库是否存在
if [ ! -d "$REPO_PATH" ]; then
    echo "📥 仓库不存在，正在克隆..."
    cd "$HOME/Documents"
    git clone https://github.com/AIEC-Team/AIEC-agent-hub.git
    if [ $? -ne 0 ]; then
        echo "❌ 克隆失败，请检查网络连接和 GitHub 权限"
        exit 1
    fi
fi

# 进入仓库
cd "$REPO_PATH"

# 拉取最新代码
echo "🔄 拉取最新代码..."
git pull origin main

# 创建目标目录（如果不存在）
mkdir -p "$TARGET_PATH"

# 复制日报文件
echo "📋 复制日报文件..."
cp "$HOME/Documents/51talk/s9-VocabularyLesson2.0-v1.0/$DAILY_LOG_FILE" "$TARGET_PATH/"

# 添加到 git
cd "$REPO_PATH"
git add "$TARGET_PATH/$DAILY_LOG_FILE"

# 提交
echo "💾 提交更改..."
git commit -m "📝 周行健Bryce 创建日志 - 2026-01-23"

# 推送
echo "⬆️ 推送到 GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ 日报上传成功！"
    echo "🔗 查看: https://github.com/AIEC-Team/AIEC-agent-hub/tree/main/${TARGET_PATH// /%20}"
else
    echo "❌ 推送失败，请检查权限或手动推送"
fi
