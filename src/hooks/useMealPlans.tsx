import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface MealPlan {
  id?: string;
  nguoidungid?: string;
  ten: string;
  mota?: string;
  ngaybatdau?: string;
  ngayketthuc?: string;
  muctieucalo?: number;
  danghoatdong?: boolean;
  taoluc?: string;
  capnhatluc?: string;
}

export interface MealPlanEntry {
  id?: string;
  kehoachid: string;
  congthucid?: string;
  danhmucid?: string;
  ngaydukien: string;
  giodukien?: string;
  khauphan?: number;
}

export const useMealPlans = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createMealPlan = async (mealPlan: MealPlan) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('KeHoachBuaAn')
        .insert([{
          ...mealPlan,
          nguoidungid: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Thành công",
        description: "Đã tạo kế hoạch bữa ăn mới"
      });

      return data;
    } catch (error) {
      console.error('Error creating meal plan:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo kế hoạch bữa ăn",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateMealPlan = async (id: string, mealPlan: Partial<MealPlan>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('KeHoachBuaAn')
        .update({ ...mealPlan, capnhatluc: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Thành công",
        description: "Đã cập nhật kế hoạch bữa ăn"
      });

      return data;
    } catch (error) {
      console.error('Error updating meal plan:', error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật kế hoạch bữa ăn",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteMealPlan = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('KeHoachBuaAn')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Thành công",
        description: "Đã xóa kế hoạch bữa ăn"
      });

      return true;
    } catch (error) {
      console.error('Error deleting meal plan:', error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa kế hoạch bữa ăn",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getMealPlan = async (id: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('KeHoachBuaAn')
        .select(`
          *,
          HoSo!KeHoachBuaAn_nguoidungid_fkey (
            id,
            hoten,
            email
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching meal plan:', error);
      toast({
        title: "Lỗi",
        description: "Không thể lấy thông tin kế hoạch bữa ăn",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getMyMealPlans = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('KeHoachBuaAn')
        .select('*')
        .eq('nguoidungid', user.id)
        .order('taoluc', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching meal plans:', error);
      toast({
        title: "Lỗi",
        description: "Không thể lấy danh sách kế hoạch bữa ăn",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const addMealPlanEntry = async (entry: MealPlanEntry) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('MonAnKeHoach')
        .insert([entry])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Thành công",
        description: "Đã thêm món ăn vào kế hoạch"
      });

      return data;
    } catch (error) {
      console.error('Error adding meal plan entry:', error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm món ăn vào kế hoạch",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateMealPlanEntry = async (id: string, entry: Partial<MealPlanEntry>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('MonAnKeHoach')
        .update(entry)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Thành công",
        description: "Đã cập nhật món ăn trong kế hoạch"
      });

      return data;
    } catch (error) {
      console.error('Error updating meal plan entry:', error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật món ăn",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteMealPlanEntry = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('MonAnKeHoach')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Thành công",
        description: "Đã xóa món ăn khỏi kế hoạch"
      });

      return true;
    } catch (error) {
      console.error('Error deleting meal plan entry:', error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa món ăn",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getMealPlanEntries = async (mealPlanId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('MonAnKeHoach')
        .select(`
          *,
          CongThuc (
            id,
            ten,
            mota,
            tongcalo,
            tongdam,
            tongcarb,
            tongchat,
            khauphan,
            thoigianchuanbi,
            thoigiannau,
            dokho,
            anhdaidien,
            NguyenLieuCongThuc (
              id,
              soluong,
              donvi,
              NguyenLieu (
                id,
                ten
              )
            )
          ),
          DanhMucBuaAn (
            id,
            ten,
            mota
          ),
          KeHoachBuaAn!MonAnKeHoach_kehoachid_fkey (
            id,
            ten,
            mota
          )
        `)
        .eq('kehoachid', mealPlanId)
        .order('ngaydukien', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching meal plan entries:', error);
      toast({
        title: "Lỗi",
        description: "Không thể lấy danh sách món ăn",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createMealPlan,
    updateMealPlan,
    deleteMealPlan,
    getMealPlan,
    getMyMealPlans,
    addMealPlanEntry,
    updateMealPlanEntry,
    deleteMealPlanEntry,
    getMealPlanEntries
  };
};