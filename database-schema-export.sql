-- =============================================
-- NUTRITION AI DATABASE SCHEMA EXPORT
-- Generated: 2025-11-16
-- =============================================

-- =============================================
-- 1. ENUMS
-- =============================================

CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- =============================================
-- 2. TABLES
-- =============================================

-- Table: HoSo (Profiles)
CREATE TABLE public."HoSo" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nguoidungid uuid NOT NULL,
    hoten text,
    email text,
    anhdaidien text,
    sodienthoai text,
    gioitinh text,
    ngaysinh date,
    taoluc timestamp with time zone NOT NULL DEFAULT now(),
    capnhatluc timestamp with time zone NOT NULL DEFAULT now()
);

-- Table: HoSoSucKhoe (Health Profiles)
CREATE TABLE public."HoSoSucKhoe" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nguoidungid uuid NOT NULL,
    chieucao numeric,
    cannang numeric,
    muctieucalohangngay integer,
    diung text[] DEFAULT '{}'::text[],
    hanchechedo text[] DEFAULT '{}'::text[],
    muctieusuckhoe text[] DEFAULT '{}'::text[],
    mucdohoatdong text,
    tinhtrangsuckhoe text[] DEFAULT '{}'::text[],
    taoluc timestamp with time zone NOT NULL DEFAULT now(),
    capnhatluc timestamp with time zone NOT NULL DEFAULT now()
);

-- Table: VaiTroNguoiDung (User Roles)
CREATE TABLE public."VaiTroNguoiDung" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nguoidungid uuid NOT NULL,
    vaitro public.app_role NOT NULL DEFAULT 'user'::app_role,
    taoluc timestamp with time zone NOT NULL DEFAULT now()
);

-- Table: NguyenLieu (Ingredients)
CREATE TABLE public."NguyenLieu" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ten text NOT NULL,
    calo100g numeric,
    dam100g numeric,
    carb100g numeric,
    chat100g numeric,
    xo100g numeric,
    duong100g numeric,
    natri100g numeric,
    taoluc timestamp with time zone NOT NULL DEFAULT now()
);

-- Table: CongThuc (Recipes)
CREATE TABLE public."CongThuc" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ten text NOT NULL,
    mota text,
    dokho text,
    anhdaidien text,
    huongdan jsonb,
    khauphan integer DEFAULT 1,
    thoigianchuanbi integer,
    thoigiannau integer,
    tongcalo numeric,
    tongdam numeric,
    tongcarb numeric,
    tongchat numeric,
    congkhai boolean DEFAULT false,
    nguoitao uuid,
    taoluc timestamp with time zone NOT NULL DEFAULT now(),
    capnhatluc timestamp with time zone NOT NULL DEFAULT now()
);

-- Table: NguyenLieuCongThuc (Recipe Ingredients)
CREATE TABLE public."NguyenLieuCongThuc" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    congthucid uuid,
    nguyenlieuid uuid,
    soluong numeric NOT NULL,
    donvi text NOT NULL
);

-- Table: DanhMucBuaAn (Meal Categories)
CREATE TABLE public."DanhMucBuaAn" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ten text NOT NULL,
    mota text,
    thutuhienthi integer DEFAULT 0,
    taoluc timestamp with time zone NOT NULL DEFAULT now()
);

-- Table: KeHoachBuaAn (Meal Plans)
CREATE TABLE public."KeHoachBuaAn" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nguoidungid uuid NOT NULL,
    ten text NOT NULL,
    mota text,
    muctieucalo integer,
    ngaybatdau date,
    ngayketthuc date,
    danghoatdong boolean DEFAULT true,
    taoluc timestamp with time zone NOT NULL DEFAULT now(),
    capnhatluc timestamp with time zone NOT NULL DEFAULT now()
);

-- Table: MonAnKeHoach (Meal Plan Items)
CREATE TABLE public."MonAnKeHoach" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    kehoachid uuid,
    congthucid uuid,
    danhmucid uuid,
    ngaydukien date NOT NULL,
    giodukien time without time zone,
    khauphan numeric DEFAULT 1,
    taoluc timestamp with time zone NOT NULL DEFAULT now()
);

-- Table: NhatKyDinhDuong (Nutrition Logs)
CREATE TABLE public."NhatKyDinhDuong" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nguoidungid uuid NOT NULL,
    ngayghinhan date NOT NULL,
    tenthucpham text,
    congthucid uuid,
    danhmucid uuid,
    soluong numeric,
    donvi text,
    calo numeric,
    dam numeric,
    carb numeric,
    chat numeric,
    ghichu text,
    taoluc timestamp with time zone NOT NULL DEFAULT now()
);

-- Table: NhatKyCanNang (Weight Logs)
CREATE TABLE public."NhatKyCanNang" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nguoidungid uuid NOT NULL,
    cannang numeric NOT NULL,
    ngayghinhan date NOT NULL DEFAULT CURRENT_DATE,
    ghichu text,
    taoluc timestamp with time zone NOT NULL DEFAULT now()
);

-- Table: NhatKyNuoc (Water Logs)
CREATE TABLE public."NhatKyNuoc" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nguoidungid uuid NOT NULL,
    soluongml integer NOT NULL,
    ngayghinhan date NOT NULL DEFAULT CURRENT_DATE,
    gioghinhan time without time zone NOT NULL DEFAULT CURRENT_TIME,
    taoluc timestamp with time zone NOT NULL DEFAULT now()
);

-- Table: DanhSachMuaSam (Shopping Lists)
CREATE TABLE public."DanhSachMuaSam" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nguoidungid uuid NOT NULL,
    ten text NOT NULL,
    taoluc timestamp with time zone NOT NULL DEFAULT now(),
    capnhatluc timestamp with time zone NOT NULL DEFAULT now()
);

-- Table: MonMuaSam (Shopping Items)
CREATE TABLE public."MonMuaSam" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    danhsachid uuid NOT NULL,
    tennguyenlieu text NOT NULL,
    soluong numeric NOT NULL,
    donvi text NOT NULL,
    damua boolean DEFAULT false,
    taoluc timestamp with time zone NOT NULL DEFAULT now()
);

-- Table: GoiDangKy (Subscription Plans)
CREATE TABLE public."GoiDangKy" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ten text NOT NULL,
    mota text,
    giathang numeric,
    gianam numeric,
    sokehoachtoida integer,
    socongthuctoida integer,
    tinhnang jsonb DEFAULT '[]'::jsonb,
    danghoatdong boolean DEFAULT true,
    taoluc timestamp with time zone NOT NULL DEFAULT now()
);

-- Table: GoiDangKyNguoiDung (User Subscriptions)
CREATE TABLE public."GoiDangKyNguoiDung" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nguoidungid uuid NOT NULL,
    goidangkyid uuid,
    batdauky timestamp with time zone,
    ketthucky timestamp with time zone,
    trangthai text,
    stripekhachhangid text,
    stripedangkyid text,
    taoluc timestamp with time zone NOT NULL DEFAULT now(),
    capnhatluc timestamp with time zone NOT NULL DEFAULT now()
);

-- =============================================
-- 3. FUNCTIONS
-- =============================================

-- Function: update_capnhatluc_column
CREATE OR REPLACE FUNCTION public.update_capnhatluc_column()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.capnhatluc = now();
  RETURN NEW;
END;
$function$;

-- Function: handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public."HoSo" (nguoidungid, hoten, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NEW.email);
  
  INSERT INTO public."HoSoSucKhoe" (nguoidungid)
  VALUES (NEW.id);
  
  INSERT INTO public."VaiTroNguoiDung" (nguoidungid, vaitro)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$function$;

-- Function: has_role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public."VaiTroNguoiDung"
    WHERE nguoidungid = _user_id AND vaitro = _role
  )
$function$;

-- Function: auto_assign_first_admin
CREATE OR REPLACE FUNCTION public.auto_assign_first_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO user_count FROM auth.users;
  
  IF user_count = 1 THEN
    INSERT INTO public."VaiTroNguoiDung" (nguoidungid, vaitro) 
    VALUES (NEW.id, 'admin');
    
    RAISE NOTICE 'First user assigned admin role: %', NEW.id;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Function: assign_free_plan_to_new_user
CREATE OR REPLACE FUNCTION public.assign_free_plan_to_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  free_plan_id UUID;
BEGIN
  SELECT id INTO free_plan_id
  FROM public."GoiDangKy"
  WHERE ten = 'Miễn phí'
  LIMIT 1;

  IF free_plan_id IS NOT NULL THEN
    INSERT INTO public."GoiDangKyNguoiDung" (nguoidungid, goidangkyid, batdauky, trangthai)
    VALUES (
      NEW.id,
      free_plan_id,
      NOW(),
      'active'
    );
  END IF;

  RETURN NEW;
END;
$function$;

-- =============================================
-- 4. TRIGGERS
-- =============================================

-- Triggers for update_capnhatluc_column
CREATE TRIGGER update_hoso_capnhatluc
BEFORE UPDATE ON public."HoSo"
FOR EACH ROW EXECUTE FUNCTION public.update_capnhatluc_column();

CREATE TRIGGER update_hososuckhoe_capnhatluc
BEFORE UPDATE ON public."HoSoSucKhoe"
FOR EACH ROW EXECUTE FUNCTION public.update_capnhatluc_column();

CREATE TRIGGER update_congthuc_capnhatluc
BEFORE UPDATE ON public."CongThuc"
FOR EACH ROW EXECUTE FUNCTION public.update_capnhatluc_column();

CREATE TRIGGER update_kehoachbuaan_capnhatluc
BEFORE UPDATE ON public."KeHoachBuaAn"
FOR EACH ROW EXECUTE FUNCTION public.update_capnhatluc_column();

CREATE TRIGGER update_danhsachmuasam_capnhatluc
BEFORE UPDATE ON public."DanhSachMuaSam"
FOR EACH ROW EXECUTE FUNCTION public.update_capnhatluc_column();

CREATE TRIGGER update_goidangkynguoidung_capnhatluc
BEFORE UPDATE ON public."GoiDangKyNguoiDung"
FOR EACH ROW EXECUTE FUNCTION public.update_capnhatluc_column();

-- Trigger for new user handling
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 5. ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public."HoSo" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."HoSoSucKhoe" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."VaiTroNguoiDung" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."NguyenLieu" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."CongThuc" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."NguyenLieuCongThuc" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."DanhMucBuaAn" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."KeHoachBuaAn" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."MonAnKeHoach" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."NhatKyDinhDuong" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."NhatKyCanNang" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."NhatKyNuoc" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."DanhSachMuaSam" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."MonMuaSam" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."GoiDangKy" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."GoiDangKyNguoiDung" ENABLE ROW LEVEL SECURITY;

-- HoSo Policies
CREATE POLICY "Users can view their own profile"
ON public."HoSo" FOR SELECT
USING (auth.uid() = nguoidungid);

CREATE POLICY "Users can insert their own profile"
ON public."HoSo" FOR INSERT
WITH CHECK (auth.uid() = nguoidungid);

CREATE POLICY "Users can update their own profile"
ON public."HoSo" FOR UPDATE
USING (auth.uid() = nguoidungid);

-- HoSoSucKhoe Policies
CREATE POLICY "Users can view their own health profile"
ON public."HoSoSucKhoe" FOR SELECT
USING (auth.uid() = nguoidungid);

CREATE POLICY "Users can insert their own health profile"
ON public."HoSoSucKhoe" FOR INSERT
WITH CHECK (auth.uid() = nguoidungid);

CREATE POLICY "Users can update their own health profile"
ON public."HoSoSucKhoe" FOR UPDATE
USING (auth.uid() = nguoidungid);

-- VaiTroNguoiDung Policies
CREATE POLICY "Users can view their own role"
ON public."VaiTroNguoiDung" FOR SELECT
USING (auth.uid() = nguoidungid);

-- NguyenLieu Policies
CREATE POLICY "Everyone can view ingredients"
ON public."NguyenLieu" FOR SELECT
USING (true);

CREATE POLICY "Admins can insert ingredients"
ON public."NguyenLieu" FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update ingredients"
ON public."NguyenLieu" FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete ingredients"
ON public."NguyenLieu" FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- CongThuc Policies
CREATE POLICY "Users can view public recipes and their own"
ON public."CongThuc" FOR SELECT
USING (congkhai = true OR auth.uid() = nguoitao);

CREATE POLICY "Users can create their own recipes"
ON public."CongThuc" FOR INSERT
WITH CHECK (auth.uid() = nguoitao);

CREATE POLICY "Users can update their own recipes"
ON public."CongThuc" FOR UPDATE
USING (auth.uid() = nguoitao);

CREATE POLICY "Users can delete their own recipes"
ON public."CongThuc" FOR DELETE
USING (auth.uid() = nguoitao);

-- NguyenLieuCongThuc Policies
CREATE POLICY "Users can view ingredients for allowed recipes"
ON public."NguyenLieuCongThuc" FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM "CongThuc"
    WHERE "CongThuc".id = "NguyenLieuCongThuc".congthucid
    AND ("CongThuc".congkhai = true OR "CongThuc".nguoitao = auth.uid())
  )
);

CREATE POLICY "Users can add ingredients to their own recipes"
ON public."NguyenLieuCongThuc" FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "CongThuc"
    WHERE "CongThuc".id = "NguyenLieuCongThuc".congthucid
    AND "CongThuc".nguoitao = auth.uid()
  )
);

CREATE POLICY "Users can update ingredients in their own recipes"
ON public."NguyenLieuCongThuc" FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM "CongThuc"
    WHERE "CongThuc".id = "NguyenLieuCongThuc".congthucid
    AND "CongThuc".nguoitao = auth.uid()
  )
);

CREATE POLICY "Users can delete ingredients from their own recipes"
ON public."NguyenLieuCongThuc" FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM "CongThuc"
    WHERE "CongThuc".id = "NguyenLieuCongThuc".congthucid
    AND "CongThuc".nguoitao = auth.uid()
  )
);

-- DanhMucBuaAn Policies
CREATE POLICY "Everyone can view meal categories"
ON public."DanhMucBuaAn" FOR SELECT
USING (true);

CREATE POLICY "Admins can insert meal categories"
ON public."DanhMucBuaAn" FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update meal categories"
ON public."DanhMucBuaAn" FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete meal categories"
ON public."DanhMucBuaAn" FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- KeHoachBuaAn Policies
CREATE POLICY "Users can view their own meal plans"
ON public."KeHoachBuaAn" FOR SELECT
USING (auth.uid() = nguoidungid);

CREATE POLICY "Users can create their own meal plans"
ON public."KeHoachBuaAn" FOR INSERT
WITH CHECK (auth.uid() = nguoidungid);

CREATE POLICY "Users can update their own meal plans"
ON public."KeHoachBuaAn" FOR UPDATE
USING (auth.uid() = nguoidungid);

CREATE POLICY "Users can delete their own meal plans"
ON public."KeHoachBuaAn" FOR DELETE
USING (auth.uid() = nguoidungid);

-- MonAnKeHoach Policies
CREATE POLICY "Users can view their own meal plan items"
ON public."MonAnKeHoach" FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM "KeHoachBuaAn"
    WHERE "KeHoachBuaAn".id = "MonAnKeHoach".kehoachid
    AND "KeHoachBuaAn".nguoidungid = auth.uid()
  )
);

CREATE POLICY "Users can create their own meal plan items"
ON public."MonAnKeHoach" FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "KeHoachBuaAn"
    WHERE "KeHoachBuaAn".id = "MonAnKeHoach".kehoachid
    AND "KeHoachBuaAn".nguoidungid = auth.uid()
  )
);

CREATE POLICY "Users can update their own meal plan items"
ON public."MonAnKeHoach" FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM "KeHoachBuaAn"
    WHERE "KeHoachBuaAn".id = "MonAnKeHoach".kehoachid
    AND "KeHoachBuaAn".nguoidungid = auth.uid()
  )
);

CREATE POLICY "Users can delete their own meal plan items"
ON public."MonAnKeHoach" FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM "KeHoachBuaAn"
    WHERE "KeHoachBuaAn".id = "MonAnKeHoach".kehoachid
    AND "KeHoachBuaAn".nguoidungid = auth.uid()
  )
);

-- NhatKyDinhDuong Policies
CREATE POLICY "Users can view their own nutrition logs"
ON public."NhatKyDinhDuong" FOR SELECT
USING (auth.uid() = nguoidungid);

CREATE POLICY "Users can create their own nutrition logs"
ON public."NhatKyDinhDuong" FOR INSERT
WITH CHECK (auth.uid() = nguoidungid);

CREATE POLICY "Users can update their own nutrition logs"
ON public."NhatKyDinhDuong" FOR UPDATE
USING (auth.uid() = nguoidungid);

CREATE POLICY "Users can delete their own nutrition logs"
ON public."NhatKyDinhDuong" FOR DELETE
USING (auth.uid() = nguoidungid);

-- NhatKyCanNang Policies
CREATE POLICY "Users can view their own weight logs"
ON public."NhatKyCanNang" FOR SELECT
USING (auth.uid() = nguoidungid);

CREATE POLICY "Users can create their own weight logs"
ON public."NhatKyCanNang" FOR INSERT
WITH CHECK (auth.uid() = nguoidungid);

CREATE POLICY "Users can update their own weight logs"
ON public."NhatKyCanNang" FOR UPDATE
USING (auth.uid() = nguoidungid);

CREATE POLICY "Users can delete their own weight logs"
ON public."NhatKyCanNang" FOR DELETE
USING (auth.uid() = nguoidungid);

-- NhatKyNuoc Policies
CREATE POLICY "Users can view their own water logs"
ON public."NhatKyNuoc" FOR SELECT
USING (auth.uid() = nguoidungid);

CREATE POLICY "Users can create their own water logs"
ON public."NhatKyNuoc" FOR INSERT
WITH CHECK (auth.uid() = nguoidungid);

CREATE POLICY "Users can delete their own water logs"
ON public."NhatKyNuoc" FOR DELETE
USING (auth.uid() = nguoidungid);

-- DanhSachMuaSam Policies
CREATE POLICY "Users can manage their own shopping lists"
ON public."DanhSachMuaSam" FOR ALL
USING (auth.uid() = nguoidungid)
WITH CHECK (auth.uid() = nguoidungid);

-- MonMuaSam Policies
CREATE POLICY "Users can manage their own shopping items"
ON public."MonMuaSam" FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM "DanhSachMuaSam"
    WHERE "DanhSachMuaSam".id = "MonMuaSam".danhsachid
    AND "DanhSachMuaSam".nguoidungid = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "DanhSachMuaSam"
    WHERE "DanhSachMuaSam".id = "MonMuaSam".danhsachid
    AND "DanhSachMuaSam".nguoidungid = auth.uid()
  )
);

-- GoiDangKy Policies
CREATE POLICY "Everyone can view active subscription plans"
ON public."GoiDangKy" FOR SELECT
USING (danghoatdong = true);

-- GoiDangKyNguoiDung Policies
CREATE POLICY "Users can view their own subscription"
ON public."GoiDangKyNguoiDung" FOR SELECT
USING (auth.uid() = nguoidungid);

CREATE POLICY "Users can insert their own subscription"
ON public."GoiDangKyNguoiDung" FOR INSERT
WITH CHECK (auth.uid() = nguoidungid);

CREATE POLICY "Users can update their own subscription"
ON public."GoiDangKyNguoiDung" FOR UPDATE
USING (auth.uid() = nguoidungid);

-- =============================================
-- END OF SCHEMA EXPORT
-- =============================================
