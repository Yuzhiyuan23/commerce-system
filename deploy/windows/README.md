# Windows Server 2022 部署指南

> 适用于阿里云 2核2G 配置，强调"方便后续修改"

## 部署架构

```
本地开发 ──Git推送──→ 服务器拉取 ──脚本──→ 自动重启
```

## 目录结构（服务器端）

```
C:\commerce-system\           # 项目根目录
├── backend\                  # 后端代码
│   └── target\*.jar          # 编译后的JAR
├── frontend\next-app\        # 前端代码
│   └── .next\               # 构建产物
├── logs\                     # 日志目录
├── update.bat                # 更新脚本 ⭐
├── start-only.bat            # 快速启动 ⭐
└── stop.bat                  # 停止脚本 ⭐
```

## 首次部署（30分钟）

### 1. 连接服务器
- **远程桌面**: `8.166.119.195`
- **用户名**: `Administrator`
- **密码**: 你的密码

### 2. 安装必要软件（按顺序）

| 软件 | 下载地址 | 注意事项 |
|------|----------|----------|
| Git | https://git-scm.com/download/win | 默认安装 |
| Java 21 | https://adoptium.net | 选择 JDK |
| Node.js 20 | https://nodejs.org | LTS版本 |
| Maven | https://maven.apache.org/download.cgi | 解压到 C:\apache-maven |
| MySQL 8 | https://dev.mysql.com/downloads/installer | 记住root密码 |
| Redis | https://github.com/tporadowski/redis/releases | msi安装包 |
| Nginx | http://nginx.org/download/nginx-1.24.0.zip | 解压到 C:\nginx |

**配置环境变量**（系统属性 → 高级 → 环境变量 → Path）：
```
C:\Program Files\Java\jdk-21\bin
C:\Program Files\nodejs
C:\apache-maven-3.9.6\bin
C:\Program Files\Git\bin
```

### 3. 上传项目

**方式A - Git克隆**（推荐）：
```batch
cd C:\
git clone https://github.com/你的用户名/commerce-system.git
```

**方式B - 直接上传**：
- 使用远程桌面的本地资源共享
- 将整个项目文件夹拖放到服务器 `C:\commerce-system`

### 4. 初始化数据库

```batch
# 打开 CMD 或 PowerShell
mysql -u root -p

# 输入密码后执行：
CREATE DATABASE commerce_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'commerce'@'localhost' IDENTIFIED BY 'commerce123';
GRANT ALL PRIVILEGES ON commerce_system.* TO 'commerce'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 5. 执行首次部署

双击运行 `首次部署.bat`

等待完成，访问: **http://8.166.119.195**

---

## 日常更新流程（修改代码后）

### 场景1：修改后端代码

**本地开发 → 推送到 Git → 服务器更新**

```bash
# 1. 本地修改代码后

git add .
git commit -m "修复支付接口"
git push origin main

# 2. 远程桌面连接到服务器
# 3. 双击运行 update.bat
```

**update.bat 会自动**：
1. 拉取最新代码
2. 重新编译后端
3. 停止旧服务
4. 启动新服务
5. 构建并启动前端

### 场景2：只修改前端代码

```bash
# 本地修改后
git add .
git commit -m "优化UI"
git push origin main

# 服务器端
cd C:\commerce-system\frontend\next-app
git pull
npm run build
taskkill /F /IM node.exe
start npm start
```

### 场景3：快速重启（不更新代码）

双击运行 `start-only.bat`

---

## 快捷操作

| 操作 | 命令/脚本 | 时间 |
|------|----------|------|
| **完整更新** | 双击 `update.bat` | 5-8分钟 |
| **快速重启** | 双击 `start-only.bat` | 30秒 |
| **停止服务** | 双击 `stop.bat` | 10秒 |
| **查看日志** | `tail C:\commerce-system\logs\app.log` | - |
| **重启后端** | `taskkill /F /IM java.exe` + `start-only.bat` | 1分钟 |

---

## 性能优化（2G内存）

已配置以下优化：

| 优化项 | 配置 | 说明 |
|--------|------|------|
| JVM堆内存 | 512MB | 防止Java占用过多内存 |
| MySQL连接池 | 最大5连接 | 减少数据库内存占用 |
| Redis内存 | 默认256MB | 可通过redis.conf调整 |
| 定时任务频率 | 降低50% | 减少后台计算 |
| 推荐系统 | 已禁用 | 节省内存 |

---

## 常见问题

### Q1: 端口被占用？
```batch
# 查看8080端口占用
netstat -ano | findstr :8080

# 结束进程（PID替换为实际数字）
taskkill /PID 1234 /F
```

### Q2: 内存不足？
```batch
# 查看内存使用
tasklist | sort /R /FI "MEMUSAGE gt 50000"

# 减少Nginx工作进程数
# 编辑 C:\nginx\conf\nginx.conf
worker_processes 1;
```

### Q3: 服务启动失败？
```batch
# 查看后端日志
type C:\commerce-system\logs\app.log

# 查看前端日志
cd C:\commerce-system\frontend\next-app
npm run dev
```

### Q4: 如何备份数据库？
```batch
# 创建备份
mysqldump -u commerce -p commerce_system > C:\backup\db_%date:~0,4%%date:~5,2%%date:~8,2%.sql

# 恢复备份
mysql -u commerce -p commerce_system < C:\backup\db_20240520.sql
```

---

## 升级建议

如果用户量增加，建议：

1. **升级配置**: 改为 2核4G（阿里云可在线升级）
2. **数据库分离**: MySQL部署到单独服务器
3. **使用Linux**: 相同配置下Linux性能更好
4. **Docker部署**: 更方便管理和扩展

---

## 联系支持

如有问题：
1. 查看日志文件 `C:\commerce-system\logs\`
2. 检查 Windows 事件查看器
3. 确认防火墙放行80端口
