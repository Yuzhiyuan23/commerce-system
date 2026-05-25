@echo off
chcp 65001
echo ==========================================
echo 配置环境变量
echo ==========================================
echo.

echo [1/4] 配置 Java 环境变量...
setx JAVA_HOME "C:\Program Files\Eclipse Adoptium\jdk-21.0.4.7-hotspot" /M
echo Java 配置完成
echo.

echo [2/4] 配置 Maven 环境变量...
setx MAVEN_HOME "C:\apache-maven-3.9.6" /M
echo Maven 配置完成
echo.

echo [3/4] 配置 MySQL 环境变量...
setx MYSQL_HOME "C:\Program Files\MySQL\MySQL Server 8.0" /M
echo MySQL 配置完成
echo.

echo [4/4] 添加到系统 PATH...
setx PATH "C:\Program Files\Git\bin;C:\Program Files\nodejs;C:\apache-maven-3.9.6\bin;C:\Program Files\MySQL\MySQL Server 8.0\bin;C:\nginx;C:\Program Files\Redis;C:\Program Files\Eclipse Adoptium\jdk-21.0.4.7-hotspot\bin;%PATH%" /M
echo PATH 配置完成
echo.

echo ==========================================
echo 环境变量配置完成！
echo ==========================================
echo.
echo 请重新打开命令行窗口使配置生效
echo.
echo 验证命令（重新打开CMD后执行）：
echo   git --version
echo   java -version
echo   node -v
echo   mvn -version
echo   mysql --version
echo   redis-server --version
echo   nginx -v
echo.
pause
