import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MoreHorizontal, Search, ChefHat, Eye, Trash2, Globe, Lock } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface Recipe {
  id: string;
  ten: string;
  mota: string | null;
  tongcalo: number | null;
  khauphan: number | null;
  congkhai: boolean;
  taoluc: string;
  nguoitao: string | null;
}

const RecipeManagement = () => {
  const { toast } = useToast();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteRecipeId, setDeleteRecipeId] = useState<string | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchRecipes();
  }, [currentPage]);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      let query = supabase
        .from('CongThuc')
        .select(`
          id,
          ten,
          mota,
          tongcalo,
          khauphan,
          congkhai,
          taoluc,
          nguoitao
        `, { count: 'exact' })
        .order('taoluc', { ascending: false })
        .range(from, to);

      if (searchTerm) {
        query = query.ilike('ten', `%${searchTerm}%`);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      setRecipes(data || []);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
    } catch (error: any) {
      console.error('Error fetching recipes:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách công thức",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchRecipes();
  };

  const handleDeleteRecipe = async () => {
    if (!deleteRecipeId) return;

    try {
      const { error } = await supabase
        .from('CongThuc')
        .delete()
        .eq('id', deleteRecipeId);

      if (error) throw error;

      toast({
        title: "Thành công",
        description: "Đã xóa công thức"
      });

      fetchRecipes();
    } catch (error: any) {
      console.error('Error deleting recipe:', error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa công thức",
        variant: "destructive"
      });
    } finally {
      setDeleteRecipeId(null);
    }
  };

  const handleTogglePublic = async (recipeId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('CongThuc')
        .update({ congkhai: !currentStatus })
        .eq('id', recipeId);

      if (error) throw error;

      toast({
        title: "Thành công",
        description: `Đã ${!currentStatus ? 'công khai' : 'ẩn'} công thức`
      });

      fetchRecipes();
    } catch (error: any) {
      console.error('Error updating recipe:', error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái công thức",
        variant: "destructive"
      });
    }
  };

  if (loading && recipes.length === 0) {
    return <div className="flex items-center justify-center h-64">Đang tải...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="w-5 h-5" />
            Quản lý công thức
          </CardTitle>
          <CardDescription>
            Quản lý tất cả công thức nấu ăn trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm công thức..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-9"
                />
              </div>
              <Button onClick={handleSearch}>
                Tìm kiếm
              </Button>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên công thức</TableHead>
                    <TableHead>Người tạo</TableHead>
                    <TableHead>Calories</TableHead>
                    <TableHead>Khẩu phần</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recipes.length > 0 ? (
                    recipes.map((recipe) => (
                      <TableRow key={recipe.id}>
                        <TableCell className="font-medium">{recipe.ten}</TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {recipe.nguoitao ? `ID: ${recipe.nguoitao.substring(0, 8)}...` : 'N/A'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{recipe.tongcalo || 'N/A'} kcal</TableCell>
                        <TableCell>{recipe.khauphan || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant={recipe.congkhai ? "default" : "secondary"}>
                            {recipe.congkhai ? (
                              <><Globe className="w-3 h-3 mr-1" />Công khai</>
                            ) : (
                              <><Lock className="w-3 h-3 mr-1" />Riêng tư</>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(recipe.taoluc).toLocaleDateString('vi-VN')}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => window.open(`/recipes/${recipe.id}`, '_blank')}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Xem chi tiết
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleTogglePublic(recipe.id, recipe.congkhai)}
                              >
                                {recipe.congkhai ? (
                                  <><Lock className="w-4 h-4 mr-2" />Đặt riêng tư</>
                                ) : (
                                  <><Globe className="w-4 h-4 mr-2" />Công khai</>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => setDeleteRecipeId(recipe.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Xóa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        Không tìm thấy công thức nào
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Trang {currentPage} / {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Trước
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Sau
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteRecipeId} onOpenChange={() => setDeleteRecipeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa công thức này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRecipe} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RecipeManagement;
