import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useNutritionAI } from "@/hooks/useNutritionAI";
import { User, Target, Activity, Zap, Sparkles } from "lucide-react";

interface UserProfile {
  hoTen: string;
  tuoi: number;
  chieuCao: number;
  canNang: number;
  gioiTinh: string;
  mucDoHoatDong: string;
  mucTieu: string;
  dinhDuong: string;
  timBenhLy: string;
  thucPhamKhongThich: string;
}

interface NutritionFormProps {
  onSubmit: (profile: UserProfile) => void;
  initialProfile?: UserProfile | null;
}

export const NutritionForm = ({ onSubmit, initialProfile }: NutritionFormProps) => {
  const { getNutritionAdvice, loading } = useNutritionAI();
  const [profile, setProfile] = useState<UserProfile>(initialProfile || {
    hoTen: "",
    tuoi: 0,
    chieuCao: 0,
    canNang: 0,
    gioiTinh: "",
    mucDoHoatDong: "",
    mucTieu: "",
    dinhDuong: "",
    timBenhLy: "",
    thucPhamKhongThich: ""
  });
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert form data to AI format
    const aiProfile = {
      age: profile.tuoi,
      height: profile.chieuCao,
      weight: profile.canNang,
      gender: profile.gioiTinh === 'nam' ? 'male' : 'female',
      activityLevel: profile.mucDoHoatDong,
      healthGoals: profile.mucTieu ? [profile.mucTieu] : [],
      dietaryRestrictions: profile.dinhDuong ? [profile.dinhDuong] : [],
      medicalConditions: profile.timBenhLy ? [profile.timBenhLy] : []
    };

    // Get AI advice
    const advice = await getNutritionAdvice(aiProfile);
    if (advice) {
      setAiAdvice(advice.advice);
    }

    onSubmit(profile);
  };

  const updateProfile = (field: keyof UserProfile, value: string | number) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <Card className="w-full max-w-2xl mx-auto shadow-nutrition animate-fade-in">
      <CardHeader className="text-center nutrition-gradient text-primary-foreground rounded-t-lg">
        <CardTitle className="flex items-center justify-center gap-2 text-lg sm:text-2xl">
          <User className="h-5 w-5 sm:h-6 sm:w-6" />
          Tùy Chỉnh Chi Tiết (Tùy Chọn)
        </CardTitle>
        <CardDescription className="text-primary-foreground/80 text-sm sm:text-base">
          Điền thêm thông tin để AI tạo thực đơn chính xác hơn
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* Thông tin cơ bản - luôn hiển thị */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="hoTen" className="text-sm">Họ và Tên</Label>
              <Input
                id="hoTen"
                value={profile.hoTen}
                onChange={(e) => updateProfile("hoTen", e.target.value)}
                placeholder="Nhập họ và tên"
                className="text-sm sm:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tuoi" className="text-sm">Tuổi</Label>
              <Input
                id="tuoi"
                type="number"
                value={profile.tuoi || ""}
                onChange={(e) => updateProfile("tuoi", parseInt(e.target.value))}
                placeholder="25"
                min="1"
                max="120"
                className="text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="chieuCao" className="text-sm">Chiều cao (cm)</Label>
              <Input
                id="chieuCao"
                type="number"
                value={profile.chieuCao || ""}
                onChange={(e) => updateProfile("chieuCao", parseInt(e.target.value))}
                placeholder="170"
                min="100"
                max="250"
                className="text-sm sm:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="canNang" className="text-sm">Cân nặng (kg)</Label>
              <Input
                id="canNang"
                type="number"
                value={profile.canNang || ""}
                onChange={(e) => updateProfile("canNang", parseInt(e.target.value))}
                placeholder="65"
                min="30"
                max="200"
                className="text-sm sm:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gioiTinh" className="text-sm">Giới tính</Label>
              <Select value={profile.gioiTinh} onValueChange={(value) => updateProfile("gioiTinh", value)}>
                <SelectTrigger className="text-sm sm:text-base">
                  <SelectValue placeholder="Chọn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nam">Nam</SelectItem>
                  <SelectItem value="nu">Nữ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Toggle advanced options */}
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className="w-full text-sm"
          >
            {showAdvancedOptions ? "Ẩn tùy chọn nâng cao" : "Hiển thị tùy chọn nâng cao"}
          </Button>

          {/* Advanced options - ẩn mặc định */}
          {showAdvancedOptions && (
            <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-muted/30 rounded-lg">

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm">
                  <Activity className="h-3 w-3 sm:h-4 sm:w-4" />
                  Mức độ hoạt động
                </Label>
                <Select value={profile.mucDoHoatDong} onValueChange={(value) => updateProfile("mucDoHoatDong", value)}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Chọn mức độ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="it">Ít vận động</SelectItem>
                    <SelectItem value="nhe">Vận động nhẹ</SelectItem>
                    <SelectItem value="vua">Vận động vừa</SelectItem>
                    <SelectItem value="cao">Vận động nhiều</SelectItem>
                    <SelectItem value="ratCao">Vận động rất nhiều</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm">
                  <Target className="h-3 w-3 sm:h-4 sm:w-4" />
                  Mục tiêu
                </Label>
                <Select value={profile.mucTieu} onValueChange={(value) => updateProfile("mucTieu", value)}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Chọn mục tiêu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="giamCan">Giảm cân</SelectItem>
                    <SelectItem value="tangCan">Tăng cân</SelectItem>
                    <SelectItem value="giuCan">Duy trì cân nặng</SelectItem>
                    <SelectItem value="tangCoBap">Tăng cơ bắp</SelectItem>
                    <SelectItem value="sucKhoe">Cải thiện sức khỏe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dinhDuong" className="text-sm">Chế độ dinh dưỡng</Label>
                <Select value={profile.dinhDuong} onValueChange={(value) => updateProfile("dinhDuong", value)}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Chọn chế độ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="binh-thuong">Bình thường</SelectItem>
                    <SelectItem value="chay">Chay</SelectItem>
                    <SelectItem value="keto">Keto</SelectItem>
                    <SelectItem value="paleo">Paleo</SelectItem>
                    <SelectItem value="it-carb">Ít carb</SelectItem>
                    <SelectItem value="it-beo">Ít béo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timBenhLy" className="text-sm">Tình trạng sức khỏe</Label>
                <Textarea
                  id="timBenhLy"
                  value={profile.timBenhLy}
                  onChange={(e) => updateProfile("timBenhLy", e.target.value)}
                  placeholder="Tiểu đường, huyết áp cao..."
                  rows={2}
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thucPhamKhongThich" className="text-sm">Thực phẩm kiêng cử</Label>
                <Textarea
                  id="thucPhamKhongThich"
                  value={profile.thucPhamKhongThich}
                  onChange={(e) => updateProfile("thucPhamKhongThich", e.target.value)}
                  placeholder="Hải sản, thịt đỏ, sữa..."
                  rows={2}
                  className="text-sm"
                />
              </div>
            </div>
          )}

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full nutrition-gradient text-primary-foreground hover:opacity-90 transition-opacity text-sm sm:text-base py-4 sm:py-6"
            >
              {loading ? (
                <>
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                  Đang tạo thực đơn...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Tạo Thực Đơn Chi Tiết
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* AI Advice Display */}
      {aiAdvice && (
        <Card className="mt-6 shadow-nutrition animate-fade-in">
          <CardHeader className="nutrition-gradient text-primary-foreground rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Tư Vấn AI Dinh Dưỡng
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Lời khuyên cá nhân hóa dành cho {profile.hoTen}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-foreground">{aiAdvice}</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};