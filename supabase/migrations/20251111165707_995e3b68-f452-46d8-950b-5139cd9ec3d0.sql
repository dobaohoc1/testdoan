-- Create function to assign free plan to new users
CREATE OR REPLACE FUNCTION public.assign_free_plan_to_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  free_plan_id UUID;
BEGIN
  -- Get the free plan ID
  SELECT id INTO free_plan_id
  FROM public."GoiDangKy"
  WHERE ten = 'Miễn phí'
  LIMIT 1;

  -- Insert user subscription with free plan
  IF free_plan_id IS NOT NULL THEN
    INSERT INTO public."GoiDangKyNguoiDung" (nguoidungid, goidangkyid, batdauky, trangthai)
    VALUES (
      NEW.id,
      free_plan_id,
      NOW(),
      'active'
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger to auto-assign free plan when user profile is created
DROP TRIGGER IF EXISTS assign_free_plan_on_profile_create ON public."HoSo";
CREATE TRIGGER assign_free_plan_on_profile_create
  AFTER INSERT ON public."HoSo"
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_free_plan_to_new_user();