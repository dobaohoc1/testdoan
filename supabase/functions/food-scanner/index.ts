import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FoodScanRequest {
  imageUrl: string;
  analysisType?: 'nutrition' | 'ingredients' | 'calories' | 'all';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Retrieve AI service API key for food recognition
    const aiApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!aiApiKey) {
      throw new Error('AI service API key not configured');
    }

    const { imageUrl, analysisType = 'all' }: FoodScanRequest = await req.json();

    if (!imageUrl) {
      throw new Error('Image URL is required');
    }

    const systemPrompt = `Bạn là chuyên gia AI nhận diện và phân tích thực phẩm Việt Nam.

Hãy phân tích hình ảnh thực phẩm và trả về JSON format:
{
  "nhanDien": {
    "tenMon": "",
    "loaiThucPham": "",
    "doTinCay": 0.95,
    "moTa": ""
  },
  "dinhDuong": {
    "caloUocTinh": 0,
    "protein": 0,
    "carb": 0,
    "fat": 0,
    "chatXo": 0,
    "donVi": "khẩu phần/100g"
  },
  "nguyenLieu": [
    {
      "ten": "",
      "tyLe": 0.3,
      "moTa": ""
    }
  ],
  "danhGia": {
    "diemDinhDuong": 0,
    "mucDoLanhManh": "",
    "phuHop": [],
    "canhBao": [],
    "goiY": []
  },
  "thongTinBoSung": {
    "cachCheBien": "",
    "nguonGoc": "",
    "mua": "",
    "luuY": []
  }
}

Tập trung vào món ăn Việt Nam. Nếu không phải thức ăn, hãy báo lỗi.`;

    const analysisPrompts = {
      nutrition: 'Tập trung phân tích dinh dưỡng chi tiết',
      ingredients: 'Tập trung nhận diện nguyên liệu thành phần',
      calories: 'Tập trung ước tính calo chính xác',
      all: 'Phân tích toàn diện thực phẩm'
    };

    // Call third-party AI gateway for image analysis
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
          {
            role: 'user',
            content: [
              { 
                type: 'text', 
                text: `${analysisPrompts[analysisType]}. Nhận diện và phân tích thực phẩm trong hình ảnh:`
              },
              { 
                type: 'image_url', 
                image_url: { 
                  url: imageUrl,
                  detail: 'high'
                } 
              }
            ]
          }
        ],
        max_tokens: 1500,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (response.status === 402) {
        throw new Error('Payment required. Please contact administrator to add AI service credits.');
      }
      throw new Error(`AI service error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    let analysisContent = data.choices[0].message.content;

    try {
      // Extract JSON từ response
      const jsonMatch = analysisContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const scanResult = JSON.parse(jsonMatch[0]);
        console.log('Food scan completed successfully');
        
        return new Response(JSON.stringify({
          success: true,
          analysis: scanResult,
          analysisType,
          timestamp: new Date().toISOString()
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } else {
        throw new Error('No valid JSON found in response');
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      
      // Fallback: return basic analysis
      return new Response(JSON.stringify({
        success: true,
        analysis: {
          nhanDien: {
            tenMon: 'Không nhận diện được',
            moTa: analysisContent,
            doTinCay: 0.5
          },
          rawAnalysis: analysisContent
        },
        analysisType
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in food-scanner function:', error);
    return new Response(JSON.stringify({ 
      error: 'Có lỗi xảy ra khi nhận diện thực phẩm',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});