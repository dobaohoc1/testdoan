-- Insert sample subscription plans
INSERT INTO public."GoiDangKy" (ten, mota, giathang, gianam, tinhnang, sokehoachtoida, socongthuctoida, danghoatdong)
VALUES 
  (
    'Miễn phí',
    'Gói miễn phí cho người mới bắt đầu',
    0,
    0,
    '["Tạo tối đa 5 kế hoạch bữa ăn", "Tạo tối đa 10 công thức", "Theo dõi dinh dưỡng cơ bản", "Truy cập công thức cộng đồng"]'::jsonb,
    5,
    10,
    true
  ),
  (
    'Pro',
    'Gói Pro cho người dùng nghiêm túc về dinh dưỡng',
    99000,
    990000,
    '["Không giới hạn kế hoạch bữa ăn", "Không giới hạn công thức", "Phân tích dinh dưỡng chi tiết", "AI tư vấn dinh dưỡng", "Xuất báo cáo PDF", "Tích hợp với thiết bị đeo"]'::jsonb,
    NULL,
    NULL,
    true
  ),
  (
    'Premium',
    'Gói Premium cho chuyên gia và huấn luyện viên',
    199000,
    1990000,
    '["Tất cả tính năng Pro", "Tư vấn 1-1 với chuyên gia dinh dưỡng", "Kế hoạch bữa ăn cá nhân hóa AI", "Quản lý nhiều hồ sơ", "Ưu tiên hỗ trợ 24/7", "Tích hợp nâng cao"]'::jsonb,
    NULL,
    NULL,
    true
  );