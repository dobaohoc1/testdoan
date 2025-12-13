-- Drop existing triggers if they exist on Vietnamese tables
DROP TRIGGER IF EXISTS update_hoso_updated_at ON "HoSo";
DROP TRIGGER IF EXISTS update_hososuckhoe_updated_at ON "HoSoSucKhoe";

-- Create a new function for Vietnamese column names
CREATE OR REPLACE FUNCTION public.update_capnhatluc_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.capnhatluc = now();
  RETURN NEW;
END;
$$;

-- Create triggers for HoSo table
CREATE TRIGGER update_hoso_capnhatluc
  BEFORE UPDATE ON "HoSo"
  FOR EACH ROW
  EXECUTE FUNCTION public.update_capnhatluc_column();

-- Create triggers for HoSoSucKhoe table
CREATE TRIGGER update_hososuckhoe_capnhatluc
  BEFORE UPDATE ON "HoSoSucKhoe"
  FOR EACH ROW
  EXECUTE FUNCTION public.update_capnhatluc_column();