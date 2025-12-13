import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Apple, Search, Plus, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Ingredient {
  id: string;
  ten: string;
  calo100g: number | null;
  dam100g: number | null;
  carb100g: number | null;
  chat100g: number | null;
  xo100g: number | null;
  duong100g: number | null;
  natri100g: number | null;
}

const IngredientManagement = () => {
  const { toast } = useToast();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    ten: '',
    calo100g: '',
    dam100g: '',
    carb100g: '',
    chat100g: '',
    xo100g: '',
    duong100g: '',
    natri100g: ''
  });

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('NguyenLieu')
        .select('*')
        .order('ten', { ascending: true });

      if (searchTerm) {
        query = query.ilike('ten', `%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setIngredients(data || []);
    } catch (error: any) {
      console.error('Error fetching ingredients:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách nguyên liệu",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchIngredients();
  };

  const resetForm = () => {
    setFormData({
      ten: '',
      calo100g: '',
      dam100g: '',
      carb100g: '',
      chat100g: '',
      xo100g: '',
      duong100g: '',
      natri100g: ''
    });
    setEditingId(null);
  };

  const openAddDialog = () => {
    resetForm();
    setShowDialog(true);
  };

  const openEditDialog = (ingredient: Ingredient) => {
    setEditingId(ingredient.id);
    setFormData({
      ten: ingredient.ten,
      calo100g: ingredient.calo100g?.toString() || '',
      dam100g: ingredient.dam100g?.toString() || '',
      carb100g: ingredient.carb100g?.toString() || '',
      chat100g: ingredient.chat100g?.toString() || '',
      xo100g: ingredient.xo100g?.toString() || '',
      duong100g: ingredient.duong100g?.toString() || '',
      natri100g: ingredient.natri100g?.toString() || ''
    });
    setShowDialog(true);
  };

  const handleSubmit = async () => {
    if (!formData.ten.trim()) {
      toast({
        title: "Lỗi",
        description: "Tên nguyên liệu không được để trống",
        variant: "destructive"
      });
      return;
    }

    try {
      const payload = {
        ten: formData.ten,
        calo100g: formData.calo100g ? parseFloat(formData.calo100g) : null,
        dam100g: formData.dam100g ? parseFloat(formData.dam100g) : null,
        carb100g: formData.carb100g ? parseFloat(formData.carb100g) : null,
        chat100g: formData.chat100g ? parseFloat(formData.chat100g) : null,
        xo100g: formData.xo100g ? parseFloat(formData.xo100g) : null,
        duong100g: formData.duong100g ? parseFloat(formData.duong100g) : null,
        natri100g: formData.natri100g ? parseFloat(formData.natri100g) : null
      };

      if (editingId) {
        const { error } = await supabase
          .from('NguyenLieu')
          .update(payload)
          .eq('id', editingId);

        if (error) throw error;

        toast({
          title: "Thành công",
          description: "Đã cập nhật nguyên liệu"
        });
      } else {
        const { error } = await supabase
          .from('NguyenLieu')
          .insert(payload);

        if (error) throw error;

        toast({
          title: "Thành công",
          description: "Đã thêm nguyên liệu mới"
        });
      }

      setShowDialog(false);
      resetForm();
      fetchIngredients();
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể lưu nguyên liệu",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('NguyenLieu')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      toast({
        title: "Thành công",
        description: "Đã xóa nguyên liệu"
      });

      setShowDeleteDialog(false);
      setDeleteId(null);
      fetchIngredients();
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa nguyên liệu. Có thể đang được sử dụng trong công thức.",
        variant: "destructive"
      });
    }
  };

  const formatNumber = (num: number | null) => {
    if (num === null) return '-';
    return num.toFixed(1);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Đang tải...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Apple className="w-5 h-5" />
                Quản lý nguyên liệu
              </CardTitle>
              <CardDescription>
                Quản lý tất cả nguyên liệu và thông tin dinh dưỡng
              </CardDescription>
            </div>
            <Button onClick={openAddDialog} className="gap-2">
              <Plus className="w-4 h-4" />
              Thêm nguyên liệu
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm nguyên liệu..."
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
                    <TableHead>Tên nguyên liệu</TableHead>
                    <TableHead className="text-right">Calo (100g)</TableHead>
                    <TableHead className="text-right">Protein (g)</TableHead>
                    <TableHead className="text-right">Carbs (g)</TableHead>
                    <TableHead className="text-right">Chất béo (g)</TableHead>
                    <TableHead className="text-right">Chất xơ (g)</TableHead>
                    <TableHead className="text-center">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ingredients.length > 0 ? (
                    ingredients.map((ingredient) => (
                      <TableRow key={ingredient.id}>
                        <TableCell className="font-medium">{ingredient.ten}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className="font-mono">
                            {formatNumber(ingredient.calo100g)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{formatNumber(ingredient.dam100g)}</TableCell>
                        <TableCell className="text-right">{formatNumber(ingredient.carb100g)}</TableCell>
                        <TableCell className="text-right">{formatNumber(ingredient.chat100g)}</TableCell>
                        <TableCell className="text-right">{formatNumber(ingredient.xo100g)}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(ingredient)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setDeleteId(ingredient.id);
                                setShowDeleteDialog(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        Không tìm thấy nguyên liệu nào
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Chỉnh sửa nguyên liệu" : "Thêm nguyên liệu mới"}
            </DialogTitle>
            <DialogDescription>
              Nhập thông tin dinh dưỡng cho 100g nguyên liệu
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2">
              <Label htmlFor="ten">Tên nguyên liệu *</Label>
              <Input
                id="ten"
                value={formData.ten}
                onChange={(e) => setFormData({ ...formData, ten: e.target.value })}
                placeholder="Ví dụ: Gạo trắng"
              />
            </div>
            <div>
              <Label htmlFor="calo100g">Calo (kcal)</Label>
              <Input
                id="calo100g"
                type="number"
                step="0.1"
                value={formData.calo100g}
                onChange={(e) => setFormData({ ...formData, calo100g: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="dam100g">Protein (g)</Label>
              <Input
                id="dam100g"
                type="number"
                step="0.1"
                value={formData.dam100g}
                onChange={(e) => setFormData({ ...formData, dam100g: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="carb100g">Carbs (g)</Label>
              <Input
                id="carb100g"
                type="number"
                step="0.1"
                value={formData.carb100g}
                onChange={(e) => setFormData({ ...formData, carb100g: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="chat100g">Chất béo (g)</Label>
              <Input
                id="chat100g"
                type="number"
                step="0.1"
                value={formData.chat100g}
                onChange={(e) => setFormData({ ...formData, chat100g: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="xo100g">Chất xơ (g)</Label>
              <Input
                id="xo100g"
                type="number"
                step="0.1"
                value={formData.xo100g}
                onChange={(e) => setFormData({ ...formData, xo100g: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="duong100g">Đường (g)</Label>
              <Input
                id="duong100g"
                type="number"
                step="0.1"
                value={formData.duong100g}
                onChange={(e) => setFormData({ ...formData, duong100g: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="natri100g">Natri (mg)</Label>
              <Input
                id="natri100g"
                type="number"
                step="0.1"
                value={formData.natri100g}
                onChange={(e) => setFormData({ ...formData, natri100g: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowDialog(false);
                resetForm();
              }}
            >
              Hủy
            </Button>
            <Button onClick={handleSubmit}>
              {editingId ? "Cập nhật" : "Thêm mới"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa nguyên liệu này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default IngredientManagement;
