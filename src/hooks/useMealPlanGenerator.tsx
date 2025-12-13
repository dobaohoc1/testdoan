import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  age: number;
  height: number;
  weight: number;
  gender: string;
  activityLevel: string;
  healthGoals: string[];
  dietaryRestrictions: string[];
  medicalConditions: string[];
}

interface MealPlanResponse {
  mealPlan: {
    breakfast: any;
    lunch: any;
    dinner: any;
    snacks: any[];
  };
  targetCalories: number;
  dailyNutrition: {
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
  };
  recommendations: string[];
}

export const useMealPlanGenerator = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateMealPlan = async (
    userProfile: UserProfile,
    duration: number = 7
  ): Promise<MealPlanResponse | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('meal-plan-generator', {
        body: {
          userProfile,
          duration
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error generating meal plan:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo kế hoạch bữa ăn. Vui lòng thử lại.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateMealPlan,
    loading
  };
};