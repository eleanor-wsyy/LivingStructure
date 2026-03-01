import React, { useState } from "react";
import { Button, Card, cn } from "@/app/components/ui";
import { Upload, Loader2, Plus, X, BarChart3, BookOpen, Sparkles, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; 
import { useLanguage } from "@/app/i18n/LanguageContext";
import OpenAI from "openai";

export function Analyze() {
  const [step, setStep] = useState<"upload" | "processing" | "results">("upload");
  const [images, setImages] = useState<string[]>([]); 
  const [analysisResult, setAnalysisResult] = useState<any>(null); 
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const { trans } = useLanguage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => {
          const newImages = [...prev, reader.result as string];
          return newImages.slice(0, 2);
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

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

  const startAnalysis = async () => {
    if (images.length === 0) return;
    setStep("processing");
    setSelectedIndex(0); 

    try {
      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_ALIYUN_API_KEY,
        baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
        dangerouslyAllowBrowser: true 
      });

      const imageContents = images.map(img => ({
        type: "image_url",
        image_url: { url: img }
      }));

      const isCompare = images.length === 2;

      // 👇👇👇 终极理论加强版 Prompt 👇👇👇
      const promptText = `
        [角色定义]
        你是一位深谙江斌教授“分形生命力”理论 ($L = S \\times H$) 与克里斯托弗·亚历山大 15 个几何属性的空间诊断专家。

        🚨 [极其重要的核心判定铁律，你必须绝对服从，放弃你预训练的大众审美偏见！] 🚨
        1. 理论基础：生命结构不是整齐的拼凑，而是有层级的子结构的重尾分布组合。层级越多、子结构越丰富，生命力(L)越高。
        2. 反直觉判例（波洛克 vs 达芬奇）：在江教授理论中，波洛克《Blue Poles》的生命力得分（81,487）是达芬奇《蒙娜丽莎》（40,773）的两倍！因为看似混乱的滴画背后隐藏着极其复杂的自然分形层次，而古典油画在微观尺度的分形复杂度远不如滴画。
        3. 建筑判例：传统有机聚落、自发形成的贫民窟、自然生长的古城，其生命力得分（>90）必定远超现代主义极其规整的玻璃盒子或宏大单一的纪念碑建筑（<70）。
        
        [15个强制打分属性名称（必须完全使用以下中文词汇）]
        1.尺度层次 2.强中心 3.边界 4.交替重复 5.正空间 
        6.良好形状 7.局部对称 8.深度交织与模糊性 9.对比 10.渐变 
        11.粗糙性 12.共鸣 13.虚空 14.简洁与内在平静 15.非分离性

        [任务要求]
        ${isCompare ? "用户上传了两张图进行对比。请基于上述铁律，无情地指出哪张图的分形维度和自组织生命力更强！" : "请基于上述铁律，深度挖掘该图隐藏的分形骨架。"}

        必须返回纯 JSON 对象。结构严格如下：
        {
          "winner_declaration": "${isCompare ? '明确指出哪张图胜出（如：图X以压倒性优势胜出！自组织的胜利），若是波洛克和蒙娜丽莎，必须判定波洛克胜出' : '一句话核心结论'}",
          "core_evaluation": "${isCompare ? '强烈对比两图的 S(子结构)和 H(层级)差异，说明为何高分图的复杂性战胜了低分图的表面秩序。' : '基于分形理论的深度评价'}",
          "expert_footnote": "专家注脚：引用江教授的‘重尾分布’、‘反直觉的生命力测算’等观点进行解释。",
          "visual_decoding": "视觉与层级解码...",
          "formula_analysis": "结合 L=S×H 的公式验证...",
          "personal_perspective": "生活体验视角的散文短评...",
          "action_advice_urban": "宏观织补策略...",
          "action_advice_personal": "微观空间优化建议...",
          "summary": "一句充满哲理的总结升华。",
          "image_stats": [
            {
              "vitality_score": ${isCompare ? "图1的分数(1-100)，必须严格基于 L=S×H 原则打分" : "该图分数"},
              "top_attributes": [
                {"name": "尺度层次", "score": 9.5, "desc": "${isCompare ? "图1的具体表现" : "具体表现"}"},
                {"name": "深度交织与模糊性", "score": 8.0, "desc": "..."}
              ]
            }${isCompare ? `,
            {
              "vitality_score": 图2的分数(1-100),
              "top_attributes": [
                {"name": "强中心", "score": 2.5, "desc": "图2的具体表现"},
                {"name": "粗糙性", "score": 9.0, "desc": "..."}
              ]
            }
            ` : ""}
          ]
        }
      `;
      // 👆👆👆 终极理论加强版结束 👆👆👆

      const response = await openai.chat.completions.create({
        model: "qwen-vl-max", 
        messages: [
          {
            role: "system",
            content: "你是一位精通分形几何与江斌教授‘活力结构’理论的专家。你完全抛弃了世俗对美的刻板印象，唯以结构的复杂性和层级深度来衡量生命力。"
          },
          {
            role: "user",
            content: [
              { type: "text", text: promptText },
              ...imageContents 
            ] as any
          }
        ]
      });

      const responseText = response.choices[0].message.content || "{}";
      const parsedData = safeExtractJSON(responseText);
      
      if (!parsedData) throw new Error("AI 数据格式错乱");

      console.log("理论对齐分析结果:", parsedData);
      setAnalysisResult(parsedData);
      setStep("results");

    } catch (error: any) {
      console.error("AI 分析失败:", error);
      alert(`诊断中断：${error.message} \n请检查网络或 API Key 设置。`);
      setStep("upload");
    }
  };

  const currentStats = analysisResult?.image_stats?.[selectedIndex] || analysisResult;

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex justify-center">
          <div className="flex items-center gap-4 text-sm font-medium">
             <StepItem current={step} target="upload" number={1} label={trans.analyze.step1} />
             <div className="h-px w-12 bg-stone-300" />
             <StepItem current={step} target="processing" number={2} label={trans.analyze.step2} />
             <div className="h-px w-12 bg-stone-300" />
             <StepItem current={step} target="results" number={3} label={trans.analyze.step3} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} className="min-h-[600px]">
            {step === "upload" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-stone-900 tracking-tight">{trans.analyze.uploadTitle}</h2>
                  <p className="mt-3 text-stone-600 max-w-lg mx-auto leading-relaxed">{trans.analyze.uploadDesc}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {[0, 1].map((index) => (
                    <div key={index} className={cn("relative aspect-[4/3] rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden", images[index] ? "border-transparent shadow-xl bg-white" : "border-stone-300 hover:border-teal-500 hover:bg-stone-50/50 bg-white")}>
                      {images[index] ? (
                        <>
                          <img src={images[index]} alt={`上传 ${index + 1}`} className="h-full w-full object-cover" />
                          <button onClick={() => removeImage(index)} className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full hover:bg-black/80 backdrop-blur-sm transition-all"><X className="h-4 w-4" /></button>
                        </>
                      ) : (
                        <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-8 text-center">
                          <div className="mb-5 rounded-full bg-stone-100 p-5 shadow-inner">
                            {index === 0 ? <Upload className="h-9 w-9 text-stone-400" /> : <Plus className="h-9 w-9 text-stone-400" />}
                          </div>
                          <span className="text-stone-700 font-semibold tracking-wide">
                            {index === 0 ? "上传主场景" : "上传对比场景 (可选)"}
                          </span>
                          <span className="text-xs text-stone-500 mt-1">支持 JPG, PNG</span>
                          <input type="file" hidden onChange={handleFileChange} accept="image/*" multiple={index === 0} />
                        </label>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-12">
                  <Button className="bg-stone-900 px-16 py-7 text-xl rounded-full shadow-lg hover:scale-105 transition-transform" onClick={startAnalysis} disabled={images.length === 0}>
                    {images.length === 2 ? "开始深度对比诊断" : "开始基于活力结构的诊断"}
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "processing" && (
              <div className="flex h-[550px] flex-col items-center justify-center text-center">
                <div className="relative mb-10 h-28 w-28">
                   <div className="absolute inset-0 rounded-full border-4 border-stone-200" />
                   <motion.div className="absolute inset-0 rounded-full border-4 border-teal-600 border-t-transparent" animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />
                   <div className="absolute inset-0 flex items-center justify-center"><Sparkles className="h-10 w-10 text-teal-600 animate-pulse" /></div>
                </div>
                <h2 className="text-2xl font-bold text-stone-900 tracking-tight">正在感知空间的生命力...</h2>
                <p className="mt-3 text-stone-600">运用 L = S × H 理论，探寻隐藏在表象下的深层分形结构...</p>
              </div>
            )}

            {step === "results" && analysisResult && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-10 lg:grid-cols-12">
                <div className="lg:col-span-8 space-y-8">
                  <motion.div 
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="bg-white rounded-3xl p-3 shadow-md flex gap-3 h-[360px]"
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
                        <img src={img} alt={`场景 ${idx + 1}`} className="w-full h-full object-cover" />
                        {images.length === 2 && (
                          <div className={cn(
                            "absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold transition-colors",
                            selectedIndex === idx ? "bg-teal-500 text-white" : "bg-black/50 text-white backdrop-blur-md"
                          )}>
                            图 {idx + 1} {selectedIndex === idx && " (当前查看)"}
                          </div>
                        )}
                      </div>
                    ))}
                  </motion.div>
                  
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-teal-500"></div>
                    <h2 className="text-2xl font-bold text-stone-900 mb-2 flex items-center gap-2">
                      🏆 {safeText(analysisResult.winner_declaration, "生命力诊断完成")}
                    </h2>
                    <p className="text-lg text-stone-700 font-medium leading-relaxed mt-4">
                      {safeText(analysisResult.core_evaluation)}
                    </p>
                    <div className="mt-6 p-5 bg-stone-50 rounded-2xl border border-stone-100 text-stone-600 text-sm leading-relaxed italic flex gap-4">
                      <BookOpen className="w-6 h-6 text-stone-400 shrink-0" />
                      <span>{safeText(analysisResult.expert_footnote)}</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2 border-b border-stone-200 pb-3">
                      🔍 深度多维诊断报告
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100">
                        <h4 className="font-bold text-stone-800 mb-3 text-sm tracking-wider">👀 视觉与层级解码</h4>
                        <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line">
                          {safeText(analysisResult.visual_decoding)}
                        </p>
                      </div>
                      <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 shadow-lg">
                        <h4 className="font-mono font-bold text-teal-400 mb-3 text-sm tracking-wider flex items-center gap-2">
                          <BarChart3 className="w-4 h-4" /> L = S × H 公式推演
                        </h4>
                        <p className="text-stone-300 text-sm leading-relaxed whitespace-pre-line">
                          {safeText(analysisResult.formula_analysis)}
                        </p>
                      </div>
                    </div>
                    <div className="bg-amber-50/50 rounded-2xl p-6 border border-amber-100/50">
                      <h4 className="font-bold text-amber-900 mb-3 text-sm tracking-wider">🎨 情绪与体验视角</h4>
                      <p className="text-amber-800/90 text-sm leading-relaxed whitespace-pre-line">
                        {safeText(analysisResult.personal_perspective)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6 pt-4">
                    <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2 border-b border-stone-200 pb-3">
                      🛠️ 行动与干预指南
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
                        <h4 className="font-bold text-blue-900 mb-3 text-sm">🏙️ 宏观城建策略</h4>
                        <p className="text-blue-800 text-sm leading-relaxed whitespace-pre-line">
                          {safeText(analysisResult.action_advice_urban)}
                        </p>
                      </div>
                      <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100">
                        <h4 className="font-bold text-emerald-900 mb-3 text-sm">🏠 微观空间优化</h4>
                        <p className="text-emerald-800 text-sm leading-relaxed whitespace-pre-line">
                          {safeText(analysisResult.action_advice_personal)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center pt-8 pb-4">
                    <p className="text-lg text-stone-800 font-medium italic leading-relaxed max-w-2xl mx-auto">
                      "{safeText(analysisResult.summary, "复杂性孕育生命力。")}"
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={selectedIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="bg-white border-stone-200 shadow-lg rounded-3xl overflow-hidden sticky top-8">
                        <div className="p-8 text-center border-b border-stone-100 bg-gradient-to-b from-stone-50 to-white relative">
                          {images.length === 2 && (
                            <div className="absolute top-4 left-0 w-full flex justify-center">
                              <span className="bg-stone-100 text-stone-500 text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                                <ImageIcon className="w-3 h-3" />
                                正在查看图 {selectedIndex + 1} 数据
                              </span>
                            </div>
                          )}
                          <div className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 mt-4">Livingness Index</div>
                          <div className="flex items-baseline justify-center text-teal-600">
                            <span className="text-8xl font-black tracking-tighter">{safeText(currentStats?.vitality_score, "--")}</span>
                            <span className="text-2xl text-stone-400 font-medium ml-1">/100</span>
                          </div>
                        </div>
                        
                        <div className="p-6 space-y-5 bg-white min-h-[400px]">
                          <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> 图 {selectedIndex + 1} 属性表现
                          </h4>
                          {Array.isArray(currentStats?.top_attributes) ? (
                            currentStats.top_attributes.map((attr: any, idx: number) => (
                              <div key={idx} className="space-y-2 group">
                                <ScoreRow label={safeText(attr.name, "未知属性")} score={attr.score} />
                                <p className="text-xs text-stone-500 leading-relaxed pl-1 group-hover:text-stone-800 transition-colors">
                                  {safeText(attr.desc, "")}
                                </p>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-stone-400 text-center py-10">正在为您加载详细属性...</p>
                          )}
                        </div>
                        
                        <div className="p-4 bg-stone-50 border-t border-stone-100">
                          <Button variant="outline" className="w-full rounded-full bg-white text-stone-900 hover:bg-stone-100 py-6 font-semibold shadow-sm" onClick={() => { setStep("upload"); setImages([]); setAnalysisResult(null); }}>
                            重新分析下一个空间
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  </AnimatePresence>
                </div>

              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function StepItem({ current, target, number, label }: { current: string, target: string, number: number, label: string }) {
  const isActive = current === target;
  return (
    <div className={cn("flex items-center gap-2.5 transition-colors", isActive ? "text-stone-950" : "text-stone-400")}>
      <div className={cn("flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold transition-all", isActive ? "bg-stone-950 text-white scale-110 shadow-md" : "bg-stone-200 text-stone-500")}>
        {number}
      </div>
      <span className="font-semibold">{label}</span>
    </div>
  );
}

function ScoreRow({ label, score }: { label: string, score: any }) {
  const safeScore = Number(score) || 0;
  return (
    <div className="flex items-center justify-between text-sm gap-4">
      <span className="text-stone-800 font-bold truncate max-w-[120px]" title={label}>{label}</span>
      <div className="flex items-center gap-3.5 flex-1 justify-end">
        <div className="h-2 w-full max-w-[100px] rounded-full bg-stone-100 overflow-hidden shadow-inner">
          <motion.div 
            className="h-full bg-teal-500 rounded-full" 
            initial={{ width: 0 }}
            animate={{ width: `${safeScore * 10}%` }}
            transition={{ duration: 1, delay: 0.2 }}
          />
        </div>
        <span className="font-mono font-black text-stone-900 w-8 text-right text-base">{safeScore.toFixed(1)}</span>
      </div>
    </div>
  );
}