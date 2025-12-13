import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Shield, 
  Search, 
  RefreshCw,
  CheckCircle,
  XCircle
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

interface UserRole {
  id: string;
  nguoidungid: string;
  vaitro: 'admin' | 'user';
  taoluc: string;
  hoten?: string;
  email?: string;
}

const RoleManagement = () => {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserRole | null>(null);
  const [newRole, setNewRole] = useState<'admin' | 'user'>('user');
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  const fetchUserRoles = async () => {
    setLoading(true);
    try {
      // Fetch user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('VaiTroNguoiDung')
        .select('id, nguoidungid, vaitro, taoluc')
        .order('taoluc', { ascending: false });

      if (rolesError) throw rolesError;

      // Fetch profiles for all users
      const { data: profilesData, error: profilesError } = await supabase
        .from('HoSo')
        .select('nguoidungid, hoten, email');

      if (profilesError) throw profilesError;

      // Merge data
      const mergedData = rolesData.map(role => {
        const profile = profilesData.find(p => p.nguoidungid === role.nguoidungid);
        return {
          ...role,
          hoten: profile?.hoten,
          email: profile?.email
        };
      });

      // Filter by search term if provided
      let filteredData = mergedData;
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredData = mergedData.filter(user => 
          user.hoten?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower)
        );
      }

      const data = filteredData;

      setUserRoles(data || []);
    } catch (error: any) {
      console.error('Error fetching user roles:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách vai trò người dùng",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRoles();
  }, []);

  const handleSearch = () => {
    fetchUserRoles();
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;

    try {
      const { error } = await supabase
        .from('VaiTroNguoiDung')
        .update({ vaitro: newRole })
        .eq('id', selectedUser.id);

      if (error) throw error;

      toast({
        title: "Thành công",
        description: `Đã cập nhật vai trò thành ${newRole === 'admin' ? 'Quản trị viên' : 'Người dùng'}`,
      });

      setShowDialog(false);
      fetchUserRoles();
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể cập nhật vai trò",
        variant: "destructive"
      });
    }
  };

  const openRoleDialog = (user: UserRole) => {
    setSelectedUser(user);
    setNewRole(user.vaitro);
    setShowDialog(true);
  };

  const getRoleBadgeVariant = (role: string) => {
    return role === 'admin' ? 'destructive' : 'default';
  };

  const getRoleLabel = (role: string) => {
    return role === 'admin' ? 'Quản trị viên' : 'Người dùng';
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Quản lý vai trò người dùng
          </CardTitle>
          <CardDescription>
            Chỉnh sửa và quản lý vai trò của người dùng trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Actions */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-9"
              />
            </div>
            <Button onClick={handleSearch} variant="secondary">
              <Search className="w-4 h-4 mr-2" />
              Tìm kiếm
            </Button>
            <Button onClick={fetchUserRoles} variant="outline">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {/* User Roles Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên người dùng</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Vai trò hiện tại</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Đang tải dữ liệu...
                    </TableCell>
                  </TableRow>
                ) : userRoles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Không tìm thấy người dùng nào
                    </TableCell>
                  </TableRow>
                ) : (
                  userRoles.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.hoten || 'N/A'}
                      </TableCell>
                      <TableCell>{user.email || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.vaitro)}>
                          {getRoleLabel(user.vaitro)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(user.taoluc).toLocaleDateString('vi-VN')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openRoleDialog(user)}
                        >
                          Chỉnh sửa vai trò
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-destructive" />
              <div>
                <p className="text-sm font-medium">Quản trị viên</p>
                <p className="text-2xl font-bold">
                  {userRoles.filter(u => u.vaitro === 'admin').length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg">
              <XCircle className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Người dùng</p>
                <p className="text-2xl font-bold">
                  {userRoles.filter(u => u.vaitro === 'user').length}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Update Role Dialog */}
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cập nhật vai trò người dùng</AlertDialogTitle>
            <AlertDialogDescription>
              Thay đổi vai trò cho <strong>{selectedUser?.hoten}</strong> ({selectedUser?.email})
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">Chọn vai trò mới</label>
            <Select value={newRole} onValueChange={(value: 'admin' | 'user') => setNewRole(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Người dùng</SelectItem>
                <SelectItem value="admin">Quản trị viên</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleUpdateRole}>
              Cập nhật
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RoleManagement;
