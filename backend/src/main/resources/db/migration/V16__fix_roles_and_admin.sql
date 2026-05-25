-- 修复角色和用户初始化问题
-- 1. 确保三个基本角色存在
-- 2. 确保管理员账户存在且密码正确

-- 插入角色（如果不存在）
INSERT IGNORE INTO roles (code, name, created_at)
VALUES
    ('CUSTOMER', 'Customer', NOW()),
    ('SALES', 'Sales', NOW()),
    ('ADMIN', 'Admin', NOW());

-- 确保管理员用户存在
INSERT INTO users (email, password_hash, nickname, status, created_at, updated_at)
SELECT
    'admin@commerce-system.local',
    '$2a$10$dI.XZkJ4jiEunqTzzo5Eb.2OVbjfS0DoZxfmhZLCgAtRfbAAahvTq',
    'System Admin',
    'ACTIVE',
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'admin@commerce-system.local'
);

-- 更新管理员密码（确保是正确的BCrypt密码）
UPDATE users
SET password_hash = '$2a$10$dI.XZkJ4jiEunqTzzo5Eb.2OVbjfS0DoZxfmhZLCgAtRfbAAahvTq',
    status = 'ACTIVE'
WHERE email = 'admin@commerce-system.local';

-- 为管理员分配ADMIN角色
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN roles r ON r.code = 'ADMIN'
WHERE u.email = 'admin@commerce-system.local'
  AND NOT EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = u.id AND ur.role_id = r.id
  );

-- 验证结果
SELECT 'Roles count:' as info, COUNT(*) as value FROM roles
UNION ALL
SELECT 'Admin user exists:', COUNT(*) FROM users WHERE email = 'admin@commerce-system.local'
UNION ALL
SELECT 'Admin has role:', COUNT(*) FROM user_roles ur
JOIN users u ON u.id = ur.user_id
JOIN roles r ON r.id = ur.role_id
WHERE u.email = 'admin@commerce-system.local' AND r.code = 'ADMIN';
