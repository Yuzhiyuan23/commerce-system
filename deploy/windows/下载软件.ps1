# PowerShell 下载脚本（在本地电脑运行）
$installDir = "$env:USERPROFILE\Downloads\server-install"
New-Item -ItemType Directory -Force -Path $installDir
Set-Location $installDir

Write-Host "正在下载软件到: $installDir" -ForegroundColor Green
Write-Host ""

# 1. Git
Write-Host "[1/7] 下载 Git..." -ForegroundColor Yellow
Invoke-WebRequest -Uri "https://github.com/git-for-windows/git/releases/download/v2.44.0.windows.1/Git-2.44.0-64-bit.exe" -OutFile "Git-2.44.0-64-bit.exe" -UseBasicParsing
Write-Host "Git 下载完成" -ForegroundColor Green

# 2. Java 21 (Eclipse Temurin)
Write-Host "[2/7] 下载 Java 21..." -ForegroundColor Yellow
Invoke-WebRequest -Uri "https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.4%2B7/OpenJDK21U-jdk_x64_windows_hotspot_21.0.4_7.msi" -OutFile "OpenJDK21U-jdk_x64_windows_hotspot_21.0.4_7.msi" -UseBasicParsing
Write-Host "Java 下载完成" -ForegroundColor Green

# 3. Node.js
Write-Host "[3/7] 下载 Node.js..." -ForegroundColor Yellow
Invoke-WebRequest -Uri "https://nodejs.org/dist/v20.12.2/node-v20.12.2-x64.msi" -OutFile "node-v20.12.2-x64.msi" -UseBasicParsing
Write-Host "Node.js 下载完成" -ForegroundColor Green

# 4. Maven
Write-Host "[4/7] 下载 Maven..." -ForegroundColor Yellow
Invoke-WebRequest -Uri "https://dlcdn.apache.org/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip" -OutFile "apache-maven-3.9.6-bin.zip" -UseBasicParsing
Write-Host "Maven 下载完成" -ForegroundColor Green

# 5. MySQL Installer
Write-Host "[5/7] 下载 MySQL..." -ForegroundColor Yellow
Invoke-WebRequest -Uri "https://dev.mysql.com/get/Downloads/MySQLInstaller/mysql-installer-community-8.0.36.0.msi" -OutFile "mysql-installer-community-8.0.36.0.msi" -UseBasicParsing
Write-Host "MySQL 下载完成" -ForegroundColor Green

# 6. Redis
Write-Host "[6/7] 下载 Redis..." -ForegroundColor Yellow
Invoke-WebRequest -Uri "https://github.com/tporadowski/redis/releases/download/v5.0.14.1/Redis-x64-5.0.14.1.msi" -OutFile "Redis-x64-5.0.14.1.msi" -UseBasicParsing
Write-Host "Redis 下载完成" -ForegroundColor Green

# 7. Nginx
Write-Host "[7/7] 下载 Nginx..." -ForegroundColor Yellow
Invoke-WebRequest -Uri "http://nginx.org/download/nginx-1.24.0.zip" -OutFile "nginx-1.24.0.zip" -UseBasicParsing
Write-Host "Nginx 下载完成" -ForegroundColor Green

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "所有软件下载完成！" -ForegroundColor Green
Write-Host "下载位置: $installDir" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "下一步：将这些文件上传到服务器的 C:\temp\installers" -ForegroundColor Yellow

# 显示下载的文件
Write-Host ""
Write-Host "下载的文件列表：" -ForegroundColor Cyan
Get-ChildItem $installDir | Select-Object Name, @{Name="Size(MB)";Expression={[math]::Round($_.Length/1MB,2)}}

pause
