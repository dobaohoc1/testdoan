-- Enable full-text search on CongThuc (Recipes)
ALTER TABLE public."CongThuc" ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create function to update search vector for CongThuc
CREATE OR REPLACE FUNCTION update_congthuc_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('simple', COALESCE(NEW.ten, '')), 'A') ||
    setweight(to_tsvector('simple', COALESCE(NEW.mota, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for CongThuc search vector
DROP TRIGGER IF EXISTS update_congthuc_search ON public."CongThuc";
CREATE TRIGGER update_congthuc_search
  BEFORE INSERT OR UPDATE ON public."CongThuc"
  FOR EACH ROW
  EXECUTE FUNCTION update_congthuc_search_vector();

-- Create GIN index for fast full-text search on CongThuc
CREATE INDEX IF NOT EXISTS idx_congthuc_search ON public."CongThuc" USING GIN(search_vector);

-- Update existing recipes with search vectors
UPDATE public."CongThuc" SET search_vector = 
  setweight(to_tsvector('simple', COALESCE(ten, '')), 'A') ||
  setweight(to_tsvector('simple', COALESCE(mota, '')), 'B');

-- Enable full-text search on NguyenLieu (Ingredients)
ALTER TABLE public."NguyenLieu" ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create function to update search vector for NguyenLieu
CREATE OR REPLACE FUNCTION update_nguyenlieu_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('simple', COALESCE(NEW.ten, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for NguyenLieu search vector
DROP TRIGGER IF EXISTS update_nguyenlieu_search ON public."NguyenLieu";
CREATE TRIGGER update_nguyenlieu_search
  BEFORE INSERT OR UPDATE ON public."NguyenLieu"
  FOR EACH ROW
  EXECUTE FUNCTION update_nguyenlieu_search_vector();

-- Create GIN index for fast full-text search on NguyenLieu
CREATE INDEX IF NOT EXISTS idx_nguyenlieu_search ON public."NguyenLieu" USING GIN(search_vector);

-- Update existing ingredients with search vectors
UPDATE public."NguyenLieu" SET search_vector = to_tsvector('simple', COALESCE(ten, ''));

-- Enable Realtime for dashboard stats tables
ALTER PUBLICATION supabase_realtime ADD TABLE public."NhatKyDinhDuong";
ALTER PUBLICATION supabase_realtime ADD TABLE public."CongThuc";
ALTER PUBLICATION supabase_realtime ADD TABLE public."KeHoachBuaAn";
ALTER PUBLICATION supabase_realtime ADD TABLE public."NhatKyNuoc";
ALTER PUBLICATION supabase_realtime ADD TABLE public."NhatKyCanNang";