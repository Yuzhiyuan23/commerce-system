-- 添加商品标签支持
-- 用于百亿补贴、限时秒杀、官方好货等营销活动

-- 1. 添加标签字段到商品表
ALTER TABLE products ADD COLUMN tags VARCHAR(255) NULL COMMENT '商品标签，多个标签用逗号分隔，如：百亿补贴,限时秒杀';

-- 2. 创建标签索引
CREATE INDEX idx_products_tags ON products(tags);

-- 3. 为现有商品添加标签（基于分类）
-- 手机数码 - 限时秒杀
UPDATE products SET tags = '限时秒杀' WHERE category_id = (SELECT id FROM product_categories WHERE name = '手机数码');

-- 家用电器 - 百亿补贴
UPDATE products SET tags = '百亿补贴' WHERE category_id = (SELECT id FROM product_categories WHERE name = '家用电器');

-- 服饰鞋包 - 官方好货
UPDATE products SET tags = '官方好货' WHERE category_id = (SELECT id FROM product_categories WHERE name = '服饰鞋包');

-- 电脑办公 - 百亿补贴,官方好货
UPDATE products SET tags = '百亿补贴,官方好货' WHERE category_id = (SELECT id FROM product_categories WHERE name = '电脑办公');

-- 美妆护肤 - 官方好货
UPDATE products SET tags = '官方好货' WHERE category_id = (SELECT id FROM product_categories WHERE name = '美妆护肤');

-- 食品生鲜 - 限时秒杀
UPDATE products SET tags = '限时秒杀' WHERE category_id = (SELECT id FROM product_categories WHERE name = '食品生鲜');

-- 图书音像 - 官方好货
UPDATE products SET tags = '官方好货' WHERE category_id = (SELECT id FROM product_categories WHERE name = '图书音像');

-- 运动户外 - 百亿补贴
UPDATE products SET tags = '百亿补贴' WHERE category_id = (SELECT id FROM product_categories WHERE name = '运动户外');
