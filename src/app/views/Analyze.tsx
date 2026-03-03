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

  // 🛡️ 新增：强制格式化公式的防呆函数
  const formatFormulaText = (text: string) => {
    if (!text) return "";
    // 强制将 L=S*H, L=S×H, L = S*H 等所有变体，统一替换为带有标准空格的 L = S × H
    return text.replace(/L\s*=\s*S\s*([×*xX])\s*H/g, "L = S × H");
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

      // 👇👇👇 极致严谨学术版 Prompt 👇👇👇
      const promptText = `
        [角色定义]
        你是一位深谙“分形生命力”理论 (L = S × H) 与 15 个几何属性的空间结构诊断专家。

        🚨 [核心判定铁律] 🚨
        1. 理论基础：生命结构不是整齐的拼凑，而是有层级的子结构的重尾分布组合。层级越多、子结构越丰富，生命力(L)越高。
        2. 反直觉判例：看似混乱但分形层次极深的作品（如波洛克滴画、自然聚落）生命力得分必定远超表面规整但缺乏层次的作品（如规整玻璃盒子）。
        
        [15个强制打分属性名称（必须完全使用以下中文词汇）]
        1.尺度层次 2.强中心 3.边界 4.交替重复 5.正空间 
        6.良好形状 7.局部对称 8.深度交织与模糊性 9.对比 10.渐变 
        11.粗糙性 12.共鸣 13.虚空 14.简洁与内在平静 15.非分离性

        [任务要求]
        ${isCompare ? "用户上传了两张图进行对比。请基于理论进行深度客观诊断。" : "请基于理论，客观挖掘该图的分形骨架。"}

        必须返回纯 JSON 对象。结构严格如下：
        {
          "winner_declaration": "${isCompare ? '客观指出哪张图生命力得分更高（例：图1的生命力显著高于图2）。保持学术严谨，禁止使用任何主观夸张、中二的名词' : '客观严谨的一句话核心结论'}",
          "core_evaluation": "${isCompare ? '对比两图的 S(子结构)和 H(层级)差异，说明得分差异的客观原因。' : '基于分形理论的深度评价'}",
          "expert_footnote": "专家注脚：引用‘重尾分布’、‘不可分离性’等概念进行学术解释。",
          "visual_decoding": "视觉与层级解码...",
          "formula_analysis": "结合 L = S × H 的公式推演。注意：字母和符号之间必须有空格（必须写成 L = S × H）。${isCompare ? '图1和图2的分析必须分两段书写，两段之间留出一个空行换行。' : ''}",
          "personal_perspective": "空间体验视角的简评...",
          "action_advice_urban": "宏观织补策略...",
          "action_advice_personal": "微观空间优化建议...",
          "summary": "一句简明的学术总结。",
          "image_stats": [
            {
              "vitality_score": ${isCompare ? "图1的分数(1-100)" : "该图分数"},
              "all_attributes": [
                {"name": "尺度层次", "score": 9.5, "desc": "客观描述..."},
                {"name": "强中心", "score": 8.0, "desc": "客观描述..."},
                {"name": "边界", "score": 7.5, "desc": "客观描述..."},
                {"name": "交替重复", "score": 7.0, "desc": "客观描述..."},
                {"name": "正空间", "score": 8.5, "desc": "客观描述..."},
                {"name": "良好形状", "score": 6.0, "desc": "客观描述..."},
                {"name": "局部对称", "score": 7.5, "desc": "客观描述..."},
                {"name": "深度交织与模糊性", "score": 8.0, "desc": "客观描述..."},
                {"name": "对比", "score": 9.0, "desc": "客观描述..."},
                {"name": "渐变", "score": 7.5, "desc": "客观描述..."},
                {"name": "粗糙性", "score": 8.5, "desc": "客观描述..."},
                {"name": "共鸣", "score": 9.0, "desc": "客观描述..."},
                {"name": "虚空", "score": 7.0, "desc": "客观描述..."},
                {"name": "简洁与内在平静", "score": 6.5, "desc": "客观描述..."},
                {"name": "非分离性", "score": 8.5, "desc": "客观描述..."}
              ]
            }${isCompare ? `,
            {
              "vitality_score": 图2的分数(1-100),
              "all_attributes": [
                {"name": "尺度层次", "score": 7.0, "desc": "客观描述..."},
                {"name": "强中心", "score": 6.0, "desc": "客观描述..."},
                {"name": "边界", "score": 5.5, "desc": "客观描述..."},
                {"name": "交替重复", "score": 6.0, "desc": "客观描述..."},
                {"name": "正空间", "score": 5.0, "desc": "客观描述..."},
                {"name": "良好形状", "score": 8.0, "desc": "客观描述..."},
                {"name": "局部对称", "score": 8.5, "desc": "客观描述..."},
                {"name": "深度交织与模糊性", "score": 4.0, "desc": "客观描述..."},
                {"name": "对比", "score": 5.0, "desc": "客观描述..."},
                {"name": "渐变", "score": 6.5, "desc": "客观描述..."},
                {"name": "粗糙性", "score": 3.0, "desc": "客观描述..."},
                {"name": "共鸣", "score": 4.0, "desc": "客观描述..."},
                {"name": "虚空", "score": 8.0, "desc": "客观描述..."},
                {"name": "简洁与内在平静", "score": 8.5, "desc": "客观描述..."},
                {"name": "非分离性", "score": 4.5, "desc": "客观描述..."}
              ]
            }
            ` : ""}
          ]
        }
      `;
      // 👆👆👆 严谨加强版结束 👆👆👆

      const response = await openai.chat.completions.create({
        model: "qwen-vl-max", 
        messages: [
          {
            role: "system",
            content: "你是一位精通分形几何与‘活力结构’理论的学术专家。你的语言必须绝对客观、严谨，剔除任何情绪化或网络流行语表达。必须严格按照提供的 JSON 格式模板输出，不允许省略任何一个属性数组。"
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
    <div className="min-h-screen bg-stone-50 py-6 md:py-12 px-4 sm:px-6 lg:px-8 font-sans overflow-x-hidden">
      <div className="mx-auto max-w-7xl">
        
        <div className="mb-8 md:mb-12 flex justify-center">
          <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm font-medium">
             <StepItem current={step} target="upload" number={1} label={trans.analyze.step1} />
             <div className="h-px w-4 md:w-12 bg-stone-300" />
             <StepItem current={step} target="processing" number={2} label={trans.analyze.step2} />
             <div className="h-px w-4 md:w-12 bg-stone-300" />
             <StepItem current={step} target="results" number={3} label={trans.analyze.step3} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} className="min-h-[500px]">
            {step === "upload" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 md:space-y-8">
                <div className="text-center mb-6 md:mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-stone-900 tracking-tight">{trans.analyze.uploadTitle}</h2>
                  <p className="mt-2 md:mt-3 text-sm md:text-base text-stone-600 max-w-lg mx-auto leading-relaxed">{trans.analyze.uploadDesc}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
                  {[0, 1].map((index) => (
                    <div key={index} className={cn("relative aspect-[4/3] rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden", images[index] ? "border-transparent shadow-xl bg-white" : "border-stone-300 hover:border-teal-500 hover:bg-stone-50/50 bg-white")}>
                      {images[index] ? (
                        <>
                          <img src={images[index]} alt={`上传 ${index + 1}`} className="h-full w-full object-cover" />
                          <button onClick={() => removeImage(index)} className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full hover:bg-black/80 backdrop-blur-sm transition-all"><X className="h-4 w-4" /></button>
                        </>
                      ) : (
                        <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-6 md:p-8 text-center">
                          <div className="mb-4 md:mb-5 rounded-full bg-stone-100 p-4 md:p-5 shadow-inner">
                            {index === 0 ? <Upload className="h-7 w-7 md:h-9 md:w-9 text-stone-400" /> : <Plus className="h-7 w-7 md:h-9 md:w-9 text-stone-400" />}
                          </div>
                          <span className="text-sm md:text-base text-stone-700 font-semibold tracking-wide">
                            {index === 0 ? "上传主场景" : "上传对比场景 (可选)"}
                          </span>
                          <span className="text-xs text-stone-500 mt-1">支持 JPG, PNG</span>
                          <input type="file" hidden onChange={handleFileChange} accept="image/*" multiple={index === 0} />
                        </label>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-8 md:mt-12">
                  <Button className="bg-stone-900 px-8 py-6 md:px-16 md:py-7 text-base md:text-xl rounded-full shadow-lg hover:scale-105 transition-transform w-full md:w-auto mx-4 md:mx-0" onClick={startAnalysis} disabled={images.length === 0}>
                    {images.length === 2 ? "开始深度对比诊断" : "开始基于活力结构的诊断"}
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
                <h2 className="text-xl md:text-2xl font-bold text-stone-900 tracking-tight">正在感知空间的生命力...</h2>
                <p className="mt-3 text-sm md:text-base text-stone-600">运用 L = S × H 理论，探寻隐藏在表象下的深层分形结构...</p>
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
                        <img src={img} alt={`场景 ${idx + 1}`} className="w-full h-full object-cover" />
                        {images.length === 2 && (
                          <div className={cn(
                            "absolute top-2 left-2 md:top-4 md:left-4 px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold transition-colors",
                            selectedIndex === idx ? "bg-teal-500 text-white" : "bg-black/50 text-white backdrop-blur-md"
                          )}>
                            图 {idx + 1} {selectedIndex === idx && " (当前)"}
                          </div>
                        )}
                      </div>
                    ))}
                  </motion.div>
                  
                  <div className="bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-stone-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 md:w-2 h-full bg-teal-500"></div>
                    <h2 className="text-xl md:text-2xl font-bold text-stone-900 mb-2 flex items-center gap-2">
                      🏆 {safeText(analysisResult.winner_declaration, "生命力诊断完成")}
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
                      🔍 深度多维诊断报告
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                      <div className="bg-stone-50 rounded-2xl p-5 md:p-6 border border-stone-100">
                        <h4 className="font-bold text-stone-800 mb-2 md:mb-3 text-xs md:text-sm tracking-wider">👀 视觉与层级解码</h4>
                        <p className="text-stone-600 text-xs md:text-sm leading-relaxed whitespace-pre-line">
                          {safeText(analysisResult.visual_decoding)}
                        </p>
                      </div>
                      <div className="bg-stone-900 text-stone-100 rounded-2xl p-5 md:p-6 shadow-lg">
                        <h4 className="font-mono font-bold text-teal-400 mb-2 md:mb-3 text-xs md:text-sm tracking-wider flex items-center gap-2">
                          <BarChart3 className="w-4 h-4" /> L = S × H 公式推演
                        </h4>
                        {/* 🛡️ 这里调用了防呆函数，强制规范公式格式并保留 AI 输出的换行符 */}
                        <p className="text-stone-300 text-xs md:text-sm leading-relaxed whitespace-pre-line">
                          {formatFormulaText(safeText(analysisResult.formula_analysis))}
                        </p>
                      </div>
                    </div>
                    <div className="bg-amber-50/50 rounded-2xl p-5 md:p-6 border border-amber-100/50">
                      <h4 className="font-bold text-amber-900 mb-2 md:mb-3 text-xs md:text-sm tracking-wider">🎨 情绪与体验视角</h4>
                      <p className="text-amber-800/90 text-xs md:text-sm leading-relaxed whitespace-pre-line">
                        {safeText(analysisResult.personal_perspective)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 md:space-y-6 pt-2 md:pt-4">
                    <h3 className="text-lg md:text-xl font-bold text-stone-900 flex items-center gap-2 border-b border-stone-200 pb-2 md:pb-3">
                      🛠️ 行动与干预指南
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                      <div className="bg-blue-50/50 rounded-2xl p-5 md:p-6 border border-blue-100">
                        <h4 className="font-bold text-blue-900 mb-2 md:mb-3 text-xs md:text-sm">🏙️ 宏观城建策略</h4>
                        <p className="text-blue-800 text-xs md:text-sm leading-relaxed whitespace-pre-line">
                          {safeText(analysisResult.action_advice_urban)}
                        </p>
                      </div>
                      <div className="bg-emerald-50/50 rounded-2xl p-5 md:p-6 border border-emerald-100">
                        <h4 className="font-bold text-emerald-900 mb-2 md:mb-3 text-xs md:text-sm">🏠 微观空间优化</h4>
                        <p className="text-emerald-800 text-xs md:text-sm leading-relaxed whitespace-pre-line">
                          {safeText(analysisResult.action_advice_personal)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center pt-4 pb-8 md:pt-8 md:pb-4 px-4">
                    <p className="text-base md:text-lg text-stone-800 font-medium italic leading-relaxed max-w-2xl mx-auto">
                      "{safeText(analysisResult.summary, "复杂性孕育生命力。")}"
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
                        <div className="p-6 md:p-8 text-center border-b border-stone-100 bg-gradient-to-b from-stone-50 to-white relative">
                          {images.length === 2 && (
                            <div className="absolute top-3 left-0 w-full flex justify-center">
                              <span className="bg-stone-100 text-stone-500 text-[10px] md:text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                                <ImageIcon className="w-3 h-3" />
                                正在查看图 {selectedIndex + 1} 数据
                              </span>
                            </div>
                          )}
                          <div className="text-[10px] md:text-xs font-bold text-stone-400 uppercase tracking-widest mb-1 md:mb-2 mt-4 md:mt-4">Livingness Index</div>
                          <div className="flex items-baseline justify-center text-teal-600">
                            <span className="text-6xl md:text-8xl font-black tracking-tighter">{safeText(currentStats?.vitality_score, "--")}</span>
                            <span className="text-lg md:text-2xl text-stone-400 font-medium ml-1">/100</span>
                          </div>
                        </div>
                        
                        {/* 调整了高度，以适应 15 个属性带来的滚动条展示 */}
                        <div className="p-4 md:p-6 space-y-4 md:space-y-5 bg-white min-h-[400px] max-h-[600px] overflow-y-auto custom-scrollbar">
                          <h4 className="text-[10px] md:text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 md:mb-4 flex items-center gap-2">
                            <Sparkles className="w-3 h-3 md:w-4 md:h-4" /> 15项几何属性表现
                          </h4>
                          {/* 映射新版的 all_attributes 数组 */}
                          {Array.isArray(currentStats?.all_attributes) ? (
                            currentStats.all_attributes.map((attr: any, idx: number) => (
                              <div key={idx} className="space-y-1 md:space-y-2 group">
                                <ScoreRow label={safeText(attr.name, "未知属性")} score={attr.score} />
                                <p className="text-[10px] md:text-xs text-stone-500 leading-relaxed pl-1 group-hover:text-stone-800 transition-colors">
                                  {safeText(attr.desc, "")}
                                </p>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs md:text-sm text-stone-400 text-center py-6 md:py-10">正在为您加载 15 项详细属性...</p>
                          )}
                        </div>
                        
                        <div className="p-3 md:p-4 bg-stone-50 border-t border-stone-100">
                          <Button variant="outline" className="w-full rounded-full bg-white text-stone-900 hover:bg-stone-100 py-5 md:py-6 text-sm md:text-base font-semibold shadow-sm" onClick={() => { setStep("upload"); setImages([]); setAnalysisResult(null); }}>
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
    <div className={cn("flex items-center gap-1.5 md:gap-2.5 transition-colors", isActive ? "text-stone-950" : "text-stone-400")}>
      <div className={cn("flex h-5 w-5 md:h-7 md:w-7 items-center justify-center rounded-full text-[10px] md:text-xs font-extrabold transition-all", isActive ? "bg-stone-950 text-white md:scale-110 shadow-md" : "bg-stone-200 text-stone-500")}>
        {number}
      </div>
      <span className="font-semibold text-[10px] md:text-sm hidden sm:inline-block">{label}</span>
      <span className="font-semibold text-[10px] sm:hidden">{label.slice(0, 2)}</span>
    </div>
  );
}

function ScoreRow({ label, score }: { label: string, score: any }) {
  const safeScore = Number(score) || 0;
  return (
    <div className="flex items-center justify-between text-xs md:text-sm gap-2 md:gap-4 w-full">
      <span className="text-stone-800 font-bold truncate flex-shrink-0 w-20 md:w-auto md:max-w-[120px]" title={label}>{label}</span>
      <div className="flex items-center gap-2 md:gap-3.5 flex-1 justify-end min-w-0">
        <div className="h-1.5 md:h-2 w-full max-w-[60px] md:max-w-[100px] rounded-full bg-stone-100 overflow-hidden shadow-inner flex-shrink">
          <motion.div 
            className="h-full bg-teal-500 rounded-full" 
            initial={{ width: 0 }}
            animate={{ width: `${safeScore * 10}%` }}
            transition={{ duration: 1, delay: 0.2 }}
          />
        </div>
        <span className="font-mono font-black text-stone-900 w-6 md:w-8 text-right text-sm md:text-base flex-shrink-0">{safeScore.toFixed(1)}</span>
      </div>
    </div>
  );
}