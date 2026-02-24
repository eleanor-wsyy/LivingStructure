import React, { useState, useEffect } from "react";
import { Button, Card, Badge } from "@/app/components/ui";
import { 
  ArrowRight, BookOpen, ScanEye, PenTool, 
  Sparkles, Quote, CheckCircle2, ChevronRight, MousePointer2, User 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
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
  const { language } = useLanguage(); // 加入语言开关

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <button 
        onClick={onClick}
        className={`group relative flex flex-col items-start justify-between w-full h-full p-8 text-left bg-white border border-stone-200 hover:border-stone-900 transition-all duration-300 rounded-sm shadow-sm hover:shadow-md overflow-hidden`}
      >
        <div className="relative z-10 w-full">
           <div className={`mb-6 inline-flex p-3 rounded-sm ${
             color === "teal" ? "bg-teal-50 text-teal-700" : 
             color === "amber" ? "bg-amber-50 text-amber-700" : 
             "bg-stone-100 text-stone-700"
           }`}>
             <Icon className="w-8 h-8" strokeWidth={1.5} />
           </div>
           <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">
             {language === 'en' ? titleEn : titleZh}
           </h3>
           <p className="text-stone-500 font-sans leading-relaxed text-sm">
             {language === 'en' ? descEn : descZh}
           </p>
        </div>
        
        <div className="relative z-10 w-full mt-8 flex items-center text-sm font-medium text-stone-900 group-hover:underline decoration-1 underline-offset-4">
          {language === 'en' ? 'Start Now' : '立即开始'} <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>

        {/* Decorative Background Icon */}
        <Icon className="absolute -bottom-4 -right-4 w-32 h-32 text-stone-50 opacity-50 group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
      </button>
    </motion.div>
  );
};

const ProgressIndicator = () => {
  const { language } = useLanguage(); // 加入语言开关
  const learned = 3;
  const total = 15;
  const percentage = (learned / total) * 100;

  return (
    <div className="w-full bg-stone-50 border-y border-stone-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
         <div className="flex items-center gap-3">
           <div className="p-2 bg-stone-900 rounded-full">
             <CheckCircle2 className="w-4 h-4 text-stone-50" />
           </div>
           <div>
             <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
               {language === 'en' ? 'Your Progress' : '学习进度'}
             </h4>
             <p className="text-xs text-stone-500">
               {language === 'en' ? 'Mastering the 15 Properties' : '掌握活力结构的15个属性'}
             </p>
           </div>
         </div>
         
         <div className="flex-1 max-w-md w-full flex items-center gap-4">
           <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${percentage}%` }}
               transition={{ duration: 1, delay: 0.5 }}
               className="h-full bg-stone-900"
             />
           </div>
           <span className="font-mono text-xs font-medium text-stone-500 whitespace-nowrap">
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
    // 随机抽取 1-15 中的一个属性
    setRandomId(Math.floor(Math.random() * 15) + 1);
  }, []);

  const propertyKey = randomId as keyof typeof trans.theory.attributes;
  const property = trans.theory.attributes[propertyKey] || trans.theory.attributes[1];

  return (
    <div className="bg-white border border-stone-200 text-stone-900 overflow-hidden relative rounded-sm shadow-sm transition-shadow hover:shadow-md">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* 左侧：明亮的文字区域 */}
        <div className="p-10 lg:p-16 flex flex-col justify-center relative z-10">
           <div className="mb-6 flex items-center gap-2">
             <div className="p-1.5 bg-amber-50 rounded-full">
                <Sparkles className="w-4 h-4 text-amber-600" />
             </div>
             <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
               {trans.discover.dailyInsight || (language === 'en' ? "Daily Insight" : "每日洞察")}
             </span>
           </div>
           
           <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6">
             {property.name}
           </h2>
           
           <blockquote className="text-xl md:text-2xl font-serif italic text-stone-600 mb-8 leading-relaxed border-l-4 border-amber-400 pl-6 bg-stone-50/50 py-2">
             "{property.description}"
           </blockquote>
           
           <Button 
             variant="outline"
             className="w-fit border-stone-300 text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors"
             onClick={() => onNavigate("theory")}
           >
             {trans.discover.featuredConcept?.button || (language === 'en' ? "Explore in Theory" : "在理论库中探索")}
           </Button>
        </div>

        {/* 右侧：清晰的图片区域 */}
        <div className="relative h-64 lg:h-auto overflow-hidden bg-stone-100">
           <ImageWithFallback 
             // 这里可以换成你更喜欢的建筑图片的在线链接，或者本地路径如 "/images/your-pic.jpg"
             src="https://images.unsplash.com/photo-1754873313580-5d70c8fa2b29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaGUlMjBBbGhhbWJyYSUyMEdyYW5hZGElMjBpbnRyaWNhdGUlMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzcxNjQ3OTYzfDA&ixlib=rb-4.1.0&q=80&w=1080"
             alt="Featured Concept Example"
             className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
           />
           {/* 用柔和的白色渐变替代原来的黑色渐变，让文字区和图片区过渡更自然 */}
           <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-white via-white/40 to-transparent lg:w-1/3" />
        </div>
      </div>
    </div>
  );
};

const InteractivePreview = () => {
  const { language } = useLanguage(); // 加入语言开关
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="border border-stone-200 bg-white rounded-sm overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 h-full min-h-[400px]">
        {/* Interactive Side */}
        <div 
          className="relative h-64 md:h-full cursor-pointer group overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={() => setIsHovering(!isHovering)}
        >
           {/* Dead Image (Default) */}
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
               <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-sm shadow-sm flex items-center gap-2">
                 <MousePointer2 className="w-4 h-4 text-stone-400" />
                 <span className="text-xs font-bold uppercase tracking-widest text-stone-600">
                   {language === 'en' ? 'Tap / Hover to Transform' : '点击 / 悬停以转换'}
                 </span>
               </div>
             </div>
             <div className="absolute top-4 left-4 bg-stone-200 text-stone-500 text-[10px] font-bold uppercase tracking-widest px-2 py-1">
               {language === 'en' ? 'Dead Structure' : '缺乏活力的结构'}
             </div>
           </motion.div>

           {/* Living Image (Revealed) */}
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

        {/* Text Side */}
        <div className="p-10 flex flex-col justify-center bg-stone-50">
           <h3 className="text-2xl font-serif font-bold text-stone-900 mb-4">
             {language === 'en' ? 'See the Difference' : '观察差异'}
           </h3>
           <p className="text-stone-600 mb-6 leading-relaxed">
             {language === 'en' 
               ? 'Modernist minimalism often results in "dead" structures lacking scale and centers. Living structures, like the Alhambra, teem with recursive detail and interconnected centers.'
               : '现代主义的极简设计往往导致缺乏尺度层级和中心的“死亡”结构。而活力结构（如阿尔罕布拉宫）则充满了递归的细节和相互联系的强中心。'}
           </p>
           
           <div className="space-y-4">
             <div className="flex items-start gap-3">
               <div className={`p-1 rounded-full ${isHovering ? 'bg-stone-200 text-stone-400' : 'bg-red-100 text-red-600'}`}>
                 <ScanEye className="w-4 h-4" />
               </div>
               <div>
                 <h4 className={`text-sm font-bold ${isHovering ? 'text-stone-400' : 'text-stone-900'}`}>
                   {language === 'en' ? 'Glass Facade' : '玻璃立面'}
                 </h4>
                 <p className="text-xs text-stone-500">
                   {language === 'en' ? 'Smooth, featureless, lacks differentiation.' : '平滑、无特征，缺乏空间差异性。'}
                 </p>
               </div>
             </div>

             <div className="flex items-start gap-3">
               <div className={`p-1 rounded-full ${isHovering ? 'bg-teal-100 text-teal-600' : 'bg-stone-200 text-stone-400'}`}>
                 <Sparkles className="w-4 h-4" />
               </div>
               <div>
                 <h4 className={`text-sm font-bold ${isHovering ? 'text-stone-900' : 'text-stone-400'}`}>
                   {language === 'en' ? 'Intricate Detail' : '精细结构'}
                 </h4>
                 <p className="text-xs text-stone-500">
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
  const { language } = useLanguage(); // 加入语言开关
  return (
    <div className={`flex flex-col md:flex-row items-center gap-8 ${align === "right" ? "md:flex-row-reverse" : ""}`}>
      <div className="w-32 h-32 md:w-48 md:h-48 shrink-0 relative rounded-full overflow-hidden border border-stone-200 shadow-sm group">
        <ImageWithFallback src={image} alt={nameEn} className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0" />
      </div>
      <div className={`text-center ${align === "left" ? "md:text-left" : "md:text-right"}`}>
        <h3 className="text-2xl font-serif font-bold text-stone-900 mb-1">
          {language === 'en' ? nameEn : nameZh}
        </h3>
        <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">
          {language === 'en' ? roleEn : roleZh}
        </p>
        <p className="text-stone-600 text-sm leading-relaxed max-w-lg">
          {language === 'en' ? descEn : descZh}
        </p>
      </div>
    </div>
  );
};

// --- Main Page Component ---

export function Discover({ onNavigate }: DiscoverProps) {
  const { trans, language } = useLanguage(); // 提取了 language 变量

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-24">
      
      {/* 1. Manifesto Block (Refined Hero) */}
      <section className="pt-32 pb-32 px-4 max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 tracking-tight mb-6">
            {language === 'en' ? 'Understanding Wholeness Through Living Structure' : '透过活力结构理解整体性'}
          </h1>
          <div className="space-y-2 mb-10">
            <p className="text-lg text-stone-600 font-light leading-relaxed">
              {language === 'en' ? 'Living Structure explores hierarchical order in architecture.' : '“活力结构”理论致力于探索建筑与空间中的层级秩序。'}
            </p>
            <p className="text-lg text-stone-600 font-light leading-relaxed">
              {language === 'en' ? 'This platform presents its theory and architectural embodiment.' : '本平台旨在展示该理论的核心思想及其在建筑设计中的具象体现。'}
            </p>
          </div>
          <Button 
            onClick={() => onNavigate("theory")}
            variant="outline"
            className="px-8 py-6 text-sm uppercase tracking-widest border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white transition-all rounded-sm"
          >
            {language === 'en' ? 'Explore Theory' : '探索理论'}
          </Button>
        </motion.div>
      </section>
      {/* ✨✨✨ 新增 v2：江斌教授新书 - 现代分栏无渐变版 ✨✨✨ */}
      <section className="w-full mb-32 bg-stone-50 border-y border-stone-200 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
            
            {/* 左侧：文字内容区 (占据7/12) */}
            <div className="lg:col-span-7 p-10 md:p-16 lg:p-24 flex flex-col justify-center relative z-10 order-2 lg:order-1">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Badge variant="outline" className="mb-6 border-amber-500 text-amber-700 bg-amber-50 uppercase tracking-widest">
                  {language === 'en' ? 'Major Publication' : '重磅著作'}
                </Badge>
                
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4 leading-tight">
                  {language === 'en' ? 'A New Kind of Geometry' : '一种新的几何学'}
                </h2>
                <p className="text-2xl md:text-3xl font-serif text-stone-500 mb-8">
                  {language === 'en' ? 'The Science of Living Structure' : '活力结构的科学'}
                </p>
                
                <div className="h-1 w-20 bg-amber-500 mb-8"></div>

                <p className="text-lg text-stone-700 leading-relaxed mb-10 max-w-xl">
                  {language === 'en' 
                    ? 'Prof. Bin Jiang presents a groundbreaking mathematical framework that redefines architecture. This book establishes the scientific foundation required to perceive, analyze, and design true living structures.'
                    : '江斌教授提出了一项重新定义建筑学的突破性数学框架。本书为感知、分析和设计真正的“活力结构”奠定了坚实的科学基础。'}
                </p>

                {/* 按钮组 */}
                <div className="flex flex-wrap gap-4 items-center">
                  <Button 
                    size="lg"
                    className="bg-stone-900 hover:bg-stone-800 text-white font-bold px-8 rounded-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-1"
                    onClick={() => window.open('https://www.amazon.com/Your-Book-Link', '_blank')} // 👈 记得替换链接
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    {language === 'en' ? 'Order Now' : '立即订购'}
                  </Button>
                  <a 
                    href="#" 
                    className="text-stone-600 font-bold hover:text-stone-900 hover:underline underline-offset-4 transition-colors px-4"
                  >
                    {language === 'en' ? 'View Table of Contents' : '查看目录'}
                  </a>
                </div>
              </motion.div>
            </div>

            {/* 右侧：图片展示区 (占据5/12) */}
            {/* 在手机上图片会在上面 (order-1)，电脑上在右边 (order-2) */}
            <div className="lg:col-span-5 relative h-[400px] lg:h-auto bg-stone-200/50 order-1 lg:order-2 overflow-hidden">
               {/* 装饰性背景元素 */}
               <div className="absolute inset-0 bg-[url('/images/grid-pattern.png')] opacity-10 mix-blend-overlay"></div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-amber-100/30 to-transparent blur-3xl rounded-full opacity-50"></div>

               {/* 书本图片 */}
               <ImageWithFallback 
                  src="/images/book.png"  // 👈 【重要】确认路径和文件名
                  alt={language === 'en' ? "A New Kind of Geometry Book Cover" : "《一种新的几何学》书封"}
                  // 这里去掉了 brightness-50，图片是原色的
                  // 增加了 shadow-2xl 让书看起来是立体的
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-auto h-[85%] max-w-[90%] object-contain shadow-2xl shadow-stone-900/20 rotate-[-2deg] hover:rotate-0 hover:scale-105 transition-all duration-700 ease-out"
               />
            </div>
          </div>
        </div>
      </section>
      {/* ✨✨✨ 新书横幅结束 v2 ✨✨✨ */}

      {/* 2. Platform Statement (Simplified) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mb-32">
        <div className="bg-stone-50 border border-stone-200 p-12 md:p-16 relative">
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

      {/* 3. Theory Founders */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mb-32 space-y-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif font-bold text-stone-900">
            {language === 'en' ? 'Theory Founders' : '理论创始人'}
          </h2>
          <p className="text-stone-400 text-xs mt-3 font-mono uppercase tracking-widest">
            {language === 'en' ? 'Pioneers of Structural Wholeness' : '结构整体性的先驱'}
          </p>
        </div>
        
        <TheoryFounder 
          nameEn="Christopher Alexander"
          nameZh="克里斯托弗·亚历山大 (Christopher Alexander)"
          roleEn="Architect & Design Theorist"
          roleZh="建筑师与设计理论家"
          descEn="Renowned for 'A Pattern Language' and 'The Nature of Order'. He identified the 15 fundamental properties of living structures, proposing that space itself has a degree of life derived from geometric coherence."
          descZh="以《建筑模式语言》和《秩序的本质》闻名于世。他界定了活力结构的15个基本属性，提出空间本身具有一种源于几何连贯性的‘生命力’。"
          image="/images/A.png"
          align="left"
        />
        
        <div className="w-16 h-px bg-stone-200 mx-auto" />

        <TheoryFounder 
          nameEn="Professor Bin Jiang"
          nameZh="江斌教授 (Professor Bin Jiang)"
          roleEn="Professor of Geo-Informatics"
          roleZh="地理信息科学教授"
          descEn="Creator of the 'Living Structure' mathematical framework (L = S × H). His work transforms Alexander's qualitative concepts into computable metrics, utilizing topological analysis and head/tail breaks to quantify structural beauty."
          descZh="“活力结构”数学框架（L = S × H）的创立者。他的研究将亚历山大的定性概念转化为可计算的指标，利用拓扑分析和头尾断裂法（head/tail breaks）来精准量化结构之美。"
          image="/images/BJ.png"
          align="right"
        />
      </section>

      {/* 4. Quick Start Dashboard */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-32">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px bg-stone-200 flex-1" />
          <h2 className="text-sm font-serif font-bold text-stone-400 uppercase tracking-widest">
            {language === 'en' ? 'Start Exploring' : '开始探索'}
          </h2>
          <div className="h-px bg-stone-200 flex-1" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <QuickStartCard 
            titleEn="Learn Theory"
            titleZh="理论学习"
            descEn="Master the 15 fundamental properties of living structure through interactive definitions and case studies."
            descZh="通过交互式定义与真实案例分析，深入掌握活力结构的15个基本属性。"
            icon={BookOpen}
            onClick={() => onNavigate("theory")}
            color="stone"
          />
          <QuickStartCard 
            titleEn="Analyze"
            titleZh="结构分析"
            descEn="Upload your own architectural images and use AI to evaluate their structural vitality (L = S × H)."
            descZh="上传你自己的建筑图纸或照片，使用算法模型评估其结构生命力指标 (L = S × H)。"
            icon={ScanEye}
            onClick={() => onNavigate("analyze")}
            color="teal"
          />
          <QuickStartCard 
            titleEn="Practice Lab"
            titleZh="实践沙盒"
            descEn="Experiment with generative tools to create your own living geometries in a 2D/3D sandbox."
            descZh="在2D/3D交互实验室内使用生成工具，尝试创造属于你自己的生命几何图形。"
            icon={PenTool}
            onClick={() => onNavigate("practice")}
            color="amber"
          />
        </div>
      </section>

      {/* 5. Progress Indicator */}
      <ProgressIndicator />

      {/* 6. Featured Concept */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-16 flex items-baseline justify-between">
           <h2 className="text-3xl font-serif font-bold text-stone-900">
             {trans.discover.featuredConcept?.title || (language === 'en' ? "Featured Concept" : "精选概念")}
           </h2>
           <button 
             onClick={() => onNavigate("theory")}
             className="text-stone-400 hover:text-stone-900 text-xs font-medium uppercase tracking-widest flex items-center gap-2 transition-colors"
           >
             {language === 'en' ? 'View All 15 Properties' : '查看全部15个属性'} <ChevronRight className="w-3 h-3" />
           </button>
        </div>
        <FeaturedConcept onNavigate={onNavigate} />
      </section>

      {/* 7. Interactive Preview */}
      <section className="pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-16">
           <h2 className="text-3xl font-serif font-bold text-stone-900">
             {language === 'en' ? 'Interactive Preview' : '互动预览'}
           </h2>
           <p className="text-stone-500 mt-2 font-light">
             {language === 'en' ? 'Test your intuition before diving deep.' : '在深入学习具体理论之前，先通过直觉感受差异。'}
           </p>
        </div>
        <InteractivePreview />
      </section>

      {/* 8. Footer Quote (Preserved) */}
      <section className="border-t border-stone-200 bg-white py-24 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <Quote className="h-6 w-6 text-stone-300 mx-auto mb-8" />
          <p className="text-xl font-serif italic text-stone-800 leading-relaxed mb-6">
            {language === 'en' 
              ? '"We must learn to see the world not as a collection of things, but as a structure of centers."' 
              : '“我们必须学会不再将世界看作一堆事物的集合，而是将其视为一个由众多‘中心’组成的结构。”'}
          </p>
          <div className="text-xs font-bold text-stone-400 uppercase tracking-widest">
            {language === 'en' ? 'Christopher Alexander' : '克里斯托弗·亚历山大'}
          </div>
        </div>
      </section>

    </div>
  );
}