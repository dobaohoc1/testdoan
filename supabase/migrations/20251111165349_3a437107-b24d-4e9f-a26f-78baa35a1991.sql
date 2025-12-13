-- Drop all possible problematic triggers on HoSo
DROP TRIGGER IF EXISTS update_hoso_updated_at ON public."HoSo";
DROP TRIGGER IF EXISTS update_hoso_capnhatluc ON public."HoSo";
DROP TRIGGER IF EXISTS set_updated_at ON public."HoSo";

-- Now we don't need a trigger since we're manually setting capnhatluc in the code
-- The uploadAvatar function already sets capnhatluc when updating