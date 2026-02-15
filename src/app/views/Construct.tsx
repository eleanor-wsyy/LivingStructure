import React, { useState, useMemo } from "react";
import { Slider, cn } from "@/app/components/ui";
import { motion } from "motion/react";
import { useLanguage } from "@/app/i18n/LanguageContext";

// --- Types ---

interface StructureParams {
  depth: number;      // Roof layers / Concentricity
  center: number;     // Volume Size / Eccentricity
  boundary: number;   // Wall Thickness / Enclosure
}

type ElementType = 
  | 'plan-base'
  | 'plan-wall-solid'
  | 'plan-col'
  | 'plan-stair'
  | 'plan-roof-eave'
  | 'plan-roof-ridge'
  | 'sec-base'
  | 'sec-wall'
  | 'sec-col'
  | 'sec-roof-structure'
  | 'sec-roof-shadow'
  | 'sec-stair'
  | 'sec-light';

interface ArchElement {
  id: string;
  type: ElementType;
  d?: string;        // Path data
  cx?: number; cy?: number; r?: number; // Circle data
  strokeWidth: number;
  opacity: number;
  filled?: boolean;
  dashed?: boolean;
  blur?: boolean;
}

interface Metrics {
  S: number; 
  H: number; 
  L: number; 
}

// --- Geometry Helpers ---

const getEllipsePoint = (cx: number, cy: number, rx: number, ry: number, theta: number) => {
  return {
    x: cx + rx * Math.cos(theta),
    y: cy + ry * Math.sin(theta)
  };
};

// Generates a closed path for a curved wall segment with thickness
const getWallSegmentPath = (
  cx: number, cy: number, 
  rxOuter: number, ryOuter: number, 
  rxInner: number, ryInner: number, 
  startAngle: number, endAngle: number
) => {
  const outerStart = getEllipsePoint(cx, cy, rxOuter, ryOuter, startAngle);
  const outerEnd = getEllipsePoint(cx, cy, rxOuter, ryOuter, endAngle);
  const innerStart = getEllipsePoint(cx, cy, rxInner, ryInner, startAngle);
  const innerEnd = getEllipsePoint(cx, cy, rxInner, ryInner, endAngle);
  
  const diff = endAngle - startAngle;
  const largeArcFlag = diff > Math.PI ? 1 : 0;
  
  // Path: Outer Arc -> Line to Inner End -> Inner Arc (Reverse) -> Line to Outer Start
  return `
    M ${outerStart.x} ${outerStart.y} 
    A ${rxOuter} ${ryOuter} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}
    L ${innerEnd.x} ${innerEnd.y}
    A ${rxInner} ${ryInner} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}
    Z
  `;
};

// --- Logic ---

const generateComposition = (params: StructureParams): ArchElement[] => {
  const { depth, center, boundary } = params;
  const elements: ArchElement[] = [];
  
  const P_CX = 200; 
  const P_CY = 200;
  const S_BASE_Y = 360;
  
  // --- 1. GEOMETRY DEFINITION ---
  
  const Rx = 60 + (center * 60); 
  const Ry = 50 + (center * 50); 
  
  // Wall Thickness (Physical thickness for double-line)
  const wallThick = 6 + (boundary * 12);
  const RxInner = Rx - wallThick;
  const RyInner = Ry - wallThick;
  
  // Openings
  const doorGap = 0.25 + (center * 0.1); 
  const windowGap = 0.12 - (boundary * 0.08); 
  const hasWindows = windowGap > 0.02;

  // --- 2. PLAN VIEW GENERATION ---
  
  // A. Base Platform (Elliptical)
  const baseRx = Rx + 40;
  const baseRy = Ry + 40;
  elements.push({
    id: 'plan-base', type: 'plan-base',
    d: `M ${P_CX - baseRx} ${P_CY} A ${baseRx} ${baseRy} 0 1 1 ${P_CX + baseRx} ${P_CY} A ${baseRx} ${baseRy} 0 1 1 ${P_CX - baseRx} ${P_CY}`,
    strokeWidth: 0, opacity: 0.1, filled: true
  });

  // B. Stairs (Front Concentric Arcs)
  const numSteps = 3;
  for(let i=1; i<=numSteps; i++) {
     const stepRx = baseRx + (i * 6);
     const stepRy = baseRy + (i * 6);
     // Arc from somewhat left to somewhat right of south
     const startA = Math.PI/2 - 0.5;
     const endA = Math.PI/2 + 0.5;
     
     const s = getEllipsePoint(P_CX, P_CY, stepRx, stepRy, startA);
     const e = getEllipsePoint(P_CX, P_CY, stepRx, stepRy, endA);
     
     elements.push({
         id: `plan-stair-${i}`, type: 'plan-stair',
         d: `M ${s.x} ${s.y} A ${stepRx} ${stepRy} 0 0 1 ${e.x} ${e.y}`,
         strokeWidth: 1, opacity: 0.3 - (i*0.05)
     });
  }

  // C. Wall Mass (Solid filled shapes)
  // Segment 1: Right Window to Door Right
  if (hasWindows) {
      elements.push({
          id: 'plan-wall-fr', type: 'plan-wall-solid',
          d: getWallSegmentPath(P_CX, P_CY, Rx, Ry, RxInner, RyInner, windowGap, Math.PI/2 - doorGap),
          strokeWidth: 0, opacity: 0.7, filled: true
      });
      // Segment 2: Door Left to Left Window
      elements.push({
          id: 'plan-wall-fl', type: 'plan-wall-solid',
          d: getWallSegmentPath(P_CX, P_CY, Rx, Ry, RxInner, RyInner, Math.PI/2 + doorGap, Math.PI - windowGap),
          strokeWidth: 0, opacity: 0.7, filled: true
      });
      // Segment 3: Back Wall
      elements.push({
          id: 'plan-wall-back', type: 'plan-wall-solid',
          d: getWallSegmentPath(P_CX, P_CY, Rx, Ry, RxInner, RyInner, Math.PI + windowGap, 2*Math.PI - windowGap),
          strokeWidth: 0, opacity: 0.7, filled: true
      });
  } else {
      // Single continuous wall with door gap
      elements.push({
          id: 'plan-wall-solid', type: 'plan-wall-solid',
          d: getWallSegmentPath(P_CX, P_CY, Rx, Ry, RxInner, RyInner, Math.PI/2 + doorGap, 2.5*Math.PI - doorGap),
          strokeWidth: 0, opacity: 0.7, filled: true
      });
  }

  // D. Columns (Detailed)
  const colRadius = Rx + 12; // Just outside the wall
  const numCols = 4 + Math.floor(boundary * 4);
  const arcSpan = Math.PI / 2.5; 
  
  for(let i=0; i<=numCols; i++) {
    const t = (Math.PI/2 - arcSpan/2) + (i * (arcSpan/numCols));
    const p = getEllipsePoint(P_CX, P_CY, colRadius, colRadius * (Ry/Rx), t);
    // Column Base (Circle)
    elements.push({
      id: `plan-col-base-${i}`, type: 'plan-col',
      cx: p.x, cy: p.y, r: 4,
      strokeWidth: 0, opacity: 0.3, filled: true
    });
    // Column Shaft (Smaller Circle)
    elements.push({
      id: `plan-col-shaft-${i}`, type: 'plan-col',
      cx: p.x, cy: p.y, r: 2.5,
      strokeWidth: 0, opacity: 0.8, filled: true
    });
  }

  // E. Roof Eaves (Layered)
  const roofRx = Rx + 30 + (depth * 25);
  const roofRy = Ry + 30 + (depth * 25);
  
  // Shadow
  elements.push({
    id: 'plan-roof-shadow', type: 'plan-roof-eave',
    d: `M ${P_CX - roofRx} ${P_CY} A ${roofRx} ${roofRy} 0 1 1 ${P_CX + roofRx} ${P_CY} A ${roofRx} ${roofRy} 0 1 1 ${P_CX - roofRx} ${P_CY}`,
    strokeWidth: 4, opacity: 0.1, blur: true
  });
  // Main Eave Line
  elements.push({
    id: 'plan-roof-outline', type: 'plan-roof-eave',
    d: `M ${P_CX - roofRx} ${P_CY} A ${roofRx} ${roofRy} 0 1 1 ${P_CX + roofRx} ${P_CY} A ${roofRx} ${roofRy} 0 1 1 ${P_CX - roofRx} ${P_CY}`,
    strokeWidth: 1.5, opacity: 0.6
  });
  // Inner Ridge (Ridge + Rafters)
  const ridgeLen = Rx * 1.2;
  elements.push({
    id: 'plan-ridge', type: 'plan-roof-ridge',
    d: `M ${P_CX - ridgeLen/2} ${P_CY} L ${P_CX + ridgeLen/2} ${P_CY}`,
    strokeWidth: 2, opacity: 0.8
  });


  // --- 3. SECTION VIEW GENERATION ---
  
  // A. Plinth & Stairs
  const splinthW = (baseRx * 2);
  const splinthH = 15;
  const splinthTop = S_BASE_Y - splinthH;
  
  // Main Plinth Mass
  const sPlinthPath = `
      M ${P_CX - splinthW/2} ${S_BASE_Y}
      L ${P_CX + splinthW/2} ${S_BASE_Y}
      Q ${P_CX + splinthW/2 - 5} ${splinthTop + splinthH/2} ${P_CX + splinthW/2 - 10} ${splinthTop}
      L ${P_CX - splinthW/2 + 10} ${splinthTop}
      Q ${P_CX - splinthW/2 + 5} ${splinthTop + splinthH/2} ${P_CX - splinthW/2} ${S_BASE_Y}
  `;
  elements.push({ id: 'sec-plinth', type: 'sec-base', d: sPlinthPath, strokeWidth: 0, opacity: 0.15, filled: true });
  
  // Front Stairs (Simplified as low steps in front)
  // Drawn as small rectangles centered at bottom
  const stairW = 60 + (center * 20);
  elements.push({
      id: 'sec-stair-1', type: 'sec-stair',
      d: `M ${P_CX - stairW/2} ${S_BASE_Y} L ${P_CX + stairW/2} ${S_BASE_Y} L ${P_CX + stairW/2 - 2} ${S_BASE_Y + 4} L ${P_CX - stairW/2 + 2} ${S_BASE_Y + 4} Z`,
      strokeWidth: 0, opacity: 0.3, filled: true
  });

  // B. Columns with Capitals/Bases
  const wallH = 60 + (center * 30);
  const colTopY = splinthTop - wallH;
  
  // Columns positioned at wall line
  const colX_L = P_CX - Rx;
  const colX_R = P_CX + Rx;
  const colW = 5 + (center * 3);
  
  const drawColumn = (x: number, id: string) => {
      // Shaft
      const shaftPath = `M ${x - colW/2} ${splinthTop - 3} L ${x + colW/2} ${splinthTop - 3} L ${x + colW/2 * 0.8} ${colTopY + 3} L ${x - colW/2 * 0.8} ${colTopY + 3} Z`;
      elements.push({ id: `${id}-shaft`, type: 'sec-col', d: shaftPath, strokeWidth: 0, opacity: 0.8, filled: true });
      
      // Base
      const basePath = `M ${x - colW} ${S_BASE_Y - splinthH} L ${x + colW} ${S_BASE_Y - splinthH} L ${x + colW*0.8} ${S_BASE_Y - splinthH - 4} L ${x - colW*0.8} ${S_BASE_Y - splinthH - 4} Z`;
      elements.push({ id: `${id}-base`, type: 'sec-col', d: basePath, strokeWidth: 0, opacity: 0.9, filled: true });
      
      // Capital
      const capPath = `M ${x - colW*0.8} ${colTopY + 3} L ${x + colW*0.8} ${colTopY + 3} L ${x + colW*1.2} ${colTopY} L ${x - colW*1.2} ${colTopY} Z`;
      elements.push({ id: `${id}-cap`, type: 'sec-col', d: capPath, strokeWidth: 0, opacity: 0.9, filled: true });
  };
  
  drawColumn(colX_L, 'sec-col-L');
  drawColumn(colX_R, 'sec-col-R');

  // C. Walls (Behind Columns)
  // Tapered mass
  const wallTopW = wallThick * 0.8;
  const wallBaseW = wallThick * 1.2;
  
  // Left Wall
  const wLX = colX_L + 15; // Inset slightly
  const wallL = `M ${wLX - wallBaseW/2} ${splinthTop} L ${wLX + wallBaseW/2} ${splinthTop} L ${wLX + wallTopW/2} ${colTopY} L ${wLX - wallTopW/2} ${colTopY} Z`;
  elements.push({ id: 'sec-wall-l', type: 'sec-wall', d: wallL, strokeWidth: 0, opacity: 0.6, filled: true });
  
  // Right Wall
  const wRX = colX_R - 15;
  const wallR = `M ${wRX - wallBaseW/2} ${splinthTop} L ${wRX + wallBaseW/2} ${splinthTop} L ${wRX + wallTopW/2} ${colTopY} L ${wRX - wallTopW/2} ${colTopY} Z`;
  elements.push({ id: 'sec-wall-r', type: 'sec-wall', d: wallR, strokeWidth: 0, opacity: 0.6, filled: true });

  // D. Roof Structure (Layered)
  const roofProj = 35 + (depth * 15);
  const sRoofW = (Rx * 2) + (roofProj * 2);
  const ridgeH = 30 + (center * 25);
  const ridgeY = colTopY - ridgeH;
  const curveSag = 12 * (1 + center);
  
  // 1. Shadow underneath
  const shadowPath = `
      M ${P_CX - sRoofW/2} ${colTopY + 8} 
      Q ${P_CX - sRoofW/4} ${colTopY + curveSag + 8} ${P_CX} ${ridgeY + 12}
      Q ${P_CX + sRoofW/4} ${colTopY + curveSag + 8} ${P_CX + sRoofW/2} ${colTopY + 8}
      L ${P_CX + sRoofW/2 - 10} ${colTopY + 20}
      Q ${P_CX} ${colTopY + curveSag + 20} ${P_CX - sRoofW/2 + 10} ${colTopY + 20}
      Z
  `;
  elements.push({ id: 'sec-roof-shadow', type: 'sec-roof-shadow', d: shadowPath, strokeWidth: 0, opacity: 0.2, filled: true, blur: true });

  // 2. Main Structure (Underside)
  const roofUnder = `
      M ${P_CX - sRoofW/2} ${colTopY} 
      Q ${P_CX - sRoofW/4} ${colTopY + curveSag} ${P_CX} ${ridgeY}
      Q ${P_CX + sRoofW/4} ${colTopY + curveSag} ${P_CX + sRoofW/2} ${colTopY}
      L ${P_CX + sRoofW/2 - 5} ${colTopY + 6}
      Q ${P_CX} ${ridgeY + 6} ${P_CX - sRoofW/2 + 5} ${colTopY + 6}
      Z
  `;
  elements.push({ id: 'sec-roof-struct', type: 'sec-roof-structure', d: roofUnder, strokeWidth: 0, opacity: 0.8, filled: true });
  
  // 3. Roof Surface (Top Layer)
  const roofTop = `
      M ${P_CX - sRoofW/2 - 2} ${colTopY - 2} 
      Q ${P_CX - sRoofW/4} ${colTopY + curveSag - 4} ${P_CX} ${ridgeY - 4}
      Q ${P_CX + sRoofW/4} ${colTopY + curveSag - 4} ${P_CX + sRoofW/2 + 2} ${colTopY - 2}
  `;
  elements.push({ id: 'sec-roof-surf', type: 'sec-roof-structure', d: roofTop, strokeWidth: 2, opacity: 1.0 });

  // 4. Secondary Tier (if Depth)
  if (depth > 0.3) {
      const tierY = colTopY + (wallH * 0.4);
      const tierW = sRoofW + 50;
      
      // Tier Structure
      const tierStructL = `M ${P_CX - tierW/2} ${tierY} Q ${P_CX - tierW/4} ${tierY + curveSag} ${P_CX - Rx} ${tierY - 10} L ${P_CX - Rx} ${tierY - 5} Q ${P_CX - tierW/4} ${tierY + curveSag + 5} ${P_CX - tierW/2 + 5} ${tierY + 5} Z`;
      const tierStructR = `M ${P_CX + tierW/2} ${tierY} Q ${P_CX + tierW/4} ${tierY + curveSag} ${P_CX + Rx} ${tierY - 10} L ${P_CX + Rx} ${tierY - 5} Q ${P_CX + tierW/4} ${tierY + curveSag + 5} ${P_CX + tierW/2 - 5} ${tierY + 5} Z`;
      
      elements.push({ id: 'sec-tier-l', type: 'sec-roof-structure', d: tierStructL, strokeWidth: 0, opacity: 0.7, filled: true });
      elements.push({ id: 'sec-tier-r', type: 'sec-roof-structure', d: tierStructR, strokeWidth: 0, opacity: 0.7, filled: true });
  }

  // E. Living Center Light
  elements.push({
      id: 'sec-light', type: 'sec-light',
      cx: P_CX, cy: colTopY + (wallH/2), r: 0,
      strokeWidth: 0, opacity: center
  });

  return elements;
};

const calculateMetrics = (params: StructureParams): Metrics => {
  const S = (params.center * 60) + (params.boundary * 30);
  const H = 1 + (params.depth * 3);
  const L = S * H * 1.5;
  return { S, H, L };
};

const Canvas = ({ elements, label, isEmerging, metrics }: { elements: ArchElement[], label: string, isEmerging?: boolean, metrics?: Metrics }) => {
  const vitality = metrics ? Math.min(1, metrics.L / 150) : 0;
  
  const breatheOpacity = {
     animate: {
        opacity: [0.6, 0.8 + (vitality * 0.2), 0.6],
        transition: { duration: 4, ease: "easeInOut", repeat: Infinity }
     }
  };
  
  const breatheLight = {
    animate: {
       opacity: [0.1 * vitality, 0.5 * vitality, 0.1 * vitality],
       scale: [0.8, 1.2, 0.8],
       transition: { duration: 4, ease: "easeInOut", repeat: Infinity }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="mb-4 text-xs font-serif font-bold text-stone-500 tracking-[0.2em] uppercase">{label}</h3>
      <div className={cn(
        "relative flex-1 rounded-sm border overflow-hidden flex items-center justify-center transition-all duration-1000 bg-[#FDFBF7]",
        isEmerging ? "border-stone-300 shadow-sm" : "border-stone-200 grayscale opacity-60"
      )}>
        <svg viewBox="0 0 400 400" className="w-full h-full max-w-[400px] max-h-[400px] p-6 overflow-visible">
          <defs>
             <radialGradient id="lightGlow">
                 <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.6" />
                 <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
             </radialGradient>
             <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
                 <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
             </filter>
          </defs>

          {/* Labels */}
          <text x="0" y="20" className="text-[9px] uppercase tracking-widest fill-stone-400 font-mono opacity-50">Plan: Elliptical Hall</text>
          <text x="0" y="380" className="text-[9px] uppercase tracking-widest fill-stone-400 font-mono opacity-50">Section: Layered Mass</text>

          {elements.map((el) => {
             // 1. Circles
             if (el.cx !== undefined && el.cy !== undefined) {
                 if (el.type === 'sec-light') {
                     return (
                        <motion.circle
                           key={el.id} cx={el.cx} cy={el.cy} r={40}
                           fill="url(#lightGlow)"
                           initial={{ opacity: 0 }}
                           animate={isEmerging ? breatheLight.animate : { opacity: 0 }}
                        />
                     );
                 }
                 return (
                    <motion.circle
                       key={el.id} cx={el.cx} cy={el.cy} r={el.r}
                       initial={{ opacity: 0 }}
                       animate={{ opacity: el.opacity }}
                       transition={{ duration: 1 }}
                       fill={el.filled ? "currentColor" : "none"}
                       className="text-stone-800"
                    />
                 );
             }

             // 2. Paths
             if (el.d) {
                const isRoof = el.type.includes('roof');
                const isWall = el.type.includes('wall');
                
                return (
                   <motion.path
                      key={el.id} d={el.d}
                      initial={{ opacity: 0, pathLength: el.filled ? 1 : 0 }}
                      animate={isEmerging && (isRoof || isWall) ? breatheOpacity.animate : { opacity: el.opacity, pathLength: 1 }}
                      transition={{ duration: 1.5 }}
                      fill={el.filled ? "currentColor" : "none"}
                      stroke={el.filled ? "none" : "currentColor"}
                      strokeWidth={el.strokeWidth}
                      filter={el.blur ? "url(#blur)" : undefined}
                      className={cn(
                        "transition-colors",
                        isRoof ? "text-stone-700" : "text-stone-400",
                        isWall && "text-stone-600",
                        el.type.includes('base') && "text-stone-200",
                        el.type.includes('col') && "text-stone-800"
                      )}
                   />
                );
             }
             return null;
          })}
        </svg>
      </div>
    </div>
  );
};

export function Construct() {
  const { trans } = useLanguage();
  
  const initialParams: StructureParams = { depth: 0.1, center: 0.1, boundary: 0.1 };
  const [params, setParams] = useState<StructureParams>({ depth: 0.5, center: 0.5, boundary: 0.5 });

  const initialElements = useMemo(() => generateComposition(initialParams), []);
  const liveElements = useMemo(() => generateComposition(params), [params]);
  const metrics = useMemo(() => calculateMetrics(params), [params]);

  return (
    <div className="flex h-[calc(100vh-theme(spacing.14))] bg-stone-50 overflow-hidden font-sans">
      <div className="flex-1 flex flex-col p-12 overflow-hidden">
        <div className="mb-10">
           <h1 className="text-3xl font-serif text-stone-900 mb-2">{trans.construct.title}</h1>
           <p className="text-stone-500 text-sm max-w-lg">
             {trans.construct.subtitle}
           </p>
        </div>

        <div className="grid grid-cols-2 gap-12 flex-1 max-w-6xl w-full mx-auto h-[550px]">
          <Canvas 
            elements={initialElements} 
            label={trans.construct.initialState}
          />
          <Canvas 
            elements={liveElements} 
            label={trans.construct.emergingOrder}
            isEmerging={true}
            metrics={metrics}
          />
        </div>

        <div className="mt-6 text-center">
          <p className="text-stone-400 font-serif italic text-lg opacity-80">
            {trans.construct.footerPrompt}
          </p>
        </div>
      </div>

      <div className="w-96 border-l border-stone-200 bg-white p-10 flex flex-col z-10 shadow-xl shadow-stone-200/50">
        <div className="mb-12 text-center">
           <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400 mb-6">{trans.construct.vitality}</h2>
           
           <div className="relative py-8 px-4 bg-stone-50 rounded-lg border border-stone-100 mb-4 transition-colors duration-1000"
                style={{ backgroundColor: `rgba(231, 229, 228, ${metrics.L / 200})` }}
           >
              <div className="text-5xl font-serif text-stone-800 font-medium mb-2 transition-all duration-1000"
                   style={{ 
                     textShadow: `0 0 ${metrics.L / 10}px rgba(168, 162, 158, 0.5)`
                   }}
              >
                L = {metrics.L.toFixed(0)}
              </div>
              <div className="text-xs font-mono text-stone-500 flex justify-center gap-4">
                 <span>S: {metrics.S.toFixed(0)}</span>
                 <span>×</span>
                 <span>H: {metrics.H.toFixed(0)}</span>
              </div>
           </div>
           
           <p className="text-xs text-stone-400 leading-relaxed">
             {trans.construct.insight} <br/>{trans.construct.insightSub}
           </p>
        </div>

        <div className="space-y-10">
           <div className="space-y-4">
             <div className="flex justify-between text-xs uppercase tracking-wider text-stone-500 font-medium">
               <label>{trans.construct.controls.depth}</label>
             </div>
             <Slider 
               value={[params.depth]} 
               min={0} max={1} step={0.05}
               onValueChange={(v) => setParams(p => ({ ...p, depth: v[0] }))}
               className="py-1"
             />
           </div>

           <div className="space-y-4">
             <div className="flex justify-between text-xs uppercase tracking-wider text-stone-500 font-medium">
               <label>{trans.construct.controls.center}</label>
             </div>
             <Slider 
               value={[params.center]} 
               min={0} max={1} step={0.05}
               onValueChange={(v) => setParams(p => ({ ...p, center: v[0] }))}
               className="py-1"
             />
           </div>

           <div className="space-y-4">
             <div className="flex justify-between text-xs uppercase tracking-wider text-stone-500 font-medium">
               <label>{trans.construct.controls.boundary}</label>
             </div>
             <Slider 
               value={[params.boundary]} 
               min={0} max={1} step={0.05}
               onValueChange={(v) => setParams(p => ({ ...p, boundary: v[0] }))}
               className="py-1"
             />
           </div>
        </div>
      </div>
    </div>
  );
}
