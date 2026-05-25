# PowerShell 下载脚本（在本地电脑运行）
$installDir = "D:\server-install"
New-Item -ItemType Directory -Force -Path $installDir
Set-Location $installDir

Write-Host "正在下载软件..." -ForegroundColor Green

# 下载 Git
Write-Host "[1/7] 下载 Git..." -ForegroundColor Yellow
Invoke-WebRequest -Uri "https://registry.npmmirror.com/-/binary/git-for-windows/v2.44.0.windows.1/Git-2.44.0-64-bit.exe" -OutFile "Git-2.44.0-64-bit.exe" -UseBasicParsing

# 下载 Java 21
Write-Host "[2/7] 下载 Java 21..." -ForegroundColor Yellow
Invoke-WebRequest -Uri "https://mirrors.tuna.tsinghua.edu.cn/Adoptium/21/jdk/x64/windows/OpenJDK21U-jdk_x64_windows_hotspot_21.0.4_7.msi" -OutFile "OpenJDK21U-jdk_x64_windows_hotspot_21.0.4_7.msi" -UseBasicParsing

# 下载 Node.js
Write-Host "[3/7] 下载 Node.js..." -ForegroundColor Yellow
Invoke-WebRequest -Uri "https://registry.npmmirror.com/-/binary/node/v20.12.2/node-v20.12.2-x64.msi" -OutFile "node-v20.12.2-x64.msi" -UseBasicParsing

# 下载 Maven
Write-Host "[4/7] 下载 Maven..." -ForegroundColor Yellow
Invoke-WebRequest -Uri "https://mirrors.tuna.tsinghua.edu.cn/apache/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip" -OutFile "apache-maven-3.9.6-bin.zip" -UseBasicParsing

# 下载 MySQL Installer
Write-Host "[5/7] 下载 MySQL Installer..." -ForegroundColor Yellow
Invoke-WebRequest -Uri "https://mirrors.tuna.tsinghua.edu.cn/mysql/downloads/MySQLInstaller/mysql-installer-web-community-8.0.36.0.msi" -OutFile "mysql-installer-web-community-8.0.36.0.msi" -UseBasicParsing

# 下载 Redis
Write-Host "[6/7] 下载 Redis..." -ForegroundColor Yellow
Invoke-WebRequest -Uri "https://github.com/tporadowski/redis/releases/download/v5.0.14.1/Redis-x64-5.0.14.1.msi" -OutFile "Redis-x64-5.0.14.1.msi" -UseBasicParsing

# 下载 Nginx
Write-Host "[7/7] 下载 Nginx..." -ForegroundColor Yellow
Invoke-WebRequest -Uri "http://nginx.org/download/nginx-1.24.0.zip" -OutFile "nginx-1.24.0.zip" -UseBasicParsing

Write-Host "`n所有软件下载完成！" -ForegroundColor Green
Write-Host "下载位置: $installDir" -ForegroundColor Cyan
Write-Host "`n下一步：将这些文件上传到服务器的 C:\temp\installers 目录" -ForegroundColor Yellow

# 显示文件列表
Get-ChildItem $installDir
