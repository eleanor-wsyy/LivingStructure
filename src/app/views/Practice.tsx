import React, { useState, useRef, useEffect } from "react";
import { Button, Card, cn } from "@/app/components/ui";
import { Play, Pause, Activity, Wind, Send, Calendar as CalendarIcon, Sparkles, History, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/app/i18n/LanguageContext";
import OpenAI from "openai";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: number; // 👇 新增：时间戳，用来记录发生的时间
}

// 定义本地存储的 Key
const STORAGE_KEY = "vitality_healing_chat_history";

export function Practice() {
  const { trans, language } = useLanguage();
  const isEn = language === 'en' || trans.practice.title === "Embodied Practice";

  const defaultMessageEn = "How are you feeling today? Tell me about your current emotions or your feelings about the space you are in. I will prescribe a personalized 'Spatial Prescription' for you.";
  const defaultMessageZh = "今天感觉怎么样？告诉我你此刻的情绪，或是你所在空间的感受。我会为你开出一份专属的『空间处方』。";

  // 👇 1. 状态初始化升级：优先从 localStorage 读取历史记录
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("解析历史记录失败", e);
      }
    }
    // 如果没有历史记录，再显示默认欢迎语
    return [{ id: "0", role: "ai", content: isEn ? defaultMessageEn : defaultMessageZh, timestamp: Date.now() }];
  });

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showHistoryOptions, setShowHistoryOptions] = useState(false); // 控制历史选项面板
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 👇 2. 记忆保存升级：每次 messages 更新时，自动同步到 localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // 当用户切换语言且只有第一句默认语时，跟随切换
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === "0") {
      setMessages([{ id: "0", role: "ai", content: isEn ? defaultMessageEn : defaultMessageZh, timestamp: Date.now() }]);
    }
  }, [isEn, messages.length]);

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const isToday = i === 6;
    const level = isToday ? 0 : Math.floor(Math.random() * 4); 
    return { date: d, level, isToday };
  });

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // 加入时间戳
    const newUserMsg: Message = { id: Date.now().toString(), role: "user", content: inputText, timestamp: Date.now() };
    setMessages(prev => [...prev, newUserMsg]);
    setInputText("");
    setIsTyping(true);
    setShowHistoryOptions(false);

    try {
      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_ALIYUN_API_KEY,
        baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
        dangerouslyAllowBrowser: true 
      });

      const prompt = `
        [角色定义]
        你是一位极度共情、温柔如水的“空间疗愈师”。你像一位认识多年的知心好友，声音轻柔，充满包容。你精通亚历山大的15个几何属性，但你从不生硬地说教，而是将它们化作温柔的抚慰。
        
        [对话守则]
        1. 完全的接纳与拥抱：首先，用最柔软的语言接纳用户的任何情绪。
        2. 毫不费力的空间微调：在深深的共情后，轻轻地借用 1-2 个【亚历山大属性】，给出一个极其微小、毫不费力的建议。
        3. 语调限制：像是在耳边的轻语，充满呼吸感与诗意，绝不要像机器或客服。字数请严格控制在 150 字以内。

        🚨 [CRITICAL LANGUAGE INSTRUCTION] 🚨
        You MUST respond entirely in ${isEn ? 'ENGLISH' : 'CHINESE'}. Do not mix languages.
      `;

      const conversationHistory = messages.map(m => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.content
      }));

      const response = await openai.chat.completions.create({
        model: "qwen-max", 
        messages: [
          { role: "system", content: prompt },
          ...conversationHistory as any,
          { role: "user", content: newUserMsg.content }
        ]
      });

      const aiContent = response.choices[0].message.content || (isEn ? "I'm a little distracted right now. Take a deep breath and feel the boundaries of your space." : "抱歉，我此刻有些走神。深呼吸，感受当下的空间边界吧。");
      
      setMessages(prev => [...prev, { id: Date.now().toString(), role: "ai", content: aiContent, timestamp: Date.now() }]);

    } catch (error) {
      console.error("AI Healing Failed:", error);
      const errorMsg = isEn 
        ? "The network is a bit unstable, but that's okay. In this quiet moment, try taking a few deep breaths to find your inner 'Strong Center'." 
        : "网络好像有些波动，但没关系。在这个静谧的时刻，不妨先尝试几个深呼吸，找回内心的『强中心』。";
      setMessages(prev => [...prev, { id: Date.now().toString(), role: "ai", content: errorMsg, timestamp: Date.now() }]);
    } finally {
      setIsTyping(false);
    }
  };

  // 👇 清空历史记录的功能
  const clearHistory = () => {
    if (window.confirm(isEn ? "Are you sure you want to clear all chat history?" : "确定要清空所有疗愈记录吗？一切将重新开始。")) {
      setMessages([{ id: Date.now().toString(), role: "ai", content: isEn ? defaultMessageEn : defaultMessageZh, timestamp: Date.now() }]);
      setShowHistoryOptions(false);
    }
  };

  // 格式化时间的辅助函数
  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString(isEn ? 'en-US' : 'zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="mx-auto max-w-6xl space-y-12">
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-stone-900">{trans.practice.title || (isEn ? "Embodied Practice" : "空间觉知与疗愈")}</h1>
          <p className="mt-4 text-stone-600 max-w-2xl mx-auto">
            {trans.practice.subtitle || (isEn ? "Vitality is not just an intellectual concept, but a felt experience. Use these tools to attune your perception to living structure." : "在物理空间中找回内心的秩序，让建筑的生命力滋养你的情绪。")}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          
          {/* 左侧区域：保持不变 */}
          <div className="lg:col-span-4 space-y-8">
            <Card className="p-8 flex flex-col items-center justify-center bg-white h-[350px]">
              <div className="mb-6 flex items-center gap-2 text-stone-500">
                <Wind className="h-5 w-5" />
                <span className="text-sm font-medium uppercase tracking-widest">{trans.practice.breathing || (isEn ? "Visual Breathing" : "正念呼吸")}</span>
              </div>
              <BreathingCircle isEn={isEn} />
            </Card>

            <Card className="p-6 bg-white">
              <div className="flex items-center gap-2 mb-6 text-stone-800">
                <CalendarIcon className="h-5 w-5 text-teal-600" />
                <h3 className="font-semibold">{isEn ? "Vitality Footprints" : "活力足迹"}</h3>
              </div>
              
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs text-stone-400 font-medium">{isEn ? "Last 7 Days" : "近 7 天情绪轨迹"}</span>
                <span className="text-xs text-stone-400 font-medium flex gap-1 items-center">
                  Low <div className="flex gap-1 mx-1">{[0,1,2,3].map(l => <div key={l} className={cn("w-2 h-2 rounded-sm", getHeatmapColor(l))} />)}</div> High
                </span>
              </div>

              <div className="flex justify-between items-center gap-2 mt-4 bg-stone-50 p-4 rounded-xl border border-stone-100">
                {last7Days.map((day, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <div 
                      className={cn(
                        "w-8 h-8 rounded-md transition-all duration-300 shadow-sm cursor-pointer hover:scale-110",
                        getHeatmapColor(day.level),
                        day.isToday && "ring-2 ring-offset-2 ring-teal-500"
                      )}
                      title={isEn ? `${day.date.toLocaleDateString()} - Level ${day.level}` : `${day.date.toLocaleDateString()} - 活力等级 ${day.level}`}
                    />
                    <span className={cn("text-[10px] font-bold", day.isToday ? "text-teal-700" : "text-stone-400")}>
                      {isEn 
                        ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day.date.getDay()] 
                        : ["日", "一", "二", "三", "四", "五", "六"][day.date.getDay()]}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* 右侧区域：支持本地记忆的 AI 疗愈对话 */}
          <div className="lg:col-span-8">
            <Card className="bg-white flex flex-col h-[700px] shadow-lg border-stone-200 overflow-hidden relative">
              
              <div className="p-6 border-b border-stone-100 bg-stone-50/80 backdrop-blur-sm flex justify-between items-center z-20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-100 rounded-full">
                    <Sparkles className="h-5 w-5 text-teal-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900">{isEn ? "AI Spatial Therapist" : "AI 空间疗愈师"}</h3>
                    <p className="text-xs text-stone-500">{isEn ? "Psychological prescription based on 15 properties" : "基于亚历山大 15 属性的心理处方"}</p>
                  </div>
                </div>
                
                {/* 👇 历史记录管理按钮 */}
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-stone-500 hover:text-stone-900 flex gap-2 items-center"
                    onClick={() => setShowHistoryOptions(!showHistoryOptions)}
                  >
                    <History className="w-4 h-4" />
                    <span className="text-xs font-medium">{isEn ? "History" : "历史"}</span>
                  </Button>
                  
                  {/* 悬浮菜单 */}
                  <AnimatePresence>
                    {showHistoryOptions && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-10 w-48 bg-white border border-stone-100 shadow-xl rounded-xl p-2 z-30"
                      >
                        <div className="px-3 py-2 text-xs text-stone-400 border-b border-stone-50 mb-1">
                          {isEn ? `Saved ${messages.length} messages` : `已为您妥善保管 ${messages.length} 条记录`}
                        </div>
                        <button 
                          onClick={clearHistory}
                          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          {isEn ? "Clear Chat History" : "清空历史重新开始"}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* 聊天记录区域 */}
              <div 
                className="flex-1 overflow-y-auto p-6 space-y-6 bg-stone-50/30"
                onClick={() => setShowHistoryOptions(false)} // 点击空白处关闭菜单
              >
                <div className="text-center text-xs text-stone-400 my-4">
                  {isEn ? "Your chat history is securely saved in this browser." : "所有的情绪轨迹已在这个浏览器中为您安全保存。"}
                </div>

                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={cn(
                        "flex flex-col max-w-[80%]",
                        msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                      )}
                    >
                      <div className={cn(
                        "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                        msg.role === "user" 
                          ? "bg-stone-900 text-stone-50 rounded-br-sm" 
                          : "bg-white border border-stone-200 text-stone-800 rounded-bl-sm"
                      )}>
                        {msg.content}
                      </div>
                      {/* 👇 渲染时间戳 */}
                      <span className="text-[10px] text-stone-400 mt-1.5 px-1">
                        {formatTime(msg.timestamp)}
                      </span>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col mr-auto max-w-[80%]">
                      <div className="p-4 rounded-2xl bg-white border border-stone-200 text-stone-500 rounded-bl-sm flex gap-1 items-center h-[52px]">
                        <motion.div className="w-2 h-2 bg-teal-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                        <motion.div className="w-2 h-2 bg-teal-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                        <motion.div className="w-2 h-2 bg-teal-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* 输入区域 */}
              <div className="p-4 bg-white border-t border-stone-100 z-10" onClick={() => setShowHistoryOptions(false)}>
                <div className="relative flex items-end gap-2 bg-stone-50 rounded-2xl border border-stone-200 p-2 focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-500 transition-all">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder={isEn ? "Write down your feelings to get a spatial prescription..." : "写下你今天的感受，获取空间处方..."}
                    className="w-full bg-transparent resize-none outline-none p-3 text-sm text-stone-800 placeholder:text-stone-400 max-h-[120px]"
                    rows={2}
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={!inputText.trim() || isTyping}
                    className="mb-1 mr-1 rounded-xl bg-teal-600 hover:bg-teal-700 text-white h-10 w-10 p-0 flex shrink-0 shadow-md"
                  >
                    <Send className="h-4 w-4 ml-0.5" />
                  </Button>
                </div>
                <p className="text-center text-[10px] text-stone-400 mt-3 font-medium">
                  {isEn ? "AI provides heuristic suggestions, please combine with actual environment." : "AI 提供启发式建议，请结合实际环境体验。"}
                </p>
              </div>

            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}

// ------ 辅助函数 & 组件 ------

function getHeatmapColor(level: number) {
  switch (level) {
    case 0: return "bg-stone-100 border border-stone-200"; 
    case 1: return "bg-teal-100 border border-teal-200";
    case 2: return "bg-teal-400 border border-teal-500";
    case 3: return "bg-teal-700 border border-teal-800 shadow-inner"; 
    default: return "bg-stone-100";
  }
}

function BreathingCircle({ isEn }: { isEn: boolean }) {
  const [isActive, setIsActive] = useState(false);
  const { trans } = useLanguage();

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative flex items-center justify-center h-48 w-48">
        <motion.div
          className="absolute inset-0 rounded-full bg-teal-50 border border-teal-100"
          animate={isActive ? { scale: [1, 1.4, 1], opacity: [0.8, 0.3, 0.8] } : { scale: 1 }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-4 rounded-full bg-teal-100/50 border border-teal-200"
          animate={isActive ? { scale: [1, 1.2, 1], opacity: [0.9, 0.5, 0.9] } : { scale: 1 }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
         <motion.div
          className="relative h-24 w-24 rounded-full bg-teal-600 shadow-xl flex items-center justify-center text-white cursor-pointer hover:bg-teal-700 transition-colors z-10"
          onClick={() => setIsActive(!isActive)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isActive ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
        </motion.div>
      </div>
      <div className="mt-6 text-sm font-bold tracking-wide text-stone-800">
        {isActive 
          ? (trans.practice.breatheAction || (isEn ? "Inhale... Exhale..." : "吸气...呼气...")) 
          : (trans.practice.startSession || (isEn ? "Start Session" : "点击开始"))}
      </div>
    </div>
  );
}