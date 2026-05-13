import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// 👇 引入 Google 官方的 SDK
import { GoogleGenerativeAI } from "npm:@google/generative-ai";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // 处理浏览器的预检请求
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { prompt, images = [], model = 'gemini' } = await req.json();

    if (model === 'gemini') {
      const apiKey = Deno.env.get('GEMINI_API_KEY');
      if (!apiKey) throw new Error("API Key 未配置");

      // 1. 初始化官方 SDK
      const genAI = new GoogleGenerativeAI(apiKey);
      
      // 2. 指定模型，SDK 会自动处理底层 v1/v1beta 的网址路由
      const genModel = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: { temperature: 0.0 }
      });

      // 3. 构建多模态数据数组 (SDK 要求使用 camelCase 驼峰命名)
      const parts: any[] = [{ text: prompt }];

      images.forEach((img: { mimeType: string, base64Data: string }) => {
        parts.push({
          inlineData: {
            mimeType: img.mimeType,
            data: img.base64Data
          }
        });
      });

      // 4. 调用官方生成方法
      const result = await genModel.generateContent(parts);
      const responseText = result.response.text();

      return new Response(JSON.stringify({ reply: responseText }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Unsupported model');

  } catch (error: any) {
    console.error("AI Gateway Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});