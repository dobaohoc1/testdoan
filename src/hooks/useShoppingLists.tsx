import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ShoppingList {
  id?: string;
  nguoidungid?: string;
  ten: string;
  taoluc?: string;
  capnhatluc?: string;
}

export interface ShoppingListItem {
  id?: string;
  danhsachid: string;
  tennguyenlieu: string;
  soluong: number;
  donvi: string;
  damua?: boolean;
}

export const useShoppingLists = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createShoppingList = async (name: string): Promise<ShoppingList | null> => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('DanhSachMuaSam')
        .insert([{
          ten: name,
          nguoidungid: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Thành công",
        description: "Đã tạo danh sách mua sắm"
      });

      return data;
    } catch (error) {
      console.error('Error creating shopping list:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo danh sách mua sắm",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getMyShoppingLists = async (): Promise<ShoppingList[]> => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('DanhSachMuaSam')
        .select(`
          *,
          MonMuaSam!MonMuaSam_danhsachid_fkey (
            id,
            tennguyenlieu,
            soluong,
            donvi,
            damua,
            taoluc
          )
        `)
        .eq('nguoidungid', user.id)
        .order('taoluc', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching shopping lists:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const addShoppingListItem = async (item: ShoppingListItem): Promise<ShoppingListItem | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('MonMuaSam')
        .insert([{
          danhsachid: item.danhsachid,
          tennguyenlieu: item.tennguyenlieu,
          soluong: item.soluong,
          donvi: item.donvi
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Thành công",
        description: "Đã thêm món vào danh sách"
      });

      return data;
    } catch (error) {
      console.error('Error adding shopping list item:', error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm món",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getShoppingListItems = async (shoppingListId: string): Promise<ShoppingListItem[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('MonMuaSam')
        .select('*')
        .eq('danhsachid', shoppingListId)
        .order('taoluc', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching shopping list items:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const updateShoppingListItem = async (id: string, updates: Partial<ShoppingListItem>): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('MonMuaSam')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating shopping list item:', error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật món",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteShoppingListItem = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('MonMuaSam')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Thành công",
        description: "Đã xóa món khỏi danh sách"
      });

      return true;
    } catch (error) {
      console.error('Error deleting shopping list item:', error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa món",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteShoppingList = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('DanhSachMuaSam')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Thành công",
        description: "Đã xóa danh sách mua sắm"
      });

      return true;
    } catch (error) {
      console.error('Error deleting shopping list:', error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa danh sách",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createShoppingList,
    getMyShoppingLists,
    addShoppingListItem,
    getShoppingListItems,
    updateShoppingListItem,
    deleteShoppingListItem,
    deleteShoppingList
  };
};