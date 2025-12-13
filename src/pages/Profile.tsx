import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { User, Heart, Scale, Target, Activity, Upload, Camera, RotateCcw } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { resetOnboardingTour } from "@/components/OnboardingTour";

interface UserProfile {
  hoten: string;
  email: string;
  sodienthoai: string;
  ngaysinh: string;
  gioitinh: string;
  anhdaidien?: string;
}

interface HealthProfile {
  chieucao: number;
  cannang: number;
  mucdohoatdong: string;
  muctieucalohangngay: number;
  muctieusuckhoe: string[];
  tinhtrangsuckhoe: string[];
  diung: string[];
  hanchechedo: string[];
}

const Profile = () => {
  const { user } = useAuth();
  const { role } = useUserRole();
  const { toast } = useToast();
  const { uploadAvatar } = useProfile();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    hoten: "",
    email: "",
    sodienthoai: "",
    ngaysinh: "",
    gioitinh: "",
    anhdaidien: ""
  });
  const [healthProfile, setHealthProfile] = useState<HealthProfile>({
    chieucao: 0,
    cannang: 0,
    mucdohoatdong: "",
    muctieucalohangngay: 0,
    muctieusuckhoe: [],
    tinhtrangsuckhoe: [],
    diung: [],
    hanchechedo: []
  });

  useEffect(() => {
    if (user) {
      fetchProfiles();
    }
  }, [user]);

  const fetchProfiles = async () => {
    if (!user) return;

    try {
      // Fetch user profile - Vietnamese lowercase schema
      const { data: profileData } = await supabase
        .from('HoSo')
        .select('*')
        .eq('nguoidungid', user.id)
        .maybeSingle();

      if (profileData) {
        setProfile({
          hoten: profileData.hoten || "",
          email: profileData.email || user.email || "",
          sodienthoai: profileData.sodienthoai || "",
          ngaysinh: profileData.ngaysinh || "",
          gioitinh: profileData.gioitinh || "",
          anhdaidien: profileData.anhdaidien || ""
        });
      }

      // Fetch health profile - Vietnamese lowercase schema
      const { data: healthData } = await supabase
        .from('HoSoSucKhoe')
        .select('*')
        .eq('nguoidungid', user.id)
        .maybeSingle();

      if (healthData) {
        setHealthProfile({
          chieucao: healthData.chieucao || 0,
          cannang: healthData.cannang || 0,
          mucdohoatdong: healthData.mucdohoatdong || "",
          muctieucalohangngay: healthData.muctieucalohangngay || 0,
          muctieusuckhoe: healthData.muctieusuckhoe || [],
          tinhtrangsuckhoe: healthData.tinhtrangsuckhoe || [],
          diung: healthData.diung || [],
          hanchechedo: healthData.hanchechedo || []
        });
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const handleProfileUpdate = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Update user profile using the hook
      const { error: profileError } = await supabase
        .from('HoSo')
        .update({
          hoten: profile.hoten,
          sodienthoai: profile.sodienthoai,
          ngaysinh: profile.ngaysinh,
          gioitinh: profile.gioitinh,
          capnhatluc: new Date().toISOString()
        })
        .eq('nguoidungid', user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
        throw profileError;
      }

      // Update health profile
      const { error: healthError } = await supabase
        .from('HoSoSucKhoe')
        .update({
          chieucao: healthProfile.chieucao,
          cannang: healthProfile.cannang,
          mucdohoatdong: healthProfile.mucdohoatdong,
          muctieucalohangngay: healthProfile.muctieucalohangngay,
          muctieusuckhoe: healthProfile.muctieusuckhoe,
          tinhtrangsuckhoe: healthProfile.tinhtrangsuckhoe,
          diung: healthProfile.diung,
          hanchechedo: healthProfile.hanchechedo,
          capnhatluc: new Date().toISOString()
        })
        .eq('nguoidungid', user.id);

      if (healthError) {
        console.error('Health profile update error:', healthError);
        throw healthError;
      }

      toast({
        title: "Cập nhật thành công! 🎉",
        description: "Hồ sơ của bạn đã được cập nhật."
      });
      
      // Reload data after successful update
      await fetchProfiles();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Lỗi cập nhật",
        description: error?.message || "Không thể cập nhật hồ sơ. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn file ảnh",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Lỗi",
        description: "Kích thước ảnh tối đa 2MB",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      const avatarUrl = await uploadAvatar(file);
      if (avatarUrl) {
        // Update local state immediately
        setProfile(prev => ({ ...prev, anhdaidien: avatarUrl }));
        // Reload profile data to ensure consistency
        await fetchProfiles();
        // Trigger a window reload event to update AuthButton
        window.dispatchEvent(new Event('profile-updated'));
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 sm:p-6 pb-12">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-background p-6 sm:p-8 border border-border/50">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-2.5 rounded-2xl bg-primary/20 backdrop-blur-sm">
              <User className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
              Hồ Sơ Cá Nhân
            </h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground ml-[52px] mb-3">
            Quản lý thông tin và cài đặt dinh dưỡng
          </p>
          <Badge 
            variant={role === 'admin' ? 'default' : 'secondary'} 
            className="ml-[52px] text-xs"
          >
            {role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
          </Badge>
        </div>
      </div>

      {/* Avatar Upload Section */}
      <Card className="overflow-hidden bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Camera className="w-5 h-5" />
            Ảnh đại diện
          </CardTitle>
          <CardDescription>
            Tải lên ảnh đại diện của bạn (tối đa 2MB)
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center gap-6">
          <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-primary/20 shadow-lg">
            <AvatarImage 
              src={profile.anhdaidien} 
              alt={profile.hoten}
              key={profile.anhdaidien}
            />
            <AvatarFallback className="text-2xl sm:text-4xl bg-primary/10 text-primary font-bold">
              {profile.hoten?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 w-full sm:w-auto text-center sm:text-left">
            <Label htmlFor="avatar-upload" className="cursor-pointer">
              <div className="flex items-center justify-center sm:justify-start gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-smooth w-full sm:w-fit shadow-sm">
                <Upload className="w-4 h-4" />
                {uploading ? "Đang tải lên..." : "Tải lên ảnh mới"}
              </div>
            </Label>
            <Input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={uploading}
              className="hidden"
            />
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              JPG, PNG hoặc WEBP. Tối đa 2MB.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Thông tin cá nhân
            </CardTitle>
            <CardDescription>
              Cập nhật thông tin cơ bản của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hoten">Họ và tên</Label>
              <Input
                id="hoten"
                value={profile.hoten}
                onChange={(e) => setProfile({...profile, hoten: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                disabled
                className="bg-muted"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sodienthoai">Số điện thoại</Label>
              <Input
                id="sodienthoai"
                value={profile.sodienthoai}
                onChange={(e) => setProfile({...profile, sodienthoai: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ngaysinh">Ngày sinh</Label>
              <Input
                id="ngaysinh"
                type="date"
                value={profile.ngaysinh}
                onChange={(e) => setProfile({...profile, ngaysinh: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gioitinh">Giới tính</Label>
              <Select value={profile.gioitinh} onValueChange={(value) => setProfile({...profile, gioitinh: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Nam</SelectItem>
                  <SelectItem value="female">Nữ</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Health Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Thông tin sức khỏe
            </CardTitle>
            <CardDescription>
              Cài đặt chỉ số và mục tiêu sức khỏe
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="chieucao">Chiều cao (cm)</Label>
                <Input
                  id="chieucao"
                  type="number"
                  value={healthProfile.chieucao || ""}
                  onChange={(e) => setHealthProfile({...healthProfile, chieucao: Number(e.target.value)})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cannang">Cân nặng (kg)</Label>
                <Input
                  id="cannang"
                  type="number"
                  value={healthProfile.cannang || ""}
                  onChange={(e) => setHealthProfile({...healthProfile, cannang: Number(e.target.value)})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mucdohoatdong">Mức độ hoạt động</Label>
              <Select value={healthProfile.mucdohoatdong} onValueChange={(value) => setHealthProfile({...healthProfile, mucdohoatdong: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn mức độ hoạt động" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Ít vận động</SelectItem>
                  <SelectItem value="light">Vận động nhẹ</SelectItem>
                  <SelectItem value="moderate">Vận động vừa</SelectItem>
                  <SelectItem value="active">Hoạt động nhiều</SelectItem>
                  <SelectItem value="very_active">Rất hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="muctieucalo">Mục tiêu calo hàng ngày</Label>
              <Input
                id="muctieucalo"
                type="number"
                value={healthProfile.muctieucalohangngay || ""}
                onChange={(e) => setHealthProfile({...healthProfile, muctieucalohangngay: Number(e.target.value)})}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Mục tiêu và hạn chế
          </CardTitle>
          <CardDescription>
            Cài đặt các mục tiêu sức khỏe và hạn chế dinh dưỡng
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="muctieusuckhoe">Mục tiêu sức khỏe (mỗi dòng một mục tiêu)</Label>
            <Textarea
              id="muctieusuckhoe"
              value={healthProfile.muctieusuckhoe.join('\n')}
              onChange={(e) => setHealthProfile({
                ...healthProfile, 
                muctieusuckhoe: e.target.value.split('\n').filter(goal => goal.trim())
              })}
              placeholder="Ví dụ: Giảm cân&#10;Tăng cơ bắp&#10;Cải thiện sức khỏe tim mạch"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="diung">Dị ứng thực phẩm (mỗi dòng một loại)</Label>
            <Textarea
              id="diung"
              value={healthProfile.diung.join('\n')}
              onChange={(e) => setHealthProfile({
                ...healthProfile, 
                diung: e.target.value.split('\n').filter(allergy => allergy.trim())
              })}
              placeholder="Ví dụ: Tôm cua&#10;Lạc&#10;Sữa"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hanchechedo">Hạn chế chế độ ăn (mỗi dòng một loại)</Label>
            <Textarea
              id="hanchechedo"
              value={healthProfile.hanchechedo.join('\n')}
              onChange={(e) => setHealthProfile({
                ...healthProfile, 
                hanchechedo: e.target.value.split('\n').filter(restriction => restriction.trim())
              })}
              placeholder="Ví dụ: Chay&#10;Ít muối&#10;Không đường"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between gap-4">
        <Button 
          variant="outline" 
          onClick={resetOnboardingTour}
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Xem lại hướng dẫn
        </Button>
        <Button onClick={handleProfileUpdate} disabled={loading}>
          {loading ? "Đang cập nhật..." : "Lưu thay đổi"}
        </Button>
      </div>
    </div>
  );
};

export default Profile;