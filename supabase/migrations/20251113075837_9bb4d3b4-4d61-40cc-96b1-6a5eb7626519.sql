-- Drop all update triggers for HoSo and HoSoSucKhoe
DROP TRIGGER IF EXISTS update_hoso_updated_at ON public."HoSo";
DROP TRIGGER IF EXISTS update_hososuckhoe_updated_at ON public."HoSoSucKhoe";
DROP TRIGGER IF EXISTS update_hoso_capnhatluc ON public."HoSo";
DROP TRIGGER IF EXISTS update_hososuckhoe_capnhatluc ON public."HoSoSucKhoe";

-- Create new triggers with correct Vietnamese column names
CREATE TRIGGER update_hoso_capnhatluc
  BEFORE UPDATE ON public."HoSo"
  FOR EACH ROW
  EXECUTE FUNCTION public.update_capnhatluc_column();

CREATE TRIGGER update_hososuckhoe_capnhatluc
  BEFORE UPDATE ON public."HoSoSucKhoe"
  FOR EACH ROW
  EXECUTE FUNCTION public.update_capnhatluc_column();