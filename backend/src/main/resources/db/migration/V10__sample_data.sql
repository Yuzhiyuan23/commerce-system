-- 样例数据插入脚本
-- 包含商品分类、商品、SKU、库存等数据

-- 插入商品分类
INSERT INTO product_categories (name, sort_order, status, created_at, updated_at) VALUES
('手机数码', 1, 'ENABLED', NOW(), NOW()),
('电脑办公', 2, 'ENABLED', NOW(), NOW()),
('家用电器', 3, 'ENABLED', NOW(), NOW()),
('服饰鞋包', 4, 'ENABLED', NOW(), NOW()),
('美妆护肤', 5, 'ENABLED', NOW(), NOW()),
('食品生鲜', 6, 'ENABLED', NOW(), NOW()),
('图书音像', 7, 'ENABLED', NOW(), NOW()),
('运动户外', 8, 'ENABLED', NOW(), NOW());

-- 获取分类ID
SET @cat_phone = (SELECT id FROM product_categories WHERE name = '手机数码');
SET @cat_computer = (SELECT id FROM product_categories WHERE name = '电脑办公');
SET @cat_appliance = (SELECT id FROM product_categories WHERE name = '家用电器');
SET @cat_clothing = (SELECT id FROM product_categories WHERE name = '服饰鞋包');
SET @cat_beauty = (SELECT id FROM product_categories WHERE name = '美妆护肤');
SET @cat_food = (SELECT id FROM product_categories WHERE name = '食品生鲜');
SET @cat_book = (SELECT id FROM product_categories WHERE name = '图书音像');
SET @cat_sports = (SELECT id FROM product_categories WHERE name = '运动户外');

-- 插入商品（手机数码）
INSERT INTO products (category_id, name, spu_code, subtitle, cover_image_url, description, min_sale_price, status, deleted, created_at, updated_at) VALUES
(@cat_phone, 'iPhone 15 Pro Max 256GB', 'PHONE-001', '钛金属边框，A17 Pro芯片', 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=500&auto=format&fit=crop&q=60', 'iPhone 15 Pro Max 配备钛金属边框，A17 Pro芯片，4800万像素主摄，支持USB-C接口。', 9999.00, 'ON_SHELF', 0, NOW(), NOW()),
(@cat_phone, '华为 Mate 60 Pro', 'PHONE-002', '卫星通话，麒麟芯片', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60', '华为Mate 60 Pro，支持卫星通话，搭载麒麟9000S芯片，鸿蒙操作系统。', 6999.00, 'ON_SHELF', 0, NOW(), NOW()),
(@cat_phone, '小米14 Pro', 'PHONE-003', '徕卡影像，骁龙8 Gen3', 'https://images.unsplash.com/photo-1598327777667-4b03e12c71d6?w=500&auto=format&fit=crop&q=60', '小米14 Pro，徕卡专业光学镜头，骁龙8 Gen3处理器，120W快充。', 4999.00, 'ON_SHELF', 0, NOW(), NOW()),
(@cat_phone, 'Samsung Galaxy S24 Ultra', 'PHONE-004', 'AI手机，2亿像素', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&auto=format&fit=crop&q=60', '三星Galaxy S24 Ultra，AI功能强大，2亿像素主摄，S Pen手写笔。', 9699.00, 'ON_SHELF', 0, NOW(), NOW()),
(@cat_phone, 'OPPO Find X7 Ultra', 'PHONE-005', '双潜望四主摄', 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&auto=format&fit=crop&q=60', 'OPPO Find X7 Ultra，双潜望四主摄系统，哈苏影像。', 5999.00, 'ON_SHELF', 0, NOW(), NOW());

-- 插入商品（电脑办公）
INSERT INTO products (category_id, name, spu_code, subtitle, cover_image_url, description, min_sale_price, status, deleted, created_at, updated_at) VALUES
(@cat_computer, 'MacBook Pro 14英寸 M3', 'COMP-001', 'M3芯片，18小时续航', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60', 'MacBook Pro 14英寸，M3芯片，18小时续航，Liquid Retina XDR显示屏。', 12999.00, 'ON_SHELF', 0, NOW(), NOW()),
(@cat_computer, 'ThinkPad X1 Carbon', 'COMP-002', '轻薄商务本，14小时续航', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=60', 'ThinkPad X1 Carbon，轻薄商务本，英特尔酷睿处理器，14小时续航。', 9999.00, 'ON_SHELF', 0, NOW(), NOW()),
(@cat_computer, '华为MateBook X Pro', 'COMP-003', '3.1K触控屏，超级终端', 'https://images.unsplash.com/photo-1593642632823-8f78536788c6?w=500&auto=format&fit=crop&q=60', '华为MateBook X Pro，3.1K触控屏，超级终端，多屏协同。', 8999.00, 'ON_SHELF', 0, NOW(), NOW()),
(@cat_computer, 'iPad Pro 12.9英寸', 'COMP-004', 'M2芯片，ProMotion屏幕', 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=500&auto=format&fit=crop&q=60', 'iPad Pro 12.9英寸，M2芯片，ProMotion自适应刷新率屏幕。', 8499.00, 'ON_SHELF', 0, NOW(), NOW());

-- 插入商品（家用电器）
INSERT INTO products (category_id, name, spu_code, subtitle, cover_image_url, description, min_sale_price, status, deleted, created_at, updated_at) VALUES
(@cat_appliance, '戴森V12吸尘器', 'APP-001', '激光探测，智能调速', 'https://images.unsplash.com/photo-1558317374-a354d5f6d4da?w=500&auto=format&fit=crop&q=60', '戴森V12吸尘器，激光探测灰尘，智能调速，HEPA过滤。', 4499.00, 'ON_SHELF', 0, NOW(), NOW()),
(@cat_appliance, '小米空气净化器4 Pro', 'APP-002', '除甲醛，除菌除异味', 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&auto=format&fit=crop&q=60', '小米空气净化器4 Pro，除甲醛，除菌除异味，99.99%除菌率。', 1299.00, 'ON_SHELF', 0, NOW(), NOW()),
(@cat_appliance, '美的空调 1.5匹', 'APP-003', '新一级能效，变频冷暖', 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=500&auto=format&fit=crop&q=60', '美的空调1.5匹，新一级能效，变频冷暖，智能控制。', 2599.00, 'ON_SHELF', 0, NOW(), NOW()),
(@cat_appliance, '海尔冰箱 500L', 'APP-004', '风冷无霜，双变频', 'https://images.unsplash.com/photo-1571175443880-49e1d58b794a?w=500&auto=format&fit=crop&q=60', '海尔冰箱500L，风冷无霜，双变频，一级能效。', 3999.00, 'ON_SHELF', 0, NOW(), NOW());

-- 插入商品（服饰鞋包）
INSERT INTO products (category_id, name, spu_code, subtitle, cover_image_url, description, min_sale_price, status, deleted, created_at, updated_at) VALUES
(@cat_clothing, 'Nike Air Force 1', 'CLOTH-001', '经典白色，舒适百搭', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&auto=format&fit=crop&q=60', 'Nike Air Force 1，经典白色，舒适百搭，皮革鞋面。', 749.00, 'ON_SHELF', 0, NOW(), NOW()),
(@cat_clothing, 'Adidas Ultraboost 22', 'CLOTH-002', 'Boost中底，舒适跑步', 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=500&auto=format&fit=crop&q=60', 'Adidas Ultraboost 22，Boost中底，Primeknit鞋面，舒适跑步体验。', 1099.00, 'ON_SHELF', 0, NOW(), NOW()),
(@cat_clothing, 'Uniqlo羽绒服', 'CLOTH-003', '轻薄保暖，便携收纳', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop&q=60', '优衣库轻薄羽绒服，保暖便携，收纳方便。', 399.00, 'ON_SHELF', 0, NOW(), NOW()),
(@cat_clothing, 'Coach手提包', 'CLOTH-004', '经典印花，优质皮革', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&auto=format&fit=crop&q=60', 'Coach经典印花手提包，优质皮革，时尚百搭。', 1899.00, 'ON_SHELF', 0, NOW(), NOW());

-- 插入商品（美妆护肤）
INSERT INTO products (category_id, name, spu_code, subtitle, cover_image_url, description, min_sale_price, status, deleted, created_at, updated_at) VALUES
(@cat_beauty, 'SK-II神仙水 230ml', 'BEAUTY-001', 'Pitera精华，改善肤质', 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=500&auto=format&fit=crop&q=60', 'SK-II神仙水，含90%以上Pitera精华，改善肤质，提亮肤色。', 1540.00, 'ON_SHELF', 0, NOW(), NOW()),
(@cat_beauty, '雅诗兰黛小棕瓶', 'BEAUTY-002', '修护精华，抗初老', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=60', '雅诗兰黛小棕瓶修护精华，抗初老，修护肌肤。', 850.00, 'ON_SHELF', 0, NOW(), NOW()),
(@cat_beauty, '兰蔻小黑瓶精华', 'BEAUTY-003', '肌底修护，强韧肌肤', 'https://images.unsplash.com/photo-1617897903246-719242758050?w=500&auto=format&fit=crop&q=60', '兰蔻小黑瓶精华，肌底修护，强韧肌肤屏障。', 780.00, 'ON_SHELF', 0, NOW(), NOW());

-- 插入商品（食品生鲜）
INSERT INTO products (category_id, name, spu_code, subtitle, cover_image_url, description, min_sale_price, status, deleted, created_at, updated_at) VALUES
(@cat_food, '三只松鼠坚果大礼包', 'FOOD-001', '每日坚果，健康零食', 'https://images.unsplash.com/photo-1536591375315-196000ea3676?w=500&auto=format&fit=crop&q=60', '三只松鼠坚果大礼包，每日坚果，健康零食，多种口味。', 128.00, 'ON_SHELF', 0, NOW(), NOW()),
(@cat_food, '澳洲牛排套餐', 'FOOD-002', '原切牛排，鲜嫩多汁', 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500&auto=format&fit=crop&q=60', '澳洲原切牛排套餐，鲜嫩多汁，家庭聚餐首选。', 268.00, 'ON_SHELF', 0, NOW(), NOW()),
(@cat_food, '进口车厘子 2斤', 'FOOD-003', 'JJ级大果，脆甜多汁', 'https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=500&auto=format&fit=crop&q=60', '进口车厘子JJ级大果，脆甜多汁，新鲜直达。', 168.00, 'ON_SHELF', 0, NOW(), NOW());

-- 插入商品（图书音像）
INSERT INTO products (category_id, name, spu_code, subtitle, cover_image_url, description, min_sale_price, status, deleted, created_at, updated_at) VALUES
(@cat_book, '三体全集（三册）', 'BOOK-001', '刘慈欣科幻巨作', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60', '刘慈欣《三体》全集，中国科幻巅峰之作，雨果奖获奖作品。', 98.00, 'ON_SHELF', 0, NOW(), NOW()),
(@cat_book, '人类简史', 'BOOK-002', '尤瓦尔·赫拉利著', 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60', '尤瓦尔·赫拉利《人类简史》，从动物到上帝的人类发展史。', 68.00, 'ON_SHELF', 0, NOW(), NOW()),
(@cat_book, 'Sony WH-1000XM5', 'BOOK-003', '降噪耳机，30小时续航', 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&auto=format&fit=crop&q=60', 'Sony WH-1000XM5，行业领先降噪，30小时续航，舒适佩戴。', 2499.00, 'ON_SHELF', 0, NOW(), NOW());

-- 插入商品（运动户外）
INSERT INTO products (category_id, name, spu_code, subtitle, cover_image_url, description, min_sale_price, status, deleted, created_at, updated_at) VALUES
(@cat_sports, '瑜伽垫 TPE材质', 'SPORT-001', '防滑加厚，环保无味', 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&auto=format&fit=crop&q=60', 'TPE材质瑜伽垫，防滑加厚，环保无味，初学者友好。', 89.00, 'ON_SHELF', 0, NOW(), NOW()),
(@cat_sports, '迪卡侬跑步机', 'SPORT-002', '家用折叠，静音减震', 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=500&auto=format&fit=crop&q=60', '迪卡侬家用跑步机，可折叠设计，静音减震，智能APP连接。', 1999.00, 'ON_SHELF', 0, NOW(), NOW()),
(@cat_sports, '北面冲锋衣', 'SPORT-003', '防水透气，户外必备', 'https://images.unsplash.com/photo-1547656807-9733c2b738c2?w=500&auto=format&fit=crop&q=60', '北面冲锋衣，防水透气，户外探险必备装备。', 1298.00, 'ON_SHELF', 0, NOW(), NOW()),
(@cat_sports, 'Wilson网球拍', 'SPORT-004', '碳纤维材质，专业手感', 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=500&auto=format&fit=crop&q=60', 'Wilson专业网球拍，碳纤维材质，专业手感，适合进阶选手。', 699.00, 'ON_SHELF', 0, NOW(), NOW());

-- 为每个商品插入SKU（简化版，每个商品一个SKU）
INSERT INTO product_skus (product_id, sku_code, sales_attr_value_key, sales_attr_value_text, price, stock, low_stock_threshold, status, deleted, created_at, updated_at)
SELECT
    id as product_id,
    CONCAT(spu_code, '-DEFAULT') as sku_code,
    'default:standard' as sales_attr_value_key,
    '标准版' as sales_attr_value_text,
    min_sale_price as price,
    100 as stock,
    10 as low_stock_threshold,
    'ENABLED' as status,
    0 as deleted,
    NOW() as created_at,
    NOW() as updated_at
FROM products;
