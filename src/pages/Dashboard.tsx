import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, ChefHat, BookOpen, Activity, TrendingUp, Target, Apple, Wifi, WifiOff } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface DashboardStats {
  totalRecipes: number;
  totalMealPlans: number;
  activeMealPlans: number;
  todayCalories: number;
  weekCalories: number;
  targetCalories: number;
  recentLogs: any[];
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalRecipes: 0,
    totalMealPlans: 0,
    activeMealPlans: 0,
    todayCalories: 0,
    weekCalories: 0,
    targetCalories: 2000,
    recentLogs: []
  });
  const [loading, setLoading] = useState(true);
  const [isRealtime, setIsRealtime] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;

    try {
      // Fetch total recipes
      const { count: recipesCount } = await supabase
        .from('CongThuc')
        .select('*', { count: 'exact', head: true })
        .eq('nguoitao', user.id);

      // Fetch total meal plans
      const { count: mealPlansCount } = await supabase
        .from('KeHoachBuaAn')
        .select('*', { count: 'exact', head: true })
        .eq('nguoidungid', user.id);

      // Fetch health profile for calorie target
      const { data: healthProfile } = await supabase
        .from('HoSoSucKhoe')
        .select('muctieucalohangngay')
        .eq('nguoidungid', user.id)
        .maybeSingle();

      // Fetch today's calories
      const today = new Date().toISOString().split('T')[0];
      const { data: todayLogs } = await supabase
        .from('NhatKyDinhDuong')
        .select('calo')
        .eq('nguoidungid', user.id)
        .eq('ngayghinhan', today);

      // Fetch this week's calories
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const { data: weekLogs } = await supabase
        .from('NhatKyDinhDuong')
        .select('calo')
        .eq('nguoidungid', user.id)
        .gte('ngayghinhan', weekAgo.toISOString().split('T')[0]);

      // Fetch recent nutrition logs
      const { data: recentLogs } = await supabase
        .from('NhatKyDinhDuong')
        .select('*')
        .eq('nguoidungid', user.id)
        .order('ngayghinhan', { ascending: false })
        .limit(5);

      const todayCalories = todayLogs?.reduce((sum, log) => sum + (log.calo || 0), 0) || 0;
      const weekCalories = weekLogs?.reduce((sum, log) => sum + (log.calo || 0), 0) || 0;
      const activeMealPlans = mealPlansCount || 0;

      // Get calorie target from health profile
      const calorieTarget = healthProfile?.muctieucalohangngay || 2000;

      setStats({
        totalRecipes: recipesCount || 0,
        totalMealPlans: mealPlansCount || 0,
        activeMealPlans,
        todayCalories,
        weekCalories,
        targetCalories: calorieTarget,
        recentLogs: recentLogs || []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initial data fetch
  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user, fetchDashboardData]);

  // Real-time subscriptions
  useEffect(() => {
    if (!user) return;

    console.log('Setting up real-time subscriptions for dashboard...');

    const channel = supabase
      .channel('dashboard-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'NhatKyDinhDuong',
          filter: `nguoidungid=eq.${user.id}`
        },
        (payload) => {
          console.log('Nutrition log changed:', payload);
          fetchDashboardData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'CongThuc',
          filter: `nguoitao=eq.${user.id}`
        },
        (payload) => {
          console.log('Recipe changed:', payload);
          fetchDashboardData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'KeHoachBuaAn',
          filter: `nguoidungid=eq.${user.id}`
        },
        (payload) => {
          console.log('Meal plan changed:', payload);
          fetchDashboardData();
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
        setIsRealtime(status === 'SUBSCRIBED');
      });

    return () => {
      console.log('Cleaning up real-time subscriptions...');
      supabase.removeChannel(channel);
    };
  }, [user, fetchDashboardData]);

  const calorieProgress = (stats.todayCalories / stats.targetCalories) * 100;

  if (loading) {
    return <div className="flex items-center justify-center h-64">Đang tải...</div>;
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-background p-6 sm:p-8 border border-border/50">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-primary/20 backdrop-blur-sm">
                <Activity className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
                Dashboard
              </h1>
            </div>
            {/* Real-time indicator */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
              isRealtime 
                ? 'bg-success/20 text-success' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {isRealtime ? (
                <Wifi className="w-3 h-3" />
              ) : (
                <WifiOff className="w-3 h-3" />
              )}
              <span className="hidden sm:inline">{isRealtime ? 'Live' : 'Offline'}</span>
            </div>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground ml-[52px]">
            Tổng quan về hoạt động dinh dưỡng của bạn
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="hover-lift transition-smooth bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3 p-4 sm:p-5">
            <CardTitle className="text-xs sm:text-sm font-medium">Công thức</CardTitle>
            <div className="p-2 rounded-xl bg-primary/10">
              <ChefHat className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 pt-0">
            <div className="text-2xl sm:text-3xl font-bold">{stats.totalRecipes}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Tổng số công thức</p>
          </CardContent>
        </Card>

        <Card className="hover-lift transition-smooth bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3 p-4 sm:p-5">
            <CardTitle className="text-xs sm:text-sm font-medium">Thực đơn</CardTitle>
            <div className="p-2 rounded-xl bg-accent/10">
              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent-foreground" />
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 pt-0">
            <div className="text-2xl sm:text-3xl font-bold">{stats.totalMealPlans}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
              {stats.activeMealPlans} hoạt động
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift transition-smooth bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3 p-4 sm:p-5">
            <CardTitle className="text-xs sm:text-sm font-medium">Hôm nay</CardTitle>
            <div className="p-2 rounded-xl bg-success/10">
              <Activity className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-success" />
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 pt-0">
            <div className="text-2xl sm:text-3xl font-bold">{stats.todayCalories.toLocaleString()}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
              / {stats.targetCalories.toLocaleString()} kcal
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift transition-smooth bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3 p-4 sm:p-5">
            <CardTitle className="text-xs sm:text-sm font-medium">Tuần này</CardTitle>
            <div className="p-2 rounded-xl bg-warning/10">
              <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-warning" />
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 pt-0">
            <div className="text-2xl sm:text-3xl font-bold">{stats.weekCalories.toLocaleString()}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Tổng 7 ngày</p>
          </CardContent>
        </Card>
      </div>

      {/* Calorie Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Tiến độ calo hôm nay
          </CardTitle>
          <CardDescription>
            Theo dõi lượng calo đã nạp so với mục tiêu
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{stats.todayCalories.toLocaleString()} kcal</span>
              <span className="text-muted-foreground">
                {Math.round(calorieProgress)}% mục tiêu
              </span>
            </div>
            <Progress value={Math.min(calorieProgress, 100)} className="h-2" />
          </div>
          
          {calorieProgress > 100 && (
            <Badge variant="destructive">Vượt mục tiêu {Math.round(calorieProgress - 100)}%</Badge>
          )}
          {calorieProgress >= 80 && calorieProgress <= 100 && (
            <Badge className="bg-success">Đạt mục tiêu!</Badge>
          )}
          {calorieProgress < 80 && (
            <Badge variant="secondary">Còn {stats.targetCalories - stats.todayCalories} kcal</Badge>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Hoạt động gần đây
            </CardTitle>
            <CardDescription>
              Các bữa ăn được ghi nhận gần nhất
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Apple className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Chưa có hoạt động nào</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex-1">
                      <p className="font-medium">{log.tenthucpham || 'Bữa ăn'}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.ngayghinhan).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{log.calo} kcal</p>
                      <p className="text-xs text-muted-foreground">
                        P: {log.dam}g | C: {log.carb}g | F: {log.chat}g
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hành động nhanh</CardTitle>
            <CardDescription>
              Các tính năng thường dùng
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button onClick={() => navigate('/my-nutrition')} className="w-full justify-start text-xs sm:text-sm" variant="outline" size="sm">
              <Activity className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Ghi nhận bữa ăn
            </Button>
            <Button onClick={() => navigate('/')} className="w-full justify-start text-xs sm:text-sm" variant="outline" size="sm">
              <Apple className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Quét thực phẩm
            </Button>
            <Button onClick={() => navigate('/recipes')} className="w-full justify-start text-xs sm:text-sm" variant="outline" size="sm">
              <ChefHat className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Duyệt công thức
            </Button>
            <Button onClick={() => navigate('/my-meal-plans')} className="w-full justify-start text-xs sm:text-sm" variant="outline" size="sm">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Xem thực đơn
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
