-- Add RLS policy to allow users to insert their own subscription
CREATE POLICY "Users can insert their own subscription"
ON public."GoiDangKyNguoiDung"
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = nguoidungid);