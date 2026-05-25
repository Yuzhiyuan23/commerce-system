-- Ensure admin account exists with correct password
-- Password: Admin@123456 (BCrypt hashed)
-- This migration runs after V4 to ensure admin account is properly set up

-- Insert admin user if not exists
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

-- Update admin password to ensure it's correct (in case V4 didn't run properly)
UPDATE users
SET password_hash = '$2a$10$dI.XZkJ4jiEunqTzzo5Eb.2OVbjfS0DoZxfmhZLCgAtRfbAAahvTq',
    status = 'ACTIVE'
WHERE email = 'admin@commerce-system.local';

-- Assign ADMIN role if not already assigned
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN roles r ON r.code = 'ADMIN'
WHERE u.email = 'admin@commerce-system.local'
  AND NOT EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = u.id AND ur.role_id = r.id
  );
