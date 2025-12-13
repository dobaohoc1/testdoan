import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MealPlanRequest {
  userProfile: {
    age: number;
    height: number;
    weight: number;
    gender: string;
    activityLevel: string;
    healthGoals: string[];
    dietaryRestrictions: string[];
    medicalConditions: string[];
  };
  duration: number; // số ngày
  preferences?: string[];
  avoidFoods?: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Retrieve AI service API key for meal plan generation
    const aiApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!aiApiKey) {
      throw new Error('AI service API key is not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { userProfile, duration, preferences = [], avoidFoods = [] }: MealPlanRequest = await req.json();

    // Tính toán calo cần thiết
    let bmr: number;
    if (userProfile.gender === 'nam') {
      bmr = 10 * userProfile.weight + 6.25 * userProfile.height - 5 * userProfile.age + 5;
    } else {
      bmr = 10 * userProfile.weight + 6.25 * userProfile.height - 5 * userProfile.age - 161;
    }

    const activityMultiplier = {
      'it': 1.2,
      'nhe': 1.375,
      'vua': 1.55,
      'cao': 1.725,
      'ratCao': 1.9
    };

    const tdee = bmr * (activityMultiplier[userProfile.activityLevel as keyof typeof activityMultiplier] || 1.2);
    
    let targetCalories = tdee;
    if (userProfile.healthGoals.includes('giamCan')) {
      targetCalories = tdee - 500;
    } else if (userProfile.healthGoals.includes('tangCan')) {
      targetCalories = tdee + 300;
    }

    // Lấy nguyên liệu phổ biến từ database - Vietnamese lowercase schema
    const { data: ingredients } = await supabase
      .from('NguyenLieu')
      .select('ten, calo100g, dam100g, carb100g, chat100g')
      .limit(50);

    const systemPrompt = `Bạn là chuyên gia dinh dưỡng AI tạo kế hoạch bữa ăn cho người Việt Nam.

Thông tin người dùng:
- Tuổi: ${userProfile.age}, Chiều cao: ${userProfile.height}cm, Cân nặng: ${userProfile.weight}kg
- Giới tính: ${userProfile.gender}
- Mức độ hoạt động: ${userProfile.activityLevel}
- Mục tiêu sức khỏe: ${userProfile.healthGoals.join(', ')}
- Hạn chế ăn uống: ${userProfile.dietaryRestrictions.join(', ')}
- Calo mục tiêu hàng ngày: ${Math.round(targetCalories)}
- Thời gian: ${duration} ngày
- Sở thích: ${preferences.join(', ')}
- Tránh thực phẩm: ${avoidFoods.join(', ')}

Nguyên liệu có sẵn: ${ingredients?.map(ing => ing.ten).join(', ') || 'Gạo, thịt, cá, rau củ phổ biến'}

Hãy tạo kế hoạch bữa ăn ${duration} ngày với format JSON:
{
  "mealPlan": {
    "ngay1": {
      "sang": {"ten": "", "calo": 0, "nguyenLieu": [], "congThuc": []},
      "trua": {"ten": "", "calo": 0, "nguyenLieu": [], "congThuc": []},
      "toi": {"ten": "", "calo": 0, "nguyenLieu": [], "congThuc": []},
      "anVat": {"ten": "", "calo": 0, "nguyenLieu": [], "congThuc": []}
    }
  },
  "tongCalo": 0,
  "phanTichDinhDuong": "",
  "loiKhuyen": ""
}

Đảm bảo món ăn phù hợp văn hóa Việt Nam và mục tiêu sức khỏe.`;

    console.log('Generating meal plan using AI service');

    // Call third-party AI service for meal plan generation
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${aiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Tạo kế hoạch bữa ăn ${duration} ngày với ${Math.round(targetCalories)} calo/ngày` }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Đã vượt quá giới hạn yêu cầu. Vui lòng thử lại sau.' 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'Cần nạp thêm credits. Vui lòng liên hệ quản trị viên.' 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI service error:', response.status, errorText);
      throw new Error(`AI service error: ${response.status}`);
    }

    const data = await response.json();
    let mealPlanContent = data.choices[0].message.content;

    console.log('Meal plan response received');

    // Xử lý JSON response
    try {
      // Extract JSON từ response
      const jsonMatch = mealPlanContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const mealPlanData = JSON.parse(jsonMatch[0]);
        console.log('Meal plan generated successfully');
        
        return new Response(JSON.stringify({
          success: true,
          data: mealPlanData,
          targetCalories: Math.round(targetCalories)
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } else {
        throw new Error('No valid JSON found in response');
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      
      // Fallback: return raw content
      return new Response(JSON.stringify({
        success: true,
        data: {
          rawContent: mealPlanContent,
          targetCalories: Math.round(targetCalories)
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in meal-plan-generator function:', error);
    return new Response(JSON.stringify({ 
      error: 'Có lỗi xảy ra khi tạo kế hoạch bữa ăn',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
