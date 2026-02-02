# 安全推送脚本 - 不包含敏感信息
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  推送代码到 GitHub S9-2.01" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 配置 Git 以处理大文件
Write-Host "[1/4] 配置 Git..." -ForegroundColor Yellow
git config --global http.postBuffer 524288000
git config --global http.maxRequestBuffer 100M
git config --global core.compression 0
Write-Host "✅ 配置完成" -ForegroundColor Green
Write-Host ""

# 检查状态
Write-Host "[2/4] 检查状态..." -ForegroundColor Yellow
git status --short
Write-Host ""

# 添加和提交
Write-Host "[3/4] 添加和提交更改..." -ForegroundColor Yellow
git add .
$hasChanges = git diff --cached --quiet; $LASTEXITCODE -ne 0
if ($hasChanges) {
    git commit -m "Update: Vocabulary Lesson 2.0 - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    Write-Host "✅ 已提交" -ForegroundColor Green
} else {
    Write-Host "没有更改需要提交" -ForegroundColor Yellow
}
Write-Host ""

# 推送
Write-Host "[4/4] 推送到 GitHub..." -ForegroundColor Yellow
Write-Host "仓库: https://github.com/GHVBUGB/S9-2.01" -ForegroundColor Gray
Write-Host ""

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✅ 推送成功！" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "访问: https://github.com/GHVBUGB/S9-2.01" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ 推送失败，错误代码: $LASTEXITCODE" -ForegroundColor Red
    Write-Host ""
    Write-Host "请确保:" -ForegroundColor Yellow
    Write-Host "1. Token 已正确配置" -ForegroundColor White
    Write-Host "2. 网络连接正常" -ForegroundColor White
    Write-Host "3. 仓库权限正确" -ForegroundColor White
}

Write-Host ""

