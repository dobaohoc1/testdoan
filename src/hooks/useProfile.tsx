import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Profile {
  id?: string;
  nguoidungid?: string;
  hoten?: string;
  email?: string;
  sodienthoai?: string;
  ngaysinh?: string;
  gioitinh?: string;
  anhdaidien?: string;
  taoluc?: string;
  capnhatluc?: string;
}

export interface HealthProfile {
  id?: string;
  nguoidungid?: string;
  chieucao?: number;
  cannang?: number;
  mucdohoatdong?: string;
  muctieucalohangngay?: number;
  muctieusuckhoe?: string[];
  hanchechedo?: string[];
  diung?: string[];
  tinhtrangsuckhoe?: string[];
  taoluc?: string;
  capnhatluc?: string;
}

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getProfile = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // ✅ Sử dụng JOIN với FK constraint để lấy cả VaiTroNguoiDung
      const { data, error } = await supabase
        .from('HoSo')
        .select(`
          *,
          VaiTroNguoiDung!VaiTroNguoiDung_nguoidungid_fkey (
            id,
            vaitro,
            taoluc
          )
        `)
        .eq('nguoidungid', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profile: Partial<Profile>) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('HoSo')
        .update({ ...profile, capnhatluc: new Date().toISOString() })
        .eq('nguoidungid', user.id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Thành công",
        description: "Cập nhật hồ sơ thành công"
      });

      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật thông tin cá nhân",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getHealthProfile = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('HoSoSucKhoe')
        .select('*')
        .eq('nguoidungid', user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching health profile:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateHealthProfile = async (healthProfile: Partial<HealthProfile>) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('HoSoSucKhoe')
        .update({ ...healthProfile, capnhatluc: new Date().toISOString() })
        .eq('nguoidungid', user.id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Thành công",
        description: "Cập nhật hồ sơ sức khỏe thành công"
      });

      return data;
    } catch (error) {
      console.error('Error updating health profile:', error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật thông tin sức khỏe",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getCompleteProfile = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Không tìm thấy người dùng');

      // ✅ Query song song với .maybeSingle() để tránh lỗi khi không có data
      const [profile, healthProfile, weightLogs] = await Promise.all([
        supabase.from('HoSo').select('*').eq('nguoidungid', user.id).maybeSingle(),
        supabase.from('HoSoSucKhoe').select('*').eq('nguoidungid', user.id).maybeSingle(),
        supabase
          .from('NhatKyCanNang')
          .select('*')
          .eq('nguoidungid', user.id)
          .order('ngayghinhan', { ascending: false })
          .limit(10)
      ]);

      return {
        profile: profile.data,
        healthProfile: healthProfile.data,
        weightLogs: weightLogs.data || []
      };
    } catch (error) {
      console.error('Lỗi lấy hồ sơ đầy đủ:', error);
      toast({
        title: "Lỗi",
        description: "Không thể lấy thông tin hồ sơ",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Delete old avatar if exists
      const { data: profile } = await supabase
        .from('HoSo')
        .select('anhdaidien')
        .eq('nguoidungid', user.id)
        .maybeSingle();

      if (profile?.anhdaidien) {
        const oldPath = profile.anhdaidien.split('/').slice(-2).join('/');
        await supabase.storage.from('avatars').remove([oldPath]);
      }

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

    // Update profile with new avatar URL
    const { error: updateError } = await supabase
      .from('HoSo')
      .update({ 
        anhdaidien: publicUrl
      })
      .eq('nguoidungid', user.id);

      if (updateError) throw updateError;

      toast({
        title: "Thành công",
        description: "Đã cập nhật ảnh đại diện"
      });

      return publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải lên ảnh đại diện",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getProfile,
    updateProfile,
    getHealthProfile,
    updateHealthProfile,
    getCompleteProfile,
    uploadAvatar
  };
};