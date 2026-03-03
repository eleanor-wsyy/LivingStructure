import React, { useState } from "react";
import { Card, cn } from "@/app/components/ui";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/app/i18n/LanguageContext";

export function Construct() {
  const { trans, language } = useLanguage();
  const isEn = language === 'en';

  const [hierarchy, setHierarchy] = useState(1);
  const [center, setCenter] = useState(1);
  const [boundary, setBoundary] = useState(1);

  // 📐 严谨对齐 L = S x H 的活力值公式
  const S = Math.floor(30 + (hierarchy * 40) + (boundary * 30) + (center * 20) + (hierarchy * boundary * 4));
  const H = hierarchy + (center >= 3 ? 1 : 0) + (boundary >= 3 ? 1 : 0); // 最大层级为 7
  const L = S * H;

  return (
    <div className="min-h-screen bg-[#fafaf9] py-6 md:py-12 px-4 font-sans">
      <div className="mx-auto max-w-7xl space-y-6 md:space-y-8">
        
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-900">{isEn ? "Construct Studio" : "活结构工作室"}</h1>
          <p className="mt-2 md:mt-3 text-sm md:text-base text-stone-600 max-w-2xl">
            {isEn 
              ? "Observe how a grand classical building evolves. Real vitality comes from mathematically strict yet organically nested proportions." 
              : "观察一座宏伟古典建筑的演化。真正的生命力源于严谨的建筑比例与不可分割的层级嵌套。拖动滑块，感受秩序的涌现。"}
          </p>
        </div>

        {/* 核心修改：使用 flex-col 允许手机端自由重排顺序，大屏恢复 grid */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 md:gap-8 items-start w-full">
          
          {/* ============================== */}
          {/* 左侧：建筑可视化区 (DOM 第一部分) */}
          {/* ============================== */}
          <div className="order-2 lg:order-1 lg:col-span-8 flex flex-col lg:grid lg:grid-cols-2 gap-4 md:gap-6 w-full">
            
            {/* 初始状态参照 (手机端垫底，大屏左侧) */}
            <Card className="order-2 lg:order-1 bg-white p-4 md:p-6 h-[300px] lg:h-[700px] flex flex-col relative border-stone-200 shadow-sm opacity-50 grayscale">
              <div className="absolute top-4 left-4 md:top-6 md:left-6 text-[10px] font-bold tracking-widest text-stone-400 uppercase">
                {isEn ? "Initial State" : "初始状态"} (H:1, C:1, B:1)
              </div>
              <div className="flex-1 flex items-center justify-center w-full h-full">
                <ParametricBuilding h={1} c={1} b={1} />
              </div>
              <div className="text-center text-[10px] md:text-xs font-mono text-stone-400 tracking-widest pb-2 md:pb-4">
                PRIMITIVE MASS
              </div>
            </Card>

            {/* 涌现秩序 (动态交互) (手机端贴紧滑块，大屏右侧) */}
            <Card className="order-1 lg:order-2 bg-white p-0 h-[400px] lg:h-[700px] flex flex-col relative border-teal-200 shadow-2xl ring-1 ring-teal-50 overflow-hidden">
              <div className="absolute top-4 left-4 md:top-6 md:left-6 text-[10px] font-bold tracking-widest text-teal-700 uppercase flex items-center gap-2 z-10">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                {isEn ? "Living Structure" : "生命力结构"}
              </div>
              
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#f5f5f4_2px,transparent_2px),linear-gradient(to_bottom,#f5f5f4_2px,transparent_2px)] bg-[size:4rem_4rem] opacity-60" />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#fafaf9_1px,transparent_1px),linear-gradient(to_bottom,#fafaf9_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-40" />
              
              <div className="flex-1 flex items-center justify-center z-10 w-full h-full p-2 md:p-4 pt-8 md:pt-12">
                <ParametricBuilding h={hierarchy} c={center} b={boundary} />
              </div>
              
              <div className="text-center text-[10px] md:text-xs font-mono text-teal-700/50 tracking-widest z-10 font-bold pb-4 md:pb-6">
                EMERGENT ORDER
              </div>
            </Card>
          </div>

          {/* ============================== */}
          {/* 右侧：控制面板 (DOM 第二部分) */}
          {/* 核心修改：手机端置顶，大屏恢复右侧 */}
          {/* ============================== */}
          <div className="order-1 lg:order-2 lg:col-span-4 space-y-4 md:space-y-6 w-full">
            
            <Card className="bg-stone-100 border-none p-6 md:p-8 text-center relative overflow-hidden shadow-inner">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-teal-600" />
              <div className="text-[10px] md:text-xs font-bold text-stone-400 uppercase tracking-widest mb-4 md:mb-6">
                {isEn ? "Livingness Formula" : "生命力计算公式"}
              </div>
              
              <div className="flex flex-col items-center justify-center space-y-2 md:space-y-4">
                <div className="text-xl md:text-2xl font-mono font-bold text-stone-400 tracking-widest">
                  L = S × H
                </div>
                
                <div className="flex items-center justify-center gap-2 md:gap-4 text-3xl md:text-4xl font-mono text-stone-700">
                  <motion.span 
                    key={`L-${L}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-5xl md:text-7xl font-black text-teal-600 tracking-tighter drop-shadow-sm"
                  >
                    {L}
                  </motion.span>
                  <span className="text-stone-300">=</span>
                  <motion.span key={`S-${S}`} initial={{ y: -10 }} animate={{ y: 0 }} className="font-bold">{S}</motion.span>
                  <span className="text-stone-300">×</span>
                  <motion.span key={`H-${H}`} initial={{ y: -10 }} animate={{ y: 0 }} className="font-bold">{H}</motion.span>
                </div>
              </div>

              <div className="mt-6 md:mt-8 text-[10px] md:text-xs text-stone-500 font-medium flex justify-center gap-4 md:gap-6">
                <span className="flex items-center gap-1.5"><span className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-sm bg-stone-300"></span> S: 子结构总数</span>
                <span className="flex items-center gap-1.5"><span className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-sm bg-teal-400"></span> H: 嵌套层级</span>
              </div>
            </Card>

            <Card className="bg-white p-5 md:p-6 space-y-8 md:space-y-10 shadow-sm border-stone-200">
              <SliderControl 
                label={isEn ? "Hierarchy (Scale)" : "层级深度 (Hierarchy)"}
                value={hierarchy} setValue={setHierarchy}
                desc={isEn ? "Deepens the foundation steps and articulates column details." : "深化比例：向下扎根生成多层阶梯，细化柱头与屋檐嵌套。"}
              />
              <SliderControl 
                label={isEn ? "Center (Focus)" : "强中心 (Center)"}
                value={center} setValue={setCenter}
                desc={isEn ? "Raises the grand dome and shapes the majestic arched portal." : "确立焦点：升起万神殿穹顶，演化出罗马拱券主入口。"}
              />
              <SliderControl 
                label={isEn ? "Boundary (Wings)" : "边界 (Boundary)"}
                value={boundary} setValue={setBoundary}
                desc={isEn ? "Extends elegant colonnaded wings to define spatial territory." : "延伸领域：向两侧平稳张开带严谨开窗与列柱的侧翼连廊。"}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function SliderControl({ label, value, setValue, desc }: { label: string, value: number, setValue: (v: number) => void, desc: string }) {
  return (
    <div className="space-y-3 group">
      <div className="flex justify-between items-end">
        <label className="text-sm font-bold text-stone-800 tracking-wide transition-colors group-hover:text-teal-700">{label}</label>
        <span className="font-mono text-lg font-black text-teal-600">{value}</span>
      </div>
      <input 
        type="range" 
        min="1" max="5" step="1"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all shadow-inner"
      />
      <div className="flex justify-between text-[10px] font-bold text-stone-400 uppercase">
        <span>Low</span>
        <span>High</span>
      </div>
      <p className="text-xs text-stone-500 leading-snug">{desc}</p>
    </div>
  );
}

// ============================================================================
// 🏛️ 绝对纯净的古典引擎 (Zero-Ghost Engine)
// 确保所有坐标严格基于绝对锚点 floorY，无任何多余的渲染循环
// ============================================================================
function ParametricBuilding({ h, c, b }: { h: number, c: number, b: number }) {
  
  // 1. 绝对地平线锚定 (建筑向上，台阶向下，绝不脱离)
  const floorY = 700;      
  const mainRoofY = 280;   
  const porticoH = floorY - mainRoofY; 

  const transition = { type: "tween", ease: "easeInOut", duration: 0.5 };

  // 2. 水平维度
  const porticoW = 460; 
  const wingW = (b - 1) * 200; 
  const wingH = porticoH * 0.65; 
  const wingRoofY = floorY - wingH;
  
  const buildingTotalW = porticoW + 2 * wingW; 

  // 3. 基座维度
  const stepCount = h * 2 + 1; 
  const stepHeight = 12; 
  
  // 4. 自适应视口，始终居中
  const viewBoxW = Math.max(1200, buildingTotalW + 300); 
  const viewBoxH = 950;

  const showDome = c >= 3;
  const domeHeight = 80 + c * 15;
  const doorW = 80 + c * 20;
  const doorH = 160 + c * 30;

  return (
    <motion.svg 
      viewBox={`${-viewBoxW/2} 0 ${viewBoxW} ${viewBoxH}`} 
      className="w-full h-full overflow-visible drop-shadow-md"
      animate={{ viewBox: `${-viewBoxW/2} 0 ${viewBoxW} ${viewBoxH}` }} 
      transition={transition}
    >
      <defs>
        <linearGradient id="wallLight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f5f5f4" />
        </linearGradient>
        <linearGradient id="wallDark" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e7e5e4" />
          <stop offset="100%" stopColor="#d6d3d1" />
        </linearGradient>
        <linearGradient id="dome" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#0f766e" />
        </linearGradient>
        <linearGradient id="glass" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#292524" />
          <stop offset="100%" stopColor="#1c1917" />
        </linearGradient>
        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(20, 184, 166, 0.2)" />
          <stop offset="100%" stopColor="rgba(20, 184, 166, 0)" />
        </radialGradient>
      </defs>

      {/* --- 中心圣光 --- */}
      <motion.circle
        cx={0} cy={mainRoofY + 120} r={c * 80 + 80}
        fill="url(#centerGlow)"
        animate={{ r: c * 100 + 100, opacity: c >= 3 ? 1 : 0 }}
        transition={transition}
      />

      {/* ================= 远景层：万神殿穹顶 ================= */}
      <AnimatePresence>
        {showDome && (
          <motion.g
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={transition}
          >
            <rect x={-140} y={mainRoofY - 200} width={280} height={80} fill="url(#wallDark)" stroke="#78716c" strokeWidth="2.5" />
            <rect x={-150} y={mainRoofY - 210} width={300} height={10} fill="#d6d3d1" stroke="#78716c" strokeWidth="2.5" />
            <path d={`M -140 ${mainRoofY - 210} A 140 ${domeHeight} 0 0 1 140 ${mainRoofY - 210} Z`} fill="url(#dome)" stroke="#115e59" strokeWidth="3" />
            <path d={`M -70 ${mainRoofY - 210} Q 0 ${mainRoofY - 210 - domeHeight*1.3} 70 ${mainRoofY - 210}`} fill="none" stroke="#134e4a" strokeWidth="2.5" opacity="0.6" />
            <path d={`M 0 ${mainRoofY - 210} L 0 ${mainRoofY - 210 - domeHeight}`} fill="none" stroke="#134e4a" strokeWidth="2.5" opacity="0.6" />

            {h > 2 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <rect x={-25} y={mainRoofY - 210 - domeHeight - 40} width={50} height={40} fill="url(#wallLight)" stroke="#78716c" strokeWidth="2.5" />
                <polygon points={`-35,${mainRoofY - 210 - domeHeight - 40} 35,${mainRoofY - 210 - domeHeight - 40} 0,${mainRoofY - 210 - domeHeight - 80}`} fill="url(#dome)" stroke="#115e59" strokeWidth="2.5" />
              </motion.g>
            )}
          </motion.g>
        )}
      </AnimatePresence>

      {/* ================= 中景层：侧翼副楼 ================= */}
      <motion.g animate={{ opacity: b > 1 ? 1 : 0 }} transition={transition}>
        <motion.rect y={wingRoofY} height={wingH} fill="url(#wallDark)" stroke="#78716c" strokeWidth="2.5" initial={{ x: -porticoW/2, width: 0 }} animate={{ x: -porticoW/2 - wingW, width: wingW }} transition={transition} />
        <motion.rect y={wingRoofY} height={wingH} fill="url(#wallDark)" stroke="#78716c" strokeWidth="2.5" initial={{ x: porticoW/2, width: 0 }} animate={{ x: porticoW/2, width: wingW }} transition={transition} />
        <motion.rect y={wingRoofY - 14} height={14} fill="#d6d3d1" stroke="#78716c" strokeWidth="2.5" initial={{ x: -porticoW/2, width: 0 }} animate={{ x: -porticoW/2 - wingW - 10, width: wingW + 10 }} transition={transition} />
        <motion.rect y={wingRoofY - 14} height={14} fill="#d6d3d1" stroke="#78716c" strokeWidth="2.5" initial={{ x: porticoW/2, width: 0 }} animate={{ x: porticoW/2, width: wingW + 10 }} transition={transition} />

        {b > 1 && Array.from({ length: b - 1 }).map((_, i) => {
          const bayW = 200; 
          const targetLeftX = (-porticoW/2 - wingW) + i * bayW + bayW/2;
          const targetRightX = (porticoW/2) + i * bayW + bayW/2;
          const winW = 46;
          const winH = 92;
          const winY = floorY - wingH/2 - winH/2 + 20;

          return (
            <React.Fragment key={`wing-detail-${i}`}>
              <motion.g initial={{ opacity: 0, x: targetLeftX + 200 }} animate={{ opacity: 1, x: targetLeftX }} transition={transition}>
                <rect x={-winW/2} y={winY} width={winW} height={winH} fill="url(#glass)" stroke="#57534e" strokeWidth="2.5" />
                <line x1={0} y1={winY} x2={0} y2={winY + winH} stroke="#78716c" strokeWidth="2" />
                <line x1={-winW/2} y1={winY + winH/2} x2={winW/2} y2={winY + winH/2} stroke="#78716c" strokeWidth="2" />
                {h > 1 && <rect x={-winW/2 - 6} y={winY - 12} width={winW + 12} height={12} fill="#e7e5e4" stroke="#78716c" strokeWidth="2" />}
              </motion.g>

              <motion.g initial={{ opacity: 0, x: targetRightX - 200 }} animate={{ opacity: 1, x: targetRightX }} transition={transition}>
                <rect x={-winW/2} y={winY} width={winW} height={winH} fill="url(#glass)" stroke="#57534e" strokeWidth="2.5" />
                <line x1={0} y1={winY} x2={0} y2={winY + winH} stroke="#78716c" strokeWidth="2" />
                <line x1={-winW/2} y1={winY + winH/2} x2={winW/2} y2={winY + winH/2} stroke="#78716c" strokeWidth="2" />
                {h > 1 && <rect x={-winW/2 - 6} y={winY - 12} width={winW + 12} height={12} fill="#e7e5e4" stroke="#78716c" strokeWidth="2" />}
              </motion.g>

              {i < b - 2 && (
                <>
                  <motion.rect y={wingRoofY} width={18} height={wingH} fill="url(#wallLight)" stroke="#78716c" strokeWidth="2.5" initial={{ opacity: 0, x: targetLeftX + bayW/2 - 9 + 200 }} animate={{ opacity: 1, x: targetLeftX + bayW/2 - 9 }} transition={transition} />
                  <motion.rect y={wingRoofY} width={18} height={wingH} fill="url(#wallLight)" stroke="#78716c" strokeWidth="2.5" initial={{ opacity: 0, x: targetRightX + bayW/2 - 9 - 200 }} animate={{ opacity: 1, x: targetRightX + bayW/2 - 9 }} transition={transition} />
                </>
              )}
            </React.Fragment>
          );
        })}
      </motion.g>

      {/* ================= 前景层：中央神庙 ================= */}
      <rect x={-porticoW/2} y={mainRoofY} width={porticoW} height={porticoH} fill="#d6d3d1" stroke="#78716c" strokeWidth="2.5" />

      <motion.g>
        <motion.path
          d={
            c >= 3 
            ? `M ${-doorW/2} ${floorY} L ${-doorW/2} ${floorY - doorH + doorW/2} A ${doorW/2} ${doorW/2} 0 0 1 ${doorW/2} ${floorY - doorH + doorW/2} L ${doorW/2} ${floorY} Z`
            : `M ${-doorW/2} ${floorY} L ${-doorW/2} ${floorY - doorH} L ${doorW/2} ${floorY - doorH} L ${doorW/2} ${floorY} Z`
          }
          fill="url(#glass)" stroke="#1c1917" strokeWidth="4"
          animate={{
            d: c >= 3 
            ? `M ${-doorW/2} ${floorY} L ${-doorW/2} ${floorY - doorH + doorW/2} A ${doorW/2} ${doorW/2} 0 0 1 ${doorW/2} ${floorY - doorH + doorW/2} L ${doorW/2} ${floorY} Z`
            : `M ${-doorW/2} ${floorY} L ${-doorW/2} ${floorY - doorH} L ${doorW/2} ${floorY - doorH} L ${doorW/2} ${floorY} Z`
          }}
          transition={transition}
        />
        {h > 1 && (
          <motion.path
            d={
              c >= 3 
              ? `M ${-doorW/2 - 14} ${floorY} L ${-doorW/2 - 14} ${floorY - doorH + doorW/2} A ${doorW/2 + 14} ${doorW/2 + 14} 0 0 1 ${doorW/2 + 14} ${floorY - doorH + doorW/2} L ${doorW/2 + 14} ${floorY} Z`
              : `M ${-doorW/2 - 14} ${floorY} L ${-doorW/2 - 14} ${floorY - doorH - 14} L ${doorW/2 + 14} ${floorY - doorH - 14} L ${doorW/2 + 14} ${floorY} Z`
            }
            fill="none" stroke="#78716c" strokeWidth="3"
            transition={transition}
          />
        )}
      </motion.g>

      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const colW = 28; 
        const spacing = (porticoW - colW) / 7;
        const px = -porticoW/2 + (spacing * i);

        return (
          <motion.g key={`main-col-${i}`}>
            <rect x={px} y={mainRoofY} width={colW} height={porticoH} fill="url(#wallLight)" stroke="#78716c" strokeWidth="2" />
            <rect x={px - 6} y={floorY - 14} width={colW + 12} height={14} fill="#e7e5e4" stroke="#78716c" strokeWidth="2" />
            <rect x={px - 6} y={mainRoofY} width={colW + 12} height={18} fill="#e7e5e4" stroke="#78716c" strokeWidth="2" />
            {h > 2 && <rect x={px - 8} y={mainRoofY + 18} width={colW + 16} height={8} fill="#d6d3d1" stroke="#78716c" strokeWidth="2" />}
            {h > 3 && (
              <>
                <line x1={px + 8} y1={mainRoofY + 26} x2={px + 8} y2={floorY - 14} stroke="#d6d3d1" strokeWidth="2.5" />
                <line x1={px + 20} y1={mainRoofY + 26} x2={px + 20} y2={floorY - 14} stroke="#d6d3d1" strokeWidth="2.5" />
              </>
            )}
          </motion.g>
        );
      })}

      <g>
        <rect x={-porticoW/2 - 16} y={mainRoofY - 34} width={porticoW + 32} height={34} fill="url(#wallLight)" stroke="#78716c" strokeWidth="2.5" />
        <rect x={-porticoW/2 - 24} y={mainRoofY - 56} width={porticoW + 48} height={22} fill="#d6d3d1" stroke="#78716c" strokeWidth="2.5" />
        <motion.polygon points={`${-porticoW/2 - 36},${mainRoofY - 56} ${porticoW/2 + 36},${mainRoofY - 56} 0,${mainRoofY - 200}`} fill="url(#wallLight)" stroke="#78716c" strokeWidth="2.5" animate={{ points: `${-porticoW/2 - 36},${mainRoofY - 56} ${porticoW/2 + 36},${mainRoofY - 56} 0,${mainRoofY - 200 - c*8}` }} transition={transition} />
        {h > 1 && <motion.polygon points={`${-porticoW/2 + 24},${mainRoofY - 74} ${porticoW/2 - 24},${mainRoofY - 74} 0,${mainRoofY - 165}`} fill="url(#wallDark)" stroke="#78716c" strokeWidth="2" animate={{ points: `${-porticoW/2 + 24},${mainRoofY - 74} ${porticoW/2 - 24},${mainRoofY - 74} 0,${mainRoofY - 165 - c*8}` }} transition={transition} />}
        {h >= 4 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <circle cx={0} cy={mainRoofY - 225 - c*8} r={12} fill="#a8a29e" />
            <path d={`M -10 ${mainRoofY - 200 - c*8} L 0 ${mainRoofY - 240 - c*8} L 10 ${mainRoofY - 200 - c*8} Z`} fill="#a8a29e" />
            <circle cx={-porticoW/2 - 36} cy={mainRoofY - 75} r={10} fill="#a8a29e" />
            <circle cx={porticoW/2 + 36} cy={mainRoofY - 75} r={10} fill="#a8a29e" />
          </motion.g>
        )}
      </g>

      {/* ================= 纯净的唯一底层基座 ================= */}
      <g>
        {Array.from({ length: stepCount }).map((_, i) => {
          const stepW = buildingTotalW + 100 + i * 40;
          const stepY = floorY + i * stepHeight; 
          return (
            <motion.rect
              key={`step-layer-${i}`}
              y={stepY} height={stepHeight}
              fill={i % 2 === 0 ? "url(#wallLight)" : "url(#wallDark)"} 
              stroke="#78716c" strokeWidth="2"
              initial={{ opacity: 0, x: -stepW / 2, width: stepW }} 
              animate={{ opacity: 1, x: -stepW / 2, width: stepW }}
              transition={{ ...transition, delay: i * 0.02 }} 
            />
          );
        })}
      </g>
    </motion.svg>
  );
}