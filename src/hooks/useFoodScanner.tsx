import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FoodScanResult {
  nhanDien?: {
    tenMon: string;
    loaiThucPham: string;
    doTinCay: number;
    moTa: string;
  };
  dinhDuong?: {
    caloUocTinh: number;
    protein: number;
    carb: number;
    fat: number;
    chatXo: number;
    donVi: string;
  };
  nguyenLieu?: Array<{
    ten: string;
    tyLe: number;
    moTa: string;
  }>;
  danhGia?: {
    diemDinhDuong: number;
    mucDoLanhManh: string;
    phuHop: string[];
    canhBao: string[];
    goiY: string[];
  };
  thongTinBoSung?: {
    cachCheBien: string;
    nguonGoc: string;
    mua: string;
    luuY: string[];
  };
}

export const useFoodScanner = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const scanFood = async (
    imageUrl: string,
    analysisType: 'nutrition' | 'ingredients' | 'calories' | 'all' = 'all'
  ): Promise<FoodScanResult | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('food-scanner', {
        body: {
          imageUrl,
          analysisType
        }
      });

      if (error) throw error;
      return data.analysis;
    } catch (error) {
      console.error('Error scanning food:', error);
      toast({
        title: "Lỗi",
        description: "Không thể phân tích hình ảnh thực phẩm. Vui lòng thử lại.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    scanFood,
    loading
  };
};