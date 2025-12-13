import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Coffee, Sun, Moon, Apple } from "lucide-react";

interface MealPlanDisplayProps {
  mealPlan: {
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
  };
  userName: string;
}

export const AIMealPlanDisplay = ({ mealPlan, userName }: MealPlanDisplayProps) => {
  const { mealPlan: meals, targetCalories, dailyNutrition, recommendations } = mealPlan;

  const renderMeal = (meal: any, icon: any, title: string, bgColor: string) => {
    if (!meal) return null;
    
    const Icon = icon;
    
    return (
      <Card className="overflow-hidden">
        <CardHeader className={`${bgColor} text-primary-foreground`}>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Icon className="w-5 h-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          <div>
            <h4 className="font-semibold text-base mb-2">{meal.name || meal.ten || "Món ăn"}</h4>
            {meal.description && (
              <p className="text-sm text-muted-foreground mb-3">{meal.description}</p>
            )}
          </div>
          
          {meal.ingredients && meal.ingredients.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Nguyên liệu:</p>
              <ul className="text-sm space-y-1">
                {meal.ingredients.map((ingredient: any, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{ingredient.name || ingredient.ten} - {ingredient.amount || ingredient.soluong}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-2 pt-2 border-t">
            <div className="text-center p-2 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">Calories</p>
              <p className="font-bold text-primary">{meal.calories || meal.calo || 0} kcal</p>
            </div>
            <div className="text-center p-2 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">Protein</p>
              <p className="font-bold">{meal.protein || meal.dam || 0}g</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <Card className="border-primary/20 shadow-lg">
        <CardHeader className="nutrition-gradient text-primary-foreground">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6" />
            Kế Hoạch Bữa Ăn AI - {userName}
          </CardTitle>
          <CardDescription className="text-primary-foreground/90">
            Thực đơn được tạo tự động dựa trên thông tin sức khỏe của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">Mục tiêu Calo</p>
              <p className="text-2xl font-bold text-primary">{targetCalories}</p>
              <p className="text-xs text-muted-foreground">kcal/ngày</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Protein</p>
              <p className="text-2xl font-bold">{dailyNutrition.protein}g</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Carbs</p>
              <p className="text-2xl font-bold">{dailyNutrition.carbohydrates}g</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Chất béo</p>
              <p className="text-2xl font-bold">{dailyNutrition.fat}g</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderMeal(meals.breakfast, Coffee, "Bữa Sáng", "bg-gradient-to-r from-orange-500 to-yellow-500")}
        {renderMeal(meals.lunch, Sun, "Bữa Trưa", "bg-gradient-to-r from-green-500 to-emerald-500")}
        {renderMeal(meals.dinner, Moon, "Bữa Tối", "bg-gradient-to-r from-blue-500 to-indigo-500")}
        
        {meals.snacks && meals.snacks.length > 0 && (
          <Card className="overflow-hidden md:col-span-2">
            <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-500 text-primary-foreground">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Apple className="w-5 h-5" />
                Bữa Phụ
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {meals.snacks.map((snack: any, idx: number) => (
                  <div key={idx} className="p-3 border rounded-lg">
                    <h5 className="font-semibold mb-1">{snack.name || snack.ten}</h5>
                    <p className="text-sm text-muted-foreground mb-2">{snack.description}</p>
                    <div className="flex gap-3 text-sm">
                      <Badge variant="secondary">{snack.calories || snack.calo} kcal</Badge>
                      <Badge variant="outline">{snack.protein || snack.dam}g protein</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Gợi Ý Từ AI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recommendations.map((rec: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
