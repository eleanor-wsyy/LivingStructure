import React, { useState, useRef, useEffect } from "react";
import { Button, Card, cn } from "@/app/components/ui";
import { 
  Play, Pause, Wind, Send, Calendar as CalendarIcon, 
  Sparkles, History, Trash2, Camera, Scan, AlertCircle, 
  Mic, X, Sun, Zap, Box, Plus, FileText, Loader2, Quote, Heart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/app/i18n/LanguageContext";
import OpenAI from "openai";
import { createClient } from '@supabase/supabase-js';

// 初始化 Supabase 客户端
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  image?: string; 
  timestamp: number;
  prescription?: string[]; 
}

const STORAGE_KEY = "vitality_healing_chat_history";
const MOOD_STORAGE_KEY = "vitality_healing_mood_history";

const MOOD_OPTIONS = [
  { id: "living", icon: Sun, color: "text-teal-500", bg: "bg-teal-50", border: "border-teal-200", labelEn: "Living", labelZh: "充满生机" },
  { id: "calm", icon: Wind, color: "text-sky-500", bg: "bg-sky-50", border: "border-sky-200", labelEn: "Calm", labelZh: "宁静安和" },
  { id: "fragmented", icon: Zap, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200", labelEn: "Fragmented", labelZh: "割裂混乱" },
  { id: "rigid", icon: Box, color: "text-stone-500", bg: "bg-stone-100", border: "border-stone-300", labelEn: "Rigid", labelZh: "死板压抑" }
];

export function Practice() {
  const { trans, language } = useLanguage();
  const isEn = language === 'en';

  // 💡 疗愈感文案升级：强调有机的空间观与内外同构
  const welcomeEn = "Welcome to the Wholeness Studio. Space is not a lifeless box, but a living mirror of your mind. Share a photo of a corner you're in, and let's gently awaken its livingness together.";
  const welcomeZh = "欢迎来到整体性空间疗愈所。空间不是死寂的盒子，而是你内心的镜像。分享一张你所在角落的照片，让我们一起温柔地唤醒它的活力。";

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) try { return JSON.parse(saved); } catch (e) { console.error(e); }
    return [{ id: "0", role: "ai", content: isEn ? welcomeEn : welcomeZh, timestamp: Date.now() }];
  });

  const [moodHistory, setMoodHistory] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem(MOOD_STORAGE_KEY);
    if (saved) try { return JSON.parse(saved); } catch(e) {}
    return {};
  });
  const [showMoodSelector, setShowMoodSelector] = useState(false);

  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState<string | null>(null);

  const [inputText, setInputText] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const base64ImageRef = useRef<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0); 
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const startTextRef = useRef("");

  useEffect(() => { 
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); 
    } catch (e) {
      const safeMessages = messages.map(m => ({ ...m, image: undefined }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(safeMessages));
    }
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(moodHistory));
  }, [moodHistory]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onstart = () => { startTextRef.current = inputText; };
        recognitionRef.current.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          setInputText(startTextRef.current + (startTextRef.current ? " " : "") + currentTranscript);
        };
        recognitionRef.current.onerror = () => setIsListening(false);
        recognitionRef.current.onend = () => setIsListening(false);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.lang = isEn ? 'en-US' : 'zh-CN';
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert(isEn ? "Your browser does not support voice input." : "当前浏览器不支持语音识别。");
      }
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800; 
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        
        base64ImageRef.current = canvas.toDataURL("image/jpeg", 0.7); 
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setPreviewImage(null);
    base64ImageRef.current = null;
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const generateLast7Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateKey = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      const dayName = isEn 
        ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()]
        : ["日", "一", "二", "三", "四", "五", "六"][d.getDay()];
      days.push({ dateKey, dayName, isToday: i === 0 });
    }
    return days;
  };

  const last7Days = generateLast7Days();
  const todayKey = last7Days[last7Days.length - 1].dateKey;

  const handleSendMessage = async () => {
    if (!inputText.trim() && !previewImage) return;

    const userBase64 = base64ImageRef.current;
    const currentInput = inputText; 
    
    const newUserMsg: Message = { 
      id: Date.now().toString(), 
      role: "user", 
      content: inputText, 
      image: userBase64 || undefined,
      timestamp: Date.now() 
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputText("");
    clearImage(); 
    setIsTyping(true);
    
    if (newUserMsg.image) {
      setIsScanning(true);
      setScanStep(1);
      setTimeout(() => setScanStep(2), 1000);
      setTimeout(() => setScanStep(3), 2500);
    }

    try {
      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_ALIYUN_API_KEY,
        baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
        dangerouslyAllowBrowser: true 
      });

      const recentMoodsString = last7Days.map(day => {
        const moodId = moodHistory[day.dateKey];
        const mood = MOOD_OPTIONS.find(m => m.id === moodId);
        return mood ? `${day.dayName}: ${isEn ? mood.labelEn : mood.labelZh}` : null;
      }).filter(Boolean).join(", ");

      const memoryContext = recentMoodsString 
        ? `Here is the user's emotional state over the past few days: [${recentMoodsString}]. Use this memory to softly track their inner wholeness.` 
        : `This is the user's first time sharing.`;

      // 💡 系统提示词升级：彻底贯彻 Wholeness Therapy 与 Organic View of Space
      const systemPrompt = `
        You are a profoundly empathetic "Wholeness Therapist" practicing the "Organic View of Space" based on Christopher Alexander's theory.
        You understand that SPACE IS NOT A DEAD BOX. It is a living entity. Healing the geometry of the room heals the person's inner self.
        
        ${memoryContext}

        Follow this 3-step Wholeness Therapy procedure:
        1. Empathic Mirroring: Look at the image. The space is a mirror of their mind. Connect what you see to their past feelings (if any). Validate their feelings with immense gentleness (e.g., "I see the quiet corner by the window... it's okay if things feel fragmented right now"). Do NOT use clinical or diagnostic words like "flawed" or "messy".
        2. Uncovering the Living Structure: Softly explain the energy of the space using ONE of Alexander's 15 properties. Frame it not as a fault, but as an opportunity for the space to "breathe" better.
        3. The Healing Act: Suggest ONE tiny, effortless physical adjustment (e.g., "Just placing a warm lamp there", "Opening the curtain a little"). Explain how this tiny geometric change will restore their inner peace and "Wholeness".

        CRITICAL: At the very end of your response, provide exactly 2 poetic summary tags starting with a hashtag (e.g., #EmbraceTheLight #InnerCenter). Do not put any text after the tags.
        
        Tone: Poetic, incredibly gentle, spiritual, deeply validating. Like a whisper from a wise, old friend who understands that everything is connected. Max 150 words.
        Language: ${isEn ? 'ENGLISH' : 'CHINESE'}.
      `;

      const userMessageContent: any[] = [];
      if (currentInput) {
        userMessageContent.push({ type: "text", text: currentInput });
      } else {
        userMessageContent.push({ type: "text", text: isEn ? "Please help me feel the space." : "请帮我感受这个空间。" });
      }
      
      if (userBase64) {
        userMessageContent.push({
          type: "image_url",
          image_url: { url: userBase64 }
        });
      }

      const response = await openai.chat.completions.create({
        model: "qwen-vl-max", 
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessageContent }
        ]
      });

      const aiRawContent = response.choices[0].message.content || "";
      
      const tagRegex = /#([^\s#]+)/g;
      const extractedTags = [];
      let match;
      while ((match = tagRegex.exec(aiRawContent)) !== null) {
        extractedTags.push(match[1]); 
      }
      
      const cleanContent = aiRawContent.replace(tagRegex, '').trim();
      const finalPrescription = extractedTags.length > 0 ? extractedTags : (isEn ? ["Awaken Wholeness", "Gentle Boundary"] : ["唤醒整体性", "温柔的边界"]);

      setIsScanning(false);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: "ai", 
        content: cleanContent, 
        timestamp: Date.now(),
        prescription: finalPrescription
      }]);

      try {
        let publicImageUrl = null;
        if (userBase64) {
          const res = await fetch(userBase64);
          const blob = await res.blob();
          const fileName = `space_${Date.now()}.jpg`;
          const { data: uploadData, error: uploadError } = await supabase.storage.from('healing_images').upload(fileName, blob, { contentType: 'image/jpeg' });
          if (!uploadError && uploadData) {
            const { data } = supabase.storage.from('healing_images').getPublicUrl(fileName);
            publicImageUrl = data.publicUrl;
          }
        }
        const currentMood = moodHistory[todayKey] || 'Not Selected';
        await supabase.from('healing_records').insert([{
          user_mood: currentMood,
          image_url: publicImageUrl,
          user_text: currentInput,
          ai_prescription: finalPrescription
        }]);
      } catch (err) {
        console.error("Supabase Sync Failed:", err);
      }

    } catch (error) {
      console.error(error);
      setIsScanning(false);
      setIsTyping(false);
    } finally {
      setIsTyping(false);
    }
  };

  const generateWeeklyReport = async () => {
    setIsGeneratingReport(true);
    setWeeklyReport(null);

    try {
      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_ALIYUN_API_KEY,
        baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
        dangerouslyAllowBrowser: true 
      });

      const recentMoodsString = last7Days.map(day => {
        const moodId = moodHistory[day.dateKey];
        const mood = MOOD_OPTIONS.find(m => m.id === moodId);
        return mood ? `${day.dateKey} (${day.dayName}): ${isEn ? mood.labelEn : mood.labelZh}` : null;
      }).filter(Boolean).join("\n");

      if (!recentMoodsString) {
        setWeeklyReport(isEn 
          ? "You haven't recorded enough moods this week. Try recording how your space feels today!" 
          : "你这周还没有记录过空间心境哦。去点亮今天的状态，再来生成报告吧！");
        setIsGeneratingReport(false);
        return;
      }

      const prompt = `
        You are an insightful and poetic "Wholeness Therapist". 
        Please generate a "Weekly Spatial & Emotional Resonance Report" for the user based on their mood records over the past 7 days.
        
        User's 7-day records:
        ${recentMoodsString}

        Task:
        Write a beautiful, deeply comforting 2-paragraph summary. 
        - Paragraph 1: Observe the pattern in their emotions. Validate their feelings. Remind them that space and mind are connected.
        - Paragraph 2: Connect their emotional journey to the "Living Structure". Encourage them to keep nurturing the Wholeness in their room, because as they heal their space, they heal themselves.
        
        Language: STRICTLY ${isEn ? 'ENGLISH' : 'CHINESE'}. Do NOT output any other language.
      `;

      const response = await openai.chat.completions.create({
        model: "qwen-max", 
        messages: [{ role: "user", content: prompt }]
      });

      setWeeklyReport(response.choices[0].message.content || "");

    } catch (error) {
      console.error(error);
      setWeeklyReport(isEn ? "Failed to generate report. Please try again later." : "生成报告失败，请稍后再试。");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // 💡 “扫描”文案柔化
  const getScanText = () => {
    if (scanStep === 1) return isEn ? "1. Feeling the space's resonance..." : "1. 感受空间的呼吸与共振...";
    if (scanStep === 2) return isEn ? "2. Discovering hidden wholeness..." : "2. 寻找潜藏的活力结构...";
    if (scanStep === 3) return isEn ? "3. Gently weaving the healing remedy..." : "3. 为你凝练温柔的空间建议...";
    return "";
  };

  const handleMoodSelect = (moodId: string) => {
    setMoodHistory(prev => ({ ...prev, [todayKey]: moodId }));
    setShowMoodSelector(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 selection:bg-teal-100">
      <div className="mx-auto max-w-7xl space-y-10">
        
        {/* Header */}
        <header className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-[10px] font-bold text-teal-600 uppercase tracking-widest">
             <Heart className="w-3 h-3 text-red-400" /> Wholeness Therapy
          </div>
          <h1 className="text-4xl font-serif font-black text-stone-900 italic">
            {isEn ? "The Healing Mirror" : "愈合之镜"}
          </h1>
          <p className="text-stone-500 max-w-xl mx-auto text-sm leading-relaxed">
            {isEn 
              ? "Upload a photo or describe your environment. We will use the organic view of space to help you find wholeness. Healing the room is healing yourself." 
              : "上传环境照片或诉说感受。我们将运用“有机空间观”助你找回内心的整体性。治愈空间，即是治愈自我。"}
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-12 items-start">
          
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-8 bg-white/50 backdrop-blur border-stone-200 shadow-sm flex flex-col items-center">
              <div className="mb-8 flex items-center gap-2 text-stone-400">
                <Wind className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{isEn ? "Visual Resonance" : "视觉共振"}</span>
              </div>
              <BreathingCircle isEn={isEn} />
            </Card>

            <Card className="p-6 bg-white/50 backdrop-blur border-stone-200 shadow-sm relative overflow-visible">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-stone-400" />
                  <h3 className="text-sm font-bold text-stone-700">{isEn ? "Spatial Mood" : "空间心境"}</h3>
                </div>
              </div>

              <div className="flex justify-between items-center gap-2 relative z-10 mb-8">
                {last7Days.map((day) => {
                  const moodId = moodHistory[day.dateKey];
                  const mood = MOOD_OPTIONS.find(m => m.id === moodId);
                  return (
                    <div key={day.dateKey} className="flex flex-col items-center gap-2 relative">
                      <div 
                        onClick={() => { if (day.isToday) setShowMoodSelector(!showMoodSelector); }}
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                          day.isToday ? "cursor-pointer ring-2 ring-offset-2 ring-stone-200 hover:ring-teal-400" : "",
                          mood ? mood.bg : "bg-stone-100 border border-stone-200",
                          day.isToday && !mood && "animate-pulse border-dashed border-teal-300 bg-teal-50/50"
                        )}
                      >
                        {mood ? <mood.icon className={cn("w-4 h-4", mood.color)} /> : (day.isToday ? <Plus className="w-4 h-4 text-teal-400" /> : <div className="w-1.5 h-1.5 rounded-full bg-stone-300" />)}
                      </div>
                      <span className={cn("text-[10px] font-bold", day.isToday ? "text-teal-600" : "text-stone-400")}>{day.dayName}</span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-stone-100 pt-6">
                <button
                  onClick={generateWeeklyReport}
                  disabled={isGeneratingReport}
                  className="w-full bg-stone-900 text-white hover:bg-teal-600 rounded-xl py-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  {isGeneratingReport ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> {isEn ? "Generating..." : "正在倾听记忆..."}</>
                  ) : (
                    <><FileText className="w-4 h-4" /> {isEn ? "Generate Weekly Insights" : "生成本周疗愈报告"}</>
                  )}
                </button>
              </div>

              <AnimatePresence>
                {showMoodSelector && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-20 left-0 right-0 mt-2 p-4 bg-white border border-stone-200 rounded-2xl shadow-xl z-20"
                  >
                    <p className="text-xs text-stone-500 font-bold mb-3 text-center uppercase tracking-widest">{isEn ? "How does your space feel today?" : "此刻的空间让你感觉如何？"}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {MOOD_OPTIONS.map(mood => (
                        <button key={mood.id} onClick={() => handleMoodSelect(mood.id)} className={cn("flex items-center gap-3 p-3 rounded-xl border transition-all hover:scale-[1.02] active:scale-95", mood.bg, mood.border)}>
                          <mood.icon className={cn("w-4 h-4", mood.color)} />
                          <span className={cn("text-xs font-bold", mood.color)}>{isEn ? mood.labelEn : mood.labelZh}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>

          <div className="lg:col-span-8">
            <Card className="bg-white h-[750px] shadow-2xl border-stone-200 flex flex-col overflow-hidden relative">
              
              <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center text-white shadow-lg"><Sparkles className="w-5 h-5 text-teal-300" /></div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-500 rounded-full border-2 border-white" />
                  </div>
                  <div>
                    {/* 💡 从冷硬的“诊断视界”变成“空间共情” */}
                    <h3 className="font-serif font-bold text-stone-900">{isEn ? "Spatial Empathy" : "空间共情"}</h3>
                    <div className="flex items-center gap-2">
                      <span className="flex h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
                      <p className="text-[10px] text-stone-400 font-mono uppercase">{isEn ? "Wholeness Awareness Active" : "整体性感知已激活"}</p>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => { if(window.confirm('Reset?')) setMessages([{ id: "0", role: "ai", content: isEn ? welcomeEn : welcomeZh, timestamp: Date.now() }]); }} className="text-stone-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div key={msg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={cn("flex flex-col gap-3", msg.role === "user" ? "items-end" : "items-start")}>
                      {msg.image && (
                        <div className="relative group max-w-sm rounded-2xl overflow-hidden border-4 border-white shadow-xl rotate-1">
                          <img src={msg.image} className="w-full h-auto object-cover" alt="Upload" />
                          <div className="absolute top-2 left-2 bg-stone-900/80 backdrop-blur px-2 py-1 rounded text-[8px] text-white font-bold uppercase tracking-widest flex items-center gap-1">
                            <Camera className="w-3 h-3" /> Input Source
                          </div>
                        </div>
                      )}

                      <div className={cn(
                        "max-w-[85%] p-6 rounded-3xl text-sm leading-loose shadow-sm",
                        msg.role === "user" ? "bg-stone-900 text-stone-50 rounded-br-none font-sans" : "bg-white border border-stone-200 text-stone-800 rounded-bl-none font-serif"
                      )}>
                        <div className="whitespace-pre-line">{msg.content}</div>

                        {msg.prescription && msg.prescription.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-stone-100 flex flex-wrap gap-2">
                            {msg.prescription.map(p => (
                              <span key={p} className="px-2 py-1 bg-teal-50 text-teal-700 text-[10px] font-bold uppercase tracking-wider rounded border border-teal-100 flex items-center gap-1 shadow-sm">
                                <Heart className="w-3 h-3 text-red-300" /> {p}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] text-stone-300 font-mono px-2">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* 💡 扫描动画柔化，去除扫码枪的压迫感 */}
                {isScanning && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-start gap-4">
                    <div className="relative w-64 h-40 rounded-xl overflow-hidden bg-stone-50 border border-teal-100 flex items-center justify-center">
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-t from-teal-100/50 to-transparent"
                        animate={{ opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <Sparkles className="w-8 h-8 text-teal-300 animate-pulse z-10" />
                    </div>
                    <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">{getScanText()}</p>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-6 bg-stone-50/80 backdrop-blur-md border-t border-stone-200">
                <div className="flex flex-col gap-4 max-w-3xl mx-auto">
                  <div className="relative flex flex-col bg-white rounded-3xl border border-stone-200 shadow-sm focus-within:shadow-xl focus-within:border-teal-400 transition-all p-2">
                    
                    <AnimatePresence>
                      {previewImage && (
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} className="p-2 flex items-center gap-3">
                           <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-md">
                              <img src={previewImage} className="w-full h-full object-cover" alt="selected" />
                              <button onClick={clearImage} className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-lg"><X size={12} /></button>
                           </div>
                           <p className="text-[10px] text-stone-400 font-bold uppercase">{isEn ? "Ready to heal" : "准备倾听"}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex items-end">
                      <button onClick={() => fileInputRef.current?.click()} className="p-3 text-stone-400 hover:text-teal-600 transition-colors" title={isEn ? "Upload Photo" : "上传照片"}>
                        <Camera className="w-5 h-5" />
                      </button>
                      
                      <button 
                        onClick={toggleListening} 
                        className={cn("p-3 transition-colors", isListening ? "text-red-500 animate-pulse" : "text-stone-400 hover:text-teal-600")}
                        title={isEn ? "Voice Input" : "语音输入"}
                      >
                        <Mic className="w-5 h-5" />
                      </button>

                      {/* 💡 柔化输入框文案 */}
                      <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder={isEn ? "Share a corner of your space, or whisper your feelings..." : "分享你此刻的空间，或诉说你的感受..."}
                        className="flex-1 bg-transparent resize-none outline-none p-3 text-sm text-stone-800 placeholder:text-stone-300 h-12 py-3"
                        rows={1}
                      />
                      <button onClick={handleSendMessage} disabled={(!inputText.trim() && !previewImage) || isTyping} className="m-1 rounded-2xl bg-stone-900 hover:bg-teal-600 text-white h-10 w-10 flex items-center justify-center transition-all shadow-md active:scale-90"><Send className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageSelect} />
                </div>
              </div>

            </Card>
          </div>

        </div>
      </div>

      <AnimatePresence>
        {weeklyReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" 
              onClick={() => setWeeklyReport(null)}
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-stone-200/60"
            >
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-teal-50 via-stone-50 to-white z-0" />
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-30 pointer-events-none z-0" />

              <button onClick={() => setWeeklyReport(null)} className="absolute top-6 right-6 text-stone-400 hover:text-stone-900 z-20 bg-white/50 backdrop-blur rounded-full p-1 transition-colors"><X className="w-5 h-5" /></button>

              <div className="relative z-10 flex flex-col max-h-[80vh]">
                <div className="px-8 pt-10 pb-6 text-center shrink-0">
                  <div className="mx-auto w-12 h-12 rounded-full bg-white shadow-sm border border-teal-100 flex items-center justify-center mb-4">
                     <Sparkles className="w-5 h-5 text-teal-500" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif font-black text-stone-800 tracking-wide">
                    {isEn ? "Weekly Resonance" : "空间与心灵共振周报"}
                  </h2>
                  <div className="flex items-center justify-center gap-2 mt-3 text-[10px] font-mono text-stone-400 uppercase tracking-widest">
                    <CalendarIcon className="w-3 h-3" /> {new Date().toLocaleDateString()}
                  </div>
                </div>

                <div className="px-8 md:px-12 pb-8 overflow-y-auto flex-1 scrollbar-hide">
                  <div className="relative">
                    <Quote className="absolute -top-2 -left-4 w-8 h-8 text-teal-500/10 rotate-180" />
                    <div className="text-stone-600 leading-loose font-serif whitespace-pre-line text-sm md:text-base text-justify relative z-10">
                      {weeklyReport}
                    </div>
                    <Quote className="absolute -bottom-4 -right-4 w-8 h-8 text-teal-500/10" />
                  </div>
                </div>

                <div className="px-8 py-6 bg-stone-50/80 backdrop-blur border-t border-stone-100 flex justify-center shrink-0">
                  <Button onClick={() => setWeeklyReport(null)} className="bg-stone-900 hover:bg-teal-600 text-white rounded-full px-10 py-5 shadow-md transition-all active:scale-95">
                    {isEn ? "Embrace the Healing" : "收下这份疗愈"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

function BreathingCircle({ isEn }: { isEn: boolean }) {
  const [isActive, setIsActive] = useState(false);
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-44 w-44 flex items-center justify-center">
        <motion.div className="absolute inset-0 rounded-full border border-teal-100 bg-teal-50/30" animate={isActive ? { scale: [1, 1.3, 1], opacity: [0.6, 0.2, 0.6] } : {}} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="w-24 h-24 rounded-full bg-stone-900 flex items-center justify-center text-white cursor-pointer shadow-2xl z-10" onClick={() => setIsActive(!isActive)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
        </motion.div>
      </div>
      <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-stone-500">
        {/* 💡 按钮提示柔化 */}
        {isActive ? (isEn ? "Breathing with the space..." : "与空间同频呼吸...") : (isEn ? "Start Resonance" : "开始共振")}
      </p>
    </div>
  );
}