import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  Search, 
  UserCheck, 
  UserX, 
  Edit, 
  Trash2, 
  Shield,
  MoreHorizontal,
  RefreshCw
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface User {
  id: string;
  nguoidungid: string;
  hoten: string;
  email: string;
  taoluc: string;
  VaiTroNguoiDung: { vaitro: string };
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<string>("");
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('user-management', {
        body: {
          action: 'list',
          filters: {
            search: searchTerm || undefined,
            role: roleFilter === 'all' ? undefined : roleFilter
          },
          pagination: {
            page: currentPage,
            limit: 10
          }
        }
      });

      if (error) {
        throw error;
      }

      setUsers(data.data.users || []);
      setTotalPages(data.data.pagination.totalPages || 1);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể tải danh sách người dùng",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, roleFilter]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers();
  };

  const handleUserAction = async (userId: string, action: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('user-management', {
        body: {
          action,
          userId
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Thành công",
        description: data.data.message,
      });

      fetchUsers(); // Refresh list
    } catch (error: any) {
      console.error(`Error ${action} user:`, error);
      toast({
        title: "Lỗi",
        description: error.message || `Không thể ${action} người dùng`,
        variant: "destructive"
      });
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedUser || !newRole) return;

    try {
      const { error } = await supabase
        .from('VaiTroNguoiDung')
        .update({ vaitro: newRole as 'admin' | 'user' })
        .eq('nguoidungid', selectedUser.nguoidungid);

      if (error) throw error;

      toast({
        title: "Thành công",
        description: `Đã cập nhật vai trò thành ${newRole === 'admin' ? 'Quản trị viên' : 'Người dùng'}`,
      });

      setShowRoleDialog(false);
      setSelectedUser(null);
      setNewRole("");
      fetchUsers();
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể cập nhật vai trò",
        variant: "destructive"
      });
    }
  };

  const openRoleDialog = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.VaiTroNguoiDung?.vaitro || 'user');
    setShowRoleDialog(true);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'moderator': return 'secondary';
      default: return 'default';
    }
  };
  
  const getRoleLabel = (role: string) => {
    return role === 'admin' ? 'Quản trị viên' : 'Người dùng';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Quản lý người dùng
        </CardTitle>
        <CardDescription>
          Quản lý tài khoản và quyền hạn người dùng trong hệ thống
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex gap-2">
            <Input
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch} variant="outline">
              <Search className="w-4 h-4" />
            </Button>
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Lọc theo vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả vai trò</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchUsers} variant="outline" disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Users Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người dùng</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Đang tải...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Không tìm thấy người dùng nào
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {user.hoten || 'Chưa cập nhật'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ID: {user.nguoidungid.slice(0, 8)}...
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={getRoleBadgeVariant(user.VaiTroNguoiDung?.vaitro)}>
                          {user.VaiTroNguoiDung?.vaitro === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                          {getRoleLabel(user.VaiTroNguoiDung?.vaitro || 'user')}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openRoleDialog(user)}
                          className="h-7 px-2"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(user.taoluc).toLocaleDateString('vi-VN')}
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
                            onClick={() => {
                              // Open edit modal (implement later)
                              toast({
                                title: "Chức năng đang phát triển",
                                description: "Tính năng chỉnh sửa sẽ được bổ sung sau"
                              });
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUserAction(user.nguoidungid, 'ban')}
                            className="text-orange-600"
                          >
                            <UserX className="mr-2 h-4 w-4" />
                            Khóa tài khoản
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUserAction(user.nguoidungid, 'unban')}
                            className="text-green-600"
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            Mở khóa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
                                handleUserAction(user.nguoidungid, 'delete');
                              }
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Trang {currentPage} / {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
              >
                Trước
              </Button>
              <Button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Role Change Dialog */}
      <AlertDialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Thay đổi vai trò người dùng</AlertDialogTitle>
            <AlertDialogDescription>
              Thay đổi vai trò cho người dùng: {selectedUser?.hoten || selectedUser?.email}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Người dùng</SelectItem>
                <SelectItem value="admin">Quản trị viên</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowRoleDialog(false);
              setSelectedUser(null);
              setNewRole("");
            }}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleUpdateRole}>
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default UserManagement;