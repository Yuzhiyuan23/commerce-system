#!/bin/bash

# ============================================
# 前端部署脚本
# ============================================

APP_DIR="/opt/commerce-system/frontend"

echo "========== 开始部署前端 =========="

# 创建目录
mkdir -p ${APP_DIR}

# 复制前端代码（假设已上传到服务器）
# scp -r frontend/next-app/* root@服务器IP:/opt/commerce-system/frontend/

cd ${APP_DIR}

# 安装依赖
echo "安装依赖..."
npm ci --production

# 构建（使用 standalone 输出）
echo "构建项目..."
npm run build

# 停止旧服务
pm2 stop commerce-frontend 2>/dev/null || true
pm2 delete commerce-frontend 2>/dev/null || true

# 启动新服务（使用 Next.js standalone 模式）
echo "启动服务..."
pm2 start --name commerce-frontend \
  --interpreter none \
  -- ./node_modules/.bin/next start -p 3000

# 保存 PM2 配置
pm2 save

echo "========== 前端部署完成 =========="
echo "查看日志: pm2 logs commerce-frontend"
