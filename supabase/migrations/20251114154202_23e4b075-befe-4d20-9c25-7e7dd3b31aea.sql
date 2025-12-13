-- Add RLS policies for DanhMucBuaAn table to allow admins to manage categories

-- Policy for admins to insert new meal categories
CREATE POLICY "Admins can insert meal categories"
ON public."DanhMucBuaAn"
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Policy for admins to update meal categories
CREATE POLICY "Admins can update meal categories"
ON public."DanhMucBuaAn"
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Policy for admins to delete meal categories
CREATE POLICY "Admins can delete meal categories"
ON public."DanhMucBuaAn"
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));