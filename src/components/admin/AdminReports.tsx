import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Download, Calendar, TrendingUp, Users, ChefHat, BarChart } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReportData {
  totalUsers: number;
  totalRecipes: number;
  totalMealPlans: number;
  totalNutritionLogs: number;
  newUsersThisMonth: number;
  newRecipesThisMonth: number;
  activeUsers: number;
  topRecipes: Array<{
    name: string;
    count: number;
  }>;
}

const AdminReports = () => {
  const { toast } = useToast();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportPeriod, setReportPeriod] = useState("month");

  useEffect(() => {
    fetchReportData();
  }, [reportPeriod]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const now = new Date();
      let startDate: Date;

      switch (reportPeriod) {
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case "quarter":
          startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
          break;
        case "year":
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      // Fetch total counts
      const [
        { count: totalUsers },
        { count: totalRecipes },
        { count: totalMealPlans },
        { count: totalNutritionLogs },
        { count: newUsers },
        { count: newRecipes }
      ] = await Promise.all([
        supabase.from('HoSo').select('*', { count: 'exact', head: true }),
        supabase.from('CongThuc').select('*', { count: 'exact', head: true }),
        supabase.from('KeHoachBuaAn').select('*', { count: 'exact', head: true }),
        supabase.from('NhatKyDinhDuong').select('*', { count: 'exact', head: true }),
        supabase.from('HoSo').select('*', { count: 'exact', head: true }).gte('taoluc', startDate.toISOString()),
        supabase.from('CongThuc').select('*', { count: 'exact', head: true }).gte('taoluc', startDate.toISOString())
      ]);

      // Fetch active users (users who logged nutrition in the period)
      const { count: activeUsers } = await supabase
        .from('NhatKyDinhDuong')
        .select('nguoidungid', { count: 'exact', head: true })
        .gte('taoluc', startDate.toISOString());

      // Fetch top recipes (most used in meal plans)
      const { data: topRecipesData } = await supabase
        .from('MonAnKeHoach')
        .select(`
          congthucid,
          CongThuc!MonAnKeHoach_congthucid_fkey (ten)
        `)
        .gte('taoluc', startDate.toISOString())
        .limit(50);

      // Count recipe occurrences
      const recipeCounts = (topRecipesData || []).reduce((acc: any, entry: any) => {
        if (entry.CongThuc) {
          const name = entry.CongThuc.ten;
          acc[name] = (acc[name] || 0) + 1;
        }
        return acc;
      }, {});

      const topRecipes = Object.entries(recipeCounts)
        .map(([name, count]) => ({ name, count: count as number }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setReportData({
        totalUsers: totalUsers || 0,
        totalRecipes: totalRecipes || 0,
        totalMealPlans: totalMealPlans || 0,
        totalNutritionLogs: totalNutritionLogs || 0,
        newUsersThisMonth: newUsers || 0,
        newRecipesThisMonth: newRecipes || 0,
        activeUsers: activeUsers || 0,
        topRecipes
      });
    } catch (error: any) {
      console.error('Error fetching report data:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu báo cáo",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = () => {
    if (!reportData) return;

    const reportText = `
BÁO CÁO HỆ THỐNG THUCDONAI
Thời gian: ${new Date().toLocaleDateString('vi-VN')}
Kỳ báo cáo: ${reportPeriod === 'week' ? 'Tuần' : reportPeriod === 'month' ? 'Tháng' : reportPeriod === 'quarter' ? 'Quý' : 'Năm'}

TỔNG QUAN
- Tổng người dùng: ${reportData.totalUsers}
- Tổng công thức: ${reportData.totalRecipes}
- Tổng thực đơn: ${reportData.totalMealPlans}
- Tổng nhật ký dinh dưỡng: ${reportData.totalNutritionLogs}

TĂNG TRƯỞNG
- Người dùng mới: ${reportData.newUsersThisMonth}
- Công thức mới: ${reportData.newRecipesThisMonth}
- Người dùng hoạt động: ${reportData.activeUsers}

CÔNG THỨC PHỔ BIẾN
${reportData.topRecipes.map((recipe, i) => `${i + 1}. ${recipe.name}: ${recipe.count} lần sử dụng`).join('\n')}
    `.trim();

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bao-cao-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Thành công",
      description: "Đã xuất báo cáo"
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Đang tải...</div>;
  }

  if (!reportData) {
    return <div className="text-center text-muted-foreground">Không có dữ liệu báo cáo</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Báo cáo hệ thống
              </CardTitle>
              <CardDescription>
                Tổng hợp và phân tích dữ liệu hoạt động
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={reportPeriod} onValueChange={setReportPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Chọn kỳ báo cáo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Tuần này</SelectItem>
                  <SelectItem value="month">Tháng này</SelectItem>
                  <SelectItem value="quarter">Quý này</SelectItem>
                  <SelectItem value="year">Năm này</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleExportReport} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Xuất báo cáo
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +{reportData.newUsersThisMonth} người mới
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Công thức</CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.totalRecipes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +{reportData.newRecipesThisMonth} công thức mới
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thực đơn</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.totalMealPlans.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Tổng số thực đơn
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Người dùng hoạt động</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Trong kỳ báo cáo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-5 h-5" />
              Công thức phổ biến
            </CardTitle>
            <CardDescription>Top 5 công thức được sử dụng nhiều nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.topRecipes.length > 0 ? (
                reportData.topRecipes.map((recipe, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="w-8 h-8 flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <span className="font-medium">{recipe.name}</span>
                    </div>
                    <Badge>{recipe.count} lần</Badge>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center">Chưa có dữ liệu</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tổng quan hoạt động</CardTitle>
            <CardDescription>Các chỉ số quan trọng trong kỳ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <span className="text-sm font-medium">Tổng nhật ký dinh dưỡng</span>
                <span className="text-2xl font-bold">{reportData.totalNutritionLogs}</span>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <span className="text-sm font-medium">Tỷ lệ người dùng hoạt động</span>
                <span className="text-2xl font-bold">
                  {reportData.totalUsers > 0 
                    ? Math.round((reportData.activeUsers / reportData.totalUsers) * 100) 
                    : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <span className="text-sm font-medium">TB công thức/người dùng</span>
                <span className="text-2xl font-bold">
                  {reportData.totalUsers > 0 
                    ? (reportData.totalRecipes / reportData.totalUsers).toFixed(1) 
                    : 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminReports;
