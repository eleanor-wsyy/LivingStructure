import React, { useState, useEffect } from "react";
import { Button, Card, cn } from "@/app/components/ui";
import { Upload, Loader2, Plus, X, BookOpen, Sparkles, Image as ImageIcon, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; 
import { useLanguage } from "@/app/i18n/LanguageContext";
import OpenAI from "openai";

export function Analyze() {
  const [step, setStep] = useState<"upload" | "processing" | "results">("upload");
  const [images, setImages] = useState<string[]>([]); 
  const [userIntent, setUserIntent] = useState<string>(""); 
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

  // 💡 一键加载本地默认图库功能
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
      setUserIntent("请帮我对比这两张图，哪一张更符合生命力与美感的标准？");
    } catch (error) {
      console.warn("未找到默认图片，等待用户自行上传。");
    }
  };

  // 🌟 新增：页面初次渲染时自动执行一次加载默认图片的操作
  useEffect(() => {
    loadDefaultExamples();
  }, []); 

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

      const promptText = `
        [角色定义]
        你是一位深谙克里斯托弗·亚历山大“15个几何属性”与空间“美度 (Degree of Beauty)”理论的诊断专家。

        🚨 [核心判定铁律] 🚨
        1. 空间的“美度” (B) 取决于其包含15个几何属性的数量。
        2. 对于每个属性，采用绝对二元判定：具备（积1分），不具备（积0分）。不存在中间分！
        3. 总分最高15分。
        
        [15个强制打分属性名称（必须完全使用以下中文词汇）]
        1.尺度层次 2.强中心 3.边界 4.交替重复 5.正空间 
        6.良好形状 7.局部对称 8.深度交织与模糊性 9.对比 10.渐变 
        11.粗糙性 12.共鸣 13.虚空 14.简洁与内在平静 15.非分离性

        [用户特定意图/提问]
        用户的提问是：“${userIntent || '无特定提问，请进行标准客观分析'}”。
        你必须在“核心评估结论”中直接且明确地回答用户的这个疑问！

        [任务要求]
        ${isCompare ? "用户上传了两张图进行对比。请基于上述二元判定理论，分别判断每张图具备哪几个属性，并对比它们的美度差异！" : "请客观挖掘该图具备的属性并得出美度总分。"}

        必须返回纯 JSON 对象。结构严格如下：
        {
          "winner_declaration": "${isCompare ? '直面用户提问，指出哪张图美度更高，直接给出客观结论。' : '直面用户提问，给出核心判定结论。'}",
          "core_evaluation": "结合用户的提问，对比或分析产生这种美度差异的核心原因。",
          "expert_footnote": "专家注脚：引用亚历山大的“客观美”或“15种结构保持转换”概念进行解释。",
          "visual_decoding": "视觉特征与结构解码...",
          "personal_perspective": "空间情绪与疗愈体验...",
          "action_advice_urban": "宏观改善策略...",
          "action_advice_personal": "微观空间优化建议...",
          "summary": "一句简明的学术总结。",
          "image_stats": [
            {
              "beauty_score": ${isCompare ? "图1的总得分(0-15之间的整数)" : "该图总得分"},
              "all_attributes": [
                {"name": "尺度层次", "score": 1, "desc": "1表示具备。简述其体现..."},
                {"name": "强中心", "score": 0, "desc": "0表示不具备。简述为何缺失..."},
                {"name": "边界", "score": 1, "desc": "..."}
                // ... 必须严格输出完整的 15 个属性，score 只能是 0 或 1
              ]
            }${isCompare ? `,
            {
              "beauty_score": 图2的总得分(0-15之间的整数),
              "all_attributes": [
                {"name": "尺度层次", "score": 0, "desc": "..."},
                {"name": "强中心", "score": 1, "desc": "..."}
                // ... 必须严格输出完整的 15 个属性，score 只能是 0 或 1
              ]
            }
            ` : ""}
          ]
        }
      `;

      const response = await openai.chat.completions.create({
        model: "qwen-vl-max", 
        messages: [
          {
            role: "system",
            content: "你是一位精通分形几何与‘美度’评价体系的学术专家。必须严格进行 0 或 1 的二元打分。必须严格按照提供的 JSON 格式模板输出，不允许省略任何一个属性数组。"
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

      setAnalysisResult(parsedData);
      setStep("results");

    } catch (error: any) {
      console.error("AI 分析失败:", error);
      alert(`诊断中断：${error.message} \n请检查网络或 API Key 设置。`);
      setStep("upload");
    }
  };

  const currentStats = analysisResult?.image_stats?.[selectedIndex] || analysisResult;
  
  const beautyScore = Number(currentStats?.beauty_score) || 0;

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
                      placeholder="告诉诊断专家您的分析意图...（例如：这个建筑好看吗？这两幅画哪幅更具生命力？）"
                      className="w-full bg-transparent resize-none outline-none text-stone-700 placeholder:text-stone-400 text-sm md:text-base h-16"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
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

                {images.length === 0 && (
                  <div className="text-center mt-4">
                    <button onClick={loadDefaultExamples} className="text-xs md:text-sm text-teal-600 font-medium hover:text-teal-800 transition-colors border-b border-teal-600/30 hover:border-teal-800 border-dashed pb-0.5">
                      没有图片？点击一键载入《秩序的本质》正反面对比图演示
                    </button>
                  </div>
                )}

                <div className="flex justify-center mt-8 md:mt-12">
                  <Button className="bg-stone-900 px-8 py-6 md:px-16 md:py-7 text-base md:text-xl rounded-full shadow-lg hover:scale-105 transition-transform w-full md:w-auto mx-4 md:mx-0" onClick={startAnalysis} disabled={images.length === 0}>
                    {images.length === 2 ? "开始深度对比诊断" : "开始美度提取与诊断"}
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
                <h2 className="text-xl md:text-2xl font-bold text-stone-900 tracking-tight">正在感知空间的 15 个几何属性...</h2>
                <p className="mt-3 text-sm md:text-base text-stone-600">计算美度 (Beauty) 及其生命力指标...</p>
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
                    <div className="mb-4 inline-block bg-stone-100 px-3 py-1 rounded-md text-xs text-stone-500 font-medium">
                      🎯 针对您的问题：{userIntent || "整体评估"}
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-stone-900 mb-2 flex items-center gap-2">
                      🏆 {safeText(analysisResult.winner_declaration, "美度提取完成")}
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
                        <h4 className="font-bold text-stone-800 mb-2 md:mb-3 text-xs md:text-sm tracking-wider">👀 视觉与结构解码</h4>
                        <p className="text-stone-600 text-xs md:text-sm leading-relaxed whitespace-pre-line">
                          {safeText(analysisResult.visual_decoding)}
                        </p>
                      </div>
                      <div className="bg-amber-50/50 rounded-2xl p-5 md:p-6 border border-amber-100/50">
                        <h4 className="font-bold text-amber-900 mb-2 md:mb-3 text-xs md:text-sm tracking-wider">🎨 情绪与疗愈体验</h4>
                        <p className="text-amber-800/90 text-xs md:text-sm leading-relaxed whitespace-pre-line">
                          {safeText(analysisResult.personal_perspective)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 md:space-y-6 pt-2 md:pt-4">
                    <h3 className="text-lg md:text-xl font-bold text-stone-900 flex items-center gap-2 border-b border-stone-200 pb-2 md:pb-3">
                      🛠️ 结构改进指南
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                      <div className="bg-blue-50/50 rounded-2xl p-5 md:p-6 border border-blue-100">
                        <h4 className="font-bold text-blue-900 mb-2 md:mb-3 text-xs md:text-sm">🏙️ 宏观尺度策略</h4>
                        <p className="text-blue-800 text-xs md:text-sm leading-relaxed whitespace-pre-line">
                          {safeText(analysisResult.action_advice_urban)}
                        </p>
                      </div>
                      <div className="bg-emerald-50/50 rounded-2xl p-5 md:p-6 border border-emerald-100">
                        <h4 className="font-bold text-emerald-900 mb-2 md:mb-3 text-xs md:text-sm">🏠 微观尺度优化</h4>
                        <p className="text-emerald-800 text-xs md:text-sm leading-relaxed whitespace-pre-line">
                          {safeText(analysisResult.action_advice_personal)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center pt-4 pb-8 md:pt-8 md:pb-4 px-4">
                    <p className="text-base md:text-lg text-stone-800 font-medium italic leading-relaxed max-w-2xl mx-auto">
                      "{safeText(analysisResult.summary, "15个属性共同塑造了空间的生命感。")}"
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
                        
                        {/* 顶部：美度仪表盘 */}
                        <div className="p-6 md:p-8 text-center border-b border-stone-100 bg-gradient-to-b from-stone-50 to-white relative">
                          {images.length === 2 && (
                            <div className="absolute top-3 left-0 w-full flex justify-center">
                              <span className="bg-stone-100 text-stone-500 text-[10px] md:text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                                <ImageIcon className="w-3 h-3" />
                                正在查看图 {selectedIndex + 1} 数据
                              </span>
                            </div>
                          )}
                          
                          {/* 完美的图文分离仪表盘组件 */}
                          <div className="pt-4">
                            <BeautyGauge n={beautyScore} />
                          </div>
                        </div>
                        
                        {/* 中部：15属性 3x5 矩阵 */}
                        <div className="p-4 md:p-6 bg-white">
                          <h4 className="text-[10px] md:text-xs font-bold text-stone-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Sparkles className="w-3 h-3 md:w-4 md:h-4" /> 15项几何属性鉴定矩阵
                          </h4>
                          
                          {Array.isArray(currentStats?.all_attributes) ? (
                            <div className="grid grid-cols-3 gap-2 md:gap-3">
                              {currentStats.all_attributes.map((attr: any, idx: number) => {
                                const isPresent = Number(attr.score) === 1;
                                return (
                                  <div 
                                    key={idx} 
                                    title={safeText(attr.desc, "无详细描述")} 
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
                                      {safeText(attr.name, "未知")}
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
                            <p className="text-xs md:text-sm text-stone-400 text-center py-6 md:py-10">正在为您加载矩阵数据...</p>
                          )}
                          <p className="text-center text-[10px] text-stone-400 mt-4 italic">💡 提示：将鼠标悬停在方块上可查看判定原因</p>
                        </div>
                        
                        {/* 底部：操作按钮 */}
                        <div className="p-3 md:p-4 bg-stone-50 border-t border-stone-100">
                          <Button variant="outline" className="w-full rounded-full bg-white text-stone-900 hover:bg-stone-100 py-5 md:py-6 text-sm md:text-base font-semibold shadow-sm" onClick={() => { setStep("upload"); setImages([]); setAnalysisResult(null); setUserIntent(""); }}>
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

// ----------------------------------------------------------------------
// 🏆 终极版：SVG 美度计仪表盘 (Beauty Gauge)
// 彻底分离了图形与数字容器，避免任何交叉遮挡现象
// ----------------------------------------------------------------------
function BeautyGauge({ n }: { n: number }) {
  const percentage = n / 15;
  const rotation = percentage * 180 - 90;

  return (
    <div className="relative w-full max-w-[240px] mx-auto flex flex-col items-center">
      <div className="text-[10px] md:text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">
        Degree of Beauty (B)
      </div>
      
      {/* 仪表盘图区：仅包含 SVG */}
      <div className="w-full relative px-2">
        {/* 设置 overflow-visible 确保即使旋转到底部也不会被裁切 */}
        <svg viewBox="0 0 200 110" className="w-full drop-shadow-sm overflow-visible">
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e7e5e4" />
              <stop offset="50%" stopColor="#5eead4" />
              <stop offset="100%" stopColor="#0d9488" />
            </linearGradient>
          </defs>

          {/* 圆弧轨道 */}
          <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#f5f5f4" strokeWidth="16" strokeLinecap="round" />
          <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#gaugeGrad)" strokeWidth="16" strokeLinecap="round" />
          
          {/* 刻度值 0 和 15 */}
          <text x="15" y="120" fontSize="13" fill="#a8a29e" fontWeight="bold" textAnchor="middle">0</text>
          <text x="185" y="120" fontSize="13" fill="#a8a29e" fontWeight="bold" textAnchor="middle">15</text>

          {/* 带物理阻尼弹簧效果的指针 */}
          <motion.g
            initial={{ rotate: -90 }}
            animate={{ rotate: rotation }}
            transition={{ type: "spring", stiffness: 45, damping: 15, delay: 0.4 }}
            style={{ transformOrigin: "100px 100px" }}
          >
            <polygon points="96,100 104,100 100,20" fill="#292524" />
            <circle cx="100" cy="100" r="9" fill="#292524" />
            <circle cx="100" cy="100" r="3" fill="#ffffff" />
          </motion.g>
        </svg>
      </div>

      {/* 数字分值区：紧贴在 SVG 下方，绝对不会发生重叠 */}
      <div className="mt-4 flex items-baseline justify-center">
        <span className="text-5xl md:text-6xl font-black text-stone-800 font-mono tracking-tighter leading-none">
          {n}
        </span>
        <span className="text-lg md:text-xl text-stone-400 font-medium tracking-normal ml-1">/15</span>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 底部步骤条组件
// ----------------------------------------------------------------------
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