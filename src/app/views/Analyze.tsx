import React, { useState } from "react";
import { Button, Card, cn } from "@/app/components/ui";
import { Upload, Loader2, Plus, X, BarChart3, BookOpen, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; 
import { useLanguage } from "@/app/i18n/LanguageContext";
import OpenAI from "openai";

export function Analyze() {
  const [step, setStep] = useState<"upload" | "processing" | "results">("upload");
  const [images, setImages] = useState<string[]>([]); 
  const [analysisResult, setAnalysisResult] = useState<any>(null); 
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

  const startAnalysis = async () => {
    if (images.length === 0) return;
    setStep("processing");

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

      // 👇 【核心升级】注入了极具人文关怀的“讲故事”提示词
      const promptText = `
        [角色定义]
        你是一位兼具严谨学术功底与深厚人文关怀的空间生命力评论家。你深谙江斌教授的“分形生命力”理论 ($L = S \\times H$) 与亚历山大的 15 个属性。
        你的语言风格：富有洞察力、充满美感、循循善诱，像是一篇发表在顶级建筑杂志上的专栏文章，能够精准勾起读者的情绪共鸣（如“探索欲”、“疗愈感”、“敬畏感”）。
        
        [任务要求]
        请对上传的图片进行深度诊断。你必须返回一个严格的 JSON 对象（不要包含任何 \`\`\`json 标记）。JSON 结构必须严格如下：
        {
          "vitality_score": 96, 
          "winner_declaration": "一句话结论（如果是双图对比，指出谁更具生命力；如果是单图，给出核心定性，如‘自组织城市的典范’）",
          "core_evaluation": "一段深度的核心评价，指出其分形维数、系统特征（如：这是一个超高生命力、超高分形维数的系统...）",
          "expert_footnote": "专家注脚：引用江教授的视角，探讨传统与现代、中心化设计与有机生长的哲学对比。",
          "visual_decoding": "视觉解码：描述主中心、次级中心、层级特征以及建筑与环境的深度关系。",
          "formula_analysis": "公式推演：结合 $L = S \\times H$，分析子结构数量(S)的丰富度与结构层级(H)的深度嵌套。",
          "personal_perspective": "生活视角：为什么我们更愿意在这里停留？分析它的‘探索欲’、‘亲切感’或‘疗愈感’来源。",
          "action_advice_urban": "城建视角改造策略：针对政府或规划师的宏观织补或增密建议。",
          "action_advice_personal": "个人空间优化建议：给普通人的微观建议（如拒绝样板间、制造层级）。",
          "summary": "一句充满哲理的总结升华（如：证明了‘自组织的复杂性’才是最高级的生命力）。",
          "top_attributes": [
            {"name": "深度交织", "score": 9.5, "desc": "建筑与环境无缝融合，仿佛从山体中生长出来..."},
            {"name": "局部对称", "score": 8.0, "desc": "在整体不对称中包含局部的窗框对称..."},
            {"name": "粗糙度", "score": 8.5, "desc": "保留了手工砌筑的不完美与岁月痕迹..."},
            {"name": "交替重复", "score": 9.0, "desc": "房屋的重复带有生动的随机性..."},
            {"name": "渐变", "score": 8.5, "desc": "密度和高度随地形自然平滑过渡..."}
          ]
        }
      `;

      const response = await openai.chat.completions.create({
        model: "qwen-vl-max", 
        messages: [
          {
            role: "system",
            content: "你是一位兼具浪漫主义与科学严谨的空间生命力评论专家。"
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
      const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsedData = JSON.parse(cleanedText);
      
      console.log("人性化深度分析结果:", parsedData);
      setAnalysisResult(parsedData);
      setStep("results");

    } catch (error: any) {
      console.error("AI 分析失败:", error);
      alert(`诊断中断：${error.message} \n请检查网络。`);
      setStep("upload");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto max-w-7xl">
        {/* 顶部步骤指示器 */}
        <div className="mb-12 flex justify-center">
          <div className="flex items-center gap-4 text-sm font-medium">
             <StepItem current={step} target="upload" number={1} label={trans.analyze.step1} />
             <div className="h-px w-12 bg-stone-300" />
             <StepItem current={step} target="processing" number={2} label={trans.analyze.step2} />
             <div className="h-px w-12 bg-stone-300" />
             <StepItem current={step} target="results" number={3} label={trans.analyze.step3} />
          </div>
        </div>

        {/* 内容区 */}
        <AnimatePresence mode="wait">
          <motion.div key={step} className="min-h-[600px]">
            
            {/* 1. 上传阶段 (保持不变) */}
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
                    {images.length === 2 ? "开始深度对比诊断" : "开始生命力诊断"}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* 2. 处理阶段 */}
            {step === "processing" && (
              <div className="flex h-[550px] flex-col items-center justify-center text-center">
                <div className="relative mb-10 h-28 w-28">
                   <div className="absolute inset-0 rounded-full border-4 border-stone-200" />
                   <motion.div className="absolute inset-0 rounded-full border-4 border-teal-600 border-t-transparent" animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />
                   <div className="absolute inset-0 flex items-center justify-center"><Sparkles className="h-10 w-10 text-teal-600 animate-pulse" /></div>
                </div>
                <h2 className="text-2xl font-bold text-stone-900 tracking-tight">正在撰写深度诊断报告...</h2>
                <p className="mt-3 text-stone-600">正在应用 $L = S \times H$ 提取比例层级与情绪价值</p>
              </div>
            )}

            {/* 3. 结果展示阶段（完全重构为杂志级排版） */}
            {step === "results" && analysisResult && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-10 lg:grid-cols-12">
                
                {/* 左侧：深度专栏阅读区 (占 8 列) */}
                <div className="lg:col-span-8 space-y-8">
                  
                  {/* 图片展示区 */}
                  <motion.div 
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="aspect-video bg-white rounded-3xl p-3 shadow-md overflow-hidden flex gap-3"
                  >
                    {images.map((img, idx) => (
                      <img key={idx} src={img} alt={`场景 ${idx + 1}`} className={cn("h-full object-cover rounded-2xl", images.length === 2 ? "w-1/2" : "w-full")} />
                    ))}
                  </motion.div>
                  
                  {/* 核心结论与评价 */}
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-teal-500"></div>
                    <h2 className="text-2xl font-bold text-stone-900 mb-2 flex items-center gap-2">
                      🏆 {analysisResult.winner_declaration}
                    </h2>
                    <p className="text-lg text-stone-700 font-medium leading-relaxed mt-4">
                      {analysisResult.core_evaluation}
                    </p>
                    <div className="mt-6 p-5 bg-stone-50 rounded-2xl border border-stone-100 text-stone-600 text-sm leading-relaxed italic flex gap-4">
                      <BookOpen className="w-6 h-6 text-stone-400 shrink-0" />
                      <span>{analysisResult.expert_footnote}</span>
                    </div>
                  </div>

                  {/* 深度多维诊断报告 */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2 border-b border-stone-200 pb-3">
                      🔍 深度多维诊断报告
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* 视觉解码 */}
                      <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100">
                        <h4 className="font-bold text-stone-800 mb-3 text-sm tracking-wider">👀 视觉与层级解码</h4>
                        <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line">
                          {analysisResult.visual_decoding}
                        </p>
                      </div>

                      {/* 公式验证 */}
                      <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 shadow-lg">
                        <h4 className="font-mono font-bold text-teal-400 mb-3 text-sm tracking-wider flex items-center gap-2">
                          <BarChart3 className="w-4 h-4" /> L = S × H 公式推演
                        </h4>
                        <p className="text-stone-300 text-sm leading-relaxed whitespace-pre-line">
                          {analysisResult.formula_analysis}
                        </p>
                      </div>
                    </div>

                    {/* 生活视角 */}
                    <div className="bg-amber-50/50 rounded-2xl p-6 border border-amber-100/50">
                      <h4 className="font-bold text-amber-900 mb-3 text-sm tracking-wider">🎨 情绪与体验视角</h4>
                      <p className="text-amber-800/90 text-sm leading-relaxed whitespace-pre-line">
                        {analysisResult.personal_perspective}
                      </p>
                    </div>
                  </div>

                  {/* 行动建议 */}
                  <div className="space-y-6 pt-4">
                    <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2 border-b border-stone-200 pb-3">
                      🛠️ 行动与干预指南
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
                        <h4 className="font-bold text-blue-900 mb-3 text-sm">🏙️ 宏观城建策略</h4>
                        <p className="text-blue-800 text-sm leading-relaxed whitespace-pre-line">
                          {analysisResult.action_advice_urban}
                        </p>
                      </div>
                      <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100">
                        <h4 className="font-bold text-emerald-900 mb-3 text-sm">🏠 微观空间优化</h4>
                        <p className="text-emerald-800 text-sm leading-relaxed whitespace-pre-line">
                          {analysisResult.action_advice_personal}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 哲理总结 */}
                  <div className="text-center pt-8 pb-4">
                    <p className="text-lg text-stone-800 font-medium italic leading-relaxed max-w-2xl mx-auto">
                      "{analysisResult.summary}"
                    </p>
                  </div>
                </div>

                {/* 右侧：硬核数据仪表盘 (占 4 列) */}
                <div className="lg:col-span-4 space-y-6">
                  {/* 分数卡片 */}
                  <Card className="bg-white border-stone-200 shadow-lg rounded-3xl overflow-hidden sticky top-8">
                    <div className="p-8 text-center border-b border-stone-100 bg-gradient-to-b from-stone-50 to-white">
                      <div className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Livingness Index</div>
                      <div className="flex items-baseline justify-center text-teal-600">
                        <span className="text-8xl font-black tracking-tighter">{analysisResult.vitality_score || "--"}</span>
                        <span className="text-2xl text-stone-400 font-medium ml-1">/100</span>
                      </div>
                    </div>
                    
                    {/* 15 属性排行榜 */}
                    <div className="p-6 space-y-5 bg-white">
                      <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> 核心生命力属性分解
                      </h4>
                      {analysisResult.top_attributes?.map((attr: any, idx: number) => (
                        <div key={idx} className="space-y-2 group">
                          <ScoreRow label={attr.name} score={attr.score} />
                          <p className="text-xs text-stone-500 leading-relaxed pl-1 group-hover:text-stone-800 transition-colors">
                            {attr.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="p-4 bg-stone-50 border-t border-stone-100">
                      <Button variant="outline" className="w-full rounded-full bg-white text-stone-900 hover:bg-stone-100 py-6 font-semibold" onClick={() => { setStep("upload"); setImages([]); setAnalysisResult(null); }}>
                        分析下一个空间
                      </Button>
                    </div>
                  </Card>
                </div>

              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ------ 底部组件 ------
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

function ScoreRow({ label, score }: { label: string, score: number }) {
  return (
    <div className="flex items-center justify-between text-sm gap-4">
      <span className="text-stone-800 font-bold truncate max-w-[100px]" title={label}>{label}</span>
      <div className="flex items-center gap-3.5 flex-1 justify-end">
        <div className="h-2 w-full max-w-[100px] rounded-full bg-stone-100 overflow-hidden shadow-inner">
          <motion.div 
            className="h-full bg-teal-500 rounded-full" 
            initial={{ width: 0 }}
            animate={{ width: `${score * 10}%` }}
            transition={{ duration: 1, delay: 0.2 }}
          />
        </div>
        <span className="font-mono font-black text-stone-900 w-8 text-right text-base">{score.toFixed(1)}</span>
      </div>
    </div>
  );
}