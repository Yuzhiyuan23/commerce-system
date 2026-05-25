-- 更新商品图片为可靠的占位图服务
-- 解决三只松鼠、海尔冰箱、戴森吸尘器、华为MateBook、小米14Pro等图片显示问题

UPDATE products SET cover_image_url = 'https://via.placeholder.com/500x500/f5f5f5/666666?text=坚果大礼包' WHERE name LIKE '%三只松鼠%';
UPDATE products SET cover_image_url = 'https://via.placeholder.com/500x500/e8f4f8/666666?text=海尔冰箱' WHERE name LIKE '%海尔冰箱%';
UPDATE products SET cover_image_url = 'https://via.placeholder.com/500x500/f0f0f0/666666?text=戴森吸尘器' WHERE name LIKE '%戴森%' AND name LIKE '%吸尘器%';
UPDATE products SET cover_image_url = 'https://via.placeholder.com/500x500/e0e8f0/666666?text=华为MateBook' WHERE name LIKE '%华为%' AND name LIKE '%MateBook%';
UPDATE products SET cover_image_url = 'https://via.placeholder.com/500x500/fff0f0/666666?text=小米14Pro' WHERE name LIKE '%小米14%';

-- 验证更新
SELECT name, cover_image_url FROM products
WHERE name LIKE '%三只松鼠%'
   OR name LIKE '%海尔冰箱%'
   OR name LIKE '%戴森吸尘器%'
   OR name LIKE '%华为MateBook%'
   OR name LIKE '%小米14%';
