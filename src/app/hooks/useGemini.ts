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