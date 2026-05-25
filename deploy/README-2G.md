# 2G 内存服务器部署指南

> 适用于阿里云/腾讯云经济型 2核2G 配置

## 内存分配规划（总共 2G）

| 服务 | 分配内存 | 说明 |
|------|---------|------|
| Swap 交换空间 | 2G | 物理内存不足时使用 |
| MySQL | 256MB | 最小化配置 |
| Redis | 256MB | 内存上限 |
| Java 后端 | 512MB | 堆内存上限 |
| Node.js 前端 | 256MB | 正常运行所需 |
| Nginx + 系统 | 约 400MB | 基础系统服务 |
| **预留缓冲** | **约 200MB** | 防止 OOM |

---

## 快速部署步骤

### 1. 购买服务器
- **配置**：2核(vCPU) 2GiB 经济型 e + 40GB ESSD
- **系统**：Ubuntu 22.04 LTS
- **带宽**：3Mbps（约 380KB/s）

### 2. 连接服务器并上传脚本
```bash
# 本地执行
scp deploy/setup-server-2g.sh root@你的服务器IP:/root/
scp deploy/deploy-backend-2g.sh root@你的服务器IP:/root/
scp deploy/deploy-frontend.sh root@你的服务器IP:/root/
scp deploy/nginx.conf root@你的服务器IP:/root/

# 连接服务器
ssh root@你的服务器IP
```

### 3. 执行部署
```bash
cd /root

# 1. 安装环境（自动创建 Swap）
chmod +x setup-server-2g.sh
./setup-server-2g.sh

# 2. 上传后端 JAR 包（本地执行）
# scp backend/target/*.jar root@服务器IP:/opt/commerce-system/backend/

# 3. 部署后端（使用2G优化配置）
chmod +x deploy-backend-2g.sh
./deploy-backend-2g.sh

# 4. 上传前端代码并部署
# scp -r frontend/next-app/.next ... root@服务器IP:/opt/commerce-system/frontend/
chmod +x deploy-frontend.sh
./deploy-frontend.sh

# 5. 配置 Nginx
cp nginx.conf /etc/nginx/sites-available/commerce-system
ln -s /etc/nginx/sites-available/commerce-system /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx
```

---

## 监控命令

```bash
# 查看内存使用
free -h

# 查看各进程内存占用
ps aux --sort=-%mem | head -20

# PM2 监控面板
pm2 monit

# 查看 Swap 使用
vmstat 1
```

---

## 常见问题

### Q1: 服务启动后内存不足？
```bash
# 检查 Swap 是否启用
swapon -s

# 如果没有，手动创建
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
```

### Q2: 网站访问慢？
- 经济型实例性能有波动，高峰期可能受限
- 建议升级到 **2核4G** 获得稳定性能

### Q3: 后端启动失败？
```bash
# 查看错误日志
pm2 logs commerce-backend

# 可能是内存不够，重启服务释放内存
pm2 restart all
```

---

## 性能优化建议

1. **定期重启**：建议每天凌晨自动重启服务
   ```bash
   # 添加定时任务
   crontab -e
   # 添加：0 3 * * * pm2 restart all
   ```

2. **日志清理**：定期清理日志文件
   ```bash
   # 添加定时任务
   echo '0 2 * * 0 truncate -s 0 /var/log/commerce-system/*.log' | crontab -
   ```

3. **数据库优化**：
   - 定期清理旧订单数据
   - 关闭 binlog（如不需要数据恢复）

---

## 升级建议

如果预算允许，强烈建议升级到 **2核4G**：
- 价格差异：约 +50-80元/年
- 性能提升：3-5倍
- 用户体验：明显更流畅

2G 配置适合：
- 个人学习/演示
- 日均访问 < 100 人
- 简单商品展示

4G 配置适合：
- 正式运营
- 日均访问 > 500 人
- 完整购物流程
