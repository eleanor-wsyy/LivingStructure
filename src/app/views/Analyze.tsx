import React, { useState, useEffect } from "react";
import { Button, Card, cn } from "@/app/components/ui";
import { Upload, Loader2, Plus, X, BookOpen, Sparkles, Image as ImageIcon, MessageSquare, Copy, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; 
import { useLanguage } from "@/app/i18n/LanguageContext";

// 👇 引入 Supabase 客户端
import { createClient } from '@supabase/supabase-js';

// 初始化 Supabase 客户端 (安全读取 .env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function Analyze() {
  const [view, setView] = useState<"diagnostic" | "lab">("diagnostic");
  const [step, setStep] = useState<"upload" | "processing" | "results">("upload");
  const [images, setImages] = useState<string[]>([]); 
  const [userIntent, setUserIntent] = useState<string>(""); 
  const [analysisResult, setAnalysisResult] = useState<any>(null); 
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [retryCount, setRetryCount] = useState<number>(0);
  
  // --- Prompt Lab State ---
  const [skeleton, setSkeleton] = useState("");
  const [properties, setProperties] = useState("");
  const [detail, setDetail] = useState("");
  const [useScaling, setUseScaling] = useState(true);
  const [copied, setCopied] = useState(false);
  const [labImage, setLabImage] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  
  const { trans, language } = useLanguage();
  const isEn = language === 'en';

  // 初始化 Prompt Lab 默认值
  useEffect(() => {
    setSkeleton(isEn ? "A centralized courtyard with octagonal symmetry" : "具有八角对称性的中心庭院");
    setProperties(isEn ? "Positive space, deep interlock, local symmetries" : "正空间，深度交织，局部对称");
    setDetail(isEn ? "Fractal wood joinery, recursive floral patterns" : "分形木构件，递归花卉图案");
  }, [isEn]);

  const generateFullPrompt = () => {
    const p = trans.analyze.promptLab;
    const scalingClause = useScaling ? "\n[Mathematical Principle]: Follow the scaling law: far more smalls than larges. Ensure a recursive hierarchy where small details outnumber large structures by a factor of 3^n." : "";

    return `[Hierarchical Line Drawing Task]
Role: Master Architectural Illustrator
Goal: Generate a living structure drawing with clear hierarchical depth.

${p.layer1}: ${skeleton} (Line Weight: 2.0pt, Thick)
${p.layer2}: ${properties} (Line Weight: 1.0pt, Medium)
${p.layer3}: ${detail} (Line Weight: 0.5pt, Thin)
${scalingClause}

Final Instruction: Compose these layers into a single coherent image that feels 'alive'. Use clean black lines on a white background.`;
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generateFullPrompt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLabFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        setLabImage(compressedBase64);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const startHierarchyExtraction = async () => {
    if (!labImage) return;
    setIsExtracting(true);

    try {
      const [header, base64Data] = labImage.split(',');
      const mimeType = header.split(':')[1].split(';')[0];
      const imagePayload = { mimeType, base64Data };

      const targetLanguage = isEn ? "English" : "Simplified Chinese (简体中文)";

      const extractionPrompt = `
        [Role]
        You are an expert architectural analyst.
        
        [Task]
        Analyze the provided image and perform a "Hierarchical Structural Extraction" based on Christopher Alexander's Living Structure theory and the methodology of "Hierarchical Line Drawing".
        
        [Output Format]
        Return ONLY a JSON object with exactly these three keys:
        - "skeleton": Describe the primary wholeness and macro-scale structure (thick lines).
        - "properties": Describe the centers, local symmetries, and medium-scale structures (medium lines).
        - "detail": Describe the recursive small-scale details and fractal patterns (thin lines).
        
        [Language Rule]
        Respond in ${targetLanguage}. Keep descriptions concise but academic (max 20 words per field).
      `;

      const { data, error } = await supabase.functions.invoke('ai-gateway', {
        body: { 
          prompt: extractionPrompt,
          images: [imagePayload],
          model: 'gemini' 
        }
      });

      if (error) throw new Error(error.message);

      const parsed = safeExtractJSON(data.reply || "{}");
      if (parsed) {
        if (parsed.skeleton) setSkeleton(parsed.skeleton);
        if (parsed.properties) setProperties(parsed.properties);
        if (parsed.detail) setDetail(parsed.detail);
      }
    } catch (err) {
      console.error("Extraction failed:", err);
      alert(isEn ? "Failed to extract hierarchy. Please try again." : "层级提取失败，请重试。");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
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
          
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
          setImages(prev => {
            const newImages = [...prev, compressedBase64];
            return newImages.slice(0, 2);
          });
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const loadDefaultExamples = async () => {
    try {
      const DEFAULT_URLS = ["/images/Echoes.png", "/images/ENEG.png"]; 
      
      const base64Images = await Promise.all(DEFAULT_URLS.map(async url => {
        const res = await fetch(url);
        const blob = await res.blob();
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      }));
      
      setImages(base64Images);
      // 根据语言设置默认的提示语
      setUserIntent(isEn ? "Please compare these two images: which one has a higher degree of living structure?" : "请帮我对比这两张图，哪一张更符合活力与美感的标准？");
    } catch (error) {
      console.warn("未找到默认图片，等待用户自行上传。");
    }
  };

  useEffect(() => {
    loadDefaultExamples();
  }, [isEn]); // 当语言切换时，也可以重新加载默认 intent

  const safeText = (val: any, fallback = "暂无数据...") => {
    if (val === undefined || val === null) return fallback;
    if (typeof val === 'string' || typeof val === 'number') return String(val);
    try { return JSON.stringify(val); } catch (e) { return fallback; }
  };

  const safeExtractJSON = (text: string) => {
    try { return JSON.parse(text); } 
    catch (e) {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        try { return JSON.parse(match[0]); } catch (e2) { return null; }
      }
      return null;
    }
  };

  // 👇 动态双语的 startAnalysis 函数
  const startAnalysis = async () => {
    if (images.length === 0) return;
    setStep("processing");
    setSelectedIndex(0); 
    setRetryCount(0);

    try {
      // 处理前端 Base64 图片
      const imagePayloads = images.map(img => {
        const [header, base64Data] = img.split(',');
        const mimeType = header.split(':')[1].split(';')[0];
        return { mimeType, base64Data };
      });

      const isCompare = images.length === 2;

      // 🏆 动态语言变量
      const targetLanguage = isEn ? "English" : "Simplified Chinese (简体中文)";
      
      // 🏆 动态属性名称（确保前端 UI 显示的语言也是对的）
      const attributeNames = isEn 
        ? "1. Levels of Scale  2. Strong Centers  3. Boundaries  4. Alternating Repetition  5. Positive Space  6. Good Shape  7. Local Symmetries  8. Deep Interlock and Ambiguity  9. Contrast  10. Gradients  11. Roughness  12. Echoes  13. The Void  14. Simplicity and Inner Calm  15. Not Separateness"
        : "1.尺度层次 2.强中心 3.边界 4.交替重复 5.正空间 6.良好形状 7.局部对称 8.深度交织与模糊性 9.对比 10.渐变 11.粗糙性 12.共鸣 13.虚空 14.简洁与内在平静 15.非分离性";

      // 核心 Prompt：学术内核用英文定义，输出要求根据 targetLanguage 动态切换
      const promptText = `
        [Role Definition]
        You are an expert architectural theorist and diagnostician specializing in Christopher Alexander's "The Nature of Order", "Living Structure", and "Degree of Beauty". 
        Your analysis MUST be deep, academic, and rooted in the concepts of "Wholeness" and overlapping "Centers". Do not just describe shapes; analyze how spatial relationships create a profound sense of life.

        🚨 [Core Judgement Rules] 🚨
        1. "Degree of Beauty" (B) strictly depends on the presence of the 15 geometric properties.
        2. STRICT BINARY SCORING: 1 (Present, strengthening the Wholeness), 0 (Absent or disjointed). No partial scores!
        3. 🌐 LANGUAGE RULE: ALL your generated JSON values (analysis, explanations, advice, and attribute names) MUST be written in fluent ${targetLanguage}.
        4. ⚡ PERFORMANCE RULE: Keep ALL text fields and "desc" explanations extremely short and concise (max 10-15 words). This is critical to prevent system timeouts.

        [The 15 Properties Map (You MUST use these exact terms for the "name" field in your JSON)]
        ${attributeNames}

        [User Specific Intent]
        User asks: "${userIntent || 'Please provide a standard objective analysis.'}"
        You must directly answer this intent in your "core_evaluation".

        [Task]
        ${isCompare ? "The user uploaded 2 images for comparison. Analyze which one possesses a higher degree of life and why." : "Analyze the living structure of this single image and calculate its degree of beauty."}

        OUTPUT STRICTLY AS A JSON OBJECT. STRUCTURE EXACTLY AS FOLLOWS (but translate the values into ${targetLanguage}):
        {
          "winner_declaration": "${isCompare ? 'State which image has a higher degree of life.' : 'State the core theoretical verdict.'}",
          "core_evaluation": "Deep architectural analysis addressing the user's intent. Focus on Centers and Wholeness.",
          "expert_footnote": "Quote or reference a specific concept from 'The Nature of Order' to support your claim.",
          "visual_decoding": "Decode the visual and structural patterns...",
          "personal_perspective": "Emotional, spatial feeling, and psychological impact...",
          "action_advice_urban": "Macro-level structural improvement strategy...",
          "action_advice_personal": "Micro-level geometric optimization advice...",
          "summary": "One concise, profound academic summary.",
          "image_stats": [
            {
              "all_attributes": [
                {"name": "${isEn ? 'Levels of Scale' : '尺度层次'}", "score": 1, "desc": "1: Present. [Explain how it manifests in ${targetLanguage}]"},
                {"name": "${isEn ? 'Strong Centers' : '强中心'}", "score": 0, "desc": "0: Absent. [Explain why the center is weak in ${targetLanguage}]"},
                {"name": "${isEn ? 'Boundaries' : '边界'}", "score": 1, "desc": "..."}
                // ... Output ALL 15 properties.
              ]
            }${isCompare ? `,
            {
              "all_attributes": [
                {"name": "${isEn ? 'Levels of Scale' : '尺度层次'}", "score": 0, "desc": "..."},
                {"name": "${isEn ? 'Strong Centers' : '强中心'}", "score": 1, "desc": "..."}
                // ... Output all 15.
              ]
            }
            ` : ""}
          ]
        }
      `;

      // 引入轻量重试机制，最多重试 1 次 (防止过长等待)
      let parsedData = null;
      let attempt = 0;
      const maxRetries = 1;
      let lastError = null;

      while (attempt <= maxRetries) {
        try {
          // 通过 Supabase 中转站调用 Gemini
          const { data, error } = await supabase.functions.invoke('ai-gateway', {
            body: { 
              prompt: promptText,
              images: imagePayloads,
              model: 'gemini' 
            }
          });

          if (error) {
            throw new Error(error.message || "请求中转站失败");
          }

          // 提取回复内容并进行 JSON 解析
          const responseText = data.reply || "{}";
          parsedData = safeExtractJSON(responseText);
          
          if (!parsedData) throw new Error("AI 数据格式错乱");

          // 成功则跳出循环
          break;
        } catch (err: any) {
          lastError = err;
          attempt++;
          if (attempt <= maxRetries) {
            console.warn(`第 ${attempt} 次尝试失败，正在进行重试...`, err);
            setRetryCount(attempt);
            // 等待 1.5 秒后重试，避免瞬间连续请求
            await new Promise(resolve => setTimeout(resolve, 1500));
          }
        }
      }

      if (!parsedData) {
        throw lastError || new Error("多次尝试后分析依然失败");
      }

      setAnalysisResult(parsedData);
      setStep("results");

    } catch (error: any) {
      console.error("AI 分析失败:", error);
      
      // 友好的报错文案 (修复了转义字符问题)
      const errorMsgEn = "The AI expert is thinking too deeply and encountered a timeout. Please try again.";
      const errorMsgZh = "AI 专家思考过于深入导致连接超时，或者网络遇到波动。\n不要灰心，请再试一次！";
      
      alert(`⚠️ ${isEn ? 'Analysis Interrupted' : '诊断中断'}\n\n${isEn ? errorMsgEn : errorMsgZh}\n\n(Error: ${error.message})`);
      setStep("upload");
    }
  };

  const currentStats = analysisResult?.image_stats?.[selectedIndex] || analysisResult;
  
  // 🛡️ 强制防呆逻辑：重新统计得分为 1 的属性个数
  const beautyScore = Array.isArray(currentStats?.all_attributes) 
    ? currentStats.all_attributes.filter((attr: any) => Number(attr.score) >= 1).length 
    : 0;

  return (
    <div className="min-h-screen bg-stone-50 py-6 md:py-12 px-4 sm:px-6 lg:px-8 font-sans overflow-x-hidden">
      <div className="mx-auto max-w-7xl">
        
        <div className="flex flex-col items-center mb-8 md:mb-12">
          <div className="flex bg-stone-200/50 p-1 rounded-full mb-8">
            <button 
              onClick={() => setView("diagnostic")}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-bold transition-all",
                view === "diagnostic" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"
              )}
            >
              {isEn ? "Expert Diagnostic" : "专家诊断"}
            </button>
            <button 
              onClick={() => setView("lab")}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-bold transition-all",
                view === "lab" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"
              )}
            >
              {isEn ? "Prompt Laboratory" : "提示词实验室"}
            </button>
          </div>

          {view === "diagnostic" && (
            <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm font-medium">
               <StepItem current={step} target="upload" number={1} label={trans.analyze.step1} />
               <div className="h-px w-4 md:w-12 bg-stone-300" />
               <StepItem current={step} target="processing" number={2} label={trans.analyze.step2} />
               <div className="h-px w-4 md:w-12 bg-stone-300" />
               <StepItem current={step} target="results" number={3} label={trans.analyze.step3} />
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={view + step} className="min-h-[500px]">
            {view === "lab" ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 tracking-tight">{trans.analyze.promptLab.title}</h2>
                  <p className="mt-4 text-stone-600 max-w-2xl mx-auto leading-relaxed">{trans.analyze.promptLab.subtitle}</p>

                </div>

                {/* --- New Extraction Section --- */}
                <div className="mb-12 bg-white rounded-3xl p-6 shadow-sm border border-stone-100 flex flex-col md:flex-row items-center gap-8">
                  <div className={cn(
                    "relative w-full md:w-1/3 aspect-[4/3] rounded-2xl border-2 border-dashed overflow-hidden flex flex-col items-center justify-center transition-all",
                    labImage ? "border-transparent bg-stone-50" : "border-stone-200 hover:border-teal-500 hover:bg-stone-50"
                  )}>
                    {labImage ? (
                      <>
                        <img src={labImage} alt="Lab Upload" className="w-full h-full object-cover" />
                        <button onClick={() => setLabImage(null)} className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full backdrop-blur-sm"><X className="w-3.5 h-3.5" /></button>
                      </>
                    ) : (
                      <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-4">
                        <Upload className="w-8 h-8 text-stone-300 mb-2" />
                        <span className="text-xs font-bold text-stone-500">{trans.analyze.promptLab.extractTitle}</span>
                        <input type="file" hidden onChange={handleLabFileChange} accept="image/*" />
                      </label>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <h4 className="text-lg font-bold text-stone-900">{trans.analyze.promptLab.extractTitle}</h4>
                      <p className="text-sm text-stone-500">{trans.analyze.promptLab.extractDesc}</p>
                    </div>
                    <Button 
                      onClick={startHierarchyExtraction} 
                      disabled={!labImage || isExtracting}
                      className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-8 py-6 shadow-lg shadow-teal-600/20 disabled:bg-stone-200"
                    >
                      {isExtracting ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {trans.analyze.promptLab.extracting}</>
                      ) : (
                        <><Sparkles className="w-4 h-4 mr-2" /> {trans.analyze.promptLab.extractButton}</>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <Card className="bg-white p-8 space-y-6 shadow-xl border-stone-100 rounded-3xl">
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
                          <div className="w-6 h-1 bg-stone-900 rounded-full" /> {trans.analyze.promptLab.layer1}
                        </label>
                        <p className="text-[10px] text-stone-500 italic">{trans.analyze.promptLab.layer1Desc}</p>
                        <textarea 
                          value={skeleton} 
                          onChange={(e) => setSkeleton(e.target.value)} 
                          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:ring-2 focus:ring-stone-200 outline-none transition-all h-20" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
                          <div className="w-6 h-1 bg-stone-500 rounded-full" /> {trans.analyze.promptLab.layer2}
                        </label>
                        <p className="text-[10px] text-stone-500 italic">{trans.analyze.promptLab.layer2Desc}</p>
                        <textarea 
                          value={properties} 
                          onChange={(e) => setProperties(e.target.value)} 
                          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:ring-2 focus:ring-stone-200 outline-none transition-all h-20" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
                          <div className="w-6 h-1 bg-stone-300 rounded-full" /> {trans.analyze.promptLab.layer3}
                        </label>
                        <p className="text-[10px] text-stone-500 italic">{trans.analyze.promptLab.layer3Desc}</p>
                        <textarea 
                          value={detail} 
                          onChange={(e) => setDetail(e.target.value)} 
                          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:ring-2 focus:ring-stone-200 outline-none transition-all h-20" 
                        />
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button 
                          onClick={() => setUseScaling(!useScaling)}
                          className={cn(
                            "w-10 h-5 rounded-full relative transition-colors",
                            useScaling ? "bg-teal-500" : "bg-stone-300"
                          )}
                        >
                          <div className={cn("absolute top-1 w-3 h-3 bg-white rounded-full transition-all", useScaling ? "left-6" : "left-1")} />
                        </button>
                        <span className="text-xs font-medium text-stone-600">{trans.analyze.promptLab.principle}</span>
                      </div>
                    </div>

                    <Button onClick={handleCopyPrompt} className="w-full py-6 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl font-bold transition-all shadow-lg hover:scale-[1.02] active:scale-95">
                      {copied ? (isEn ? "Copied to Clipboard!" : "已复制到剪贴板！") : (
                        <div className="flex items-center gap-2">
                          <Copy className="w-4 h-4" />
                          {trans.analyze.promptLab.generate}
                        </div>
                      )}
                    </Button>
                  </Card>

                  <div className="space-y-6">
                    <div className="bg-stone-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Sparkles className="w-32 h-32" />
                      </div>
                      <h4 className="text-stone-400 uppercase tracking-widest text-[10px] font-bold mb-4">Live Preview</h4>
                      <div className="font-mono text-xs leading-relaxed text-stone-300 whitespace-pre-wrap h-[300px] overflow-y-auto custom-scrollbar">
                        {generateFullPrompt()}
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
                      <h5 className="text-amber-900 font-bold text-sm mb-2 flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        {isEn ? "How to use this prompt?" : "如何使用此提示词？"}
                      </h5>
                      <p className="text-amber-800/80 text-xs leading-relaxed">
                        {isEn 
                          ? "Copy this prompt and paste it into Gemini or Midjourney. It is optimized to create architectural drawings that respect the 15 geometric properties of living structure through hierarchical line weights."
                          : "复制此提示词并将其粘贴到 Gemini 或 Midjourney 中。它经过优化，可通过层级化的线宽创建遵循活力结构 15 个几何属性的建筑图纸。"}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <>
            {step === "upload" && (

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 md:space-y-8 max-w-4xl mx-auto">
                <div className="text-center mb-6 md:mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-stone-900 tracking-tight">{trans.analyze.uploadTitle}</h2>
                  <p className="mt-2 md:mt-3 text-sm md:text-base text-stone-600 max-w-lg mx-auto leading-relaxed">{trans.analyze.uploadDesc}</p>
                </div>

                <div className="bg-white rounded-3xl p-4 shadow-sm border border-stone-200 focus-within:ring-2 focus-within:ring-teal-500/30 transition-all">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-teal-600 mt-1 shrink-0" />
                    <textarea 
                      value={userIntent}
                      onChange={(e) => setUserIntent(e.target.value)}
                      placeholder={isEn ? "Tell the expert your analysis intent... (e.g., Which layout has more living structure?)" : "告诉诊断专家您的分析意图...（例如：这个建筑好看吗？这两幅画哪幅更具活力？）"}
                      className="w-full bg-transparent resize-none outline-none text-stone-700 placeholder:text-stone-400 text-sm md:text-base h-16"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {[0, 1].map((index) => (
                    <div key={index} className={cn("relative aspect-[4/3] rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden", images[index] ? "border-transparent shadow-xl bg-white" : "border-stone-300 hover:border-teal-500 hover:bg-stone-50/50 bg-white")}>
                      {images[index] ? (
                        <>
                          <img src={images[index]} alt={`Upload ${index + 1}`} className="h-full w-full object-cover" />
                          <button onClick={() => removeImage(index)} className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full hover:bg-black/80 backdrop-blur-sm transition-all"><X className="h-4 w-4" /></button>
                        </>
                      ) : (
                        <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-6 md:p-8 text-center">
                          <div className="mb-4 md:mb-5 rounded-full bg-stone-100 p-4 md:p-5 shadow-inner">
                            {index === 0 ? <Upload className="h-7 w-7 md:h-9 md:w-9 text-stone-400" /> : <Plus className="h-7 w-7 md:h-9 md:w-9 text-stone-400" />}
                          </div>
                          <span className="text-sm md:text-base text-stone-700 font-semibold tracking-wide">
                            {index === 0 ? (isEn ? "Upload Main Scene" : "上传主场景") : (isEn ? "Upload Comparison (Optional)" : "上传对比场景 (可选)")}
                          </span>
                          <span className="text-xs text-stone-500 mt-1">Supports JPG, PNG</span>
                          <input type="file" hidden onChange={handleFileChange} accept="image/*" multiple={index === 0} />
                        </label>
                      )}
                    </div>
                  ))}
                </div>

                {images.length === 0 && (
                  <div className="text-center mt-4">
                    <button onClick={loadDefaultExamples} className="text-xs md:text-sm text-teal-600 font-medium hover:text-teal-800 transition-colors border-b border-teal-600/30 hover:border-teal-800 border-dashed pb-0.5">
                      {isEn ? "No images? Click to load 'The Nature of Order' example" : "没有图片？点击一键载入《秩序的本质》对比图演示"}
                    </button>
                  </div>
                )}

                <div className="flex justify-center mt-8 md:mt-12">
                  <Button className="bg-stone-900 px-8 py-6 md:px-16 md:py-7 text-base md:text-xl rounded-full shadow-lg hover:scale-105 transition-transform w-full md:w-auto mx-4 md:mx-0" onClick={startAnalysis} disabled={images.length === 0}>
                    {images.length === 2 
                      ? (isEn ? "Start Deep Comparison" : "开始深度对比诊断") 
                      : (isEn ? "Extract Beauty & Analyze" : "开始美度提取与诊断")}
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "processing" && (
              <div className="flex h-[400px] md:h-[550px] flex-col items-center justify-center text-center px-4">
                <div className="relative mb-8 md:mb-10 h-24 w-24 md:h-28 md:w-28">
                   <div className="absolute inset-0 rounded-full border-4 border-stone-200" />
                   <motion.div className="absolute inset-0 rounded-full border-4 border-teal-600 border-t-transparent" animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />
                   <div className="absolute inset-0 flex items-center justify-center"><Sparkles className="h-8 w-8 md:h-10 md:w-10 text-teal-600 animate-pulse" /></div>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-stone-900 tracking-tight">
                  {isEn ? "Perceiving the 15 geometric properties..." : "正在感知空间的 15 个几何属性..."}
                </h2>
                <p className="mt-3 text-sm md:text-base text-stone-600 flex flex-col items-center gap-2">
                  {retryCount > 0 ? (
                    <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
                      {isEn ? `AI is thinking deeply... (Auto-retry ${retryCount}/2)` : `AI 专家深度思考中... (自动重试 ${retryCount}/2)`}
                    </span>
                  ) : (
                    <span>{isEn ? "Calculating Degree of Beauty and Vitality..." : "计算美度 (Beauty) 及其活力指标..."}</span>
                  )}
                </p>
              </div>
            )}

            {step === "results" && analysisResult && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col lg:grid gap-6 md:gap-10 lg:grid-cols-12">
                
                <div className="order-2 lg:order-1 lg:col-span-8 space-y-6 md:space-y-8 w-full">
                  
                  <motion.div 
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="bg-white rounded-3xl p-2 md:p-3 shadow-md flex gap-2 md:gap-3 h-[240px] md:h-[360px] w-full"
                  >
                    {images.map((img, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => setSelectedIndex(idx)}
                        className={cn(
                          "relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300",
                          images.length === 2 ? "w-1/2" : "w-full",
                          selectedIndex === idx 
                            ? "ring-4 ring-teal-500 shadow-xl opacity-100" 
                            : "opacity-60 hover:opacity-90 hover:ring-2 hover:ring-stone-300"
                        )}
                      >
                        <img src={img} alt={`Scene ${idx + 1}`} className="w-full h-full object-cover" />
                        {images.length === 2 && (
                          <div className={cn(
                            "absolute top-2 left-2 md:top-4 md:left-4 px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold transition-colors",
                            selectedIndex === idx ? "bg-teal-500 text-white" : "bg-black/50 text-white backdrop-blur-md"
                          )}>
                            {isEn ? `Image ${idx + 1}` : `图 ${idx + 1}`} {selectedIndex === idx && (isEn ? " (Current)" : " (当前)")}
                          </div>
                        )}
                      </div>
                    ))}
                  </motion.div>
                  
                  <div className="bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-stone-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 md:w-2 h-full bg-teal-500"></div>
                    <div className="mb-4 inline-block bg-stone-100 px-3 py-1 rounded-md text-xs text-stone-500 font-medium">
                      🎯 {isEn ? "Targeting your intent: " : "针对您的问题："}{userIntent || (isEn ? "Overall Assessment" : "整体评估")}
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-stone-900 mb-2 flex items-center gap-2">
                      🏆 {safeText(analysisResult.winner_declaration, isEn ? "Beauty extraction complete" : "美度提取完成")}
                    </h2>
                    <p className="text-base md:text-lg text-stone-700 font-medium leading-relaxed mt-4">
                      {safeText(analysisResult.core_evaluation)}
                    </p>
                    <div className="mt-4 md:mt-6 p-4 md:p-5 bg-stone-50 rounded-2xl border border-stone-100 text-stone-600 text-xs md:text-sm leading-relaxed italic flex flex-col md:flex-row gap-3 md:gap-4">
                      <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-stone-400 shrink-0" />
                      <span>{safeText(analysisResult.expert_footnote)}</span>
                    </div>
                  </div>

                  <div className="space-y-4 md:space-y-6">
                    <h3 className="text-lg md:text-xl font-bold text-stone-900 flex items-center gap-2 border-b border-stone-200 pb-2 md:pb-3">
                      🔍 {isEn ? "Multi-dimensional Diagnostic Report" : "深度多维诊断报告"}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                      <div className="bg-stone-50 rounded-2xl p-5 md:p-6 border border-stone-100">
                        <h4 className="font-bold text-stone-800 mb-2 md:mb-3 text-xs md:text-sm tracking-wider">👀 {isEn ? "Visual & Structural Decoding" : "视觉与结构解码"}</h4>
                        <p className="text-stone-600 text-xs md:text-sm leading-relaxed whitespace-pre-line">
                          {safeText(analysisResult.visual_decoding)}
                        </p>
                      </div>
                      <div className="bg-amber-50/50 rounded-2xl p-5 md:p-6 border border-amber-100/50">
                        <h4 className="font-bold text-amber-900 mb-2 md:mb-3 text-xs md:text-sm tracking-wider">🎨 {isEn ? "Emotional & Healing Experience" : "情绪与疗愈体验"}</h4>
                        <p className="text-amber-800/90 text-xs md:text-sm leading-relaxed whitespace-pre-line">
                          {safeText(analysisResult.personal_perspective)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 md:space-y-6 pt-2 md:pt-4">
                    <h3 className="text-lg md:text-xl font-bold text-stone-900 flex items-center gap-2 border-b border-stone-200 pb-2 md:pb-3">
                      🛠️ {isEn ? "Structural Improvement Guide" : "结构改进指南"}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                      <div className="bg-blue-50/50 rounded-2xl p-5 md:p-6 border border-blue-100">
                        <h4 className="font-bold text-blue-900 mb-2 md:mb-3 text-xs md:text-sm">🏙️ {isEn ? "Macro-scale Strategy" : "宏观尺度策略"}</h4>
                        <p className="text-blue-800 text-xs md:text-sm leading-relaxed whitespace-pre-line">
                          {safeText(analysisResult.action_advice_urban)}
                        </p>
                      </div>
                      <div className="bg-emerald-50/50 rounded-2xl p-5 md:p-6 border border-emerald-100">
                        <h4 className="font-bold text-emerald-900 mb-2 md:mb-3 text-xs md:text-sm">🏠 {isEn ? "Micro-scale Optimization" : "微观尺度优化"}</h4>
                        <p className="text-emerald-800 text-xs md:text-sm leading-relaxed whitespace-pre-line">
                          {safeText(analysisResult.action_advice_personal)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center pt-4 pb-8 md:pt-8 md:pb-4 px-4">
                    <p className="text-base md:text-lg text-stone-800 font-medium italic leading-relaxed max-w-2xl mx-auto">
                      "{safeText(analysisResult.summary, isEn ? "The 15 properties collectively shape the sense of life in space." : "15个属性共同塑造了空间的生命感。")}"
                    </p>
                  </div>
                </div>

                <div className="order-1 lg:order-2 lg:col-span-4 space-y-4 md:space-y-6 w-full">
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={selectedIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="bg-white border-stone-200 shadow-lg rounded-3xl overflow-hidden lg:sticky lg:top-8 w-full">
                        
                        <div className="p-6 md:p-8 text-center border-b border-stone-100 bg-gradient-to-b from-stone-50 to-white relative pb-10">
                          {images.length === 2 && (
                            <div className="absolute top-3 left-0 w-full flex justify-center">
                              <span className="bg-stone-100 text-stone-500 text-[10px] md:text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                                <ImageIcon className="w-3 h-3" />
                                {isEn ? `Viewing Image ${selectedIndex + 1} Data` : `正在查看图 ${selectedIndex + 1} 数据`}
                              </span>
                            </div>
                          )}
                          
                          <div className="pt-4">
                            <BeautyGauge n={beautyScore} />
                          </div>
                        </div>
                        
                        <div className="p-4 md:p-6 bg-white">
                          <h4 className="text-[10px] md:text-xs font-bold text-stone-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Sparkles className="w-3 h-3 md:w-4 md:h-4" /> {isEn ? "15 Properties Matrix" : "15项几何属性鉴定矩阵"}
                          </h4>
                          
                          {Array.isArray(currentStats?.all_attributes) ? (
                            <div className="grid grid-cols-3 gap-1 md:gap-3">
                              {currentStats.all_attributes.map((attr: any, idx: number) => {
                                const isPresent = Number(attr.score) >= 1;
                                return (
                                  <div 
                                    key={idx} 
                                    title={safeText(attr.desc, isEn ? "No detailed description" : "无详细描述")} 
                                    className={cn(
                                      "flex flex-col items-center justify-center p-2.5 md:p-3 rounded-xl border transition-all cursor-help",
                                      isPresent 
                                        ? "bg-teal-50/50 border-teal-200 hover:bg-teal-100" 
                                        : "bg-stone-50 border-transparent opacity-50 grayscale hover:opacity-80"
                                    )}
                                  >
                                    <span className={cn(
                                      "text-[10px] md:text-xs font-bold text-center leading-tight truncate w-full",
                                      isPresent ? "text-teal-800" : "text-stone-500 line-through"
                                    )}>
                                      {safeText(attr.name, isEn ? "Unknown" : "未知")}
                                    </span>
                                    
                                    <div className={cn(
                                      "mt-2 w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[10px] md:text-xs font-black font-mono shadow-inner",
                                      isPresent ? "bg-teal-500 text-white" : "bg-stone-200 text-stone-400"
                                    )}>
                                      {isPresent ? "1" : "0"}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-xs md:text-sm text-stone-400 text-center py-6 md:py-10">
                              {isEn ? "Loading matrix data..." : "正在为您加载矩阵数据..."}
                            </p>
                          )}
                          <p className="text-center text-[10px] text-stone-400 mt-4 italic">
                            💡 {isEn ? "Hint: Hover over the blocks to see the reasoning" : "提示：将鼠标悬停在方块上可查看判定原因"}
                          </p>
                        </div>
                        
                        <div className="p-3 md:p-4 bg-stone-50 border-t border-stone-100 flex flex-col gap-2">
                          <Button 
                            className="w-full rounded-full bg-stone-900 text-white hover:bg-stone-800 py-5 md:py-6 text-sm md:text-base font-semibold shadow-md" 
                            onClick={() => { 
                              setView("lab"); 
                              if (images[selectedIndex]) setLabImage(images[selectedIndex]);
                            }}
                          >
                            <Sparkles className="w-4 h-4 mr-2" />
                            {isEn ? "Extract Hierarchy & Generate Prompt" : "提取层级并生成提示词"}
                          </Button>
                          <Button variant="outline" className="w-full rounded-full bg-white text-stone-900 hover:bg-stone-100 py-5 md:py-6 text-sm md:text-base font-semibold shadow-sm" onClick={() => { setStep("upload"); setImages([]); setAnalysisResult(null); setUserIntent(""); }}>
                            {isEn ? "Analyze Another Space" : "重新分析下一个空间"}
                          </Button>
                        </div>

                      </Card>
                    </motion.div>
                  </AnimatePresence>
                </div>

              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </AnimatePresence>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 🏆 终极防Bug版：SVG 美度计仪表盘 (Beauty Gauge) 保持不变
// ----------------------------------------------------------------------
function BeautyGauge({ n }: { n: number }) {
  const percentage = n / 15;
  const rotation = percentage * 240 - 120;
  const dashLength = 294; 
  const dashOffset = dashLength - percentage * dashLength;

  return (
    <div className="relative w-full max-w-[260px] mx-auto flex flex-col items-center">
      <div className="text-[10px] md:text-xs font-bold text-stone-400 uppercase tracking-widest mb-1 z-10 relative">
        Degree of Beauty (B)
      </div>
      
      <div className="w-full relative px-2">
        <svg viewBox="0 0 200 160" className="w-full drop-shadow-sm overflow-visible">
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e7e5e4" />
              <stop offset="50%" stopColor="#5eead4" />
              <stop offset="100%" stopColor="#0d9488" />
            </linearGradient>
          </defs>

          <path d="M 39.4 135 A 70 70 0 1 1 160.6 135" fill="none" stroke="#f5f5f4" strokeWidth="16" strokeLinecap="round" />
          
          <motion.path 
            d="M 39.4 135 A 70 70 0 1 1 160.6 135" 
            fill="none" stroke="url(#gaugeGrad)" strokeWidth="16" strokeLinecap="round" 
            strokeDasharray={dashLength}
            initial={{ strokeDashoffset: dashLength }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          />
          
          <text x="22" y="148" fontSize="14" fill="#a8a29e" fontWeight="bold" textAnchor="middle">0</text>
          <text x="178" y="148" fontSize="14" fill="#a8a29e" fontWeight="bold" textAnchor="middle">15</text>

          <motion.g
            initial={{ rotate: -120 }}
            animate={{ rotate: rotation }}
            transition={{ type: "spring", stiffness: 45, damping: 15, delay: 0.4 }}
            style={{ originX: "50%", originY: "50%" }}
          >
            <rect x="0" y="0" width="200" height="200" fill="transparent" pointerEvents="none" />
            <polygon points="97,100 103,100 100,28" fill="#292524" />
            <circle cx="100" cy="100" r="9" fill="#292524" />
            <circle cx="100" cy="100" r="3" fill="#ffffff" />
          </motion.g>
        </svg>
      </div>

      <div className="-mt-8 flex items-baseline justify-center relative z-10">
        <span className="text-5xl md:text-6xl font-black text-stone-800 font-mono tracking-tighter leading-none">{n}</span>
        <span className="text-lg md:text-xl text-stone-400 font-medium tracking-normal ml-1">/15</span>
      </div>
    </div>
  );
}

function StepItem({ current, target, number, label }: { current: string, target: string, number: number, label: string }) {
  const isActive = current === target;
  return (
    <div className={cn("flex items-center gap-1.5 md:gap-2.5 transition-colors", isActive ? "text-stone-950" : "text-stone-400")}>
      <div className={cn("flex h-5 w-5 md:h-7 md:w-7 items-center justify-center rounded-full text-[10px] md:text-xs font-extrabold transition-all", isActive ? "bg-stone-950 text-white md:scale-110 shadow-md" : "bg-stone-200 text-stone-500")}>
        {number}
      </div>
      <span className="font-semibold text-[10px] md:text-sm hidden sm:inline-block">{label}</span>
      <span className="font-semibold text-[10px] sm:hidden">{label.slice(0, 2)}</span>
    </div>
  );
}