-- Migration: Chuyển đổi database sang tiếng Việt với PascalCase (Fixed)

-- Bảng hồ sơ người dùng
ALTER TABLE IF EXISTS profiles RENAME TO "HoSo";
ALTER TABLE "HoSo" RENAME COLUMN user_id TO nguoiDungId;
ALTER TABLE "HoSo" RENAME COLUMN full_name TO hoTen;
ALTER TABLE "HoSo" RENAME COLUMN date_of_birth TO ngaySinh;
ALTER TABLE "HoSo" RENAME COLUMN phone_number TO soDienThoai;
ALTER TABLE "HoSo" RENAME COLUMN avatar_url TO anhDaiDien;
ALTER TABLE "HoSo" RENAME COLUMN gender TO gioiTinh;
ALTER TABLE "HoSo" RENAME COLUMN created_at TO taoLuc;
ALTER TABLE "HoSo" RENAME COLUMN updated_at TO capNhatLuc;

-- Bảng hồ sơ sức khỏe
ALTER TABLE IF EXISTS health_profiles RENAME TO "HoSoSucKhoe";
ALTER TABLE "HoSoSucKhoe" RENAME COLUMN user_id TO nguoiDungId;
ALTER TABLE "HoSoSucKhoe" RENAME COLUMN height TO chieuCao;
ALTER TABLE "HoSoSucKhoe" RENAME COLUMN weight TO canNang;
ALTER TABLE "HoSoSucKhoe" RENAME COLUMN daily_calorie_goal TO mucTieuCaloHangNgay;
ALTER TABLE "HoSoSucKhoe" RENAME COLUMN activity_level TO mucDoHoatDong;
ALTER TABLE "HoSoSucKhoe" RENAME COLUMN health_goals TO mucTieuSucKhoe;
ALTER TABLE "HoSoSucKhoe" RENAME COLUMN health_conditions TO tinhTrangSucKhoe;
ALTER TABLE "HoSoSucKhoe" RENAME COLUMN dietary_restrictions TO hanCheAnUong;
ALTER TABLE "HoSoSucKhoe" RENAME COLUMN allergies TO diUng;
ALTER TABLE "HoSoSucKhoe" RENAME COLUMN created_at TO taoLuc;
ALTER TABLE "HoSoSucKhoe" RENAME COLUMN updated_at TO capNhatLuc;

-- Bảng vai trò người dùng
ALTER TABLE IF EXISTS user_roles RENAME TO "VaiTroNguoiDung";
ALTER TABLE "VaiTroNguoiDung" RENAME COLUMN user_id TO nguoiDungId;
ALTER TABLE "VaiTroNguoiDung" RENAME COLUMN role TO vaiTro;
ALTER TABLE "VaiTroNguoiDung" RENAME COLUMN created_at TO taoLuc;

-- Bảng nguyên liệu
ALTER TABLE IF EXISTS ingredients RENAME TO "NguyenLieu";
ALTER TABLE "NguyenLieu" RENAME COLUMN name TO ten;
ALTER TABLE "NguyenLieu" RENAME COLUMN calories_per_100g TO caloPer100g;
ALTER TABLE "NguyenLieu" RENAME COLUMN protein_per_100g TO proteinPer100g;
ALTER TABLE "NguyenLieu" RENAME COLUMN carbs_per_100g TO carbonPer100g;
ALTER TABLE "NguyenLieu" RENAME COLUMN fat_per_100g TO chatBeoPer100g;
ALTER TABLE "NguyenLieu" RENAME COLUMN fiber_per_100g TO chaPer100g;
ALTER TABLE "NguyenLieu" RENAME COLUMN sugar_per_100g TO duongPer100g;
ALTER TABLE "NguyenLieu" RENAME COLUMN sodium_per_100g TO natriPer100g;
ALTER TABLE "NguyenLieu" RENAME COLUMN created_at TO taoLuc;

-- Bảng công thức
ALTER TABLE IF EXISTS recipes RENAME TO "CongThuc";
ALTER TABLE "CongThuc" RENAME COLUMN name TO ten;
ALTER TABLE "CongThuc" RENAME COLUMN description TO moTa;
ALTER TABLE "CongThuc" RENAME COLUMN instructions TO huongDan;
ALTER TABLE "CongThuc" RENAME COLUMN prep_time_minutes TO thoiGianChuanBi;
ALTER TABLE "CongThuc" RENAME COLUMN cook_time_minutes TO thoiGianNau;
ALTER TABLE "CongThuc" RENAME COLUMN servings TO soKhauPhan;
ALTER TABLE "CongThuc" RENAME COLUMN total_calories TO tongCalo;
ALTER TABLE "CongThuc" RENAME COLUMN total_protein TO tongProtein;
ALTER TABLE "CongThuc" RENAME COLUMN total_carbs TO tongCarbon;
ALTER TABLE "CongThuc" RENAME COLUMN total_fat TO tongChatBeo;
ALTER TABLE "CongThuc" RENAME COLUMN difficulty TO doKho;
ALTER TABLE "CongThuc" RENAME COLUMN image_url TO anhUrl;
ALTER TABLE "CongThuc" RENAME COLUMN created_by TO nguoiTao;
ALTER TABLE "CongThuc" RENAME COLUMN is_public TO congKhai;
ALTER TABLE "CongThuc" RENAME COLUMN created_at TO taoLuc;
ALTER TABLE "CongThuc" RENAME COLUMN updated_at TO capNhatLuc;

-- Bảng nguyên liệu công thức
ALTER TABLE IF EXISTS recipe_ingredients RENAME TO "NguyenLieuCongThuc";
ALTER TABLE "NguyenLieuCongThuc" RENAME COLUMN recipe_id TO congThucId;
ALTER TABLE "NguyenLieuCongThuc" RENAME COLUMN ingredient_id TO nguyenLieuId;
ALTER TABLE "NguyenLieuCongThuc" RENAME COLUMN amount TO soLuong;
ALTER TABLE "NguyenLieuCongThuc" RENAME COLUMN unit TO donVi;

-- Bảng danh mục bữa ăn
ALTER TABLE IF EXISTS meal_categories RENAME TO "DanhMucBuaAn";
ALTER TABLE "DanhMucBuaAn" RENAME COLUMN name TO ten;
ALTER TABLE "DanhMucBuaAn" RENAME COLUMN description TO moTa;
ALTER TABLE "DanhMucBuaAn" RENAME COLUMN display_order TO thuTuHienThi;
ALTER TABLE "DanhMucBuaAn" RENAME COLUMN created_at TO taoLuc;

-- Bảng kế hoạch bữa ăn
ALTER TABLE IF EXISTS meal_plans RENAME TO "KeHoachBuaAn";
ALTER TABLE "KeHoachBuaAn" RENAME COLUMN user_id TO nguoiDungId;
ALTER TABLE "KeHoachBuaAn" RENAME COLUMN name TO ten;
ALTER TABLE "KeHoachBuaAn" RENAME COLUMN description TO moTa;
ALTER TABLE "KeHoachBuaAn" RENAME COLUMN calorie_target TO mucTieuCalo;
ALTER TABLE "KeHoachBuaAn" RENAME COLUMN start_date TO ngayBatDau;
ALTER TABLE "KeHoachBuaAn" RENAME COLUMN end_date TO ngayKetThuc;
ALTER TABLE "KeHoachBuaAn" RENAME COLUMN is_active TO hoatDong;
ALTER TABLE "KeHoachBuaAn" RENAME COLUMN created_at TO taoLuc;
ALTER TABLE "KeHoachBuaAn" RENAME COLUMN updated_at TO capNhatLuc;

-- Bảng món ăn kế hoạch
ALTER TABLE IF EXISTS meal_plan_items RENAME TO "MonAnKeHoach";
ALTER TABLE "MonAnKeHoach" RENAME COLUMN meal_plan_id TO keHoachBuaAnId;
ALTER TABLE "MonAnKeHoach" RENAME COLUMN recipe_id TO congThucId;
ALTER TABLE "MonAnKeHoach" RENAME COLUMN meal_category_id TO danhMucBuaAnId;
ALTER TABLE "MonAnKeHoach" RENAME COLUMN scheduled_date TO ngayDuKien;
ALTER TABLE "MonAnKeHoach" RENAME COLUMN scheduled_time TO gioDuKien;
ALTER TABLE "MonAnKeHoach" RENAME COLUMN servings TO soKhauPhan;
ALTER TABLE "MonAnKeHoach" RENAME COLUMN created_at TO taoLuc;

-- Bảng nhật ký dinh dưỡng (fixed protein duplicate)
ALTER TABLE IF EXISTS nutrition_logs RENAME TO "NhatKyDinhDuong";
ALTER TABLE "NhatKyDinhDuong" RENAME COLUMN user_id TO nguoiDungId;
ALTER TABLE "NhatKyDinhDuong" RENAME COLUMN log_date TO ngayGhiNhan;
ALTER TABLE "NhatKyDinhDuong" RENAME COLUMN meal_category_id TO danhMucBuaAnId;
ALTER TABLE "NhatKyDinhDuong" RENAME COLUMN recipe_id TO congThucId;
ALTER TABLE "NhatKyDinhDuong" RENAME COLUMN food_name TO tenThucPham;
ALTER TABLE "NhatKyDinhDuong" RENAME COLUMN amount TO soLuong;
ALTER TABLE "NhatKyDinhDuong" RENAME COLUMN unit TO donVi;
ALTER TABLE "NhatKyDinhDuong" RENAME COLUMN calories TO calo;
ALTER TABLE "NhatKyDinhDuong" RENAME COLUMN carbs TO carbon;
ALTER TABLE "NhatKyDinhDuong" RENAME COLUMN fat TO chatBeo;
ALTER TABLE "NhatKyDinhDuong" RENAME COLUMN notes TO ghiChu;
ALTER TABLE "NhatKyDinhDuong" RENAME COLUMN created_at TO taoLuc;

-- Bảng nhật ký cân nặng
ALTER TABLE IF EXISTS weight_logs RENAME TO "NhatKyCanNang";
ALTER TABLE "NhatKyCanNang" RENAME COLUMN user_id TO nguoiDungId;
ALTER TABLE "NhatKyCanNang" RENAME COLUMN weight TO canNang;
ALTER TABLE "NhatKyCanNang" RENAME COLUMN log_date TO ngayGhiNhan;
ALTER TABLE "NhatKyCanNang" RENAME COLUMN notes TO ghiChu;
ALTER TABLE "NhatKyCanNang" RENAME COLUMN created_at TO taoLuc;

-- Bảng nhật ký nước
ALTER TABLE IF EXISTS water_logs RENAME TO "NhatKyNuoc";
ALTER TABLE "NhatKyNuoc" RENAME COLUMN user_id TO nguoiDungId;
ALTER TABLE "NhatKyNuoc" RENAME COLUMN amount_ml TO soLuongMl;
ALTER TABLE "NhatKyNuoc" RENAME COLUMN log_date TO ngayGhiNhan;
ALTER TABLE "NhatKyNuoc" RENAME COLUMN log_time TO gioGhiNhan;
ALTER TABLE "NhatKyNuoc" RENAME COLUMN created_at TO taoLuc;

-- Bảng danh sách mua sắm
ALTER TABLE IF EXISTS shopping_lists RENAME TO "DanhSachMuaSam";
ALTER TABLE "DanhSachMuaSam" RENAME COLUMN user_id TO nguoiDungId;
ALTER TABLE "DanhSachMuaSam" RENAME COLUMN name TO ten;
ALTER TABLE "DanhSachMuaSam" RENAME COLUMN created_at TO taoLuc;
ALTER TABLE "DanhSachMuaSam" RENAME COLUMN updated_at TO capNhatLuc;

-- Bảng món mua sắm
ALTER TABLE IF EXISTS shopping_items RENAME TO "MonMuaSam";
ALTER TABLE "MonMuaSam" RENAME COLUMN shopping_list_id TO danhSachMuaSamId;
ALTER TABLE "MonMuaSam" RENAME COLUMN ingredient_name TO tenNguyenLieu;
ALTER TABLE "MonMuaSam" RENAME COLUMN amount TO soLuong;
ALTER TABLE "MonMuaSam" RENAME COLUMN unit TO donVi;
ALTER TABLE "MonMuaSam" RENAME COLUMN is_purchased TO daMua;
ALTER TABLE "MonMuaSam" RENAME COLUMN created_at TO taoLuc;

-- Bảng gói đăng ký
ALTER TABLE IF EXISTS subscription_plans RENAME TO "GoiDangKy";
ALTER TABLE "GoiDangKy" RENAME COLUMN name TO ten;
ALTER TABLE "GoiDangKy" RENAME COLUMN description TO moTa;
ALTER TABLE "GoiDangKy" RENAME COLUMN monthly_price TO giaThang;
ALTER TABLE "GoiDangKy" RENAME COLUMN annual_price TO giaNam;
ALTER TABLE "GoiDangKy" RENAME COLUMN features TO tinhNang;
ALTER TABLE "GoiDangKy" RENAME COLUMN max_meal_plans TO maxKeHoach;
ALTER TABLE "GoiDangKy" RENAME COLUMN max_recipes TO maxCongThuc;
ALTER TABLE "GoiDangKy" RENAME COLUMN is_active TO hoatDong;
ALTER TABLE "GoiDangKy" RENAME COLUMN created_at TO taoLuc;

-- Bảng đăng ký người dùng
ALTER TABLE IF EXISTS user_subscriptions RENAME TO "DangKyNguoiDung";
ALTER TABLE "DangKyNguoiDung" RENAME COLUMN user_id TO nguoiDungId;
ALTER TABLE "DangKyNguoiDung" RENAME COLUMN plan_id TO goiDangKyId;
ALTER TABLE "DangKyNguoiDung" RENAME COLUMN stripe_customer_id TO stripeKhachHangId;
ALTER TABLE "DangKyNguoiDung" RENAME COLUMN stripe_subscription_id TO stripeDangKyId;
ALTER TABLE "DangKyNguoiDung" RENAME COLUMN status TO trangThai;
ALTER TABLE "DangKyNguoiDung" RENAME COLUMN period_start TO kyBatDau;
ALTER TABLE "DangKyNguoiDung" RENAME COLUMN period_end TO kyKetThuc;
ALTER TABLE "DangKyNguoiDung" RENAME COLUMN created_at TO taoLuc;
ALTER TABLE "DangKyNguoiDung" RENAME COLUMN updated_at TO capNhatLuc;