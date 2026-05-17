import { useState } from 'react';
import { supabase } from "@/app/lib/supabase";

export function useGemini() {
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 接收纯文本 prompt，调用 Supabase 里的 Gemini 代理
  const analyzeStructure = async (prompt: string): Promise<string | null> => {
    setIsThinking(true);
    setError(null);

    try {
      // Check for user's custom OpenAI settings
      const customApiKey = localStorage.getItem('living_structure_openai_key');
      const customBaseUrl = localStorage.getItem('living_structure_openai_base_url') || 'https://api.openai.com';
      const customModel = localStorage.getItem('living_structure_openai_model') || 'gpt-4o';

      if (customApiKey) {
        // Direct call to OpenAI or compatible API
        const endpoint = customBaseUrl.endsWith('/') ? `${customBaseUrl}v1/chat/completions` : `${customBaseUrl}/v1/chat/completions`;
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${customApiKey}`
          },
          body: JSON.stringify({
            model: customModel,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error?.message || `Custom API request failed: ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || null;
      } else {
        // Fallback to original Supabase AI gateway
        const { data, error: supaError } = await supabase.functions.invoke('ai-gateway', {
          body: { 
            prompt: prompt,
            images: [], // 纯文本请求不传图片
            model: 'gemini' 
          }
        });

        if (supaError) {
          throw new Error(supaError.message || "Gateway request failed");
        }

        return data.reply || null;
      }
    } catch (err: any) {
      console.error('AI Request Error:', err);
      setError(err.message || 'An error occurred during AI analysis.');
      return null;
    } finally {
      setIsThinking(false);
    }
  };

  return { analyzeStructure, isThinking, error };
}