// Health calculation utilities

export interface BMIResult {
  bmi: number;
  category: string;
  interpretation: string;
}

export interface BMRResult {
  bmr: number;
  tdee: number;
  recommendation: string;
}

/**
 * Calculate BMI (Body Mass Index)
 */
export const calculateBMI = (weight: number, height: number): BMIResult => {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  
  let category = '';
  let interpretation = '';
  
  if (bmi < 18.5) {
    category = 'Thiếu cân';
    interpretation = 'Bạn nên tăng cân để đạt được sức khỏe tối ưu.';
  } else if (bmi < 25) {
    category = 'Bình thường';
    interpretation = 'Cân nặng của bạn trong mức bình thường, hãy duy trì!';
  } else if (bmi < 30) {
    category = 'Thừa cân';
    interpretation = 'Bạn nên giảm cân để cải thiện sức khỏe.';
  } else {
    category = 'Béo phì';
    interpretation = 'Bạn nên giảm cân và tham khảo ý kiến bác sĩ.';
  }
  
  return {
    bmi: Math.round(bmi * 10) / 10,
    category,
    interpretation
  };
};

/**
 * Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
 */
export const calculateBMR = (
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female',
  activityLevel: string
): BMRResult => {
  let bmr: number;
  
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  
  // Activity multipliers
  const activityMultipliers: Record<string, number> = {
    'sedentary': 1.2,
    'light': 1.375,
    'moderate': 1.55,
    'active': 1.725,
    'very_active': 1.9
  };
  
  const multiplier = activityMultipliers[activityLevel] || 1.2;
  const tdee = bmr * multiplier;
  
  let recommendation = '';
  if (activityLevel === 'sedentary') {
    recommendation = 'Bạn nên tăng cường vận động để cải thiện sức khỏe.';
  } else if (activityLevel === 'very_active') {
    recommendation = 'Bạn cần bổ sung đủ calories để duy trì năng lượng.';
  } else {
    recommendation = 'Hãy duy trì mức độ vận động hiện tại.';
  }
  
  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    recommendation
  };
};

/**
 * Calculate calorie target based on health goals
 */
export const calculateCalorieTarget = (
  tdee: number,
  goal: string
): number => {
  switch (goal) {
    case 'weight_loss':
      return Math.round(tdee - 500); // 500 calorie deficit
    case 'weight_gain':
      return Math.round(tdee + 500); // 500 calorie surplus
    case 'maintain':
    default:
      return Math.round(tdee);
  }
};

/**
 * Calculate water intake recommendation (ml per day)
 */
export const calculateWaterIntake = (weight: number, activityLevel: string): number => {
  // Base: 30-35ml per kg of body weight
  let baseIntake = weight * 33;
  
  // Adjust for activity level
  const activityAdjustments: Record<string, number> = {
    'sedentary': 1,
    'light': 1.1,
    'moderate': 1.2,
    'active': 1.3,
    'very_active': 1.4
  };
  
  const multiplier = activityAdjustments[activityLevel] || 1;
  return Math.round(baseIntake * multiplier);
};
