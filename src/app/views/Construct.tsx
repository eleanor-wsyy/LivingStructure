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
import { studioExamples } from "@/app/data/studioExamples";
import { Section, Badge } from "@/app/components/ui";

// --- Living Structure Studio: Before/After Gallery (from Whole book.pdf, Chapter 4) ---

const HighLowGallery = ({ isEn }: { isEn: boolean }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [showVas, setShowVas] = useState(false);
  const ex = studioExamples[activeIdx];

  const ScoreBar = ({ label, value, max, color }: { label: string; value: number; max: number; color: string }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
        <span className="text-muted-foreground">{label}</span>
        <span className={color}>{value}{max <= 15 ? `/${max}` : ''}</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color === 'text-teal-600' ? 'bg-teal-500' : 'bg-red-400'}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min((value / max) * 100, 100)}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );

  const VasOverlay = ({ foci }: { foci: { x: number; y: number; r: number }[] }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-10 pointer-events-none"
    >
      <div className="absolute inset-0 bg-stone-900/40" />
      {foci.map((f, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.15, type: 'spring', stiffness: 60 }}
          className="absolute rounded-full"
          style={{
            left: `${f.x}%`, top: `${f.y}%`,
            width: f.r, height: f.r,
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(245,158,11,0.7) 0%, rgba(245,158,11,0.2) 50%, transparent 70%)',
            boxShadow: '0 0 30px rgba(245,158,11,0.5)',
          }}
        />
      ))}
    </motion.div>
  );

  return (
    <Section
      title={isEn ? 'Living Structure Studio' : '活力结构工作室'}
      subTitle={isEn ? '5 Before/After case studies with L-score, B-score, and VAS scanning from Chapter 4.' : '来自第四章的 5 组建筑改造 Before/After 案例：L-score、B-score 与 VAS 扫描量化对比。'}
      className="!pt-0 !border-t-0"
    >
      {/* Tab Selector */}
      <div className="flex flex-wrap gap-2 mb-10 justify-center">
        {studioExamples.map((s, i) => (
          <button
            key={s.id}
            onClick={() => { setActiveIdx(i); setShowVas(false); }}
            className={cn(
              'px-4 py-2 rounded-full text-xs font-bold transition-all',
              activeIdx === i
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-card text-muted-foreground border border-border hover:border-stone-400'
            )}
          >
            {isEn ? s.nameEn : s.nameZh}
          </button>
        ))}
      </div>

      {/* Active case title */}
      <div className="text-center mb-8">
        <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground">{isEn ? ex.nameEn : ex.nameZh}</h3>
        <p className="text-sm text-muted-foreground mt-1 font-mono">{ex.location} · {ex.pageRef}</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={ex.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
        >
          {/* Before / After Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* BEFORE */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-red-600">Before</span>
              </div>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-secondary border border-border shadow-lg">
                <ImageWithFallback src={ex.beforeImg} alt="Before" className="w-full h-full object-cover" />
                <AnimatePresence>{showVas && <VasOverlay foci={ex.beforeVasFoci} />}</AnimatePresence>
              </div>
              <div className="bg-card rounded-2xl p-5 border border-border shadow-sm space-y-3">
                <ScoreBar label="L-Score (Livingness)" value={ex.beforeL} max={70} color="text-red-500" />
                <ScoreBar label="B-Score (Beauty)" value={ex.beforeB} max={15} color="text-red-500" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isEn ? ex.beforeDescEn : ex.beforeDescZh}
                </p>
              </div>
            </div>

            {/* AFTER */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full bg-teal-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-teal-700">After</span>
              </div>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-secondary border border-border shadow-lg">
                <ImageWithFallback src={ex.afterImg} alt="After" className="w-full h-full object-cover" />
                <AnimatePresence>{showVas && <VasOverlay foci={ex.afterVasFoci} />}</AnimatePresence>
              </div>
              <div className="bg-card rounded-2xl p-5 border border-border shadow-sm space-y-3">
                <ScoreBar label="L-Score (Livingness)" value={ex.afterL} max={70} color="text-teal-600" />
                <ScoreBar label="B-Score (Beauty)" value={ex.afterB} max={15} color="text-teal-600" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isEn ? ex.afterDescEn : ex.afterDescZh}
                </p>
              </div>
            </div>
          </div>

          {/* VAS Toggle + Source */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted rounded-2xl p-5 border border-border">
            <label className="flex items-center gap-3 cursor-pointer group">
              <button
                onClick={() => setShowVas(!showVas)}
                className={cn(
                  'w-12 h-6 rounded-full relative transition-colors duration-300 shadow-inner',
                  showVas ? 'bg-amber-500' : 'bg-stone-300'
                )}
              >
                <div className={cn(
                  'w-4 h-4 bg-card rounded-full absolute top-1 transition-transform duration-300 shadow-sm',
                  showVas ? 'left-7' : 'left-1'
                )} />
              </button>
              <div>
                <span className="text-sm font-bold text-stone-800 group-hover:text-amber-600 transition-colors">
                  {isEn ? '3M VAS Scanning Simulation' : '3M VAS 视觉注意力扫描模拟'}
                </span>
                <p className="text-[10px] text-muted-foreground">
                  {isEn ? 'Visualize where the eye naturally focuses' : '可视化人眼自然聚焦的位置'}
                </p>
              </div>
            </label>
            <div className="text-[10px] text-muted-foreground italic text-right">
              📖 Jiang, B. — Chapter 4: Architectural Transformation · {ex.pageRef}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </Section>
  );
};

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
      title={isEn ? "Living Lab" : "校园实践"}
      subTitle={isEn ? "Translating theory into physical space through generative AI." : "将抽象理论通过人工智能，转化为物理空间的真实疗愈体验。"}
      className="!pt-0 !border-t-0"
    >
      <div className="mb-16 mt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-6">
          <div className="max-w-2xl">
            <h4 className="text-2xl font-serif font-bold text-foreground mb-3">
              {isEn ? "01. The Healing Clinic" : "01. 理疗所改造项目"}
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
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
          className="block w-full aspect-[4/3] md:aspect-[21/9] bg-stone-900 rounded-3xl overflow-hidden border border-border shadow-md hover:shadow-xl transition-all duration-500 relative group cursor-pointer"
        >
          <ImageWithFallback
            src="/images/clinic.png"
            alt="Physiotherapy Clinic VR Cover"
            className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.3)] group-hover:scale-110 group-hover:bg-teal-500 transition-all duration-300">
              <ArrowUpRight className="w-6 h-6 md:w-8 md:h-8 text-foreground group-hover:text-white transition-colors" />
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
            <h4 className="text-2xl font-serif font-bold text-foreground mb-3 flex items-center gap-3">
              {isEn ? "02. Classroom Renovations" : "02. 传统课室系列改造"}
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
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
              className="block w-full aspect-[4/3] md:aspect-[16/9] bg-secondary rounded-3xl overflow-hidden border border-border shadow-md relative group cursor-pointer"
            >
              <ImageWithFallback
                src={room.img}
                alt={`Classroom ${room.id}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-4 right-4 w-10 h-10 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <ArrowUpRight className="w-5 h-5 text-foreground" />
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
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground border border-border hover:border-stone-400"
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
              className="group cursor-pointer bg-card border border-border hover:border-stone-400 transition-all duration-300 rounded-3xl overflow-hidden shadow-sm"
            >
              <div className="relative aspect-[4/3] bg-secondary overflow-hidden">
                <ImageWithFallback
                  src={c.imageUrl}
                  alt={c.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 transition-colors" />
              </div>
              <div className="p-8">
                <div className="mb-4">
                  <h3 className="font-serif font-bold text-xl text-foreground group-hover:text-stone-700 transition-colors mb-2">
                    {language === 'zh' ? c.nameZh : c.name}
                  </h3>
                  <div className="flex justify-between items-center border-t border-border pt-4">
                    <button className="text-[10px] uppercase tracking-widest font-bold text-foreground flex items-center gap-2 group-hover:text-teal-700 transition-colors">
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
    <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
      <div className="border-b border-border p-6 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-stone-50/50">
        <div className="flex items-start gap-4">
          <button
            onClick={() => setSelectedCaseId(null)}
            className="mt-1 p-2 rounded-full bg-secondary hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <div>
            <h2 className="text-3xl font-serif font-bold text-foreground">{language === 'zh' ? selectedCase.nameZh : selectedCase.name}</h2>
            <p className="text-muted-foreground font-mono text-sm">{language === 'zh' ? selectedCase.dynastyZh : selectedCase.dynasty}</p>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
        <div className="lg:col-span-4 space-y-10">
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground mb-4 border-b border-border pb-2 inline-block">
              {trans.theory?.chinese?.analysisTitle || 'Analysis'}
            </h4>
            <p className="text-stone-700 leading-relaxed text-sm">
              {language === 'zh' ? selectedCase.descriptionZh : selectedCase.description}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-muted-foreground uppercase tracking-wider text-[10px] mb-4">
              <Layers className="w-3 h-3" /> {trans.theory?.chinese?.layerExplainer || 'Structural Layers'}
            </div>
            <div className="space-y-3">
              {selectedCase.levels.map((level, i) => (
                <div key={i} className="flex items-center gap-3 text-xs">
                  <span className="w-5 h-5 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-mono text-[10px]">{i + 1}</span>
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500" style={{ width: `${(level / Math.max(...selectedCase.levels)) * 100}%` }} />
                  </div>
                  <span className="font-mono text-muted-foreground w-14 text-right">{level.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-muted-foreground uppercase tracking-wider text-[10px] mb-4">
              <Check className="w-3 h-3" /> Related Properties
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedCase.relatedProperties.map((pIndex) => {
                const p = propertiesData.find(prop => prop.n === pIndex);
                return p ? (
                  <div key={p.n} className="px-3 py-1 bg-secondary text-muted-foreground rounded-full text-[10px] font-serif border border-border">
                    {language === 'zh' ? p.tZh : p.tEn}
                  </div>
                ) : null;
              })}
            </div>
          </div>

          <div className="pt-8 border-t border-border">
            <label className="flex items-center justify-between cursor-pointer group bg-muted p-5 rounded-2xl border border-border hover:border-teal-400 transition-all">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground group-hover:text-teal-600 transition-colors">
                  {trans.theory?.chinese?.toggleCenters || 'Highlight Living Centers'}
                </span>
                <span className="text-[10px] text-muted-foreground mt-1">Reveal architectural focal points</span>
              </div>
              <button
                onClick={() => setHighlightCenters(!highlightCenters)}
                className={cn(
                  "w-12 h-6 rounded-full relative transition-colors duration-300 shadow-inner",
                  highlightCenters ? "bg-teal-500" : "bg-stone-300"
                )}
              >
                <div className={cn(
                  "w-4 h-4 bg-card rounded-full absolute top-1 transition-transform duration-300 shadow-sm",
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
            <h1 className="text-3xl md:text-5xl font-serif font-black text-foreground uppercase tracking-tight">
              {isEn ? "Constructing Life" : "活力结构构建"}
            </h1>
            <p className="mt-4 text-muted-foreground font-mono uppercase tracking-widest text-xs">
              {isEn ? "From Mathematical Models to Physical Reality" : "从数学模型到物理现实的演化"}
            </p>
          </div>

          <div className="bg-card p-8 md:p-12 rounded-3xl border border-border shadow-sm">
            <div className="max-w-3xl mb-12">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4">
                {isEn ? "01. Evolutionary Growth" : "01. 结构演化增长"}
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {isEn
                  ? "Observe the discrete evolution of a classical structure. The livingness (L) is calculated by multiplying the cumulative number of substructures (ΣS) with the hierarchy depth (H)."
                  : "观察建筑结构的离散演化过程。随着层级 (H) 的加深，所有层级的子结构数量不断累加构成总数 (ΣS)，两者共同决定了整体的活力 (L)。"}
              </p>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 md:gap-12 items-start w-full">
              <div className="order-2 lg:order-1 lg:col-span-8 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 w-full">
                <div className="hidden lg:block w-full">
                  <Card className="bg-card p-6 h-[700px] flex flex-col relative border-border shadow-sm opacity-50 grayscale">
                    <div className="absolute top-6 left-6 text-[10px] font-bold tracking-widest text-muted-foreground uppercase z-10">
                      {isEn ? "Initial State" : "初始状态"} (H: 1, ΣS: 3)
                    </div>
                    <div className="flex-1 flex items-center justify-center w-full h-full p-4 relative">
                      <img
                        src={STAGE_IMAGES[0]}
                        alt="Stage 1"
                        className="object-contain w-full h-full max-h-[500px]"
                      />
                    </div>
                    <div className="text-center text-xs font-mono text-muted-foreground tracking-widest pb-4">
                      PRIMITIVE MASS
                    </div>
                  </Card>
                </div>

                <Card className="bg-card p-0 h-[420px] lg:h-[700px] flex flex-col relative border-teal-200 shadow-2xl ring-1 ring-teal-50 overflow-hidden w-full">
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
                <Card className="bg-secondary border-none p-5 md:p-8 text-center relative overflow-hidden shadow-inner">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-teal-600" />
                  <div className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 md:mb-6">
                    {isEn ? "Livingness Formula" : "活力计算公式"}
                  </div>
                  <div className="flex flex-col items-center justify-center space-y-2 md:space-y-4">
                    <div className="text-xl md:text-2xl font-mono font-bold text-muted-foreground tracking-widest">
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
                            className="text-[10px] md:text-xs text-muted-foreground font-mono leading-relaxed text-center"
                          >
                            ΣS = {sumString}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </Card>

                <Card className="bg-card p-4 md:p-6 space-y-6 shadow-sm border-border">
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
                      className="w-full h-1.5 md:h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all shadow-inner"
                    />
                  </div>
                </Card>

                {/* Prompt Lab removed and moved to Analysis */}
              </div>
            </div>
          </div>
        </div>

        <CampusProjectsSection isEn={isEn} />

        <HighLowGallery isEn={isEn} />

        <div className="pt-8">
          <Section
            title={trans.theory?.chinese?.title || "Chinese Architecture"}
            subTitle={isEn ? "Empirical Analysis" : "实证案例分析"}
            className="!border-t-0 !pt-0"
          >
            <div className="mb-12 max-w-3xl">
              <p className="text-lg text-muted-foreground leading-relaxed font-serif">
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