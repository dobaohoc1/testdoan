-- Drop existing problematic policies on user_roles
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;

-- Create new policies using has_role function (already exists)
CREATE POLICY "Users can view their own role"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Ensure first user gets admin role if user_roles table is empty
DO $$
DECLARE
  first_user_id uuid;
  role_count integer;
BEGIN
  SELECT COUNT(*) INTO role_count FROM public.user_roles;
  
  IF role_count = 0 THEN
    SELECT id INTO first_user_id FROM auth.users ORDER BY created_at LIMIT 1;
    
    IF first_user_id IS NOT NULL THEN
      INSERT INTO public.user_roles (user_id, role)
      VALUES (first_user_id, 'admin');
    END IF;
  END IF;
END $$;