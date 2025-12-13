import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Search, Apple, Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { useIngredients, Ingredient } from '@/hooks/useIngredients';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from '@/hooks/useUserRole';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Ingredients = () => {
  const { getAllIngredients, searchIngredients } = useIngredients();
  const { isAdmin } = useUserRole();
  const { toast } = useToast();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
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
    loadIngredients();
  }, []);

  const loadIngredients = async () => {
    setLoading(true);
    const data = await getAllIngredients();
    setIngredients(data);
    setLoading(false);
  };

  const handleSearch = async (value: string) => {
    setSearchTerm(value);
    if (value.trim()) {
      const results = await searchIngredients(value);
      setIngredients(results);
    } else {
      loadIngredients();
    }
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
  };

  const handleAdd = async () => {
    if (!formData.ten.trim()) {
      toast({
        title: "Lỗi",
        description: "Tên nguyên liệu không được để trống",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase.from('NguyenLieu').insert({
        ten: formData.ten,
        calo100g: formData.calo100g ? parseFloat(formData.calo100g) : null,
        dam100g: formData.dam100g ? parseFloat(formData.dam100g) : null,
        carb100g: formData.carb100g ? parseFloat(formData.carb100g) : null,
        chat100g: formData.chat100g ? parseFloat(formData.chat100g) : null,
        xo100g: formData.xo100g ? parseFloat(formData.xo100g) : null,
        duong100g: formData.duong100g ? parseFloat(formData.duong100g) : null,
        natri100g: formData.natri100g ? parseFloat(formData.natri100g) : null
      });

      if (error) throw error;

      toast({
        title: "Thành công!",
        description: "Đã thêm nguyên liệu mới"
      });

      setShowAddDialog(false);
      resetForm();
      loadIngredients();
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể thêm nguyên liệu",
        variant: "destructive"
      });
    }
  };

  const handleEdit = async () => {
    if (!selectedIngredient || !formData.ten.trim()) return;

    try {
      const { error } = await supabase
        .from('NguyenLieu')
        .update({
          ten: formData.ten,
          calo100g: formData.calo100g ? parseFloat(formData.calo100g) : null,
          dam100g: formData.dam100g ? parseFloat(formData.dam100g) : null,
          carb100g: formData.carb100g ? parseFloat(formData.carb100g) : null,
          chat100g: formData.chat100g ? parseFloat(formData.chat100g) : null,
          xo100g: formData.xo100g ? parseFloat(formData.xo100g) : null,
          duong100g: formData.duong100g ? parseFloat(formData.duong100g) : null,
          natri100g: formData.natri100g ? parseFloat(formData.natri100g) : null
        })
        .eq('id', selectedIngredient.id);

      if (error) throw error;

      toast({
        title: "Thành công!",
        description: "Đã cập nhật nguyên liệu"
      });

      setShowEditDialog(false);
      setSelectedIngredient(null);
      resetForm();
      loadIngredients();
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể cập nhật nguyên liệu",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedIngredient) return;

    try {
      const { error } = await supabase
        .from('NguyenLieu')
        .delete()
        .eq('id', selectedIngredient.id);

      if (error) throw error;

      toast({
        title: "Thành công!",
        description: "Đã xóa nguyên liệu"
      });

      setShowDeleteDialog(false);
      setSelectedIngredient(null);
      loadIngredients();
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xóa nguyên liệu. Có thể đang được sử dụng trong công thức.",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
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
    setShowEditDialog(true);
  };

  const openDeleteDialog = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setShowDeleteDialog(true);
  };

  const formatNumber = (num: number | null) => {
    if (num === null) return '-';
    return num.toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent/20 via-accent/10 to-background p-6 sm:p-8 border border-border/50">
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-2xl bg-accent/20 backdrop-blur-sm">
                  <Apple className="w-6 h-6 sm:w-7 sm:h-7 text-accent-foreground" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
                  Nguyên Liệu
                </h1>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground ml-[52px]">
                {ingredients.length} nguyên liệu với thông tin dinh dưỡng chi tiết
              </p>
            </div>
            {isAdmin && (
              <Button 
                onClick={() => setShowAddDialog(true)} 
                className="gap-2 rounded-xl h-10 sm:h-11 shrink-0"
                size="sm"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Thêm</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Tìm kiếm & Quản lý</CardTitle>
          <CardDescription className="text-sm">
            Tra cứu thông tin dinh dưỡng của các nguyên liệu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
            <Input
              placeholder="Tìm kiếm nguyên liệu..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-11 sm:pl-12 h-12 sm:h-14 rounded-2xl border-border/50 bg-background/50 backdrop-blur-sm"
            />
          </div>

          {/* Mobile Card Layout */}
          <div className="block md:hidden space-y-3">
            {ingredients.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? 'Không tìm thấy nguyên liệu nào' : 'Chưa có nguyên liệu'}
              </div>
            ) : (
              ingredients.map((ingredient) => (
                <Card key={ingredient.id} className="overflow-hidden hover-scale">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-base">{ingredient.ten}</h3>
                      {isAdmin && (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => openEditDialog(ingredient)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => openDeleteDialog(ingredient)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between p-2 rounded-lg bg-accent/10">
                        <span className="text-muted-foreground">Calo:</span>
                        <Badge variant="outline" className="font-mono text-xs">
                          {formatNumber(ingredient.calo100g)}
                        </Badge>
                      </div>
                      <div className="flex justify-between p-2 rounded-lg bg-accent/10">
                        <span className="text-muted-foreground">Protein:</span>
                        <span className="font-medium">{formatNumber(ingredient.dam100g)}g</span>
                      </div>
                      <div className="flex justify-between p-2 rounded-lg bg-accent/10">
                        <span className="text-muted-foreground">Carbs:</span>
                        <span className="font-medium">{formatNumber(ingredient.carb100g)}g</span>
                      </div>
                      <div className="flex justify-between p-2 rounded-lg bg-accent/10">
                        <span className="text-muted-foreground">Chất béo:</span>
                        <span className="font-medium">{formatNumber(ingredient.chat100g)}g</span>
                      </div>
                      <div className="flex justify-between p-2 rounded-lg bg-accent/10">
                        <span className="text-muted-foreground">Chất xơ:</span>
                        <span className="font-medium">{formatNumber(ingredient.xo100g)}g</span>
                      </div>
                      <div className="flex justify-between p-2 rounded-lg bg-accent/10">
                        <span className="text-muted-foreground">Đường:</span>
                        <span className="font-medium">{formatNumber(ingredient.duong100g)}g</span>
                      </div>
                      <div className="flex justify-between p-2 rounded-lg bg-accent/10 col-span-2">
                        <span className="text-muted-foreground">Natri:</span>
                        <span className="font-medium">{formatNumber(ingredient.natri100g)}mg</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden md:block rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Tên nguyên liệu</TableHead>
                  <TableHead className="text-right">Calo (100g)</TableHead>
                  <TableHead className="text-right">Protein (g)</TableHead>
                  <TableHead className="text-right">Carbs (g)</TableHead>
                  <TableHead className="text-right">Chất béo (g)</TableHead>
                  <TableHead className="text-right">Chất xơ (g)</TableHead>
                  <TableHead className="text-right">Đường (g)</TableHead>
                  <TableHead className="text-right">Natri (mg)</TableHead>
                  {isAdmin && <TableHead className="text-center w-[120px]">Thao tác</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {ingredients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 9 : 8} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? 'Không tìm thấy nguyên liệu nào' : 'Chưa có nguyên liệu'}
                    </TableCell>
                  </TableRow>
                ) : (
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
                      <TableCell className="text-right">{formatNumber(ingredient.duong100g)}</TableCell>
                      <TableCell className="text-right">{formatNumber(ingredient.natri100g)}</TableCell>
                      {isAdmin && (
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
                              onClick={() => openDeleteDialog(ingredient)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm nguyên liệu mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin dinh dưỡng cho 100g nguyên liệu
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <div className="sm:col-span-2">
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
            <Button variant="outline" onClick={() => { setShowAddDialog(false); resetForm(); }}>
              <X className="w-4 h-4 mr-2" />
              Hủy
            </Button>
            <Button onClick={handleAdd}>
              <Check className="w-4 h-4 mr-2" />
              Thêm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa nguyên liệu</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin dinh dưỡng cho 100g nguyên liệu
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <div className="sm:col-span-2">
              <Label htmlFor="edit-ten">Tên nguyên liệu *</Label>
              <Input
                id="edit-ten"
                value={formData.ten}
                onChange={(e) => setFormData({ ...formData, ten: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-calo100g">Calo (kcal)</Label>
              <Input
                id="edit-calo100g"
                type="number"
                step="0.1"
                value={formData.calo100g}
                onChange={(e) => setFormData({ ...formData, calo100g: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-dam100g">Protein (g)</Label>
              <Input
                id="edit-dam100g"
                type="number"
                step="0.1"
                value={formData.dam100g}
                onChange={(e) => setFormData({ ...formData, dam100g: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-carb100g">Carbs (g)</Label>
              <Input
                id="edit-carb100g"
                type="number"
                step="0.1"
                value={formData.carb100g}
                onChange={(e) => setFormData({ ...formData, carb100g: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-chat100g">Chất béo (g)</Label>
              <Input
                id="edit-chat100g"
                type="number"
                step="0.1"
                value={formData.chat100g}
                onChange={(e) => setFormData({ ...formData, chat100g: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-xo100g">Chất xơ (g)</Label>
              <Input
                id="edit-xo100g"
                type="number"
                step="0.1"
                value={formData.xo100g}
                onChange={(e) => setFormData({ ...formData, xo100g: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-duong100g">Đường (g)</Label>
              <Input
                id="edit-duong100g"
                type="number"
                step="0.1"
                value={formData.duong100g}
                onChange={(e) => setFormData({ ...formData, duong100g: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-natri100g">Natri (mg)</Label>
              <Input
                id="edit-natri100g"
                type="number"
                step="0.1"
                value={formData.natri100g}
                onChange={(e) => setFormData({ ...formData, natri100g: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowEditDialog(false); resetForm(); }}>
              <X className="w-4 h-4 mr-2" />
              Hủy
            </Button>
            <Button onClick={handleEdit}>
              <Check className="w-4 h-4 mr-2" />
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa nguyên liệu "{selectedIngredient?.ten}"?
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Ingredients;
