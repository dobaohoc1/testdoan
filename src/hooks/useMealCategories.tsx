import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface MealCategory {
  id: string;
  ten: string;
  mota: string | null;
  thutuhienthi: number;
}

export const useMealCategories = () => {
  const [categories, setCategories] = useState<MealCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('DanhMucBuaAn')
        .select('*')
        .order('thutuhienthi', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching meal categories:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh mục bữa ăn",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    refetch: fetchCategories
  };
};
