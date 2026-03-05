import React, { useState } from "react";
import { Card, cn } from "@/app/components/ui";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/app/i18n/LanguageContext";

// 定义图片路径数组，对应 7 个层级
const STAGE_IMAGES = [
  "/stages/stage1.png",
  "/stages/stage2.png",
  "/stages/stage3.png",
  "/stages/stage4.png",
  "/stages/stage5.png",
  "/stages/stage6.png",
  "/stages/stage7.png", // 教授书中的最终改良方案
];

export function Construct() {
  const { trans, language } = useLanguage();
  const isEn = language === 'en';

  const [hierarchy, setHierarchy] = useState(1);

  // ============================================================================
  // 📐 绝对严谨的数学模型：
  // Ln = (S1 + S2 + ... + Sn) * Hn
  // ============================================================================
  const S_SEQUENCE = [3, 6, 13, 52, 112, 402, 2473];
  
  const H = hierarchy;
  // 计算：截取从第1项到第H项的数组，然后求和
  const sumS = S_SEQUENCE.slice(0, H).reduce((acc, curr) => acc + curr, 0);
  const L = sumS * H; 
  
  // 添加千位分隔符 (如 21427 变成 21,427)
  const formattedL = L.toLocaleString('en-US');
  const formattedSumS = sumS.toLocaleString('en-US');
  const sumString = S_SEQUENCE.slice(0, H).map(n => n.toLocaleString('en-US')).join(" + ");
  // ============================================================================

  return (
    <div className="min-h-screen bg-[#fafaf9] py-8 md:py-12 px-4 font-sans">
      <div className="mx-auto max-w-7xl space-y-6 md:space-y-8 w-full">
        
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-900">{isEn ? "Construct Studio" : "活结构工作室"}</h1>
          <p className="mt-2 md:mt-3 text-sm md:text-base text-stone-600 max-w-2xl leading-snug">
            {isEn 
              ? "Observe the discrete evolution of a classical structure. The livingness (L) is calculated by multiplying the cumulative number of substructures (ΣS) with the hierarchy depth (H)." 
              : "观察建筑结构的离散演化过程。随着层级 (H) 的加深，所有层级的子结构数量不断累加构成总数 (ΣS)，两者共同决定了整体的生命力 (L)。"}
          </p>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 md:gap-8 items-start w-full">
          
          {/* ============================== */}
          {/* 左侧区域：图片可视化展示 */}
          {/* ============================== */}
          <div className="order-2 lg:order-1 lg:col-span-8 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 w-full">
            
            {/* 初始状态参照 */}
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

            {/* 涌现秩序 (动态插图交互) */}
            <Card className="bg-white p-0 h-[420px] lg:h-[700px] flex flex-col relative border-teal-200 shadow-2xl ring-1 ring-teal-50 overflow-hidden w-full">
              <div className="absolute top-4 left-4 md:top-6 md:left-6 text-[10px] font-bold tracking-widest text-teal-700 uppercase flex items-center gap-2 z-10">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                {isEn ? "Living Structure" : "生命力结构"}
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

          {/* ============================== */}
          {/* 右侧区域：极简控制面板 */}
          {/* ============================== */}
          <div className="order-1 lg:order-2 lg:col-span-4 space-y-4 md:space-y-6 w-full lg:sticky lg:top-8">
            
            <Card className="bg-stone-100 border-none p-5 md:p-8 text-center relative overflow-hidden shadow-inner">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-teal-600" />
              <div className="text-[10px] md:text-xs font-bold text-stone-400 uppercase tracking-widest mb-3 md:mb-6">
                {isEn ? "Livingness Formula" : "生命力计算公式"}
              </div>
              
              <div className="flex flex-col items-center justify-center space-y-2 md:space-y-4">
                <div className="text-xl md:text-2xl font-mono font-bold text-stone-400 tracking-widest">
                  L = ΣS × H
                </div>
                
                {/* 修复点 1：使用 items-baseline 保证底部对齐，加入 flex-wrap 防止小屏溢出，并动态缩放字号 */}
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

                {/* 修复点 2：为累加公式的区域添加自适应高度和换行机制 */}
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

              <div className="mt-4 md:mt-8 text-[10px] md:text-xs text-stone-500 font-medium flex justify-center gap-4 md:gap-6">
                <span className="flex items-center gap-1.5"><span className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-sm bg-stone-300"></span> ΣS: 累计结构数</span>
                <span className="flex items-center gap-1.5"><span className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-sm bg-teal-400"></span> H: 跨尺度层级</span>
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
                <div className="flex justify-between text-[10px] font-bold text-stone-400 uppercase">
                  <span>Stage 1</span>
                  <span>Stage 7</span>
                </div>
                <div className="p-4 bg-stone-50 rounded-lg border border-stone-100">
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {isEn 
                      ? "Slide to progress through the 7 discrete stages of structural evolution. The cumulative sub-structures (ΣS) dictate the overall vitality." 
                      : "拖动滑块查看 7 个离散的结构演化阶段。每一层级产生的新结构将不断累加形成 ΣS，共同决定最终的生命力指数 (L)。"}
                  </p>
                </div>
              </div>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}