#!/bin/bash

# ============================================
# 后端部署脚本
# ============================================

APP_DIR="/opt/commerce-system/backend"
JAR_NAME="commerce-system-backend-0.0.1-SNAPSHOT.jar"

echo "========== 开始部署后端 =========="

# 创建目录
mkdir -p ${APP_DIR}

# 复制 JAR 包（假设在本地编译好上传到服务器）
# scp backend/target/*.jar root@服务器IP:/opt/commerce-system/backend/

cd ${APP_DIR}

# 停止旧服务
pm2 stop commerce-backend 2>/dev/null || true
pm2 delete commerce-backend 2>/dev/null || true

# 启动新服务
pm2 start --name commerce-backend \
  --interpreter none \
  -- java \
  -Xms512m -Xmx1024m \
  -jar ${JAR_NAME} \
  --spring.profiles.active=prod

# 保存 PM2 配置
pm2 save
pm2 startup systemd

echo "========== 后端部署完成 =========="
echo "查看日志: pm2 logs commerce-backend"
