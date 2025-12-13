import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AdminStatsRequest {
  userId?: string;
  dateRange?: {
    start: string;
    end: string;
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

    const { userId, dateRange }: AdminStatsRequest = await req.json();

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

    const stats: any = {};

    // Thống kê tổng quan - Vietnamese lowercase schema
    const [
      { count: totalUsers },
      { count: totalRecipes },
      { count: totalMealPlans },
      { count: totalNutritionLogs }
    ] = await Promise.all([
      supabase.from('HoSo').select('*', { count: 'exact', head: true }),
      supabase.from('CongThuc').select('*', { count: 'exact', head: true }),
      supabase.from('KeHoachBuaAn').select('*', { count: 'exact', head: true }),
      supabase.from('NhatKyDinhDuong').select('*', { count: 'exact', head: true })
    ]);

    stats.overview = {
      totalUsers: totalUsers || 0,
      totalRecipes: totalRecipes || 0,
      totalMealPlans: totalMealPlans || 0,
      totalNutritionLogs: totalNutritionLogs || 0
    };

    // Thống kê người dùng mới theo ngày (30 ngày gần nhất) - Vietnamese lowercase schema
    const { data: newUsersData } = await supabase
      .from('HoSo')
      .select('taoluc')
      .gte('taoluc', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('taoluc', { ascending: true });

    const userGrowth = newUsersData?.reduce((acc: any, user) => {
      const date = new Date(user.taoluc).toLocaleDateString('vi-VN');
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {}) || {};

    stats.userGrowth = Object.entries(userGrowth).map(([date, count]) => ({
      date,
      count
    }));

    // Top recipes được tạo nhiều nhất - Vietnamese lowercase schema
    const { data: topRecipes } = await supabase
      .from('CongThuc')
      .select('ten, tongcalo, dokho, taoluc')
      .eq('congkhai', true)
      .order('taoluc', { ascending: false })
      .limit(10);

    stats.topRecipes = topRecipes || [];

    // Thống kê meal plans active - Vietnamese lowercase schema
    const { data: activeMealPlans } = await supabase
      .from('KeHoachBuaAn')
      .select(`
        ten,
        muctieucalo,
        ngaybatdau,
        ngayketthuc,
        HoSo!inner(hoten, email)
      `)
      .eq('danghoatdong', true)
      .order('taoluc', { ascending: false })
      .limit(10);

    stats.activeMealPlans = activeMealPlans || [];

    // Thống kê subscription plans - Vietnamese lowercase schema
    const { data: subscriptionStats } = await supabase
      .from('GoiDangKy')
      .select(`
        ten,
        giathang,
        GoiDangKyNguoiDung(count)
      `);

    stats.subscriptions = subscriptionStats?.map(plan => ({
      name: plan.ten,
      price: plan.giathang,
      subscribers: plan.GoiDangKyNguoiDung?.length || 0
    })) || [];

    // Thống kê nutrition logs theo meal category - Vietnamese lowercase schema
    const { data: nutritionByCategory } = await supabase
      .from('NhatKyDinhDuong')
      .select(`
        calo,
        DanhMucBuaAn!inner(ten)
      `)
      .gte('ngayghinhan', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

    const categoryStats = nutritionByCategory?.reduce((acc: any, log: any) => {
      const category = log.DanhMucBuaAn?.ten || 'Khác';
      if (!acc[category]) {
        acc[category] = { count: 0, totalCalories: 0 };
      }
      acc[category].count += 1;
      acc[category].totalCalories += log.calo || 0;
      return acc;
    }, {}) || {};

    stats.nutritionByCategory = Object.entries(categoryStats).map(([category, data]: [string, any]) => ({
      category,
      count: data.count,
      averageCalories: Math.round(data.totalCalories / data.count)
    }));

    // System health check
    const healthChecks = await Promise.all([
      // Check database connectivity
      supabase.from('HoSo').select('id').limit(1),
      // Check auth service
      supabase.auth.getSession(),
    ]);

    stats.systemHealth = {
      database: healthChecks[0].error ? 'error' : 'healthy',
      auth: healthChecks[1].error ? 'error' : 'healthy',
      api: 'healthy'
    };

    console.log('Admin statistics generated successfully');

    return new Response(JSON.stringify({
      success: true,
      data: stats,
      generatedAt: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in admin-analytics function:', error);
    return new Response(JSON.stringify({ 
      error: 'Có lỗi xảy ra khi tải thống kê admin',
      details: error.message 
    }), {
      status: error.message.includes('Access denied') ? 403 : 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
