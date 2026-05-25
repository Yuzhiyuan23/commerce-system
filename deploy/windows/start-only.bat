@echo off
chcp 65001
cls
echo ==========================================
echo 电商系统快速启动脚本（不编译）
echo ==========================================
echo.

REM 设置路径
set BACKEND_DIR=C:\commerce-system\backend
set FRONTEND_DIR=C:\commerce-system\frontend\next-app

echo [1/3] 停止旧服务...
taskkill /F /IM java.exe 2>nul
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo.

echo [2/3] 启动后端...
start "后端服务" javaw -Xmx512m -Xms256m -jar %BACKEND_DIR%\target\commerce-system-backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod-2g
timeout /t 5 /nobreak >nul
echo 后端已启动: http://localhost:8080
echo.

echo [3/3] 启动前端...
cd %FRONTEND_DIR%
start "前端服务" npm start
echo 前端已启动: http://localhost:3000
echo.

echo 等待服务启动...
timeout /t 5 /nobreak >nul
echo.
echo ==========================================
echo 部署完成！
echo 外网访问: http://8.166.119.195
echo 本地访问: http://localhost
echo ==========================================
pause
