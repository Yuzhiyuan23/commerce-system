-- 添加商家ID字段到商品表
-- 用于区分不同商家发布的商品

-- 添加 merchant_id 字段
ALTER TABLE products
ADD COLUMN merchant_id BIGINT NULL COMMENT '商家ID，关联users表';

-- 创建索引
CREATE INDEX idx_products_merchant_id ON products(merchant_id);

-- 添加外键约束（可选，根据需求决定）
-- ALTER TABLE products
-- ADD CONSTRAINT fk_products_merchant FOREIGN KEY (merchant_id) REFERENCES users(id);

-- 将现有商品分配给管理员账号
UPDATE products
SET merchant_id = (SELECT id FROM users WHERE email = 'admin@commerce-system.local')
WHERE merchant_id IS NULL;
