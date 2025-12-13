-- Migration: Chuyển toàn bộ database sang tiếng Việt
-- Đổi tên bảng và cột theo chuẩn tiếng Việt không dấu

-- 1. Đổi tên bảng profiles thành HoSo
ALTER TABLE profiles RENAME TO "HoSo";
ALTER TABLE "HoSo" RENAME COLUMN user_id TO nguoiDungId;
ALTER TABLE "HoSo" RENAME COLUMN full_name TO hoTen;
ALTER TABLE "HoSo" RENAME COLUMN date_of_birth TO ngaySinh;
ALTER TABLE "HoSo" RENAME COLUMN avatar_url TO anhDaiDien;
ALTER TABLE "HoSo" RENAME COLUMN phone TO soDienThoai;
ALTER TABLE "HoSo" RENAME COLUMN gender TO gioiTinh;
ALTER TABLE "HoSo" RENAME COLUMN created_at TO taoLuc;
ALTER TABLE "HoSo" RENAME COLUMN updated_at TO capNhatLuc;

-- 2. Đổi tên bảng health_profiles thành HoSoSucKhoe
ALTER TABLE health_profiles RENAME TO "HoSoSucKhoe";
ALTER TABLE "HoSoSucKhoe" RENAME COLUMN user_id TO nguoiDungId;
ALTER TABLE "HoSoSucKhoe" RENAME COLUMN height TO chieuCao;
ALTER TABLE "HoSoSucKhoe" RENAME COLUMN weight TO canNang;
ALTER TABLE "HoSoSucKhoe" RENAME COLUMN daily_calorie_target TO mucTieuCaloHangNgay;
ALTER TABLE "HoSoSucKhoe" RENAME COLUMN health_conditions TO tinhTrangSucKhoe;
ALTER TABLE "HoSoSucKhoe" RENAME COLUMN activity_level TO mucDoHoatDong;
ALTER TABLE "HoSoSucKhoe" RENAME COLUMN health_goals TO mucTieuSucKhoe;
ALTER TABLE "HoSoSucKhoe" RENAME COLUMN dietary_restrictions TO hanCheCheDo;
ALTER TABLE "HoSoSucKhoe" RENAME COLUMN allergies TO diUng;
ALTER TABLE "HoSoSucKhoe" RENAME COLUMN created_at TO taoLuc;
ALTER TABLE "HoSoSucKhoe" RENAME COLUMN updated_at TO capNhatLuc;

-- 3. Đổi tên bảng recipes thành CongThuc
ALTER TABLE recipes RENAME TO "CongThuc";
ALTER TABLE "CongThuc" RENAME COLUMN name TO ten;
ALTER TABLE "CongThuc" RENAME COLUMN description TO moTa;
ALTER TABLE "CongThuc" RENAME COLUMN instructions TO huongDan;
ALTER TABLE "CongThuc" RENAME COLUMN prep_time TO thoiGianChuanBi;
ALTER TABLE "CongThuc" RENAME COLUMN cook_time TO thoiGianNau;
ALTER TABLE "CongThuc" RENAME COLUMN servings TO khauPhan;
ALTER TABLE "CongThuc" RENAME COLUMN difficulty TO doKho;
ALTER TABLE "CongThuc" RENAME COLUMN image_url TO anhDaiDien;
ALTER TABLE "CongThuc" RENAME COLUMN total_calories TO tongCalo;
ALTER TABLE "CongThuc" RENAME COLUMN total_protein TO tongDam;
ALTER TABLE "CongThuc" RENAME COLUMN total_carbs TO tongCarb;
ALTER TABLE "CongThuc" RENAME COLUMN total_fat TO tongChat;
ALTER TABLE "CongThuc" RENAME COLUMN created_by TO nguoiTao;
ALTER TABLE "CongThuc" RENAME COLUMN is_public TO congKhai;
ALTER TABLE "CongThuc" RENAME COLUMN created_at TO taoLuc;
ALTER TABLE "CongThuc" RENAME COLUMN updated_at TO capNhatLuc;

-- 4. Đổi tên bảng ingredients thành NguyenLieu
ALTER TABLE ingredients RENAME TO "NguyenLieu";
ALTER TABLE "NguyenLieu" RENAME COLUMN name TO ten;
ALTER TABLE "NguyenLieu" RENAME COLUMN calories_per_100g TO calo100g;
ALTER TABLE "NguyenLieu" RENAME COLUMN protein_per_100g TO dam100g;
ALTER TABLE "NguyenLieu" RENAME COLUMN carbs_per_100g TO carb100g;
ALTER TABLE "NguyenLieu" RENAME COLUMN fat_per_100g TO chat100g;
ALTER TABLE "NguyenLieu" RENAME COLUMN fiber_per_100g TO xo100g;
ALTER TABLE "NguyenLieu" RENAME COLUMN sugar_per_100g TO duong100g;
ALTER TABLE "NguyenLieu" RENAME COLUMN sodium_per_100g TO natri100g;
ALTER TABLE "NguyenLieu" RENAME COLUMN created_at TO taoLuc;

-- 5. Đổi tên bảng recipe_ingredients thành NguyenLieuCongThuc
ALTER TABLE recipe_ingredients RENAME TO "NguyenLieuCongThuc";
ALTER TABLE "NguyenLieuCongThuc" RENAME COLUMN recipe_id TO congThucId;
ALTER TABLE "NguyenLieuCongThuc" RENAME COLUMN ingredient_id TO nguyenLieuId;
ALTER TABLE "NguyenLieuCongThuc" RENAME COLUMN quantity TO soLuong;
ALTER TABLE "NguyenLieuCongThuc" RENAME COLUMN unit TO donVi;

-- 6. Đổi tên bảng meal_categories thành DanhMucBuaAn
ALTER TABLE meal_categories RENAME TO "DanhMucBuaAn";
ALTER TABLE "DanhMucBuaAn" RENAME COLUMN name TO ten;
ALTER TABLE "DanhMucBuaAn" RENAME COLUMN description TO moTa;
ALTER TABLE "DanhMucBuaAn" RENAME COLUMN display_order TO thuTuHienThi;
ALTER TABLE "DanhMucBuaAn" RENAME COLUMN created_at TO taoLuc;

-- 7. Đổi tên bảng meal_plans thành KeHoachBuaAn
ALTER TABLE meal_plans RENAME TO "KeHoachBuaAn";
ALTER TABLE "KeHoachBuaAn" RENAME COLUMN user_id TO nguoiDungId;
ALTER TABLE "KeHoachBuaAn" RENAME COLUMN name TO ten;
ALTER TABLE "KeHoachBuaAn" RENAME COLUMN description TO moTa;
ALTER TABLE "KeHoachBuaAn" RENAME COLUMN calorie_goal TO mucTieuCalo;
ALTER TABLE "KeHoachBuaAn" RENAME COLUMN start_date TO ngayBatDau;
ALTER TABLE "KeHoachBuaAn" RENAME COLUMN end_date TO ngayKetThuc;
ALTER TABLE "KeHoachBuaAn" RENAME COLUMN is_active TO dangHoatDong;
ALTER TABLE "KeHoachBuaAn" RENAME COLUMN created_at TO taoLuc;
ALTER TABLE "KeHoachBuaAn" RENAME COLUMN updated_at TO capNhatLuc;

-- 8. Đổi tên bảng meal_plan_items thành MonAnKeHoach
ALTER TABLE meal_plan_items RENAME TO "MonAnKeHoach";
ALTER TABLE "MonAnKeHoach" RENAME COLUMN meal_plan_id TO keHoachId;
ALTER TABLE "MonAnKeHoach" RENAME COLUMN recipe_id TO congThucId;
ALTER TABLE "MonAnKeHoach" RENAME COLUMN meal_category_id TO danhMucId;
ALTER TABLE "MonAnKeHoach" RENAME COLUMN planned_date TO ngayDuKien;
ALTER TABLE "MonAnKeHoach" RENAME COLUMN planned_time TO gioDuKien;
ALTER TABLE "MonAnKeHoach" RENAME COLUMN servings TO khauPhan;
ALTER TABLE "MonAnKeHoach" RENAME COLUMN created_at TO taoLuc;

-- 9. Đổi tên bảng nutrition_logs thành NhatKyDinhDuong
ALTER TABLE nutrition_logs RENAME TO "NhatKyDinhDuong";
ALTER TABLE "NhatKyDinhDuong" RENAME COLUMN user_id TO nguoiDungId;
ALTER TABLE "NhatKyDinhDuong" RENAME COLUMN log_date TO ngayGhiNhan;
ALTER TABLE "NhatKyDinhDuong" RENAME COLUMN meal_category_id TO danhMucId;
ALTER TABLE "NhatKyDinhDuong" RENAME COLUMN recipe_id TO congThucId;
ALTER TABLE "NhatKyDinhDuong" RENAME COLUMN food_item TO tenThucPham;
ALTER TABLE "NhatKyDinhDuong" RENAME COLUMN quantity TO soLuong;
ALTER TABLE "NhatKyDinhDuong" RENAME COLUMN unit TO donVi;
ALTER TABLE "NhatKyDinhDuong" RENAME COLUMN calories TO calo;
ALTER TABLE "NhatKyDinhDuong" RENAME COLUMN protein TO dam;
ALTER TABLE "NhatKyDinhDuong" RENAME COLUMN carbs TO carb;
ALTER TABLE "NhatKyDinhDuong" RENAME COLUMN fat TO chat;
ALTER TABLE "NhatKyDinhDuong" RENAME COLUMN notes TO ghiChu;
ALTER TABLE "NhatKyDinhDuong" RENAME COLUMN created_at TO taoLuc;

-- 10. Đổi tên bảng weight_logs thành NhatKyCanNang
ALTER TABLE weight_logs RENAME TO "NhatKyCanNang";
ALTER TABLE "NhatKyCanNang" RENAME COLUMN user_id TO nguoiDungId;
ALTER TABLE "NhatKyCanNang" RENAME COLUMN weight TO canNang;
ALTER TABLE "NhatKyCanNang" RENAME COLUMN log_date TO ngayGhiNhan;
ALTER TABLE "NhatKyCanNang" RENAME COLUMN notes TO ghiChu;
ALTER TABLE "NhatKyCanNang" RENAME COLUMN created_at TO taoLuc;

-- 11. Đổi tên bảng water_logs thành NhatKyNuoc
ALTER TABLE water_logs RENAME TO "NhatKyNuoc";
ALTER TABLE "NhatKyNuoc" RENAME COLUMN user_id TO nguoiDungId;
ALTER TABLE "NhatKyNuoc" RENAME COLUMN amount_ml TO soLuongMl;
ALTER TABLE "NhatKyNuoc" RENAME COLUMN log_date TO ngayGhiNhan;
ALTER TABLE "NhatKyNuoc" RENAME COLUMN log_time TO gioGhiNhan;
ALTER TABLE "NhatKyNuoc" RENAME COLUMN created_at TO taoLuc;

-- 12. Đổi tên bảng shopping_lists thành DanhSachMuaSam
ALTER TABLE shopping_lists RENAME TO "DanhSachMuaSam";
ALTER TABLE "DanhSachMuaSam" RENAME COLUMN user_id TO nguoiDungId;
ALTER TABLE "DanhSachMuaSam" RENAME COLUMN name TO ten;
ALTER TABLE "DanhSachMuaSam" RENAME COLUMN created_at TO taoLuc;
ALTER TABLE "DanhSachMuaSam" RENAME COLUMN updated_at TO capNhatLuc;

-- 13. Đổi tên bảng shopping_items thành MonMuaSam
ALTER TABLE shopping_items RENAME TO "MonMuaSam";
ALTER TABLE "MonMuaSam" RENAME COLUMN shopping_list_id TO danhSachId;
ALTER TABLE "MonMuaSam" RENAME COLUMN ingredient_name TO tenNguyenLieu;
ALTER TABLE "MonMuaSam" RENAME COLUMN quantity TO soLuong;
ALTER TABLE "MonMuaSam" RENAME COLUMN unit TO donVi;
ALTER TABLE "MonMuaSam" RENAME COLUMN is_purchased TO daMua;
ALTER TABLE "MonMuaSam" RENAME COLUMN created_at TO taoLuc;

-- 14. Đổi tên bảng subscription_plans thành GoiDangKy
ALTER TABLE subscription_plans RENAME TO "GoiDangKy";
ALTER TABLE "GoiDangKy" RENAME COLUMN name TO ten;
ALTER TABLE "GoiDangKy" RENAME COLUMN description TO moTa;
ALTER TABLE "GoiDangKy" RENAME COLUMN price_monthly TO giaThang;
ALTER TABLE "GoiDangKy" RENAME COLUMN price_yearly TO giaNam;
ALTER TABLE "GoiDangKy" RENAME COLUMN features TO tinhNang;
ALTER TABLE "GoiDangKy" RENAME COLUMN max_meal_plans TO soKeHoachToiDa;
ALTER TABLE "GoiDangKy" RENAME COLUMN max_recipes TO soCongThucToiDa;
ALTER TABLE "GoiDangKy" RENAME COLUMN is_active TO dangHoatDong;
ALTER TABLE "GoiDangKy" RENAME COLUMN created_at TO taoLuc;

-- 15. Đổi tên bảng user_subscriptions thành GoiDangKyNguoiDung
ALTER TABLE user_subscriptions RENAME TO "GoiDangKyNguoiDung";
ALTER TABLE "GoiDangKyNguoiDung" RENAME COLUMN user_id TO nguoiDungId;
ALTER TABLE "GoiDangKyNguoiDung" RENAME COLUMN subscription_plan_id TO goiDangKyId;
ALTER TABLE "GoiDangKyNguoiDung" RENAME COLUMN period_start TO batDauKy;
ALTER TABLE "GoiDangKyNguoiDung" RENAME COLUMN period_end TO ketThucKy;
ALTER TABLE "GoiDangKyNguoiDung" RENAME COLUMN status TO trangThai;
ALTER TABLE "GoiDangKyNguoiDung" RENAME COLUMN stripe_customer_id TO stripeKhachHangId;
ALTER TABLE "GoiDangKyNguoiDung" RENAME COLUMN stripe_subscription_id TO stripeDangKyId;
ALTER TABLE "GoiDangKyNguoiDung" RENAME COLUMN created_at TO taoLuc;
ALTER TABLE "GoiDangKyNguoiDung" RENAME COLUMN updated_at TO capNhatLuc;

-- 16. Đổi tên bảng user_roles thành VaiTroNguoiDung
ALTER TABLE user_roles RENAME TO "VaiTroNguoiDung";
ALTER TABLE "VaiTroNguoiDung" RENAME COLUMN user_id TO nguoiDungId;
ALTER TABLE "VaiTroNguoiDung" RENAME COLUMN role TO vaiTro;
ALTER TABLE "VaiTroNguoiDung" RENAME COLUMN created_at TO taoLuc;

-- Cập nhật trigger function để sử dụng tên bảng mới
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public."HoSo" (nguoiDungId, hoTen, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NEW.email);
  
  INSERT INTO public."HoSoSucKhoe" (nguoiDungId)
  VALUES (NEW.id);
  
  INSERT INTO public."VaiTroNguoiDung" (nguoiDungId, vaiTro)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$function$;

-- Cập nhật has_role function
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role);
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public."VaiTroNguoiDung"
    WHERE nguoiDungId = _user_id AND vaiTro = _role
  )
$function$;