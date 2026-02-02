@echo off
chcp 65001 >nul
echo ========================================
echo   推送代码到 GitHub
echo ========================================
echo.

cd /d "C:\Users\Administrator\Desktop\S9\s9-VocabularyLesson2.0-v1.0"

echo [1] 检查 Git 状态...
git status
echo.

echo [2] 添加所有文件...
git add -A
echo.

echo [3] 提交更改...
git commit -m "Update: Vocabulary Lesson 2.0 project"
echo.

echo [4] 推送到 GitHub...
echo 远程仓库: https://github.com/GHVBUGB/S9-2.0.git
echo 分支: main
echo.

git push -u origin main
echo.

if %ERRORLEVEL% EQU 0 (
    echo ========================================
    echo   ✅ 推送成功！
    echo ========================================
    echo.
    echo 请访问: https://github.com/GHVBUGB/S9-2.0
) else (
    echo ========================================
    echo   ⚠️  推送失败，错误代码: %ERRORLEVEL%
    echo ========================================
    echo.
    echo 尝试推送到 master 分支...
    git push -u origin master
    if %ERRORLEVEL% EQU 0 (
        echo ✅ 推送到 master 成功！
    ) else (
        echo ❌ 推送失败
    )
)

echo.
pause

