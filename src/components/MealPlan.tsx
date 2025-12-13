import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Flame, Utensils } from "lucide-react";

interface Meal {
  ten: string;
  moTa: string;
  calo: number;
  protein: number;
  carb: number;
  fat: number;
  thoiGianNau: number;
  khauPhan: number;
  congThuc: string[];
  nguyenLieu: string[];
}

interface MealPlanProps {
  meals: {
    sang: Meal;
    trua: Meal;
    toi: Meal;
    anVat: Meal;
  };
  tongCalo: number;
  userName: string;
}

export const MealPlan = ({ meals, tongCalo, userName }: MealPlanProps) => {
  const MealCard = ({ meal, buoi, icon }: { meal: Meal; buoi: string; icon: React.ReactNode }) => (
    <Card className="shadow-nutrition hover:shadow-nutrition-strong transition-all duration-300 animate-slide-up">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-lg font-semibold">{buoi}</span>
          </div>
          <Badge className="nutrition-gradient text-primary-foreground">
            {meal.calo} cal
          </Badge>
        </CardTitle>
        <CardDescription className="font-medium text-foreground">
          {meal.ten}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{meal.moTa}</p>
        
        {/* Thông tin dinh dưỡng */}
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="text-center p-2 rounded-lg bg-secondary">
            <div className="font-semibold text-success">{meal.protein}g</div>
            <div className="text-xs text-muted-foreground">Protein</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-secondary">
            <div className="font-semibold text-warning">{meal.carb}g</div>
            <div className="text-xs text-muted-foreground">Carb</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-secondary">
            <div className="font-semibold text-accent">{meal.fat}g</div>
            <div className="text-xs text-muted-foreground">Fat</div>
          </div>
        </div>

        {/* Thông tin khác */}
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{meal.thoiGianNau} phút</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{meal.khauPhan} người</span>
          </div>
        </div>

        {/* Nguyên liệu */}
        <div>
          <h4 className="font-semibold mb-2 text-sm">Nguyên liệu:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {meal.nguyenLieu.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-success">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cách làm */}
        <div>
          <h4 className="font-semibold mb-2 text-sm">Cách làm:</h4>
          <ol className="text-sm text-muted-foreground space-y-1">
            {meal.congThuc.map((buoc, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary font-semibold">{index + 1}.</span>
                <span>{buoc}</span>
              </li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <Card className="shadow-nutrition-strong">
        <CardHeader className="text-center nutrition-gradient text-primary-foreground rounded-t-lg">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Utensils className="h-6 w-6" />
            Thực Đơn AI Cho {userName}
          </CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Thực đơn dinh dưỡng cá nhân hóa dựa trên thông tin của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Flame className="h-5 w-5 text-orange-500" />
              <span>Tổng: {tongCalo} calories/ngày</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bữa sáng */}
      <MealCard 
        meal={meals.sang} 
        buoi="Bữa Sáng" 
        icon={<div className="w-5 h-5 rounded-full bg-yellow-400"></div>}
      />

      {/* Bữa trưa */}
      <MealCard 
        meal={meals.trua} 
        buoi="Bữa Trưa" 
        icon={<div className="w-5 h-5 rounded-full bg-orange-400"></div>}
      />

      {/* Bữa tối */}
      <MealCard 
        meal={meals.toi} 
        buoi="Bữa Tối" 
        icon={<div className="w-5 h-5 rounded-full bg-purple-400"></div>}
      />

      {/* Ăn vặt */}
      <MealCard 
        meal={meals.anVat} 
        buoi="Ăn Vặt" 
        icon={<div className="w-5 h-5 rounded-full bg-green-400"></div>}
      />
    </div>
  );
};