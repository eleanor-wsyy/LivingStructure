import React, { useState } from "react";
import { Card, cn } from "@/app/components/ui";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/app/i18n/LanguageContext";
import { 
  Sparkles, Layers, Copy, Check, ChevronRight, Info, 
  ArrowRight, ArrowLeft, Box, Eye, ArrowUpRight, Building2,
  Leaf, BookOpen, ScanLine
} from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { properties as propertiesData } from "@/app/data/properties";
import { CaseStudy, CATEGORIES, cases } from "@/app/data/cases";
import { Section, Badge } from "@/app/components/ui";

// --- Sub-components ---

const CampusProjectsSection = ({ isEn }: { isEn: boolean }) => {
  const classrooms = [
    {
      id: "W1-233",
      link: "https://vr.justeasy.cn/view/174v3j47i0470778-1734793858.html",
      img: "/images/W1-233.png"
    },
    {
      id: "5A-220",
      link: "https://vr.justeasy.cn/view/147e374o54n19057-1753083138.html",
      img: "/images/5A-220.png"
    },
    {
      id: "E3-312",
      link: "https://vr.justeasy.cn/view/zn61187413306813-1756382846.html",
      img: "/images/E3-312.png"
    },
    {
      id: "E3-314",
      link: "https://vr.justeasy.cn/view/uk17d141l920b639-1758796620.html",
      img: "/images/E3-314.png"
    }
  ];

  return (
    <Section
      title={isEn ? "Campus Lab" : "校园实践"}
      subTitle={isEn ? "Translating theory into physical space through generative AI." : "将抽象理论通过人工智能，转化为物理空间的真实疗愈体验。"}
      className="!pt-0 !border-t-0"
    >
      <div className="mb-16 mt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-6">
          <div className="max-w-2xl">
            <h4 className="text-2xl font-serif font-bold text-stone-900 mb-3">
              {isEn ? "01. The Healing Clinic" : "01. 理疗所改造项目"}
            </h4>
            <p className="text-stone-600 text-sm leading-relaxed">
              {isEn
                ? "A campus clinic designed to foster 'Inner Calm'. We used AI to generate artistic human muscle structures that resonate with the geometric properties of life, deeply integrating them into the environment."
                : "一个旨在培养“内在平静”的校园理疗所。我们利用 AI 生成了与生命几何属性共鸣的人体肌肉艺术画，并将其深度融入物理环境，增强空间的治愈氛围。"}
            </p>
          </div>
        </div>

        <a
          href="https://vr.justeasy.cn/view/17xx174rk9649594-1775484431.html"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full aspect-[4/3] md:aspect-[21/9] bg-stone-900 rounded-3xl overflow-hidden border border-stone-200 shadow-md hover:shadow-xl transition-all duration-500 relative group cursor-pointer"
        >
          <ImageWithFallback
            src="/images/clinic.png"
            alt="Physiotherapy Clinic VR Cover"
            className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.3)] group-hover:scale-110 group-hover:bg-teal-500 transition-all duration-300">
              <ArrowUpRight className="w-6 h-6 md:w-8 md:h-8 text-stone-900 group-hover:text-white transition-colors" />
            </div>
          </div>
          <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
            <Badge variant="outline" className="border-white/40 text-white mb-3 backdrop-blur-md bg-black/20 uppercase tracking-widest text-[10px]">
              <Eye className="w-3 h-3 mr-1.5 inline" /> {isEn ? "360° VR Tour" : "360° 沉浸式全景"}
            </Badge>
            <h5 className="text-xl md:text-3xl font-serif font-bold text-white shadow-sm drop-shadow-md">
              {isEn ? "Enter the Healing Clinic" : "进入理疗所漫游"}
            </h5>
          </div>
        </a>
      </div>

      <div className="mb-12 mt-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div className="max-w-2xl">
            <h4 className="text-2xl font-serif font-bold text-stone-900 mb-3 flex items-center gap-3">
              {isEn ? "02. Classroom Renovations" : "02. 传统课室系列改造"}
            </h4>
            <p className="text-stone-600 text-sm leading-relaxed">
              {isEn
                ? "Breaking the rigid Cartesian grid across multiple learning spaces. We apply the 15 properties to create 'Strong Centers' and 'Positive Space', turning monotonous rooms into organic learning organisms in HKUST（GZ）."
                : "打破传统排排坐的死板笛卡尔网格。我们在香港科技大学（广州）多间课室中应用 15 个基础属性，重新建立“强中心”和“正空间”，将单调的空间转化为有机的学习生命体。点击对应课室进入实景漫游："}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {classrooms.map((room) => (
            <a
              key={room.id}
              href={room.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full aspect-[4/3] md:aspect-[16/9] bg-stone-100 rounded-3xl overflow-hidden border border-stone-200 shadow-md relative group cursor-pointer"
            >
              <ImageWithFallback
                src={room.img}
                alt={`Classroom ${room.id}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <ArrowUpRight className="w-5 h-5 text-stone-900" />
              </div>
              <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 text-white pointer-events-none">
                <Badge variant="outline" className="border-white/40 text-white mb-2 backdrop-blur-md bg-black/20 uppercase tracking-widest text-[9px]">
                  <Box className="w-3 h-3 mr-1.5 inline" /> {isEn ? "Spatial Transformation" : "空间重构"}
                </Badge>
                <h5 className="text-xl md:text-2xl font-serif font-bold text-white shadow-sm drop-shadow-md">
                  {isEn ? `Room ${room.id}` : `课室 ${room.id}`}
                </h5>
              </div>
            </a>
          ))}
        </div>
      </div>
    </Section>
  );
};

const ChineseArchitecturalSystem = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [highlightCenters, setHighlightCenters] = useState(false);
  const { trans, language } = useLanguage();

  const selectedCase = cases.find(c => c.id === selectedCaseId);

  if (!selectedCase) {
    const filteredCases = activeCategory === "all" ? cases : cases.filter(c => c.category === activeCategory);

    return (
      <div>
        <div className="flex flex-wrap gap-2 mb-8 justify-center md:justify-start">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors",
                activeCategory === cat.id
                  ? "bg-stone-900 text-white"
                  : "bg-white text-stone-500 border border-stone-200 hover:border-stone-400"
              )}
            >
              {language === 'zh' ? cat.zh : cat.en}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCases.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedCaseId(c.id)}
              className="group cursor-pointer bg-white border border-stone-200 hover:border-stone-400 transition-all duration-300 rounded-3xl overflow-hidden shadow-sm"
            >
              <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                <ImageWithFallback
                  src={c.imageUrl}
                  alt={c.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 transition-colors" />
              </div>
              <div className="p-8">
                <div className="mb-4">
                  <h3 className="font-serif font-bold text-xl text-stone-900 group-hover:text-stone-700 transition-colors mb-2">
                    {language === 'zh' ? c.nameZh : c.name}
                  </h3>
                  <div className="flex justify-between items-center border-t border-stone-100 pt-4">
                    <button className="text-[10px] uppercase tracking-widest font-bold text-stone-900 flex items-center gap-2 group-hover:text-teal-700 transition-colors">
                      {trans.theory?.chinese?.viewAnalysis || 'View Analysis'} <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-stone-200 rounded-3xl shadow-sm overflow-hidden">
      <div className="border-b border-stone-100 p-6 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-stone-50/50">
        <div className="flex items-start gap-4">
          <button
            onClick={() => setSelectedCaseId(null)}
            className="mt-1 p-2 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-stone-600" />
          </button>
          <div>
            <h2 className="text-3xl font-serif font-bold text-stone-900">{language === 'zh' ? selectedCase.nameZh : selectedCase.name}</h2>
            <p className="text-stone-500 font-mono text-sm">{language === 'zh' ? selectedCase.dynastyZh : selectedCase.dynasty}</p>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
        <div className="lg:col-span-4 space-y-10">
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 mb-4 border-b border-stone-100 pb-2 inline-block">
              {trans.theory?.chinese?.analysisTitle || 'Analysis'}
            </h4>
            <p className="text-stone-700 leading-relaxed text-sm">
              {language === 'zh' ? selectedCase.descriptionZh : selectedCase.description}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-stone-400 uppercase tracking-wider text-[10px] mb-4">
              <Layers className="w-3 h-3" /> {trans.theory?.chinese?.layerExplainer || 'Structural Layers'}
            </div>
            <div className="space-y-3">
              {selectedCase.levels.map((level, i) => (
                <div key={i} className="flex items-center gap-3 text-xs">
                  <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center font-mono text-[10px]">{i + 1}</span>
                  <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500" style={{ width: `${(level / Math.max(...selectedCase.levels)) * 100}%` }} />
                  </div>
                  <span className="font-mono text-stone-500 w-14 text-right">{level.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-stone-400 uppercase tracking-wider text-[10px] mb-4">
              <Check className="w-3 h-3" /> Related Properties
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedCase.relatedProperties.map((pIndex) => {
                const p = propertiesData.find(prop => prop.n === pIndex);
                return p ? (
                  <div key={p.n} className="px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-[10px] font-serif border border-stone-200">
                    {language === 'zh' ? p.tZh : p.tEn}
                  </div>
                ) : null;
              })}
            </div>
          </div>

          <div className="pt-8 border-t border-stone-100">
            <label className="flex items-center justify-between cursor-pointer group bg-stone-50 p-5 rounded-2xl border border-stone-200 hover:border-teal-400 transition-all">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-stone-900 group-hover:text-teal-600 transition-colors">
                  {trans.theory?.chinese?.toggleCenters || 'Highlight Living Centers'}
                </span>
                <span className="text-[10px] text-stone-500 mt-1">Reveal architectural focal points</span>
              </div>
              <button
                onClick={() => setHighlightCenters(!highlightCenters)}
                className={cn(
                  "w-12 h-6 rounded-full relative transition-colors duration-300 shadow-inner",
                  highlightCenters ? "bg-teal-500" : "bg-stone-300"
                )}
              >
                <div className={cn(
                  "w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-300 shadow-sm",
                  highlightCenters ? "left-7" : "left-1"
                )} />
              </button>
            </label>
          </div>
        </div>

        <div className="lg:col-span-8 grid grid-cols-1 gap-6">
          <div className="bg-stone-950 p-2 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-stone-900 flex items-center justify-center">
              <ImageWithFallback
                src={selectedCase.diagramUrl}
                alt="Structural Diagram"
                className={cn(
                  "w-full h-full object-contain transition-all duration-700",
                  highlightCenters ? "opacity-40 scale-100 blur-[2px]" : "opacity-100 scale-100"
                )}
              />

              <AnimatePresence>
                {highlightCenters && selectedCase.centers && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 pointer-events-none z-10"
                  >
                    {selectedCase.centers.map((center, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: idx * 0.1, type: "spring" }}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                        style={{ left: `${center.x}%`, top: `${center.y}%`, width: center.r, height: center.r }}
                      >
                        <div className="absolute w-3 h-3 bg-teal-400 rounded-full shadow-[0_0_20px_rgba(45,212,191,1)] z-20" />
                        <div className="absolute w-full h-full border-2 border-teal-400/60 rounded-full animate-[spin_10s_linear_infinite] border-dashed" />
                        <div className="absolute w-[140%] h-[140%] border border-teal-300/30 rounded-full animate-ping" />
                        <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 bg-stone-900/95 backdrop-blur border border-teal-500/40 text-teal-50 text-[9px] px-3 py-1.5 rounded-lg shadow-2xl uppercase tracking-widest whitespace-nowrap">
                          {center.label}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main View ---

export function Construct() {
  const { trans, language } = useLanguage();
  const isEn = language === 'en';

  const [hierarchy, setHierarchy] = useState(1);

  // ============================================================================
  // 📐 Mathematical Model:
  // Ln = (S1 + S2 + ... + Sn) * Hn
  // ============================================================================
  const S_SEQUENCE = [3, 6, 13, 52, 112, 402, 2473];
  const H = hierarchy;
  const sumS = S_SEQUENCE.slice(0, H).reduce((acc, curr) => acc + curr, 0);
  const L = sumS * H; 

  // --- Hierarchical Prompt Lab State ---
  const [skeleton, setSkeleton] = useState(isEn ? "A centralized courtyard with octagonal symmetry" : "具有八角对称性的中心庭院");
  const [properties, setProperties] = useState(isEn ? "Positive space, deep interlock, local symmetries" : "正空间，深度交织，局部对称");
  const [detail, setDetail] = useState(isEn ? "Fractal wood joinery, recursive floral patterns" : "分形木构件，递归花卉图案");
  const [useScaling, setUseScaling] = useState(true);
  const [copied, setCopied] = useState(false);

  const generateFullPrompt = () => {
    const p = trans.construct.promptLab;
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

  const handleCopy = () => {
    navigator.clipboard.writeText(generateFullPrompt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const formattedL = L.toLocaleString('en-US');
  const formattedSumS = sumS.toLocaleString('en-US');
  const sumString = S_SEQUENCE.slice(0, H).map(n => n.toLocaleString('en-US')).join(" + ");

  const STAGE_IMAGES = [
    "/stages/stage1.png",
    "/stages/stage2.png",
    "/stages/stage3.png",
    "/stages/stage4.png",
    "/stages/stage5.png",
    "/stages/stage6.png",
    "/stages/stage7.png",
  ];

  return (
    <div className="min-h-screen bg-[#fafaf9] py-8 md:py-12 px-4 font-sans">
      <div className="mx-auto max-w-7xl space-y-16 md:space-y-32 w-full">
        
        <div className="space-y-8 md:space-y-12">
          <div>
            <h1 className="text-3xl md:text-5xl font-serif font-black text-stone-900 uppercase tracking-tight">
              {isEn ? "Constructing Life" : "活力结构构建"}
            </h1>
            <p className="mt-4 text-stone-500 font-mono uppercase tracking-widest text-xs">
              {isEn ? "From Mathematical Models to Physical Reality" : "从数学模型到物理现实的演化"}
            </p>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-3xl border border-stone-200 shadow-sm">
             <div className="max-w-3xl mb-12">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 mb-4">
                  {isEn ? "01. Evolutionary Growth" : "01. 结构演化增长"}
                </h2>
                <p className="text-sm md:text-base text-stone-600 leading-relaxed">
                  {isEn 
                    ? "Observe the discrete evolution of a classical structure. The livingness (L) is calculated by multiplying the cumulative number of substructures (ΣS) with the hierarchy depth (H)." 
                    : "观察建筑结构的离散演化过程。随着层级 (H) 的加深，所有层级的子结构数量不断累加构成总数 (ΣS)，两者共同决定了整体的活力 (L)。"}
                </p>
             </div>

             <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 md:gap-12 items-start w-full">
                <div className="order-2 lg:order-1 lg:col-span-8 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 w-full">
                  <div className="hidden lg:block w-full">
                    <Card className="bg-white p-6 h-[700px] flex flex-col relative border-stone-200 shadow-sm opacity-50 grayscale">
                      <div className="absolute top-6 left-6 text-[10px] font-bold tracking-widest text-stone-400 uppercase z-10">
                        {isEn ? "Initial State" : "初始状态"} (H: 1, ΣS: 3)
                      </div>
                      <div className="flex-1 flex items-center justify-center w-full h-full p-4 relative">
                        <img 
                          src={STAGE_IMAGES[0]} 
                          alt="Stage 1" 
                          className="object-contain w-full h-full max-h-[500px]"
                        />
                      </div>
                      <div className="text-center text-xs font-mono text-stone-400 tracking-widest pb-4">
                        PRIMITIVE MASS
                      </div>
                    </Card>
                  </div>

                  <Card className="bg-white p-0 h-[420px] lg:h-[700px] flex flex-col relative border-teal-200 shadow-2xl ring-1 ring-teal-50 overflow-hidden w-full">
                    <div className="absolute top-4 left-4 md:top-6 md:left-6 text-[10px] font-bold tracking-widest text-teal-700 uppercase flex items-center gap-2 z-10">
                      <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                      {isEn ? "Living Structure" : "活力结构"}
                    </div>
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#f5f5f4_2px,transparent_2px),linear-gradient(to_bottom,#f5f5f4_2px,transparent_2px)] bg-[size:4rem_4rem] opacity-60" />
                    <div className="flex-1 flex items-center justify-center z-10 w-full h-full p-6 md:p-12 relative">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={hierarchy}
                          src={STAGE_IMAGES[hierarchy - 1]}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                          className="object-contain w-full h-full max-h-[500px] drop-shadow-sm"
                          alt={`Evolution Stage ${hierarchy}`}
                        />
                      </AnimatePresence>
                    </div>
                    <div className="text-center text-[10px] md:text-xs font-mono text-teal-700/50 tracking-widest z-10 font-bold pb-4 md:pb-6">
                      STAGE {hierarchy} EVOLUTION
                    </div>
                  </Card>
                </div>

                <div className="order-1 lg:order-2 lg:col-span-4 space-y-4 md:space-y-6 w-full lg:sticky lg:top-8">
                  <Card className="bg-stone-100 border-none p-5 md:p-8 text-center relative overflow-hidden shadow-inner">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-teal-600" />
                    <div className="text-[10px] md:text-xs font-bold text-stone-400 uppercase tracking-widest mb-3 md:mb-6">
                      {isEn ? "Livingness Formula" : "活力计算公式"}
                    </div>
                    <div className="flex flex-col items-center justify-center space-y-2 md:space-y-4">
                      <div className="text-xl md:text-2xl font-mono font-bold text-stone-400 tracking-widest">
                        L = ΣS × H
                      </div>
                      <div className="flex flex-wrap items-baseline justify-center gap-x-2 md:gap-x-4 text-xl sm:text-2xl md:text-4xl font-mono text-stone-700">
                        <motion.span 
                          key={`L-${L}`}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-[2.5rem] leading-none sm:text-6xl md:text-7xl font-black text-teal-600 tracking-tighter drop-shadow-sm"
                        >
                          {formattedL}
                        </motion.span>
                        <span className="text-stone-300 font-normal">=</span>
                        <motion.span key={`S-${sumS}`} initial={{ y: -10 }} animate={{ y: 0 }} className="font-bold">
                          {formattedSumS}
                        </motion.span>
                        <span className="text-stone-300 font-normal">×</span>
                        <motion.span key={`H-${H}`} initial={{ y: -10 }} animate={{ y: 0 }} className="font-bold">
                          {H}
                        </motion.span>
                      </div>
                      <div className="h-auto min-h-[1.5rem] mt-1 flex items-center justify-center px-2">
                        <AnimatePresence mode="wait">
                          {H > 1 && (
                            <motion.div 
                              key={`sum-${H}`}
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-[10px] md:text-xs text-stone-400 font-mono leading-relaxed text-center"
                            >
                              ΣS = {sumString}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-white p-4 md:p-6 space-y-6 shadow-sm border-stone-200">
                    <div className="space-y-4 group">
                      <div className="flex justify-between items-end mb-2">
                        <label className="text-sm md:text-base font-bold text-stone-800 tracking-wide transition-colors group-hover:text-teal-700">
                          {isEn ? "Evolution Stage (H)" : "演化层级 (H)"}
                        </label>
                        <span className="font-mono text-xl md:text-2xl font-black text-teal-600">{hierarchy}</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" max="7" step="1"
                        value={hierarchy}
                        onChange={(e) => setHierarchy(Number(e.target.value))}
                        className="w-full h-1.5 md:h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all shadow-inner"
                      />
                    </div>
                  </Card>

                  <Card className="bg-gradient-to-br from-teal-50 to-white p-5 md:p-6 space-y-5 border-teal-100 shadow-lg relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-1">
                      <Layers className="w-5 h-5 text-teal-600" />
                      <h3 className="font-serif font-bold text-lg text-stone-900">{trans.construct.promptLab.title}</h3>
                    </div>
                    <div className="space-y-4 pt-2">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1.5">
                          <span className="w-4 h-0.5 bg-stone-900 rounded-full" /> {trans.construct.promptLab.layer1}
                        </label>
                        <input value={skeleton} onChange={(e) => setSkeleton(e.target.value)} className="w-full px-3 py-2 bg-white/50 border border-stone-200 rounded-lg text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1.5">
                          <span className="w-4 h-0.5 bg-stone-500 rounded-full" /> {trans.construct.promptLab.layer2}
                        </label>
                        <input value={properties} onChange={(e) => setProperties(e.target.value)} className="w-full px-3 py-2 bg-white/50 border border-stone-200 rounded-lg text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1.5">
                          <span className="w-4 h-0.5 bg-stone-300 rounded-full" /> {trans.construct.promptLab.layer3}
                        </label>
                        <input value={detail} onChange={(e) => setDetail(e.target.value)} className="w-full px-3 py-2 bg-white/50 border border-stone-200 rounded-lg text-sm" />
                      </div>
                      <button onClick={handleCopy} className="w-full py-3 bg-teal-600 text-white rounded-xl font-bold text-xs">
                        {copied ? (isEn ? "Copied!" : "已复制！") : trans.construct.promptLab.copy}
                      </button>
                    </div>
                  </Card>
                </div>
             </div>
          </div>
        </div>

        <CampusProjectsSection isEn={isEn} />

        <div className="pt-8">
          <Section 
            title={trans.theory?.chinese?.title || "Chinese Architecture"} 
            subTitle={isEn ? "Empirical Analysis" : "实证案例分析"}
            className="!border-t-0 !pt-0"
          >
            <div className="mb-12 max-w-3xl">
              <p className="text-lg text-stone-600 leading-relaxed font-serif">
                {trans.theory?.chinese?.intro || "Exploring traditional structures through the lens of living structure..."}
              </p>
            </div>
            <ChineseArchitecturalSystem />
          </Section>
        </div>

      </div>
    </div>
  );
}