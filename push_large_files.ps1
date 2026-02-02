# 推送大文件到 GitHub - 优化配置
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  推送大文件到 GitHub（优化版）" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 设置 Git 配置以处理大文件
Write-Host "[1/5] 配置 Git 以处理大文件..." -ForegroundColor Yellow
git config --global http.postBuffer 524288000  # 500MB
git config --global http.maxRequestBuffer 100M
git config --global core.compression 0
git config --global http.lowSpeedLimit 0
git config --global http.lowSpeedTime 999999
Write-Host "✅ Git 配置已优化" -ForegroundColor Green
Write-Host ""

# 检查远程仓库配置
Write-Host "[2/5] 检查远程仓库配置..." -ForegroundColor Yellow
git remote -v
Write-Host ""

# 检查文件大小
Write-Host "[3/5] 检查要推送的文件大小..." -ForegroundColor Yellow
$totalSize = (git ls-files | ForEach-Object { (Get-Item $_ -ErrorAction SilentlyContinue).Length } | Measure-Object -Sum).Sum
$totalSizeMB = [math]::Round($totalSize / 1MB, 2)
Write-Host "总文件大小: $totalSizeMB MB" -ForegroundColor Cyan
Write-Host ""

# 检查是否有大文件（>100MB）
Write-Host "[4/5] 检查是否有超大文件..." -ForegroundColor Yellow
$largeFiles = git ls-files | ForEach-Object {
    $file = Get-Item $_ -ErrorAction SilentlyContinue
    if ($file -and $file.Length -gt 100MB) {
        [PSCustomObject]@{
            File = $_
            Size = [math]::Round($file.Length / 1MB, 2)
        }
    }
}

if ($largeFiles) {
    Write-Host "⚠️  发现大文件（>100MB）:" -ForegroundColor Yellow
    $largeFiles | ForEach-Object {
        Write-Host "  - $($_.File): $($_.Size) MB" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "建议: 使用 Git LFS 处理大文件，或从 .gitignore 中排除这些文件" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "✅ 没有超大文件" -ForegroundColor Green
    Write-Host ""
}

# 推送代码
Write-Host "[5/5] 推送到 GitHub..." -ForegroundColor Yellow
Write-Host "这可能需要几分钟时间，请耐心等待..." -ForegroundColor Gray
Write-Host ""

$startTime = Get-Date
try {
    # 使用详细模式推送
    $pushOutput = git push -u origin main --verbose 2>&1
    $exitCode = $LASTEXITCODE
    $endTime = Get-Date
    $duration = $endTime - $startTime
    
    Write-Host ""
    Write-Host "推送耗时: $($duration.TotalSeconds) 秒" -ForegroundColor Gray
    Write-Host ""
    
    if ($pushOutput) {
        Write-Host "推送输出:" -ForegroundColor Cyan
        $pushOutput | ForEach-Object {
            $color = "White"
            if ($_ -match "error|Error|ERROR|fatal|Fatal|FATAL|失败|错误") { $color = "Red" }
            elseif ($_ -match "success|Success|SUCCESS|done|Done|完成|成功") { $color = "Green" }
            elseif ($_ -match "warning|Warning|WARNING|警告") { $color = "Yellow" }
            Write-Host $_ -ForegroundColor $color
        }
    }
    
    if ($exitCode -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  ✅ 推送成功！" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "请访问以下链接查看您的代码:" -ForegroundColor Cyan
        Write-Host "https://github.com/GHVBUGB/S9-2.0" -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Red
        Write-Host "  ❌ 推送失败，退出代码: $exitCode" -ForegroundColor Red
        Write-Host "========================================" -ForegroundColor Red
        Write-Host ""
        Write-Host "可能的解决方案:" -ForegroundColor Yellow
        Write-Host "1. 检查网络连接" -ForegroundColor White
        Write-Host "2. 尝试使用 SSH 而不是 HTTPS" -ForegroundColor White
        Write-Host "3. 分批推送（先推送部分文件）" -ForegroundColor White
        Write-Host "4. 使用 Git LFS 处理大文件" -ForegroundColor White
        Write-Host "5. 检查 .gitignore 是否正确配置" -ForegroundColor White
    }
} catch {
    Write-Host ""
    Write-Host "❌ 推送出错: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== 完成 ===" -ForegroundColor Green

