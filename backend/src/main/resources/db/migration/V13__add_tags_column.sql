-- 添加商品标签字段（如果还没有添加）
-- 用于商家给商品添加营销标签

-- 检查并添加 tags 字段
SET @dbname = DATABASE();
SET @tablename = 'products';
SET @columnname = 'tags';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = @dbname
      AND TABLE_NAME = @tablename
      AND COLUMN_NAME = @columnname
  ) = 0,
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' VARCHAR(255) NULL COMMENT "商品标签，多个标签用逗号分隔"'),
  'SELECT 1'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- 创建标签索引（如果不存在）
SET @indexname = 'idx_products_tags';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = @dbname
      AND TABLE_NAME = @tablename
      AND INDEX_NAME = @indexname
  ) = 0,
  CONCAT('CREATE INDEX ', @indexname, ' ON ', @tablename, '(', @columnname, ')'),
  'SELECT 1'
));
PREPARE createIndexIfNotExists FROM @preparedStatement;
EXECUTE createIndexIfNotExists;
DEALLOCATE PREPARE createIndexIfNotExists;

-- 初始化标签数据（如果还没有设置）
UPDATE products SET tags = '限时秒杀'
WHERE category_id = (SELECT id FROM product_categories WHERE name = '手机数码')
  AND (tags IS NULL OR tags = '');

UPDATE products SET tags = '百亿补贴'
WHERE category_id = (SELECT id FROM product_categories WHERE name = '家用电器')
  AND (tags IS NULL OR tags = '');

UPDATE products SET tags = '官方好货'
WHERE category_id = (SELECT id FROM product_categories WHERE name = '服饰鞋包')
  AND (tags IS NULL OR tags = '');

UPDATE products SET tags = '百亿补贴,官方好货'
WHERE category_id = (SELECT id FROM product_categories WHERE name = '电脑办公')
  AND (tags IS NULL OR tags = '');

UPDATE products SET tags = '官方好货'
WHERE category_id = (SELECT id FROM product_categories WHERE name = '美妆护肤')
  AND (tags IS NULL OR tags = '');

UPDATE products SET tags = '限时秒杀'
WHERE category_id = (SELECT id FROM product_categories WHERE name = '食品生鲜')
  AND (tags IS NULL OR tags = '');

UPDATE products SET tags = '官方好货'
WHERE category_id = (SELECT id FROM product_categories WHERE name = '图书音像')
  AND (tags IS NULL OR tags = '');

UPDATE products SET tags = '百亿补贴'
WHERE category_id = (SELECT id FROM product_categories WHERE name = '运动户外')
  AND (tags IS NULL OR tags = '');

-- 验证标签分配
SELECT
    pc.name as category_name,
    COUNT(*) as product_count,
    GROUP_CONCAT(DISTINCT p.tags) as tags
FROM products p
JOIN product_categories pc ON pc.id = p.category_id
WHERE p.deleted = 0
GROUP BY pc.name;
