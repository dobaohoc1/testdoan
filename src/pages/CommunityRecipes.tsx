import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Search, Users, TrendingUp, Clock, ChefHat, Eye, Flame, Droplet, Leaf } from "lucide-react";

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
  congkhai: boolean;
  anhdaidien?: string;
  taoluc: string;
}

const CommunityRecipes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');

  useEffect(() => {
    fetchCommunityRecipes();
  }, [sortBy]);

  const fetchCommunityRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('CongThuc')
        .select('*')
        .eq('congkhai', true)
        .order(sortBy === 'recent' ? 'taoluc' : 'taoluc', { ascending: false })
        .limit(50);

      if (error) throw error;
      setRecipes(data || []);
    } catch (error) {
      console.error('Error fetching community recipes:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải công thức cộng đồng",
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
      default: return level;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Đang tải...</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6 sm:w-8 sm:h-8" />
          Công thức cộng đồng
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">Khám phá và học hỏi từ cộng đồng</p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Tìm kiếm công thức..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={sortBy === 'recent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('recent')}
                className="gap-2"
              >
                <Clock className="w-4 h-4" />
                Mới nhất
              </Button>
              <Button
                variant={sortBy === 'popular' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('popular')}
                className="gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Phổ biến
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recipe Grid */}
      {filteredRecipes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ChefHat className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Không tìm thấy công thức nào</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm ? 
                "Thử tìm kiếm với từ khóa khác" :
                "Chưa có công thức công khai nào"
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredRecipes.map((recipe) => (
            <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base sm:text-lg mb-2 line-clamp-2">{recipe.ten}</CardTitle>
                    <CardDescription className="line-clamp-2 text-xs sm:text-sm">
                      {recipe.mota}
                    </CardDescription>
                  </div>
                  {recipe.anhdaidien && (
                    <img 
                      src={recipe.anhdaidien} 
                      alt={recipe.ten}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg ml-3 sm:ml-4 flex-shrink-0"
                    />
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  <Badge variant="outline" className="flex items-center gap-1 text-[10px] sm:text-xs px-2 py-0.5">
                    <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    {recipe.thoigianchuanbi + recipe.thoigiannau} phút
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1 text-[10px] sm:text-xs px-2 py-0.5">
                    <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    {recipe.khauphan} khẩu phần
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`${getDifficultyColor(recipe.dokho)} text-[10px] sm:text-xs px-2 py-0.5`}
                  >
                    <ChefHat className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                    {getDifficultyText(recipe.dokho)}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2 sm:pt-3 border-t">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
                      <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Calories</p>
                      <p className="text-xs sm:text-sm font-semibold">{recipe.tongcalo}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                      <Droplet className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Protein</p>
                      <p className="text-xs sm:text-sm font-semibold">{recipe.tongdam}g</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                      <Leaf className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Carbs</p>
                      <p className="text-xs sm:text-sm font-semibold">{recipe.tongcarb}g</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Fiber</p>
                      <p className="text-xs sm:text-sm font-semibold">{recipe.tongchat}g</p>
                    </div>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full gap-2"
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                >
                  <Eye className="w-3 h-3" />
                  Xem chi tiết
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats Footer */}
      <Card>
        <CardContent className="p-3 sm:p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-bold">{recipes.length}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Công thức công khai</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold">
                {Math.round(recipes.reduce((sum, r) => sum + (r.tongcalo || 0), 0) / recipes.length) || 0}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">Calo trung bình</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold">
                {Math.round(recipes.reduce((sum, r) => 
                  sum + ((r.thoigianchuanbi || 0) + (r.thoigiannau || 0)), 0
                ) / recipes.length) || 0}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">Phút nấu TB</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold">
                {recipes.filter(r => r.dokho?.toLowerCase() === 'easy' || r.dokho?.toLowerCase() === 'dễ').length}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">Công thức dễ</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityRecipes;
