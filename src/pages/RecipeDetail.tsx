import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useIngredients, Ingredient } from "@/hooks/useIngredients";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNutritionLogs } from "@/hooks/useNutritionLogs";
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  ChefHat, 
  Heart, 
  Share2, 
  Bookmark, 
  PlusCircle,
  Edit,
  Trash2,
  Check,
  X,
  Plus
} from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Recipe {
  id: string;
  ten: string;
  mota: string;
  thoigianchuanbi: number;
  thoigiannau: number;
  khauphan: number;
  dokho: string;
  tongcalo: number;
  tongdam: number;
  tongcarb: number;
  tongchat: number;
  huongdan: any;
  anhdaidien: string;
  congkhai: boolean;
  nguoitao: string;
}

interface RecipeIngredient {
  id?: string;
  nguyenlieuid: string | null;
  soluong: number;
  donvi: string;
  NguyenLieu: {
    ten: string;
  } | null;
}

const RecipeDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addNutritionLog, loading: logLoading } = useNutritionLogs();
  const { searchIngredients } = useIngredients();
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [servings, setServings] = useState(1);
  const [isOwner, setIsOwner] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingIngredients, setEditingIngredients] = useState<RecipeIngredient[]>([]);
  const [ingredientSuggestions, setIngredientSuggestions] = useState<Ingredient[]>([]);
  const [searchingIndex, setSearchingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      fetchRecipeDetail();
    }
  }, [id]);

  const fetchRecipeDetail = async () => {
    try {
      const { data: recipeData, error: recipeError } = await supabase
        .from('CongThuc')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (recipeError) throw recipeError;
      
      if (!recipeData) {
        toast({
          title: "Không tìm thấy",
          description: "Công thức này không tồn tại",
          variant: "destructive"
        });
        navigate('/recipes');
        return;
      }

      setRecipe(recipeData);
      setIsOwner(user?.id === recipeData.nguoitao);

      const { data: ingredientsData, error: ingredientsError } = await supabase
        .from('NguyenLieuCongThuc')
        .select(`
          id,
          nguyenlieuid,
          soluong,
          donvi,
          NguyenLieu!NguyenLieuCongThuc_nguyenlieuid_fkey (
            ten
          )
        `)
        .eq('congthucid', id);

      if (ingredientsError) throw ingredientsError;
      setIngredients(ingredientsData || []);
    } catch (error) {
      console.error('Error fetching recipe detail:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin công thức",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'easy': case 'dễ': return 'bg-success';
      case 'medium': case 'vừa': return 'bg-warning';
      case 'hard': case 'khó': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  const getDifficultyText = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'easy': case 'dễ': return 'Dễ';
      case 'medium': case 'vừa': return 'Trung bình';
      case 'hard': case 'khó': return 'Khó';
      default: return 'Chưa xác định';
    }
  };

  const handleAddToLog = async () => {
    if (!recipe) return;

    const result = await addNutritionLog({
      ngayghinhan: format(new Date(), 'yyyy-MM-dd'),
      congthucid: recipe.id,
      tenthucpham: recipe.ten,
      calo: (recipe.tongcalo / recipe.khauphan) * servings,
      dam: (recipe.tongdam / recipe.khauphan) * servings,
      carb: (recipe.tongcarb / recipe.khauphan) * servings,
      chat: (recipe.tongchat / recipe.khauphan) * servings,
      soluong: servings,
      donvi: 'khẩu phần',
      ghichu: `Từ công thức: ${recipe.ten}`
    });

    if (result) {
      toast({
        title: "Thành công! ✅",
        description: "Đã thêm vào nhật ký dinh dưỡng"
      });
    }
  };

  const openEditIngredientsDialog = () => {
    setEditingIngredients([...ingredients]);
    setShowEditDialog(true);
  };

  const handleIngredientSearch = async (index: number, value: string) => {
    const newIngredients = [...editingIngredients];
    newIngredients[index] = { 
      ...newIngredients[index], 
      NguyenLieu: { ten: value }
    };
    setEditingIngredients(newIngredients);
    
    if (value.length > 1) {
      setSearchingIndex(index);
      const results = await searchIngredients(value);
      setIngredientSuggestions(results);
    } else {
      setIngredientSuggestions([]);
      setSearchingIndex(null);
    }
  };

  const selectIngredient = (index: number, ingredient: Ingredient) => {
    const newIngredients = [...editingIngredients];
    newIngredients[index] = {
      ...newIngredients[index],
      nguyenlieuid: ingredient.id,
      NguyenLieu: { ten: ingredient.ten }
    };
    setEditingIngredients(newIngredients);
    setIngredientSuggestions([]);
    setSearchingIndex(null);
  };

  const updateEditingIngredient = (index: number, field: string, value: any) => {
    const newIngredients = [...editingIngredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setEditingIngredients(newIngredients);
  };

  const addEditingIngredient = () => {
    setEditingIngredients([
      ...editingIngredients,
      { nguyenlieuid: null, soluong: 0, donvi: '', NguyenLieu: { ten: '' } }
    ]);
  };

  const removeEditingIngredient = (index: number) => {
    setEditingIngredients(editingIngredients.filter((_, i) => i !== index));
  };

  const saveIngredients = async () => {
    if (!recipe) return;

    try {
      const { error: deleteError } = await supabase
        .from('NguyenLieuCongThuc')
        .delete()
        .eq('congthucid', recipe.id);

      if (deleteError) throw deleteError;

      const validIngredients = editingIngredients.filter(
        ing => ing.NguyenLieu?.ten && ing.soluong > 0
      );

      if (validIngredients.length > 0) {
        const { error: insertError } = await supabase
          .from('NguyenLieuCongThuc')
          .insert(
            validIngredients.map(ing => ({
              congthucid: recipe.id,
              nguyenlieuid: ing.nguyenlieuid,
              soluong: ing.soluong,
              donvi: ing.donvi || 'gram'
            }))
          );

        if (insertError) throw insertError;
      }

      toast({
        title: "Thành công!",
        description: "Đã cập nhật danh sách nguyên liệu"
      });

      setShowEditDialog(false);
      fetchRecipeDetail();
    } catch (error: any) {
      console.error('Error saving ingredients:', error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể cập nhật nguyên liệu",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Đang tải...</div>;
  }

  if (!recipe) {
    return null;
  }

  const totalTime = (recipe.thoigianchuanbi || 0) + (recipe.thoigiannau || 0);
  const instructions = recipe.huongdan ? 
    (Array.isArray(recipe.huongdan) ? recipe.huongdan : [recipe.huongdan]) : 
    [];

  return (
    <div className="space-y-6">
      <Button onClick={() => navigate('/recipes')} variant="outline" size="sm">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Quay lại
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            {recipe.anhdaidien && (
              <div className="w-full h-64 bg-muted rounded-t-lg overflow-hidden">
                <img 
                  src={recipe.anhdaidien} 
                  alt={recipe.ten}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-2">{recipe.ten}</CardTitle>
                  <CardDescription className="text-base">
                    {recipe.mota}
                  </CardDescription>
                </div>
                <Badge className={`${getDifficultyColor(recipe.dokho)} text-white`}>
                  {getDifficultyText(recipe.dokho)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Thời gian</p>
                    <p className="font-semibold">{totalTime} phút</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Khẩu phần</p>
                    <p className="font-semibold">{recipe.khauphan} người</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Độ khó</p>
                    <p className="font-semibold">{getDifficultyText(recipe.dokho)}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Nutrition Info */}
              <div>
                <h3 className="font-semibold mb-3">Thông tin dinh dưỡng (mỗi khẩu phần)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Calo</p>
                    <p className="text-2xl font-bold">{Math.round((recipe.tongcalo || 0) / recipe.khauphan)}</p>
                    <p className="text-xs text-muted-foreground">kcal</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Protein</p>
                    <p className="text-2xl font-bold">{((recipe.tongdam || 0) / recipe.khauphan).toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">gram</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Carbs</p>
                    <p className="text-2xl font-bold">{((recipe.tongcarb || 0) / recipe.khauphan).toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">gram</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Fat</p>
                    <p className="text-2xl font-bold">{((recipe.tongchat || 0) / recipe.khauphan).toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">gram</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Instructions */}
              <div>
                <h3 className="font-semibold mb-3">Hướng dẫn thực hiện</h3>
                {instructions.length > 0 ? (
                  <ol className="space-y-3">
                    {instructions.map((step: any, index: number) => (
                      <li key={index} className="flex gap-3">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                          {index + 1}
                        </span>
                        <p className="flex-1 pt-1">{typeof step === 'string' ? step : step.step || step.description}</p>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-muted-foreground">Chưa có hướng dẫn chi tiết</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Hành động</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-2 mb-4">
                <label className="text-sm font-medium">Số khẩu phần:</label>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setServings(Math.max(1, servings - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-semibold">{servings}</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setServings(servings + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
              <Button 
                className="w-full gap-2" 
                onClick={handleAddToLog}
                disabled={logLoading}
              >
                <PlusCircle className="w-4 h-4" />
                Thêm vào nhật ký
              </Button>
              <Button className="w-full gap-2" variant="outline">
                <Heart className="w-4 h-4" />
                Yêu thích
              </Button>
              <Button className="w-full gap-2" variant="outline">
                <Bookmark className="w-4 h-4" />
                Lưu lại
              </Button>
              <Button className="w-full gap-2" variant="outline">
                <Share2 className="w-4 h-4" />
                Chia sẻ
              </Button>
            </CardContent>
          </Card>

          {/* Ingredients */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Nguyên liệu</CardTitle>
                  <CardDescription>
                    Cho {recipe.khauphan} người
                  </CardDescription>
                </div>
                {isOwner && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openEditIngredientsDialog}
                    className="gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Sửa
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {ingredients.length > 0 ? (
                <ul className="space-y-2">
                  {ingredients.map((ing, index) => (
                    <li key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                      <span>{ing.NguyenLieu?.ten || 'Nguyên liệu không xác định'}</span>
                      <span className="text-muted-foreground font-medium">
                        {ing.soluong} {ing.donvi}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm">Chưa có danh sách nguyên liệu</p>
              )}
            </CardContent>
          </Card>

          {/* Time Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Chi tiết thời gian</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Chuẩn bị:</span>
                <span className="font-medium">{recipe.thoigianchuanbi || 0} phút</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nấu:</span>
                <span className="font-medium">{recipe.thoigiannau || 0} phút</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Tổng:</span>
                <span>{totalTime} phút</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Ingredients Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa nguyên liệu</DialogTitle>
            <DialogDescription>
              Cập nhật danh sách nguyên liệu cho công thức
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {editingIngredients.map((ing, index) => (
              <div key={index} className="space-y-2 p-3 border rounded-lg">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Label>Tên nguyên liệu</Label>
                    <Input
                      value={ing.NguyenLieu?.ten || ''}
                      onChange={(e) => handleIngredientSearch(index, e.target.value)}
                      placeholder="Gõ để tìm kiếm..."
                    />
                    {searchingIndex === index && ingredientSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {ingredientSuggestions.map((suggestion) => (
                          <div
                            key={suggestion.id}
                            onClick={() => selectIngredient(index, suggestion)}
                            className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                          >
                            <div className="font-medium">{suggestion.ten}</div>
                            <div className="text-xs text-muted-foreground">
                              {suggestion.calo100g && `${suggestion.calo100g} calo/100g`}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeEditingIngredient(index)}
                    className="mt-6"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Số lượng</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={ing.soluong}
                      onChange={(e) => updateEditingIngredient(index, 'soluong', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Đơn vị</Label>
                    <Input
                      value={ing.donvi}
                      onChange={(e) => updateEditingIngredient(index, 'donvi', e.target.value)}
                      placeholder="gram, ml, ..."
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addEditingIngredient}
              className="w-full gap-2"
            >
              <Plus className="w-4 h-4" />
              Thêm nguyên liệu
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              <X className="w-4 h-4 mr-2" />
              Hủy
            </Button>
            <Button onClick={saveIngredients}>
              <Check className="w-4 h-4 mr-2" />
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecipeDetail;
