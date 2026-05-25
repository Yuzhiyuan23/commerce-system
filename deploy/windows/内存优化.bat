@echo off
chcp 65001
echo ==========================================
echo 服务器内存优化脚本
echo ==========================================
echo.

echo [1/5] 检查当前内存状态...
wmic OS get TotalVisibleMemorySize,FreePhysicalMemory /value
echo.

echo [2/5] 创建 4GB 虚拟内存（Swap）...
if not exist "C:\pagefile.sys" (
    wmic computersystem where name="%computername%" set AutomaticManagedPagefile=False
    wmic pagefileset where name="C:\\pagefile.sys" set InitialSize=4096,MaximumSize=4096
    echo 虚拟内存设置完成，需要重启生效
) else (
    echo 虚拟内存已存在
)
echo.

echo [3/5] 优化 MySQL 内存配置...
if exist "C:\ProgramData\MySQL\MySQL Server 8.0\my.ini" (
    echo 备份原配置...
    copy "C:\ProgramData\MySQL\MySQL Server 8.0\my.ini" "C:\ProgramData\MySQL\MySQL Server 8.0\my.ini.backup"

    echo 写入优化配置...
    echo [mysqld] >> "C:\ProgramData\MySQL\MySQL Server 8.0\my.ini"
    echo innodb_buffer_pool_size=128M >> "C:\ProgramData\MySQL\MySQL Server 8.0\my.ini"
    echo key_buffer_size=16M >> "C:\ProgramData\MySQL\MySQL Server 8.0\my.ini"
    echo max_connections=20 >> "C:\ProgramData\MySQL\MySQL Server 8.0\my.ini"
    echo query_cache_size=16M >> "C:\ProgramData\MySQL\MySQL Server 8.0\my.ini"
    echo tmp_table_size=16M >> "C:\ProgramData\MySQL\MySQL Server 8.0\my.ini"

    echo MySQL 配置已优化，需要重启 MySQL 服务
    net stop MySQL80
    net start MySQL80
)
echo.

echo [4/5] 清理不必要的后台进程...
echo 停止 Windows 更新服务（运行时占用内存）
net stop wuauserv 2>nul
sc config wuauserv start= disabled 2>nul

echo 停止 Windows Search 服务
net stop WSearch 2>nul
sc config WSearch start= disabled 2>nul

echo 停止 SysMain（Superfetch）服务
net stop SysMain 2>nul
sc config SysMain start= disabled 2>nul
echo.

echo [5/5] 重启后端服务（释放内存）...
taskkill /F /IM java.exe 2>nul
timeout /t 2 /nobreak >nul

cd C:\commerce-system\backend
start "后端服务" javaw -Xmx384m -Xms128m -XX:+UseSerialGC -XX:MaxMetaspaceSize=64m -jar commerce-system-backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod-2g
echo.

echo ==========================================
echo 优化完成！
echo ==========================================
echo.
echo 建议：
echo 1. 重启服务器让虚拟内存生效
echo 2. 如果仍然卡顿，考虑升级到 4G 内存
echo.
pause
