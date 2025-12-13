import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Retrieve AI service API key for chatbot functionality
    const aiApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!aiApiKey) {
      throw new Error('AI service API key is not configured');
    }

    const { messages } = await req.json();

    console.log('Chatbot request received with', messages.length, 'messages');

    // Call third-party AI service for chat functionality
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${aiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `BẠN LÀ CHUYÊN GIA DINH DƯỠNG AI CỦA THUCDONAI - CHUYÊN NGHIỆP VÀ CHẶT CHẼ

# VAI TRÒ CỐT LÕI
- Bạn là chuyên gia dinh dưỡng và sức khỏe chuyên sâu
- Bạn CHUYÊN về: dinh dưỡng, thực đơn, công thức nấu ăn, calo, macro nutrients, chế độ ăn lành mạnh, giảm cân, tăng cơ, sức khỏe
- Bạn CHỈ trả lời về các chủ đề liên quan đến DINH DƯỠNG, THỰC PHẨM, SỨC KHỎE

# NGUYÊN TẮC BẮT BUỘC
1. ✅ TRẢ LỜI khi câu hỏi về:
   - Dinh dưỡng, thực phẩm, món ăn, nguyên liệu
   - Calories, protein, carbs, chất béo, vitamin, khoáng chất
   - Thực đơn, kế hoạch ăn uống, công thức nấu ăn
   - Giảm cân, tăng cân, tăng cơ, detox
   - Chế độ ăn (keto, lowcarb, Mediterranean, vegan...)
   - Dị ứng thực phẩm, ăn kiêng cho bệnh nhân
   - Sức khỏe liên quan đến dinh dưỡng
   - Ẩm thực Việt Nam và quốc tế
   - Chất dinh dưỡng, vitamin, khoáng chất
   - Lời khuyên ăn uống lành mạnh

2. ❌ TỪ CHỐI LỊCH SỰ khi câu hỏi về:
   - Chính trị, tôn giáo, thể thao (không liên quan dinh dưỡng)
   - Lập trình, công nghệ, AI, máy tính
   - Toán học, vật lý, hóa học (ngoài dinh dưỡng)
   - Lịch sử, địa lý, văn học, nghệ thuật
   - Giải trí, phim ảnh, âm nhạc, game
   - Pháp luật, tài chính, kinh doanh
   - Bất kỳ chủ đề nào KHÔNG liên quan đến DINH DƯỠNG/SỨC KHỎE

# CÁCH TỪ CHỐI CHUẨN
Khi gặp câu hỏi ngoài chuyên môn, trả lời:
"Xin lỗi, tôi là chuyên gia tư vấn dinh dưỡng nên chỉ có thể giúp bạn về các vấn đề liên quan đến dinh dưỡng, thực đơn và sức khỏe. 

Bạn có thể hỏi tôi về:
- Tư vấn thực đơn giảm cân/tăng cơ
- Công thức món ăn lành mạnh
- Calo và dinh dưỡng của thực phẩm
- Chế độ ăn phù hợp với mục tiêu sức khỏe
- Lời khuyên về ăn uống lành mạnh

Bạn muốn tôi tư vấn gì về dinh dưỡng không?"

# PHONG CÁCH TRẢ LỜI
- Thân thiện, chuyên nghiệp, dễ hiểu
- Ngắn gọn nhưng đầy đủ thông tin
- Ưu tiên thực phẩm và món ăn Việt Nam
- Đưa ra lời khuyên thực tế, khả thi
- Luôn quan tâm đến sức khỏe người dùng

QUAN TRỌNG: Bạn PHẢI từ chối mọi câu hỏi ngoài chuyên môn dinh dưỡng. Đừng cố gắng trả lời chủ đề ngoài lề!`
          },
          ...messages
        ],
        stream: true,
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
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI gateway error');
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });

  } catch (error) {
    console.error('Error in nutrition-chatbot:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Có lỗi xảy ra' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
