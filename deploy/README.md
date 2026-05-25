# 电商系统部署指南

## 一、购买服务器

### 推荐配置
- **阿里云 ECS**：https://www.aliyun.com/product/ecs
- **腾讯云 CVM**：https://cloud.tencent.com/product/cvm

**配置选择**：
- 2核4G内存，3M带宽，40G SSD
- 操作系统：Ubuntu 22.04 LTS
- 新用户首年约 100-200 元

---

## 二、服务器初始化

### 1. 连接服务器
```bash
ssh root@你的服务器IP
```

### 2. 上传部署脚本
将 `deploy/` 目录下的脚本上传到服务器：
```bash
scp deploy/*.sh root@服务器IP:/root/
```

### 3. 执行环境安装
```bash
chmod +x /root/setup-server.sh
/root/setup-server.sh
```

---

## 三、数据库部署

### 1. 导出本地数据库
在本地电脑执行：
```bash
mysqldump -u root -p commerce_system > database/schema.sql
```

### 2. 上传到服务器
```bash
scp database/schema.sql root@服务器IP:/opt/commerce-system/database/
```

### 3. 导入数据库
```bash
chmod +x /root/migrate-db.sh
/root/migrate-db.sh
```

---

## 四、后端部署

### 1. 本地编译
在本地电脑执行：
```bash
cd backend
mvn clean package -DskipTests
```

### 2. 上传 JAR 包
```bash
scp backend/target/commerce-system-backend-0.0.1-SNAPSHOT.jar root@服务器IP:/opt/commerce-system/backend/
```

### 3. 配置生产环境变量
创建配置文件：
```bash
mkdir -p /opt/commerce-system/config
cat > /opt/commerce-system/config/application-prod.env << 'EOF'
DB_USERNAME=commerce
DB_PASSWORD=你的数据库密码
MAIL_HOST=smtp.163.com
MAIL_PORT=465
MAIL_USERNAME=你的邮箱
MAIL_PASSWORD=你的邮箱授权码
OSS_ACCESS_KEY_ID=你的阿里云AK
OSS_ACCESS_KEY_SECRET=你的阿里云SK
EOF
```

### 4. 启动后端
```bash
chmod +x /root/deploy-backend.sh
/root/deploy-backend.sh
```

---

## 五、前端部署

### 1. 修改前端配置
编辑 `frontend/next-app/.env.production`：
```env
NEXT_PUBLIC_API_BASE_URL=https://你的域名/api
```

### 2. 本地构建并上传
```bash
cd frontend/next-app
npm ci
npm run build

# 上传构建产物
scp -r .next package.json package-lock.json public root@服务器IP:/opt/commerce-system/frontend/
```

### 3. 启动前端
```bash
chmod +x /root/deploy-frontend.sh
/root/deploy-frontend.sh
```

---

## 六、Nginx 配置

### 1. 安装 SSL 证书
```bash
# 使用 Let's Encrypt 免费证书
apt install -y certbot python3-certbot-nginx

# 申请证书
 certbot --nginx -d your-domain.com -d www.your-domain.com

# 自动续期
systemctl enable certbot.timer
```

### 2. 配置 Nginx
```bash
# 复制配置文件
cp deploy/nginx.conf /etc/nginx/sites-available/commerce-system

# 修改域名
vim /etc/nginx/sites-available/commerce-system

# 启用配置
ln -s /etc/nginx/sites-available/commerce-system /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 测试配置
nginx -t

# 重启 Nginx
systemctl restart nginx
```

---

## 七、域名解析

在你的域名服务商处添加 A 记录：
```
主机记录    记录类型    记录值
@           A           你的服务器IP
www         A           你的服务器IP
```

---

## 八、日常维护命令

### 查看服务状态
```bash
# 查看所有服务
pm2 status

# 查看后端日志
pm2 logs commerce-backend

# 查看前端日志
pm2 logs commerce-frontend

# 重启服务
pm2 restart commerce-backend
pm2 restart commerce-frontend
```

### 更新部署
```bash
# 1. 上传新代码
# 2. 执行部署脚本
/root/deploy-backend.sh
/root/deploy-frontend.sh
```

### 备份数据库
```bash
mysqldump -u commerce -p commerce_system > backup_$(date +%Y%m%d).sql
```

---

## 九、安全配置

### 1. 配置防火墙
```bash
# 开放必要端口
ufw allow 22/tcp      # SSH
ufw allow 80/tcp      # HTTP
ufw allow 443/tcp     # HTTPS
ufw enable
```

### 2. 修改 SSH 端口（可选）
```bash
vim /etc/ssh/sshd_config
# 修改 Port 为其他端口，如 2222
systemctl restart sshd
```

---

## 十、常见问题

### 1. 端口被占用
```bash
# 查看端口占用
netstat -tulpn | grep 8080

# 结束进程
kill -9 PID
```

### 2. 内存不足
```bash
# 添加 Swap
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

### 3. 权限问题
```bash
# 修复目录权限
chown -R www-data:www-data /opt/commerce-system
```
