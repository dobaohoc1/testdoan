-- Cập nhật database function để dùng tên bảng tiếng Việt

-- Drop old function và tạo lại với tên bảng mới
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

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Update has_role function
DROP FUNCTION IF EXISTS public.has_role(_user_id uuid, _role app_role) CASCADE;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public."VaiTroNguoiDung"
    WHERE nguoiDungId = _user_id AND vaiTro = _role
  )
$function$;