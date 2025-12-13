-- Fix security issues từ linter
-- Fix function search path
CREATE OR REPLACE FUNCTION public.auto_assign_first_admin()
RETURNS TRIGGER AS $$
DECLARE
    user_count INTEGER;
BEGIN
    -- Đếm số user hiện tại
    SELECT COUNT(*) INTO user_count FROM auth.users;
    
    -- Nếu đây là user đầu tiên, gán role admin
    IF user_count = 1 THEN
        INSERT INTO public.user_roles (user_id, role) 
        VALUES (NEW.id, 'admin');
        
        RAISE NOTICE 'First user auto-assigned admin role: %', NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;