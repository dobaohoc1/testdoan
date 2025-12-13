import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useShoppingLists } from '@/hooks/useShoppingLists';
import { ShoppingCart, Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ExportButton } from './ExportButton';
import { exportShoppingListPDF, exportShoppingListCSV } from '@/lib/exportUtils';

export const ShoppingListManager = () => {
  const {
    createShoppingList,
    getMyShoppingLists,
    addShoppingListItem,
    getShoppingListItems,
    updateShoppingListItem,
    deleteShoppingList,
    loading
  } = useShoppingLists();

  const [lists, setLists] = useState<any[]>([]);
  const [selectedList, setSelectedList] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [newListName, setNewListName] = useState('');
  const [newItem, setNewItem] = useState({
    tennguyenlieu: '',
    soluong: '',
    donvi: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadLists();
  }, []);

  useEffect(() => {
    if (selectedList) {
      loadItems(selectedList.id);
    }
  }, [selectedList]);

  const loadLists = async () => {
    const data = await getMyShoppingLists();
    setLists(data);
    if (data.length > 0 && !selectedList) {
      setSelectedList(data[0]);
    }
  };

  const loadItems = async (listId: string) => {
    const data = await getShoppingListItems(listId);
    setItems(data);
  };

  const handleCreateList = async () => {
    if (!newListName) return;
    await createShoppingList(newListName);
    setNewListName('');
    setIsDialogOpen(false);
    loadLists();
  };

  const handleAddItem = async () => {
    if (!selectedList || !newItem.tennguyenlieu || !newItem.soluong) return;

    const success = await addShoppingListItem({
      danhsachid: selectedList.id,
      tennguyenlieu: newItem.tennguyenlieu,
      soluong: parseFloat(newItem.soluong),
      donvi: newItem.donvi || 'g'
    });

    if (success) {
      setNewItem({ tennguyenlieu: '', soluong: '', donvi: '' });
      await loadItems(selectedList.id);
    }
  };

  const handleToggleItem = async (itemId: string, isPurchased: boolean) => {
    await updateShoppingListItem(itemId, { damua: !isPurchased });
    loadItems(selectedList.id);
  };

  const handleDeleteList = async (listId: string) => {
    await deleteShoppingList(listId);
    setSelectedList(null);
    loadLists();
  };

  const purchasedCount = items?.filter(i => i.damua).length || 0;
  const progress = items?.length > 0 ? (purchasedCount / items.length) * 100 : 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <ShoppingCart className="h-4 h-4 sm:h-5 sm:w-5" />
                Danh sách mua sắm
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Quản lý danh sách nguyên liệu cần mua</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {selectedList && items.length > 0 && (
                <ExportButton
                  onExportPDF={() => {
                    exportShoppingListPDF({
                      name: selectedList.ten,
                      items: items.map((i: any) => ({
                        name: i.tennguyenlieu,
                        quantity: i.soluong,
                        unit: i.donvi,
                        purchased: i.damua
                      }))
                    });
                  }}
                  onExportCSV={() => {
                    exportShoppingListCSV({
                      name: selectedList.ten,
                      items: items.map((i: any) => ({
                        name: i.tennguyenlieu,
                        quantity: i.soluong,
                        unit: i.donvi,
                        purchased: i.damua
                      }))
                    });
                  }}
                  size="sm"
                />
              )}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto text-sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo danh sách mới
                  </Button>
                </DialogTrigger>
              <DialogContent className="max-w-[95vw] sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-base sm:text-lg">Tạo danh sách mới</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="listName" className="text-sm">Tên danh sách</Label>
                    <Input
                      id="listName"
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      placeholder="Vd: Mua sắm tuần này"
                      className="text-sm"
                    />
                  </div>
                  <Button onClick={handleCreateList} disabled={loading || !newListName} className="w-full sm:w-auto text-sm">
                    Tạo danh sách
                  </Button>
                </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {lists.length === 0 ? (
            <p className="text-center text-muted-foreground py-6 sm:py-8 text-sm">
              Chưa có danh sách nào. Tạo danh sách đầu tiên!
            </p>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 sm:mx-0 sm:px-0">
                {lists.map((list) => (
                  <Button
                    key={list.id}
                    variant={selectedList?.id === list.id ? 'default' : 'outline'}
                    onClick={() => setSelectedList(list)}
                    className="text-xs sm:text-sm whitespace-nowrap"
                    size="sm"
                  >
                    {list.ten}
                  </Button>
                ))}
              </div>

              {selectedList && (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-muted rounded-lg">
                    <div>
                      <div className="font-medium text-sm sm:text-base">{selectedList.ten}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        {purchasedCount}/{items.length} đã mua ({Math.round(progress)}%)
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteList(selectedList.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      <Input
                        placeholder="Tên nguyên liệu"
                        value={newItem.tennguyenlieu}
                        onChange={(e) => setNewItem({ ...newItem, tennguyenlieu: e.target.value })}
                        className="text-sm"
                      />
                      <Input
                        type="number"
                        placeholder="Số lượng"
                        value={newItem.soluong}
                        onChange={(e) => setNewItem({ ...newItem, soluong: e.target.value })}
                        className="text-sm"
                      />
                      <div className="flex gap-2 col-span-1 sm:col-span-2 md:col-span-1">
                        <Input
                          placeholder="Đơn vị"
                          value={newItem.donvi}
                          onChange={(e) => setNewItem({ ...newItem, donvi: e.target.value })}
                          className="text-sm flex-1"
                        />
                        <Button onClick={handleAddItem} disabled={loading} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {!items || items.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4 text-sm">
                          Danh sách trống. Thêm nguyên liệu đầu tiên!
                        </p>
                      ) : (
                        items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border rounded-lg"
                          >
                            <Checkbox
                              checked={item.damua}
                              onCheckedChange={() => handleToggleItem(item.id, item.damua)}
                            />
                            <div className={`flex-1 ${item.damua ? 'line-through text-muted-foreground' : ''}`}>
                              <div className="font-medium text-sm sm:text-base">{item.tennguyenlieu}</div>
                              <div className="text-xs sm:text-sm text-muted-foreground">
                                {item.soluong} {item.donvi}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
