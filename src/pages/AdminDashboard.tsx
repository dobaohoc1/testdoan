import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { Users, ChefHat, Calendar, Image, BarChart3, Shield, Settings } from "lucide-react";
import { Navigate, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagement from "@/components/admin/UserManagement";
import AdminAnalytics from "@/components/admin/AdminAnalytics";
import RecipeManagement from "@/components/admin/RecipeManagement";
import AdminReports from "@/components/admin/AdminReports";
import RoleManagement from "@/components/admin/RoleManagement";
import IngredientManagement from "@/components/admin/IngredientManagement";
import MealCategories from "@/pages/MealCategories";

interface DashboardStats {
  totalUsers: number;
  totalRecipes: number;
  totalMealPlans: number;
  totalNutritionLogs: number;
  recentUsers: any[];
}

const AdminDashboard = () => {
  const { isAdmin, loading: roleLoading } = useUserRole();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'overview';
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalRecipes: 0,
    totalMealPlans: 0,
    totalNutritionLogs: 0,
    recentUsers: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roleLoading && isAdmin) {
      fetchDashboardStats();
    }
  }, [isAdmin, roleLoading]);

  if (roleLoading) {
    return <div>Đang tải...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const fetchDashboardStats = async () => {
    try {
      // Fetch total users
      const { count: usersCount } = await supabase
        .from('HoSo')
        .select('*', { count: 'exact', head: true });

      // Fetch total recipes
      const { count: recipesCount } = await supabase
        .from('CongThuc')
        .select('*', { count: 'exact', head: true });

      // Fetch total meal plans
      const { count: mealPlansCount } = await supabase
        .from('KeHoachBuaAn')
        .select('*', { count: 'exact', head: true });

      // Fetch total nutrition logs
      const { count: nutritionLogsCount } = await supabase
        .from('NhatKyDinhDuong')
        .select('*', { count: 'exact', head: true });

      // Fetch recent users
      const { data: recentUsers } = await supabase
        .from('HoSo')
        .select('hoten, email, taoluc')
        .order('taoluc', { ascending: false })
        .limit(5);

      setStats({
        totalUsers: usersCount || 0,
        totalRecipes: recipesCount || 0,
        totalMealPlans: mealPlansCount || 0,
        totalNutritionLogs: nutritionLogsCount || 0,
        recentUsers: recentUsers || []
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu dashboard",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8" />
            <span className="hidden sm:inline">Dashboard Quản trị</span>
            <span className="sm:hidden">Quản trị</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            <span className="hidden sm:inline">Tổng quan hệ thống ThucdonAI</span>
            <span className="sm:hidden">Hệ thống ThucdonAI</span>
          </p>
        </div>
        <Badge variant="default" className="text-sm sm:text-lg px-3 py-1 sm:px-4 sm:py-2 w-fit">
          Admin
        </Badge>
      </div>

      <Tabs defaultValue={defaultTab} className="space-y-4 sm:space-y-6">
        {/* Tabs - Wrap on Mobile, No Horizontal Scroll */}
        <TabsList className="flex flex-wrap w-full h-auto justify-start sm:justify-center gap-1 p-1">
          <TabsTrigger value="overview" className="flex-shrink-0 text-xs sm:text-sm px-2 py-1.5 sm:px-3 sm:py-2">
            Tổng quan
          </TabsTrigger>
          <TabsTrigger value="users" className="flex-shrink-0 text-xs sm:text-sm px-2 py-1.5 sm:px-3 sm:py-2">
            Người dùng
          </TabsTrigger>
          <TabsTrigger value="recipes" className="flex-shrink-0 text-xs sm:text-sm px-2 py-1.5 sm:px-3 sm:py-2">
            Công thức
          </TabsTrigger>
          <TabsTrigger value="ingredients" className="flex-shrink-0 text-xs sm:text-sm px-2 py-1.5 sm:px-3 sm:py-2">
            Nguyên liệu
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex-shrink-0 text-xs sm:text-sm px-2 py-1.5 sm:px-3 sm:py-2">
            Danh mục
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex-shrink-0 text-xs sm:text-sm px-2 py-1.5 sm:px-3 sm:py-2">
            Thống kê
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex-shrink-0 text-xs sm:text-sm px-2 py-1.5 sm:px-3 sm:py-2">
            Báo cáo
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex-shrink-0 text-xs sm:text-sm px-2 py-1.5 sm:px-3 sm:py-2">
            Cài đặt
          </TabsTrigger>
        </TabsList>


        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          {/* Stats Cards - Stack on Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Người dùng đã đăng ký
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Công thức nấu ăn</CardTitle>
                <ChefHat className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalRecipes.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Công thức trong hệ thống
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Thực đơn</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalMealPlans.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Thực đơn đã tạo
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nhật ký dinh dưỡng</CardTitle>
                <Image className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalNutritionLogs.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Bản ghi dinh dưỡng
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity - Stack on Mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Người dùng mới</CardTitle>
                <CardDescription className="text-sm">5 người dùng đăng ký gần nhất</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {stats.recentUsers.length > 0 ? (
                    stats.recentUsers.map((user, index) => (
                      <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm sm:text-base truncate">{user.hoten || 'Chưa cập nhật'}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">{user.email}</p>
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground ml-2 flex-shrink-0">
                          <span className="hidden sm:inline">
                            {new Date(user.taoluc).toLocaleDateString('vi-VN')}
                          </span>
                          <span className="sm:hidden">
                            {new Date(user.taoluc).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">Chưa có người dùng nào</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Thao tác nhanh</CardTitle>
                <CardDescription className="text-sm">Các chức năng quản trị thường dùng</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 sm:space-y-3">
                  <Button variant="outline" className="w-full justify-start text-sm sm:text-base h-auto py-2">
                    <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                    Quản lý người dùng
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm sm:text-base h-auto py-2">
                    <ChefHat className="w-4 h-4 mr-2 flex-shrink-0" />
                    Quản lý công thức
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm sm:text-base h-auto py-2">
                    <BarChart3 className="w-4 h-4 mr-2 flex-shrink-0" />
                    Xem thống kê chi tiết
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-sm sm:text-base h-auto py-2"
                    onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
                  >
                    <Shield className="w-4 h-4 mr-2 flex-shrink-0" />
                    Supabase Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>


          {/* System Health - Stack on Mobile */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Trạng thái hệ thống</CardTitle>
              <CardDescription className="text-sm">Tình trạng hoạt động của các dịch vụ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div className="flex items-center justify-between p-3 sm:p-4 border rounded-lg">
                  <span className="text-sm sm:text-base">Database</span>
                  <Badge variant="default" className="bg-green-500 text-xs sm:text-sm">Hoạt động</Badge>
                </div>
                <div className="flex items-center justify-between p-3 sm:p-4 border rounded-lg">
                  <span className="text-sm sm:text-base">Authentication</span>
                  <Badge variant="default" className="bg-green-500 text-xs sm:text-sm">Hoạt động</Badge>
                </div>
                <div className="flex items-center justify-between p-3 sm:p-4 border rounded-lg">
                  <span className="text-sm sm:text-base">API Services</span>
                  <Badge variant="default" className="bg-green-500 text-xs sm:text-sm">Hoạt động</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="recipes">
          <RecipeManagement />
        </TabsContent>

        <TabsContent value="ingredients">
          <IngredientManagement />
        </TabsContent>

        <TabsContent value="categories">
          <MealCategories />
        </TabsContent>

        <TabsContent value="analytics">
          <AdminAnalytics />
        </TabsContent>

        <TabsContent value="reports">
          <AdminReports />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Settings className="w-5 h-5" />
                Cài đặt hệ thống
              </CardTitle>
              <CardDescription className="text-sm">
                Cấu hình và quản lý các thiết lập hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 border rounded-lg">
                  <h3 className="font-medium mb-2 text-sm sm:text-base">Cài đặt bảo mật</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Quản lý các thiết lập bảo mật của hệ thống
                  </p>
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                    Cấu hình bảo mật
                  </Button>
                </div>

                <div className="p-3 sm:p-4 border rounded-lg">
                  <h3 className="font-medium mb-2 text-sm sm:text-base">Backup & Restore</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Sao lưu và khôi phục dữ liệu hệ thống
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm w-full sm:w-auto">
                      Tạo Backup
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm w-full sm:w-auto">
                      Khôi phục
                    </Button>
                  </div>
                </div>

                <div className="p-3 sm:p-4 border rounded-lg">
                  <h3 className="font-medium mb-2 text-sm sm:text-base">API Settings</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Quản lý các thiết lập API và Edge Functions
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs sm:text-sm w-full sm:w-auto"
                    onClick={() => window.open('https://supabase.com/dashboard/project/jytnzvoymseduevwcuyu/functions', '_blank')}
                  >
                    Quản lý Functions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
