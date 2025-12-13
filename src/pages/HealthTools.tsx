import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { BMICalculator } from '@/components/BMICalculator';
import { WeightTracker } from '@/components/WeightTracker';
import { WaterTracker } from '@/components/WaterTracker';
import { ShoppingListManager } from '@/components/ShoppingListManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Activity, Scale, Droplets, ShoppingCart } from 'lucide-react';

export default function HealthTools() {
  const { user } = useAuth();
  const { getCompleteProfile } = useProfile();
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    const data = await getCompleteProfile();
    setProfileData(data);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-5xl space-y-6 pb-12">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-success/20 via-success/10 to-background p-6 sm:p-8 border border-border/50 animate-fade-in">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-2xl bg-success/20 backdrop-blur-sm">
                <Activity className="w-6 h-6 sm:w-7 sm:h-7 text-success" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
                Công Cụ Sức Khỏe
              </h1>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground ml-[52px]">
              Theo dõi và quản lý sức khỏe của bạn thông minh hơn 🌿
            </p>
          </div>
        </div>

        <Tabs defaultValue="bmi" className="space-y-6 animate-slide-up">
          {/* Modern Mobile-First Tabs */}
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full gap-2 p-1.5 bg-muted/40 backdrop-blur-md rounded-2xl shadow-sm">
            <TabsTrigger 
              value="bmi" 
              className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-2.5 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Activity className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm font-semibold">BMI</span>
            </TabsTrigger>
            <TabsTrigger 
              value="weight" 
              className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-2.5 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Scale className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm font-semibold">Cân nặng</span>
            </TabsTrigger>
            <TabsTrigger 
              value="water" 
              className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-2.5 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Droplets className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm font-semibold">Nước</span>
            </TabsTrigger>
            <TabsTrigger 
              value="shopping" 
              className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-2.5 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <ShoppingCart className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm font-semibold">Mua sắm</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Content với animation */}
          <TabsContent value="bmi" className="animate-scale-in">
            <BMICalculator
              initialWeight={profileData?.healthProfile?.weight}
              initialHeight={profileData?.healthProfile?.height}
              initialAge={
                profileData?.profile?.date_of_birth
                  ? new Date().getFullYear() - new Date(profileData.profile.date_of_birth).getFullYear()
                  : undefined
              }
              initialGender={profileData?.profile?.gender?.toLowerCase()}
              initialActivityLevel={profileData?.healthProfile?.activity_level}
            />
          </TabsContent>

          <TabsContent value="weight" className="animate-scale-in">
            <WeightTracker />
          </TabsContent>

          <TabsContent value="water" className="animate-scale-in">
            <WaterTracker
              weight={profileData?.healthProfile?.weight || 70}
              activityLevel={profileData?.healthProfile?.activity_level || 'moderate'}
            />
          </TabsContent>

          <TabsContent value="shopping" className="animate-scale-in">
            <ShoppingListManager />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
