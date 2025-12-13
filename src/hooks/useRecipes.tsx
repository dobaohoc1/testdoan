import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Recipe {
  id?: string;
  ten: string;
  mota?: string;
  huongdan?: any;
  thoigianchuanbi?: number;
  thoigiannau?: number;
  khauphan?: number;
  tongcalo?: number;
  tongdam?: number;
  tongcarb?: number;
  tongchat?: number;
  nguoitao?: string;
  congkhai?: boolean;
  anhdaidien?: string;
  dokho?: string;
  taoluc?: string;
  capnhatluc?: string;
}

export const useRecipes = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createRecipe = async (recipe: Recipe) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('CongThuc')
        .insert([{ ...recipe, nguoitao: user.id }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Thành công",
        description: "Đã tạo công thức mới"
      });

      return data;
    } catch (error) {
      console.error('Error creating recipe:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo công thức",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateRecipe = async (id: string, recipe: Partial<Recipe>) => {
    setLoading(true);
    try {
      const { data, error} = await supabase
        .from('CongThuc')
        .update({ ...recipe, capnhatluc: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Thành công",
        description: "Đã cập nhật công thức"
      });

      return data;
    } catch (error) {
      console.error('Error updating recipe:', error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật công thức",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteRecipe = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('CongThuc')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Thành công",
        description: "Đã xóa công thức"
      });

      return true;
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa công thức",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getRecipe = async (id: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('CongThuc')
        .select(`
          *,
          NguyenLieuCongThuc (
            id,
            soluong,
            donvi,
            NguyenLieu (
              id,
              ten,
              calo100g,
              dam100g,
              carb100g,
              chat100g
            )
          ),
          HoSo!CongThuc_nguoitao_fkey (
            id,
            hoten,
            anhdaidien
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching recipe:', error);
      toast({
        title: "Lỗi",
        description: "Không thể lấy thông tin công thức",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getMyRecipes = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('CongThuc')
        .select(`
          *,
          NguyenLieuCongThuc (
            id,
            soluong,
            donvi,
            NguyenLieu (
              id,
              ten
            )
          )
        `)
        .eq('nguoitao', user.id)
        .order('taoluc', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching recipes:', error);
      toast({
        title: "Lỗi",
        description: "Không thể lấy danh sách công thức",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getPublicRecipes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('CongThuc')
        .select(`
          *,
          HoSo!CongThuc_nguoitao_fkey (
            id,
            hoten,
            anhdaidien
          ),
          NguyenLieuCongThuc (
            id,
            soluong,
            donvi,
            NguyenLieu (
              id,
              ten
            )
          )
        `)
        .eq('congkhai', true)
        .order('taoluc', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching public recipes:', error);
      toast({
        title: "Lỗi",
        description: "Không thể lấy danh sách công thức công khai",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipe,
    getMyRecipes,
    getPublicRecipes
  };
};