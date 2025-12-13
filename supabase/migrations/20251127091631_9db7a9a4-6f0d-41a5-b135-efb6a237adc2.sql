-- Create table for food scan history
CREATE TABLE IF NOT EXISTS public.LichSuQuetThucPham (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nguoidungid UUID NOT NULL,
  urlhinhanh TEXT,
  tenmon TEXT,
  loaithucpham TEXT,
  dotincay NUMERIC,
  mota TEXT,
  calo NUMERIC,
  protein NUMERIC,
  carb NUMERIC,
  chat NUMERIC,
  chatxo NUMERIC,
  diemdinhdung NUMERIC,
  mucdo_lanhmanh TEXT,
  phuhop TEXT[],
  canhbao TEXT[],
  goiy TEXT[],
  nguyenlieu JSONB,
  thongtinbosung JSONB,
  taoluc TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT fk_nguoidung FOREIGN KEY (nguoidungid) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.LichSuQuetThucPham ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own food scan history"
ON public.LichSuQuetThucPham
FOR SELECT
USING (auth.uid() = nguoidungid);

CREATE POLICY "Users can create their own food scan history"
ON public.LichSuQuetThucPham
FOR INSERT
WITH CHECK (auth.uid() = nguoidungid);

CREATE POLICY "Users can delete their own food scan history"
ON public.LichSuQuetThucPham
FOR DELETE
USING (auth.uid() = nguoidungid);

-- Create index for performance
CREATE INDEX idx_lichsuquetthucpham_nguoidungid ON public.LichSuQuetThucPham(nguoidungid);
CREATE INDEX idx_lichsuquetthucpham_taoluc ON public.LichSuQuetThucPham(taoluc DESC);

-- Add trigger for updated_at
CREATE TRIGGER update_lichsuquetthucpham_capnhatluc
BEFORE UPDATE ON public.LichSuQuetThucPham
FOR EACH ROW
EXECUTE FUNCTION public.update_capnhatluc_column();