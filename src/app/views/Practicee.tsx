import React from "react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { cn, Badge } from "@/app/components/ui"; 
import { motion } from "framer-motion";
import { ArrowUpRight, Eye, Box, Sparkles, MapPin, Cpu } from "lucide-react";
import { useLanguage } from "@/app/i18n/LanguageContext";

// --- Components ---
const Section = ({ title, subTitle, children, className }: { title: string, subTitle?: string, children: React.ReactNode, className?: string }) => (
  <section className={cn("mb-32 pt-12", className)}>
    <div className="flex flex-col md:flex-row gap-4 md:gap-8 mb-16 items-baseline border-b border-stone-200 pb-8">
      <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 uppercase tracking-widest shrink-0 w-auto">{title}</h2>
      {subTitle && <h3 className="text-lg md:text-xl font-sans text-stone-500 font-light">{subTitle}</h3>}
    </div>
    {children}
  </section>
);

export function Practice() {
  const { language } = useLanguage();
  const isEn = language === 'en';

  // 课室数据列表 (使用你本地的图片路径)
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
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] text-stone-800 pb-24 pt-20">
      <div className="w-full max-w-7xl mx-auto p-8 md:p-16 pb-0">
        
        {/* 💡 专属的 Hero 头部区域 */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-stone-500 text-xs font-bold uppercase tracking-[0.2em] mb-8">
            <Cpu className="w-4 h-4" /> {isEn ? "Living Structure + AI" : "活力结构与人工智能"}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-black text-stone-900 mb-6 tracking-tight uppercase leading-tight">
            {isEn ? (
              <>PRACTICE & <br/> CAMPUS LAB</>
            ) : (
              <>实 践 与 <br/> 校 园 落 地</>
            )}
          </h1>
          
          <p className="text-lg md:text-xl text-stone-500 font-serif max-w-3xl mx-auto leading-relaxed mt-8">
            {isEn 
              ? "Translating abstract theory into physical space through generative AI. Explore how we heal the Cartesian grid within the HKUST(GZ) campus." 
              : "响应江斌教授的愿景，我们将抽象的生命结构理论，通过生成式 AI 工具转化为真实物理空间的疗愈体验。探索我们在香港科技大学（广州）校园内的实践成果。"}
          </p>
        </motion.div>

        {/* 01. 理疗所项目 */}
        <Section 
          title={isEn ? "01. The Healing Clinic" : "01. 理疗所改造项目"} 
          subTitle={isEn ? "Fostering 'Inner Calm' through Generative Art" : "注入“内在平静”的医疗空间重塑"}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-12">
            <div className="lg:col-span-4 space-y-6 mt-4">
              <Badge variant="outline" className="border-teal-500 text-teal-700 bg-teal-50 uppercase tracking-widest shadow-sm">
                {isEn ? "Completed Project" : "已落地项目"}
              </Badge>
              <h3 className="text-3xl font-serif font-bold text-stone-900">
                {isEn ? "Physiotherapy Clinic" : "校园理疗所"}
              </h3>
              <p className="text-stone-600 text-base leading-relaxed text-justify font-serif">
                {isEn 
                  ? "A campus clinic designed to foster 'Inner Calm'. We utilized AI to generate artistic representations of human muscle structures that resonate deeply with the geometric properties of life. These visuals are integrated into the clinic's environment, enhancing the psychological healing atmosphere and breaking the cold, sterile feeling of traditional medical spaces." 
                  : "一个旨在培养“内在平静”的校园理疗所。我们利用人工智能，生成了与生命几何属性深度共鸣的人体肌肉艺术画。这些视觉元素被巧妙地融入到理疗所的物理环境中，不仅打破了传统医疗空间冰冷、机械的死寂感，更在潜意识层面增强了空间的治愈氛围。"}
              </p>
              <div className="flex items-center gap-2 text-sm text-stone-400 font-mono mt-4">
                <MapPin className="w-4 h-4" /> HKUST(GZ) Campus
              </div>
            </div>

            <div className="lg:col-span-8">
              <a 
                href="https://vr.justeasy.cn/view/17xx174rk9649594-1775484431.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full aspect-[4/3] md:aspect-[16/9] bg-stone-900 rounded-3xl overflow-hidden border border-stone-200 shadow-xl hover:shadow-2xl transition-all duration-500 relative group cursor-pointer"
              >
                {/* 🖼️ 理疗所封面图 */}
                <ImageWithFallback 
                  src="/images/clinic.png" 
                  alt="Physiotherapy Clinic VR Cover"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent" />

                {/* 悬浮居中的引导按钮 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.3)] group-hover:scale-110 group-hover:bg-teal-500 transition-all duration-300">
                    <ArrowUpRight className="w-6 h-6 md:w-8 md:h-8 text-stone-900 group-hover:text-white transition-colors" />
                  </div>
                </div>

                {/* 左下角信息 */}
                <div className="absolute bottom-8 left-8 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <Badge variant="outline" className="border-white/40 text-white mb-4 backdrop-blur-md bg-black/20 uppercase tracking-widest text-xs">
                    <Eye className="w-3 h-3 mr-2 inline" /> {isEn ? "360° VR Tour" : "360° 沉浸式全景"}
                  </Badge>
                  <h5 className="text-2xl md:text-4xl font-serif font-bold text-white shadow-sm drop-shadow-md">
                    {isEn ? "Enter the Healing Clinic" : "点击进入理疗所漫游"}
                  </h5>
                </div>
              </a>
            </div>
          </div>
        </Section>

        {/* 02. 课室系列改造 */}
        <Section 
          title={isEn ? "02. Classroom Renovations" : "02. 传统课室系列改造"} 
          subTitle={isEn ? "Breaking the Cartesian Grid in Learning Spaces" : "打破笛卡尔网格，重构有机学习生态"}
        >
          <div className="mb-10 max-w-3xl">
            <p className="text-stone-600 text-base leading-relaxed font-serif">
              {isEn
                ? "Traditional classrooms are often dominated by rigid Cartesian grids—rows of desks facing a single direction, devoid of 'Strong Centers' and 'Positive Space'. By applying the 15 fundamental properties of living structure, we redesigned multiple learning spaces across the campus to foster organic interaction, turning monotonous rooms into vibrant learning organisms."
                : "传统的教室往往被死板的笛卡尔网格所支配——毫无生气的排排坐、单一的朝向，缺乏“强中心”与“正空间”。通过应用生命结构的 15 个基础属性，我们在校园内重构了多个学习空间。我们致力于促进有机的师生互动，将单调的机械空间转化为充满活力的学习生态体。"}
            </p>
          </div>

          {/* 2x2 网格布局画廊 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {classrooms.map((room) => (
              <a 
                key={room.id}
                href={room.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full aspect-[4/3] md:aspect-[16/10] bg-stone-100 rounded-3xl overflow-hidden border border-stone-200 shadow-md relative group cursor-pointer"
              >
                {/* 🖼️ 课室封面图 */}
                <ImageWithFallback 
                  src={room.img} 
                  alt={`Classroom ${room.id}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 opacity-90 group-hover:opacity-100"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent pointer-events-none transition-opacity group-hover:opacity-80" />
                
                {/* 悬浮的小箭头 */}
                <div className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-400">
                   <ArrowUpRight className="w-5 h-5 text-stone-900" />
                </div>

                {/* 底部信息 */}
                <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 text-white pointer-events-none transform translate-y-1 group-hover:translate-y-0 transition-transform duration-400">
                   <Badge variant="outline" className="border-white/40 text-white mb-3 backdrop-blur-md bg-black/30 uppercase tracking-widest text-[10px]">
                     <Box className="w-3 h-3 mr-1.5 inline" /> {isEn ? "Spatial Transformation" : "空间重构漫游"}
                   </Badge>
                   <h5 className="text-2xl md:text-3xl font-serif font-bold text-white shadow-sm drop-shadow-md">
                     {isEn ? `Living Classroom ${room.id}` : `有机课室 ${room.id}`}
                   </h5>
                </div>
              </a>
            ))}
          </div>
        </Section>
        
        {/* 底部寄语 */}
        <div className="mt-24 mb-12 text-center border-t border-stone-200 pt-16">
           <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-6" />
           <p className="text-stone-500 font-serif italic text-lg max-w-2xl mx-auto">
             {isEn 
               ? "These projects represent an ongoing commitment to exploring how objective structural beauty directly impacts our subjective sense of wholeness and well-being." 
               : "这些落地项目代表了我们持续探索的承诺：客观的结构美，究竟如何直接影响我们主观的整体感与生命福祉。"}
           </p>
        </div>

      </div>
    </div>
  );
}