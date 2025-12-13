import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useShoppingLists } from "@/hooks/useShoppingLists";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, ShoppingCart, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function ShoppingList() {
  const { loading, createShoppingList, getMyShoppingLists, addShoppingListItem, updateShoppingListItem, deleteShoppingListItem, deleteShoppingList } = useShoppingLists();
  const { toast } = useToast();
  const [lists, setLists] = useState<any[]>([]);
  const [newListName, setNewListName] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [newItemUnit, setNewItemUnit] = useState("");
  const [selectedList, setSelectedList] = useState<string | null>(null);

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    const data = await getMyShoppingLists();
    setLists(data);
    if (data.length > 0 && !selectedList) {
      setSelectedList(data[0].id);
    }
  };

  const handleCreateList = async () => {
    if (!newListName.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên danh sách",
        variant: "destructive"
      });
      return;
    }

    const result = await createShoppingList(newListName);
    if (result) {
      setNewListName("");
      loadLists();
    }
  };

  const handleAddItem = async () => {
    if (!selectedList || !newItemName.trim() || !newItemQuantity || !newItemUnit.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive"
      });
      return;
    }

    const result = await addShoppingListItem({
      danhsachid: selectedList,
      tennguyenlieu: newItemName,
      soluong: parseFloat(newItemQuantity),
      donvi: newItemUnit,
      damua: false
    });

    if (result) {
      setNewItemName("");
      setNewItemQuantity("");
      setNewItemUnit("");
      loadLists();
    }
  };

  const handleToggleItem = async (itemId: string, currentStatus: boolean) => {
    const result = await updateShoppingListItem(itemId, { damua: !currentStatus });
    if (result) {
      loadLists();
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    const result = await deleteShoppingListItem(itemId);
    if (result) {
      loadLists();
    }
  };

  const handleDeleteList = async (listId: string) => {
    const result = await deleteShoppingList(listId);
    if (result) {
      if (selectedList === listId) {
        setSelectedList(null);
      }
      loadLists();
    }
  };

  const currentList = lists.find(l => l.id === selectedList);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
          Danh sách mua sắm
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Quản lý danh sách mua sắm nguyên liệu của bạn
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Danh sách các list */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Các danh sách
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo danh sách mới
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tạo danh sách mua sắm mới</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <Label>Tên danh sách</Label>
                      <Input
                        placeholder="VD: Mua sắm tuần này"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleCreateList} disabled={loading} className="w-full">
                      Tạo danh sách
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {lists.map((list) => (
                <div
                  key={list.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedList === list.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedList(list.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm sm:text-base">{list.ten}</p>
                      <p className="text-xs text-muted-foreground">
                        {list.items?.length || 0} món
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteList(list.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chi tiết danh sách */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">
              {currentList ? currentList.ten : "Chọn một danh sách"}
            </CardTitle>
            <CardDescription>
              {currentList && `Tạo lúc: ${new Date(currentList.taoluc).toLocaleDateString('vi-VN')}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentList ? (
              <div className="space-y-4">
                {/* Form thêm món mới */}
                <div className="p-4 border rounded-lg bg-muted/30">
                  <h3 className="font-medium mb-3 text-sm sm:text-base">Thêm món mới</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      placeholder="Tên nguyên liệu"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Số lượng"
                        value={newItemQuantity}
                        onChange={(e) => setNewItemQuantity(e.target.value)}
                      />
                      <Input
                        placeholder="Đơn vị"
                        value={newItemUnit}
                        onChange={(e) => setNewItemUnit(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddItem} disabled={loading} className="w-full mt-3">
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm món
                  </Button>
                </div>

                {/* Danh sách các món */}
                <div className="space-y-2">
                  {currentList.items && currentList.items.length > 0 ? (
                    currentList.items.map((item: any) => (
                      <div
                        key={item.id}
                        className={`p-3 border rounded-lg flex items-center justify-between gap-3 ${
                          item.damua ? 'bg-muted/50 opacity-60' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Checkbox
                            checked={item.damua}
                            onCheckedChange={() => handleToggleItem(item.id, item.damua)}
                          />
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium text-sm sm:text-base truncate ${item.damua ? 'line-through' : ''}`}>
                              {item.tennguyenlieu}
                            </p>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {item.soluong} {item.donvi}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <X className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      Chưa có món nào trong danh sách
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Chọn một danh sách để xem chi tiết
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
