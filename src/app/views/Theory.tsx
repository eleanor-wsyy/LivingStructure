import React, { useState, useRef } from "react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { cn, Badge, Section } from "@/app/components/ui";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowLeft, Quote, Info, Check, X,
  Columns, ScanLine, MoveHorizontal,
  Eye, Layers, ArrowUpRight, Leaf, Building2, BookOpen, Sparkles, Microscope, Loader2, RefreshCcw,
  Heart, Box, Brain, Activity
} from "lucide-react";
import { useLanguage } from "@/app/i18n/LanguageContext";
import { useGemini } from '../hooks/useGemini';
import { properties } from "@/app/data/properties";
import { cases, CATEGORIES } from "@/app/data/cases";
import { STATIC_QUESTION_POOL } from "@/app/data/questions";

// --- Data ---
const genericNegative = "https://images.unsplash.com/photo-1572533541497-ed8f48f2e7e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm5pc3QlMjBnbGFzcyUyMGN1cnRhaW4lMjB3YWxsJTIwc2t5c2NyYXBlciUyMGRldGFpbHxlbnwxfHx8fDE3NzE2NDk5NTF8MA&ixlib=rb-4.1.0&q=80&w=1080";

// --- Components ---

const PropertyVisuals = ({ imgPos, imgNeg, title }: { imgPos: string, imgNeg?: string, title: string }) => {
  const [viewMode, setViewMode] = useState<'split' | 'compare' | 'strong' | 'weak'>('split');
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const finalImgNeg = imgNeg || genericNegative;

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
        <div className="inline-flex p-1 bg-stone-100/50 rounded-full border border-stone-200/50 backdrop-blur-sm">
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
                  ? "bg-white text-stone-900 shadow-sm border border-stone-100"
                  : "text-stone-400 hover:text-stone-600 hover:bg-stone-200/50"
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
          "w-full aspect-[4/3] md:aspect-[2/1] bg-stone-100 rounded-sm relative overflow-hidden border border-stone-200 select-none",
          viewMode === 'compare' ? "cursor-ew-resize touch-none" : ""
        )}
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
      >
        {viewMode === 'split' && (
          <div className="grid grid-cols-2 w-full h-full divide-x divide-stone-200">
            <div className="relative overflow-hidden group">
              <div className="absolute top-2 left-2 bg-stone-900 text-white text-[9px] px-2 py-1 uppercase tracking-widest font-bold z-10 flex items-center gap-1 opacity-80 backdrop-blur-sm">
                <Check className="w-3 h-3" /> Strong
              </div>
              <ImageWithFallback src={imgPos} alt="Strong" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="relative overflow-hidden group grayscale opacity-90">
              <div className="absolute top-2 left-2 bg-stone-200 text-stone-500 text-[9px] px-2 py-1 uppercase tracking-widest font-bold z-10 flex items-center gap-1 opacity-80 backdrop-blur-sm">
                <X className="w-3 h-3" /> Weak
              </div>
              <ImageWithFallback src={finalImgNeg} alt="Weak" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
          </div>
        )}
        {viewMode === 'strong' && (
          <div className="w-full h-full relative">
            <div className="absolute top-4 left-4 bg-stone-900 text-white text-[10px] px-3 py-1.5 uppercase tracking-widest font-bold z-10 flex items-center gap-2 shadow-sm">
              <Check className="w-3 h-3" /> Strong Structure
            </div>
            <ImageWithFallback src={imgPos} alt="Strong" className="w-full h-full object-cover" />
          </div>
        )}
        {viewMode === 'weak' && (
          <div className="w-full h-full relative grayscale">
            <div className="absolute top-4 left-4 bg-stone-200 text-stone-600 text-[10px] px-3 py-1.5 uppercase tracking-widest font-bold z-10 flex items-center gap-2 shadow-sm border border-stone-300">
              <X className="w-3 h-3" /> Weak Structure
            </div>
            <ImageWithFallback src={finalImgNeg} alt="Weak" className="w-full h-full object-cover opacity-80" />
          </div>
        )}
        {viewMode === 'compare' && (
          <div className="w-full h-full relative group">
            <div className="absolute inset-0 grayscale opacity-90">
              <ImageWithFallback src={finalImgNeg} alt="Weak" className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4 bg-stone-200/90 text-stone-600 text-[10px] px-2 py-1 uppercase tracking-widest font-bold z-10 flex items-center gap-1 backdrop-blur-sm pointer-events-none">
                <X className="w-3 h-3" /> Weak
              </div>
            </div>
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              <ImageWithFallback src={imgPos} alt="Strong" className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 bg-stone-900/90 text-white text-[10px] px-2 py-1 uppercase tracking-widest font-bold z-10 flex items-center gap-1 backdrop-blur-sm pointer-events-none">
                <Check className="w-3 h-3" /> Strong
              </div>
            </div>
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_15px_rgba(0,0,0,0.3)] z-20 pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center border border-stone-200 text-stone-600">
                <MoveHorizontal className="w-5 h-5" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


const OrganicViewSection = ({ isEn }: { isEn: boolean }) => (
  <Section
    title={isEn ? "The Organic Paradigm" : "有机空间范式"}
    subTitle={isEn ? "Mapping Physical Geometry to Human Cognition" : "物理几何与人类认知的深度映射"}
    className="!pt-12 !border-0"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      <div className="p-8 md:p-10 bg-white rounded-3xl border border-stone-200 grayscale hover:grayscale-0 transition-all duration-500 shadow-sm group">
        <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center mb-6 border border-stone-200 group-hover:bg-stone-900 group-hover:text-white transition-colors">
          <Box className="w-5 h-5 text-stone-500 group-hover:text-white" />
        </div>
        <h4 className="text-xl font-serif font-bold text-stone-900 mb-4">{isEn ? "The Cartesian 'Dead' Space" : "笛卡尔的「死寂」空间"}</h4>
        <p className="text-sm text-stone-600 leading-relaxed font-serif">
          {isEn
            ? "For 300 years, the mechanistic worldview taught us that space is a neutral, lifeless coordinate system. Matter is separate from us, and environmental geometry has no bearing on our inner emotional life."
            : "三百年来，机械论教导我们：空间只是中性、死寂的空盒子。物质与人是割裂的，周围的几何形状与我们内在的情感生活毫无瓜葛。"}
        </p>
      </div>

      <div className="p-8 md:p-10 bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl border border-amber-200 shadow-md group relative overflow-hidden">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm border border-amber-100 group-hover:bg-amber-500 transition-colors relative z-10">
          <Heart className="w-5 h-5 text-amber-500 group-hover:text-white" />
        </div>
        <h4 className="text-xl font-serif font-bold text-amber-950 mb-4 relative z-10">{isEn ? "The Organic Living Space" : "有机的「活力」空间"}</h4>
        <p className="text-sm text-amber-800/90 leading-relaxed font-serif relative z-10">
          {isEn
            ? "Space is a living organism. Healing the physical wholeness of our environment (moving a chair, softening an edge) is inextricably linked to healing our own inner fragmentation."
            : "空间是一个有生命的有机体。每一次几何结构的微调都在改变其生命度。治愈外部物理环境的整体性，就是在直接疗愈我们内心的破碎。"}
        </p>
        <Leaf className="absolute -bottom-8 -right-8 w-40 h-40 text-amber-500/10 rotate-12 group-hover:scale-110 transition-transform duration-700" />
      </div>
    </div>

    <div className="bg-stone-950 p-8 md:p-14 rounded-[2.5rem] border border-stone-800 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.png')] opacity-10 mix-blend-overlay" />

      <div className="text-center mb-12 relative z-10">
        <Badge variant="outline" className="mb-4 border-amber-500/50 text-amber-400 bg-amber-900/30 uppercase tracking-widest backdrop-blur-sm">
          {isEn ? "Cognitive Architecture" : "建筑认知学"}
        </Badge>
        <h3 className="text-2xl md:text-3xl font-serif font-black text-white">
          {isEn ? "How the Brain Processes Space" : "大脑如何解析空间生命力"}
        </h3>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
        <div className="flex-1 bg-stone-900/80 p-8 rounded-3xl border border-stone-700 backdrop-blur-md hover:border-stone-500 transition-colors h-full w-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 text-stone-300">
              <Brain className="w-6 h-6 text-stone-400" />
              <span className="font-bold tracking-widest uppercase text-sm">{isEn ? "Left Hemisphere" : "左脑 (理性)"}</span>
            </div>
            <span className="text-[10px] font-mono text-stone-500 uppercase">{isEn ? "Objective" : "客观世界"}</span>
          </div>
          <h5 className="text-2xl font-serif font-bold text-white mb-4">
            {isEn ? "Structural Beauty" : "客观结构美"}
          </h5>
          <div className="space-y-4">
            <p className="text-sm text-stone-400 leading-relaxed border-l-2 border-stone-600 pl-3">
              {isEn ? "Perceives the physical geometry, centers, boundaries, and mathematical order of the environment." : "解析物理几何：寻找中心、边界、粗糙性等客观存在的数学秩序。"}
            </p>
            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 font-mono text-amber-400/90 text-sm flex items-center justify-center">
              L = S × H (Livingness)
            </div>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-center justify-center shrink-0 w-24">
          <motion.div
            animate={{ height: ["0%", "100%", "0%"], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-16 bg-gradient-to-b from-stone-800 via-amber-500 to-stone-800"
          />
          <Activity className="w-8 h-8 text-amber-500 my-4" />
          <motion.div
            animate={{ height: ["0%", "100%", "0%"], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="w-px h-16 bg-gradient-to-b from-stone-800 via-teal-500 to-stone-800"
          />
        </div>

        <div className="md:hidden flex items-center justify-center w-full py-4">
          <ArrowRight className="w-6 h-6 text-amber-500 rotate-90 md:rotate-0" />
        </div>

        <div className="flex-1 bg-[#0f3531]/80 p-8 rounded-3xl border border-teal-800 backdrop-blur-md hover:border-teal-600 transition-colors h-full w-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 text-teal-100">
              <Heart className="w-6 h-6 text-teal-400" />
              <span className="font-bold tracking-widest uppercase text-sm">{isEn ? "Right Hemisphere" : "右脑 (感性)"}</span>
            </div>
            <span className="text-[10px] font-mono text-teal-500/70 uppercase">{isEn ? "Subjective" : "主观感受"}</span>
          </div>
          <h5 className="text-2xl font-serif font-bold text-white mb-4">
            {isEn ? "Felt Sense & Wholeness" : "主观生命感"}
          </h5>
          <div className="space-y-4">
            <p className="text-sm text-teal-200/80 leading-relaxed border-l-2 border-teal-600 pl-3">
              {isEn ? "Translates the structural complexity into a profound psychological feeling of safety, healing, and life." : "将复杂的客观几何结构，转化为深刻的心理感受：安全、治愈与生命力。"}
            </p>
            <div className="bg-teal-950/50 p-4 rounded-xl border border-teal-800/50 font-serif text-teal-300 text-sm flex items-center justify-center italic">
              "Felt more alive" (整体感)
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center relative z-10">
        <p className="text-stone-400 text-xs max-w-3xl mx-auto leading-relaxed">
          {isEn
            ? "The essence of Living Structure theory is to bridge this gap. By measuring and designing the objective geometric properties (Left Brain), we can reliably predict and cultivate the profound psychological wholeness experienced by human beings (Right Brain)."
            : "活力结构理论的核心正是跨越这道鸿沟。通过量化设计客观的几何属性（左脑），我们能够可靠地预测并培养人类深刻的心理整体感（右脑）。这就解释了为什么一个冰冷的空间被微调后，能让人感到被“治愈”。"}
        </p>
      </div>
    </div>
  </Section>
);

// ============================================================================
// 💡 全新落地模块：Campus Lab (理疗所 + 课室网格)
// ============================================================================

// --- Main Page Component ---

export function Theory() {
  const [activePropId, setActivePropId] = useState<number>(1);
  const [activeHowToIds, setActiveHowToIds] = useState<number[]>([]);
  const { trans, language } = useLanguage();
  const isEn = language === 'en';

  const activeProp = properties.find(p => p.n === activePropId) || properties[0];

  const { analyzeStructure, isThinking } = useGemini();
  const [hasStarted, setHasStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{ property: string, choiceType: string }[]>([]);
  const [report, setReport] = useState<string | null>(null);

  const [activeQuestions, setActiveQuestions] = useState<typeof STATIC_QUESTION_POOL>([]);
  const [isLoadingDataset, setIsLoadingDataset] = useState(false);

  const startTest = async () => {
    setIsLoadingDataset(true);
    let questions = STATIC_QUESTION_POOL;

    try {
      const treeRes = await fetch("https://api.github.com/repos/yq1ngz/before-after-streetscape/git/trees/main?recursive=1");

      if (treeRes.ok) {
        const treeData = await treeRes.json();

        const imagePaths = treeData.tree
          .map((item: any) => item.path)
          .filter((path: string) =>
            path.includes("2_Seperate images without watermarks") &&
            path.match(/\.(jpg|jpeg|png|webp)$/i)
          );

        const pairsMap = new Map<string, any[]>();

        imagePaths.forEach((path: string) => {
          const parts = path.split('/');
          const filename = parts[parts.length - 1];
          const folderPath = parts.slice(0, -1).join('/');

          const numMatch = filename.match(/\d+/) || folderPath.match(/\d+$/);
          if (numMatch) {
            const id = `${folderPath}-${numMatch[0]}`;
            if (!pairsMap.has(id)) pairsMap.set(id, []);

            const encodedPath = path.split('/').map(p => encodeURIComponent(p)).join('/');
            pairsMap.get(id)!.push({
              name: filename,
              url: `https://raw.githubusercontent.com/yq1ngz/before-after-streetscape/main/${encodedPath}`
            });
          }
        });

        const validPairs = Array.from(pairsMap.values())
          .filter(arr => arr.length >= 2)
          .map(arr => {
            arr.sort((a, b) => a.name.localeCompare(b.name));

            let beforeUrl = arr[0].url;
            let afterUrl = arr[1].url;

            const n1 = arr[0].name.toLowerCase();
            const n2 = arr[1].name.toLowerCase();

            if (n1.includes('after') || n1.includes('new') || n2.includes('before') || n2.includes('old') || n2.includes('original')) {
              afterUrl = arr[0].url;
              beforeUrl = arr[1].url;
            } else if (n2.includes('after') || n2.includes('new') || n1.includes('before') || n1.includes('old') || n1.includes('original')) {
              afterUrl = arr[1].url;
              beforeUrl = arr[0].url;
            }

            return { before: beforeUrl, after: afterUrl };
          });

        if (validPairs.length >= 5) {
          const shuffled = validPairs.sort(() => 0.5 - Math.random()).slice(0, 10);

          questions = shuffled.map((pair, index) => {
            const isStrongA = Math.random() > 0.5;
            return {
              id: index + 1,
              property: `Streetscape Transformation ${index + 1}`,
              optionA: {
                id: `A${index + 1}`,
                type: isStrongA ? "strong" : "weak",
                img: isStrongA ? pair.after : pair.before,
                descEn: isStrongA ? "More Living (Felt More Alive)" : "Less Living (Felt Less Alive)",
                descZh: isStrongA ? "更有生命力 (Felt More Alive)" : "较少生命力 (Felt Less Alive)"
              },
              optionB: {
                id: `B${index + 1}`,
                type: !isStrongA ? "strong" : "weak",
                img: !isStrongA ? pair.after : pair.before,
                descEn: !isStrongA ? "More Living (Felt More Alive)" : "Less Living (Felt Less Alive)",
                descZh: !isStrongA ? "更有生命力 (Felt More Alive)" : "较少生命力 (Felt Less Alive)"
              }
            };
          });
        }
      }
    } catch (e) {
      console.warn("Failed to load GitHub dataset via Tree API, using local fallback", e);
    }

    setActiveQuestions(questions);
    setHasStarted(true);
    setCurrentStep(0);
    setAnswers([]);
    setReport(null);
    setIsLoadingDataset(false);
  };

  const handleSelect = async (choiceType: string, property: string) => {
    const newAnswers = [...answers, { property, choiceType }];
    setAnswers(newAnswers);

    if (currentStep < activeQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateReport(newAnswers);
    }
  };

  const generateReport = async (finalAnswers: { property: string, choiceType: string }[]) => {
    const strongCount = finalAnswers.filter(a => a.choiceType === 'strong').length;
    const total = finalAnswers.length;

    const prompt = `
      You are an expert in Christopher Alexander's "The Nature of Order" (specifically Book 1, Chapters 8 & 9) and Bin Jiang's "Living Structure" theory. 
      A user just completed the "Mirror of the Self" test, choosing between Living Structures and Cartesian/mechanistic structures.
      
      Their empirical observations:
      ${finalAnswers.map((a, i) => `- Task ${i + 1} (${a.property}): Identified the "${a.choiceType === 'strong' ? 'Living Structure' : 'Cartesian/Mechanistic Structure'}" as a truer picture of their whole self.`).join('\n')}
      
      Total living structure identified: ${strongCount} out of ${total}.

      Task: Write a profound diagnosis (150-200 words) acting as a phenomenological scientist. 
      Core directives based on Chapter 8 & 9:
      1. Explain that their choices were NOT subjective "preferences", but an objective scientific measurement of the degree of life in the physical world using their own feeling as the instrument (Ch 8).
      2. If they chose 'strong' mostly: Explain how they successfully pierced through the 300-year-old Cartesian mechanistic worldview (Ch 9). They re-established the connection between the "I" and the world's geometry.
      3. If they chose 'weak' mostly: Gently point out how the modern mechanistic, Cartesian conditioning still heavily influences their perception, separating their inner humanity from the physical space.
      
      Tone: Profound, scientific, yet deeply healing and philosophical. Do not mention "Chapter 8", "Chapter 9", or raw scores. Speak directly to their perception of reality.
      
      ==================================================
      ⚠️ CRITICAL OUTPUT LANGUAGE INSTRUCTION ⚠️
      You MUST translate your thoughts and write the final response STRICTLY in: ${isEn ? 'English' : '简体中文 (Simplified Chinese)'}.
      ${isEn ? 'Ensure your entire response is in highly elegant English.' : '【强制警告】你的最终诊断报告必须 100% 使用优美、深邃的中文输出！绝不允许出现任何一段英文！'}
      ==================================================
    `;

    try {
      const aiResponse = await analyzeStructure(prompt);
      if (aiResponse) {
        setReport(aiResponse);
      } else {
        setReport("⚠️ 获取报告失败：AI 返回了空值。请检查网络状态或 Supabase 后端日志。");
      }
    } catch (error) {
      setReport(`⚠️ 发生错误：${error}`);
    }
  };

  const handleShareToX = () => {
    const text = encodeURIComponent(
      isEn
        ? "I just completed the 'Mirror of the Self' observation and shattered the Cartesian mechanistic worldview! 🔬✨ Discover your inner resonance with Living Structure:"
        : "我刚刚完成了『自我之镜』客观活力观测，并打破了笛卡尔机械世界观的束缚！🔬✨ 来测试你的内在几何共振："
    );
    const url = encodeURIComponent("https://livablecitylab.hkust-gz.edu.cn");
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  const resetTest = () => {
    setHasStarted(false);
    setCurrentStep(0);
    setAnswers([]);
    setReport(null);
  };

  const howToData = [
    {
      id: 1,
      icon: Eye,
      title: isEn ? "Observe Wholeness" : "感知整体",
      shortDesc: isEn ? "Use the squint test to blur details." : "用眯眼法则模糊表层细节。",
      fullDesc: isEn
        ? "To see the living structure, you must first ignore the functional labels or decorative styles. Squint your eyes until the image blurs. What remains are the true underlying 'centers' of gravity. Does the blurred structure still feel whole, or does it fall apart into chaotic fragments?"
        : "要看清活力结构，必须先抛弃功能标签或装饰风格。眯起你的眼睛，直到画面变得模糊。剩下的那些较暗或较亮的体块，就是底层真实的‘重心（Centers）’。在模糊状态下，它依然是一个统一的整体，还是碎裂成了混乱的碎片？"
    },
    {
      id: 2,
      icon: Layers,
      title: isEn ? "Map the Hierarchy" : "映射层级",
      shortDesc: isEn ? "Find structures within structures." : "寻找结构中的嵌套结构。",
      fullDesc: isEn
        ? "Look for scaling hierarchies. A living environment is never just one massive scale. It jumps by factors of 2 to 6. Can you point out the macro-skeleton, the meso-boundaries, and the micro-ornaments? If there is a huge jump from the building scale directly to the window scale with nothing in between, the hierarchy is broken."
        : "寻找跨尺度的层级嵌套。充满活力的环境绝不仅有单一的巨大尺度，它总是以 2 到 6 倍的比例跃升。你能指出它的宏观骨架、中观边界和微观细节吗？如果从巨大的建筑体块直接跳崖式地过渡到微小的窗户，中间缺乏过渡，那么它的层级就是断裂的。"
    },
    {
      id: 3,
      icon: ArrowUpRight,
      title: isEn ? "Trace Connections" : "追踪联结",
      shortDesc: isEn ? "Identify how centers support each other." : "识别中心间如何互相支撑。",
      fullDesc: isEn
        ? "No center lives in isolation. Choose any prominent feature in the space. Does its existence strengthen the space next to it? Do the boundaries interlock deeply, or are they cleanly severed? Living structures share DNA across scales, creating echoes that resonate throughout the entire system."
        : "没有哪个中心可以孤立存在。选定空间中任意一个突出的特征，问问自己：它的存在是否强化了它旁边的空间？它们的边界是深度交织的，还是被生硬切断的？活力结构在不同尺度间共享着几何DNA，在整个系统中形成持续的共鸣。"
    }
  ];

  const toggleHowToCard = (id: number) => {
    setActiveHowToIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] text-stone-800 pb-24">

      <div className="w-full max-w-7xl mx-auto p-4 md:p-16 pb-0">

        {/* Section 0: The Empirical Mirror */}
        <div className="mb-32">

          <div className="max-w-4xl mx-auto mb-16 text-center px-4 pt-4 md:pt-8">
            <Quote className="w-8 h-8 md:w-12 md:h-12 text-stone-200 mx-auto mb-6" />
            <p className="text-lg md:text-2xl font-serif text-stone-700 leading-relaxed mb-6 italic">
              "{isEn
                ? "Liking something from the heart means that it makes us more whole in ourselves. It has a healing effect on us. It makes us more human."
                : "发自内心的喜爱，意味着它让我们在内在变得更加完整。它对我们有疗愈的作用，让我们更具人性。"}"
            </p>
            <p className="text-sm md:text-base text-stone-500 font-medium">
              — Christopher Alexander, The Nature of Order
            </p>
          </div>

          <Section title={isEn ? "Empirical Test" : "实证测试"} subTitle={isEn ? "The Mirror of the Self" : "自我之镜：观测与测量"} className="!pt-0 !border-0">
            <div className="w-full bg-white border border-stone-200 text-stone-800 rounded-3xl overflow-hidden shadow-xl relative min-h-[500px] md:min-h-[600px] flex flex-col items-center justify-center p-6 md:p-8">

              <AnimatePresence mode="wait">
                {!hasStarted && !report && (
                  <motion.div
                    key="start"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center max-w-xl"
                  >
                    <Microscope className="w-12 h-12 text-amber-500 mx-auto mb-6 opacity-80" />
                    <h3 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-6">
                      {isEn ? "The Empirical Mirror" : "实证之镜"}
                    </h3>
                    <p className="text-stone-500 text-base md:text-lg mb-4 leading-relaxed font-serif">
                      {isEn
                        ? "This is not a test of preference. It is a scientific observation. We have been taught by the Cartesian worldview that our inner feelings and objective reality are entirely separate."
                        : "这不是一场关于主观喜好的测试，而是一次严谨的科学观测。过去三百年的笛卡尔世界观告诉我们，客观物质与主观感受是彻底割裂的。"}
                    </p>
                    <p className="text-stone-600 text-sm md:text-base mb-10 leading-relaxed font-serif italic border-l-2 border-amber-500/50 pl-4 text-left">
                      {isEn
                        ? "Please quiet your mind. When the images appear, use your inner feeling as a precision instrument. Ask yourself: Which of these two geometries is a truer, more encompassing picture of your whole self?"
                        : "请平静你的大脑。当画面出现时，请将你内心的深刻感受作为一把精密的科学量尺。问问你自己：哪一种几何形态，能更准确、更完整地映照出你作为一个人的全部本质？"}
                    </p>

                    <button
                      onClick={startTest}
                      disabled={isLoadingDataset}
                      className="bg-stone-900 text-white px-8 py-3 rounded-full font-bold tracking-widest uppercase text-sm hover:bg-amber-500 transition-colors flex items-center gap-2 mx-auto shadow-md disabled:opacity-50"
                    >
                      {isLoadingDataset ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> {isEn ? "Fetching Dataset..." : "正在抽取云端图库..."}</>
                      ) : (
                        <>{isEn ? "Begin Observation" : "启动观测实验"} <ArrowRight className="w-4 h-4" /></>
                      )}
                    </button>

                  </motion.div>
                )}

                {hasStarted && !isThinking && !report && activeQuestions.length > 0 && (
                  <motion.div
                    key={`step-${currentStep}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-4xl"
                  >
                    <div className="text-center mb-8">
                      <div className="text-xs uppercase tracking-[0.3em] text-stone-400 mb-2">
                        {isEn ? "Observation" : "观测节点"} {currentStep + 1} / {activeQuestions.length}
                      </div>
                      <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden max-w-md mx-auto border border-stone-200">
                        <div
                          className="bg-amber-500 h-full transition-all duration-500"
                          style={{ width: `${((currentStep) / activeQuestions.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 min-h-[400px] h-auto">
                      <div
                        onClick={() => handleSelect(activeQuestions[currentStep].optionA.type, activeQuestions[currentStep].property)}
                        className="relative rounded-2xl overflow-hidden cursor-pointer group border border-stone-200 hover:border-amber-400 shadow-sm transition-all"
                      >
                        <img src={activeQuestions[currentStep].optionA.img} alt="Option A" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-stone-900/5 group-hover:bg-stone-900/0 transition-colors" />
                        <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-stone-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white text-sm font-medium text-center font-serif">
                            {isEn ? activeQuestions[currentStep].optionA.descEn : activeQuestions[currentStep].optionA.descZh}
                          </p>
                        </div>
                      </div>

                      <div
                        onClick={() => handleSelect(activeQuestions[currentStep].optionB.type, activeQuestions[currentStep].property)}
                        className="relative rounded-2xl overflow-hidden cursor-pointer group border border-stone-200 hover:border-amber-400 shadow-sm transition-all"
                      >
                        <img src={activeQuestions[currentStep].optionB.img} alt="Option B" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-stone-900/5 group-hover:bg-stone-900/0 transition-colors" />
                        <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-stone-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white text-sm font-medium text-center font-serif">
                            {isEn ? activeQuestions[currentStep].optionB.descEn : activeQuestions[currentStep].optionB.descZh}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {isThinking && (
                  <motion.div
                    key="thinking"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center text-center"
                  >
                    <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-6" />
                    <h3 className="text-xl font-serif text-stone-900 mb-2">
                      {isEn ? "Computing Structural Resonance..." : "正在计算几何结构与自我的共振..."}
                    </h3>
                    <p className="text-stone-400 text-sm animate-pulse">
                      {isEn ? "Analyzing objective life degree based on Chapter 8 & 9 paradigms" : "正在依据超越笛卡尔的全新科学范式，生成观测报告..."}
                    </p>
                  </motion.div>
                )}

                {report && !isThinking && (
                  <motion.div
                    key="report"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl w-full bg-stone-50/80 p-6 md:p-12 rounded-2xl border border-stone-200 backdrop-blur-sm shadow-inner"
                  >
                    <div className="text-amber-600 text-xs font-bold uppercase tracking-[0.2em] mb-4 text-center flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      {isEn ? "Scientific Observation Report" : "客观活力观测报告"}
                    </div>

                    <p className="text-stone-700 text-base md:text-lg leading-loose font-serif whitespace-pre-line mb-10 text-justify">
                      {report}
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 border-t border-stone-200 pt-8">
                      <button
                        onClick={resetTest}
                        className="text-stone-500 hover:text-stone-900 flex items-center gap-2 text-sm transition-colors font-bold uppercase tracking-widest"
                      >
                        <RefreshCcw className="w-4 h-4" /> {isEn ? "New Observation" : "开启新观测"}
                      </button>

                      <button
                        onClick={handleShareToX}
                        className="bg-stone-900 text-white hover:bg-amber-600 px-6 py-2 rounded-full flex items-center gap-2 text-sm font-bold transition-all shadow-md"
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-current"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.96H5.078z"></path></g></svg>
                        {isEn ? "Share Results" : "分享观测结果"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Section>
        </div>


        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mt-12 mb-16"
        >
          <div className="border-b border-stone-200 pb-12 mb-12 max-w-2xl mx-auto">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400 mb-6">
              {isEn ? "Theoretical Framework" : "理论框架提取"}
            </div>
            <div className="space-y-3 font-serif text-lg md:text-xl text-stone-600 leading-relaxed">
              <p>{isEn ? "Living Structure originates from structural wholeness." : "活力结构，源于不可分割的整体性。"}</p>
              <p>{isEn ? "Vitality emerges from hierarchical coherence." : "客观的生命美感，涌现于层级的严密嵌套。"}</p>
              <p className="font-black text-stone-900 text-3xl mt-6 tracking-widest">L = S × H</p>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif font-black text-stone-900 mb-4 tracking-tight uppercase">
            {isEn ? (
              <>THEORY OF<br />LIVING STRUCTURE</>
            ) : (
              <>生 命 结 构 理 论</>
            )}
          </h1>
          <p className="text-stone-500 font-mono uppercase tracking-widest text-xs">
            {isEn ? "Vitality in Geometry & Architecture" : "几何与建筑中的活力密码"}
          </p>
        </motion.div>

        {/* 💡 全新理论模块：有机的空间观 */}
        <OrganicViewSection isEn={isEn} />

        {/* Section 1: Origin */}
        <Section title={trans.theory?.origin?.title || "Origin"}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div className="space-y-6">
              <p className="text-stone-800 text-lg leading-relaxed font-serif">{trans.theory?.origin?.content1}</p>
              <p className="text-stone-600 text-sm leading-relaxed">{trans.theory?.origin?.content2}</p>
            </div>
            <div className="bg-stone-100 p-8 rounded-sm">
              <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">{trans.theory?.origin?.formulaTitle || "Core Formula"}</h4>
              <div className="text-4xl font-serif font-bold text-stone-900 mb-4">L = S × H</div>
              <div className="space-y-2 text-sm text-stone-600 font-mono">
                <div className="flex justify-between border-b border-stone-200 pb-1"><span>L</span> <span>{trans.theory?.origin?.formulaL || "Livingness"}</span></div>
                <div className="flex justify-between border-b border-stone-200 pb-1"><span>S</span> <span>{trans.theory?.origin?.formulaS || "Substructures"}</span></div>
                <div className="flex justify-between"><span>H</span> <span>{trans.theory?.origin?.formulaH || "Hierarchy"}</span></div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 border-t border-stone-100 pt-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-stone-200 rounded-full overflow-hidden grayscale">
                <ImageWithFallback src="/images/A.png" alt="C. Alexander" className="w-full h-full object-cover" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-stone-900">Christopher Alexander</div>
                <div className="text-stone-400">The Nature of Order</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-stone-200 rounded-full overflow-hidden grayscale">
                <ImageWithFallback src="/images/BJ.png" alt="Bin Jiang" className="w-full h-full object-cover" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-stone-900">Bin Jiang</div>
                <div className="text-stone-400">Structural Beauty</div>
              </div>
            </div>
          </div>
        </Section>

        {/* Section 2: Aesthetic Context */}
        <Section title={trans.theory?.aesthetic?.title || "Aesthetic Context"}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-8 bg-white border border-stone-200 shadow-sm">
              <p className="text-stone-600 leading-relaxed mb-4">{trans.theory?.aesthetic?.p1}</p>
              <div className="h-1 w-12 bg-stone-200" />
            </div>
            <div className="p-8 bg-stone-50 border border-stone-200">
              <p className="text-stone-800 font-medium leading-relaxed mb-4">{trans.theory?.aesthetic?.p2}</p>
              <div className="h-1 w-12 bg-amber-200" />
            </div>
          </div>
        </Section>

        {/* Section 3: How to See */}
        <Section
          title={trans.theory?.howToSee?.title || "How to Perceive Structure"}
          subTitle={isEn
            ? "Click on any card to reveal the three fundamental steps for observing living structure in the built environment."
            : "点击展开下方卡片，掌握感知建筑与空间活力的三个核心步骤。"}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            {howToData.map((item) => {
              const isActive = activeHowToIds.includes(item.id);
              return (
                <motion.div
                  layout
                  key={item.id}
                  onClick={() => toggleHowToCard(item.id)}
                  className={cn(
                    "border border-stone-200 rounded-2xl cursor-pointer transition-colors overflow-hidden",
                    isActive ? "bg-stone-900 text-white shadow-xl" : "bg-white text-stone-900 hover:bg-stone-50"
                  )}
                >
                  <motion.div layout className="p-4 md:p-8 flex flex-col items-center text-center">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors",
                      isActive ? "bg-stone-800 text-teal-400" : "bg-stone-100 text-stone-600"
                    )}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-serif font-bold text-lg mb-2">{item.title}</h4>
                    <p className={cn("text-xs transition-colors", isActive ? "text-stone-300" : "text-stone-500")}>
                      {item.shortDesc}
                    </p>
                  </motion.div>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 md:px-8 pb-6 md:pb-8 text-left"
                      >
                        <div className="w-full h-px bg-stone-700 mb-6"></div>
                        <p className="text-sm leading-relaxed text-stone-300">
                          {item.fullDesc}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </Section>

        {/* Section 4: 15 Properties */}
        <Section title="15 Properties" subTitle={trans.theory?.propertiesSubtitle || "Fundamental patterns of living structure"}>

          <div className="flex flex-col lg:flex-row gap-12 mt-8">
            <div className="w-full lg:w-1/4 flex flex-col gap-2">
              {properties.map((prop) => (
                <button
                  key={prop.n}
                  onClick={() => setActivePropId(prop.n)}
                  className={`text-left px-4 py-3 rounded-md transition-all duration-200 ${activePropId === prop.n
                      ? 'bg-amber-100 text-amber-900 font-bold border-l-4 border-amber-500 shadow-sm'
                      : 'bg-transparent text-stone-600 hover:bg-stone-100'
                    }`}
                >
                  <span className="text-xs text-stone-400 mr-2 font-mono">{String(prop.n).padStart(2, '0')}</span>
                  {language === 'zh' ? prop.tZh : prop.tEn}
                </button>
              ))}
            </div>

            <div className="w-full lg:w-3/4 flex flex-col gap-8">

              <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeProp.n}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 md:p-12 flex-grow flex flex-col"
                  >
                    <h3 className="text-4xl font-serif font-bold text-stone-900 mb-6 flex items-baseline gap-4">
                      <span className="text-amber-500 text-2xl font-mono">{String(activeProp.n).padStart(2, '0')}</span>
                      {language === 'zh' ? activeProp.tZh : activeProp.tEn}
                    </h3>

                    <p className="text-lg text-stone-700 leading-relaxed mb-6 border-l-4 border-stone-300 pl-6 italic">
                      "{language === 'zh' ? activeProp.quoteZh : activeProp.quoteEn}"
                    </p>

                    <div className="flex items-center gap-2 mb-10">
                      <span className="px-3 py-1 bg-stone-100 text-stone-600 text-xs font-mono rounded-sm border border-stone-200">
                        {language === 'zh' ? activeProp.mechZh : activeProp.mechEn}
                      </span>
                      <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-mono rounded-sm border border-amber-200 flex items-center gap-1">
                        <Info className="w-3 h-3" /> {language === 'zh' ? activeProp.relZh : activeProp.relEn}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div className="bg-emerald-50/50 p-6 rounded-lg border border-emerald-100 hover:shadow-sm transition-shadow">
                        <h4 className="flex items-center gap-2 text-emerald-800 font-bold mb-4 uppercase tracking-wider text-sm">
                          <Leaf className="w-4 h-4" />
                          {language === 'zh' ? '在自然界中的体现' : 'Manifestation in Nature'}
                        </h4>
                        <p className="text-stone-600 text-sm leading-relaxed">
                          {language === 'zh' ? activeProp.natureZh : activeProp.natureEn}
                        </p>
                      </div>

                      <div className="bg-stone-50 p-6 rounded-lg border border-stone-200 hover:shadow-sm transition-shadow">
                        <h4 className="flex items-center gap-2 text-stone-800 font-bold mb-4 uppercase tracking-wider text-sm">
                          <Building2 className="w-4 h-4" />
                          {language === 'zh' ? '在空间设计中的体现' : 'Manifestation in Design'}
                        </h4>
                        <p className="text-stone-600 text-sm leading-relaxed">
                          {language === 'zh' ? activeProp.exampleZh : activeProp.exampleEn}
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-stone-100">
                      <p className="text-xs text-stone-400 uppercase tracking-widest mb-4 font-bold flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        {language === 'zh' ? '《秩序的本质》原著图解' : 'Illustration from The Nature of Order'}
                      </p>

                      <div className="w-full flex justify-center items-center py-2">
                        {activeProp.bookImg ? (
                          <img
                            src={activeProp.bookImg}
                            alt="Book Illustration"
                            className="max-h-[250px] md:max-h-[320px] w-auto max-w-full object-contain mix-blend-multiply opacity-85 group-hover:opacity-100 transition-opacity"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect fill='%23f5f5f4' width='100%25' height='100%25'/%3E%3Ctext fill='%23a8a29e' x='50%25' y='50%25' font-family='sans-serif' font-size='14' text-anchor='middle'%3EWaiting for book image scan...%3C/text%3E%3C/svg%3E"
                            }}
                          />
                        ) : (
                          <div className="text-stone-400 text-sm font-mono flex items-center gap-2">
                            <ScanLine className="w-4 h-4" /> Image scan pending...
                          </div>
                        )}
                      </div>
                    </div>

                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden p-8 md:p-12">
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 mb-6 flex items-center gap-2">
                  <ScanLine className="w-4 h-4" /> {language === 'zh' ? '互动分析对比' : 'Interactive Analysis'}
                </h4>
                <PropertyVisuals
                  key={activeProp.n}
                  imgPos={activeProp.imgPos}
                  imgNeg={activeProp.imgNeg}
                  title={language === 'zh' ? activeProp.tZh : activeProp.tEn}
                />
              </div>

            </div>
          </div>
        </Section>



      </div>
    </div>
  );
}