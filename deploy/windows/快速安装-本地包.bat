@echo off
chcp 65001
echo ==========================================
echo 本地安装包快速安装
echo 请将安装包放在 C:\temp\installers 目录
echo ==========================================
echo.

set INSTALL_DIR=C:\temp\installers

if not exist "%INSTALL_DIR%" (
    echo 错误：未找到安装包目录 %INSTALL_DIR%
    echo 请先下载所有安装包并解压到该目录
    pause
    exit /b 1
)

echo [1/7] 安装 Git...
if exist "%INSTALL_DIR%\Git-2.44.0-64-bit.exe" (
    "%INSTALL_DIR%\Git-2.44.0-64-bit.exe" /VERYSILENT /NORESTART
    echo Git 安装完成
) else (
    echo 未找到 Git 安装包，跳过
)
echo.

echo [2/7] 安装 Java 21...
if exist "%INSTALL_DIR%\OpenJDK21U-jdk_x64_windows_hotspot_21.0.4_7.msi" (
    msiexec /i "%INSTALL_DIR%\OpenJDK21U-jdk_x64_windows_hotspot_21.0.4_7.msi" /qn
    echo Java 21 安装完成
) else (
    echo 未找到 Java 安装包，跳过
)
echo.

echo [3/7] 安装 Node.js 20...
if exist "%INSTALL_DIR%\node-v20.12.2-x64.msi" (
    msiexec /i "%INSTALL_DIR%\node-v20.12.2-x64.msi" /qn
    echo Node.js 20 安装完成
) else (
    echo 未找到 Node.js 安装包，跳过
)
echo.

echo [4/7] 安装 Maven...
if exist "%INSTALL_DIR%\apache-maven-3.9.6-bin.zip" (
    powershell -Command "Expand-Archive -Path '%INSTALL_DIR%\apache-maven-3.9.6-bin.zip' -DestinationPath 'C:\' -Force"
    echo Maven 安装完成
) else (
    echo 未找到 Maven 安装包，跳过
)
echo.

echo [5/7] 安装 MySQL...
if exist "%INSTALL_DIR%\mysql-8.0.36-winx64.zip" (
    powershell -Command "Expand-Archive -Path '%INSTALL_DIR%\mysql-8.0.36-winx64.zip' -DestinationPath 'C:\' -Force"
    rename C:\mysql-8.0.36-winx64 C:\mysql
    echo MySQL 解压完成
    echo 注意：需要手动初始化数据库
) else (
    echo 未找到 MySQL 安装包，跳过
)
echo.

echo [6/7] 安装 Redis...
if exist "%INSTALL_DIR%\Redis-x64-5.0.14.1.zip" (
    powershell -Command "Expand-Archive -Path '%INSTALL_DIR%\Redis-x64-5.0.14.1.zip' -DestinationPath 'C:\' -Force"
    echo Redis 安装完成
) else (
    echo 未找到 Redis 安装包，跳过
)
echo.

echo [7/7] 安装 Nginx...
if exist "%INSTALL_DIR%\nginx-1.24.0.zip" (
    powershell -Command "Expand-Archive -Path '%INSTALL_DIR%\nginx-1.24.0.zip' -DestinationPath 'C:\' -Force"
    rename C:\nginx-1.24.0 C:\nginx
    echo Nginx 安装完成
) else (
    echo 未找到 Nginx 安装包，跳过
)
echo.

echo ==========================================
echo 安装完成！
echo ==========================================
echo.
echo 下一步：
echo 1. 运行 set-env.bat 配置环境变量
echo 2. 初始化 MySQL 数据库
echo 3. 运行 首次部署.bat
echo.
pause
