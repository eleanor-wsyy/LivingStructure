import React, { useState } from "react";
import { Button, Card, cn } from "@/app/components/ui";
import { Upload, Loader2, Plus, X } from "lucide-react";
import { motion } from "framer-motion"; // 注意：如果报错，请改成 "motion/react"
import { AnalysisPreview } from "@/app/components/AnalysisPreview";
import { useLanguage } from "@/app/i18n/LanguageContext";
// 👇 新增了官方的 AI SDK
import { GoogleGenerativeAI } from "@google/generative-ai";

export function Analyze() {
  const [step, setStep] = useState<"upload" | "processing" | "results">("upload");
  const [images, setImages] = useState<string[]>([]); 
  // 👇 这个状态用来接住 AI 吐出来的数据
  const [analysisResult, setAnalysisResult] = useState<any>(null); 
  const { trans } = useLanguage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string].slice(0, 2));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // 辅助函数：将 Base64 转换给 Gemini
  const base64ToGenerativePart = (base64String: string) => {
    const mimeType = base64String.substring(base64String.indexOf(":") + 1, base64String.indexOf(";"));
    const base64Data = base64String.split(",")[1];
    return {
      inlineData: { data: base64Data, mimeType },
    };
  };

  // 👇 核心来了！这是真正调用 AI 的函数
 const startAnalysis = async () => {
    if (images.length === 0) return;
    setStep("processing");

    try {
      // 第一步：检查 Vite 有没有读到你的 Key
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      console.log("【检查 1】API Key 读取状态:", apiKey ? "已读到！" : "失败，是 undefined");
      
      if (!apiKey) {
        throw new Error("Vite 根本没有读到你的 API Key！请确保 .env 里的变量名是 VITE_GEMINI_API_KEY，且保存了文件，并彻底重启了终端。");
      }

      // 第二步：初始化 AI 模型
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash",
        generationConfig: { responseMimeType: "application/json" },
        systemInstruction: `你是一位精通江斌教授“活结构”理论与克里斯托弗·亚历山大《秩序的本质》的计算美学诊断专家。你的任务是通过识别图片的比例层级和15个增强活力的几何属性，来评估空间的生命力。` 
      });

      const imageParts = images.map(img => base64ToGenerativePart(img));
      console.log("【检查 2】准备发送的图片数量:", imageParts.length);

      const prompt = `
        请分析我上传的图片。如果是一张图，请直接分析其活结构；如果是两张图，请对比哪一张更具活力。
        你必须返回一个严格的 JSON 对象，包含以下三个字段：
        1. "total_score": 一个0到100的整数，代表综合活力值。
        2. "insight": 一段约100字的专业洞察。指出画面在头/尾分割法上的表现，最突出的属性和最缺失的属性，并给出优化建议。
        3. "scores": 一个包含5个小数的数组（0.0到10.0），分别对应以下5个属性的得分：[中心, 边界, 交替重复, 局部对称, 对比]。
        示例：{"total_score": 85, "insight": "画面具有良好的层级...", "scores": [8.5, 9.0, 7.5, 8.0, 6.5]}
      `;

      console.log("【检查 3】正在向 Google 服务器发送请求...");
      const result = await model.generateContent([prompt, ...imageParts]);
      
      console.log("【检查 4】成功收到回复！开始解析...");
      const responseText = result.response.text();
      const parsedData = JSON.parse(responseText);
      
      setAnalysisResult(parsedData);
      setStep("results");

    } catch (error: any) {
      console.error("=== 详细报错信息 ===", error);
      // 👇 这里直接把最底层的错误信息弹出来！
      alert(`报错啦：${error.message || error}`);
      setStep("upload");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        
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

        {/* 主内容区 */}
        <div className="min-h-[600px]">
          
          {/* 1. 上传阶段 */}
          {step === "upload" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-stone-900">{trans.analyze.uploadTitle}</h2>
                <p className="mt-2 text-stone-500">{trans.analyze.uploadDesc}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {[0, 1].map((index) => (
                  <div key={index} className={cn("relative aspect-[4/3] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-colors", images[index] ? "border-transparent" : "border-stone-300 hover:border-teal-500 hover:bg-stone-50/50 bg-white")}>
                    {images[index] ? (
                      <>
                        <img src={images[index]} alt={`Upload ${index}`} className="h-full w-full object-cover" />
                        <button onClick={() => removeImage(index)} className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 backdrop-blur-sm transition-all"><X className="h-4 w-4" /></button>
                      </>
                    ) : (
                      <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-6 text-center">
                        <div className="mb-4 rounded-full bg-stone-100 p-4">
                          {index === 0 ? <Upload className="h-8 w-8 text-stone-400" /> : <Plus className="h-8 w-8 text-stone-400" />}
                        </div>
                        <span className="text-stone-600 font-medium">{index === 0 ? "上传主图" : "上传对比图 (可选)"}</span>
                        <input type="file" hidden onChange={handleFileChange} accept="image/*" multiple={index === 0} />
                      </label>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-8">
                <Button className="bg-stone-900 px-12 py-6 text-lg" onClick={startAnalysis} disabled={images.length === 0}>
                  {images.length === 2 ? "开始对比分析" : "开始活力诊断"}
                </Button>
              </div>
            </motion.div>
          )}

          {/* 2. 处理阶段 */}
          {step === "processing" && (
            <div className="flex h-[500px] flex-col items-center justify-center text-center">
              <div className="relative mb-8 h-24 w-24">
                 <div className="absolute inset-0 rounded-full border-4 border-stone-200" />
                 <motion.div className="absolute inset-0 rounded-full border-4 border-teal-600 border-t-transparent" animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />
                 <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="h-8 w-8 text-teal-600 animate-pulse" /></div>
              </div>
              <h2 className="text-xl font-semibold text-stone-900">{trans.analyze.analyzingTitle}</h2>
              <p className="mt-2 text-stone-500">正在应用《秩序的本质》计算活力层级...</p>
            </div>
          )}

          {/* 3. 结果展示阶段 */}
          {step === "results" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <AnalysisPreview />
                <div className="rounded-xl border border-stone-200 bg-white p-6">
                  <h3 className="font-semibold text-stone-900 mb-4">{trans.analyze.insightTitle}</h3>
                  <p className="text-stone-600 leading-relaxed">
                    {/* 👇 动态显示 AI 写的洞察 */}
                    {analysisResult?.insight || trans.analyze.insightText}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <Card className="bg-stone-900 text-white border-stone-800">
                  <div className="p-6 text-center">
                    <div className="text-sm font-medium text-stone-400 uppercase tracking-widest">{trans.analyze.scoreLabel}</div>
                    <div className="mt-4 flex items-center justify-center text-6xl font-bold tracking-tighter text-teal-400">
                      {/* 👇 动态显示 AI 给的总分 */}
                      {analysisResult?.total_score || "--"}
                      <span className="text-xl text-stone-500 font-normal ml-2">/100</span>
                    </div>
                    <div className="mt-4 text-xs text-stone-500 font-mono">{trans.analyze.formula}</div>
                  </div>
                </Card>

                <Card className="bg-white">
                  <div className="p-4 border-b border-stone-100 font-semibold text-stone-900">{trans.analyze.breakdown}</div>
                  <div className="p-4 space-y-4">
                    {/* 👇 动态显示 AI 给的各项属性打分 */}
                    <ScoreRow label={trans.theory.attributes[1]?.name || "中心"} score={analysisResult?.scores?.[0] || 0} />
                    <ScoreRow label={trans.theory.attributes[2]?.name || "边界"} score={analysisResult?.scores?.[1] || 0} />
                    <ScoreRow label={trans.theory.attributes[3]?.name || "交替重复"} score={analysisResult?.scores?.[2] || 0} />
                    <ScoreRow label={trans.theory.attributes[7]?.name || "局部对称"} score={analysisResult?.scores?.[3] || 0} />
                    <ScoreRow label={trans.theory.attributes[9]?.name || "对比"} score={analysisResult?.scores?.[4] || 0} />
                  </div>
                </Card>

                 <Button 
                   variant="ghost" 
                   className="w-full" 
                   onClick={() => {
                     setStep("upload");
                     setImages([]); 
                     setAnalysisResult(null);
                   }}
                 >
                   {trans.analyze.analyzeAnother}
                 </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// ------ 底部组件 ------
function StepItem({ current, target, number, label }: { current: string, target: string, number: number, label: string }) {
  const isActive = current === target;
  return (
    <div className={cn("flex items-center gap-2", isActive ? "text-stone-900" : "text-stone-400")}>
      <div className={cn("flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors", isActive ? "bg-stone-900 text-white" : "bg-stone-200 text-stone-500")}>
        {number}
      </div>
      <span>{label}</span>
    </div>
  );
}

function ScoreRow({ label, score }: { label: string, score: number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-stone-600 truncate max-w-[150px]" title={label}>{label}</span>
      <div className="flex items-center gap-3">
        <div className="h-2 w-24 rounded-full bg-stone-100 overflow-hidden">
          <div className="h-full bg-teal-600 rounded-full transition-all duration-1000" style={{ width: `${score * 10}%` }} />
        </div>
        <span className="font-mono font-medium text-stone-900 w-6 text-right">{score}</span>
      </div>
    </div>
  );
}