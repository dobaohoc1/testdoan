import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMealCategories } from "@/hooks/useMealCategories";
import { useUserRole } from "@/hooks/useUserRole";
import { Plus, Edit, Trash2, UtensilsCrossed } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CategoryForm {
  ten: string;
  mota: string;
  thutuhienthi: number;
}

const MealCategories = () => {
  const { toast } = useToast();
  const { categories, loading, refetch } = useMealCategories();
  const { role } = useUserRole();
  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<CategoryForm>({
    ten: "",
    mota: "",
    thutuhienthi: 0,
  });

  useEffect(() => {
    if (!showDialog) {
      setEditingId(null);
      setFormData({ ten: "", mota: "", thutuhienthi: 0 });
    }
  }, [showDialog]);

  const handleEdit = (category: any) => {
    setEditingId(category.id);
    setFormData({
      ten: category.ten,
      mota: category.mota || "",
      thutuhienthi: category.thutuhienthi,
    });
    setShowDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;

    try {
      const { error } = await supabase
        .from("DanhMucBuaAn")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Đã xóa",
        description: "Danh mục đã được xóa thành công",
      });
      refetch();
    } catch (error: any) {
      console.error("Error deleting category:", error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xóa danh mục",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from("DanhMucBuaAn")
          .update({
            ten: formData.ten,
            mota: formData.mota,
            thutuhienthi: formData.thutuhienthi,
          })
          .eq("id", editingId);

        if (error) throw error;

        toast({
          title: "Đã cập nhật",
          description: "Danh mục đã được cập nhật thành công",
        });
      } else {
        const { error } = await supabase
          .from("DanhMucBuaAn")
          .insert({
            ten: formData.ten,
            mota: formData.mota,
            thutuhienthi: formData.thutuhienthi,
          });

        if (error) throw error;

        toast({
          title: "Đã thêm",
          description: "Danh mục mới đã được tạo thành công",
        });
      }

      setShowDialog(false);
      refetch();
    } catch (error: any) {
      console.error("Error saving category:", error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể lưu danh mục",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (role !== "admin") {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Bạn không có quyền truy cập trang này.</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <UtensilsCrossed className="w-8 h-8" />
            Quản lý danh mục bữa ăn
          </h1>
          <p className="text-muted-foreground">Thêm, sửa, xóa các loại bữa ăn</p>
        </div>
        <Button onClick={() => setShowDialog(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Thêm danh mục
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{category.ten}</span>
                <span className="text-sm font-normal text-muted-foreground">
                  #{category.thutuhienthi}
                </span>
              </CardTitle>
              <CardDescription>{category.mota || "Không có mô tả"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(category)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Sửa
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(category.id)}
                  className="flex-1"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Xóa
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
            </DialogTitle>
            <DialogDescription>
              Điền thông tin danh mục bữa ăn
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="ten">Tên danh mục *</Label>
              <Input
                id="ten"
                value={formData.ten}
                onChange={(e) => setFormData({ ...formData, ten: e.target.value })}
                placeholder="Ví dụ: Bữa sáng"
                required
              />
            </div>
            <div>
              <Label htmlFor="mota">Mô tả</Label>
              <Textarea
                id="mota"
                value={formData.mota}
                onChange={(e) => setFormData({ ...formData, mota: e.target.value })}
                placeholder="Mô tả ngắn về danh mục này"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="thutuhienthi">Thứ tự hiển thị *</Label>
              <Input
                id="thutuhienthi"
                type="number"
                value={formData.thutuhienthi}
                onChange={(e) =>
                  setFormData({ ...formData, thutuhienthi: parseInt(e.target.value) || 0 })
                }
                min={0}
                required
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDialog(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Đang lưu..." : editingId ? "Cập nhật" : "Thêm mới"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MealCategories;
