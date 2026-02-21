import React, { useState } from "react";
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
  title, description, icon: Icon, onClick, color = "stone" 
}: { 
  title: string, description: string, icon: any, onClick: () => void, color?: "stone" | "teal" | "amber" 
}) => {
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
           <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">{title}</h3>
           <p className="text-stone-500 font-sans leading-relaxed text-sm">{description}</p>
        </div>
        
        <div className="relative z-10 w-full mt-8 flex items-center text-sm font-medium text-stone-900 group-hover:underline decoration-1 underline-offset-4">
          Start Now <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>

        {/* Decorative Background Icon */}
        <Icon className="absolute -bottom-4 -right-4 w-32 h-32 text-stone-50 opacity-50 group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
      </button>
    </motion.div>
  );
};

const ProgressIndicator = () => {
  // Mock progress state
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
             <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Your Progress</h4>
             <p className="text-xs text-stone-500">Mastering the 15 Properties</p>
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
             {learned} / {total} Completed
           </span>
         </div>
      </div>
    </div>
  );
};

const FeaturedConcept = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  return (
    <div className="bg-stone-900 text-stone-50 overflow-hidden relative rounded-sm">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="p-10 lg:p-16 flex flex-col justify-center relative z-10">
           <div className="mb-6 flex items-center gap-2">
             <Sparkles className="w-4 h-4 text-amber-200" />
             <span className="text-xs font-bold uppercase tracking-widest text-amber-100">Daily Concept</span>
           </div>
           
           <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Strong Centers</h2>
           
           <blockquote className="text-xl md:text-2xl font-serif italic text-stone-300 mb-8 leading-relaxed border-l-2 border-stone-700 pl-6">
             "A center is not a point, but a field of organized space that intensifies life."
           </blockquote>
           
           <p className="text-stone-400 mb-10 text-sm leading-relaxed max-w-md">
             Strong centers are the fundamental building blocks of living structure. They act as anchors that organize the surrounding space, creating hierarchy and coherence.
           </p>

           <Button 
             variant="outline"
             className="w-fit border-stone-600 text-stone-200 hover:bg-stone-800 hover:text-white hover:border-stone-500"
             onClick={() => onNavigate("theory")}
           >
             Learn More about Centers
           </Button>
        </div>

        <div className="relative h-64 lg:h-auto overflow-hidden">
           <ImageWithFallback 
             src="https://images.unsplash.com/photo-1754873313580-5d70c8fa2b29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaGUlMjBBbGhhbWJyYSUyMEdyYW5hZGElMjBpbnRyaWNhdGUlMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzcxNjQ3OTYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
             alt="Featured Concept Example"
             className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay"
           />
           <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-900/50 to-transparent lg:bg-gradient-to-l" />
        </div>
      </div>
    </div>
  );
};

const InteractivePreview = () => {
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
                 <span className="text-xs font-bold uppercase tracking-widest text-stone-600">Tap / Hover to Transform</span>
               </div>
             </div>
             <div className="absolute top-4 left-4 bg-stone-200 text-stone-500 text-[10px] font-bold uppercase tracking-widest px-2 py-1">Dead Structure</div>
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
             <div className="absolute top-4 left-4 bg-teal-600 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1">Living Structure</div>
           </motion.div>
        </div>

        {/* Text Side */}
        <div className="p-10 flex flex-col justify-center bg-stone-50">
           <h3 className="text-2xl font-serif font-bold text-stone-900 mb-4">See the Difference</h3>
           <p className="text-stone-600 mb-6 leading-relaxed">
             Modernist minimalism often results in "dead" structures lacking scale and centers. Living structures, like the Alhambra, teem with recursive detail and interconnected centers.
           </p>
           
           <div className="space-y-4">
             <div className="flex items-start gap-3">
               <div className={`p-1 rounded-full ${isHovering ? 'bg-stone-200 text-stone-400' : 'bg-red-100 text-red-600'}`}>
                 <ScanEye className="w-4 h-4" />
               </div>
               <div>
                 <h4 className={`text-sm font-bold ${isHovering ? 'text-stone-400' : 'text-stone-900'}`}>Glass Facade</h4>
                 <p className="text-xs text-stone-500">Smooth, featureless, lacks differentiation.</p>
               </div>
             </div>

             <div className="flex items-start gap-3">
               <div className={`p-1 rounded-full ${isHovering ? 'bg-teal-100 text-teal-600' : 'bg-stone-200 text-stone-400'}`}>
                 <Sparkles className="w-4 h-4" />
               </div>
               <div>
                 <h4 className={`text-sm font-bold ${isHovering ? 'text-stone-900' : 'text-stone-400'}`}>Intricate Detail</h4>
                 <p className="text-xs text-stone-500">Fractal scaling, strong centers, deep interlock.</p>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

const TheoryFounder = ({ name, role, description, image, align = "left" }: { name: string, role: string, description: string, image: string, align?: "left" | "right" }) => (
  <div className={`flex flex-col md:flex-row items-center gap-8 ${align === "right" ? "md:flex-row-reverse" : ""}`}>
    <div className="w-32 h-32 md:w-48 md:h-48 shrink-0 relative rounded-full overflow-hidden border border-stone-200 shadow-sm group">
      <ImageWithFallback src={image} alt={name} className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0" />
    </div>
    <div className={`text-center ${align === "left" ? "md:text-left" : "md:text-right"}`}>
      <h3 className="text-2xl font-serif font-bold text-stone-900 mb-1">{name}</h3>
      <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">{role}</p>
      <p className="text-stone-600 text-sm leading-relaxed max-w-lg">{description}</p>
    </div>
  </div>
);

// --- Main Page Component ---

export function Discover({ onNavigate }: DiscoverProps) {
  const { trans } = useLanguage();

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-24">
      
      {/* 1. Hero Section (Bilingual) */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center border-b border-stone-200 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block mb-6 px-3 py-1 bg-stone-100 text-stone-500 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
            Living Structure Studio
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-stone-900 tracking-tight mb-2">
            活力结构
          </h1>
          <h2 className="text-2xl md:text-3xl font-serif text-stone-400 font-light italic mb-8">
            Living Structure
          </h2>
          <p className="text-lg md:text-xl text-stone-600 font-light max-w-2xl mx-auto leading-relaxed">
            AI 视角下的中国传统建筑之美
            <br/>
            <span className="text-sm text-stone-400 mt-2 block font-sans">
              The Beauty of Traditional Chinese Architecture from an AI Perspective
            </span>
          </p>
        </motion.div>
      </section>

      {/* 2. Research Context */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mb-24">
        <div className="bg-stone-50 border border-stone-200 p-8 md:p-12 relative">
          <Quote className="absolute top-8 left-8 w-8 h-8 text-stone-200" />
          <div className="relative z-10 text-center space-y-6">
            <p className="text-lg font-serif text-stone-800 leading-relaxed">
              Based on Professor Bin Jiang's <span className="font-bold">Living Structure Theory</span> (L = S × H), this project explores the quantitative beauty of space. By integrating traditional Chinese architectural wisdom—such as the fractal complexity of Dougong brackets and the spatial harmony of courtyards—we bridge ancient aesthetics with modern complexity science.
            </p>
            <p className="text-sm text-stone-500 font-light leading-relaxed max-w-3xl mx-auto">
              本项目基于江斌教授的“生命结构理论”（L = S × H），探索空间的定量之美。通过融合中国传统建筑智慧——如斗拱的分形复杂性和庭院的空间和谐——我们将古代美学与现代复杂性科学连接起来。
            </p>
          </div>
        </div>
      </section>

      {/* 3. Theory Founders */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mb-24 space-y-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-stone-900">Theory Founders</h2>
          <p className="text-stone-400 text-sm mt-2 font-mono uppercase tracking-widest">Pioneers of Structural Wholeness</p>
        </div>
        
        <TheoryFounder 
          name="Christopher Alexander"
          role="Architect & Design Theorist"
          description="Renowned for 'A Pattern Language' and 'The Nature of Order'. He identified the 15 fundamental properties of living structures, proposing that space itself has a degree of life derived from geometric coherence."
          image="https://images.unsplash.com/photo-1630756408085-ee4db9767669?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDaHJpc3RvcGhlciUyMEFsZXhhbmRlciUyMGFyY2hpdGVjdCUyMHBvcnRyYWl0JTIwYmxhY2slMjBhbmQlMjB3aGl0ZXxlbnwxfHx8fDE3NzE2NDkyMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          align="left"
        />
        
        <div className="w-24 h-px bg-stone-200 mx-auto" />

        <TheoryFounder 
          name="Prof. Bin Jiang"
          role="Professor of Geo-Informatics"
          description="Creator of the 'Living Structure' mathematical framework (L = S × H). His work transforms Alexander's qualitative concepts into computable metrics, utilizing topological analysis and head/tail breaks to quantify structural beauty."
          image="https://images.unsplash.com/photo-1701463387028-3947648f1337?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQcm9mZXNzb3IlMjBhY2FkZW1pYyUyMHBvcnRyYWl0JTIwYXNpYW4lMjBtYWxlJTIwYmxhY2slMjBhbmQlMjB3aGl0ZXxlbnwxfHx8fDE3NzE2NDkyMzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          align="right"
        />
      </section>

      {/* 4. Quick Start Dashboard */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px bg-stone-200 flex-1" />
          <h2 className="text-xl font-serif font-bold text-stone-900 uppercase tracking-widest">Start Exploring</h2>
          <div className="h-px bg-stone-200 flex-1" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickStartCard 
            title="Learn Theory"
            description="Master the 15 fundamental properties of living structure through interactive definitions and case studies."
            icon={BookOpen}
            onClick={() => onNavigate("theory")}
            color="stone"
          />
          <QuickStartCard 
            title="Analyze"
            description="Upload your own architectural images and use AI to evaluate their structural vitality (L = S × H)."
            icon={ScanEye}
            onClick={() => onNavigate("analyze")}
            color="teal"
          />
          <QuickStartCard 
            title="Practice Lab"
            description="Experiment with generative tools to create your own living geometries in a 2D/3D sandbox."
            icon={PenTool}
            onClick={() => onNavigate("practice")}
            color="amber"
          />
        </div>
      </section>

      {/* 5. Progress Indicator */}
      <ProgressIndicator />

      {/* 6. Featured Concept */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-12 flex items-baseline justify-between">
           <h2 className="text-3xl font-serif font-bold text-stone-900">Featured Concept</h2>
           <button 
             onClick={() => onNavigate("theory")}
             className="text-stone-500 hover:text-stone-900 text-sm font-medium flex items-center gap-2 transition-colors"
           >
             View All 15 Properties <ChevronRight className="w-4 h-4" />
           </button>
        </div>
        <FeaturedConcept onNavigate={onNavigate} />
      </section>

      {/* 7. Interactive Preview */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-12">
           <h2 className="text-3xl font-serif font-bold text-stone-900">Interactive Preview</h2>
           <p className="text-stone-500 mt-2">Test your intuition before diving deep.</p>
        </div>
        <InteractivePreview />
      </section>

      {/* 8. Footer Quote (Preserved) */}
      <section className="border-t border-stone-200 bg-white py-16 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <Quote className="h-8 w-8 text-stone-300 mx-auto mb-6" />
          <p className="text-xl font-serif italic text-stone-800 leading-relaxed mb-4">
            "We must learn to see the world not as a collection of things, but as a structure of centers."
          </p>
          <div className="text-sm font-bold text-stone-400 uppercase tracking-widest">
            Christopher Alexander
          </div>
        </div>
      </section>

    </div>
  );
}
