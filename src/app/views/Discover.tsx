import React, { useState, useEffect } from "react";
import { Button, Card, Badge } from "@/app/components/ui";
import { 
  ArrowRight, BookOpen, ScanEye, PenTool, 
  Sparkles, Quote, CheckCircle2, ChevronRight, MousePointer2, User, X, Microscope, Box, Leaf
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; 
import { useLanguage } from "@/app/i18n/LanguageContext";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { cn } from "@/app/components/ui";

interface DiscoverProps {
  onNavigate: (page: string) => void;
}

// --- Sub-Components ---

const QuickStartCard = ({ 
  titleEn, titleZh, descEn, descZh, icon: Icon, onClick, color = "stone" 
}: { 
  titleEn: string, titleZh: string, descEn: string, descZh: string, icon: any, onClick: () => void, color?: "stone" | "teal" | "amber" 
}) => {
  const { language } = useLanguage(); 

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <button 
        onClick={onClick}
        className={`group relative flex flex-col items-start justify-between w-full h-full p-8 text-left bg-card border border-border hover:border-stone-900 transition-all duration-300 rounded-sm shadow-sm hover:shadow-md overflow-hidden`}
      >
        <div className="relative z-10 w-full">
           <div className={`mb-6 inline-flex p-3 rounded-sm ${
             color === "teal" ? "bg-teal-50 text-teal-700" : 
             color === "amber" ? "bg-amber-50 text-amber-700" : 
             "bg-secondary text-stone-700"
           }`}>
             <Icon className="w-8 h-8" strokeWidth={1.5} />
           </div>
           <h3 className="text-2xl font-serif font-bold text-foreground mb-2">
             {language === 'en' ? titleEn : titleZh}
           </h3>
           <p className="text-muted-foreground font-sans leading-relaxed text-sm">
             {language === 'en' ? descEn : descZh}
           </p>
        </div>
        
        <div className="relative z-10 w-full mt-8 flex items-center text-sm font-medium text-foreground group-hover:underline decoration-1 underline-offset-4">
          {language === 'en' ? 'Start Now' : '立即开始'} <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>

        <Icon className="absolute -bottom-4 -right-4 w-32 h-32 text-stone-50 opacity-50 group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
      </button>
    </motion.div>
  );
};

const ProgressIndicator = () => {
  const { language } = useLanguage(); 
  const learned = 3;
  const total = 15;
  const percentage = (learned / total) * 100;

  return (
    <div className="w-full bg-muted border-y border-border py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
         <div className="flex items-center gap-3">
           <div className="p-2 bg-stone-900 rounded-full">
             <CheckCircle2 className="w-4 h-4 text-stone-50" />
           </div>
           <div>
             <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">
               {language === 'en' ? 'Your Progress' : '学习进度'}
             </h4>
             <p className="text-xs text-muted-foreground">
               {language === 'en' ? 'Mastering the 15 Properties' : '掌握活力结构的15个属性'}
             </p>
           </div>
         </div>
         
         <div className="flex-1 max-w-md w-full flex items-center gap-4">
           <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${percentage}%` }}
               transition={{ duration: 1, delay: 0.5 }}
               className="h-full bg-stone-900"
             />
           </div>
           <span className="font-mono text-xs font-medium text-muted-foreground whitespace-nowrap">
             {language === 'en' ? `${learned} / ${total} Completed` : `已完成 ${learned} / ${total}`}
           </span>
         </div>
      </div>
    </div>
  );
};

const FeaturedConcept = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  const { trans, language } = useLanguage();
  const [randomId, setRandomId] = useState<number>(1);

  useEffect(() => {
    setRandomId(Math.floor(Math.random() * 15) + 1);
  }, []);

  const propertyKey = randomId as keyof typeof trans.theory.attributes;
  const property = trans.theory.attributes[propertyKey] || trans.theory.attributes[1];

  return (
    <div className="bg-card border border-border text-foreground overflow-hidden relative rounded-sm shadow-sm transition-shadow hover:shadow-md">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="p-10 lg:p-16 flex flex-col justify-center relative z-10">
           <div className="mb-6 flex items-center gap-2">
             <div className="p-1.5 bg-amber-50 rounded-full">
                <Sparkles className="w-4 h-4 text-amber-600" />
             </div>
             <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
               {trans.discover.dailyInsight || (language === 'en' ? "Daily Insight" : "每日洞察")}
             </span>
           </div>
           
           <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
             {property.name}
           </h2>
           
           <blockquote className="text-xl md:text-2xl font-serif italic text-muted-foreground mb-8 leading-relaxed border-l-4 border-amber-400 pl-6 bg-stone-50/50 py-2">
             "{property.description}"
           </blockquote>
           
           <Button 
             variant="outline"
             className="w-fit border-stone-300 text-stone-700 hover:bg-secondary hover:text-foreground transition-colors"
             onClick={() => onNavigate("theory")}
           >
             {trans.discover.featuredConcept?.button || (language === 'en' ? "Explore in Theory" : "在理论库中探索")}
           </Button>
        </div>

        <div className="relative h-64 lg:h-auto overflow-hidden bg-stone-100">
           <ImageWithFallback 
             src="https://images.unsplash.com/photo-1754873313580-5d70c8fa2b29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaGUlMjBBbGhhbWJyYSUyMEdyYW5hZGElMjBpbnRyaWNhdGUlMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzcxNjQ3OTYzfDA&ixlib=rb-4.1.0&q=80&w=1080"
             alt="Featured Concept Example"
             className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
           />
           <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-white via-white/40 to-transparent lg:w-1/3" />
        </div>
      </div>
    </div>
  );
};

const InteractivePreview = () => {
  const { language } = useLanguage(); 
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="border border-border bg-card rounded-sm overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 h-full min-h-[400px]">
        <div 
          className="relative h-64 md:h-full cursor-pointer group overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={() => setIsHovering(!isHovering)}
        >
           <motion.div 
             className="absolute inset-0"
             animate={{ opacity: isHovering ? 0 : 1 }}
             transition={{ duration: 0.5 }}
           >
             <ImageWithFallback 
               src="https://images.unsplash.com/photo-1761461535428-5573006318bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBnbGFzcyUyMHNreXNjcmFwZXIlMjBmYWNhZGUlMjBtaW5pbWFsaXN0fGVufDF8fHx8MTc3MTY0Nzk2M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
               alt="Dead Structure"
               className="w-full h-full object-cover grayscale opacity-90"
             />
             <div className="absolute inset-0 flex items-center justify-center bg-stone-900/20">
               <div className="bg-card/90 backdrop-blur px-4 py-2 rounded-sm shadow-sm flex items-center gap-2">
                 <MousePointer2 className="w-4 h-4 text-muted-foreground" />
                 <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                   {language === 'en' ? 'Tap / Hover to Transform' : '点击 / 悬停以转换'}
                 </span>
               </div>
             </div>
             <div className="absolute top-4 left-4 bg-muted text-muted-foreground text-[10px] font-bold uppercase tracking-widest px-2 py-1">
               {language === 'en' ? 'Dead Structure' : '缺乏活力的结构'}
             </div>
           </motion.div>

           <motion.div 
             className="absolute inset-0"
             initial={{ opacity: 0 }}
             animate={{ opacity: isHovering ? 1 : 0 }}
             transition={{ duration: 0.5 }}
           >
             <ImageWithFallback 
               src="https://images.unsplash.com/photo-1754873313580-5d70c8fa2b29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaGUlMjBBbGhhbWJyYSUyMEdyYW5hZGElMjBpbnRyaWNhdGUlMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzcxNjQ3OTYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
               alt="Living Structure"
               className="w-full h-full object-cover"
             />
             <div className="absolute top-4 left-4 bg-teal-600 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1">
               {language === 'en' ? 'Living Structure' : '活力结构'}
             </div>
           </motion.div>
        </div>

        <div className="p-10 flex flex-col justify-center bg-stone-50">
           <h3 className="text-2xl font-serif font-bold text-foreground mb-4">
             {language === 'en' ? 'See the Difference' : '观察差异'}
           </h3>
           <p className="text-muted-foreground mb-6 leading-relaxed">
             {language === 'en' 
               ? 'Modernist minimalism often results in "dead" structures lacking scale and centers. Living structures, like the Alhambra, teem with recursive detail and interconnected centers.'
               : '现代主义的极简设计往往导致缺乏尺度层级和中心的“死亡”结构。而活力结构（如阿尔罕布拉宫）则充满了递归的细节和相互联系的强中心。'}
           </p>
           
           <div className="space-y-4">
             <div className="flex items-start gap-3">
               <div className={`p-1 rounded-full ${isHovering ? 'bg-muted text-muted-foreground' : 'bg-red-100 text-red-600'}`}>
                 <ScanEye className="w-4 h-4" />
               </div>
               <div>
                 <h4 className={`text-sm font-bold ${isHovering ? 'text-muted-foreground' : 'text-foreground'}`}>
                   {language === 'en' ? 'Glass Facade' : '玻璃立面'}
                 </h4>
                 <p className="text-xs text-muted-foreground">
                   {language === 'en' ? 'Smooth, featureless, lacks differentiation.' : '平滑、无特征，缺乏空间差异性。'}
                 </p>
               </div>
             </div>

             <div className="flex items-start gap-3">
               <div className={`p-1 rounded-full ${isHovering ? 'bg-teal-100 text-teal-600' : 'bg-muted text-muted-foreground'}`}>
                 <Sparkles className="w-4 h-4" />
               </div>
               <div>
                 <h4 className={`text-sm font-bold ${isHovering ? 'text-foreground' : 'text-muted-foreground'}`}>
                   {language === 'en' ? 'Intricate Detail' : '精细结构'}
                 </h4>
                 <p className="text-xs text-muted-foreground">
                   {language === 'en' ? 'Fractal scaling, strong centers, deep interlock.' : '分形尺度，强中心，深度交错与互锁。'}
                 </p>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const TheoryFounder = ({ nameEn, nameZh, roleEn, roleZh, descEn, descZh, image, align = "left" }: { nameEn: string, nameZh: string, roleEn: string, roleZh: string, descEn: string, descZh: string, image: string, align?: "left" | "right" }) => {
  const { language } = useLanguage(); 
  return (
    <div className={`flex flex-col md:flex-row items-center gap-8 ${align === "right" ? "md:flex-row-reverse" : ""}`}>
      <div className="w-32 h-32 md:w-48 md:h-48 shrink-0 relative rounded-full overflow-hidden border border-border shadow-sm group cursor-pointer focus:outline-none">
        <ImageWithFallback src={image} alt={nameEn} className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-active:grayscale-0" />
      </div>
      <div className={`text-center ${align === "left" ? "md:text-left" : "md:text-right"}`}>
        <h3 className="text-2xl font-serif font-bold text-foreground mb-1">
          {language === 'en' ? nameEn : nameZh}
        </h3>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
          {language === 'en' ? roleEn : roleZh}
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-lg">
          {language === 'en' ? descEn : descZh}
        </p>
      </div>
    </div>
  );
};

const BookLaunchExperiment = () => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-32">
      <div className="bg-stone-950 rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl border border-stone-800 flex flex-col">
        
        {/* 🌟 仅保留新书视觉发布区 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 relative">
          <div className="absolute inset-0 bg-[url('/images/grid-pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/4 pointer-events-none" />

          {/* 左侧文字信息 */}
          <div className="lg:col-span-7 p-10 md:p-16 lg:p-20 relative z-10 flex flex-col justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Badge variant="outline" className="mb-6 border-amber-500/50 text-amber-400 bg-amber-950/30 uppercase tracking-widest backdrop-blur-sm w-fit">
                {isEn ? "Major Publication Release" : "重磅学术著作首发"}
              </Badge>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black text-white mb-4 leading-tight tracking-wide">
                {isEn ? "Living Structure" : "活力结构"}
              </h2>
              <h3 className="text-xl md:text-2xl font-serif text-amber-200/90 mb-8 leading-snug">
                {isEn ? "Exploring the Beauty of Chinese Traditional Buildings Through the Lens of AI" : "AI视角下的中国传统建筑之美"}
              </h3>
              
              <div className="h-1 w-16 bg-amber-500 mb-8 rounded-full" />

              <p className="text-stone-300 leading-relaxed text-sm md:text-base font-light max-w-xl text-justify">
                {isEn 
                  ? "Prof. Bin Jiang bridges the gap between Christopher Alexander's phenomenological theory and modern artificial intelligence. This masterpiece reveals the computable, objective beauty hidden within traditional Chinese architecture, transforming subjective aesthetics into rigorous science."
                  : "江斌教授跨越了亚历山大现象学理论与现代人工智能的鸿沟。这部开创性著作，深度揭示了隐藏在中国传统建筑基因中、可被计算的客观结构之美，将主观的建筑美学升华为严谨的科学。"}
              </p>
            </motion.div>
          </div>

          {/* 右侧 3D 渲染图 */}
          <div className="lg:col-span-5 relative h-[350px] lg:h-auto min-h-[400px] flex items-center justify-center p-8 z-10">
             <motion.div 
               initial={{ y: 20, opacity: 0 }}
               whileInView={{ y: 0, opacity: 1 }}
               transition={{ duration: 1, type: "spring", bounce: 0.4 }}
               className="relative w-full h-full flex items-center justify-center perspective-[1200px]"
             >
                <img 
                  src="/book-cover.jpg" 
                  alt="Living Structure Book Cover" 
                  className="w-auto h-full max-h-[350px] md:max-h-[450px] object-contain shadow-[-30px_30px_40px_rgba(0,0,0,0.8)] rotate-y-[-15deg] rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 active:rotate-y-0 active:rotate-x-0 transition-transform duration-700 ease-out cursor-pointer"
                />
             </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
};


// --- Main Page Component ---

export function Discover({ onNavigate }: DiscoverProps) {
  const { trans, language } = useLanguage(); 
  const isEn = language === 'en';

  return (
    <div className="min-h-screen bg-card pb-24">
      
      {/* 💡 1. 全新重构的 Hero Section (包含你的电梯演讲与核心功能简介) */}
      <section className="pt-32 pb-24 px-4 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Badge variant="outline" className="mb-6 border-teal-500/50 text-teal-700 bg-teal-50 uppercase tracking-widest px-5 py-2 rounded-full font-bold">
             {isEn ? "Spatial Diagnosis & Healing Tool" : "空间诊断与疗愈工具"}
          </Badge>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-black text-foreground tracking-tight mb-6">
            {isEn ? "Healing Mirror" : "愈合之镜"}
          </h1>
          
          <h2 className="text-xl md:text-2xl font-serif text-muted-foreground mb-10 italic">
            {isEn ? "Quantifying the life of space, awakening inner wholeness." : "量化空间的生命力，照见内心的整体性。"}
          </h2>
          
          <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed max-w-3xl mx-auto mb-12 text-justify md:text-center">
            {isEn
              ? "Space is not a dead box, but a true mirror of your inner state. Upload an image, and our structural algorithm (L = S × H) will measure the objective 'Livingness' of your environment. By applying the 15 properties of life for spatial micro-interventions, we help you repair fragmentation and rediscover profound inner peace."
              : "这是一款基于「活力结构」理论的空间诊断与疗愈工具。空间不是死寂的空盒子，而是你内心状态的真实镜像。只需上传一张照片，「愈合之镜」将通过底层结构算法（L = S × H）精准测算你所在空间的客观生命力。我们基于15种属性为你提供空间“微介入”处方，通过极简的物理调整，修补环境的割裂，助你找回内心的平静与完整。"}
          </p>
          
          <Button 
            onClick={() => onNavigate("analyze")}
            className="bg-teal-600 hover:bg-primary-hover text-white px-10 py-7 text-sm uppercase tracking-widest transition-all rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 font-bold"
          >
            {isEn ? 'Begin Spatial Diagnosis' : '开启空间实证诊断'}
          </Button>
        </motion.div>
      </section>

      {/* 2. 新书发布 */}
      <BookLaunchExperiment />

      {/* 3. Platform Statement */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mb-32">
        <div className="bg-muted border border-border p-12 md:p-16 relative">
          <Quote className="absolute top-8 left-8 w-6 h-6 text-stone-300" />
          <div className="relative z-10 text-center space-y-6">
            <p className="text-lg font-serif text-stone-800 leading-relaxed italic max-w-2xl mx-auto">
              {trans.discover.platformStatement?.desc || (language === 'en' 
                ? "This platform explores Living Structure as an aesthetic and architectural principle. It aims to cultivate structural perception and restore a sense of order and inner calm." 
                : "本平台将“活力结构”作为一种美学与建筑原则进行探索，旨在培养对结构的感知力，重建空间秩序与内心的宁静。")}
            </p>
          </div>
        </div>
      </section>

      {/* 4. Theory Founders */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mb-32 space-y-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif font-bold text-foreground">
            {language === 'en' ? 'Theory Founders' : '理论创始人'}
          </h2>
          <p className="text-muted-foreground text-xs mt-3 font-mono uppercase tracking-widest">
            {language === 'en' ? 'Pioneers of Structural Wholeness' : '结构整体性的先驱'}
          </p>
        </div>
        <TheoryFounder 
          nameEn="Christopher Alexander" nameZh="克里斯托弗·亚历山大 (Christopher Alexander)"
          roleEn="Architect & Design Theorist" roleZh="建筑师与设计理论家"
          descEn="Renowned for 'A Pattern Language' and 'The Nature of Order'. He identified the 15 fundamental properties of living structures, proposing that space itself has a degree of life derived from geometric coherence."
          descZh="以《建筑模式语言》和《秩序的本质》闻名于世。他界定了活力结构的15个基本属性，提出空间本身具有一种源于几何连贯性的‘活力’。"
          image="/images/A.png" align="left"
        />
        <div className="w-16 h-px bg-muted mx-auto" />
        <TheoryFounder 
          nameEn="Bin Jiang" nameZh="江斌 (Bin Jiang)"
          roleEn="Professor of Urban Design & Computational Media Arts" roleZh="城市治理与设计和计算媒体与艺术双聘教授"
          descEn="Creator of the 'Living Structure' mathematical framework (L = S × H). His work transforms Alexander's qualitative concepts into computable metrics, utilizing topological analysis and head/tail breaks to quantify structural beauty."
          descZh="“活力结构”数学框架（L = S × H）的创立者。他的研究将亚历山大的定性概念转化为可计算的指标，利用拓扑分析和头尾断裂法（head/tail breaks）来精准量化结构之美。"
          image="/images/BJ.png" align="right"
        />
      </section>

      {/* 5. Quick Start Dashboard */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-32">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px bg-muted flex-1" />
          <h2 className="text-sm font-serif font-bold text-muted-foreground uppercase tracking-widest">
            {language === 'en' ? 'Start Exploring' : '开始探索'}
          </h2>
          <div className="h-px bg-muted flex-1" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <QuickStartCard titleEn="Learn Theory" titleZh="理论学习" descEn="Master the 15 fundamental properties of living structure through interactive definitions and case studies." descZh="通过交互式定义与真实案例分析，深入掌握活力结构的15个基本属性。" icon={BookOpen} onClick={() => onNavigate("theory")} color="stone" />
          <QuickStartCard titleEn="Analysis" titleZh="结构分析" descEn="Upload your own architectural images and use structural algorithms to evaluate their vitality (L = S × H)." descZh="上传你自己的建筑图纸或照片，使用算法模型评估其结构活力指标 (L = S × H)。" icon={ScanEye} onClick={() => onNavigate("analyze")} color="teal" />
          <QuickStartCard titleEn="Practice Lab" titleZh="实践沙盒" descEn="Experiment with generative tools to create your own living geometries in a 2D/3D sandbox." descZh="在2D/3D交互实验室内使用生成工具，尝试创造属于你自己的生命几何图形。" icon={PenTool} onClick={() => onNavigate("practice")} color="amber" />
        </div>
      </section>

      {/* 6. Progress Indicator */}
      <ProgressIndicator />

      {/* 7. Featured Concept */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-16 flex items-baseline justify-between">
           <h2 className="text-3xl font-serif font-bold text-foreground">
             {trans.discover.featuredConcept?.title || (language === 'en' ? "Featured Concept" : "精选概念")}
           </h2>
           <button onClick={() => onNavigate("theory")} className="text-muted-foreground hover:text-foreground text-xs font-medium uppercase tracking-widest flex items-center gap-2 transition-colors">
             {language === 'en' ? 'View All 15 Properties' : '查看全部15个属性'} <ChevronRight className="w-3 h-3" />
           </button>
        </div>
        <FeaturedConcept onNavigate={onNavigate} />
      </section>

      {/* 8. Interactive Preview */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-16">
           <h2 className="text-3xl font-serif font-bold text-foreground">
             {language === 'en' ? 'Interactive Preview' : '互动预览'}
           </h2>
           <p className="text-muted-foreground mt-2 font-light">
             {language === 'en' ? 'Test your intuition before diving deep.' : '在深入学习具体理论之前，先通过直觉感受差异。'}
           </p>
        </div>
        <InteractivePreview />
      </section>

      {/* 9. Footer Quote */}
      <section className="border-t border-border bg-card py-24 text-center mt-12">
        <div className="max-w-3xl mx-auto px-4">
          <Quote className="h-6 w-6 text-stone-300 mx-auto mb-8" />
          <p className="text-xl font-serif italic text-stone-800 leading-relaxed mb-6">
            {language === 'en' 
              ? '"We must learn to see the world not as a collection of things, but as a structure of centers."' 
              : '“我们必须学会不再将世界看作一堆事物的集合，而是将其视为一个由众多‘中心’组成的结构。”'}
          </p>
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            {language === 'en' ? 'Christopher Alexander' : '克里斯托弗·亚历山大'}
          </div>
        </div>
      </section>

    </div>
  );
}