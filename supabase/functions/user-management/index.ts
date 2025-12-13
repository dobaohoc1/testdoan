import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UserManagementRequest {
  action: 'list' | 'update' | 'delete' | 'ban' | 'unban';
  userId?: string;
  userData?: {
    role?: string;
    status?: string;
    email?: string;
    hoten?: string;
  };
  filters?: {
    role?: string;
    status?: string;
    search?: string;
  };
  pagination?: {
    page: number;
    limit: number;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const { action, userId, userData, filters, pagination }: UserManagementRequest = await req.json();

    // Kiểm tra quyền admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Invalid token');
    }

    // Kiểm tra role admin - Vietnamese lowercase schema
    const { data: userRole } = await supabase
      .from('VaiTroNguoiDung')
      .select('vaitro')
      .eq('nguoidungid', user.id)
      .single();

    if (!userRole || userRole.vaitro !== 'admin') {
      throw new Error('Access denied: Admin role required');
    }

    let result: any = {};

    switch (action) {
      case 'list':
        const page = pagination?.page || 1;
        const limit = pagination?.limit || 20;
        const offset = (page - 1) * limit;

        // First get profiles
        let profileQuery = supabase
          .from('HoSo')
          .select('*', { count: 'exact' })
          .order('taoluc', { ascending: false })
          .range(offset, offset + limit - 1);

        // Apply search filter
        if (filters?.search) {
          profileQuery = profileQuery.or(`hoten.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
        }

        const { data: profiles, error: listError, count } = await profileQuery;

        if (listError) {
          throw new Error(`Error fetching users: ${listError.message}`);
        }

        // Then get roles for these users
        const userIds = (profiles || []).map(p => p.nguoidungid);
        const { data: roles } = await supabase
          .from('VaiTroNguoiDung')
          .select('nguoidungid, vaitro')
          .in('nguoidungid', userIds);

        // Combine data
        const users = (profiles || []).map(profile => {
          const userRole = roles?.find(r => r.nguoidungid === profile.nguoidungid);
          return {
            id: profile.id,
            nguoidungid: profile.nguoidungid,
            hoten: profile.hoten,
            email: profile.email,
            taoluc: profile.taoluc,
            capnhatluc: profile.capnhatluc,
            VaiTroNguoiDung: {
              vaitro: userRole?.vaitro || 'user'
            }
          };
        });

        // Apply role filter if needed
        let filteredUsers = users;
        if (filters?.role) {
          filteredUsers = users.filter(u => u.VaiTroNguoiDung.vaitro === filters.role);
        }

        result = {
          users: filteredUsers,
          pagination: {
            page,
            limit,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / limit)
          }
        };
        break;

      case 'update':
        if (!userId || !userData) {
          throw new Error('userId and userData are required for update action');
        }

        // Update profile - Vietnamese lowercase schema
        if (userData.hoten || userData.email) {
          const { error: profileError } = await supabase
            .from('HoSo')
            .update({
              ...(userData.hoten && { hoten: userData.hoten }),
              ...(userData.email && { email: userData.email }),
              capnhatluc: new Date().toISOString()
            })
            .eq('nguoidungid', userId);

          if (profileError) {
            throw new Error(`Error updating profile: ${profileError.message}`);
          }
        }

        // Update role if provided - Vietnamese lowercase schema
        if (userData.role) {
          // Delete old role
          await supabase
            .from('VaiTroNguoiDung')
            .delete()
            .eq('nguoidungid', userId);

          // Insert new role
          const { error: roleError } = await supabase
            .from('VaiTroNguoiDung')
            .insert({
              nguoidungid: userId,
              vaitro: userData.role
            });

          if (roleError) {
            throw new Error(`Error updating role: ${roleError.message}`);
          }
        }

        result = { message: 'User updated successfully' };
        break;

      case 'ban':
      case 'unban':
        if (!userId) {
          throw new Error('userId is required for ban/unban action');
        }

        const banUser = action === 'ban';
        const { error: banError } = await supabase.auth.admin.updateUserById(
          userId,
          { ban_duration: banUser ? '876000h' : 'none' } // 100 years or none
        );

        if (banError) {
          throw new Error(`Error ${action}ning user: ${banError.message}`);
        }

        result = { message: `User ${action}ned successfully` };
        break;

      case 'delete':
        if (!userId) {
          throw new Error('userId is required for delete action');
        }

        // Delete user data - Vietnamese lowercase schema
        await Promise.all([
          supabase.from('VaiTroNguoiDung').delete().eq('nguoidungid', userId),
          supabase.from('HoSo').delete().eq('nguoidungid', userId),
          supabase.from('HoSoSucKhoe').delete().eq('nguoidungid', userId),
          supabase.from('NhatKyDinhDuong').delete().eq('nguoidungid', userId),
          supabase.from('NhatKyCanNang').delete().eq('nguoidungid', userId),
          supabase.from('NhatKyNuoc').delete().eq('nguoidungid', userId),
          supabase.from('KeHoachBuaAn').delete().eq('nguoidungid', userId),
          supabase.from('DanhSachMuaSam').delete().eq('nguoidungid', userId),
        ]);

        // Delete auth user
        const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);

        if (deleteError) {
          throw new Error(`Error deleting user: ${deleteError.message}`);
        }

        result = { message: 'User deleted successfully' };
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    console.log(`User management action '${action}' completed successfully`);

    return new Response(JSON.stringify({
      success: true,
      data: result
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in user-management function:', error);
    return new Response(JSON.stringify({ 
      error: 'Có lỗi xảy ra trong quản lý người dùng',
      details: error.message 
    }), {
      status: error.message.includes('Access denied') ? 403 : 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
