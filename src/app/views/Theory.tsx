import React, { useState, useRef, useEffect } from "react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { cn } from "@/app/components/ui";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronDown, ArrowRight, ArrowLeft, Quote, Info, Check, X, 
  Minus, Plus, Search, MapPin, Calendar, Activity, BarChart3,
  Columns, ScanLine, Maximize, MoveHorizontal, Divide
} from "lucide-react";
import langjialiImage from "figma:asset/f7e3018aad1493cfe769b1faa78355dd3d38d0e1.png";

// --- Data ---

const genericNegative = "https://images.unsplash.com/photo-1572533541497-ed8f48f2e7e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm5pc3QlMjBnbGFzcyUyMGN1cnRhaW4lMjB3YWxsJTIwc2t5c2NyYXBlciUyMGRldGFpbHxlbnwxfHx8fDE3NzE2NDk5NTF8MA&ixlib=rb-4.1.0&q=80&w=1080";

const properties = [
    {
      n: 1, tEn: "Levels of Scale", tZh: "尺度层级",
      quoteEn: "Living structure contains distinguishable levels of scale organized hierarchically.",
      quoteZh: "活力结构包含可区分的尺度层级，并形成递归等级体系。",
      mechEn: "Smaller centers are far more numerous than large ones, forming depth (H).",
      mechZh: "小尺度中心数量远多于大尺度中心，形成层级深度 H。",
      relEn: "Primarily increases H (Hierarchy) by establishing depth.",
      relZh: "通过建立深度主要增加 H（层级）。",
      imgPos: "https://ibb.co/pvYrDTcg",
      imgNeg: "https://images.unsplash.com/photo-1763475775795-c0bd560aaeae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwd2hpdGUlMjBjb25jcmV0ZSUyMHdhbGwlMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzcxNjQ5OTUwfDA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      n: 2, tEn: "Strong Centers", tZh: "强中心",
      quoteEn: "A center is a region of intensified coherence supported by surrounding centers.",
      quoteZh: "中心是由周围结构支撑而强化的区域。",
      mechEn: "Strength depends on relational density (S).",
      mechZh: "强度取决于关系密度 S。",
      relEn: "Primarily increases S (Strength) by intensifying focus.",
      relZh: "通过强化焦点主要增加 S（强度）。",
      imgPos: "https://images.unsplash.com/photo-1610650394144-a778795cf585"
    },
    {
      n: 3, tEn: "Boundaries", tZh: "边界",
      quoteEn: "Boundaries create transitional layers that strengthen centers.",
      quoteZh: "边界通过过渡层强化中心。",
      mechEn: "Layered edges stabilize spatial continuity.",
      mechZh: "层级边界增强空间连续性。",
      relEn: "Increases S (Strength) by containing energy.",
      relZh: "通过包含能量增加 S（强度）。",
      imgPos: "https://images.unsplash.com/photo-1770261402245-36f19477f758"
    },
    {
      n: 4, tEn: "Alternating Repetition", tZh: "交替重复",
      quoteEn: "Simple repetition is mechanical and lifeless. Living repetition is alternating.",
      quoteZh: "简单的重复是机械且无生命的。有生命的重复是交替的。",
      mechEn: "The mechanism relies on binary or complex rhythm. Instead of A-A-A-A, the structure uses A-B-A-B.",
      mechZh: "该机制依赖于二元或复杂的节奏。结构不是 A-A-A-A，而是使用 A-B-A-B。",
      relEn: "Increases H (Hierarchy) through rhythmic complexity.",
      relZh: "通过节奏复杂性增加 H（层级）。",
      imgPos: "https://images.unsplash.com/photo-1635305587346-6b2d68f3565b"
    },
    {
      n: 5, tEn: "Positive Space", tZh: "正空间",
      quoteEn: "Space is not merely the residue between objects but a distinct entity.",
      quoteZh: "空间不仅仅是物体之间的残留物，而是一个独立的实体。",
      mechEn: "The mechanism for creating positive space is enclosure and convexity.",
      mechZh: "创造正空间的机制是围合和凸性。",
      relEn: "Increases S (Strength) by shaping the void.",
      relZh: "通过塑造虚空增加 S（强度）。",
      imgPos: "https://images.unsplash.com/photo-1598838665060-9a59c9b6683d"
    },
    {
      n: 6, tEn: "Good Shape", tZh: "良形",
      quoteEn: "Every element in a living structure should have a 'good shape'—simple and coherent.",
      quoteZh: "生命结构中的每个元素都应该有一个“良形”——简单且连贯。",
      mechEn: "Mechanism implies compactness and elementary geometry (squares, circles).",
      mechZh: "机制意味着紧凑性和基本几何（正方形、圆形）。",
      relEn: "Increases S (Strength) through geometric coherence.",
      relZh: "通过几何连贯性增加 S（强度）。",
      imgPos: "https://images.unsplash.com/photo-1758543710327-89e7674894f2"
    },
    {
      n: 7, tEn: "Local Symmetries", tZh: "局部对称",
      quoteEn: "Small parts of the structure should be symmetrical within themselves.",
      quoteZh: "结构的微小部分在自身内部应对称。",
      mechEn: "The mechanism is the creation of 'sub-centers' through reflection.",
      mechZh: "该机制是通过反射创建“子中心”。",
      relEn: "Increases S (Strength) by binding centers locally.",
      relZh: "通过局部结合中心增加 S（强度）。",
      imgPos: "https://images.unsplash.com/photo-1758543710327-89e7674894f2"
    },
    {
      n: 8, tEn: "Deep Interlock", tZh: "深度嵌合",
      quoteEn: "Elements should not simply sit next to each other; they should interlock.",
      quoteZh: "元素不应仅仅彼此相邻；它们应该嵌合。",
      mechEn: "The mechanism uses 'ambiguity of belonging' where material A penetrates material B.",
      mechZh: "该机制利用“归属的模糊性”，即材料 A 穿透材料 B。",
      relEn: "Increases S (Strength) by fusing adjacent centers.",
      relZh: "通过融合相邻中心增加 S（强度）。",
      imgPos: "https://images.unsplash.com/photo-1590150392241-a4f05ecdaa3e"
    },
    {
      n: 9, tEn: "Contrast", tZh: "对比",
      quoteEn: "Life requires difference. Distinct parts should be visibly different in character.",
      quoteZh: "生命需要差异。独特部分在特征上应明显不同。",
      mechEn: "The mechanism is the unification of opposites, enhancing both qualities.",
      mechZh: "机制是对立面的统一，增强了两种特质。",
      relEn: "Increases S (Strength) by clarifying distinction.",
      relZh: "通过阐明区别增加 S（强度）。",
      imgPos: "https://images.unsplash.com/photo-1719985968746-20cfb5634cc9"
    },
    {
      n: 10, tEn: "Gradients", tZh: "渐变",
      quoteEn: "A quality should slowly change across space to soften harshness.",
      quoteZh: "一种特质应该在空间中缓慢变化以柔化严酷。",
      mechEn: "The mechanism is the serialized progression of properties (A1, A2, A3...).",
      mechZh: "机制是属性的序列化推进（A1, A2, A3...）。",
      relEn: "Increases H (Hierarchy) by connecting scales.",
      relZh: "通过连接尺度增加 H（层级）。",
      imgPos: "https://images.unsplash.com/photo-1770261402245-36f19477f758"
    },
    {
      n: 11, tEn: "Roughness", tZh: "粗糙性",
      quoteEn: "True order is not perfect; it is rough and adaptive to local conditions.",
      quoteZh: "真正的秩序不是完美的；它是粗糙的且适应局部条件。",
      mechEn: "The mechanism is local relaxation of the grid to minimize tension.",
      mechZh: "机制是网格的局部松弛以最小化张力。",
      relEn: "Increases S (Strength) by adapting to reality.",
      relZh: "通过适应现实增加 S（强度）。",
      imgPos: "https://images.unsplash.com/photo-1590150392241-a4f05ecdaa3e"
    },
    {
      n: 12, tEn: "Echoes", tZh: "呼应",
      quoteEn: "The same structural logic appears at different scales throughout the design.",
      quoteZh: "相同结构逻辑出现在设计的不同尺度中。",
      mechEn: "The mechanism is the use of a 'generative seed' or fractal DNA recursively.",
      mechZh: "机制是递归使用“生成种子”或分形 DNA。",
      relEn: "Increases H (Hierarchy) through self-similarity.",
      relZh: "通过自相似性增加 H（层级）。",
      imgPos: "https://images.unsplash.com/photo-1758543710327-89e7674894f2"
    },
    {
      n: 13, tEn: "The Void", tZh: "空性",
      quoteEn: "In the most intense centers, there is often a moment of pure silence.",
      quoteZh: "在最强烈的中心里，通常有一刻纯粹的寂静。",
      mechEn: "The mechanism is the deliberate preservation of an empty center bounded by structure.",
      mechZh: "机制是特意保留一个由结构包围的空中心。",
      relEn: "Increases S (Strength) by creating a calm center.",
      relZh: "通过创造平静中心增加 S（强度）。",
      imgPos: "https://images.unsplash.com/photo-1598838665060-9a59c9b6683d"
    },
    {
      n: 14, tEn: "Simplicity and Inner Calm", tZh: "简洁与宁静",
      quoteEn: "The form feels calm because everything is exactly where it needs to be.",
      quoteZh: "形式感觉平静，因为一切都在它应该在的地方。",
      mechEn: "The mechanism is the removal of structural noise (Occam's Razor).",
      mechZh: "机制是消除结构噪音（奥卡姆剃刀）。",
      relEn: "Increases S (Strength) by removing friction.",
      relZh: "通过消除摩擦增加 S（强度）。",
      imgPos: "https://images.unsplash.com/photo-1610650394144-a778795cf585"
    },
    {
      n: 15, tEn: "Not-Separateness", tZh: "不可分离性",
      quoteEn: "A living structure is not separate from its surroundings; it grows out of them.",
      quoteZh: "生命结构与其周围环境不是分离的；它是从中生长出来的。",
      mechEn: "The mechanism is the blurring of the outer boundary through interpenetration.",
      mechZh: "机制是通过相互渗透模糊外边界。",
      relEn: "Increases H (Hierarchy) by connecting to the largest whole.",
      relZh: "通过连接到最大整体增加 H（层级）。",
      imgPos: "https://images.unsplash.com/photo-1758543710327-89e7674894f2"
    }
];

const timeline = [
    { year: "1977", author: "C. Alexander", work: "A Pattern Language", desc: "Identified 253 patterns that solve common architectural problems.", descZh: "确定了解决常见建筑问题的 253 种模式。" },
    { year: "2002", author: "C. Alexander", work: "The Nature of Order", desc: "Proposed the 15 Properties and the concept of 'Living Structure'.", descZh: "提出了 15 个属性和“生命结构”的概念。" },
    { year: "2015", author: "Bin Jiang", work: "Wholeness as a Hierarchical Graph", desc: "Mathematical formulation of beauty using Jiang's Index (H-Index variant).", descZh: "使用 Jiang 指数（H 指数变体）的美学数学公式。" },
    { year: "2019", author: "Bin Jiang", work: "Living Structure", desc: "L = S × H: The fundamental equation of structural life.", descZh: "L = S × H：结构生命的基本方程。" }
];

interface CaseStudy {
  id: string;
  name: string;
  nameZh: string;
  dynasty: string;
  dynastyZh: string;
  location: string;
  locationZh: string;
  lValue: number;
  bValue: string;
  description: string;
  descriptionZh: string;
  imageUrl: string; // Real photo
  diagramUrl: string; // Line drawing
  elevationUrl: string; // Elevation analysis
  levels: number[];
}

const cases: CaseStudy[] = [
  {
    id: "langjiali",
    name: "Langjiali Folk House",
    nameZh: "郎家里江南民居",
    dynasty: "Ming & Qing",
    dynastyZh: "明清时期",
    location: "Linhai, Zhejiang",
    locationZh: "浙江临海",
    lValue: 22038,
    bValue: "6 / 15",
    description: "Jiangnan folk houses are a vital component of traditional Chinese residential architecture. Characterized by facing south for sunlight, using wooden beams for load-bearing, and stone/earth for protection.",
    descriptionZh: "江南民居是中国传统民居建筑的重要组成部分，江浙水乡注重前街后河，但无论南方还是北方的中国人，其传统民居的共同特点都是坐北朝南，注重内采光；以木梁承重，以砖、石、土砌护墙。",
    imageUrl: "https://images.unsplash.com/photo-1742078009189-3607025a854c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGNoaW5lc2UlMjB3b29kZW4lMjBhcmNoaXRlY3R1cmUlMjBkZXRhaWwlMjBtYWNyb3xlbnwxfHx8fDE3NzE2NDkyMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    diagramUrl: langjialiImage, // Use the provided asset as the 'diagram'
    elevationUrl: "https://images.unsplash.com/photo-1754873313580-5d70c8fa2b29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaGUlMjBBbGhhbWJyYSUyMEdyYW5hZGElMjBpbnRyaWNhdGUlMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzcxNjQ3OTYzfDA&ixlib=rb-4.1.0&q=80&w=1080", // Placeholder for elevation
    levels: [4, 10, 36, 123, 533, 2967]
  },
  {
    id: "forbidden_city",
    name: "Hall of Supreme Harmony",
    nameZh: "太和殿",
    dynasty: "Ming Dynasty",
    dynastyZh: "明朝",
    location: "Beijing",
    locationZh: "北京故宫",
    lValue: 45210,
    bValue: "12 / 15",
    description: "The largest hall in the Forbidden City, exemplifying imperial power through strict symmetry, massive scale, and intricate Dougong bracket sets. It represents the peak of official structural hierarchy.",
    descriptionZh: "故宫中最大的殿宇，通过严格的对称性、巨大的尺度和复杂的斗拱结构体现皇权。它代表了官方结构等级制度的巅峰。",
    imageUrl: "https://images.unsplash.com/photo-1740390364580-bfc152f2499d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxGb3JiaWRkZW4lMjBDaXR5JTIwQmVpamluZyUyMGFlcmlhbCUyMHZpZXclMjBzeW1tZXRyeSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NzE2NDk2MTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    diagramUrl: "https://images.unsplash.com/photo-1599571342676-47b297800067?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxGb3JiaWRkZW4lMjBDaXR5JTIwcm9vZiUyMGRldGFpbCUyMGdvbGRlbnxlbnwxfHx8fDE3NzE2NDk2MTl8MA&ixlib=rb-4.1.0&q=80&w=1080", // Placeholder
    elevationUrl: "https://images.unsplash.com/photo-1546261547-49f3e4c4c77c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxGb3JiaWRkZW4lMjBDaXR5JTIwZmFjYWRlfGVufDF8fHx8MTc3MTY0OTYxOXww&ixlib=rb-4.1.0&q=80&w=1080", // Placeholder
    levels: [2, 12, 48, 192, 864, 4200]
  },
  {
    id: "suzhou_garden",
    name: "Humble Administrator's Garden",
    nameZh: "拙政园",
    dynasty: "Ming Dynasty",
    dynastyZh: "明朝",
    location: "Suzhou, Jiangsu",
    locationZh: "江苏苏州",
    lValue: 18500,
    bValue: "9 / 15",
    description: "A masterpiece of Chinese landscape garden design. Unlike the strict symmetry of imperial palaces, it emphasizes 'Roughness' and 'Echoes' through natural forms, water, and rockeries.",
    descriptionZh: "中国园林设计的杰作。与皇宫严格的对称性不同，它通过自然形态、水体和假山强调“粗糙性”和“呼应”。",
    imageUrl: "https://images.unsplash.com/photo-1722097993455-eb9c949270d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDaGluZXNlJTIwdHJhZGl0aW9uYWwlMjBnYXJkZW4lMjBTdXpob3UlMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzcxNjQ5NjE5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    diagramUrl: "https://images.unsplash.com/photo-1523528206898-1e43c5101037?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXpob3UlMjBnYXJkZW4lMjBkZXRhaWx8ZW58MXx8fHwxNzcxNjQ5NjE5fDA&ixlib=rb-4.1.0&q=80&w=1080", // Placeholder
    elevationUrl: "https://images.unsplash.com/photo-1512805177439-012b18f15d73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXpob3UlMjBnYXJkZW4lMjB3aW5kb3d8ZW58MXx8fHwxNzcxNjQ5NjE5fDA&ixlib=rb-4.1.0&q=80&w=1080", // Placeholder
    levels: [6, 24, 88, 300, 1100, 3500]
  }
];

// --- Components ---

const BilingualParagraph = ({ label, en, zh, className }: { label?: string, en: string, zh: string, className?: string }) => (
  <div className={cn("mb-8 last:mb-0", className)}>
    {label && <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 mb-3 border-b border-stone-100 pb-2 inline-block">{label}</h4>}
    <div className="block w-full">
      <p className="text-base leading-7 text-stone-800 font-serif mb-3 text-justify block">{en}</p>
      <p className="text-sm leading-6 text-stone-500 font-sans font-light text-justify block">{zh}</p>
    </div>
  </div>
);

const Section = ({ title, subTitle, children, className }: { title: string, subTitle: string, children: React.ReactNode, className?: string }) => (
  <section className={cn("mb-24 pt-16 border-t border-stone-200", className)}>
    <div className="flex flex-col md:flex-row gap-4 md:gap-8 mb-12 items-baseline">
      <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 uppercase tracking-widest shrink-0 w-auto md:w-64">{title}</h2>
      <h3 className="text-lg md:text-xl font-sans text-stone-400 font-light">{subTitle}</h3>
    </div>
    {children}
  </section>
);

const PropertyVisuals = ({ imgPos, imgNeg, title }: { imgPos: string, imgNeg?: string, title: string }) => {
  const [viewMode, setViewMode] = useState<'split' | 'compare' | 'strong' | 'weak'>('split');
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const finalImgNeg = imgNeg || genericNegative;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (viewMode !== 'compare') return;
    
    // Type assertion to handle both MouseEvent and TouchEvent
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      setSliderPos((x / rect.width) * 100);
    }
  };

  return (
    <div className="w-full">
      {/* Toolbar */}
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

      {/* Content Area */}
      <div 
        ref={containerRef}
        className={cn(
          "w-full aspect-[4/3] md:aspect-[2/1] bg-stone-100 rounded-sm relative overflow-hidden border border-stone-200 select-none",
          viewMode === 'compare' ? "cursor-ew-resize touch-none" : ""
        )}
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
      >
        
        {/* Render Logic based on Mode */}

        {/* 1. Split Mode (Default) */}
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

        {/* 2. Strong Only */}
        {viewMode === 'strong' && (
          <div className="w-full h-full relative">
             <div className="absolute top-4 left-4 bg-stone-900 text-white text-[10px] px-3 py-1.5 uppercase tracking-widest font-bold z-10 flex items-center gap-2 shadow-sm">
                 <Check className="w-3 h-3" /> Strong Structure
             </div>
             <ImageWithFallback src={imgPos} alt="Strong" className="w-full h-full object-cover" />
          </div>
        )}

        {/* 3. Weak Only */}
        {viewMode === 'weak' && (
          <div className="w-full h-full relative grayscale">
             <div className="absolute top-4 left-4 bg-stone-200 text-stone-600 text-[10px] px-3 py-1.5 uppercase tracking-widest font-bold z-10 flex items-center gap-2 shadow-sm border border-stone-300">
                 <X className="w-3 h-3" /> Weak Structure
             </div>
             <ImageWithFallback src={finalImgNeg} alt="Weak" className="w-full h-full object-cover opacity-80" />
          </div>
        )}

        {/* 4. Compare Slider */}
        {viewMode === 'compare' && (
          <div className="w-full h-full relative group">
             {/* Bottom Layer (Weak) - Full Width */}
             <div className="absolute inset-0 grayscale opacity-90">
                <ImageWithFallback src={finalImgNeg} alt="Weak" className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-stone-200/90 text-stone-600 text-[10px] px-2 py-1 uppercase tracking-widest font-bold z-10 flex items-center gap-1 backdrop-blur-sm pointer-events-none">
                   <X className="w-3 h-3" /> Weak
                </div>
             </div>

             {/* Top Layer (Strong) - Clipped */}
             <div 
               className="absolute inset-0 overflow-hidden"
               style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
             >
                <ImageWithFallback src={imgPos} alt="Strong" className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-stone-900/90 text-white text-[10px] px-2 py-1 uppercase tracking-widest font-bold z-10 flex items-center gap-1 backdrop-blur-sm pointer-events-none">
                   <Check className="w-3 h-3" /> Strong
                </div>
             </div>

             {/* Slider Handle */}
             <div 
               className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_15px_rgba(0,0,0,0.3)] z-20 pointer-events-none"
               style={{ left: `${sliderPos}%` }}
             >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center border border-stone-200 text-stone-600">
                   <MoveHorizontal className="w-4 h-4" />
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

const PropertyBlock = ({ 
  number, titleEn, titleZh, 
  quoteEn, quoteZh,
  mechEn, mechZh, 
  relEn, relZh,
  imgPos, imgNeg,
  isOpen,
  onToggle
}: any) => {

  return (
    <div className="border-t border-stone-100 py-6 first:border-t-2 first:border-stone-900 transition-all duration-300 hover:bg-stone-50/50 px-2 -mx-2 rounded-sm">
      {/* Header - Clickable for Toggle */}
      <div 
        onClick={onToggle}
        className="cursor-pointer group grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline"
      >
        {/* Number */}
        <div className="col-span-1 md:col-span-1 flex items-center gap-4 md:block">
           <span className={cn(
            "text-xl md:text-2xl font-mono transition-colors duration-300",
            isOpen ? "text-stone-900 font-medium" : "text-stone-300 group-hover:text-stone-400"
          )}>
            {number < 10 ? `0${number}` : number}
          </span>
        </div>

        {/* Titles */}
        <div className="col-span-1 md:col-span-4">
          <h3 className="text-xl md:text-2xl font-serif font-bold text-stone-900 mb-1 group-hover:text-stone-600 transition-colors">{titleEn}</h3>
          <h4 className="text-sm text-stone-400 font-sans">{titleZh}</h4>
        </div>

        {/* Short Quotation (Collapsed View) */}
        <div className="col-span-1 md:col-span-6 pr-8 hidden md:block">
           {!isOpen && (
             <motion.p 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               className="text-sm text-stone-500 font-serif italic leading-relaxed truncate"
             >
               "{quoteEn}"
             </motion.p>
           )}
        </div>
        
        {/* Toggle Icon */}
        <div className="col-span-1 md:col-span-1 flex justify-end">
           <ChevronDown className={cn(
             "w-5 h-5 text-stone-300 transition-transform duration-300",
             isOpen ? "rotate-180 text-stone-900" : "group-hover:text-stone-500"
           )} />
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-8 pb-4 grid grid-cols-1 md:grid-cols-12 gap-12">
               
               {/* Left Column: Structural Logic */}
               <div className="col-span-1 md:col-span-5 md:col-start-2 space-y-8">
                  <div className="relative pl-6 border-l-2 border-stone-200">
                    <Quote className="absolute -top-2 -left-3 w-6 h-6 bg-[#FDFBF7] text-stone-300" />
                    <p className="text-lg font-serif italic text-stone-800 mb-2">"{quoteEn}"</p>
                    <p className="text-sm font-light text-stone-500">"{quoteZh}"</p>
                  </div>

                  <BilingualParagraph 
                    label="Structural Mechanism / 结构机制" 
                    en={mechEn} 
                    zh={mechZh} 
                  />
                  
                  <div className="bg-white p-6 border border-stone-200 shadow-sm rounded-sm">
                     <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 mb-3 flex items-center gap-2">
                       <Info className="w-3 h-3" /> Relation to L = S × H
                     </h4>
                     <p className="text-sm font-medium text-stone-800 font-serif mb-1">{relEn}</p>
                     <p className="text-xs text-stone-500">{relZh}</p>
                  </div>
               </div>

               {/* Right Column: Visual Comparison (Enhanced) */}
               <div className="col-span-1 md:col-span-6 space-y-6">
                  <PropertyVisuals 
                    imgPos={imgPos} 
                    imgNeg={imgNeg} 
                    title={titleEn} 
                  />
               </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ConceptFramework = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div className="order-2 md:order-1 relative aspect-square md:aspect-auto h-64 md:h-96 bg-stone-100 border border-stone-200 rounded-full flex items-center justify-center overflow-hidden">
        {/* Abstract Visualization of Centers */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="relative w-full h-full"
        >
           {/* Recursive Circles */}
           {[...Array(6)].map((_, i) => (
             <div 
               key={i}
               className="absolute top-1/2 left-1/2 rounded-full border border-stone-800/20"
               style={{
                 width: `${(i + 1) * 15}%`,
                 height: `${(i + 1) * 15}%`,
                 transform: 'translate(-50%, -50%)',
               }}
             />
           ))}
           {/* Off-center circles for 'Strong Centers' feel */}
           {[...Array(4)].map((_, i) => (
             <div 
                key={`orb-${i}`}
                className="absolute rounded-full bg-stone-800/5 mix-blend-multiply backdrop-blur-sm"
                style={{
                  width: '30%',
                  height: '30%',
                  top: `${20 + i * 15}%`,
                  left: `${20 + (i % 2) * 40}%`,
                }}
             />
           ))}
        </motion.div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="bg-white/80 backdrop-blur-md px-6 py-4 rounded-sm border border-stone-200 shadow-sm text-center">
            <h4 className="font-serif text-xl font-bold text-stone-900">WHOLENESS</h4>
            <p className="font-mono text-xs text-stone-500 mt-1">L = S × H</p>
          </div>
        </div>
      </div>
      
      <div className="order-1 md:order-2 space-y-6">
        <ul className="space-y-6">
          {[
            { label: "Centers", labelZh: "中心", desc: "A specific region of coherence.", zh: "一致性的特定区域。" },
            { label: "Scale", labelZh: "尺度", desc: "The distinguishable hierarchy of sizes.", zh: "可区分的尺度层级。" },
            { label: "Hierarchy", labelZh: "层级", desc: "The recursive organization of strong centers.", zh: "强中心的递归组织。" },
            { label: "Coherence", labelZh: "连贯", desc: "The glue that binds the structure into a whole.", zh: "将结构结合为整体的粘合剂。" }
          ].map((item, idx) => (
            <li key={idx} className="flex flex-col gap-1 border-b border-stone-100 pb-4 last:border-0">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold font-serif text-stone-900">{item.label}</span>
                <span className="text-sm font-mono text-stone-400">{item.labelZh}</span>
              </div>
              <p className="text-sm text-stone-600">{item.desc}</p>
              <p className="text-xs text-stone-400 font-light">{item.zh}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// --- New Modules ---

const TheoreticalOrigin = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
      <div className="md:col-span-4">
        <h3 className="text-2xl font-serif font-bold text-stone-900 mb-6">Evolution of Thought</h3>
        <p className="text-stone-600 text-sm leading-relaxed mb-4 text-justify">
          The theory of Living Structure is not an isolated invention but a culmination of decades of research into the mathematical nature of beauty and space. It transitions from qualitative pattern recognition to quantitative structural analysis.
        </p>
        <p className="text-stone-400 text-xs leading-relaxed text-justify">
          生命结构理论并非孤立的发明，而是对美与空间数学本质数十年研究的结晶。它从定性的模式识别转变为定量的结构分析。
        </p>
      </div>
      <div className="md:col-span-8 relative">
        <div className="absolute left-4 md:left-[8.5rem] top-2 bottom-2 w-px bg-stone-200" />
        <div className="space-y-8">
          {timeline.map((item, i) => (
            <div key={i} className="flex flex-col md:flex-row gap-4 md:gap-8 relative">
              <div className="md:w-32 shrink-0 flex items-center md:justify-end gap-4">
                 <div className="w-2 h-2 rounded-full bg-stone-900 absolute left-[0.8rem] md:left-auto md:right-[-4px] ring-4 ring-white" />
                 <span className="font-mono font-bold text-stone-900 text-lg md:text-right pl-8 md:pl-0">{item.year}</span>
              </div>
              <div className="pl-8 md:pl-0">
                 <h4 className="font-serif font-bold text-stone-800">{item.work}</h4>
                 <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">{item.author}</div>
                 <p className="text-sm text-stone-600 mb-1">{item.desc}</p>
                 <p className="text-xs text-stone-400 font-light">{item.descZh}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ChineseArchitecturalSystem = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  const selectedCase = cases.find(c => c.id === selectedCaseId);

  // Gallery View
  if (!selectedCase) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cases.map((c) => (
          <div 
            key={c.id}
            onClick={() => setSelectedCaseId(c.id)}
            className="group cursor-pointer bg-white border border-stone-200 hover:border-stone-400 transition-all duration-300 rounded-sm overflow-hidden"
          >
            {/* Card Image Area */}
            <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
               <ImageWithFallback 
                 src={c.imageUrl}
                 alt={c.name}
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
               />
               <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 transition-colors" />
            </div>

            {/* Card Content */}
            <div className="p-6">
               <div className="mb-4">
                  <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-stone-700 transition-colors mb-1">{c.name}</h3>
                  <p className="text-xs text-stone-400 font-mono">{c.nameZh}</p>
               </div>
               
               <div className="flex flex-wrap gap-4 text-xs font-mono text-stone-500 mb-6">
                 <div className="flex items-center gap-1">
                   <Calendar className="w-3 h-3" /> {c.dynasty}
                 </div>
                 <div className="flex items-center gap-1">
                   <MapPin className="w-3 h-3" /> {c.location}
                 </div>
               </div>

               <div className="flex justify-between items-center border-t border-stone-100 pt-4">
                  <div className="flex flex-col">
                     <span className="text-[9px] uppercase tracking-widest text-stone-400">Vitality (L)</span>
                     <span className="font-mono font-bold text-stone-900">{c.lValue.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col text-right">
                     <span className="text-[9px] uppercase tracking-widest text-stone-400">Beauty (B)</span>
                     <span className="font-mono font-bold text-stone-900">{c.bValue}</span>
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Detail View
  return (
    <div className="bg-white border border-stone-200 rounded-sm shadow-sm">
      {/* Header */}
      <div className="border-b border-stone-100 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-stone-50/50">
         <div className="flex items-start gap-4">
            <button 
              onClick={() => setSelectedCaseId(null)}
              className="mt-1 p-2 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-stone-600" />
            </button>
            <div>
               <h2 className="text-3xl font-serif font-bold text-stone-900">{selectedCase.name}</h2>
               <p className="text-stone-500 font-mono text-sm">{selectedCase.nameZh}</p>
            </div>
         </div>
         <div className="flex gap-8 text-xs font-mono text-stone-600">
             <div className="text-right">
               <div className="text-stone-400 uppercase tracking-widest mb-1">Time</div>
               <div className="font-bold">{selectedCase.dynasty}</div>
             </div>
             <div className="text-right">
               <div className="text-stone-400 uppercase tracking-widest mb-1">Location</div>
               <div className="font-bold">{selectedCase.location}</div>
             </div>
         </div>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Analysis Text & Data */}
        <div className="lg:col-span-4 space-y-8">
           <BilingualParagraph 
             label="Architectural Analysis"
             en={selectedCase.description}
             zh={selectedCase.descriptionZh}
           />
           
           <div className="bg-stone-50 border border-stone-200 p-6">
              <div className="mb-4">
                 <div className="flex items-center gap-2 text-stone-400 uppercase tracking-wider text-[10px] mb-2">
                   <Activity className="w-3 h-3" /> Vitality Calculation
                 </div>
                 <div className="font-mono text-xl font-bold text-stone-900 break-words mb-1">
                   L = ∑ (S × H) × N
                 </div>
                 <div className="font-mono text-sm text-stone-600">
                   = ({selectedCase.levels.join(" + ")}) × 6
                 </div>
                 <div className="font-mono text-2xl font-bold text-amber-600 mt-2">
                   = {selectedCase.lValue.toLocaleString()}
                 </div>
              </div>
           </div>

           {/* Levels Breakdown */}
           <div>
              <div className="flex items-center gap-2 text-stone-400 uppercase tracking-wider text-[10px] mb-4">
                 <BarChart3 className="w-3 h-3" /> Hierarchy Levels Breakdown
              </div>
              <div className="space-y-2">
                 {selectedCase.levels.map((level, i) => (
                   <div key={i} className="flex items-center gap-2 text-xs">
                      <span className="w-4 h-4 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center font-mono text-[9px]">{i + 1}</span>
                      <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                        <div className="h-full bg-stone-400" style={{ width: `${(level / Math.max(...selectedCase.levels)) * 100}%` }} />
                      </div>
                      <span className="font-mono text-stone-500 w-12 text-right">{level}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Right Column: Visual Analysis System */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
           
           {/* 1. Structural Line Drawing (Clean) */}
           <div className="md:col-span-2 bg-white border border-stone-100 p-1 rounded-sm shadow-sm group">
              <div className="relative aspect-[16/9] overflow-hidden bg-stone-50 flex items-center justify-center">
                 <ImageWithFallback 
                   src={selectedCase.diagramUrl}
                   alt="Structural Diagram"
                   className="w-full h-full object-contain mix-blend-multiply opacity-80 group-hover:scale-105 transition-transform duration-700"
                 />
                 <div className="absolute top-2 left-2 px-2 py-1 bg-white/80 backdrop-blur border border-stone-200 text-[9px] uppercase tracking-widest text-stone-500 font-bold">
                   Structural Diagram / 结构线图
                 </div>
              </div>
           </div>

           {/* 2. Real Photo */}
           <div className="bg-white border border-stone-100 p-1 rounded-sm shadow-sm group">
              <div className="relative aspect-[4/3] overflow-hidden">
                 <ImageWithFallback 
                   src={selectedCase.imageUrl}
                   alt="Real View"
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                 />
                 <div className="absolute top-2 left-2 px-2 py-1 bg-white/80 backdrop-blur border border-stone-200 text-[9px] uppercase tracking-widest text-stone-500 font-bold">
                   Real Scene / 实景
                 </div>
              </div>
           </div>

           {/* 3. Elevation Analysis */}
           <div className="bg-white border border-stone-100 p-1 rounded-sm shadow-sm group">
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-50">
                 <ImageWithFallback 
                   src={selectedCase.elevationUrl}
                   alt="Elevation Analysis"
                   className="w-full h-full object-cover opacity-90 grayscale contrast-125 group-hover:scale-105 transition-transform duration-700"
                 />
                 <div className="absolute top-2 left-2 px-2 py-1 bg-white/80 backdrop-blur border border-stone-200 text-[9px] uppercase tracking-widest text-stone-500 font-bold">
                   Elevation / 立面分析
                 </div>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
};


// --- Main Page Component ---

export function Theory() {
  const [openId, setOpenId] = useState<number | null>(null);
  
  const toggleProperty = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] text-stone-800">
      
      {/* 1. Header Section */}
      <div className="w-full max-w-7xl mx-auto p-8 md:p-16 pb-0">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="border-b border-stone-900 pb-8">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-stone-900 mb-4 tracking-tight">THEORY OF<br/>LIVING STRUCTURE</h1>
            <p className="text-stone-500 font-mono uppercase tracking-widest text-xs">Vitality in Geometry & Architecture</p>
          </div>
        </motion.div>

        {/* 2. Theoretical Origin */}
        <Section title="Origins" subTitle="The Lineage of Life">
          <TheoreticalOrigin />
        </Section>

        {/* 3. Concept Framework */}
        <Section title="Framework" subTitle="The Anatomy of Wholeness">
          <ConceptFramework />
        </Section>

        {/* 4. 15 Properties */}
        <Section title="15 Properties" subTitle="The Geometric Structure of Life">
          <div className="border-b border-stone-200">
             {properties.map((p) => (
               <PropertyBlock 
                 key={p.n}
                 number={p.n}
                 titleEn={p.tEn}
                 titleZh={p.tZh}
                 quoteEn={p.quoteEn}
                 quoteZh={p.quoteZh}
                 mechEn={p.mechEn}
                 mechZh={p.mechZh}
                 relEn={p.relEn}
                 relZh={p.relZh}
                 imgPos={p.imgPos}
                 imgNeg={p.imgNeg}
                 isOpen={openId === p.n}
                 onToggle={() => toggleProperty(p.n)}
               />
             ))}
          </div>
        </Section>
      </div>

      {/* 5. Chinese Architectural System (Updated Module) */}
      <div className="bg-stone-100 py-24 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-stone-900 uppercase tracking-widest">Chinese System</h2>
            <h3 className="text-xl font-sans text-stone-400 font-light mt-2">Verification & Application</h3>
          </div>
          
          <ChineseArchitecturalSystem />
          
        </div>
      </div>

    </div>
  );
}
