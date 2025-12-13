-- Drop existing policies if any
DROP POLICY IF EXISTS "Everyone can view ingredients" ON public."NguyenLieu";

-- Recreate view policy
CREATE POLICY "Everyone can view ingredients"
ON public."NguyenLieu"
FOR SELECT
TO authenticated
USING (true);

-- Allow admins to insert ingredients
CREATE POLICY "Admins can insert ingredients"
ON public."NguyenLieu"
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow admins to update ingredients
CREATE POLICY "Admins can update ingredients"
ON public."NguyenLieu"
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete ingredients
CREATE POLICY "Admins can delete ingredients"
ON public."NguyenLieu"
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));