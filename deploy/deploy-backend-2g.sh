#!/bin/bash

# ============================================
# 2G 内存服务器后端部署脚本（超低内存模式）
# ============================================

APP_DIR="/opt/commerce-system/backend"
JAR_NAME="commerce-system-backend-0.0.1-SNAPSHOT.jar"

echo "========== 开始部署后端（2G内存优化版）=========="

mkdir -p ${APP_DIR}
cd ${APP_DIR}

# 停止旧服务
pm2 stop commerce-backend 2>/dev/null || true
pm2 delete commerce-backend 2>/dev/null || true

# 启动新服务（超低内存配置）
# -Xmx512m: 最大堆内存 512MB
# -Xms256m: 初始堆内存 256MB
# -XX:+UseSerialGC: 使用串行垃圾回收器（省内存）
# -XX:MaxMetaspaceSize=128m: 元空间最大 128MB
pm2 start --name commerce-backend \
  --interpreter none \
  -- java \
  -Xmx512m \
  -Xms256m \
  -XX:+UseSerialGC \
  -XX:MaxMetaspaceSize=128m \
  -XX:CompressedClassSpaceSize=64m \
  -XX:MaxDirectMemorySize=64m \
  -jar ${JAR_NAME} \
  --spring.profiles.active=prod

pm2 save
pm2 startup systemd

echo "========== 后端部署完成 =========="
echo "内存限制: 最大堆内存 512MB"
echo "查看日志: pm2 logs commerce-backend"
echo "查看内存: pm2 monit"
