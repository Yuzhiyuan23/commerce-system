-- 删除图片无法显示的商品样例
-- 包括：三只松鼠坚果大礼包、海尔冰箱、戴森吸尘器、华为MateBook、小米14Pro

-- 先删除相关的SKU（因为外键约束）
DELETE FROM product_skus
WHERE product_id IN (
    SELECT id FROM products
    WHERE name LIKE '%三只松鼠%'
       OR name LIKE '%海尔冰箱%'
       OR name LIKE '%戴森%'
       OR (name LIKE '%华为%' AND name LIKE '%MateBook%')
       OR name LIKE '%小米14%'
);

-- 删除相关的商品图片
DELETE FROM product_images
WHERE product_id IN (
    SELECT id FROM products
    WHERE name LIKE '%三只松鼠%'
       OR name LIKE '%海尔冰箱%'
       OR name LIKE '%戴森%'
       OR (name LIKE '%华为%' AND name LIKE '%MateBook%')
       OR name LIKE '%小米14%'
);

-- 删除相关的商品属性值
DELETE FROM product_attribute_values
WHERE product_id IN (
    SELECT id FROM products
    WHERE name LIKE '%三只松鼠%'
       OR name LIKE '%海尔冰箱%'
       OR name LIKE '%戴森%'
       OR (name LIKE '%华为%' AND name LIKE '%MateBook%')
       OR name LIKE '%小米14%'
);

-- 删除相关的销售属性值
DELETE FROM product_sales_attribute_values
WHERE product_id IN (
    SELECT id FROM products
    WHERE name LIKE '%三只松鼠%'
       OR name LIKE '%海尔冰箱%'
       OR name LIKE '%戴森%'
       OR (name LIKE '%华为%' AND name LIKE '%MateBook%')
       OR name LIKE '%小米14%'
);

-- 删除相关的销售属性
DELETE FROM product_sales_attributes
WHERE product_id IN (
    SELECT id FROM products
    WHERE name LIKE '%三只松鼠%'
       OR name LIKE '%海尔冰箱%'
       OR name LIKE '%戴森%'
       OR (name LIKE '%华为%' AND name LIKE '%MateBook%')
       OR name LIKE '%小米14%'
);

-- 最后删除商品
DELETE FROM products
WHERE name LIKE '%三只松鼠%'
   OR name LIKE '%海尔冰箱%'
   OR name LIKE '%戴森%'
   OR (name LIKE '%华为%' AND name LIKE '%MateBook%')
   OR name LIKE '%小米14%';

-- 验证删除结果
SELECT 'Deleted products count:' as info, COUNT(*) as count FROM products
WHERE name LIKE '%三只松鼠%'
   OR name LIKE '%海尔冰箱%'
   OR name LIKE '%戴森%'
   OR (name LIKE '%华为%' AND name LIKE '%MateBook%')
   OR name LIKE '%小米14%';
