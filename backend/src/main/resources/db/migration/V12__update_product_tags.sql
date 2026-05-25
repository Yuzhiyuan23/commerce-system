-- 更新商品标签确保每个商品都有正确标签

-- 清除现有标签
UPDATE products SET tags = NULL;

-- 根据分类分配标签
-- 手机数码 - 限时秒杀
UPDATE products SET tags = '限时秒杀'
WHERE category_id = (SELECT id FROM product_categories WHERE name = '手机数码');

-- 家用电器 - 百亿补贴
UPDATE products SET tags = '百亿补贴'
WHERE category_id = (SELECT id FROM product_categories WHERE name = '家用电器');

-- 服饰鞋包 - 官方好货
UPDATE products SET tags = '官方好货'
WHERE category_id = (SELECT id FROM product_categories WHERE name = '服饰鞋包');

-- 电脑办公 - 百亿补贴,官方好货
UPDATE products SET tags = '百亿补贴,官方好货'
WHERE category_id = (SELECT id FROM product_categories WHERE name = '电脑办公');

-- 美妆护肤 - 官方好货
UPDATE products SET tags = '官方好货'
WHERE category_id = (SELECT id FROM product_categories WHERE name = '美妆护肤');

-- 食品生鲜 - 限时秒杀
UPDATE products SET tags = '限时秒杀'
WHERE category_id = (SELECT id FROM product_categories WHERE name = '食品生鲜');

-- 图书音像 - 官方好货
UPDATE products SET tags = '官方好货'
WHERE category_id = (SELECT id FROM product_categories WHERE name = '图书音像');

-- 运动户外 - 百亿补贴
UPDATE products SET tags = '百亿补贴'
WHERE category_id = (SELECT id FROM product_categories WHERE name = '运动户外');

-- 验证标签分配结果
SELECT
    pc.name as category_name,
    COUNT(*) as product_count,
    GROUP_CONCAT(DISTINCT p.tags) as tags
FROM products p
JOIN product_categories pc ON pc.id = p.category_id
WHERE p.deleted = 0
GROUP BY pc.name;
