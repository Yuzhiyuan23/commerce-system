#!/bin/bash

# ============================================
# 一键部署脚本（适合快速部署到服务器）
# ============================================

set -e

SERVER_IP=$1
DOMAIN=$2

if [ -z "$SERVER_IP" ] || [ -z "$DOMAIN" ]; then
    echo "用法: ./quick-deploy.sh <服务器IP> <域名>"
    echo "示例: ./quick-deploy.sh 123.456.789.0 shop.example.com"
    exit 1
fi

echo "========== 电商系统部署工具 =========="
echo "服务器: $SERVER_IP"
echo "域名: $DOMAIN"
echo ""

# 检查本地编译状态
echo "[1/7] 检查本地编译..."
if [ ! -f "../backend/target/commerce-system-backend-0.0.1-SNAPSHOT.jar" ]; then
    echo "后端未编译，正在编译..."
    cd ../backend && mvn clean package -DskipTests
fi

if [ ! -d "../frontend/next-app/.next" ]; then
    echo "前端未构建，正在构建..."
    cd ../frontend/next-app && npm ci && npm run build
fi

cd "$(dirname "$0")"

# 上传文件
echo "[2/7] 上传文件到服务器..."
ssh root@$SERVER_IP "mkdir -p /opt/commerce-system/{backend,frontend,config,database}"

scp ../backend/target/*.jar root@$SERVER_IP:/opt/commerce-system/backend/
scp -r ../frontend/next-app/.next ../frontend/next-app/public ../frontend/next-app/package*.json root@$SERVER_IP:/opt/commerce-system/frontend/

# 生成配置文件
echo "[3/7] 生成配置文件..."
cat > /tmp/docker-compose.yml << EOF
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    container_name: commerce-mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: $(openssl rand -base64 12)
      MYSQL_DATABASE: commerce_system
      MYSQL_USER: commerce
      MYSQL_PASSWORD: commerce123
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "127.0.0.1:3306:3306"
    command: --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci

  redis:
    image: redis:7-alpine
    container_name: commerce-redis
    restart: always

  backend:
    image: eclipse-temurin:21-jdk
    container_name: commerce-backend
    restart: always
    working_dir: /app
    volumes:
      - /opt/commerce-system/backend:/app
    command: java -Xms512m -Xmx1024m -jar commerce-system-backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
    environment:
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_NAME=commerce_system
      - DB_USERNAME=commerce
      - DB_PASSWORD=commerce123
      - REDIS_HOST=redis
    depends_on:
      - mysql
      - redis

  frontend:
    image: node:20-alpine
    container_name: commerce-frontend
    restart: always
    working_dir: /app
    volumes:
      - /opt/commerce-system/frontend:/app
    command: sh -c "npm install && npm start"
    environment:
      - NODE_ENV=production
    depends_on:
      - backend

  nginx:
    image: nginx:alpine
    container_name: commerce-nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /opt/commerce-system/nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - frontend
      - backend

volumes:
  mysql_data:
EOF

scp /tmp/docker-compose.yml root@$SERVER_IP:/opt/commerce-system/

# 生成 Nginx 配置
cat > /tmp/nginx.conf << EOF
server {
    listen 80;
    server_name $DOMAIN;

    location /api/ {
        proxy_pass http://backend:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }

    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF

scp /tmp/nginx.conf root@$SERVER_IP:/opt/commerce-system/

# 服务器上执行部署
echo "[4/7] 在服务器上执行部署..."
ssh root@$SERVER_IP << 'REMOTECOMMANDS'
# 安装 Docker
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
fi

# 安装 Docker Compose
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# 部署
cd /opt/commerce-system
docker-compose down 2>/dev/null || true
docker-compose up -d

# 安装 certbot 获取 SSL 证书
apt update
apt install -y certbot

REMOTECOMMANDS

echo "[5/7] 申请 SSL 证书..."
ssh root@$SERVER_IP "certbot --nginx -d $DOMAIN --agree-tos -n --email admin@$DOMAIN || echo 'Certbot 安装，请手动配置 SSL'"

echo "[6/7] 等待服务启动..."
sleep 30

echo "[7/7] 部署完成！"
echo ""
echo "========== 部署信息 =========="
echo "网站地址: http://$DOMAIN"
echo "后台管理: http://$DOMAIN/admin"
echo ""
echo "查看日志: ssh root@$SERVER_IP 'docker-compose -f /opt/commerce-system/docker-compose.yml logs -f'"
echo ""
