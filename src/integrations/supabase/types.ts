export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      CongThuc: {
        Row: {
          anhdaidien: string | null
          capnhatluc: string
          congkhai: boolean | null
          dokho: string | null
          huongdan: Json | null
          id: string
          khauphan: number | null
          mota: string | null
          nguoitao: string | null
          search_vector: unknown
          taoluc: string
          ten: string
          thoigianchuanbi: number | null
          thoigiannau: number | null
          tongcalo: number | null
          tongcarb: number | null
          tongchat: number | null
          tongdam: number | null
        }
        Insert: {
          anhdaidien?: string | null
          capnhatluc?: string
          congkhai?: boolean | null
          dokho?: string | null
          huongdan?: Json | null
          id?: string
          khauphan?: number | null
          mota?: string | null
          nguoitao?: string | null
          search_vector?: unknown
          taoluc?: string
          ten: string
          thoigianchuanbi?: number | null
          thoigiannau?: number | null
          tongcalo?: number | null
          tongcarb?: number | null
          tongchat?: number | null
          tongdam?: number | null
        }
        Update: {
          anhdaidien?: string | null
          capnhatluc?: string
          congkhai?: boolean | null
          dokho?: string | null
          huongdan?: Json | null
          id?: string
          khauphan?: number | null
          mota?: string | null
          nguoitao?: string | null
          search_vector?: unknown
          taoluc?: string
          ten?: string
          thoigianchuanbi?: number | null
          thoigiannau?: number | null
          tongcalo?: number | null
          tongcarb?: number | null
          tongchat?: number | null
          tongdam?: number | null
        }
        Relationships: []
      }
      DanhMucBuaAn: {
        Row: {
          id: string
          mota: string | null
          taoluc: string
          ten: string
          thutuhienthi: number | null
        }
        Insert: {
          id?: string
          mota?: string | null
          taoluc?: string
          ten: string
          thutuhienthi?: number | null
        }
        Update: {
          id?: string
          mota?: string | null
          taoluc?: string
          ten?: string
          thutuhienthi?: number | null
        }
        Relationships: []
      }
      DanhSachMuaSam: {
        Row: {
          capnhatluc: string
          id: string
          nguoidungid: string
          taoluc: string
          ten: string
        }
        Insert: {
          capnhatluc?: string
          id?: string
          nguoidungid: string
          taoluc?: string
          ten: string
        }
        Update: {
          capnhatluc?: string
          id?: string
          nguoidungid?: string
          taoluc?: string
          ten?: string
        }
        Relationships: []
      }
      GoiDangKy: {
        Row: {
          danghoatdong: boolean | null
          gianam: number | null
          giathang: number | null
          id: string
          mota: string | null
          socongthuctoida: number | null
          sokehoachtoida: number | null
          taoluc: string
          ten: string
          tinhnang: Json | null
        }
        Insert: {
          danghoatdong?: boolean | null
          gianam?: number | null
          giathang?: number | null
          id?: string
          mota?: string | null
          socongthuctoida?: number | null
          sokehoachtoida?: number | null
          taoluc?: string
          ten: string
          tinhnang?: Json | null
        }
        Update: {
          danghoatdong?: boolean | null
          gianam?: number | null
          giathang?: number | null
          id?: string
          mota?: string | null
          socongthuctoida?: number | null
          sokehoachtoida?: number | null
          taoluc?: string
          ten?: string
          tinhnang?: Json | null
        }
        Relationships: []
      }
      GoiDangKyNguoiDung: {
        Row: {
          batdauky: string | null
          capnhatluc: string
          goidangkyid: string | null
          id: string
          ketthucky: string | null
          nguoidungid: string
          stripedangkyid: string | null
          stripekhachhangid: string | null
          taoluc: string
          trangthai: string | null
        }
        Insert: {
          batdauky?: string | null
          capnhatluc?: string
          goidangkyid?: string | null
          id?: string
          ketthucky?: string | null
          nguoidungid: string
          stripedangkyid?: string | null
          stripekhachhangid?: string | null
          taoluc?: string
          trangthai?: string | null
        }
        Update: {
          batdauky?: string | null
          capnhatluc?: string
          goidangkyid?: string | null
          id?: string
          ketthucky?: string | null
          nguoidungid?: string
          stripedangkyid?: string | null
          stripekhachhangid?: string | null
          taoluc?: string
          trangthai?: string | null
        }
        Relationships: []
      }
      HoSo: {
        Row: {
          anhdaidien: string | null
          capnhatluc: string
          email: string | null
          gioitinh: string | null
          hoten: string | null
          id: string
          ngaysinh: string | null
          nguoidungid: string
          sodienthoai: string | null
          taoluc: string
        }
        Insert: {
          anhdaidien?: string | null
          capnhatluc?: string
          email?: string | null
          gioitinh?: string | null
          hoten?: string | null
          id?: string
          ngaysinh?: string | null
          nguoidungid: string
          sodienthoai?: string | null
          taoluc?: string
        }
        Update: {
          anhdaidien?: string | null
          capnhatluc?: string
          email?: string | null
          gioitinh?: string | null
          hoten?: string | null
          id?: string
          ngaysinh?: string | null
          nguoidungid?: string
          sodienthoai?: string | null
          taoluc?: string
        }
        Relationships: []
      }
      HoSoSucKhoe: {
        Row: {
          cannang: number | null
          capnhatluc: string
          chieucao: number | null
          diung: string[] | null
          hanchechedo: string[] | null
          id: string
          mucdohoatdong: string | null
          muctieucalohangngay: number | null
          muctieusuckhoe: string[] | null
          nguoidungid: string
          taoluc: string
          tinhtrangsuckhoe: string[] | null
        }
        Insert: {
          cannang?: number | null
          capnhatluc?: string
          chieucao?: number | null
          diung?: string[] | null
          hanchechedo?: string[] | null
          id?: string
          mucdohoatdong?: string | null
          muctieucalohangngay?: number | null
          muctieusuckhoe?: string[] | null
          nguoidungid: string
          taoluc?: string
          tinhtrangsuckhoe?: string[] | null
        }
        Update: {
          cannang?: number | null
          capnhatluc?: string
          chieucao?: number | null
          diung?: string[] | null
          hanchechedo?: string[] | null
          id?: string
          mucdohoatdong?: string | null
          muctieucalohangngay?: number | null
          muctieusuckhoe?: string[] | null
          nguoidungid?: string
          taoluc?: string
          tinhtrangsuckhoe?: string[] | null
        }
        Relationships: []
      }
      KeHoachBuaAn: {
        Row: {
          capnhatluc: string
          danghoatdong: boolean | null
          id: string
          mota: string | null
          muctieucalo: number | null
          ngaybatdau: string | null
          ngayketthuc: string | null
          nguoidungid: string
          taoluc: string
          ten: string
        }
        Insert: {
          capnhatluc?: string
          danghoatdong?: boolean | null
          id?: string
          mota?: string | null
          muctieucalo?: number | null
          ngaybatdau?: string | null
          ngayketthuc?: string | null
          nguoidungid: string
          taoluc?: string
          ten: string
        }
        Update: {
          capnhatluc?: string
          danghoatdong?: boolean | null
          id?: string
          mota?: string | null
          muctieucalo?: number | null
          ngaybatdau?: string | null
          ngayketthuc?: string | null
          nguoidungid?: string
          taoluc?: string
          ten?: string
        }
        Relationships: []
      }
      LichSuQuetThucPham: {
        Row: {
          calo: number | null
          canhbao: string[] | null
          carb: number | null
          chat: number | null
          chatxo: number | null
          diemdinhdung: number | null
          dotincay: number | null
          goiy: string[] | null
          id: string
          loaithucpham: string | null
          mota: string | null
          mucdo_lanhmanh: string | null
          nguoidungid: string
          nguyenlieu: Json | null
          phuhop: string[] | null
          protein: number | null
          taoluc: string
          tenmon: string | null
          thongtinbosung: Json | null
          urlhinhanh: string | null
        }
        Insert: {
          calo?: number | null
          canhbao?: string[] | null
          carb?: number | null
          chat?: number | null
          chatxo?: number | null
          diemdinhdung?: number | null
          dotincay?: number | null
          goiy?: string[] | null
          id?: string
          loaithucpham?: string | null
          mota?: string | null
          mucdo_lanhmanh?: string | null
          nguoidungid: string
          nguyenlieu?: Json | null
          phuhop?: string[] | null
          protein?: number | null
          taoluc?: string
          tenmon?: string | null
          thongtinbosung?: Json | null
          urlhinhanh?: string | null
        }
        Update: {
          calo?: number | null
          canhbao?: string[] | null
          carb?: number | null
          chat?: number | null
          chatxo?: number | null
          diemdinhdung?: number | null
          dotincay?: number | null
          goiy?: string[] | null
          id?: string
          loaithucpham?: string | null
          mota?: string | null
          mucdo_lanhmanh?: string | null
          nguoidungid?: string
          nguyenlieu?: Json | null
          phuhop?: string[] | null
          protein?: number | null
          taoluc?: string
          tenmon?: string | null
          thongtinbosung?: Json | null
          urlhinhanh?: string | null
        }
        Relationships: []
      }
      MonAnKeHoach: {
        Row: {
          congthucid: string | null
          danhmucid: string | null
          giodukien: string | null
          id: string
          kehoachid: string | null
          khauphan: number | null
          ngaydukien: string
          taoluc: string
        }
        Insert: {
          congthucid?: string | null
          danhmucid?: string | null
          giodukien?: string | null
          id?: string
          kehoachid?: string | null
          khauphan?: number | null
          ngaydukien: string
          taoluc?: string
        }
        Update: {
          congthucid?: string | null
          danhmucid?: string | null
          giodukien?: string | null
          id?: string
          kehoachid?: string | null
          khauphan?: number | null
          ngaydukien?: string
          taoluc?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_plan_items_meal_category_id_fkey"
            columns: ["danhmucid"]
            isOneToOne: false
            referencedRelation: "DanhMucBuaAn"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_plan_items_meal_plan_id_fkey"
            columns: ["kehoachid"]
            isOneToOne: false
            referencedRelation: "KeHoachBuaAn"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_plan_items_recipe_id_fkey"
            columns: ["congthucid"]
            isOneToOne: false
            referencedRelation: "CongThuc"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "MonAnKeHoach_congthucid_fkey"
            columns: ["congthucid"]
            isOneToOne: false
            referencedRelation: "CongThuc"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "MonAnKeHoach_danhmucid_fkey"
            columns: ["danhmucid"]
            isOneToOne: false
            referencedRelation: "DanhMucBuaAn"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "MonAnKeHoach_kehoachid_fkey"
            columns: ["kehoachid"]
            isOneToOne: false
            referencedRelation: "KeHoachBuaAn"
            referencedColumns: ["id"]
          },
        ]
      }
      MonMuaSam: {
        Row: {
          damua: boolean | null
          danhsachid: string
          donvi: string
          id: string
          soluong: number
          taoluc: string
          tennguyenlieu: string
        }
        Insert: {
          damua?: boolean | null
          danhsachid: string
          donvi: string
          id?: string
          soluong: number
          taoluc?: string
          tennguyenlieu: string
        }
        Update: {
          damua?: boolean | null
          danhsachid?: string
          donvi?: string
          id?: string
          soluong?: number
          taoluc?: string
          tennguyenlieu?: string
        }
        Relationships: [
          {
            foreignKeyName: "MonMuaSam_danhsachid_fkey"
            columns: ["danhsachid"]
            isOneToOne: false
            referencedRelation: "DanhSachMuaSam"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_items_shopping_list_id_fkey"
            columns: ["danhsachid"]
            isOneToOne: false
            referencedRelation: "DanhSachMuaSam"
            referencedColumns: ["id"]
          },
        ]
      }
      NguyenLieu: {
        Row: {
          calo100g: number | null
          carb100g: number | null
          chat100g: number | null
          dam100g: number | null
          duong100g: number | null
          id: string
          natri100g: number | null
          search_vector: unknown
          taoluc: string
          ten: string
          xo100g: number | null
        }
        Insert: {
          calo100g?: number | null
          carb100g?: number | null
          chat100g?: number | null
          dam100g?: number | null
          duong100g?: number | null
          id?: string
          natri100g?: number | null
          search_vector?: unknown
          taoluc?: string
          ten: string
          xo100g?: number | null
        }
        Update: {
          calo100g?: number | null
          carb100g?: number | null
          chat100g?: number | null
          dam100g?: number | null
          duong100g?: number | null
          id?: string
          natri100g?: number | null
          search_vector?: unknown
          taoluc?: string
          ten?: string
          xo100g?: number | null
        }
        Relationships: []
      }
      NguyenLieuCongThuc: {
        Row: {
          congthucid: string | null
          donvi: string
          id: string
          nguyenlieuid: string | null
          soluong: number
        }
        Insert: {
          congthucid?: string | null
          donvi: string
          id?: string
          nguyenlieuid?: string | null
          soluong: number
        }
        Update: {
          congthucid?: string | null
          donvi?: string
          id?: string
          nguyenlieuid?: string | null
          soluong?: number
        }
        Relationships: [
          {
            foreignKeyName: "NguyenLieuCongThuc_congthucid_fkey"
            columns: ["congthucid"]
            isOneToOne: false
            referencedRelation: "CongThuc"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "NguyenLieuCongThuc_nguyenlieuid_fkey"
            columns: ["nguyenlieuid"]
            isOneToOne: false
            referencedRelation: "NguyenLieu"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ingredients_ingredient_id_fkey"
            columns: ["nguyenlieuid"]
            isOneToOne: false
            referencedRelation: "NguyenLieu"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey"
            columns: ["congthucid"]
            isOneToOne: false
            referencedRelation: "CongThuc"
            referencedColumns: ["id"]
          },
        ]
      }
      NhatKyCanNang: {
        Row: {
          cannang: number
          ghichu: string | null
          id: string
          ngayghinhan: string
          nguoidungid: string
          taoluc: string
        }
        Insert: {
          cannang: number
          ghichu?: string | null
          id?: string
          ngayghinhan?: string
          nguoidungid: string
          taoluc?: string
        }
        Update: {
          cannang?: number
          ghichu?: string | null
          id?: string
          ngayghinhan?: string
          nguoidungid?: string
          taoluc?: string
        }
        Relationships: []
      }
      NhatKyDinhDuong: {
        Row: {
          calo: number | null
          carb: number | null
          chat: number | null
          congthucid: string | null
          dam: number | null
          danhmucid: string | null
          donvi: string | null
          ghichu: string | null
          id: string
          ngayghinhan: string
          nguoidungid: string
          soluong: number | null
          taoluc: string
          tenthucpham: string | null
        }
        Insert: {
          calo?: number | null
          carb?: number | null
          chat?: number | null
          congthucid?: string | null
          dam?: number | null
          danhmucid?: string | null
          donvi?: string | null
          ghichu?: string | null
          id?: string
          ngayghinhan: string
          nguoidungid: string
          soluong?: number | null
          taoluc?: string
          tenthucpham?: string | null
        }
        Update: {
          calo?: number | null
          carb?: number | null
          chat?: number | null
          congthucid?: string | null
          dam?: number | null
          danhmucid?: string | null
          donvi?: string | null
          ghichu?: string | null
          id?: string
          ngayghinhan?: string
          nguoidungid?: string
          soluong?: number | null
          taoluc?: string
          tenthucpham?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "NhatKyDinhDuong_congthucid_fkey"
            columns: ["congthucid"]
            isOneToOne: false
            referencedRelation: "CongThuc"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "NhatKyDinhDuong_danhmucid_fkey"
            columns: ["danhmucid"]
            isOneToOne: false
            referencedRelation: "DanhMucBuaAn"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nutrition_logs_meal_category_id_fkey"
            columns: ["danhmucid"]
            isOneToOne: false
            referencedRelation: "DanhMucBuaAn"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nutrition_logs_recipe_id_fkey"
            columns: ["congthucid"]
            isOneToOne: false
            referencedRelation: "CongThuc"
            referencedColumns: ["id"]
          },
        ]
      }
      NhatKyNuoc: {
        Row: {
          gioghinhan: string
          id: string
          ngayghinhan: string
          nguoidungid: string
          soluongml: number
          taoluc: string
        }
        Insert: {
          gioghinhan?: string
          id?: string
          ngayghinhan?: string
          nguoidungid: string
          soluongml: number
          taoluc?: string
        }
        Update: {
          gioghinhan?: string
          id?: string
          ngayghinhan?: string
          nguoidungid?: string
          soluongml?: number
          taoluc?: string
        }
        Relationships: []
      }
      VaiTroNguoiDung: {
        Row: {
          id: string
          nguoidungid: string
          taoluc: string
          vaitro: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          id?: string
          nguoidungid: string
          taoluc?: string
          vaitro?: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          id?: string
          nguoidungid?: string
          taoluc?: string
          vaitro?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
