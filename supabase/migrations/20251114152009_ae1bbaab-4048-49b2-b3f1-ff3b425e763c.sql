-- Drop tất cả conflicting functions và triggers
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.update_capnhatluc_column() CASCADE;

-- Tạo lại function đúng để auto update capnhatluc
CREATE OR REPLACE FUNCTION public.update_capnhatluc_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.capnhatluc = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tạo triggers cho tất cả các bảng cần auto update capnhatluc
CREATE TRIGGER update_hoso_capnhatluc
  BEFORE UPDATE ON "HoSo"
  FOR EACH ROW
  EXECUTE FUNCTION public.update_capnhatluc_column();

CREATE TRIGGER update_hososuckhoe_capnhatluc
  BEFORE UPDATE ON "HoSoSucKhoe"
  FOR EACH ROW
  EXECUTE FUNCTION public.update_capnhatluc_column();

CREATE TRIGGER update_kehoachbuaan_capnhatluc
  BEFORE UPDATE ON "KeHoachBuaAn"
  FOR EACH ROW
  EXECUTE FUNCTION public.update_capnhatluc_column();

CREATE TRIGGER update_danhsachmuasam_capnhatluc
  BEFORE UPDATE ON "DanhSachMuaSam"
  FOR EACH ROW
  EXECUTE FUNCTION public.update_capnhatluc_column();

CREATE TRIGGER update_goidangkynguoidung_capnhatluc
  BEFORE UPDATE ON "GoiDangKyNguoiDung"
  FOR EACH ROW
  EXECUTE FUNCTION public.update_capnhatluc_column();

CREATE TRIGGER update_congthuc_capnhatluc
  BEFORE UPDATE ON "CongThuc"
  FOR EACH ROW
  EXECUTE FUNCTION public.update_capnhatluc_column();