import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ChefHat, 
  Calendar,
  Activity,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnalyticsData {
  overview: {
    totalUsers: number;
    totalRecipes: number;
    totalMealPlans: number;
    totalNutritionLogs: number;
  };
  userGrowth: Array<{
    date: string;
    count: number;
  }>;
  topRecipes: Array<{
    name: string;
    total_calories: number;
    difficulty_level: string;
    created_at: string;
  }>;
  nutritionByCategory: Array<{
    category: string;
    count: number;
    averageCalories: number;
  }>;
  systemHealth: {
    database: string;
    auth: string;
    api: string;
  };
}

const AdminAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-analytics', {
        body: {}
      });

      if (error) {
        throw error;
      }

      setAnalyticsData(data.data);
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể tải dữ liệu phân tích",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (!analyticsData) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          {loading ? (
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Đang tải dữ liệu phân tích...
            </div>
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground mb-4">Không có dữ liệu</p>
              <Button onClick={fetchAnalytics}>Tải lại</Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Phân tích hệ thống
          </h2>
          <p className="text-muted-foreground">
            Thống kê chi tiết và xu hướng sử dụng
          </p>
        </div>
        <Button onClick={fetchAnalytics} disabled={loading} variant="outline">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Người dùng</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {analyticsData.overview.totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Tổng số tài khoản
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Công thức</CardTitle>
            <ChefHat className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {analyticsData.overview.totalRecipes.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Công thức nấu ăn
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thực đơn</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {analyticsData.overview.totalMealPlans.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Kế hoạch dinh dưỡng
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nhật ký</CardTitle>
            <Activity className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {analyticsData.overview.totalNutritionLogs.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Bản ghi dinh dưỡng
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Tăng trưởng người dùng
            </CardTitle>
            <CardDescription>
              Số lượng người dùng mới theo ngày (gần nhất)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {analyticsData.userGrowth.length > 0 ? (
                analyticsData.userGrowth.slice(-10).map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{item.date}</span>
                    <span className="font-medium text-blue-600">+{item.count}</span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">Chưa có dữ liệu</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Nutrition by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Thống kê theo bữa ăn</CardTitle>
            <CardDescription>
              Phân bố nhật ký dinh dưỡng theo loại bữa ăn (7 ngày gần nhất)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.nutritionByCategory.length > 0 ? (
                analyticsData.nutritionByCategory.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">{item.category}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.count} bản ghi
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-orange-600">
                        {item.averageCalories} cal
                      </div>
                      <div className="text-sm text-muted-foreground">
                        TB/bữa ăn
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">Chưa có dữ liệu</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Recipes */}
      <Card>
        <CardHeader>
          <CardTitle>Công thức gần nhất</CardTitle>
          <CardDescription>
            Công thức được tạo gần đây nhất
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyticsData.topRecipes.length > 0 ? (
              analyticsData.topRecipes.slice(0, 6).map((recipe, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">{recipe.name}</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>Calo: {recipe.total_calories}</div>
                    <div>Độ khó: {recipe.difficulty_level}</div>
                    <div>Tạo: {new Date(recipe.created_at).toLocaleDateString('vi-VN')}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                Chưa có công thức nào
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle>Trạng thái hệ thống</CardTitle>
          <CardDescription>
            Tình trạng hoạt động của các dịch vụ chính
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(analyticsData.systemHealth).map(([service, status]) => (
              <div key={service} className="flex items-center justify-between p-4 border rounded-lg">
                <span className="capitalize font-medium">
                  {service === 'database' ? 'Cơ sở dữ liệu' : 
                   service === 'auth' ? 'Xác thực' : 
                   service === 'api' ? 'API Services' : service}
                </span>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  status === 'healthy' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {status === 'healthy' ? 'Hoạt động' : 'Lỗi'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;