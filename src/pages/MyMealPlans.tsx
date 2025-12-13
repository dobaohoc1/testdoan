import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, ChefHat, Plus, Eye, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { PullToRefresh } from "@/components/PullToRefresh";
import { useIsMobile } from "@/hooks/use-mobile";

interface MealPlan {
  id: string;
  ten: string;
  mota: string;
  ngaybatdau: string;
  ngayketthuc: string;
  muctieucalo: number;
  danghoatdong: boolean;
  taoluc: string;
}

const MyMealPlans = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMealPlans();
    }
  }, [user]);

  // Refresh when page becomes visible (when user navigates back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        fetchMealPlans();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user]);

  const fetchMealPlans = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('KeHoachBuaAn')
        .select('*')
        .eq('nguoidungid', user.id)
        .order('taoluc', { ascending: false });

      if (error) throw error;
      setMealPlans(data || []);
    } catch (error) {
      console.error('Error fetching meal plans:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách thực đơn",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const handleRefresh = useCallback(async () => {
    await fetchMealPlans();
  }, [fetchMealPlans]);

  const deleteMealPlan = async (id: string) => {
    try {
      const { error } = await supabase
        .from('KeHoachBuaAn')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMealPlans(mealPlans.filter(plan => plan.id !== id));
      toast({
        title: "Xóa thành công",
        description: "Thực đơn đã được xóa"
      });
    } catch (error) {
      console.error('Error deleting meal plan:', error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa thực đơn",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Đang tải...</div>;
  }

  const content = (
    <div className="space-y-6 pb-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent/20 via-accent/10 to-background p-6 sm:p-8 border border-border/50">
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-2xl bg-accent/20 backdrop-blur-sm">
                  <Calendar className="w-6 h-6 sm:w-7 sm:h-7 text-accent-foreground" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
                  Thực Đơn Của Tôi
                </h1>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground ml-[52px]">
                Quản lý và theo dõi kế hoạch ăn uống
              </p>
            </div>
            <Button 
              onClick={() => navigate("/create-meal-plan")} 
              className="gap-2 rounded-xl h-10 sm:h-11 shrink-0"
              size="sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Tạo mới</span>
            </Button>
          </div>
        </div>
      </div>

      {mealPlans.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ChefHat className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chưa có thực đơn nào</h3>
            <p className="text-muted-foreground text-center mb-4">
              Bạn chưa tạo thực đơn nào. Hãy bắt đầu tạo thực đơn dinh dưỡng đầu tiên!
            </p>
            <Button onClick={() => navigate("/create-meal-plan")} className="gap-2">
              <Plus className="w-4 h-4" />
              Tạo thực đơn đầu tiên
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mealPlans.map((plan) => (
            <Card 
              key={plan.id} 
              className="group hover-lift transition-smooth overflow-hidden bg-gradient-to-br from-card to-card/50 backdrop-blur-sm"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base sm:text-lg line-clamp-2 mb-1.5">{plan.ten}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm line-clamp-2">
                      {plan.mota}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant={plan.danghoatdong ? "default" : "secondary"}
                    className="text-[10px] sm:text-xs px-2 py-0.5 shrink-0"
                  >
                    {plan.danghoatdong ? "Hoạt động" : "Tạm dừng"}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="space-y-2 bg-muted/20 rounded-xl p-3">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">Mục tiêu calo</span>
                    <span className="font-bold text-primary">{plan.muctieucalo?.toLocaleString() || 'Chưa đặt'}</span>
                  </div>
                  
                  {plan.ngaybatdau && (
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">Bắt đầu</span>
                      <span className="font-medium">{new Date(plan.ngaybatdau).toLocaleDateString('vi-VN')}</span>
                    </div>
                  )}
                  
                  {plan.ngayketthuc && (
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">Kết thúc</span>
                      <span className="font-medium">{new Date(plan.ngayketthuc).toLocaleDateString('vi-VN')}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="flex-1 gap-1.5 rounded-xl h-9"
                    onClick={() => window.location.href = `/meal-plan/${plan.id}`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Xem chi tiết
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="rounded-xl h-9 px-3 hover:bg-destructive/10 hover:border-destructive"
                    onClick={() => deleteMealPlan(plan.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <PullToRefresh onRefresh={handleRefresh} className="h-full">
        {content}
      </PullToRefresh>
    );
  }

  return content;
};

export default MyMealPlans;
