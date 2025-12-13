-- =============================================
-- NUTRITION AI - FULL DATABASE SCHEMA
-- Để vẽ ERD (Entity Relationship Diagram)
-- Generated: 2025-11-18
-- =============================================

-- =============================================
-- 1. ENUMS
-- =============================================

CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- =============================================
-- 2. TABLES
-- =============================================

-- ============================================
-- MODULE: USER MANAGEMENT (Quản lý người dùng)
-- ============================================

-- Table: HoSo (Profiles)
-- Lưu thông tin cá nhân người dùng
CREATE TABLE public."HoSo" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nguoidungid uuid NOT NULL UNIQUE, -- FK to auth.users.id
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
-- Lưu thông tin sức khỏe chi tiết
CREATE TABLE public."HoSoSucKhoe" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nguoidungid uuid NOT NULL UNIQUE, -- FK to auth.users.id
    chieucao numeric,                 -- Chiều cao (cm)
    cannang numeric,                  -- Cân nặng (kg)
    muctieucalohangngay integer,      -- Mục tiêu calo/ngày
    mucdohoatdong text,               -- Mức độ hoạt động
    tinhtrangsuckhoe text[] DEFAULT '{}'::text[], -- Tình trạng sức khỏe
    muctieusuckhoe text[] DEFAULT '{}'::text[],   -- Mục tiêu sức khỏe
    hanchechedo text[] DEFAULT '{}'::text[],      -- Hạn chế chế độ ăn
    diung text[] DEFAULT '{}'::text[],            -- Dị ứng
    taoluc timestamp with time zone NOT NULL DEFAULT now(),
    capnhatluc timestamp with time zone NOT NULL DEFAULT now()
);

-- Table: VaiTroNguoiDung (User Roles)
-- Quản lý vai trò người dùng (admin/user)
CREATE TABLE public."VaiTroNguoiDung" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nguoidungid uuid NOT NULL UNIQUE, -- FK to auth.users.id
    vaitro public.app_role NOT NULL DEFAULT 'user'::app_role,
    taoluc timestamp with time zone NOT NULL DEFAULT now()
);

-- ============================================
-- MODULE: RECIPE (Công thức nấu ăn)
-- ============================================

-- Table: NguyenLieu (Ingredients)
-- Danh sách nguyên liệu với thông tin dinh dưỡng
CREATE TABLE public."NguyenLieu" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ten text NOT NULL,
    calo100g numeric,   -- Calories/100g
    dam100g numeric,    -- Protein/100g
    carb100g numeric,   -- Carbs/100g
    chat100g numeric,   -- Fat/100g
    xo100g numeric,     -- Fiber/100g
    duong100g numeric,  -- Sugar/100g
    natri100g numeric,  -- Sodium/100g
    taoluc timestamp with time zone NOT NULL DEFAULT now()
);

-- Table: CongThuc (Recipes)
-- Công thức nấu ăn
CREATE TABLE public."CongThuc" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ten text NOT NULL,
    mota text,
    dokho text,                      -- Độ khó (Dễ/Trung bình/Khó)
    anhdaidien text,                 -- Recipe image URL
    huongdan jsonb,                  -- Hướng dẫn nấu (JSON array)
    khauphan integer DEFAULT 1,      -- Số khẩu phần
    thoigianchuanbi integer,         -- Thời gian chuẩn bị (phút)
    thoigiannau integer,             -- Thời gian nấu (phút)
    tongcalo numeric,                -- Tổng calories
    tongdam numeric,                 -- Tổng protein
    tongcarb numeric,                -- Tổng carbs
    tongchat numeric,                -- Tổng fat
    congkhai boolean DEFAULT false,  -- Public/Private
    nguoitao uuid,                   -- FK to auth.users.id
    taoluc timestamp with time zone NOT NULL DEFAULT now(),
    capnhatluc timestamp with time zone NOT NULL DEFAULT now()
);

-- Table: NguyenLieuCongThuc (Recipe Ingredients)
-- Junction table: Nguyên liệu trong công thức (N:N relationship)
CREATE TABLE public."NguyenLieuCongThuc" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    congthucid uuid,      -- FK to CongThuc.id
    nguyenlieuid uuid,    -- FK to NguyenLieu.id
    soluong numeric NOT NULL,
    donvi text NOT NULL   -- Đơn vị (gram, ml, thìa, etc.)
);

-- ============================================
-- MODULE: MEAL PLANNING (Kế hoạch bữa ăn)
-- ============================================

-- Table: DanhMucBuaAn (Meal Categories)
-- Danh mục bữa ăn (Sáng, Trưa, Tối, Phụ)
CREATE TABLE public."DanhMucBuaAn" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ten text NOT NULL,           -- Tên danh mục
    mota text,                   -- Mô tả
    thutuhienthi integer DEFAULT 0, -- Thứ tự hiển thị
    taoluc timestamp with time zone NOT NULL DEFAULT now()
);

-- Table: KeHoachBuaAn (Meal Plans)
-- Kế hoạch bữa ăn của người dùng
CREATE TABLE public."KeHoachBuaAn" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nguoidungid uuid NOT NULL,   -- FK to auth.users.id
    ten text NOT NULL,
    mota text,
    muctieucalo integer,         -- Mục tiêu calo
    ngaybatdau date,             -- Ngày bắt đầu
    ngayketthuc date,            -- Ngày kết thúc
    danghoatdong boolean DEFAULT true,
    taoluc timestamp with time zone NOT NULL DEFAULT now(),
    capnhatluc timestamp with time zone NOT NULL DEFAULT now()
);

-- Table: MonAnKeHoach (Meal Plan Items)
-- Các món ăn trong kế hoạch
CREATE TABLE public."MonAnKeHoach" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    kehoachid uuid,       -- FK to KeHoachBuaAn.id
    congthucid uuid,      -- FK to CongThuc.id
    danhmucid uuid,       -- FK to DanhMucBuaAn.id
    ngaydukien date NOT NULL,
    giodukien time without time zone,
    khauphan numeric DEFAULT 1,
    taoluc timestamp with time zone NOT NULL DEFAULT now()
);

-- ============================================
-- MODULE: TRACKING (Theo dõi)
-- ============================================

-- Table: NhatKyDinhDuong (Nutrition Logs)
-- Nhật ký dinh dưỡng hàng ngày
CREATE TABLE public."NhatKyDinhDuong" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nguoidungid uuid NOT NULL,    -- FK to auth.users.id
    ngayghinhan date NOT NULL,
    tenthucpham text,
    donvi text,
    soluong numeric,
    calo numeric,
    dam numeric,
    carb numeric,
    chat numeric,
    congthucid uuid,              -- FK to CongThuc.id (optional)
    danhmucid uuid,               -- FK to DanhMucBuaAn.id (optional)
    ghichu text,
    taoluc timestamp with time zone NOT NULL DEFAULT now()
);

-- Table: NhatKyCanNang (Weight Logs)
-- Nhật ký theo dõi cân nặng
CREATE TABLE public."NhatKyCanNang" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nguoidungid uuid NOT NULL,    -- FK to auth.users.id
    cannang numeric NOT NULL,     -- Cân nặng (kg)
    ngayghinhan date NOT NULL DEFAULT CURRENT_DATE,
    ghichu text,
    taoluc timestamp with time zone NOT NULL DEFAULT now()
);

-- Table: NhatKyNuoc (Water Logs)
-- Nhật ký theo dõi nước uống
CREATE TABLE public."NhatKyNuoc" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nguoidungid uuid NOT NULL,    -- FK to auth.users.id
    soluongml integer NOT NULL,   -- Lượng nước (ml)
    ngayghinhan date NOT NULL DEFAULT CURRENT_DATE,
    gioghinhan time without time zone NOT NULL DEFAULT CURRENT_TIME,
    taoluc timestamp with time zone NOT NULL DEFAULT now()
);

-- ============================================
-- MODULE: SHOPPING (Mua sắm)
-- ============================================

-- Table: DanhSachMuaSam (Shopping Lists)
-- Danh sách mua sắm
CREATE TABLE public."DanhSachMuaSam" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nguoidungid uuid NOT NULL,    -- FK to auth.users.id
    ten text NOT NULL,
    taoluc timestamp with time zone NOT NULL DEFAULT now(),
    capnhatluc timestamp with time zone NOT NULL DEFAULT now()
);

-- Table: MonMuaSam (Shopping Items)
-- Các món trong danh sách mua sắm
CREATE TABLE public."MonMuaSam" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    danhsachid uuid NOT NULL,     -- FK to DanhSachMuaSam.id
    tennguyenlieu text NOT NULL,
    soluong numeric NOT NULL,
    donvi text NOT NULL,
    damua boolean DEFAULT false,  -- Đã mua chưa
    taoluc timestamp with time zone NOT NULL DEFAULT now()
);

-- ============================================
-- MODULE: SUBSCRIPTION (Đăng ký gói)
-- ============================================

-- Table: GoiDangKy (Subscription Plans)
-- Các gói đăng ký
CREATE TABLE public."GoiDangKy" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ten text NOT NULL,
    mota text,
    giathang numeric,             -- Giá theo tháng
    gianam numeric,               -- Giá theo năm
    socongthuctoida integer,      -- Số lượng công thức tối đa
    sokehoachtoida integer,       -- Số lượng kế hoạch tối đa
    tinhnang jsonb DEFAULT '[]'::jsonb, -- Các tính năng (JSON array)
    danghoatdong boolean DEFAULT true,
    taoluc timestamp with time zone NOT NULL DEFAULT now()
);

-- Table: GoiDangKyNguoiDung (User Subscriptions)
-- Đăng ký gói của người dùng
CREATE TABLE public."GoiDangKyNguoiDung" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nguoidungid uuid NOT NULL,    -- FK to auth.users.id
    goidangkyid uuid,             -- FK to GoiDangKy.id
    batdauky timestamp with time zone,
    ketthucky timestamp with time zone,
    trangthai text,               -- active/expired/cancelled
    stripekhachhangid text,       -- Stripe customer ID
    stripedangkyid text,          -- Stripe subscription ID
    taoluc timestamp with time zone NOT NULL DEFAULT now(),
    capnhatluc timestamp with time zone NOT NULL DEFAULT now()
);

-- =============================================
-- 3. FOREIGN KEY CONSTRAINTS
-- =============================================

-- HoSo foreign keys
ALTER TABLE public."HoSo"
    ADD CONSTRAINT fk_hoso_nguoidung 
    FOREIGN KEY (nguoidungid) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE;

-- HoSoSucKhoe foreign keys
ALTER TABLE public."HoSoSucKhoe"
    ADD CONSTRAINT fk_hososuckhoe_nguoidung 
    FOREIGN KEY (nguoidungid) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE;

-- VaiTroNguoiDung foreign keys
ALTER TABLE public."VaiTroNguoiDung"
    ADD CONSTRAINT fk_vaitro_nguoidung 
    FOREIGN KEY (nguoidungid) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE;

-- CongThuc foreign keys
ALTER TABLE public."CongThuc"
    ADD CONSTRAINT fk_congthuc_nguoitao 
    FOREIGN KEY (nguoitao) 
    REFERENCES auth.users(id) 
    ON DELETE SET NULL;

-- NguyenLieuCongThuc foreign keys
ALTER TABLE public."NguyenLieuCongThuc"
    ADD CONSTRAINT fk_nguyenlieucongthuc_congthuc 
    FOREIGN KEY (congthucid) 
    REFERENCES public."CongThuc"(id) 
    ON DELETE CASCADE;

ALTER TABLE public."NguyenLieuCongThuc"
    ADD CONSTRAINT fk_nguyenlieucongthuc_nguyenlieu 
    FOREIGN KEY (nguyenlieuid) 
    REFERENCES public."NguyenLieu"(id) 
    ON DELETE CASCADE;

-- KeHoachBuaAn foreign keys
ALTER TABLE public."KeHoachBuaAn"
    ADD CONSTRAINT fk_kehoach_nguoidung 
    FOREIGN KEY (nguoidungid) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE;

-- MonAnKeHoach foreign keys
ALTER TABLE public."MonAnKeHoach"
    ADD CONSTRAINT fk_monankehoach_kehoach 
    FOREIGN KEY (kehoachid) 
    REFERENCES public."KeHoachBuaAn"(id) 
    ON DELETE CASCADE;

ALTER TABLE public."MonAnKeHoach"
    ADD CONSTRAINT fk_monankehoach_congthuc 
    FOREIGN KEY (congthucid) 
    REFERENCES public."CongThuc"(id) 
    ON DELETE SET NULL;

ALTER TABLE public."MonAnKeHoach"
    ADD CONSTRAINT fk_monankehoach_danhmuc 
    FOREIGN KEY (danhmucid) 
    REFERENCES public."DanhMucBuaAn"(id) 
    ON DELETE SET NULL;

-- NhatKyDinhDuong foreign keys
ALTER TABLE public."NhatKyDinhDuong"
    ADD CONSTRAINT fk_nhatkydinduong_nguoidung 
    FOREIGN KEY (nguoidungid) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE;

ALTER TABLE public."NhatKyDinhDuong"
    ADD CONSTRAINT fk_nhatkydinduong_congthuc 
    FOREIGN KEY (congthucid) 
    REFERENCES public."CongThuc"(id) 
    ON DELETE SET NULL;

ALTER TABLE public."NhatKyDinhDuong"
    ADD CONSTRAINT fk_nhatkydinduong_danhmuc 
    FOREIGN KEY (danhmucid) 
    REFERENCES public."DanhMucBuaAn"(id) 
    ON DELETE SET NULL;

-- NhatKyCanNang foreign keys
ALTER TABLE public."NhatKyCanNang"
    ADD CONSTRAINT fk_nhatkycannang_nguoidung 
    FOREIGN KEY (nguoidungid) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE;

-- NhatKyNuoc foreign keys
ALTER TABLE public."NhatKyNuoc"
    ADD CONSTRAINT fk_nhatkynuoc_nguoidung 
    FOREIGN KEY (nguoidungid) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE;

-- DanhSachMuaSam foreign keys
ALTER TABLE public."DanhSachMuaSam"
    ADD CONSTRAINT fk_danhsachmuasam_nguoidung 
    FOREIGN KEY (nguoidungid) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE;

-- MonMuaSam foreign keys
ALTER TABLE public."MonMuaSam"
    ADD CONSTRAINT fk_monmuasam_danhsach 
    FOREIGN KEY (danhsachid) 
    REFERENCES public."DanhSachMuaSam"(id) 
    ON DELETE CASCADE;

-- GoiDangKyNguoiDung foreign keys
ALTER TABLE public."GoiDangKyNguoiDung"
    ADD CONSTRAINT fk_goidangky_nguoidung 
    FOREIGN KEY (nguoidungid) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE;

ALTER TABLE public."GoiDangKyNguoiDung"
    ADD CONSTRAINT fk_goidangky_goi 
    FOREIGN KEY (goidangkyid) 
    REFERENCES public."GoiDangKy"(id) 
    ON DELETE SET NULL;

-- =============================================
-- 4. INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_hoso_nguoidungid ON public."HoSo"(nguoidungid);
CREATE INDEX idx_hososuckhoe_nguoidungid ON public."HoSoSucKhoe"(nguoidungid);
CREATE INDEX idx_vaitro_nguoidungid ON public."VaiTroNguoiDung"(nguoidungid);
CREATE INDEX idx_congthuc_nguoitao ON public."CongThuc"(nguoitao);
CREATE INDEX idx_congthuc_congkhai ON public."CongThuc"(congkhai);
CREATE INDEX idx_nguyenlieucongthuc_congthuc ON public."NguyenLieuCongThuc"(congthucid);
CREATE INDEX idx_nguyenlieucongthuc_nguyenlieu ON public."NguyenLieuCongThuc"(nguyenlieuid);
CREATE INDEX idx_kehoach_nguoidung ON public."KeHoachBuaAn"(nguoidungid);
CREATE INDEX idx_monankehoach_kehoach ON public."MonAnKeHoach"(kehoachid);
CREATE INDEX idx_monankehoach_congthuc ON public."MonAnKeHoach"(congthucid);
CREATE INDEX idx_monankehoach_ngay ON public."MonAnKeHoach"(ngaydukien);
CREATE INDEX idx_nhatky_nguoidung ON public."NhatKyDinhDuong"(nguoidungid);
CREATE INDEX idx_nhatky_ngay ON public."NhatKyDinhDuong"(ngayghinhan);
CREATE INDEX idx_nhatkycannang_nguoidung ON public."NhatKyCanNang"(nguoidungid);
CREATE INDEX idx_nhatkycannang_ngay ON public."NhatKyCanNang"(ngayghinhan);
CREATE INDEX idx_nhatkynuoc_nguoidung ON public."NhatKyNuoc"(nguoidungid);
CREATE INDEX idx_nhatkynuoc_ngay ON public."NhatKyNuoc"(ngayghinhan);
CREATE INDEX idx_danhsach_nguoidung ON public."DanhSachMuaSam"(nguoidungid);
CREATE INDEX idx_monmuasam_danhsach ON public."MonMuaSam"(danhsachid);
CREATE INDEX idx_goidangky_nguoidung ON public."GoiDangKyNguoiDung"(nguoidungid);

-- =============================================
-- 5. DATABASE FUNCTIONS
-- =============================================

-- Function: Auto update timestamp
CREATE OR REPLACE FUNCTION public.update_capnhatluc_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.capnhatluc = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Check user role (Security Definer)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public."VaiTroNguoiDung"
    WHERE nguoidungid = _user_id AND vaitro = _role
  )
$$;

-- Function: Handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public."HoSo" (nguoidungid, hoten, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NEW.email);
  
  -- Create health profile
  INSERT INTO public."HoSoSucKhoe" (nguoidungid)
  VALUES (NEW.id);
  
  -- Assign default user role
  INSERT INTO public."VaiTroNguoiDung" (nguoidungid, vaitro)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Function: Assign free plan to new user
CREATE OR REPLACE FUNCTION public.assign_free_plan_to_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  free_plan_id UUID;
BEGIN
  -- Get free plan ID
  SELECT id INTO free_plan_id
  FROM public."GoiDangKy"
  WHERE ten = 'Miễn phí'
  LIMIT 1;

  -- Assign free plan
  IF free_plan_id IS NOT NULL THEN
    INSERT INTO public."GoiDangKyNguoiDung" (nguoidungid, goidangkyid, batdauky, trangthai)
    VALUES (NEW.id, free_plan_id, NOW(), 'active');
  END IF;

  RETURN NEW;
END;
$$;

-- =============================================
-- 6. TRIGGERS
-- =============================================

-- Auto update timestamp triggers
CREATE TRIGGER update_hoso_timestamp
    BEFORE UPDATE ON public."HoSo"
    FOR EACH ROW
    EXECUTE FUNCTION public.update_capnhatluc_column();

CREATE TRIGGER update_hososuckhoe_timestamp
    BEFORE UPDATE ON public."HoSoSucKhoe"
    FOR EACH ROW
    EXECUTE FUNCTION public.update_capnhatluc_column();

CREATE TRIGGER update_congthuc_timestamp
    BEFORE UPDATE ON public."CongThuc"
    FOR EACH ROW
    EXECUTE FUNCTION public.update_capnhatluc_column();

CREATE TRIGGER update_kehoach_timestamp
    BEFORE UPDATE ON public."KeHoachBuaAn"
    FOR EACH ROW
    EXECUTE FUNCTION public.update_capnhatluc_column();

CREATE TRIGGER update_danhsach_timestamp
    BEFORE UPDATE ON public."DanhSachMuaSam"
    FOR EACH ROW
    EXECUTE FUNCTION public.update_capnhatluc_column();

CREATE TRIGGER update_goidangky_timestamp
    BEFORE UPDATE ON public."GoiDangKyNguoiDung"
    FOR EACH ROW
    EXECUTE FUNCTION public.update_capnhatluc_column();

-- New user signup trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 7. ROW LEVEL SECURITY (RLS)
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

-- RLS Policies are defined but not included here for brevity
-- See migration files for complete RLS policy definitions

-- =============================================
-- 8. COMMENTS & DOCUMENTATION
-- =============================================

COMMENT ON TABLE public."HoSo" IS 'User profiles - personal information';
COMMENT ON TABLE public."HoSoSucKhoe" IS 'Health profiles - health & fitness data';
COMMENT ON TABLE public."VaiTroNguoiDung" IS 'User roles - admin/user permissions';
COMMENT ON TABLE public."NguyenLieu" IS 'Ingredients - food items with nutrition data';
COMMENT ON TABLE public."CongThuc" IS 'Recipes - cooking recipes';
COMMENT ON TABLE public."NguyenLieuCongThuc" IS 'Recipe ingredients - junction table';
COMMENT ON TABLE public."DanhMucBuaAn" IS 'Meal categories - breakfast/lunch/dinner/snacks';
COMMENT ON TABLE public."KeHoachBuaAn" IS 'Meal plans - user meal planning';
COMMENT ON TABLE public."MonAnKeHoach" IS 'Meal plan items - meals in a plan';
COMMENT ON TABLE public."NhatKyDinhDuong" IS 'Nutrition logs - daily food tracking';
COMMENT ON TABLE public."NhatKyCanNang" IS 'Weight logs - weight tracking over time';
COMMENT ON TABLE public."NhatKyNuoc" IS 'Water logs - daily water intake tracking';
COMMENT ON TABLE public."DanhSachMuaSam" IS 'Shopping lists';
COMMENT ON TABLE public."MonMuaSam" IS 'Shopping items';
COMMENT ON TABLE public."GoiDangKy" IS 'Subscription plans';
COMMENT ON TABLE public."GoiDangKyNguoiDung" IS 'User subscriptions';

-- =============================================
-- END OF SCHEMA
-- =============================================
