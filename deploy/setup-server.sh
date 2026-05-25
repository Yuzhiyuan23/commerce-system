#!/bin/bash

# ============================================
# 电商系统服务器部署脚本
# ============================================

set -e

echo "========== 开始安装基础环境 =========="

# 更新系统
apt update && apt upgrade -y

# 安装必要工具
apt install -y curl wget vim git unzip nginx mysql-server-8.0 redis-server

# ============================================
# 安装 Java 21
# ============================================
echo "========== 安装 Java 21 =========="
cd /tmp
wget https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.4%2B7/OpenJDK21U-jdk_x64_linux_hotspot_21.0.4_7.tar.gz
tar -xzf OpenJDK21U-jdk_x64_linux_hotspot_21.0.4_7.tar.gz
mv jdk-21.0.4+7 /opt/java

# 配置环境变量
echo 'export JAVA_HOME=/opt/java' >> /etc/profile
echo 'export PATH=$JAVA_HOME/bin:$PATH' >> /etc/profile
source /etc/profile

java -version

# ============================================
# 安装 Node.js 20 LTS
# ============================================
echo "========== 安装 Node.js =========="
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

node -v
npm -v

# ============================================
# 安装 PM2 (进程管理)
# ============================================
npm install -g pm2

# ============================================
# 安装 Maven
# ============================================
echo "========== 安装 Maven =========="
apt install -y maven

mvn -v

echo "========== 基础环境安装完成 =========="
