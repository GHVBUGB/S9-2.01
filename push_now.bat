@echo off
chcp 65001 >nul
cd /d "C:\Users\Administrator\Desktop\S9\s9-VocabularyLesson2.0-v1.0"

echo ========================================
echo   推送到 GitHub S9-2.01
echo ========================================
echo.

echo [1] 检查远程仓库...
git remote -v
echo.

echo [2] 检查当前分支...
git branch -vv
echo.

echo [3] 添加所有文件...
git add -A
echo.

echo [4] 提交更改...
git commit -m "Initial commit: Vocabulary Lesson 2.0 project"
echo.

echo [5] 推送到 GitHub...
git push -u origin main
echo.

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   推送成功！
    echo ========================================
    echo.
    echo 访问: https://github.com/GHVBUGB/S9-2.01
) else (
    echo.
    echo ========================================
    echo   推送失败，错误代码: %ERRORLEVEL%
    echo ========================================
)

echo.
pause

