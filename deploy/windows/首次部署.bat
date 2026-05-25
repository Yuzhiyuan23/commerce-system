@echo off
chcp 65001
cls
echo ==========================================
echo 电商系统首次部署脚本
echo ==========================================
echo.

set PROJECT_DIR=C:\commerce-system
set BACKEND_DIR=%PROJECT_DIR%\backend
set FRONTEND_DIR=%PROJECT_DIR%\frontend\next-app

echo [1/8] 创建日志目录...
mkdir C:\commerce-system\logs 2>nul
echo.

echo [2/8] 安装前端依赖...
cd %FRONTEND_DIR%
call npm install
echo.

echo [3/8] 编译后端（首次需要较长时间）...
cd %BACKEND_DIR%
call mvn clean package -DskipTests -q
echo 编译完成
echo.

echo [4/8] 启动 MySQL 和 Redis...
net start MySQL80 2>nul || echo MySQL 已启动
net start Redis 2>nul || echo Redis 已启动
echo.

echo [5/8] 启动后端服务...
start "后端服务" javaw -Xmx512m -Xms256m -jar %BACKEND_DIR%\target\commerce-system-backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod-2g
timeout /t 5 /nobreak >nul
echo 后端已启动: http://localhost:8080
echo.

echo [6/8] 构建并启动前端...
cd %FRONTEND_DIR%
call npm run build
start "前端服务" npm start
echo 前端已启动: http://localhost:3000
echo.

echo [7/8] 启动 Nginx...
cd C:\nginx
start nginx
echo Nginx 已启动
echo.

echo [8/8] 等待服务启动...
timeout /t 5 /nobreak >nul
echo.
echo ==========================================
echo 部署完成！
echo.
echo 外网访问: http://8.166.119.195
echo 本地访问: http://localhost
echo.
echo 快捷操作:
echo   - 更新代码并重启: 双击 update.bat
echo   - 仅重启服务: 双击 start-only.bat
echo   - 停止服务: 双击 stop.bat
echo ==========================================
pause
