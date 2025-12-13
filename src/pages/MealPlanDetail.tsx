import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, Target, UtensilsCrossed, Eye, Trash2, Users, Clock, CheckCircle2 } from "lucide-react";
import { useMealCategories } from "@/hooks/useMealCategories";

interface MealPlan {
  id: string;
  ten: string;
  mota: string;
  ngaybatdau: string;
  ngayketthuc: string;
  muctieucalo: number;
  danghoatdong: boolean;
}

interface MealEntry {
  id: string;
  ngaydukien: string;
  giodukien?: string;
  khauphan: number;
  danhmucid?: string;
  recipe: {
    id: string;
    ten: string;
    mota: string;
    tongcalo: number;
    tongdam: number;
    tongcarb: number;
    tongchat: number;
  };
  category?: {
    id: string;
    ten: string;
    mota: string | null;
  };
}

const MealPlanDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { categories } = useMealCategories();
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [mealEntries, setMealEntries] = useState<MealEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && user) {
      fetchMealPlanDetail();
    }
  }, [id, user]);

  const fetchMealPlanDetail = async () => {
    try {
      // Fetch meal plan
      const { data: planData, error: planError } = await supabase
        .from('KeHoachBuaAn')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (planError) throw planError;
      
      if (!planData) {
        toast({
          title: "Không tìm thấy",
          description: "Thực đơn này không tồn tại hoặc bạn không có quyền truy cập",
          variant: "destructive"
        });
        navigate('/my-meal-plans');
        return;
      }

      setMealPlan(planData);

      // Fetch meal entries with recipe details and category
      const { data: entriesData, error: entriesError } = await supabase
        .from('MonAnKeHoach')
        .select(`
          id,
          ngaydukien,
          giodukien,
          khauphan,
          danhmucid,
          recipe:CongThuc!MonAnKeHoach_congthucid_fkey(id, ten, mota, tongcalo, tongdam, tongcarb, tongchat),
          category:DanhMucBuaAn!MonAnKeHoach_danhmucid_fkey(id, ten, mota)
        `)
        .eq('kehoachid', id)
        .order('ngaydukien', { ascending: true });

      if (entriesError) throw entriesError;
      setMealEntries(entriesData || []);
    } catch (error) {
      console.error('Error fetching meal plan detail:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin thực đơn",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteMealEntry = async (entryId: string) => {
    try {
      const { error } = await supabase
        .from('MonAnKeHoach')
        .delete()
        .eq('id', entryId);

      if (error) throw error;

      setMealEntries(mealEntries.filter(entry => entry.id !== entryId));
      toast({
        title: "Thành công",
        description: "Món ăn đã được xóa"
      });
    } catch (error) {
      console.error('Error deleting meal entry:', error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa món ăn",
        variant: "destructive"
      });
    }
  };

  const logMealToNutrition = async (entry: MealEntry) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('NhatKyDinhDuong')
        .insert({
          nguoidungid: user.id,
          ngayghinhan: entry.ngaydukien,
          congthucid: entry.recipe.id,
          tenthucpham: entry.recipe.ten,
          calo: entry.recipe.tongcalo * entry.khauphan,
          dam: entry.recipe.tongdam * entry.khauphan,
          carb: entry.recipe.tongcarb * entry.khauphan,
          chat: entry.recipe.tongchat * entry.khauphan,
          soluong: entry.khauphan,
          donvi: 'khẩu phần',
          ghichu: `Từ kế hoạch: ${mealPlan?.ten}`
        });

      if (error) throw error;

      toast({
        title: "Đã ghi nhận! ✅",
        description: "Bữa ăn đã được thêm vào nhật ký dinh dưỡng"
      });
    } catch (error) {
      console.error('Error logging meal to nutrition:', error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm vào nhật ký dinh dưỡng",
        variant: "destructive"
      });
    }
  };

  const toggleActivePlan = async () => {
    if (!mealPlan) return;

    try {
      const { error } = await supabase
        .from('KeHoachBuaAn')
        .update({ danghoatdong: !mealPlan.danghoatdong })
        .eq('id', id);

      if (error) throw error;

      setMealPlan({ ...mealPlan, danghoatdong: !mealPlan.danghoatdong });
      toast({
        title: "Thành công",
        description: `Kế hoạch đã được ${!mealPlan.danghoatdong ? 'kích hoạt' : 'tạm dừng'}`,
      });
    } catch (error) {
      console.error('Error toggling plan status:', error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Đang tải...</div>;
  }

  if (!mealPlan) {
    return null;
  }

  const groupedMeals = mealEntries.reduce((acc, entry) => {
    const date = entry.ngaydukien;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, typeof mealEntries>);

  const nutritionSummary = mealEntries.reduce(
    (acc, entry) => ({
      calories: acc.calories + (entry.recipe.tongcalo * entry.khauphan),
      protein: acc.protein + (entry.recipe.tongdam * entry.khauphan),
      carbs: acc.carbs + (entry.recipe.tongcarb * entry.khauphan),
      fiber: acc.fiber + (entry.recipe.tongchat * entry.khauphan),
    }),
    { calories: 0, protein: 0, carbs: 0, fiber: 0 }
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button onClick={() => navigate('/my-meal-plans')} variant="outline" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
      </div>

      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{mealPlan.ten}</h1>
              <p className="text-muted-foreground">{mealPlan.mota}</p>
            </div>
            <Badge variant={mealPlan.danghoatdong ? "default" : "secondary"}>
              {mealPlan.danghoatdong ? "Đang hoạt động" : "Tạm dừng"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Mục tiêu Calo</h3>
              </div>
              <p className="text-2xl font-bold">{mealPlan.muctieucalo} cal/ngày</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Thời gian</h3>
              </div>
              <p className="text-sm">
                {new Date(mealPlan.ngaybatdau).toLocaleDateString('vi-VN')} - 
                {new Date(mealPlan.ngayketthuc).toLocaleDateString('vi-VN')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <UtensilsCrossed className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Tổng bữa ăn</h3>
              </div>
              <p className="text-2xl font-bold">{mealEntries.length}</p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Nutrition Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Tổng hợp dinh dưỡng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Calo</p>
              <p className="text-3xl font-bold">{Math.round(nutritionSummary.calories)}</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Protein</p>
              <p className="text-3xl font-bold">{nutritionSummary.protein.toFixed(1)}g</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Carbs</p>
              <p className="text-3xl font-bold">{nutritionSummary.carbs.toFixed(1)}g</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Chất xơ</p>
              <p className="text-3xl font-bold">{nutritionSummary.fiber.toFixed(1)}g</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meal Entries by Date */}
      <Card>
        <CardHeader>
          <CardTitle>Chi tiết bữa ăn</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(groupedMeals).length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <UtensilsCrossed className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Chưa có bữa ăn nào</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedMeals).map(([date, entries]) => (
                <div key={date} className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {new Date(date).toLocaleDateString('vi-VN', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  
                  {entries.map((entry) => (
                    <Card key={entry.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-lg">{entry.recipe.ten}</h4>
                              {entry.category && (
                                <Badge variant="outline" className="text-xs">
                                  {entry.category.ten}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{entry.recipe.mota}</p>
                            <div className="flex items-center gap-4 text-sm">
                              {entry.giodukien && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {entry.giodukien}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {entry.khauphan} khẩu phần
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => logMealToNutrition(entry)}
                              title="Ghi vào nhật ký dinh dưỡng"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/recipes/${entry.recipe.id}`)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteMealEntry(entry.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-2 pt-4 border-t">
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground mb-1">Calo</p>
                            <p className="font-semibold">{entry.recipe.tongcalo * entry.khauphan}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground mb-1">Protein</p>
                            <p className="font-semibold">{entry.recipe.tongdam * entry.khauphan}g</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground mb-1">Carbs</p>
                            <p className="font-semibold">{entry.recipe.tongcarb * entry.khauphan}g</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground mb-1">Chất xơ</p>
                            <p className="font-semibold">{entry.recipe.tongchat * entry.khauphan}g</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          variant={mealPlan.danghoatdong ? "outline" : "default"}
          onClick={toggleActivePlan}
        >
          {mealPlan.danghoatdong ? "Tạm dừng" : "Kích hoạt"}
        </Button>
      </div>
    </div>
  );
};

export default MealPlanDetail;
