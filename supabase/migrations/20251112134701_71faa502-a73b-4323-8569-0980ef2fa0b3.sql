-- Add unique constraint to nguoidungid column in HoSo table
ALTER TABLE public."HoSo"
ADD CONSTRAINT "HoSo_nguoidungid_key" UNIQUE (nguoidungid);

-- Add unique constraint to nguoidungid column in HoSoSucKhoe table
ALTER TABLE public."HoSoSucKhoe"
ADD CONSTRAINT "HoSoSucKhoe_nguoidungid_key" UNIQUE (nguoidungid);