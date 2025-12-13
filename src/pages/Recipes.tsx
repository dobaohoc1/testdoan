import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { RecipeForm } from "@/components/RecipeForm";
import { ChefHat, Search, Clock, Users, Plus, Heart, BookOpen, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRecipes } from "@/hooks/useRecipes";
import { PullToRefresh } from "@/components/PullToRefresh";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
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
  congkhai: boolean;
  taoluc: string;
  nguoitao: string;
}

const Recipes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { deleteRecipe } = useRecipes();
  const isMobile = useIsMobile();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<'all' | 'my' | 'public'>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [recipeToEdit, setRecipeToEdit] = useState<Recipe | null>(null);

  useEffect(() => {
    fetchRecipes();
  }, [filter]);

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase.from('CongThuc').select('*');

      if (filter === 'my' && user) {
        query = query.eq('nguoitao', user.id);
      } else if (filter === 'public') {
        query = query.eq('congkhai', true);
      }

      const { data, error } = await query.order('taoluc', { ascending: false });

      if (error) throw error;
      setRecipes(data || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách công thức",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [filter, user, toast]);

  const handleRefresh = useCallback(async () => {
    await fetchRecipes();
  }, [fetchRecipes]);

  const handleDeleteClick = (recipeId: string) => {
    setRecipeToDelete(recipeId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!recipeToDelete) return;

    const success = await deleteRecipe(recipeToDelete);
    if (success) {
      await fetchRecipes();
      toast({
        title: "Thành công",
        description: "Đã xóa công thức thành công"
      });
    }
    setDeleteDialogOpen(false);
    setRecipeToDelete(null);
  };

  const handleEditClick = (recipe: Recipe) => {
    setRecipeToEdit(recipe);
    setEditDialogOpen(true);
  };

  const isMyRecipe = (recipe: Recipe) => {
    return user && recipe.nguoitao === user.id;
  };

  const filteredRecipes = recipes.filter(recipe =>
    recipe.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.mota?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'easy': case 'dễ': return 'bg-green-500';
      case 'medium': case 'vừa': return 'bg-yellow-500';
      case 'hard': case 'khó': return 'bg-red-500';
      default: return 'bg-gray-500';
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

  if (loading) {
    return <div className="flex items-center justify-center h-64">Đang tải...</div>;
  }

  const content = (
    <div className="space-y-6 pb-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-background p-6 sm:p-8 border border-border/50">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-2xl bg-primary/20 backdrop-blur-sm">
              <ChefHat className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
              Công Thức Nấu Ăn
            </h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground ml-[52px]">
            Khám phá và chia sẻ công thức yêu thích
          </p>
        </div>
      </div>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-muted/30 backdrop-blur-sm">
          <TabsTrigger 
            value="browse" 
            className="gap-2 text-sm sm:text-base py-3 sm:py-3.5 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Duyệt</span>
          </TabsTrigger>
          <TabsTrigger 
            value="create" 
            className="gap-2 text-sm sm:text-base py-3 sm:py-3.5 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Tạo Mới</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4 sm:space-y-6">

      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
          <Input
            placeholder="Tìm kiếm công thức..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 sm:pl-12 h-12 sm:h-14 rounded-2xl border-border/50 bg-background/50 backdrop-blur-sm text-sm sm:text-base"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            className="rounded-xl whitespace-nowrap min-w-fit"
          >
            Tất cả
          </Button>
          {user && (
            <Button
              variant={filter === 'my' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('my')}
              className="rounded-xl whitespace-nowrap min-w-fit"
            >
              Của tôi
            </Button>
          )}
          <Button
            variant={filter === 'public' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('public')}
            className="rounded-xl whitespace-nowrap min-w-fit"
          >
            Công khai
          </Button>
        </div>
      </div>

      {filteredRecipes.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-16 px-4">
            <div className="p-4 rounded-full bg-muted/30 mb-4">
              <ChefHat className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-center">Không tìm thấy công thức nào</h3>
            <p className="text-sm sm:text-base text-muted-foreground text-center mb-6 max-w-md">
              {searchTerm ? 
                "Thử tìm kiếm với từ khóa khác hoặc tạo công thức mới phù hợp với nhu cầu của bạn." :
                "Chưa có công thức nào. Hãy tạo công thức đầu tiên và chia sẻ với cộng đồng!"
              }
            </p>
            <Button className="gap-2 rounded-xl h-11 px-6" size="lg">
              <Plus className="w-4 h-4" />
              Tạo công thức mới
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecipes.map((recipe) => (
            <Card 
              key={recipe.id} 
              className="group hover-lift transition-smooth overflow-hidden bg-gradient-to-br from-card to-card/50 backdrop-blur-sm"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base sm:text-lg line-clamp-2 mb-1.5">
                      {recipe.ten}
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm line-clamp-2">
                      {recipe.mota}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <Badge 
                      className={`${getDifficultyColor(recipe.dokho)} text-white text-[10px] sm:text-xs px-2 py-0.5`}
                    >
                      {getDifficultyText(recipe.dokho)}
                    </Badge>
                    {recipe.congkhai && (
                      <Badge variant="outline" className="text-[10px] sm:text-xs px-2 py-0.5">
                        Công khai
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Time and Servings */}
                <div className="flex items-center justify-between text-xs sm:text-sm bg-muted/30 rounded-xl p-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="p-1 rounded-lg bg-background/80">
                      <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
                    </div>
                    <span className="font-medium">{(recipe.thoigianchuanbi || 0) + (recipe.thoigiannau || 0)} phút</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="p-1 rounded-lg bg-background/80">
                      <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
                    </div>
                    <span className="font-medium">{recipe.khauphan || 1} phần</span>
                  </div>
                </div>

                {/* Nutrition Info */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-muted/20 rounded-xl p-2.5 space-y-1">
                    <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">Calo</span>
                    <div className="text-sm sm:text-base font-bold text-primary">{recipe.tongcalo || 0}</div>
                  </div>
                  <div className="bg-muted/20 rounded-xl p-2.5 space-y-1">
                    <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">Protein</span>
                    <div className="text-sm sm:text-base font-bold">{recipe.tongdam || 0}g</div>
                  </div>
                  <div className="bg-muted/20 rounded-xl p-2.5 space-y-1">
                    <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">Carbs</span>
                    <div className="text-sm sm:text-base font-bold">{recipe.tongcarb || 0}g</div>
                  </div>
                  <div className="bg-muted/20 rounded-xl p-2.5 space-y-1">
                    <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">Chất béo</span>
                    <div className="text-sm sm:text-base font-bold">{recipe.tongchat || 0}g</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-1">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="flex-1 rounded-xl h-9 text-xs sm:text-sm"
                    onClick={() => window.location.href = `/recipe/${recipe.id}`}
                  >
                    Xem chi tiết
                  </Button>
                  {isMyRecipe(recipe) && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="rounded-xl h-9 px-3"
                        onClick={() => handleEditClick(recipe)}
                      >
                        <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="rounded-xl h-9 px-3 hover:bg-destructive/10 hover:border-destructive"
                        onClick={() => handleDeleteClick(recipe.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-destructive" />
                      </Button>
                    </>
                  )}
                  {!isMyRecipe(recipe) && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="rounded-xl h-9 px-3 hover:bg-accent"
                    >
                      <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
        </TabsContent>

        <TabsContent value="create">
          <RecipeForm onRecipeCreated={() => {
            fetchRecipes();
            toast({
              title: "Thành công!",
              description: "Công thức mới đã được tạo"
            });
          }} />
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa công thức này không? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa công thức</DialogTitle>
          </DialogHeader>
          {recipeToEdit && (
            <RecipeForm 
              initialRecipe={recipeToEdit}
              onRecipeCreated={() => {
                fetchRecipes();
                setEditDialogOpen(false);
                setRecipeToEdit(null);
                toast({
                  title: "Thành công!",
                  description: "Đã cập nhật công thức"
                });
              }} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );

  // Wrap with PullToRefresh on mobile
  if (isMobile) {
    return (
      <PullToRefresh onRefresh={handleRefresh} className="h-full">
        {content}
      </PullToRefresh>
    );
  }

  return content;
};

export default Recipes;