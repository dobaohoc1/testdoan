-- Drop ALL existing triggers on HoSo table to fix the issue
DROP TRIGGER IF EXISTS update_hoso_updated_at ON "HoSo";
DROP TRIGGER IF EXISTS update_updated_at_hoso ON "HoSo";
DROP TRIGGER IF EXISTS update_hoso_modtime ON "HoSo";
DROP TRIGGER IF EXISTS update_hoso_capnhatluc ON "HoSo";
DROP TRIGGER IF EXISTS set_updated_at ON "HoSo";

-- Now create the CORRECT trigger that uses capnhatluc
CREATE TRIGGER update_hoso_capnhatluc
  BEFORE UPDATE ON "HoSo"
  FOR EACH ROW
  EXECUTE FUNCTION public.update_capnhatluc_column();