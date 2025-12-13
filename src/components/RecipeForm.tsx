import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useRecipeAnalyzer } from '@/hooks/useRecipeAnalyzer';
import { useIngredients, Ingredient } from '@/hooks/useIngredients';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { ChefHat, Plus, X, Zap, Heart, Clock, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


interface RecipeIngredient {
  nguyenlieuid: string | null;
  ten: string;
  soluong: string;
  donvi: string;
}

export const RecipeForm = ({ 
  onRecipeCreated, 
  initialRecipe 
}: { 
  onRecipeCreated?: () => void;
  initialRecipe?: any;
}) => {
  const isEditMode = !!initialRecipe;
  const { user } = useAuth();
  const { analyzeRecipe, loading: analyzing } = useRecipeAnalyzer();
  const { getAllIngredients, searchIngredients } = useIngredients();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
  const [ingredientSuggestions, setIngredientSuggestions] = useState<Ingredient[]>([]);
  const [searchingIndex, setSearchingIndex] = useState<number | null>(null);

  const [recipe, setRecipe] = useState({
    ten: '',
    mota: '',
    thoigianchuanbi: 0,
    thoigiannau: 0,
    khauphan: 1,
    dokho: '',
    huongdan: '',
    congkhai: false,
    tongcalo: 0,
    tongdam: 0,
    tongcarb: 0,
    tongchat: 0
  });

  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([
    { nguyenlieuid: null, ten: '', soluong: '', donvi: '' }
  ]);

  useEffect(() => {
    const loadIngredients = async () => {
      const data = await getAllIngredients();
      setAllIngredients(data);
      setIngredientSuggestions(data);
    };
    loadIngredients();

    // Load initial recipe data if in edit mode
    if (initialRecipe) {
      setRecipe({
        ten: initialRecipe.ten || '',
        mota: initialRecipe.mota || '',
        thoigianchuanbi: initialRecipe.thoigianchuanbi || 0,
        thoigiannau: initialRecipe.thoigiannau || 0,
        khauphan: initialRecipe.khauphan || 1,
        dokho: initialRecipe.dokho || '',
        huongdan: Array.isArray(initialRecipe.huongdan) 
          ? initialRecipe.huongdan.flat().join('\n') 
          : initialRecipe.huongdan || '',
        congkhai: initialRecipe.congkhai || false,
        tongcalo: initialRecipe.tongcalo || 0,
        tongdam: initialRecipe.tongdam || 0,
        tongcarb: initialRecipe.tongcarb || 0,
        tongchat: initialRecipe.tongchat || 0
      });

      // Load ingredients for edit mode
      loadRecipeIngredients(initialRecipe.id);
    }
  }, [initialRecipe]);

  const loadRecipeIngredients = async (recipeId: string) => {
    try {
      const { data, error } = await supabase
        .from('NguyenLieuCongThuc')
        .select('nguyenlieuid, soluong, donvi')
        .eq('congthucid', recipeId);

      if (error) throw error;

      if (data && data.length > 0) {
        // Load ingredient names separately
        const ingredientIds = data.map(item => item.nguyenlieuid).filter(Boolean);
        const { data: ingredientData } = await supabase
          .from('NguyenLieu')
          .select('id, ten')
          .in('id', ingredientIds);

        const ingredientMap = new Map(
          ingredientData?.map(ing => [ing.id, ing.ten]) || []
        );

        const loadedIngredients = data.map(item => ({
          nguyenlieuid: item.nguyenlieuid,
          ten: item.nguyenlieuid ? ingredientMap.get(item.nguyenlieuid) || '' : '',
          soluong: item.soluong?.toString() || '',
          donvi: item.donvi || ''
        }));
        setIngredients(loadedIngredients);
      }
    } catch (error) {
      console.error('Error loading recipe ingredients:', error);
    }
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { nguyenlieuid: null, ten: '', soluong: '', donvi: '' }]);
  };

  const updateIngredient = (index: number, field: keyof RecipeIngredient, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };

  const handleIngredientSearch = async (index: number, value: string) => {
    updateIngredient(index, 'ten', value);
    setSearchingIndex(index);
    
    if (value.trim()) {
      const results = await searchIngredients(value);
      setIngredientSuggestions(results);
    } else {
      setIngredientSuggestions(allIngredients);
    }
  };

  const handleIngredientFocus = (index: number) => {
    setSearchingIndex(index);
    if (!ingredients[index].ten.trim()) {
      setIngredientSuggestions(allIngredients);
    }
  };

  const selectIngredient = (index: number, ingredient: Ingredient) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = {
      ...newIngredients[index],
      nguyenlieuid: ingredient.id,
      ten: ingredient.ten
    };
    setIngredients(newIngredients);
    setIngredientSuggestions([]);
    setSearchingIndex(null);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleAnalyzeRecipe = async () => {
    const ingredientList = ingredients
      .filter(i => i.ten.trim())
      .map(i => `${i.ten} ${i.soluong} ${i.donvi}`.trim());
    
    const recipeText = `
Tên món: ${recipe.ten}
Mô tả: ${recipe.mota}
Nguyên liệu: ${ingredientList.join(', ')}
Cách làm: ${recipe.huongdan}
Khẩu phần: ${recipe.khauphan} người
Thời gian chuẩn bị: ${recipe.thoigianchuanbi} phút
Thời gian nấu: ${recipe.thoigiannau} phút
    `.trim();

    const result = await analyzeRecipe(
      recipeText,
      ingredientList,
      recipe.ten
    );

    if (result) {
      setAnalysis(result);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Lỗi",
        description: "Vui lòng đăng nhập để tạo công thức",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const recipePayload = {
        ten: recipe.ten,
        mota: recipe.mota,
        thoigianchuanbi: recipe.thoigianchuanbi,
        thoigiannau: recipe.thoigiannau,
        khauphan: recipe.khauphan,
        dokho: recipe.dokho,
        huongdan: [recipe.huongdan.split('\n').filter((step: string) => step.trim())],
        congkhai: recipe.congkhai,
        nguoitao: user.id,
        tongcalo: recipe.tongcalo || analysis?.nutrition?.calories || 0,
        tongdam: recipe.tongdam || analysis?.nutrition?.protein || 0,
        tongcarb: recipe.tongcarb || analysis?.nutrition?.carbohydrates || 0,
        tongchat: recipe.tongchat || analysis?.nutrition?.fat || 0
      };

      let recipeData;

      if (isEditMode && initialRecipe) {
        // Update existing recipe
        const { data, error: recipeError } = await supabase
          .from('CongThuc')
          .update(recipePayload)
          .eq('id', initialRecipe.id)
          .select()
          .single();

        if (recipeError) throw recipeError;
        recipeData = data;

        // Delete old ingredients
        await supabase
          .from('NguyenLieuCongThuc')
          .delete()
          .eq('congthucid', initialRecipe.id);
      } else {
        // Create new recipe
        const { data, error: recipeError } = await supabase
          .from('CongThuc')
          .insert(recipePayload)
          .select()
          .single();

        if (recipeError) throw recipeError;
        recipeData = data;
      }

      // Insert ingredients into NguyenLieuCongThuc
      const validIngredients = ingredients.filter(i => i.ten.trim() && i.soluong);
      if (validIngredients.length > 0) {
        const ingredientInserts = validIngredients.map(ing => ({
          congthucid: recipeData.id,
          nguyenlieuid: ing.nguyenlieuid,
          soluong: parseFloat(ing.soluong) || 0,
          donvi: ing.donvi || 'gram'
        }));

        const { error: ingredientsError } = await supabase
          .from('NguyenLieuCongThuc')
          .insert(ingredientInserts);

        if (ingredientsError) {
          console.error('Error inserting ingredients:', ingredientsError);
        }
      }

      toast({
        title: "Thành công!",
        description: isEditMode ? "Công thức đã được cập nhật thành công" : "Công thức đã được tạo thành công"
      });

      if (!isEditMode) {
        // Reset form only for create mode
        setRecipe({
        ten: '',
        mota: '',
        thoigianchuanbi: 0,
        thoigiannau: 0,
        khauphan: 1,
        dokho: '',
        huongdan: '',
        congkhai: false,
        tongcalo: 0,
        tongdam: 0,
        tongcarb: 0,
        tongchat: 0
      });
      setIngredients([{ nguyenlieuid: null, ten: '', soluong: '', donvi: '' }]);
      setAnalysis(null);
      }
      
      onRecipeCreated?.();
    } catch (error) {
      console.error('Error creating recipe:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo công thức. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <ChefHat className="w-4 h-4 sm:w-5 sm:h-5" />
            {isEditMode ? 'Chỉnh sửa công thức' : 'Tạo Công Thức Mới'}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {isEditMode ? 'Cập nhật thông tin công thức của bạn' : 'Chia sẻ công thức nấu ăn của bạn với cộng đồng'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên món ăn</Label>
                <Input
                  id="name"
                  value={recipe.ten}
                  onChange={(e) => setRecipe({...recipe, ten: e.target.value})}
                  placeholder="Nhập tên món ăn"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Độ khó</Label>
                <Select onValueChange={(value) => setRecipe({...recipe, dokho: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn độ khó" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Dễ</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="hard">Khó</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={recipe.mota}
                onChange={(e) => setRecipe({...recipe, mota: e.target.value})}
                placeholder="Mô tả ngắn về món ăn"
                rows={3}
              />
            </div>

            {/* Time and Servings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prep_time">Thời gian chuẩn bị (phút)</Label>
                <Input
                  id="prep_time"
                  type="number"
                  value={recipe.thoigianchuanbi || ''}
                  onChange={(e) => setRecipe({...recipe, thoigianchuanbi: parseInt(e.target.value) || 0})}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cook_time">Thời gian nấu (phút)</Label>
                <Input
                  id="cook_time"
                  type="number"
                  value={recipe.thoigiannau || ''}
                  onChange={(e) => setRecipe({...recipe, thoigiannau: parseInt(e.target.value) || 0})}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="servings">Số khẩu phần</Label>
                <Input
                  id="servings"
                  type="number"
                  value={recipe.khauphan || ''}
                  onChange={(e) => setRecipe({...recipe, khauphan: parseInt(e.target.value) || 1})}
                  min="1"
                />
              </div>
            </div>

            {/* Nutrition Information */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">Thông tin dinh dưỡng (tổng)</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="calories">Calo (kcal)</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={recipe.tongcalo || ''}
                    onChange={(e) => setRecipe({...recipe, tongcalo: parseFloat(e.target.value) || 0})}
                    placeholder="0"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    value={recipe.tongdam || ''}
                    onChange={(e) => setRecipe({...recipe, tongdam: parseFloat(e.target.value) || 0})}
                    placeholder="0"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    value={recipe.tongcarb || ''}
                    onChange={(e) => setRecipe({...recipe, tongcarb: parseFloat(e.target.value) || 0})}
                    placeholder="0"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fat">Chất béo (g)</Label>
                  <Input
                    id="fat"
                    type="number"
                    value={recipe.tongchat || ''}
                    onChange={(e) => setRecipe({...recipe, tongchat: parseFloat(e.target.value) || 0})}
                    placeholder="0"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <div className="space-y-2">
              <Label className="text-sm sm:text-base">Nguyên liệu</Label>
              <div className="space-y-2">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="space-y-2 p-2 sm:p-3 border rounded-lg">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="flex-1 relative">
                        <Input
                          value={ingredient.ten}
                          onChange={(e) => handleIngredientSearch(index, e.target.value)}
                          onFocus={() => handleIngredientFocus(index)}
                          placeholder="Chọn nguyên liệu..."
                          className="text-sm sm:text-base"
                        />
                        {searchingIndex === index && ingredientSuggestions.length > 0 && (
                          <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-48 sm:max-h-60 overflow-y-auto">
                            {ingredientSuggestions.map((suggestion) => (
                              <div
                                key={suggestion.id}
                                onClick={() => selectIngredient(index, suggestion)}
                                className="px-2 sm:px-3 py-2 hover:bg-accent cursor-pointer text-xs sm:text-sm transition-colors"
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
                      {ingredients.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeIngredient(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        value={ingredient.soluong}
                        onChange={(e) => updateIngredient(index, 'soluong', e.target.value)}
                        placeholder="Số lượng"
                        step="0.1"
                      />
                      <Input
                        value={ingredient.donvi}
                        onChange={(e) => updateIngredient(index, 'donvi', e.target.value)}
                        placeholder="Đơn vị (gram, ml, ...)"
                      />
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addIngredient}
                  className="gap-2 w-full"
                >
                  <Plus className="w-4 h-4" />
                  Thêm nguyên liệu
                </Button>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-2">
              <Label htmlFor="instructions">Cách làm</Label>
              <Textarea
                id="instructions"
                value={recipe.huongdan}
                onChange={(e) => setRecipe({...recipe, huongdan: e.target.value})}
                placeholder="Nhập từng bước thực hiện, mỗi bước một dòng"
                rows={6}
              />
            </div>

            {/* Public Option */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_public"
                checked={recipe.congkhai}
                onChange={(e) => setRecipe({...recipe, congkhai: e.target.checked})}
              />
              <Label htmlFor="is_public">Chia sẻ công khai</Label>
            </div>

            {/* Analysis Button */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleAnalyzeRecipe}
                disabled={analyzing || !recipe.ten || ingredients.filter(i => i.ten.trim()).length === 0}
                className="gap-2"
              >
                {analyzing ? (
                  <Zap className="w-4 h-4 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                Phân tích AI
              </Button>
              <Button type="submit" disabled={loading} className="gap-2">
                <Plus className="w-4 h-4" />
                {loading ? (isEditMode ? 'Đang cập nhật...' : 'Đang tạo...') : (isEditMode ? 'Cập nhật công thức' : 'Tạo công thức')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Phân Tích AI
              </span>
              <Badge className={`${analysis.healthScore >= 80 ? 'bg-green-500' : analysis.healthScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'} text-white`}>
                Điểm sức khỏe: {analysis.healthScore}/100
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Nutrition */}
            <div>
              <h4 className="font-semibold mb-2">Thông tin dinh dưỡng (mỗi khẩu phần)</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-secondary rounded-lg">
                  <div className="text-lg font-bold text-orange-600">
                    {Math.round(analysis.nutrition.calories / recipe.khauphan)}
                  </div>
                  <div className="text-sm text-muted-foreground">Calories</div>
                </div>
                <div className="text-center p-3 bg-secondary rounded-lg">
                  <div className="text-lg font-bold text-green-600">
                    {Math.round(analysis.nutrition.protein / recipe.khauphan)}g
                  </div>
                  <div className="text-sm text-muted-foreground">Protein</div>
                </div>
                <div className="text-center p-3 bg-secondary rounded-lg">
                  <div className="text-lg font-bold text-blue-600">
                    {Math.round(analysis.nutrition.carbohydrates / recipe.khauphan)}g
                  </div>
                  <div className="text-sm text-muted-foreground">Carbs</div>
                </div>
                <div className="text-center p-3 bg-secondary rounded-lg">
                  <div className="text-lg font-bold text-purple-600">
                    {Math.round(analysis.nutrition.fat / recipe.khauphan)}g
                  </div>
                  <div className="text-sm text-muted-foreground">Fat</div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Benefits and Improvements */}
            <div className="grid md:grid-cols-2 gap-4">
              {analysis.benefits.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-green-600 mb-1">Lợi ích:</h5>
                  <ul className="text-sm space-y-1">
                    {analysis.benefits.map((benefit: string, index: number) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-green-500">•</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {analysis.improvements.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-blue-600 mb-1">Gợi ý cải thiện:</h5>
                  <ul className="text-sm space-y-1">
                    {analysis.improvements.map((improvement: string, index: number) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-blue-500">•</span>
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {analysis.cookingTips.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Mẹo nấu ăn</h4>
                  <ul className="text-sm space-y-1">
                    {analysis.cookingTips.map((tip: string, index: number) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-yellow-500">💡</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};