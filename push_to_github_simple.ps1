# 简单的 GitHub 推送脚本
Write-Host "=== 开始推送项目到 GitHub ===" -ForegroundColor Green

# 检查 Git 状态
Write-Host "`n1. 检查 Git 状态..." -ForegroundColor Yellow
$status = git status --porcelain
if ($status) {
    Write-Host "发现未提交的文件，正在添加..." -ForegroundColor Cyan
    git add -A
    Write-Host "文件已添加" -ForegroundColor Green
} else {
    Write-Host "工作区干净" -ForegroundColor Green
}

# 检查是否有未提交的更改
$staged = git diff --cached --name-only
if ($staged) {
    Write-Host "`n2. 提交更改..." -ForegroundColor Yellow
    git commit -m "Update: Vocabulary Lesson 2.0 project"
    Write-Host "提交完成" -ForegroundColor Green
} else {
    Write-Host "`n2. 没有需要提交的更改" -ForegroundColor Yellow
}

# 显示当前分支
Write-Host "`n3. 当前分支信息..." -ForegroundColor Yellow
git branch --show-current | ForEach-Object { Write-Host "当前分支: $_" -ForegroundColor Cyan }

# 推送代码
Write-Host "`n4. 推送到 GitHub..." -ForegroundColor Yellow
Write-Host "远程仓库: https://github.com/GHVBUGB/S9-2.0.git" -ForegroundColor Gray

try {
    $branch = git branch --show-current
    if (-not $branch) {
        $branch = "main"
    }
    
    Write-Host "正在推送到 origin/$branch..." -ForegroundColor Cyan
    git push -u origin $branch 2>&1 | ForEach-Object {
        Write-Host $_ -ForegroundColor $(if ($_ -match "error|Error|ERROR|denied|Denied|fatal") { "Red" } elseif ($_ -match "success|Success|SUCCESS|done|Done") { "Green" } else { "White" })
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ 推送成功！" -ForegroundColor Green
        Write-Host "请访问 https://github.com/GHVBUGB/S9-2.0 查看您的代码" -ForegroundColor Cyan
    } else {
        Write-Host "`n⚠️ 推送可能需要身份验证" -ForegroundColor Yellow
        Write-Host "如果推送失败，请尝试以下方法之一：" -ForegroundColor Yellow
        Write-Host "1. 使用 GitHub Personal Access Token" -ForegroundColor Cyan
        Write-Host "2. 使用 SSH 密钥" -ForegroundColor Cyan
        Write-Host "3. 手动在浏览器中完成身份验证" -ForegroundColor Cyan
    }
} catch {
    Write-Host "`n❌ 推送出错: $_" -ForegroundColor Red
}

Write-Host "`n=== 完成 ===" -ForegroundColor Green

