import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface NutritionLog {
  id?: string;
  ngayghinhan: string;
  tenthucpham?: string;
  congthucid?: string;
  danhmucid?: string;
  soluong?: number;
  donvi?: string;
  calo?: number;
  dam?: number;
  carb?: number;
  chat?: number;
  ghichu?: string;
}

export const useNutritionLogs = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const addNutritionLog = async (log: NutritionLog) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('NhatKyDinhDuong')
        .insert({
          ...log,
          nguoidungid: user.id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Thành công",
        description: "Đã thêm nhật ký dinh dưỡng"
      });

      return data;
    } catch (error) {
      console.error('Error adding nutrition log:', error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm nhật ký dinh dưỡng",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateNutritionLog = async (id: string, log: Partial<NutritionLog>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('NhatKyDinhDuong')
        .update(log)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Thành công",
        description: "Đã cập nhật nhật ký dinh dưỡng"
      });

      return data;
    } catch (error) {
      console.error('Error updating nutrition log:', error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật nhật ký",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteNutritionLog = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('NhatKyDinhDuong')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Thành công",
        description: "Đã xóa nhật ký dinh dưỡng"
      });

      return true;
    } catch (error) {
      console.error('Error deleting nutrition log:', error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa nhật ký",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getNutritionLog = async (id: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('NhatKyDinhDuong')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching nutrition log:', error);
      toast({
        title: "Lỗi",
        description: "Không thể lấy nhật ký dinh dưỡng",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getNutritionLogsByDate = async (date: string) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('NhatKyDinhDuong')
        .select('*, CongThuc(*), DanhMucBuaAn(*)')
        .eq('nguoidungid', user.id)
        .eq('ngayghinhan', date)
        .order('taoluc', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching nutrition logs:', error);
      toast({
        title: "Lỗi",
        description: "Không thể lấy nhật ký dinh dưỡng",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getNutritionLogsByDateRange = async (startDate: string, endDate: string) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('NhatKyDinhDuong')
        .select('*, CongThuc(*), DanhMucBuaAn(*)')
        .eq('nguoidungid', user.id)
        .gte('ngayghinhan', startDate)
        .lte('ngayghinhan', endDate)
        .order('ngayghinhan', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching nutrition logs:', error);
      toast({
        title: "Lỗi",
        description: "Không thể lấy nhật ký dinh dưỡng",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getMyNutritionLogs = async (limit: number = 50) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('NhatKyDinhDuong')
        .select('*, CongThuc(*), DanhMucBuaAn(*)')
        .eq('nguoidungid', user.id)
        .order('ngayghinhan', { ascending: false })
        .order('taoluc', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching nutrition logs:', error);
      toast({
        title: "Lỗi",
        description: "Không thể lấy nhật ký dinh dưỡng",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    addNutritionLog,
    updateNutritionLog,
    deleteNutritionLog,
    getNutritionLog,
    getNutritionLogsByDate,
    getNutritionLogsByDateRange,
    getMyNutritionLogs
  };
};