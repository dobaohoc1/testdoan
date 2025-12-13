import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface WaterLog {
  id?: string;
  nguoidungid?: string;
  soluongml: number;
  ngayghinhan: string;
  gioghinhan: string;
  taoluc?: string;
}

export const useWaterLogs = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const addWaterLog = async (amount_ml: number): Promise<WaterLog | null> => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const now = new Date();
      const waterLog = {
        soluongml: amount_ml,
        ngayghinhan: now.toISOString().split('T')[0],
        gioghinhan: now.toTimeString().split(' ')[0]
      };

      const { data, error } = await supabase
        .from('NhatKyNuoc')
        .insert([{ ...waterLog, nguoidungid: user.id }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Đã ghi nhận",
        description: `Đã uống ${amount_ml}ml nước`,
      });

      return data;
    } catch (error) {
      console.error('Error adding water log:', error);
      toast({
        title: "Lỗi",
        description: "Không thể lưu thông tin uống nước",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getTodayWaterLogs = async (): Promise<WaterLog[]> => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('NhatKyNuoc')
        .select('*')
        .eq('nguoidungid', user.id)
        .eq('ngayghinhan', today)
        .order('gioghinhan', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching water logs:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getWaterLogsByDate = async (date: string): Promise<WaterLog[]> => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('NhatKyNuoc')
        .select('*')
        .eq('nguoidungid', user.id)
        .eq('ngayghinhan', date)
        .order('gioghinhan', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching water logs:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const deleteWaterLog = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('NhatKyNuoc')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Đã xóa",
        description: "Đã xóa bản ghi uống nước",
      });

      return true;
    } catch (error) {
      console.error('Error deleting water log:', error);
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
    addWaterLog,
    getTodayWaterLogs,
    getWaterLogsByDate,
    deleteWaterLog,
    loading
  };
};