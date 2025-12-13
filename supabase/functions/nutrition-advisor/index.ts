import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NutritionRequest {
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
  question?: string;
  mealType?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Retrieve AI service API key for nutrition consultation
    const aiApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!aiApiKey) {
      throw new Error('AI service API key is not configured');
    }

    const { userProfile, question, mealType }: NutritionRequest = await req.json();

    // Tạo context prompt cho AI với training chặt chẽ
    const systemPrompt = `BẠN LÀ CHUYÊN GIA DINH DƯỠNG AI CỦA THUCDONAI

# VAI TRÒ
Bạn là chuyên gia dinh dưỡng chuyên sâu, CHỈ tư vấn về dinh dưỡng, thực đơn, món ăn và sức khỏe.

# THÔNG TIN NGƯỜI DÙNG
- Tuổi: ${userProfile.age || 'Chưa cung cấp'}
- Chiều cao: ${userProfile.height || 'Chưa cung cấp'}cm
- Cân nặng: ${userProfile.weight || 'Chưa cung cấp'}kg
- Giới tính: ${userProfile.gender || 'Chưa cung cấp'}
- Mức độ hoạt động: ${userProfile.activityLevel || 'Chưa cung cấp'}
- Mục tiêu sức khỏe: ${userProfile.healthGoals?.join(', ') || 'Chưa cung cấp'}
- Hạn chế ăn uống: ${userProfile.dietaryRestrictions?.join(', ') || 'Không có'}
- Tình trạng sức khỏe: ${userProfile.medicalConditions?.join(', ') || 'Không có'}

# NGUYÊN TẮC BẮT BUỘC
1. CHỈ trả lời câu hỏi về: dinh dưỡng, thực đơn, món ăn, công thức nấu ăn, calo, chất dinh dưỡng, chế độ ăn, sức khỏe
2. TỪ CHỐI lịch sự nếu câu hỏi ngoài chuyên môn dinh dưỡng
3. Ưu tiên món ăn và nguyên liệu Việt Nam
4. Đưa ra lời khuyên cụ thể, thực tế, phù hợp với thông tin người dùng
5. Giải thích rõ ràng về lợi ích dinh dưỡng

# CÁCH TRẢ LỜI
- Ngắn gọn, rõ ràng, dễ hiểu
- Liệt kê cụ thể (món ăn, thành phần, calories)
- Giải thích ngắn gọn vì sao phù hợp
- Lưu ý về hạn chế/dị ứng của người dùng

QUAN TRỌNG: Nếu câu hỏi KHÔNG liên quan đến dinh dưỡng/thực phẩm/sức khỏe, hãy TỪ CHỐI lịch sự và yêu cầu hỏi về chủ đề dinh dưỡng.`;

    const userPrompt = question || `Hãy tư vấn ${mealType || 'kế hoạch dinh dưỡng'} phù hợp cho tôi.`;

    console.log('Requesting nutrition advice from AI service');

    // Call third-party AI service for nutrition consultation
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
          { role: 'user', content: userPrompt }
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
    const advice = data.choices[0].message.content;

    console.log('Nutrition advice generated successfully');

    return new Response(JSON.stringify({ 
      advice,
      userProfile: {
        age: userProfile.age,
        gender: userProfile.gender,
        goals: userProfile.healthGoals
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in nutrition-advisor function:', error);
    return new Response(JSON.stringify({ 
      error: 'Có lỗi xảy ra khi tư vấn dinh dưỡng',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
