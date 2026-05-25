@echo off
chcp 65001
echo ==========================================
echo 配置环境变量
echo ==========================================
echo.

REM 设置 JAVA_HOME
setx JAVA_HOME "C:\Program Files\Eclipse Adoptium\jdk-21.0.4.7-hotspot" /M

REM 设置 MAVEN_HOME
setx MAVEN_HOME "C:\apache-maven-3.9.6" /M

REM 添加到 PATH
setx PATH "%PATH%;C:\Program Files\Git\bin;C:\Program Files\nodejs;C:\apache-maven-3.9.6\bin;C:\Program Files\MySQL\MySQL Server 8.0\bin;C:\nginx" /M

echo 环境变量配置完成！
echo.
echo 请重新打开命令行窗口使环境变量生效
echo.

REM 验证安装
echo 正在验证安装...
echo.

echo Git 版本：
"C:\Program Files\Git\bin\git.exe" --version 2>nul || echo Git 未安装
echo.

echo Java 版本：
"C:\Program Files\Eclipse Adoptium\jdk-21.0.4.7-hotspot\bin\java.exe" -version 2>&1 | findstr "version"
echo.

echo Node.js 版本：
"C:\Program Files\nodejs\node.exe" -v 2>nul || echo Node.js 未安装
echo.

echo Maven 版本：
"C:\apache-maven-3.9.6\bin\mvn.cmd" -version 2>&1 | findstr "Apache Maven"
echo.

echo ==========================================
echo 配置完成！
echo ==========================================
pause
