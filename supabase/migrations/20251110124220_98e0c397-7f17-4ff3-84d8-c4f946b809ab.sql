-- ============================================================
-- MIGRATION: Thêm đầy đủ Foreign Key Constraints
-- Mục đích: Đảm bảo tính toàn vẹn dữ liệu cho đồ án tốt nghiệp
-- ============================================================

-- 1. USER MANAGEMENT MODULE
-- ============================================================

-- HoSo (Profiles) → auth.users
ALTER TABLE "HoSo"
  DROP CONSTRAINT IF EXISTS "HoSo_nguoidungid_fkey",
  ADD CONSTRAINT "HoSo_nguoidungid_fkey" 
  FOREIGN KEY ("nguoidungid") 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- HoSoSucKhoe (Health Profiles) → auth.users
ALTER TABLE "HoSoSucKhoe"
  DROP CONSTRAINT IF EXISTS "HoSoSucKhoe_nguoidungid_fkey",
  ADD CONSTRAINT "HoSoSucKhoe_nguoidungid_fkey" 
  FOREIGN KEY ("nguoidungid") 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- VaiTroNguoiDung (User Roles) → auth.users
ALTER TABLE "VaiTroNguoiDung"
  DROP CONSTRAINT IF EXISTS "VaiTroNguoiDung_nguoidungid_fkey",
  ADD CONSTRAINT "VaiTroNguoiDung_nguoidungid_fkey" 
  FOREIGN KEY ("nguoidungid") 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- ============================================================
-- 2. RECIPE SYSTEM MODULE
-- ============================================================

-- CongThuc (Recipes) → auth.users
ALTER TABLE "CongThuc"
  DROP CONSTRAINT IF EXISTS "CongThuc_nguoitao_fkey",
  ADD CONSTRAINT "CongThuc_nguoitao_fkey" 
  FOREIGN KEY ("nguoitao") 
  REFERENCES auth.users(id) 
  ON DELETE SET NULL; -- Giữ recipe khi user bị xóa

-- NguyenLieuCongThuc (Recipe Ingredients) → CongThuc
ALTER TABLE "NguyenLieuCongThuc"
  DROP CONSTRAINT IF EXISTS "NguyenLieuCongThuc_congthucid_fkey",
  ADD CONSTRAINT "NguyenLieuCongThuc_congthucid_fkey" 
  FOREIGN KEY ("congthucid") 
  REFERENCES "CongThuc"(id) 
  ON DELETE CASCADE; -- Xóa recipe → xóa ingredients

-- NguyenLieuCongThuc → NguyenLieu
ALTER TABLE "NguyenLieuCongThuc"
  DROP CONSTRAINT IF EXISTS "NguyenLieuCongThuc_nguyenlieuid_fkey",
  ADD CONSTRAINT "NguyenLieuCongThuc_nguyenlieuid_fkey" 
  FOREIGN KEY ("nguyenlieuid") 
  REFERENCES "NguyenLieu"(id) 
  ON DELETE CASCADE;

-- ============================================================
-- 3. MEAL PLANNING MODULE
-- ============================================================

-- KeHoachBuaAn (Meal Plans) → auth.users
ALTER TABLE "KeHoachBuaAn"
  DROP CONSTRAINT IF EXISTS "KeHoachBuaAn_nguoidungid_fkey",
  ADD CONSTRAINT "KeHoachBuaAn_nguoidungid_fkey" 
  FOREIGN KEY ("nguoidungid") 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- MonAnKeHoach (Meal Plan Items) → KeHoachBuaAn
ALTER TABLE "MonAnKeHoach"
  DROP CONSTRAINT IF EXISTS "MonAnKeHoach_kehoachid_fkey",
  ADD CONSTRAINT "MonAnKeHoach_kehoachid_fkey" 
  FOREIGN KEY ("kehoachid") 
  REFERENCES "KeHoachBuaAn"(id) 
  ON DELETE CASCADE; -- Xóa meal plan → xóa items

-- MonAnKeHoach → CongThuc
ALTER TABLE "MonAnKeHoach"
  DROP CONSTRAINT IF EXISTS "MonAnKeHoach_congthucid_fkey",
  ADD CONSTRAINT "MonAnKeHoach_congthucid_fkey" 
  FOREIGN KEY ("congthucid") 
  REFERENCES "CongThuc"(id) 
  ON DELETE SET NULL; -- Xóa recipe → item vẫn tồn tại

-- MonAnKeHoach → DanhMucBuaAn (Meal Categories)
ALTER TABLE "MonAnKeHoach"
  DROP CONSTRAINT IF EXISTS "MonAnKeHoach_danhmucid_fkey",
  ADD CONSTRAINT "MonAnKeHoach_danhmucid_fkey" 
  FOREIGN KEY ("danhmucid") 
  REFERENCES "DanhMucBuaAn"(id) 
  ON DELETE SET NULL;

-- ============================================================
-- 4. NUTRITION TRACKING MODULE
-- ============================================================

-- NhatKyDinhDuong (Nutrition Logs) → auth.users
ALTER TABLE "NhatKyDinhDuong"
  DROP CONSTRAINT IF EXISTS "NhatKyDinhDuong_nguoidungid_fkey",
  ADD CONSTRAINT "NhatKyDinhDuong_nguoidungid_fkey" 
  FOREIGN KEY ("nguoidungid") 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- NhatKyDinhDuong → DanhMucBuaAn
ALTER TABLE "NhatKyDinhDuong"
  DROP CONSTRAINT IF EXISTS "NhatKyDinhDuong_danhmucid_fkey",
  ADD CONSTRAINT "NhatKyDinhDuong_danhmucid_fkey" 
  FOREIGN KEY ("danhmucid") 
  REFERENCES "DanhMucBuaAn"(id) 
  ON DELETE SET NULL;

-- NhatKyDinhDuong → CongThuc
ALTER TABLE "NhatKyDinhDuong"
  DROP CONSTRAINT IF EXISTS "NhatKyDinhDuong_congthucid_fkey",
  ADD CONSTRAINT "NhatKyDinhDuong_congthucid_fkey" 
  FOREIGN KEY ("congthucid") 
  REFERENCES "CongThuc"(id) 
  ON DELETE SET NULL;

-- NhatKyCanNang (Weight Logs) → auth.users
ALTER TABLE "NhatKyCanNang"
  DROP CONSTRAINT IF EXISTS "NhatKyCanNang_nguoidungid_fkey",
  ADD CONSTRAINT "NhatKyCanNang_nguoidungid_fkey" 
  FOREIGN KEY ("nguoidungid") 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- NhatKyNuoc (Water Logs) → auth.users
ALTER TABLE "NhatKyNuoc"
  DROP CONSTRAINT IF EXISTS "NhatKyNuoc_nguoidungid_fkey",
  ADD CONSTRAINT "NhatKyNuoc_nguoidungid_fkey" 
  FOREIGN KEY ("nguoidungid") 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- ============================================================
-- 5. SHOPPING LIST MODULE
-- ============================================================

-- DanhSachMuaSam (Shopping Lists) → auth.users
ALTER TABLE "DanhSachMuaSam"
  DROP CONSTRAINT IF EXISTS "DanhSachMuaSam_nguoidungid_fkey",
  ADD CONSTRAINT "DanhSachMuaSam_nguoidungid_fkey" 
  FOREIGN KEY ("nguoidungid") 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- MonMuaSam (Shopping Items) → DanhSachMuaSam
ALTER TABLE "MonMuaSam"
  DROP CONSTRAINT IF EXISTS "MonMuaSam_danhsachid_fkey",
  ADD CONSTRAINT "MonMuaSam_danhsachid_fkey" 
  FOREIGN KEY ("danhsachid") 
  REFERENCES "DanhSachMuaSam"(id) 
  ON DELETE CASCADE; -- Xóa shopping list → xóa items

-- ============================================================
-- 6. SUBSCRIPTION MODULE
-- ============================================================

-- GoiDangKyNguoiDung (User Subscriptions) → auth.users
ALTER TABLE "GoiDangKyNguoiDung"
  DROP CONSTRAINT IF EXISTS "GoiDangKyNguoiDung_nguoidungid_fkey",
  ADD CONSTRAINT "GoiDangKyNguoiDung_nguoidungid_fkey" 
  FOREIGN KEY ("nguoidungid") 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- GoiDangKyNguoiDung → GoiDangKy (Subscription Plans)
ALTER TABLE "GoiDangKyNguoiDung"
  DROP CONSTRAINT IF EXISTS "GoiDangKyNguoiDung_goidangkyid_fkey",
  ADD CONSTRAINT "GoiDangKyNguoiDung_goidangkyid_fkey" 
  FOREIGN KEY ("goidangkyid") 
  REFERENCES "GoiDangKy"(id) 
  ON DELETE SET NULL; -- Giữ subscription khi plan bị xóa

-- ============================================================
-- 7. CREATE INDEXES FOR PERFORMANCE
-- ============================================================

-- User-related indexes
CREATE INDEX IF NOT EXISTS "idx_hoso_nguoidungid" ON "HoSo"("nguoidungid");
CREATE INDEX IF NOT EXISTS "idx_hososuckhoe_nguoidungid" ON "HoSoSucKhoe"("nguoidungid");
CREATE INDEX IF NOT EXISTS "idx_vaitronguoidung_nguoidungid" ON "VaiTroNguoiDung"("nguoidungid");

-- Recipe-related indexes
CREATE INDEX IF NOT EXISTS "idx_congthuc_nguoitao" ON "CongThuc"("nguoitao");
CREATE INDEX IF NOT EXISTS "idx_nguyenlieucongthuc_congthucid" ON "NguyenLieuCongThuc"("congthucid");
CREATE INDEX IF NOT EXISTS "idx_nguyenlieucongthuc_nguyenlieuid" ON "NguyenLieuCongThuc"("nguyenlieuid");

-- Meal plan indexes
CREATE INDEX IF NOT EXISTS "idx_kehoachbuaan_nguoidungid" ON "KeHoachBuaAn"("nguoidungid");
CREATE INDEX IF NOT EXISTS "idx_monankehoach_kehoachid" ON "MonAnKeHoach"("kehoachid");
CREATE INDEX IF NOT EXISTS "idx_monankehoach_congthucid" ON "MonAnKeHoach"("congthucid");
CREATE INDEX IF NOT EXISTS "idx_monankehoach_danhmucid" ON "MonAnKeHoach"("danhmucid");

-- Nutrition tracking indexes
CREATE INDEX IF NOT EXISTS "idx_nhatkydinhduong_nguoidungid" ON "NhatKyDinhDuong"("nguoidungid");
CREATE INDEX IF NOT EXISTS "idx_nhatkydinhduong_ngayghinhan" ON "NhatKyDinhDuong"("ngayghinhan");
CREATE INDEX IF NOT EXISTS "idx_nhatkycannang_nguoidungid" ON "NhatKyCanNang"("nguoidungid");
CREATE INDEX IF NOT EXISTS "idx_nhatkycannang_ngayghinhan" ON "NhatKyCanNang"("ngayghinhan");
CREATE INDEX IF NOT EXISTS "idx_nhatkynuoc_nguoidungid" ON "NhatKyNuoc"("nguoidungid");
CREATE INDEX IF NOT EXISTS "idx_nhatkynuoc_ngayghinhan" ON "NhatKyNuoc"("ngayghinhan");

-- Shopping list indexes
CREATE INDEX IF NOT EXISTS "idx_danhsachmuasam_nguoidungid" ON "DanhSachMuaSam"("nguoidungid");
CREATE INDEX IF NOT EXISTS "idx_monmuasam_danhsachid" ON "MonMuaSam"("danhsachid");

-- Subscription indexes
CREATE INDEX IF NOT EXISTS "idx_goidangkynguoidung_nguoidungid" ON "GoiDangKyNguoiDung"("nguoidungid");
CREATE INDEX IF NOT EXISTS "idx_goidangkynguoidung_goidangkyid" ON "GoiDangKyNguoiDung"("goidangkyid");

-- ============================================================
-- 8. VERIFY CONSTRAINTS (COMMENTED - FOR REFERENCE)
-- ============================================================

-- Kiểm tra tất cả foreign keys:
-- SELECT
--   tc.table_name, 
--   kcu.column_name, 
--   ccu.table_name AS foreign_table_name,
--   ccu.column_name AS foreign_column_name,
--   rc.delete_rule
-- FROM information_schema.table_constraints AS tc 
-- JOIN information_schema.key_column_usage AS kcu
--   ON tc.constraint_name = kcu.constraint_name
-- JOIN information_schema.constraint_column_usage AS ccu
--   ON ccu.constraint_name = tc.constraint_name
-- JOIN information_schema.referential_constraints AS rc
--   ON tc.constraint_name = rc.constraint_name
-- WHERE tc.constraint_type = 'FOREIGN KEY'
--   AND tc.table_schema = 'public'
-- ORDER BY tc.table_name;