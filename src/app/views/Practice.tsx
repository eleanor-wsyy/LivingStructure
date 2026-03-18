import React, { useState, useRef, useEffect } from "react";
import { Button, Card, cn } from "@/app/components/ui";
import { 
  Play, Pause, Wind, Send, Calendar as CalendarIcon, 
  Sparkles, History, Trash2, Camera, Scan, AlertCircle, 
  Mic, X, Sun, Zap, Box, Plus 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/app/i18n/LanguageContext";
import OpenAI from "openai";
import { createClient } from '@supabase/supabase-js';

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

  const welcomeEn = "Welcome to the Healing Lab. Upload a photo of your current space, and I will strictly diagnose its geometry and generate a highly specific structural remedy.";
  const welcomeZh = "欢迎来到疗愈实验室。上传一张你所在空间的照片，我将为你进行真实的视觉扫描，指出空间中具体的活力缺陷，并开出物理处方。";

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

      // 🧠 终极疗愈视觉 Prompt：融合多模态视觉与深度共情
      const systemPrompt = `
        You are a profoundly empathetic "Spatial Therapist" blending Christopher Alexander's phenomenology with deep psychological healing.
        You can see the user's uploaded image. Your goal is to heal them through gentle spatial awareness, not to coldly critique their room.

        Follow this 3-step healing procedure:
        1. Empathic Mirroring (The Hug): Gently acknowledge their stated emotion. Look at the image and name 1 subtle detail you actually see (e.g., "the soft light falling on your desk", "the quiet blank wall beside you", "the scattered objects") as a poetic reflection of their inner state. Do NOT judge the space as "messy", "bad", or "flawed". Everything is accepted.
        2. Phenomenological Insight: Softly explain why the space feels this way using ONE of Alexander's 15 properties. (e.g., "The sharp edges here lack 'Roughness', which is why your body feels tense", "Without a 'Strong Center', it's natural that your focus drifts").
        3. Effortless Remedy: Suggest ONE tiny, effortless physical adjustment to restore their connection to the space (e.g., "Bring a cup of warm tea to that corner to create a small center", "Turn the chair slightly to face the window").

        CRITICAL: At the very end of your response, you MUST provide exactly 2 summary tags starting with a hashtag (e.g., #CreateCenter #AddWarmth). Do not put any text after the tags.
        
        Tone: Poetic, incredibly gentle, forgiving, and deeply healing. Like a whisper from a wise, old friend. Max 150 words.
        Language: ${isEn ? 'ENGLISH' : 'CHINESE'}.
      `;

      // 💡 构建真正的多模态视觉请求体
      const userMessageContent: any[] = [];
      if (currentInput) {
        userMessageContent.push({ type: "text", text: currentInput });
      } else {
        userMessageContent.push({ type: "text", text: isEn ? "Please diagnose this space." : "请诊断这个空间。" });
      }
      
      if (userBase64) {
        userMessageContent.push({
          type: "image_url",
          image_url: { url: userBase64 }
        });
      }

      // 注意：这里改用了 qwen-vl-max 视觉大模型！
      const response = await openai.chat.completions.create({
        model: "qwen-vl-max", 
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessageContent }
        ]
      });

      const aiRawContent = response.choices[0].message.content || "";
      
      // 🎯 动态正则提取：把 AI 回复末尾的 #标签 提取出来
      const tagRegex = /#([^\s#]+)/g;
      const extractedTags = [];
      let match;
      while ((match = tagRegex.exec(aiRawContent)) !== null) {
        extractedTags.push(match[1]); // 获取 # 后面的词
      }
      
      // 清除正文里的标签文本，保持界面干净
      const cleanContent = aiRawContent.replace(tagRegex, '').trim();
      const finalPrescription = extractedTags.length > 0 ? extractedTags : (isEn ? ["Create Center", "Add Gradient"] : ["强化中心", "建立边界"]);

      setIsScanning(false);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: "ai", 
        content: cleanContent, 
        timestamp: Date.now(),
        prescription: finalPrescription
      }]);

      // Supabase 上传逻辑...
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
        const todayKey = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`;
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

  const getScanText = () => {
    if (scanStep === 1) return isEn ? "1. Reading 'Felt Sense' as a meter..." : "1. 视觉解析与身体感受量测...";
    if (scanStep === 2) return isEn ? "2. Analyzing 15 Properties & Strong Centers..." : "2. 基于 15 种属性诊断结构缺陷...";
    if (scanStep === 3) return isEn ? "3. Formulating Timeless Way Prescription..." : "3. 生成物理空间修改处方...";
    return "";
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
             <Sparkles className="w-3 h-3" /> Spatial Healing Lab
          </div>
          <h1 className="text-4xl font-serif font-black text-stone-900 italic">
            {isEn ? "The Healing Mirror" : "疗愈之镜"}
          </h1>
          <p className="text-stone-500 max-w-xl mx-auto text-sm leading-relaxed">
            {isEn 
              ? "Upload a photo of your environment. Let the AI apply the Alexander decision-procedure to recalibrate your spatial wholeness." 
              : "上传环境照片或通过语音描述。让真实的视觉 AI 运用亚历山大建筑质量决策流程，为你诊断空间。"}
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

              <div className="flex justify-between items-center gap-2 relative z-10">
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

              <AnimatePresence>
                {showMoodSelector && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 right-0 mt-2 p-4 bg-white border border-stone-200 rounded-2xl shadow-xl z-20"
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
                    <div className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center text-white shadow-lg"><Scan className="w-5 h-5" /></div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-500 rounded-full border-2 border-white" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-stone-900">{isEn ? "Diagnostic Vision" : "诊断视界"}</h3>
                    <div className="flex items-center gap-2">
                      <span className="flex h-1.5 w-1.5 rounded-full bg-teal-500" />
                      <p className="text-[10px] text-stone-400 font-mono uppercase">Qwen-VL Multimodal Active</p>
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
                                <AlertCircle className="w-3 h-3" /> {p}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] text-stone-300 font-mono px-2">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isScanning && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-start gap-4">
                    <div className="relative w-64 h-40 rounded-xl overflow-hidden bg-stone-100 border-2 border-stone-200">
                      <motion.div 
                        className="absolute top-0 left-0 w-full h-1 bg-teal-400 shadow-[0_0_15px_rgba(45,212,191,1)] z-10"
                        animate={{ top: ["0%", "100%", "0%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-stone-400">
                        <Scan className="w-8 h-8 animate-pulse" />
                      </div>
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
                           <p className="text-[10px] text-stone-400 font-bold uppercase">{isEn ? "Ready for procedure" : "图像视觉接入就绪"}</p>
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

                      <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder={isEn ? "Upload photo or tap mic to speak..." : "上传照片，或点击麦克风说出你的感受..."}
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
        {isActive ? (isEn ? "Synchronizing..." : "正在同步频率...") : (isEn ? "Start Alignment" : "开始视觉校准")}
      </p>
    </div>
  );
}