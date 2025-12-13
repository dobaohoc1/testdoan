-- Add foreign key constraint to VaiTroNguoiDung table
ALTER TABLE public."VaiTroNguoiDung"
ADD CONSTRAINT fk_vaitronguoidung_nguoidungid 
FOREIGN KEY (nguoidungid) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Add RLS policy for admins to manage user roles
CREATE POLICY "Admins can view all user roles"
ON public."VaiTroNguoiDung"
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update user roles"
ON public."VaiTroNguoiDung"
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert user roles"
ON public."VaiTroNguoiDung"
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete user roles"
ON public."VaiTroNguoiDung"
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));