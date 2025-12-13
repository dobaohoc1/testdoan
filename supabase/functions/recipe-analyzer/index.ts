import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RecipeAnalysisRequest {
  recipeText?: string;
  ingredients?: string[];
  recipeName?: string;
  imageUrl?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { recipeText, ingredients, recipeName, imageUrl }: RecipeAnalysisRequest = await req.json();

    // Lấy thông tin dinh dưỡng từ database - Vietnamese lowercase schema
    const { data: dbIngredients } = await supabase
      .from('NguyenLieu')
      .select('*')
      .limit(100);

    const systemPrompt = `Bạn là chuyên gia phân tích dinh dưỡng món ăn Việt Nam.

Database nguyên liệu có sẵn:
${dbIngredients?.map(ing => 
  `${ing.ten}: ${ing.calo100g}cal, protein ${ing.dam100g}g, carb ${ing.carb100g}g, fat ${ing.chat100g}g /100g`
).join('\n') || 'Dữ liệu nguyên liệu cơ bản'}

Hãy phân tích món ăn và trả về JSON format:
{
  "tenMon": "",
  "moTa": "",
  "dinhDuong": {
    "calo": 0,
    "protein": 0,
    "carb": 0,
    "fat": 0,
    "chat_xo": 0
  },
  "nguyenLieu": [
    {
      "ten": "",
      "soLuong": 0,
      "donVi": "",
      "calo": 0
    }
  ],
  "phanTich": {
    "loiIch": [],
    "rui_ro": [],
    "phuHop": [],
    "caiThien": []
  },
  "xepHang": {
    "diemDinhDuong": 0,
    "mucDoLanhManh": "",
    "phuHopGiamCan": true,
    "phuHopTangCan": true
  }
}

Đánh giá dựa trên tiêu chuẩn dinh dưỡng Việt Nam và WHO.`;

    let userPrompt = '';
    if (recipeText) {
      userPrompt = `Phân tích công thức món ăn: ${recipeText}`;
    } else if (ingredients && recipeName) {
      userPrompt = `Phân tích món "${recipeName}" với nguyên liệu: ${ingredients.join(', ')}`;
    } else {
      userPrompt = 'Phân tích món ăn từ thông tin được cung cấp';
    }

    const messages: any = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    // Nếu có ảnh, thêm vào message
    if (imageUrl) {
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: 'Phân tích món ăn trong hình ảnh này:' },
          { type: 'image_url', image_url: { url: imageUrl } }
        ]
      });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: imageUrl ? 'gpt-4o' : 'gpt-4o-mini',
        messages,
        max_tokens: 1500,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    let analysisContent = data.choices[0].message.content;

    try {
      // Extract JSON từ response
      const jsonMatch = analysisContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysisData = JSON.parse(jsonMatch[0]);
        console.log('Recipe analysis completed successfully');
        
        return new Response(JSON.stringify({
          success: true,
          analysis: analysisData
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } else {
        throw new Error('No valid JSON found in response');
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      
      // Fallback: return structured data
      return new Response(JSON.stringify({
        success: true,
        analysis: {
          rawContent: analysisContent,
          summary: 'Phân tích dinh dưỡng chi tiết'
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in recipe-analyzer function:', error);
    return new Response(JSON.stringify({ 
      error: 'Có lỗi xảy ra khi phân tích công thức',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
