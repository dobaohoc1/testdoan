-- Thêm dữ liệu mẫu cho hệ thống
-- Thêm recipes mẫu
INSERT INTO public.recipes (name, description, instructions, total_calories, servings, prep_time_minutes, cook_time_minutes, difficulty_level, is_public, created_by, total_protein, total_carbs, total_fat) VALUES
-- Món Việt Nam
('Phở Bò Hà Nội', 'Phở bò truyền thống Hà Nội với nước dùng trong vắt, thịt bò tươi ngon', 
 '[{"step": 1, "instruction": "Ninh xương bò 2-3 tiếng để có nước dùng trong vắt"}, {"step": 2, "instruction": "Chần bánh phở trong nước sôi 1-2 phút"}, {"step": 3, "instruction": "Bày bánh phở, thịt bò lát mỏng vào tô"}, {"step": 4, "instruction": "Rót nước dùng nóng vào tô, ăn kèm rau thơm"}]',
 450, 1, 20, 180, 'vừa', true, (SELECT id FROM auth.users LIMIT 1), 25, 60, 12),

('Bún Chả Hà Nội', 'Bún chả Hà Nội với chả nướng thơm lừng và nước chấm chua ngọt',
 '[{"step": 1, "instruction": "Ướp thịt với gia vị rồi nướng trên bếp than"}, {"step": 2, "instruction": "Pha nước mắm chua ngọt"}, {"step": 3, "instruction": "Luộc bún tươi"}, {"step": 4, "instruction": "Ăn kèm rau sống và dưa chua"}]',
 520, 1, 30, 45, 'vừa', true, (SELECT id FROM auth.users LIMIT 1), 28, 65, 18),

('Bánh Mì Thịt Nướng', 'Bánh mì Việt Nam với thịt nướng, pate và rau củ tươi ngon',
 '[{"step": 1, "instruction": "Nướng thịt thăn với gia vị đặc biệt"}, {"step": 2, "instruction": "Cắt bánh mì, phết pate"}, {"step": 3, "instruction": "Cho thịt nướng, rau sống vào bánh"}, {"step": 4, "instruction": "Rưới tương ớt và mayonnaise"}]',
 380, 1, 15, 25, 'dễ', true, (SELECT id FROM auth.users LIMIT 1), 22, 45, 15),

-- Món healthy
('Salad Quinoa Rau Củ', 'Salad quinoa bổ dưỡng với rau củ tươi và sốt bơ',
 '[{"step": 1, "instruction": "Nấu quinoa với nước sôi 15 phút"}, {"step": 2, "instruction": "Cắt rau củ thành miếng vừa ăn"}, {"step": 3, "instruction": "Trộn quinoa với rau củ"}, {"step": 4, "instruction": "Rưới sốt bơ chanh và thưởng thức"}]',
 320, 1, 20, 15, 'dễ', true, (SELECT id FROM auth.users LIMIT 1), 12, 45, 14),

('Cơm Gạo Lứt Cá Hồi', 'Cơm gạo lứt với cá hồi nướng và rau xanh',
 '[{"step": 1, "instruction": "Nấu cơm gạo lứt"}, {"step": 2, "instruction": "Ướp cá hồi với muối, tiêu, chanh"}, {"step": 3, "instruction": "Nướng cá hồi 15 phút"}, {"step": 4, "instruction": "Luộc rau xanh, bày đĩa đẹp mắt"}]',
 450, 1, 25, 35, 'vừa', true, (SELECT id FROM auth.users LIMIT 1), 35, 55, 16);

-- Thêm recipe_ingredients cho các món ăn
INSERT INTO public.recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT 
  r.id,
  i.id,
  CASE 
    WHEN i.name = 'Gạo tẻ' THEN 100
    WHEN i.name = 'Thịt bò' THEN 150  
    WHEN i.name = 'Thịt heo' THEN 120
    WHEN i.name = 'Cá hồi' THEN 150
    WHEN i.name = 'Trứng gà' THEN 1
    WHEN i.name = 'Rau cải xanh' THEN 100
    ELSE 50
  END,
  CASE 
    WHEN i.name = 'Trứng gà' THEN 'quả'
    ELSE 'gram'
  END
FROM public.recipes r, public.ingredients i 
WHERE r.name IN ('Phở Bò Hà Nội', 'Bún Chả Hà Nội', 'Cơm Gạo Lứt Cá Hồi')
  AND i.name IN ('Gạo tẻ', 'Thịt bò', 'Thịt heo', 'Cá hồi', 'Rau cải xanh')
LIMIT 15;

-- Thêm meal plans mẫu
INSERT INTO public.meal_plans (user_id, name, description, target_calories, start_date, end_date, is_active)
VALUES 
((SELECT id FROM auth.users LIMIT 1), 'Thực đơn giảm cân 7 ngày', 'Thực đơn giảm cân lành mạnh trong 7 ngày', 1400, CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', true),
((SELECT id FROM auth.users LIMIT 1), 'Thực đơn tăng cân 14 ngày', 'Thực đơn tăng cân khoa học trong 2 tuần', 2200, CURRENT_DATE, CURRENT_DATE + INTERVAL '14 days', true);

-- Thêm nutrition logs mẫu
INSERT INTO public.nutrition_logs (user_id, log_date, meal_category_id, food_name, calories, protein, carbs, fat, quantity, unit, notes)
SELECT 
  (SELECT id FROM auth.users LIMIT 1),
  CURRENT_DATE - (generate_series(1,5)),
  (SELECT id FROM public.meal_categories WHERE name = 'Bữa sáng' LIMIT 1),
  'Phở bò',
  450,
  25,
  60,
  12,
  1,
  'tô',
  'Ăn sáng tại nhà'
FROM generate_series(1,5);

-- Thêm subscription thống kê
UPDATE public.subscription_plans 
SET 
  description = CASE 
    WHEN name = 'Gói Cơ bản' THEN 'Gói miễn phí cho người mới bắt đầu với ThucdonAI'
    WHEN name = 'Gói Premium' THEN 'Gói cao cấp với đầy đủ tính năng AI và phân tích chi tiết'
    WHEN name = 'Gói Chuyên nghiệp' THEN 'Gói dành cho chuyên gia dinh dưỡng và doanh nghiệp'
  END,
  features = CASE 
    WHEN name = 'Gói Cơ bản' THEN '["Tạo thực đơn cơ bản", "Theo dõi calo", "5 công thức miễn phí", "Tư vấn AI cơ bản"]'
    WHEN name = 'Gói Premium' THEN '["Thực đơn AI không giới hạn", "Phân tích dinh dưỡng chi tiết", "Scan thực phẩm bằng camera", "Tư vấn cá nhân hóa", "100+ công thức premium", "Báo cáo sức khỏe"]'
    WHEN name = 'Gói Chuyên nghiệp' THEN '["Tất cả tính năng Premium", "Quản lý nhiều khách hàng", "API access", "White-label solution", "Báo cáo analytics", "Support 24/7", "Training chuyên sâu"]'
  END;