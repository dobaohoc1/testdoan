-- Cập nhật meal categories sang tiếng Việt
UPDATE meal_categories SET 
  name = CASE 
    WHEN name = 'Breakfast' THEN 'Bữa sáng'
    WHEN name = 'Lunch' THEN 'Bữa trua'
    WHEN name = 'Dinner' THEN 'Bữa tối'
    WHEN name = 'Snack' THEN 'Bữa phụ'
    ELSE name
  END,
  description = CASE 
    WHEN name = 'Breakfast' THEN 'Bữa ăn đầu tiên trong ngày'
    WHEN name = 'Lunch' THEN 'Bữa ăn chính giữa ngày'
    WHEN name = 'Dinner' THEN 'Bữa ăn chính cuối ngày'
    WHEN name = 'Snack' THEN 'Bữa ăn nhẹ'
    ELSE description
  END
WHERE name IN ('Breakfast', 'Lunch', 'Dinner', 'Snack');

-- Thêm meal categories tiếng Việt nếu chưa có
INSERT INTO meal_categories (name, description, display_order)
SELECT 'Bữa sáng', 'Bữa ăn đầu tiên trong ngày', 1
WHERE NOT EXISTS (SELECT 1 FROM meal_categories WHERE name = 'Bữa sáng');

INSERT INTO meal_categories (name, description, display_order)
SELECT 'Bữa trua', 'Bữa ăn chính giữa ngày', 2
WHERE NOT EXISTS (SELECT 1 FROM meal_categories WHERE name = 'Bữa trua');

INSERT INTO meal_categories (name, description, display_order)
SELECT 'Bữa tối', 'Bữa ăn chính cuối ngày', 3
WHERE NOT EXISTS (SELECT 1 FROM meal_categories WHERE name = 'Bữa tối');

INSERT INTO meal_categories (name, description, display_order)
SELECT 'Bữa phụ', 'Bữa ăn nhẹ', 4
WHERE NOT EXISTS (SELECT 1 FROM meal_categories WHERE name = 'Bữa phụ');

-- Thêm ingredients phổ biến tiếng Việt
INSERT INTO ingredients (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g)
VALUES 
  ('Gạo tẻ', 130, 2.7, 28, 0.3, 0.4),
  ('Thịt heo', 242, 27, 0, 14, 0),
  ('Thịt bò', 250, 26, 0, 15, 0),
  ('Thịt gà', 165, 31, 0, 3.6, 0),
  ('Cá hồi', 208, 25, 0, 12, 0),
  ('Trứng gà', 155, 13, 1.1, 11, 0),
  ('Rau cải xanh', 22, 2.9, 3.4, 0.3, 2.5),
  ('Cà rốt', 41, 0.9, 9.6, 0.2, 2.8),
  ('Khoai tây', 77, 2, 17, 0.1, 2.2),
  ('Chuối', 89, 1.1, 23, 0.3, 2.6),
  ('Táo', 52, 0.3, 14, 0.2, 2.4),
  ('Sữa tươi', 42, 3.4, 5, 1, 0),
  ('Đậu phụ', 76, 8, 1.9, 4.8, 0.3),
  ('Bánh mì', 265, 9, 49, 3.2, 2.7),
  ('Phở', 85, 5, 15, 1, 1)
ON CONFLICT (name) DO NOTHING;

-- Thêm subscription plans tiếng Việt
INSERT INTO subscription_plans (name, description, price_monthly, price_yearly, max_recipes, max_meal_plans, features, is_active)
VALUES 
  ('Gói Cơ bản', 'Gói cơ bản cho người mới bắt đầu', 0, 0, 10, 2, '["Theo dõi dinh dưỡng cơ bản", "Thực đơn đơn giản", "Công thức miễn phí"]', true),
  ('Gói Premium', 'Gói premium với đầy đủ tính năng', 99000, 990000, 100, 10, '["Theo dõi dinh dưỡng nâng cao", "Thực đơn không giới hạn", "Phân tích chi tiết", "Hỗ trợ 24/7"]', true),
  ('Gói Chuyên nghiệp', 'Gói dành cho chuyên gia dinh dưỡng', 199000, 1990000, -1, -1, '["Tất cả tính năng Premium", "Quản lý khách hàng", "Báo cáo chi tiết", "API access"]', true)
ON CONFLICT (name) DO NOTHING;