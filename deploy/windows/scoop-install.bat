@echo off
chcp 65001
echo ==========================================
echo Scoop 极速安装方案（国内镜像加速）
echo ==========================================
echo.

REM 创建临时目录
mkdir C:\temp\scoop-install 2>nul
cd C:\temp\scoop-install

echo [1/5] 安装 Scoop 包管理器...
if not exist "%USERPROFILE%\scoop\shims\scoop.cmd" (
    echo 正在下载 Scoop...
    powershell -ExecutionPolicy Bypass -Command "Invoke-Expression (New-Object System.Net.WebClient).DownloadString('https://gitee.com/gollum/scoop/raw/master/bin/install.ps1')"
    echo Scoop 安装完成
) else (
    echo Scoop 已安装
)
echo.

echo [2/5] 配置国内镜像源...
call scoop config SCOOP_REPO https://gitee.com/gollum/scoop
call scoop bucket rm main 2>nul
call scoop bucket add main https://gitee.com/scoop-bucket/main
call scoop update

echo [3/5] 安装 Git...
call scoop install git

echo [4/5] 添加软件仓库...
call scoop bucket add java

echo [5/5] 一键安装所有软件（这可能需要几分钟）...
call scoop install openjdk21
scoop install nodejs20
scoop install maven
scoop install mysql
scoop install redis
scoop install nginx

echo.
echo ==========================================
echo 所有软件安装完成！
echo ==========================================
echo.
echo 安装位置：
echo   - Git: %USERPROFILE%\scoop\apps\git
echo   - Java: %USERPROFILE%\scoop\apps\openjdk21
echo   - Node.js: %USERPROFILE%\scoop\apps\nodejs20
echo   - Maven: %USERPROFILE%\scoop\apps\maven
echo   - MySQL: %USERPROFILE%\scoop\apps\mysql
echo   - Redis: %USERPROFILE%\scoop\apps\redis
echo   - Nginx: %USERPROFILE%\scoop\apps\nginx
echo.
echo 环境变量已自动配置，无需手动设置！
echo.
pause
