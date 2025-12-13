import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RecipeAnalysisResult {
  nutrition: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
  healthScore: number;
  benefits: string[];
  improvements: string[];
  allergensWarning: string[];
  servingSize: string;
  cookingTips: string[];
}

export const useRecipeAnalyzer = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const analyzeRecipe = async (
    recipeText?: string,
    ingredients?: string[],
    recipeName?: string,
    imageUrl?: string
  ): Promise<RecipeAnalysisResult | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('recipe-analyzer', {
        body: {
          recipeText,
          ingredients,
          recipeName,
          imageUrl
        }
      });

      if (error) throw error;
      return data.analysis;
    } catch (error) {
      console.error('Error analyzing recipe:', error);
      toast({
        title: "Lỗi",
        description: "Không thể phân tích công thức. Vui lòng thử lại.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    analyzeRecipe,
    loading
  };
};