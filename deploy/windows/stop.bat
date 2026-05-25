@echo off
chcp 65001
echo ==========================================
echo 停止所有服务
echo ==========================================
echo.

echo [1/4] 停止后端 (Java)...
taskkill /F /IM java.exe 2>nul
echo 后端已停止
echo.

echo [2/4] 停止前端 (Node.js)...
taskkill /F /IM node.exe 2>nul
taskkill /F /IM npm.cmd 2>nul
echo 前端已停止
echo.

echo [3/4] 停止 Nginx...
cd C:\nginx
nginx -s quit 2>nul
echo Nginx 已停止
echo.

echo [4/4] 停止 MySQL 和 Redis...
net stop MySQL80 2>nul || echo MySQL 未运行
net stop Redis 2>nul || echo Redis 未运行
echo.

echo ==========================================
echo 所有服务已停止
echo ==========================================
pause
