import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Ingredient {
  id: string;
  ten: string;
  calo100g: number | null;
  dam100g: number | null;
  carb100g: number | null;
  chat100g: number | null;
  xo100g: number | null;
  duong100g: number | null;
  natri100g: number | null;
}

export const useIngredients = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getAllIngredients = async (): Promise<Ingredient[]> => {
    try {
      const { data, error } = await supabase
        .from('NguyenLieu')
        .select('*')
        .order('ten', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách nguyên liệu",
        variant: "destructive"
      });
      return [];
    }
  };

  const searchIngredients = async (searchTerm: string): Promise<Ingredient[]> => {
    try {
      const { data, error } = await supabase
        .from('NguyenLieu')
        .select('*')
        .ilike('ten', `%${searchTerm}%`)
        .order('ten', { ascending: true })
        .limit(20);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching ingredients:', error);
      return [];
    }
  };

  const getIngredient = async (id: string): Promise<Ingredient | null> => {
    try {
      const { data, error } = await supabase
        .from('NguyenLieu')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching ingredient:', error);
      return null;
    }
  };

  return {
    loading,
    getAllIngredients,
    searchIngredients,
    getIngredient
  };
};
