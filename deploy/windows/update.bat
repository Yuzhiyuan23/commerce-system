@echo off
chcp 65001
cls
echo ==========================================
echo 电商系统一键更新脚本
echo ==========================================
echo.

REM 设置路径
set PROJECT_DIR=C:\commerce-system
set BACKEND_DIR=%PROJECT_DIR%\backend
set FRONTEND_DIR=%PROJECT_DIR%\frontend\next-app

echo [1/6] 拉取最新代码...
cd %PROJECT_DIR%
git pull origin main
echo.

echo [2/6] 编译后端...
cd %BACKEND_DIR%
call mvn clean package -DskipTests -q
echo 编译完成
echo.

echo [3/6] 停止旧服务...
taskkill /F /IM java.exe 2>nul
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo.

echo [4/6] 启动后端（2G内存优化模式）...
start "后端服务" javaw -Xmx512m -Xms256m -jar %BACKEND_DIR%\target\commerce-system-backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod-2g
timeout /t 5 /nobreak >nul
echo 后端已启动
echo.

echo [5/6] 构建并启动前端...
cd %FRONTEND_DIR%
call npm install
call npm run build
start "前端服务" npm start
echo.

echo [6/6] 检查服务状态...
timeout /t 3 /nobreak >nul
echo.
echo 后端端口: http://localhost:8080
echo 前端端口: http://localhost:3000
echo.
echo 访问网站: http://8.166.119.195
echo.
pause
