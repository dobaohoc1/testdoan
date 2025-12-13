-- Check and fix GoiDangKyNguoiDung table constraints
-- Drop all foreign key constraints that reference non-existent tables
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT constraint_name 
        FROM information_schema.table_constraints 
        WHERE table_name = 'GoiDangKyNguoiDung' 
        AND constraint_type = 'FOREIGN KEY'
    )
    LOOP
        EXECUTE 'ALTER TABLE "GoiDangKyNguoiDung" DROP CONSTRAINT IF EXISTS ' || quote_ident(r.constraint_name);
    END LOOP;
END $$;

-- Verify HoSo has unique constraint on nguoidungid
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'HoSo_nguoidungid_key'
    ) THEN
        ALTER TABLE "HoSo" ADD CONSTRAINT "HoSo_nguoidungid_key" UNIQUE (nguoidungid);
    END IF;
END $$;

-- Verify HoSoSucKhoe has unique constraint on nguoidungid  
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'HoSoSucKhoe_nguoidungid_key'
    ) THEN
        ALTER TABLE "HoSoSucKhoe" ADD CONSTRAINT "HoSoSucKhoe_nguoidungid_key" UNIQUE (nguoidungid);
    END IF;
END $$;