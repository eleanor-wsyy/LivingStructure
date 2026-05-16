import React, { useState } from "react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { cn, Badge, Section } from "@/app/components/ui";
import { motion, AnimatePresence } from "framer-motion";
import {
  Columns, MoveHorizontal, Check, X,
  Building2, BookOpen, Sparkles, Loader2,
  Heart, Box, Activity, Smartphone, Briefcase, Code, Microscope, Palette, Music, PenTool, Coffee, LayoutTemplate, Info, ScanLine, Layers, ArrowRight, Leaf
} from "lucide-react";
import { useLanguage } from "@/app/i18n/LanguageContext";
import { useGemini } from '../hooks/useGemini';
import { properties } from "@/app/data/properties";

// --- Components ---

const PropertyVisuals = ({ imgPos, imgNeg, title }: { imgPos: string, imgNeg?: string, title: string }) => {
  const [viewMode, setViewMode] = useState<'split' | 'compare' | 'strong' | 'weak'>('split');
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const finalImgNeg = imgNeg || "https://images.unsplash.com/photo-1572533541497-ed8f48f2e7e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm5pc3QlMjBnbGFzcyUyMGN1cnRhaW4lMjB3YWxsJTIwc2t5c2NyYXBlciUyMGRldGFpbHxlbnwxfHx8fDE3NzE2NDk5NTF8MA&ixlib=rb-4.1.0&q=80&w=1080";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (viewMode !== 'compare') return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      setSliderPos((x / rect.width) * 100);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-center mb-6">
        <div className="inline-flex p-1 bg-stone-100/50 rounded-full border border-border/50 backdrop-blur-sm">
          {[
            { id: 'split', icon: Columns, label: 'Split' },
            { id: 'compare', icon: MoveHorizontal, label: 'Compare' },
            { id: 'strong', icon: Check, label: 'Strong' },
            { id: 'weak', icon: X, label: 'Weak' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all duration-300",
                viewMode === mode.id
                  ? "bg-card text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-muted-foreground hover:bg-muted/50"
              )}
            >
              <mode.icon className="w-3 h-3" />
              <span className="hidden md:inline">{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div
        ref={containerRef}
        className={cn(
          "w-full aspect-[4/3] md:aspect-[3/2] bg-stone-100 rounded-sm relative overflow-hidden border border-border select-none",
          viewMode === 'compare' ? "cursor-ew-resize touch-none" : ""
        )}
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
      >
        {viewMode === 'split' && (
          <div className="grid grid-cols-2 w-full h-full divide-x divide-stone-200">
            <div className="relative overflow-hidden group">
              <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-[9px] px-2 py-1 uppercase tracking-widest font-bold z-10 flex items-center gap-1 opacity-80 backdrop-blur-sm">
                <Check className="w-3 h-3" /> Strong
              </div>
              <ImageWithFallback src={imgPos} alt="Strong" className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="relative overflow-hidden group grayscale opacity-90">
              <div className="absolute top-2 left-2 bg-muted text-muted-foreground text-[9px] px-2 py-1 uppercase tracking-widest font-bold z-10 flex items-center gap-1 opacity-80 backdrop-blur-sm">
                <X className="w-3 h-3" /> Weak
              </div>
              <ImageWithFallback src={finalImgNeg} alt="Weak" className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
            </div>
          </div>
        )}
        {viewMode === 'strong' && (
          <div className="w-full h-full relative">
            <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-[10px] px-3 py-1.5 uppercase tracking-widest font-bold z-10 flex items-center gap-2 shadow-sm">
              <Check className="w-3 h-3" /> Strong Structure
            </div>
            <ImageWithFallback src={imgPos} alt="Strong" className="w-full h-full object-cover object-top" />
          </div>
        )}
        {viewMode === 'weak' && (
          <div className="w-full h-full relative grayscale">
            <div className="absolute top-4 left-4 bg-muted text-muted-foreground text-[10px] px-3 py-1.5 uppercase tracking-widest font-bold z-10 flex items-center gap-2 shadow-sm border border-stone-300">
              <X className="w-3 h-3" /> Weak Structure
            </div>
            <ImageWithFallback src={finalImgNeg} alt="Weak" className="w-full h-full object-cover object-top opacity-80" />
          </div>
        )}
        {viewMode === 'compare' && (
          <div className="w-full h-full relative group">
            <div className="absolute inset-0 grayscale opacity-90">
              <ImageWithFallback src={finalImgNeg} alt="Weak" className="w-full h-full object-cover object-top" />
              <div className="absolute top-4 right-4 bg-muted/90 text-muted-foreground text-[10px] px-2 py-1 uppercase tracking-widest font-bold z-10 flex items-center gap-1 backdrop-blur-sm pointer-events-none">
                <X className="w-3 h-3" /> Weak
              </div>
            </div>
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              <ImageWithFallback src={imgPos} alt="Strong" className="w-full h-full object-cover object-top" />
              <div className="absolute top-4 left-4 bg-stone-900/90 text-white text-[10px] px-2 py-1 uppercase tracking-widest font-bold z-10 flex items-center gap-1 backdrop-blur-sm pointer-events-none">
                <Check className="w-3 h-3" /> Strong
              </div>
            </div>
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-card shadow-[0_0_15px_rgba(0,0,0,0.3)] z-20 pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-card/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center border border-border text-muted-foreground">
                <MoveHorizontal className="w-5 h-5" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export function Properties() {
  const [activePropId, setActivePropId] = useState<number>(1);
  const [userBackground, setUserBackground] = useState<string>("architecture");
  const [dynamicExamples, setDynamicExamples] = useState<Record<string, { text: string; imageUrl?: string }>>({});
  const [isGeneratingExample, setIsGeneratingExample] = useState(false);

  const { trans, language } = useLanguage();
  const isEn = language === 'en';
  const { analyzeStructure, isThinking } = useGemini();

  const activeProp = properties.find(p => p.n === activePropId) || properties[0];

  const backgroundOptions = [
    { id: "architecture", labelEn: "Architecture", labelZh: "建筑学", icon: Building2 },
    { id: "industrial", labelEn: "Industrial Design", labelZh: "工业设计", icon: Box },
    { id: "uiux", labelEn: "UI/UX Design", labelZh: "UI/UX设计", icon: Smartphone },
    { id: "software", labelEn: "Software Eng", labelZh: "软件工程", icon: Code },
    { id: "biology", labelEn: "Biology", labelZh: "生物医学", icon: Microscope },
    { id: "business", labelEn: "Business", labelZh: "商业管理", icon: Briefcase },
    { id: "art", labelEn: "Art & Media", labelZh: "艺术与传媒", icon: Palette },
    { id: "music", labelEn: "Music", labelZh: "音乐作曲", icon: Music },
    { id: "literature", labelEn: "Literature", labelZh: "文学创作", icon: PenTool },
    { id: "everyday", labelEn: "Everyday Life", labelZh: "日常生活", icon: Coffee }
  ];

  const handleInspireMe = async () => {
    const cacheKey = `${activeProp.n}-${userBackground}`;
    if (dynamicExamples[cacheKey]) return;

    setIsGeneratingExample(true);
    const bgInfo = backgroundOptions.find(b => b.id === userBackground);
    const bgName = bgInfo ? (isEn ? bgInfo.labelEn : bgInfo.labelZh) : userBackground;

    const prompt = `
      You are an expert in Christopher Alexander's "The Nature of Order" (Book 1) and an inspiring mentor.
      
      Property Context:
      Number: ${activeProp.n}
      Name: "${activeProp.tEn}" (${activeProp.tZh})
      Definition: "${activeProp.quoteEn}"
      Mechanism: "${activeProp.mechEn}"
      
      User's Background: "${bgName}"
      
      Task 1: Generate a vivid, concrete, and highly inspiring example of how this specific property applies to their field.
      - If property is #14 (Simplicity and Inner Calm): Focus on how removing structural noise creates a sense of profound order, not just "minimalism".
      - If property is #15 (Not-Separateness): Focus on how the object/system is connected to its context or the "larger whole" through blurring boundaries or interlocking.
      - Use professional terminology suitable for "${bgName}".
      - Keep it under 150 words.
      
      Task 2: Provide a detailed English image generation prompt (max 25 words) that visualizes this example. 
      Use high-quality keywords (photorealistic, architectural photography, macro, etc.).
      Enclose it EXACTLY in this format: [IMAGE: <prompt>]
      
      ==================================================
      ⚠️ OUTPUT LANGUAGE: ${isEn ? 'English' : '简体中文 (Simplified Chinese)'} ⚠️
      The example text MUST be in ${isEn ? 'English' : 'Chinese'}.
      The [IMAGE: <prompt>] tag MUST be in English.
      ==================================================
    `;

    try {
      const response = await analyzeStructure(prompt);
      if (response) {
        let text = response;
        let imageUrl: string | undefined = undefined;

        const imageMatch = response.match(/\[IMAGE:\s*(.*?)\]/is);
        if (imageMatch && imageMatch[1]) {
          const imagePrompt = imageMatch[1].replace(/\n/g, ' ').trim();
          const seed = Math.floor(Math.random() * 100000);
          imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=800&height=400&nologo=true&seed=${seed}`;
          text = response.replace(imageMatch[0], '').trim();
        }

        setDynamicExamples(prev => ({ ...prev, [cacheKey]: { text, imageUrl } }));
      }
    } catch (error) {
      console.error("Failed to generate adaptive example:", error);
    } finally {
      setIsGeneratingExample(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-card text-stone-800 pb-24">
      {/* Header Section - 方案二：统一浅色 */}
      <div className="w-full shrink-0 bg-stone-50/50 backdrop-blur-sm text-stone-900 pt-16 pb-10 px-4 md:px-16 relative overflow-hidden border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mt-4"
          >
            <Badge variant="outline" className="mb-4 border-amber-500/40 text-amber-600 bg-amber-100/50 uppercase tracking-[0.3em] font-mono text-[10px]">
              {isEn ? "The Fundamental Code" : "底层几何代码"}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-serif font-black mb-4 tracking-tighter leading-tight text-stone-800">
              {isEn ? "15 PROPERTIES" : "15 个核心属性"}
            </h1>
            <p className="max-w-2xl text-stone-500 text-base md:text-lg font-serif leading-relaxed italic">
              {isEn
                ? "The structural patterns that appear in all living things, from the microscopic cell to the vastness of the cosmos."
                : "这些结构模式存在于所有生命体中，从微观细胞到宏大的宇宙尺度，它们是活力的源泉。"}
            </p>
          </motion.div>
        </div>

        {/* Floating Geometric Elements (适配浅色的边框) */}
        <div className="absolute top-1/2 right-10 -translate-y-1/2 hidden lg:block opacity-30">
          <div className="relative w-48 h-48 border border-stone-300 rotate-45 flex items-center justify-center">
            <div className="w-32 h-32 border border-stone-200 flex items-center justify-center">
              <div className="w-20 h-20 border border-amber-500/40" />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex-1 bg-white/20 backdrop-blur-[2px]">
        <div className="w-full max-w-7xl mx-auto p-4 md:p-16">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Sidebar Navigation */}
            <div className="w-full lg:w-1/4">
              <div className="sticky top-32 space-y-1 bg-white/60 backdrop-blur-xl p-4 md:p-6 rounded-[2rem] border border-white/40 shadow-xl shadow-stone-900/5">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-6 px-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  {isEn ? "Index of Properties" : "属性索引"}
                </h4>
                <div className="grid grid-cols-1 gap-1">
                  {properties.map((prop) => (
                    <button
                      key={prop.n}
                      onClick={() => setActivePropId(prop.n)}
                      className={cn(
                        "group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 text-left",
                        activePropId === prop.n
                          ? "bg-stone-900 text-white shadow-xl shadow-stone-900/20 scale-[1.02] z-10"
                          : "bg-transparent text-stone-500 hover:bg-stone-100/50 hover:text-stone-900"
                      )}
                    >
                      <span className={cn(
                        "text-[10px] font-mono font-bold transition-colors",
                        activePropId === prop.n ? "text-amber-400" : "text-stone-400 group-hover:text-stone-600"
                      )}>
                        {String(prop.n).padStart(2, '0')}
                      </span>
                      <span className="font-serif font-bold text-sm tracking-wide">
                        {isEn ? prop.tEn : prop.tZh}
                      </span>
                      {activePropId === prop.n && (
                        <motion.div layoutId="active-indicator" className="ml-auto">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="w-full lg:w-3/4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProp.n}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-12"
                >
                  {/* Intro Card */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="h-px flex-1 bg-stone-200" />
                      <span className="text-amber-500 font-mono text-xl">{String(activeProp.n).padStart(2, '0')}</span>
                      <div className="h-px flex-1 bg-stone-200" />
                    </div>
                    <h2 className="text-4xl md:text-6xl font-serif font-black text-center text-stone-900 tracking-tight">
                      {isEn ? activeProp.tEn : activeProp.tZh}
                    </h2>
                    <p className="text-xl md:text-2xl text-stone-600 text-center font-serif leading-relaxed italic max-w-3xl mx-auto">
                      "{isEn ? activeProp.quoteEn : activeProp.quoteZh}"
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Mechanism</span>
                      <p className="font-mono text-sm text-stone-800">{isEn ? activeProp.mechEn : activeProp.mechZh}</p>
                    </div>
                    <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100 shadow-sm flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600/60 mb-2">Relationship to L=S×H</span>
                      <p className="font-mono text-sm text-amber-900 flex items-center gap-2">
                        <Info className="w-4 h-4" /> {isEn ? activeProp.relEn : activeProp.relZh}
                      </p>
                    </div>
                  </div>

                  {/* Nature Section */}
                  <Section title={isEn ? "Manifestation in Nature" : "自然界中的体现"} className="!pt-0">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      <div className="flex-1 space-y-6">
                        <div className="p-8 bg-emerald-50/30 rounded-3xl border border-emerald-100 relative overflow-hidden">
                          <Leaf className="absolute -top-4 -right-4 w-24 h-24 text-emerald-500/10" />
                          <p className="text-stone-700 text-lg leading-relaxed font-serif relative z-10">
                            {isEn ? activeProp.natureEn : activeProp.natureZh}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-stone-400 text-xs font-mono">
                          <BookOpen className="w-4 h-4" />
                          {isEn ? "Source: The Nature of Order, Book 1" : "来源：《秩序的本质》卷一"}
                        </div>
                      </div>
                      <div className="w-full md:w-2/5 aspect-square bg-stone-100 rounded-3xl border border-stone-200 overflow-hidden flex items-center justify-center p-4">
                        {activeProp.bookImg ? (
                          <img src={activeProp.bookImg} alt="Nature Illustration" className="max-w-full max-h-full object-contain mix-blend-multiply opacity-90" />
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-stone-400">
                            <ScanLine className="w-8 h-8 animate-pulse" />
                            <span className="text-[10px] font-mono uppercase tracking-widest">Scanning Archive...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Section>

                  {/* Design Section */}
                  <Section title={isEn ? "Spatial Design Comparison" : "空间设计实证对比"} className="!pt-0">
                    <div className="space-y-8">
                      <p className="text-stone-600 text-lg leading-relaxed font-serif max-w-4xl">
                        {isEn ? activeProp.exampleEn : activeProp.exampleZh}
                      </p>
                      <div className="bg-card border border-stone-200 rounded-[2.5rem] p-6 md:p-12 shadow-inner">
                        <PropertyVisuals
                          key={activeProp.n}
                          imgPos={activeProp.imgPos}
                          imgNeg={activeProp.imgNeg}
                          title={isEn ? activeProp.tEn : activeProp.tZh}
                        />
                      </div>
                    </div>
                  </Section>

                  {/* Adaptive AI Section */}
                  <div className="bg-stone-950 p-8 md:p-14 rounded-[3rem] border border-stone-800 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />

                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12 relative z-10">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                            <Sparkles className="w-5 h-5 text-white" />
                          </div>
                          <h4 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight">
                            {isEn ? 'Adaptive AI Lab' : '自适应 AI 实验室'}
                          </h4>
                        </div>
                        <p className="text-stone-400 text-sm md:text-base font-serif max-w-md">
                          {isEn
                            ? 'Bridge the theoretical gap. Generate a custom interpretation of this property mapped to your specific field.'
                            : '跨越理论鸿沟。生成一个针对你所选专业领域的定制化解读。'}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                        <select
                          value={userBackground}
                          onChange={(e) => setUserBackground(e.target.value)}
                          className="w-full sm:w-64 px-4 py-3 bg-stone-900 border border-stone-700 rounded-xl text-sm text-stone-200 outline-none focus:ring-2 focus:ring-amber-500/50 font-serif appearance-none cursor-pointer"
                        >
                          {backgroundOptions.map(bg => (
                            <option key={bg.id} value={bg.id}>
                              {isEn ? bg.labelEn : bg.labelZh}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={handleInspireMe}
                          disabled={isGeneratingExample || isThinking}
                          className="w-full sm:w-auto px-8 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-sm font-black tracking-widest uppercase shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap active:scale-95"
                        >
                          {isGeneratingExample || isThinking ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> {isEn ? 'Computing...' : '计算中...'}</>
                          ) : (
                            <>{isEn ? 'Inspire Me' : '启发我'}</>
                          )}
                        </button>
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      {dynamicExamples[`${activeProp.n}-${userBackground}`] ? (
                        <motion.div
                          key="generated-content"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex flex-col gap-8 relative z-10"
                        >
                          <div className="bg-stone-900/50 p-8 md:p-10 rounded-3xl border border-stone-800">
                            <div className="flex items-center gap-2 mb-6">
                              <div className="h-px w-8 bg-amber-500/50" />
                              <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest">Interpretation</span>
                            </div>
                            <p className="text-stone-200 text-lg md:text-xl leading-relaxed font-serif text-justify whitespace-pre-line">
                              {dynamicExamples[`${activeProp.n}-${userBackground}`].text}
                            </p>
                          </div>

                          {dynamicExamples[`${activeProp.n}-${userBackground}`].imageUrl && (
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-stone-800 bg-stone-900 w-full group/img">
                              <img
                                src={dynamicExamples[`${activeProp.n}-${userBackground}`].imageUrl}
                                alt="AI generated example"
                                referrerPolicy="no-referrer"
                                className="w-full h-auto max-h-[60vh] object-contain block mx-auto"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent opacity-60" />
                              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 bg-white/10 backdrop-blur rounded-lg flex items-center justify-center">
                                    <Layers className="w-4 h-4 text-white" />
                                  </div>
                                  <span className="text-xs text-white font-bold uppercase tracking-widest">Visual Reconstruction</span>
                                </div>
                                <span className="text-[8px] text-white/40 font-mono">GEN-ID: LS-{activeProp.n}-{Math.floor(Math.random() * 1000)}</span>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="placeholder"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="h-64 bg-stone-900/30 rounded-3xl border border-stone-800 border-dashed flex flex-col items-center justify-center text-stone-600 relative z-10"
                        >
                          <Activity className="w-12 h-12 mb-4 opacity-20" />
                          <p className="text-sm font-serif italic">
                            {isEn ? 'Awaiting structural resonance input...' : '等待结构共振输入...'}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Navigation CTA */}
                  <div className="pt-12 border-t border-stone-200 flex justify-between items-center">
                    <button
                      onClick={() => setActivePropId(prev => Math.max(1, prev - 1))}
                      disabled={activePropId === 1}
                      className="flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors disabled:opacity-0"
                    >
                      <Check className="w-4 h-4 rotate-180" />
                      <span className="text-xs font-bold uppercase tracking-widest">{isEn ? "Previous" : "上一个"}</span>
                    </button>
                    <button
                      onClick={() => setActivePropId(prev => Math.min(15, prev + 1))}
                      disabled={activePropId === 15}
                      className="flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors disabled:opacity-0"
                    >
                      <span className="text-xs font-bold uppercase tracking-widest">{isEn ? "Next Property" : "下一个属性"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}