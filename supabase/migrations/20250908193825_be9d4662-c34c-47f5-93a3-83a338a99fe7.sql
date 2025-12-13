-- Tạo tài khoản admin mặc định và function setup
-- Thêm role admin cho user đã tồn tại nếu chưa có
DO $$
DECLARE
    existing_user_id uuid;
BEGIN
    -- Tìm user đầu tiên trong hệ thống để làm admin
    SELECT id INTO existing_user_id 
    FROM auth.users 
    ORDER BY created_at ASC 
    LIMIT 1;
    
    -- Nếu có user, gán role admin
    IF existing_user_id IS NOT NULL THEN
        -- Xóa role cũ nếu có
        DELETE FROM public.user_roles WHERE user_id = existing_user_id;
        
        -- Thêm role admin
        INSERT INTO public.user_roles (user_id, role) 
        VALUES (existing_user_id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
        
        RAISE NOTICE 'Admin role assigned to user: %', existing_user_id;
    END IF;
END $$;

-- Tạo function để auto-assign admin cho user đầu tiên
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
$$ LANGUAGE plpgsql SECURITY DEFINER;