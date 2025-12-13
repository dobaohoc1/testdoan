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

interface NutritionResponse {
  advice: string;
  userProfile: {
    age: number;
    gender: string;
    goals: string[];
  };
}

export const useNutritionAI = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getNutritionAdvice = async (
    userProfile: UserProfile,
    question?: string,
    mealType?: string
  ): Promise<NutritionResponse | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('nutrition-advisor', {
        body: {
          userProfile,
          question,
          mealType
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting nutrition advice:', error);
      toast({
        title: "Lỗi",
        description: "Không thể lấy tư vấn dinh dưỡng. Vui lòng thử lại.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getNutritionAdvice,
    loading
  };
};