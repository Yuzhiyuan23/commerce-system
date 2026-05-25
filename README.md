# 🛒 commerce-system — 电商系统

基于 Spring Boot + Next.js 的全栈电商平台，覆盖用户注册登录、商品浏览搜索、购物车、下单支付、后台管理、数据分析等完整业务闭环。

**在线演示：http://8.166.119.195**

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 后端框架 | Java 21 + Spring Boot 4.0.6 |
| 安全框架 | Spring Security 7 |
| ORM | MyBatis-Plus 3.5.15 |
| 数据库 | MySQL 8.0 |
| 数据库迁移 | Flyway |
| 前端框架 | Next.js 15.5 + React 19 |
| 类型系统 | TypeScript 5.8 |
| CSS 框架 | Tailwind CSS 4 |
| 图表库 | Recharts 3.3 |
| 对象存储 | 阿里云 OSS |
| 反向代理 | Nginx 1.24 |

## 功能模块

### 前台（普通用户）
- 用户注册 / 登录（邮箱 + 密码 + Session）
- 首页商品展示、分类浏览、关键词搜索
- 商品详情页（封面图、详情图、规格选择）
- 购物车（添加、修改数量、删除、结算预览）
- 下单结算（选择收货地址、生成订单、扣减库存）
- 模拟支付（成功 / 失败 / 超时自动取消）
- 订单管理（列表、详情、取消、确认收货）
- 收货地址管理（增删改查、设置默认）

### 后台（管理员）
- 商品管理：分类管理、SPU/SKU 管理、图片管理、上下架
- 订单管理：订单列表、详情、发货操作
- 用户管理：创建销售人员账号、重置密码
- 数据分析：销售趋势图、商品销量排行、用户画像、异常检测
- 日志审计：操作日志、登录日志、浏览日志

## 仓库结构

```
commerce-system/
├── backend/                          # Spring Boot 后端（模块化单体）
│   ├── src/main/java/com/commerce/
│   │   ├── HillCommerceApplication.java    # 启动入口
│   │   ├── framework/                      # 框架层
│   │   └── modules/                        # 业务模块（9 个）
│   └── src/main/resources/
│       ├── application.yml                 # 主配置
│       ├── application-prod.yml            # 生产配置
│       └── db/migration/                   # Flyway 迁移 V1~V19
├── frontend/next-app/                 # Next.js 前端
│   └── src/
│       ├── app/                            # App Router 页面
│       ├── features/                       # 功能组件
│       └── lib/                            # 工具库、API 客户端
├── deploy/                            # 部署脚本（Linux + Windows）
├── specs/                             # 功能规范文档
├── docker-compose.yml                 # Docker 一键部署
├── .gitignore
└── README.md
```

## 快速开发

### 环境要求

- JDK 21+ / Node.js 20+ / MySQL 8.0 / Maven 3.9+

### 启动后端

```powershell
cd backend
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS commerce_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### 启动前端

```powershell
cd frontend/next-app
npm install
npm run dev
```

访问 http://localhost:3000

### 默认管理员

- 邮箱：`admin@commerce-system.local`
- 密码：`Admin@123456`

## 生产部署

**当前在线：阿里云 ECS（Windows Server 2022，2核2GB）**

```
浏览器 → Nginx(:80) → Next.js(:3000) + Spring Boot(:8080) → MySQL(:3306)
```

各服务以 Windows Service（NSSM）方式持久化运行，服务器重启自动恢复。

详见 [deploy/README.md](deploy/README.md)

## 数据库

Flyway 管理 19 个版本演进，含 25 件样例商品、8 个分类、25 个 SKU、1 个管理员账号。

## 测试

```powershell
mvn -pl backend test          # 后端测试
cd frontend/next-app && npm run typecheck   # 前端类型检查
```

## AI 辅助开发

本项目全程使用 TRAE Solo 智能编程助手辅助开发，覆盖代码生成、调试排错、服务器部署、数据库迁移、前端 UI 优化等环节。
