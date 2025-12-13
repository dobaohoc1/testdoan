import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Plus, Search, ChefHat, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useMealCategories } from "@/hooks/useMealCategories";

interface Recipe {
  id: string;
  ten: string;
  mota: string;
  tongcalo: number;
  tongdam: number;
  tongcarb: number;
  tongchat: number;
  anhdaidien?: string;
}

interface SelectedRecipeWithCategory extends Recipe {
  selectedCategory?: string;
}

const CreateMealPlan = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { categories } = useMealCategories();
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecipes, setSelectedRecipes] = useState<SelectedRecipeWithCategory[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    targetCalories: "2000"
  });

  useEffect(() => {
    if (user) {
      fetchRecipes();
    }
  }, [user]);

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('CongThuc')
        .select('id, ten, mota, tongcalo, tongdam, tongcarb, tongchat, anhdaidien')
        .or(`nguoitao.eq.${user?.id},congkhai.eq.true`)
        .order('taoluc', { ascending: false });

      if (error) throw error;
      setRecipes(data || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const toggleRecipe = (recipe: Recipe) => {
    const existingIndex = selectedRecipes.findIndex(r => r.id === recipe.id);
    if (existingIndex !== -1) {
      setSelectedRecipes(selectedRecipes.filter(r => r.id !== recipe.id));
    } else {
      setSelectedRecipes([...selectedRecipes, { ...recipe, selectedCategory: categories[0]?.id }]);
    }
  };

  const updateRecipeCategory = (recipeId: string, categoryId: string) => {
    setSelectedRecipes(selectedRecipes.map(r => 
      r.id === recipeId ? { ...r, selectedCategory: categoryId } : r
    ));
  };

  const handleCreateMealPlan = async () => {
    if (!user) return;

    if (!formData.name) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập tên thực đơn",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Create meal plan
      const { data: mealPlan, error: mealPlanError } = await supabase
        .from('KeHoachBuaAn')
        .insert({
          nguoidungid: user.id,
          ten: formData.name,
          mota: formData.description,
          ngaybatdau: formData.startDate,
          ngayketthuc: formData.endDate,
          muctieucalo: formData.targetCalories ? parseInt(formData.targetCalories) : null,
        })
        .select()
        .single();

      if (mealPlanError) throw mealPlanError;

      // Add meal plan items
      if (selectedRecipes.length > 0) {
        const mealPlanItems = selectedRecipes.map(recipe => ({
          kehoachid: mealPlan.id,
          congthucid: recipe.id,
          danhmucid: recipe.selectedCategory || null,
          ngaydukien: formData.startDate,
          khauphan: 1,
        }));

        const { error: itemsError } = await supabase
          .from('MonAnKeHoach')
          .insert(mealPlanItems);

        if (itemsError) throw itemsError;
      }

      toast({
        title: "Tạo thành công! 🎉",
        description: `Thực đơn "${formData.name}" đã được tạo`
      });

      navigate(`/meal-plan/${mealPlan.id}`);
    } catch (error) {
      console.error('Error creating meal plan:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo thực đơn. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredRecipes = recipes.filter(recipe =>
    recipe.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.mota?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCalories = selectedRecipes.reduce((sum, recipe) => sum + recipe.tongcalo, 0);

  return (
    <div className="space-y-6 pb-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-background p-6 sm:p-8 border border-border/50">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-2xl bg-primary/20 backdrop-blur-sm">
              <Calendar className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
              Tạo Thực Đơn Mới
            </h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground ml-[52px]">
            Lập kế hoạch bữa ăn từ các công thức có sẵn
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Thông tin thực đơn</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Điền thông tin cơ bản cho thực đơn của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="name" className="text-xs sm:text-sm">Tên thực đơn *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="VD: Thực đơn giảm cân tuần 1"
                  className="text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="description" className="text-xs sm:text-sm">Mô tả</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Mô tả ngắn về thực đơn..."
                  rows={3}
                  className="text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="startDate" className="text-xs sm:text-sm">Ngày bắt đầu</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="text-xs sm:text-sm"
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="endDate" className="text-xs sm:text-sm">Ngày kết thúc</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="targetCalories" className="text-xs sm:text-sm">Mục tiêu calo hàng ngày</Label>
                <Input
                  id="targetCalories"
                  type="number"
                  value={formData.targetCalories}
                  onChange={(e) => setFormData({...formData, targetCalories: e.target.value})}
                  className="text-xs sm:text-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* Recipe Selection */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Chọn công thức</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Tìm và thêm các món ăn vào thực đơn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm công thức..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-2 max-h-64 sm:max-h-96 overflow-y-auto">
                {filteredRecipes.length === 0 ? (
                  <div className="text-center py-6 sm:py-8">
                    <ChefHat className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-xs sm:text-sm text-muted-foreground">Không tìm thấy công thức nào</p>
                  </div>
                ) : (
                  filteredRecipes.map((recipe) => {
                    const isSelected = selectedRecipes.find(r => r.id === recipe.id);
                    return (
                      <Card
                        key={recipe.id}
                        onClick={() => toggleRecipe(recipe)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                        }`}
                      >
                        <CardContent className="p-3 sm:pt-4 sm:pb-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-xs sm:text-sm truncate">{recipe.ten}</CardTitle>
                              <CardDescription className="text-[10px] sm:text-xs line-clamp-1">
                                {recipe.mota}
                              </CardDescription>
                            </div>
                            <Badge variant="secondary" className="text-[10px] sm:text-xs flex-shrink-0">
                              {recipe.tongcalo} cal
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Tổng quan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">Số món ăn đã chọn</p>
                <p className="text-2xl sm:text-3xl font-bold">{selectedRecipes.length}</p>
              </div>

              <div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">Tổng calo</p>
                <p className="text-2xl sm:text-3xl font-bold">{totalCalories.toLocaleString()}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">kcal</p>
              </div>

              <Button 
                onClick={handleCreateMealPlan} 
                disabled={loading || !formData.name}
                className="w-full gap-2 text-xs sm:text-sm"
                size="sm"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                {loading ? "Đang tạo..." : "Tạo thực đơn"}
              </Button>
            </CardContent>
          </Card>

          {selectedRecipes.length > 0 && (
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg">Món ăn đã chọn</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-1.5 sm:space-y-2">
                  {selectedRecipes.map(recipe => (
                    <div key={recipe.id} className="space-y-2 py-1.5 sm:py-2 border-b last:border-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs sm:text-sm truncate">{recipe.ten}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRecipe(recipe)}
                          className="flex-shrink-0"
                        >
                          <X className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                      {categories.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Label className="text-xs text-muted-foreground">Danh mục:</Label>
                          <Select
                            value={recipe.selectedCategory || categories[0]?.id}
                            onValueChange={(value) => updateRecipeCategory(recipe.id, value)}
                          >
                            <SelectTrigger className="h-7 text-xs flex-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id} className="text-xs">
                                  {cat.ten}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateMealPlan;
