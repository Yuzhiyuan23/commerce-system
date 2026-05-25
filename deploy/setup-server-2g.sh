#!/bin/bash

# ============================================
# 2G 内存服务器优化部署脚本
# ============================================

set -e

echo "========== 开始安装基础环境（2G内存优化版）=========="

# 更新系统
apt update && apt upgrade -y

# 创建 2G Swap（内存不足时使用）
echo "创建 Swap 空间..."
if [ ! -f /swapfile ]; then
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    echo "vm.swappiness=10" >> /etc/sysctl.conf
    sysctl -p
fi

# 安装必要工具（轻量级）
apt install -y curl wget vim git nginx mysql-server-8.0 redis-server

# 配置 Redis 内存限制（不超过 256MB）
cat >> /etc/redis/redis.conf << 'EOF'
maxmemory 256mb
maxmemory-policy allkeys-lru
EOF
systemctl restart redis

# 配置 MySQL 内存优化
cat > /etc/mysql/mysql.conf.d/low-memory.cnf << 'EOF'
[mysqld]
# 内存优化配置（适合2G服务器）
innodb_buffer_pool_size = 256M
key_buffer_size = 16M
max_connections = 50
query_cache_size = 32M
tmp_table_size = 32M
max_heap_table_size = 32M
thread_cache_size = 8
table_open_cache = 128
EOF
systemctl restart mysql

# ============================================
# 安装 Java 21（轻量级 JDK）
# ============================================
echo "安装 Java 21..."
cd /tmp
wget -q https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.4%2B7/OpenJDK21U-jdk_x64_linux_hotspot_21.0.4_7.tar.gz
tar -xzf OpenJDK21U-jdk_x64_linux_hotspot_21.0.4_7.tar.gz -C /opt/
mv /opt/jdk-21.0.4+7 /opt/java

# 配置环境变量
echo 'export JAVA_HOME=/opt/java' > /etc/profile.d/java.sh
echo 'export PATH=$JAVA_HOME/bin:$PATH' >> /etc/profile.d/java.sh
chmod +x /etc/profile.d/java.sh
source /etc/profile.d/java.sh

# ============================================
# 安装 Node.js 20 LTS
# ============================================
echo "安装 Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# 安装 PM2
npm install -g pm2

echo "========== 基础环境安装完成 =========="
echo "提示：当前配置为2G内存优化版，已创建2G Swap空间作为补充"
free -h
