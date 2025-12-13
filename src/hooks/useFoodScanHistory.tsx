import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface FoodScanHistory {
  id: string;
  nguoidungid: string;
  urlhinhanh: string | null;
  tenmon: string | null;
  loaithucpham: string | null;
  dotincay: number | null;
  mota: string | null;
  calo: number | null;
  protein: number | null;
  carb: number | null;
  chat: number | null;
  chatxo: number | null;
  diemdinhdung: number | null;
  mucdo_lanhmanh: string | null;
  phuhop: string[] | null;
  canhbao: string[] | null;
  goiy: string[] | null;
  nguyenlieu: any;
  thongtinbosung: any;
  taoluc: string;
}

interface SaveScanData {
  urlhinhanh: string;
  tenmon: string;
  loaithucpham?: string;
  dotincay?: number;
  mota?: string;
  calo?: number;
  protein?: number;
  carb?: number;
  chat?: number;
  chatxo?: number;
  diemdinhdung?: number;
  mucdo_lanhmanh?: string;
  phuhop?: string[];
  canhbao?: string[];
  goiy?: string[];
  nguyenlieu?: any;
  thongtinbosung?: any;
}

export const useFoodScanHistory = () => {
  const [history, setHistory] = useState<FoodScanHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('LichSuQuetThucPham')
        .select('*')
        .eq('nguoidungid', user.id)
        .order('taoluc', { ascending: false });

      if (error) throw error;
      setHistory((data as any) || []);
    } catch (error) {
      console.error('Error fetching scan history:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải lịch sử quét",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveScanToHistory = async (scanData: SaveScanData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('LichSuQuetThucPham')
        .insert({
          nguoidungid: user.id,
          ...scanData
        });

      if (error) throw error;

      toast({
        title: "Đã lưu",
        description: "Kết quả quét đã được lưu vào lịch sử"
      });

      fetchHistory();
      return true;
    } catch (error) {
      console.error('Error saving scan to history:', error);
      toast({
        title: "Lỗi",
        description: "Không thể lưu vào lịch sử",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteScanHistory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('LichSuQuetThucPham')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Đã xóa",
        description: "Đã xóa khỏi lịch sử"
      });

      fetchHistory();
      return true;
    } catch (error) {
      console.error('Error deleting scan history:', error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa khỏi lịch sử",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return {
    history,
    loading,
    fetchHistory,
    saveScanToHistory,
    deleteScanHistory
  };
};
