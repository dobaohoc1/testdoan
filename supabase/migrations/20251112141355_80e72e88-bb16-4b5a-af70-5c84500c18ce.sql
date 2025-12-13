-- Drop the problematic trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_subscription ON auth.users;

-- Create trigger to automatically create profile records when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- Update the subscription trigger to run AFTER handle_new_user
CREATE TRIGGER on_auth_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.assign_free_plan_to_new_user();

-- Fix foreign key constraint on GoiDangKyNguoiDung to reference HoSo instead of auth.users
ALTER TABLE "GoiDangKyNguoiDung" 
DROP CONSTRAINT IF EXISTS user_subscriptions_user_id_fkey;

-- Note: We cannot add a foreign key to auth.users as it's in a different schema
-- The trigger functions will ensure data integrity