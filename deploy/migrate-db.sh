#!/bin/bash

# ============================================
# 数据库迁移脚本
# ============================================

DB_NAME="commerce_system"
DB_USER="commerce"
DB_PASS="commerce123"

# 创建数据库和用户
echo "创建数据库..."
mysql -u root -e "
CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
"

# 导入数据结构
echo "导入数据库结构..."
mysql -u${DB_USER} -p${DB_PASS} ${DB_NAME} < /opt/commerce-system/database/schema.sql

echo "数据库迁移完成！"
