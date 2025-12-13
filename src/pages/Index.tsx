import { useState, useEffect } from "react";
import { NutritionHeader } from "@/components/NutritionHeader";
import { NutritionForm } from "@/components/NutritionForm";
import { MealPlan } from "@/components/MealPlan";
import { AIMealPlanDisplay } from "@/components/AIMealPlanDisplay";
import { FoodScanner } from "@/components/FoodScanner";
import { taoThucDonMau, UserProfile } from "@/data/mockNutritionData";
import { useMealPlanGenerator } from "@/hooks/useMealPlanGenerator";
import { useMealPlans } from "@/hooks/useMealPlans";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Sparkles, ChefHat } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ChatBot } from "@/components/ChatBot";

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'form' | 'plan'>('form');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [mealData, setMealData] = useState<{ mealPlan: any; tongCalo: number } | null>(null);
  const [aiMealPlan, setAiMealPlan] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const { generateMealPlan, loading: generatingPlan } = useMealPlanGenerator();
  const { createMealPlan } = useMealPlans();
  const { getCompleteProfile, updateProfile, updateHealthProfile } = useProfile();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Auto-load user profile on mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const completeProfile = await getCompleteProfile();
        if (completeProfile?.profile || completeProfile?.healthProfile) {
          // Auto-fill form if user has profile data
          const p = completeProfile.profile;
          const hp = completeProfile.healthProfile;
          
          if (p || hp) {
            setUserProfile({
              hoTen: p?.hoten || "",
              tuoi: hp ? Math.floor((Date.now() - new Date(p?.ngaysinh || 0).getTime()) / 31557600000) : 0,
              chieuCao: hp?.chieucao || 0,
              canNang: hp?.cannang || 0,
              gioiTinh: p?.gioitinh || "",
              mucDoHoatDong: hp?.mucdohoatdong || "",
              mucTieu: hp?.muctieusuckhoe?.[0] || "",
              dinhDuong: hp?.hanchechedo?.[0] || "",
              timBenhLy: hp?.tinhtrangsuckhoe?.[0] || "",
              thucPhamKhongThich: hp?.diung?.[0] || ""
            });
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoadingProfile(false);
      }
    };
    
    loadUserProfile();
  }, []);

  const handleQuickAIGenerate = async () => {
    if (!userProfile?.hoTen) {
      toast({
        title: "Cần thông tin cơ bản",
        description: "Vui lòng điền ít nhất họ tên để AI có thể tạo thực đơn cho bạn",
        variant: "destructive"
      });
      return;
    }

    const aiProfile = {
      age: userProfile.tuoi || 25,
      height: userProfile.chieuCao || 170,
      weight: userProfile.canNang || 65,
      gender: userProfile.gioiTinh === 'nam' ? 'male' : 'female',
      activityLevel: userProfile.mucDoHoatDong || 'vua',
      healthGoals: userProfile.mucTieu ? [userProfile.mucTieu] : ['sucKhoe'],
      dietaryRestrictions: userProfile.dinhDuong ? [userProfile.dinhDuong] : [],
      medicalConditions: userProfile.timBenhLy ? [userProfile.timBenhLy] : []
    };

    try {
      const aiResult = await generateMealPlan(aiProfile);
      if (aiResult) {
        setAiMealPlan(aiResult);
        
        const today = new Date();
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + 7);
        
        const savedMealPlan = await createMealPlan({
          ten: `Thực đơn AI cho ${userProfile.hoTen}`,
          mota: `Thực đơn được tạo tự động bởi AI`,
          ngaybatdau: today.toISOString().split('T')[0],
          ngayketthuc: endDate.toISOString().split('T')[0],
          muctieucalo: aiResult.targetCalories,
          danghoatdong: true
        });

        if (savedMealPlan) {
          toast({
            title: "Đã tạo thực đơn! 🍽️",
            description: "AI đã tạo thực đơn phù hợp cho bạn",
          });
        }
        
        const mealResult = taoThucDonMau(userProfile);
        setMealData(mealResult);
        setCurrentStep('plan');
      }
    } catch (error) {
      console.error('Error generating AI meal plan:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo thực đơn AI. Vui lòng thử lại.",
        variant: "destructive"
      });
    }
  };

  const handleFormSubmit = async (profile: UserProfile) => {
    setUserProfile(profile);
    
    try {
      await updateProfile({
        hoten: profile.hoTen,
        gioitinh: profile.gioiTinh,
      });

      await updateHealthProfile({
        chieucao: profile.chieuCao,
        cannang: profile.canNang,
        mucdohoatdong: profile.mucDoHoatDong,
        muctieusuckhoe: profile.mucTieu ? [profile.mucTieu] : [],
        hanchechedo: profile.dinhDuong ? [profile.dinhDuong] : [],
        tinhtrangsuckhoe: profile.timBenhLy ? [profile.timBenhLy] : [],
        diung: profile.thucPhamKhongThich ? [profile.thucPhamKhongThich] : [],
      });

      toast({
        title: "Đã lưu thông tin! 💾",
        description: "Thông tin cá nhân của bạn đã được lưu",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
    }
    
    await handleQuickAIGenerate();
  };

  const handleBackToForm = () => {
    setCurrentStep('form');
  };

  return (
    <div className="min-h-screen bg-background">
      <NutritionHeader />
      
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        {currentStep === 'form' ? (
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
            {/* Quick AI Card */}
            <Card className="border-primary/20 shadow-lg">
              <CardHeader className="nutrition-gradient text-primary-foreground">
                <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                  Tạo Thực Đơn AI Nhanh
                </CardTitle>
                <CardDescription className="text-primary-foreground/90 text-sm sm:text-base">
                  AI sẽ tự động tạo thực đơn phù hợp dựa trên thông tin của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
                  <div className="p-2 sm:p-3 bg-muted rounded-lg">
                    <p className="text-muted-foreground mb-1">Tên</p>
                    <p className="font-medium truncate">{userProfile?.hoTen || "Chưa có"}</p>
                  </div>
                  <div className="p-2 sm:p-3 bg-muted rounded-lg">
                    <p className="text-muted-foreground mb-1">Cân nặng</p>
                    <p className="font-medium">{userProfile?.canNang ? `${userProfile.canNang}kg` : "Chưa có"}</p>
                  </div>
                  <div className="p-2 sm:p-3 bg-muted rounded-lg">
                    <p className="text-muted-foreground mb-1">Chiều cao</p>
                    <p className="font-medium">{userProfile?.chieuCao ? `${userProfile.chieuCao}cm` : "Chưa có"}</p>
                  </div>
                  <div className="p-2 sm:p-3 bg-muted rounded-lg">
                    <p className="text-muted-foreground mb-1">Mục tiêu</p>
                    <p className="font-medium truncate">{userProfile?.mucTieu || "Chưa có"}</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button 
                    onClick={handleQuickAIGenerate}
                    disabled={generatingPlan || !userProfile?.hoTen}
                    className="flex-1 nutrition-gradient text-primary-foreground text-sm sm:text-base py-4 sm:py-6"
                  >
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    {generatingPlan ? "Đang tạo..." : "Tạo Thực Đơn Ngay"}
                  </Button>
                  <Button 
                    onClick={() => navigate('/profile')}
                    variant="outline"
                    className="text-sm sm:text-base py-4 sm:py-6"
                  >
                    <ChefHat className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Cập nhật thông tin
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Form chi tiết */}
            <NutritionForm 
              onSubmit={handleFormSubmit} 
              initialProfile={userProfile}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                onClick={handleBackToForm}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Tạo thực đơn khác
              </Button>
            </div>
            
            {/* Show AI Meal Plan if available, otherwise show mock */}
            {aiMealPlan && userProfile ? (
              <AIMealPlanDisplay 
                mealPlan={aiMealPlan}
                userName={userProfile.hoTen}
              />
            ) : mealData && userProfile ? (
              <MealPlan 
                meals={mealData.mealPlan}
                tongCalo={mealData.tongCalo}
                userName={userProfile.hoTen}
              />
            ) : null}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-6 sm:py-8 mt-8 sm:mt-12 md:mt-16">
        <div className="container mx-auto px-3 sm:px-4 text-center">
          <h3 className="text-base sm:text-lg font-semibold mb-2">Ứng dụng AI Dinh Dưỡng</h3>
          <p className="text-xs sm:text-sm text-primary-foreground/80 px-2">
            Phát triển với React + TypeScript | Tích hợp AI Python Flask | Database PostgreSQL
          </p>
          <p className="text-xs text-primary-foreground/60 mt-2">
            Demo Frontend - Backend sẽ được deploy lên Render/Heroku
          </p>
        </div>
      </footer>
      
      <ChatBot />
    </div>
  );
};

export default Index;
