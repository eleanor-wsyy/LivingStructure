import { useState } from 'react';

// 🛑 直接把你的千问 Key 填在这里！不用管 .env，不用管梯子！
const QWEN_API_KEY = "sk-752976b46cb041bfaf8c952f0777cd83"; 

export function useGemini() {
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeStructure = async (prompt: string) => {
    setIsThinking(true);
    setError(null);
    
    try {
      // 呼叫国内阿里云的千问接口，绝对不超时，速度秒回！
      const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${QWEN_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "qwen-plus", // 调用千问的高级模型
          messages: [
            {
              role: "system",
              content: "You are a phenomenological scientist and expert in Christopher Alexander's living structure."
            },
            {
              role: "user",
              content: prompt
            }
          ]
        })
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      return data.choices[0].message.content;
      
    } catch (err: any) {
      console.error("AI API Error:", err);
      setError(err.message || "请求 AI 时发生未知错误");
      return null;
    } finally {
      setIsThinking(false);
    }
  };

  return { analyzeStructure, isThinking, error };
}