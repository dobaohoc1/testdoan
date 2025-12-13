import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface WeightLog {
  id?: string;
  nguoidungid?: string;
  cannang: number;
  ngayghinhan: string;
  ghichu?: string;
  taoluc?: string;
}

export const useWeightLogs = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const addWeightLog = async (log: WeightLog): Promise<WeightLog | null> => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('NhatKyCanNang')
        .insert([{ ...log, nguoidungid: user.id }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Thành công",
        description: "Đã lưu cân nặng",
      });

      return data;
    } catch (error) {
      console.error('Error adding weight log:', error);
      toast({
        title: "Lỗi",
        description: "Không thể lưu cân nặng",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getWeightLogs = async (limit?: number): Promise<WeightLog[]> => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let query = supabase
        .from('NhatKyCanNang')
        .select('*')
        .eq('nguoidungid', user.id)
        .order('ngayghinhan', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching weight logs:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const deleteWeightLog = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('NhatKyCanNang')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Thành công",
        description: "Đã xóa bản ghi cân nặng",
      });

      return true;
    } catch (error) {
      console.error('Error deleting weight log:', error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa bản ghi",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    addWeightLog,
    getWeightLogs,
    deleteWeightLog,
    loading
  };
};