# MySQL 安装配置指南

## 安装步骤

### 1. 运行安装程序
双击 `mysql-installer-community-8.0.46.0.msi`

### 2. 选择安装类型
**选择：Server only**（仅安装服务器）
- 不要选 Full（完整安装，太大）
- 不要选 Custom（自定义安装，复杂）

### 3. 安装配置

#### 配置类型（Config Type）
```
Config Type: Server Computer
Port: 3306（默认，不要改）
```

#### 认证方式（Authentication Method）
```
选择：Use Strong Password Encryption for Authentication (RECOMMENDED)
（使用强密码加密认证 - 推荐）
```

#### 设置 root 密码（重要！）
```
MySQL Root Password: root123456
Repeat Password: root123456
```
> 记住这个密码！后面创建数据库要用

#### Windows 服务配置
```
Configure MySQL Server as a Windows Service: ✅ 勾选
Windows Service Name: MySQL80（默认）
Start the MySQL Server at System Startup: ✅ 勾选（可选）
Run Windows Service as: Standard System Account（默认）
```

### 4. 应用配置
点击 `Execute` 执行配置
等待所有配置项显示绿色勾号 ✅
点击 `Finish` 完成

## 验证安装

打开 CMD，输入：
```cmd
mysql --version
```

如果显示版本号，说明安装成功。

## 创建项目数据库

```cmd
mysql -u root -p
```

输入密码：`root123456`

然后执行：
```sql
CREATE DATABASE commerce_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'commerce'@'localhost' IDENTIFIED BY 'commerce123';
GRANT ALL PRIVILEGES ON commerce_system.* TO 'commerce'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 配置简表

| 配置项 | 推荐值 | 说明 |
|--------|--------|------|
| 安装类型 | Server only | 只装服务器，不占空间 |
| 端口号 | 3306 | 默认端口，不要改 |
| root 密码 | root123456 | 管理员密码，记住它 |
| 开机启动 | 勾选 | MySQL 随系统启动 |
| 数据库名 | commerce_system | 项目数据库名称 |
| 项目用户名 | commerce | 应用程序连接用户 |
| 项目密码 | commerce123 | 应用程序连接密码 |
