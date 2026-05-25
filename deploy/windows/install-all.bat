@echo off
chcp 65001
echo ==========================================
echo 电商系统环境一键安装脚本
echo 适用于 Windows Server 2022
echo ==========================================
echo.

REM 创建下载目录
mkdir C:\temp\installers 2>nul
cd C:\temp\installers

echo [1/7] 安装 Git...
if not exist "C:\Program Files\Git\bin\git.exe" (
    powershell -Command "Invoke-WebRequest -Uri 'https://github.com/git-for-windows/git/releases/download/v2.44.0.windows.1/Git-2.44.0-64-bit.exe' -OutFile 'git-installer.exe'"
    echo 正在安装 Git，请按提示操作...
    git-installer.exe /VERYSILENT /NORESTART
    echo Git 安装完成
) else (
    echo Git 已安装，跳过
)
echo.

echo [2/7] 安装 Java 21...
if not exist "C:\Program Files\Eclipse Adoptium\jdk-21.0.4.7-hotspot\bin\java.exe" (
    powershell -Command "Invoke-WebRequest -Uri 'https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.4%2B7/OpenJDK21U-jdk_x64_windows_hotspot_21.0.4_7.msi' -OutFile 'java21.msi'"
    echo 正在安装 Java 21，请按提示操作...
    msiexec /i java21.msi /qn
    echo Java 21 安装完成
) else (
    echo Java 21 已安装，跳过
)
echo.

echo [3/7] 安装 Node.js 20...
if not exist "C:\Program Files\nodejs\node.exe" (
    powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.12.2/node-v20.12.2-x64.msi' -OutFile 'nodejs.msi'"
    echo 正在安装 Node.js 20，请按提示操作...
    msiexec /i nodejs.msi /qn
    echo Node.js 20 安装完成
) else (
    echo Node.js 20 已安装，跳过
)
echo.

echo [4/7] 安装 Maven...
if not exist "C:\apache-maven-3.9.6\bin\mvn.cmd" (
    powershell -Command "Invoke-WebRequest -Uri 'https://dlcdn.apache.org/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip' -OutFile 'maven.zip'"
    echo 解压 Maven...
    powershell -Command "Expand-Archive -Path 'maven.zip' -DestinationPath 'C:\' -Force"
    echo Maven 安装完成
) else (
    echo Maven 已安装，跳过
)
echo.

echo [5/7] 安装 MySQL 8...
if not exist "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" (
    echo 正在下载 MySQL Installer...
    powershell -Command "Invoke-WebRequest -Uri 'https://dev.mysql.com/get/Downloads/MySQLInstaller/mysql-installer-web-community-8.0.36.0.msi' -OutFile 'mysql-installer.msi'"
    echo MySQL Installer 下载完成
    echo 请手动运行 mysql-installer.msi 进行安装
    echo 安装时选择：Server only，设置 root 密码为 root123456
    start mysql-installer.msi
) else (
    echo MySQL 已安装，跳过
)
echo.

echo [6/7] 安装 Redis...
if not exist "C:\Program Files\Redis\redis-server.exe" (
    powershell -Command "Invoke-WebRequest -Uri 'https://github.com/tporadowski/redis/releases/download/v5.0.14.1/Redis-x64-5.0.14.1.msi' -OutFile 'redis.msi'"
    echo 正在安装 Redis，请按提示操作...
    msiexec /i redis.msi /qn
    echo Redis 安装完成
) else (
    echo Redis 已安装，跳过
)
echo.

echo [7/7] 安装 Nginx...
if not exist "C:\nginx\nginx.exe" (
    powershell -Command "Invoke-WebRequest -Uri 'http://nginx.org/download/nginx-1.24.0.zip' -OutFile 'nginx.zip'"
    echo 解压 Nginx...
    powershell -Command "Expand-Archive -Path 'nginx.zip' -DestinationPath 'C:\' -Force"
    powershell -Command "Rename-Item -Path 'C:\nginx-1.24.0' -NewName 'C:\nginx' -Force"
    echo Nginx 安装完成
) else (
    echo Nginx 已安装，跳过
)
echo.

echo ==========================================
echo 软件安装完成！
echo ==========================================
echo.
echo 接下来请执行：
echo 1. 配置环境变量（运行 set-env.bat）
echo 2. 初始化数据库
echo 3. 部署项目
echo.
pause
