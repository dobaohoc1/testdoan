import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { calculateBMI, calculateBMR, calculateCalorieTarget } from '@/lib/healthCalculations';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, TrendingUp, Target } from 'lucide-react';

interface BMICalculatorProps {
  initialWeight?: number;
  initialHeight?: number;
  initialAge?: number;
  initialGender?: string;
  initialActivityLevel?: string;
}

export const BMICalculator = ({ 
  initialWeight, 
  initialHeight, 
  initialAge,
  initialGender,
  initialActivityLevel 
}: BMICalculatorProps) => {
  const [weight, setWeight] = useState(initialWeight?.toString() || '');
  const [height, setHeight] = useState(initialHeight?.toString() || '');
  const [age, setAge] = useState(initialAge?.toString() || '');
  const [gender, setGender] = useState(initialGender || 'male');
  const [activityLevel, setActivityLevel] = useState(initialActivityLevel || 'moderate');
  const [goal, setGoal] = useState('maintain');
  const [results, setResults] = useState<any>(null);

  const handleCalculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age);

    if (!w || !h || !a) return;

    const bmiResult = calculateBMI(w, h);
    const bmrResult = calculateBMR(w, h, a, gender as 'male' | 'female', activityLevel);
    const calorieTarget = calculateCalorieTarget(bmrResult.tdee, goal);

    setResults({
      bmi: bmiResult,
      bmr: bmrResult,
      calorieTarget
    });
  };

  useEffect(() => {
    if (weight && height && age) {
      handleCalculate();
    }
  }, [weight, height, age, gender, activityLevel, goal]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Tính toán BMI & BMR
          </CardTitle>
          <CardDescription>
            Nhập thông tin của bạn để tính chỉ số sức khỏe
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Cân nặng (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="70"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Chiều cao (cm)</Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="170"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Tuổi</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Giới tính</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Nam</SelectItem>
                  <SelectItem value="female">Nữ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="activity">Mức độ vận động</Label>
              <Select value={activityLevel} onValueChange={setActivityLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Ít vận động</SelectItem>
                  <SelectItem value="light">Vận động nhẹ</SelectItem>
                  <SelectItem value="moderate">Vận động trung bình</SelectItem>
                  <SelectItem value="active">Vận động nhiều</SelectItem>
                  <SelectItem value="very_active">Vận động rất nhiều</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal">Mục tiêu</Label>
              <Select value={goal} onValueChange={setGoal}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight_loss">Giảm cân</SelectItem>
                  <SelectItem value="maintain">Duy trì</SelectItem>
                  <SelectItem value="weight_gain">Tăng cân</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                BMI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{results.bmi.bmi}</div>
              <Badge variant="secondary" className="mb-2">{results.bmi.category}</Badge>
              <p className="text-sm text-muted-foreground">{results.bmi.interpretation}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-4 w-4" />
                BMR & TDEE
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <div className="text-sm text-muted-foreground">BMR</div>
                  <div className="text-2xl font-bold">{results.bmr.bmr} kcal</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">TDEE</div>
                  <div className="text-2xl font-bold">{results.bmr.tdee} kcal</div>
                </div>
                <p className="text-sm text-muted-foreground">{results.bmr.recommendation}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-4 w-4" />
                Mục tiêu Calories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{results.calorieTarget} kcal</div>
              <p className="text-sm text-muted-foreground">
                {goal === 'weight_loss' && 'Để giảm cân an toàn (500 kcal deficit)'}
                {goal === 'maintain' && 'Để duy trì cân nặng hiện tại'}
                {goal === 'weight_gain' && 'Để tăng cân lành mạnh (500 kcal surplus)'}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
