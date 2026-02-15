import React from "react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { cn } from "@/app/components/ui";

// --- SVG Diagrams ---

const RecursiveCenterDiagram = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full text-stone-900 bg-white">
    <defs>
       <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
         <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f5f5f4" strokeWidth="1"/>
       </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
    
    {/* Main Center */}
    <circle cx="200" cy="150" r="80" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.8" />
    <circle cx="200" cy="150" r="4" fill="currentColor" />

    {/* Sub Centers */}
    {[0, 60, 120, 180, 240, 300].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const x = 200 + Math.cos(rad) * 100;
      const y = 150 + Math.sin(rad) * 100;
      return (
        <g key={i}>
           {/* Connection lines */}
          <line x1="200" y1="150" x2={x} y2={y} stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.4" />
          <circle cx={x} cy={y} r="25" fill="white" stroke="currentColor" strokeWidth="1.5" />
          <circle cx={x} cy={y} r="2" fill="currentColor" />
          
           {/* Tertiary Centers */}
           {[0, 90, 180, 270].map((subAngle, j) => {
              const subRad = ((angle + subAngle) * Math.PI) / 180;
              const sx = x + Math.cos(subRad) * 30;
              const sy = y + Math.sin(subRad) * 30;
              return <circle key={j} cx={sx} cy={sy} r="5" fill="white" stroke="currentColor" strokeWidth="1" opacity="0.6" />;
           })}
        </g>
      );
    })}
    <text x="200" y="280" textAnchor="middle" fontSize="10" letterSpacing="0.2em" fill="#666" fontFamily="serif">RECURSIVE CENTER NETWORK</text>
  </svg>
);

// --- Components ---

const BilingualParagraph = ({ label, en, zh }: { label: string, en: string, zh: string }) => (
  <div className="mb-10 last:mb-0 h-auto min-h-0">
    <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-400 mb-4 border-b border-stone-100 pb-2 inline-block">{label}</h4>
    <div className="block h-auto w-full">
      <p className="text-base leading-8 text-stone-900 font-serif mb-4 text-justify block visible">{en}</p>
      <p className="text-sm leading-7 text-stone-500 font-sans font-light text-justify block visible">{zh}</p>
    </div>
  </div>
);

const Section = ({ title, subTitle, children }: { title: string, subTitle: string, children: React.ReactNode }) => (
  <section className="mb-32 border-t border-stone-200 pt-16">
    <div className="flex flex-col md:flex-row gap-8 mb-16 items-baseline">
      <h2 className="text-3xl font-serif font-bold text-stone-900 uppercase tracking-widest shrink-0 w-64">{title}</h2>
      <h3 className="text-xl font-sans text-stone-400 font-light">{subTitle}</h3>
    </div>
    {children}
  </section>
);

const PropertyBlock = ({ 
  number, titleEn, titleZh, 
  defEn, defZh, 
  mechEn, mechZh, 
  archEn, archZh, 
  genEn, genZh,
  imageUrl 
}: any) => (
  <div className="border-t-2 border-stone-900 pt-8 pb-24 grid grid-cols-1 md:grid-cols-12 gap-12 h-auto min-h-0">
    
    {/* Header / Number */}
    <div className="col-span-1 md:col-span-12 flex items-baseline gap-6 mb-6">
      <span className="text-5xl font-mono text-stone-300 font-light block">
        {number < 10 ? `0${number}` : number}
      </span>
      <div>
        <h3 className="text-4xl font-serif font-bold text-stone-900 mb-2">{titleEn}</h3>
        <h4 className="text-xl text-stone-500 font-sans">{titleZh}</h4>
      </div>
    </div>

    {/* Column 1: Theory (Definition & Mechanism) */}
    <div className="col-span-1 md:col-span-5 pr-8 space-y-2 h-auto">
      <BilingualParagraph 
        label="Definition / 定义" 
        en={defEn} 
        zh={defZh} 
      />
      <BilingualParagraph 
        label="Structural Mechanism / 结构机制" 
        en={mechEn} 
        zh={mechZh} 
      />
    </div>

    {/* Column 2: Practice (Example & Generative) */}
    <div className="col-span-1 md:col-span-3 pr-4 space-y-2 h-auto">
      <BilingualParagraph 
        label="Architectural Example / 建筑实例" 
        en={archEn} 
        zh={archZh} 
      />
      <BilingualParagraph 
        label="Generative Translation / 生成转化" 
        en={genEn} 
        zh={genZh} 
      />
    </div>

    {/* Column 3: Visual */}
    <div className="col-span-1 md:col-span-4 h-auto">
       <div className="sticky top-12">
         <div className="aspect-[4/3] bg-stone-100 overflow-hidden border border-stone-200 mb-4 h-auto">
            {imageUrl && (
              <ImageWithFallback 
                  src={imageUrl} 
                  alt={titleEn} 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            )}
         </div>
         <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 border-l-2 border-stone-200 pl-3">
            Figure {number}.0 — {titleEn} Reference
         </div>
       </div>
    </div>

  </div>
);

export function Theory() {
  const properties = [
    {
      n: 1, tEn: "Levels of Scale", tZh: "尺度层级",
      dEn: "Living structure contains distinguishable levels of scale organized hierarchically. Each level supports the next larger whole.",
      dZh: "活力结构包含可区分的尺度层级，并形成递归等级体系，每一层支撑更大的整体。",
      mEn: "Smaller centers are far more numerous than large ones, forming depth (H).",
      mZh: "小尺度中心数量远多于大尺度中心，形成层级深度 H。",
      aEn: "Courtyard systems show nested scales from settlement to detail.",
      aZh: "传统院落呈现从聚落到细部的多层嵌套。",
      gEn: "Increase hierarchical depth by adding nested substructures.",
      gZh: "通过增加嵌套子结构提升层级深度。",
      imageUrl: "/image/level of scale.png"
    },
    {
      n: 2, tEn: "Strong Centers", tZh: "强中心",
      dEn: "A center is a region of intensified coherence supported by surrounding centers.",
      dZh: "中心是由周围结构支撑而强化的区域。",
      mEn: "Strength depends on relational density (S).",
      mZh: "强度取决于关系密度 S。",
      aEn: "The main hall becomes strong through axial and lateral reinforcement.",
      aZh: "正厅通过轴线与侧向结构强化。",
      gEn: "Measure centrality and structural support.",
      gZh: "计算中心性与结构支撑度。",
      imageUrl: "/image/Strong centers.png"
    },
    {
      n: 3, tEn: "Boundaries", tZh: "边界",
      dEn: "Boundaries create transitional layers that strengthen centers.",
      dZh: "边界通过过渡层强化中心。",
      mEn: "Layered edges stabilize spatial continuity.",
      mZh: "层级边界增强空间连续性。",
      aEn: "Eaves and corridors intensify interior spaces.",
      aZh: "屋檐与回廊强化内部空间。",
      gEn: "Add layered boundary zones around volumes.",
      gZh: "在体量周围增加层级边界。",
      imageUrl: "/image/Boundaries.png"
    },
    {
      n: 4, tEn: "Alternating Repetition", tZh: "交替重复",
      dEn: "Simple repetition is mechanical and lifeless. Living repetition is alternating. This property describes a pattern where secondary centers alternate with primary centers, or where variations occur in a rhythmic sequence. It creates a dynamic oscillation that engages the observer, rather than the monotony of a factory-stamped grid.",
      dZh: "简单的重复是机械且无生命的。有生命的重复是交替的。此属性描述了一种模式，其中次要中心与主要中心交替，或者变化出现在有节奏的序列中。它创造了一种吸引观察者的动态振荡，而不是工厂冲压网格的单调。",
      mEn: "The mechanism relies on binary or complex rhythm. Instead of A-A-A-A, the structure uses A-B-A-B or A-b-A-b. The 'B' elements act as boundaries or connectors for the 'A' elements. This alternation allows each element to be distinct while still being part of a larger, unified sequence.",
      mZh: "该机制依赖于二元��复杂的节奏。结构不是 A-A-A-A，而是使用 A-B-A-B 或 A-b-A-b。 “B”元素充当“A”元素的边界或连接器。这种交替使得每个元素在作为更大统一序列的一部分的同时，仍然保持独特。",
      aEn: "The bays of a timber hall are often arranged with a wider central bay and narrower side bays, creating a rhythm of Wide-Narrow-Wide. Similarly, a colonnade might alternate between column (solid) and void (space), but often with an intermediate element like a bracket or capital that bridges the two.",
      aZh: "木构厅堂的开间通常安排为较宽的明间和较窄的次间，创造出宽-窄-宽的节奏。同样，柱廊可能在柱（实）和空（虚）之间交替，但通常带有中间元素，如连接两者的斗拱或柱头。",
      gEn: "To avoid sterility in procedural generation, never use a simple 'for loop' to place identical instances. Instead, implement an alternating function that places a primary object, then a connector object, then a primary object. Or, introduce slight parametric variations to every second iteration to break the monotony.",
      gZh: "为了避免程序生成中的枯燥，切勿使用简单的“for循环”来放置相同的实例。相反，实现一个交替函数，放置一个主要对象，然后是一个连接器对象，再是一个主要对象。或者，对每第二次迭代引入轻微的参数变化以打破单调。",
      imageUrl: "/image/Alternating repetition.png"
    },
    {
      n: 5, tEn: "Positive Space", tZh: "正空间",
      dEn: "Space is not merely the residue between objects but a distinct entity. Positive space is convex, well-defined, and possesses substance. Occupying such space creates a sense of containment. Conversely, negative space appears amorphous and accidental. Living structure treats void as a solid material requiring deliberate shaping.",
      dZh: "空间不仅仅是物体之间的残留物，而是一个独立的实体。正空间是凸出的、定义明确的，并具有实质感。置身其中会产生一种被包容感。相反，负空间显得无定形且偶然。生命结构将虚空视为必须精心塑造的实体材料。",
      mEn: "The mechanism for creating positive space is enclosure and convexity. A space becomes positive when its boundaries are sufficiently solid to define a shape, and when that shape tends towards convexity (bulging outward) rather than concavity. This creates a center of pressure within the void itself.",
      mZh: "创造正空间的机制是围合和凸性。当空间的边界足够坚固以定义形状，并且该形状倾向于凸出（向外鼓起）而不是凹陷时，空间就变成了正空间。这在虚空本身内部创造了一个压力中心。",
      aEn: "The traditional courtyard (Siheyuan) is the perfect example. The buildings are not placed randomly; they are arranged specifically to shape the empty air in the middle. The courtyard is the 'room without a roof', more important than the buildings themselves. It is a distinct, rectangular volume of positive space.",
      aZh: "传统的四合院是完美的例子。建筑不是随意放置的；它们的排列专门是为了塑造中间的空空气。庭院是“没有屋顶的房间”，比建筑本身更重要。它是正空间的一个独特的、矩形的体积。",
      gEn: "In the generative model, we calculate the 'Space Enclosure Index'. We cast rays from the center of a void; if the majority of rays hit a boundary within a short distance, the space is positive. If rays escape to infinity in multiple directions, the space is negative/leaking, and the algorithm must add closure elements (walls, trees) to contain it.",
      gZh: "在生成模型中，我们计算“空间围合指数”。我们要从虚空的中心发出射线；如果大多数射线在短距离内击中边界，则空间为正。如果射线在多个方向逃逸到无穷远，则空间为负/泄漏，算法必须添加封闭元素（墙、树）来包含它。",
      imageUrl: "/image/Positive space.png"
    },
    {
      n: 6, tEn: "Good Shape", tZh: "良形",
      dEn: "Every element in a living structure, whether it is a physical object or the space between objects, should have a 'good shape'. A good shape is simple, coherent, and often possesses a high degree of symmetry. It feels complete in itself. Irregular, jagged, or confusing shapes drain the vitality of the whole because they cannot act as strong centers.",
      dZh: "生命结构中的每个元素，无论是物理物体还是物体之间的空间，都应该有一个“良形”。良形简单、连贯，通常具有高度的对称性。它感觉自身是完整的。不规则、锯齿状或混乱的形状会消耗整体的生命力，因为它们无法充当强中心。",
      mEn: "Mechanism implies compactness and elementary geometry. Squares, circles, and rectangles with simple integer proportions (1:1, 1:2, 2:3) are inherently 'good shapes'. Complex shapes can be 'good' if they are composed of a clear union of simpler good shapes. The center of gravity of the shape should be intuitively obvious.",
      mZh: "机制意味着紧凑性和基本几何。具有简单整数比例（1:1, 1:2, 2:3）的正方形、圆形和矩形本质上是“良形”。如果复杂形状由更简单的良形清晰组合而成，它们也可以是“良”的。形状的重心应该是直观明显的。",
      aEn: "Window lattices in Chinese gardens are designed with incredible attention to shape. Each empty hole in the lattice is a beautiful geometric form—a hexagon, a fan, a vase. The wood strips are not just dividers; they shape the light into coherent, recognizable figures that please the eye.",
      aZh: "中国园林中的窗格设计对形状极其讲究。窗格中的每一个空洞都是一个美丽的几何形式——六边形、扇形、花瓶形。木条不仅仅是分隔物；它们将光线塑造成连贯、可识别的图形，令人赏心悦目。",
      gEn: "When generating geometry, the system enforces a 'Compactness Metric' (Area / Perimeter²). Shapes that are too long, thin, or spindly are rejected. The algorithm prefers creating complex forms by combining simple primitives (unions of rectangles) rather than deforming a single mesh into an unrecognizable blob.",
      gZh: "在生成几何体时，系统执行“紧凑性度量”（面积 / 周长²）。太长、太薄或细长的形状会被拒绝。算法更喜欢通过组合简单的图元（矩形的联合）来创建复杂形式，而不是将单个网格变形为无法识别的团块。",
      imageUrl: "/image/Good shape.png"
    },
    {
      n: 7, tEn: "Local Symmetries", tZh: "局部对称",
      dEn: "While global symmetry (overall bilateral symmetry) can be stiff and totalitarian, local symmetry is the lifeblood of organic structure. This means that small parts of the structure should be symmetrical within themselves, even if the overall building is asymmetrical. Local symmetries create intense local centers that ripple out to bind the whole structure together.",
      dZh: "虽然全局对称（整体双侧对称）可能是僵硬和极权的，但局部对称是有机结构的生命线。这意味着结构的微小部分在自身内部应对称，即使整体建筑是不对称的。局部对称创造了强烈的局部中心，向外扩散以将整个结构结合在一起。",
      mEn: "The mechanism is the creation of 'sub-centers' through reflection. When an element is mirrored, the axis of symmetry becomes a new, invisible center. By packing a design with hundreds of these small axes of symmetry, we create a dense field of centers that makes the object feel solid and resolved.",
      mZh: "该机制是通过反射创建“子中心”。当一个元素被镜像时，对称轴变成一个新的、不可见的中心。通过在设计中填充数百个这样的小对称轴，我们创造了一个密集的中心场，使物体感觉坚固和已解决。",
      aEn: "Consider the traditional roof ridge. While the ridge itself might curve asymmetrically to adapt to a tree, the individual tiles remain perfectly symmetrical. Similarly, decorative ridge beasts and window frames exhibit strict symmetry. These thousands of local symmetries provide order within the larger freedom of the form.",
      aZh: "观察传统的屋脊。虽然屋脊本身可能会不对称地弯曲以适应树木，但单独的瓦片保持完美对称。同样，脊上的瑞兽和窗框也表现出严格的对称性。这成千上万的局部对称在形式的更大自由中提供了秩序。",
      gEn: "Do not simply mirror the entire building plan. Instead, write scripts that identify sub-components (windows, doors, column bases) and enforce strict symmetry on them. Allow the macro-arrangement of these components to be loose or adaptive, but ensure the components themselves are rigid in their symmetrical integrity.",
      gZh: "不要简单地镜像整个建筑平面图。相反，编写脚本来识别子组件（窗、门、柱基），并对它们强制执行严格的对称。允许这些组件的宏观排列是松散或适应性的，但要确保组件本身在对称完整性上是刚性的。",
      imageUrl: "/image/Local symmetries.png"
    },
    {
      n: 8, tEn: "Deep interlock and ambiguity", tZh: "深度嵌合",
      dEn: "Elements should not simply sit next to each other; they should interlock. Deep interlock occurs when the boundary between two centers is not a smooth line but a toothed, hooked, or interpenetrating zone. This ambiguity—where one part belongs to the other—binds the structure together indissolubly, making it impossible to separate the parts without destroying the whole.",
      dZh: "元素不应仅仅彼此相邻；它们应该嵌合。当两个中心之间的边界不是一条光滑的线，而是一个齿状、钩状或相互渗透的区域时，就会发生深度嵌合。这种模糊性——其中一部分属于另一部分——将结构不可分割地结合在一起，使得在不破坏整体的情况下分离部分成为不可能。",
      mEn: "The mechanism uses 'ambiguity of belonging'. By creating a spatial overlap or a physical joint where material A penetrates material B, a third center is created at the intersection. This third center belongs to both A and B, effectively 'glueing' them together structurally and visually.",
      mZh: "该机制利用“归属的模糊性”。通过在材料 A 穿透材料 B 的地方创建空间重叠或物理接头，在交叉处创建了第三个中心。这个第三中心既属于 A 也属于 B，有效地在结构和视觉上将它们“粘”在一起。",
      aEn: "The Dougong bracket system is the ultimate expression of deep interlock. Wood blocks are stacked in a way where vertical and horizontal forces weave together. No nails are used; the geometry itself locks the structure. Spatially, a porch that is half-inside and half-outside creates a similar interlock between the house and the garden.",
      aZh: "斗拱系统是深度嵌合的终极表达。木块以垂直和水平力交织的方式堆叠。不使用钉子；几何形状本身锁定了结构。在空间上，半内半外的门廊在房子和花园之间创造了类似的嵌合。",
      gEn: "In boolean operations, avoid simple 'Union' or 'Difference'. Use operations that create an intermediate zone. For example, instead of a straight wall, generate a crenellated or zigzag boundary. When connecting two volumes, create a third volume that acts as a 'spatial joint', overlapping with both parent volumes.",
      gZh: "在布尔运算中，避免简单的“并集”或“差集”。使用创建中间区域的运算。例如，不要使用直墙，而是生成锯齿状或之字形的边界。连接两个体积时，创建一个充当“空间接头”的第三体积，与两个父体积重叠。",
      imageUrl: "/image/Deep interlock and ambiguity.png"
    },
    {
      n: 9, tEn: "Contrast", tZh: "对比",
      dEn: "Life requires difference. Without contrast, the world is a gray sludge. This property demands that distinct parts of a structure should be visibly different in character—dark vs light, open vs closed, rough vs smooth. However, this is not chaotic difference; it is a structured contrast that clarifies the nature of each part. Contrast sharpens the identity of centers.",
      dZh: "生命需要差异。没有对比，世界就是一团灰色的淤泥。此属性要求结构的独特部分在特征上应明显不同——深与浅、开与闭、粗糙与光滑。然而，这不是混乱的差异；这是一种阐明每个部分性质的结构化对比。对比锐化了中心的身份。",
      mEn: "The mechanism is the unification of opposites. By placing two strongly opposing qualities side by side, the boundary between them becomes intense (a strong center). The interaction enhances both qualities—the white looks whiter next to black. The key is that the contrast must vary along a specific dimension (e.g., solid/void) to be meaningful.",
      mZh: "机制是对立面的统一。通过并列放置两种强烈对立的特质，它们之间的边界变得强烈（一个强中心）。这种相互作用增强了两种特质——白色在黑色旁边看起来更白。关键在于对比必须沿着特定维度（例如，实/虚）变化才有意义。",
      aEn: "A traditional pavilion often has a heavy, dark, massive stone base (Solid/Earth) contrasting with a light, soaring, intricate wooden roof (Void/Heaven). The walls are white plaster (Simple/Bright), while the frames are dark wood (Complex/Dark). This stark contrast clarifies the function of each element.",
      aZh: "传统的凉亭通常有一个沉重、黑暗、巨大的石基（实/地），与轻盈、高耸、精致的木屋顶（虚/天）形成对比。墙壁是白色灰泥（简单/明亮），而框架是深色木材（复杂/暗）。这种鲜明的对比阐明了每个元素的功能。",
      gEn: "The rendering engine must check for 'Histogram Equalization' in the design. If the distribution of mass or color is too uniform, the system intervenes. It artificially darkens the structural skeleton and lightens the infill panels. It thickens the base and thins the top. It ensures that 'Difference > Threshold' for adjacent semantic components.",
      gZh: "渲染引擎必须检查设计中的“直方图均衡化”。如果质量或颜色的分布过于均匀，系统会进行干预。它人为地加深结构骨架并加亮填充面板。它加厚底部并减薄顶部。它确保相邻语义组件的“差异 > 阈值”。",
      imageUrl: "/image/Contrast.png"
    },
    {
      n: 10, tEn: "Gradients", tZh: "渐变",
      dEn: "While contrast is necessary, abrupt changes can sometimes destroy the wholeness. Gradients soften the harshness of the world. A quality should slowly change across space. This property allows different centers to communicate with each other, transitioning from one state to another (e.g., dark to light, public to private) through a series of subtle steps.",
      dZh: "虽然对比是必要的，但突兀的变化有时会破坏整体性。渐变柔化了世界的严酷。一种特质应该在空间中缓慢变化。此属性允许不同的中心相互交流，通过一系列微妙的步骤从一种状态过渡到另一种状态（例如，从暗到亮，从公共到私有）。",
      mEn: "The mechanism is the serialized progression of properties. If we need to go from A to B, we introduce intermediate steps A1, A2, A3... This creates a directional flow in the structure, guiding the eye and body. It turns a static difference into a dynamic journey.",
      mZh: "机制是属性的序列化推进。如果我们需要从 A 到 B，我们要引入中间步骤 A1, A2, A3... 这在结构中创造了定向流动，引导眼睛和身体。它将静态差异转化为动态旅程。",
      aEn: "As one enters a temple complex, the level of privacy creates a gradient. You start at the noisy street, move to the semi-public outer yard, then the quieter inner court, and finally the silent sanctuary. The size of the spaces might also follow a gradient—large to medium to small—preparing the mind for the intimacy of the shrine.",
      aZh: "当你进入寺庙建筑群时，隐私程度创造了一个渐变。你从嘈杂的街道开始，移动到半公共的外院，然后是更安静的内院，最后是寂静的圣所。空间的大小也可能遵循一个渐变——大到中到小——为神龛的亲密感做好心理准备。",
      gEn: "In parametric design, use 'Graph Mappers' or easing functions (Sine, Cubic) to modify parameters over distance. Do not change the window size from 1.0m to 0.5m instantly. Instead, generate a facade array where widths constitute a sequence: 1.0, 0.9, 0.8... 0.5. This mathematical progression mimics organic growth.",
      gZh: "在参数化设计中，使用“图映射器”或���动函数（正弦、立方）来随距离修改参数。不要瞬间将窗口大小从 1.0m 更改为 0.5m。相反，生成一个立面阵列，其中宽度构成一个序列：1.0, 0.9, 0.8... 0.5。这种数学递进模仿了有机生长。",
      imageUrl: "/image/Gradients.png"
    },
    {
      n: 11, tEn: "Roughness", tZh: "粗糙性",
      dEn: "True order is not perfect; it is rough. Roughness does not mean sloppy; it means adaptive. A living structure adapts to the local conditions of its environment, which inevitably leads to irregularities. A machine-made straight line ignores the bump in the ground; a living wall curves around it. This 'imperfection' is the signature of a system that is truly paying attention to reality.",
      dZh: "真正的秩序不是完美的；它是粗糙的。粗糙并不意味着草率；它意味着适应。生命结构适应其环境的局部条件，这不可避免地导致不规则性。机器制造的直线忽略了地面的颠簸；有生命的墙则绕过它。这种“不完美”是真正关注现实的系统的标志。",
      mEn: "The mechanism is local relaxation. In a rigid grid, every node is forced to defined coordinates (x,y). In a rough grid, each node is allowed to shift (x+dx, y+dy) to minimize local tension or accommodate obstacles. The global order remains, but the local geometry is deformed to fit the context.",
      mZh: "机制是局部松弛。在刚性网格中，每个节点都被强制在定义的坐标 (x,y) 上。在粗糙网格中，每个节点都被允许移动 (x+dx, y+dy) 以最小化局部张力或适应障碍物。全局秩序保留，但局部几何变形以适应环境。",
      aEn: "Hand-made brick walls have a unique vitality because no two bricks are identical and the mortar joints vary slightly. The slight wobble in a timber column, following the grain of the tree, feels more 'right' than a perfect steel tube. It suggests the building was grown, not stamped.",
      aZh: "手工砖墙具有独特的生命力，因为没有两块砖是相同的，砂浆接缝也略有不同。顺应树木纹理的木柱的轻微摆动，感觉比完美的钢管更“对”。这表明建筑是生长出来的，而不是冲压出来的。",
      gEn: "To simulate life, we must introduce 'Perlin Noise' or controlled randomness into the vertex positions of the model. Apply a 'jitter' function to the grid points. However, this noise must be constrained; it is not chaos. It is a slight deviation from the ideal, simulating the entropy of material reality.",
      gZh: "为了模拟生命，我们必须在模型的顶点位置引入“柏林噪声”或受控随机性。对网格点应用“抖动”函数。然而，这种噪声必须受到约束；它不是混乱。它是对理想的轻微偏离，模拟物质现实的熵。",
      imageUrl: "/image/Roughness.png"
    },
    {
      n: 12, tEn: "Echoes", tZh: "回响",
      dEn: "Echoes occur when the same structural logic or family of shapes appears at different scales or in different materials throughout the design. This creates a deep sense of underlying unity. It is not exact repetition (which is boring), but a thematic resemblance—like family members who look alike but are not clones.",
      dZh: "当相同结构逻辑或形状家族出现在设计的不同尺度或不同材料中时，就会产生呼应。这创造了一种深层的潜在统一感。这不是精确的重复（那很无聊），而是一种主题上的相似性——就像家庭成员看起来很像但不是克隆人。",
      mEn: "The mechanism is the use of a 'generative seed' or fractal DNA. A specific angle, curve, or proportion is defined at the start and then applied recursively. If the roof has a 30-degree slope, the window lintels might echo that angle, and the paving pattern might also echo the same triangulation.",
      mZh: "机制是使用“生成种子”或分形 DNA。在开始时定义一个特定的角度、曲线或比例，然后递归应用。如果屋顶有 30 度的坡度，窗楣可能会呼应那个角度，铺路图案也可能呼应相同的三角剖分。",
      aEn: "In Gothic cathedrals, the pointed arch shape is everywhere: in the main nave, the windows, the doors, and the tiny decorative arcades. In Chinese architecture, the curve of the roof is often echoed in the curve of the bridge and the upturned corners of the furniture inside.",
      aZh: "在哥特式大教堂中，尖拱形状无处不在：在中殿、窗户、门和微小的装饰拱廊中。在中国建筑中，屋顶的曲线通常在桥的曲线和内部家具的翘角中得到呼应。",
      gEn: "Define a 'Style Transfer' matrix. If the main structure uses a specific Bezier curve profile, extracting that mathematical function and passing it to the furniture generation subroutine. Ensure that the 'Aspect Ratio' of the largest rectangle is preserved in the smallest subdivisions.",
      gZh: "定义一个“风格迁移”矩阵。如果主要结构使用特定的贝塞尔曲线轮廓，则提取该数学函数并将其传递给家具生成子程序。确保最大矩形的“纵横比”在最小细分中得以保留。",
      imageUrl: "/image/Echoes.png"
    },
    {
      n: 13, tEn: "The Void", tZh: "空性",
      dEn: "In the most intense centers, there is often a moment of pure silence. This is 'The Void'. It is not just emptiness; it is a charged field of stillness that acts as an organizing power for all the activity around it. Like the hub of a wheel or the eye of a storm, the void is the calm heart that makes the movement of the periphery possible.",
      dZh: "在最强烈的中心里，通常有一刻纯粹的寂静。这就是“空性”。它不仅仅是空虚；它是一个充满能量的静止场，作为周围所有活动的组织力量。就像轮毂或风暴眼一样，虚空是使外围运动成为可能的平静心脏。",
      mEn: "The mechanism is the deliberate preservation of an empty center bounded by intense structure. The structure creates a 'container' of high density, which contrasts with the zero density of the void. This potential difference creates a suction or focus that draws the spirit inward.",
      mZh: "机制是特意保留一个由高强度结构包围的空中心。结构创造了一个高密度的“容器”，与虚空的零密度形成对比。这种势差产生了一种吸力或焦点，将精神向内吸引。",
      aEn: "The Tianjing (Skywell) in Southern Chinese homes is a small, deep void open to the sky. It is not for walking; it is for light, rain, and air. It organizes the rooms around it. It is the spiritual lung of the house, empty yet full of nature's changing energy.",
      aZh: "中国南方住宅中的天井是一个向天空开放的小而深邃的虚空。它不是为了行走；它是为了光、雨和空气。它组织了周围的房间。它是房子的精神之肺，空旷却充满了大自然变化的能量。",
      gEn: "In the layout algorithm, explicitly reserve the coordinate (0,0) or the geometric centroid as a 'No-Build Zone'. Surround this zone with the highest density of agents or structural mass. The value of the Void is calculated by the density of the ring surrounding it.",
      gZh: "在布局算法中，明确将坐标 (0,0) 或几何质心保留为“禁止建设区”。用最高密度的代理或结构质量包围这个区域。虚空的价值由其周围环的密度计算。",
      imageUrl: "/image/The void.png"
    },
    {
      n: 14, tEn: "Simplicity and Inner Calm", tZh: "简洁与宁静",
      dEn: "The ultimate goal of living structure is not complexity for its own sake, but a state of simplicity. However, this is not the simplicity of a blank sheet of paper (minimalism); it is the simplicity of nature—a state where all internal contradictions have been resolved. The form feels calm because everything is exactly where it needs to be. It lacks friction.",
      dZh: "生命结构的最终目标本身不是复杂性，而是一种简洁的状态。然而，这不是一张白纸的简洁（极简主义）；它是大自然的简洁——一种所有内部矛盾都已解决的状态。形式感觉平静，因为一切都在它应该在的地方。它没有摩擦。",
      mEn: "The mechanism is the removal of structural noise. Any element that does not contribute to a center or a boundary is removed. Every line must have a purpose. This 'Occam's Razor' of design strips away the decorative ego, leaving only the structural truth. The result is a system in equilibrium.",
      mZh: "机制是消除结构噪音。任何不促成中心或边界的元素都会被移除。每一条线都必须有目的。这种设计的“奥卡姆剃刀”剥去了装饰性的自我，只留下了结构性的真理。结果是一个处于平衡状态的系统。",
      aEn: "A Zen temple or a well-proportioned Ming chair exudes this quality. There are no excess ornaments, no weird angles. The complexity of the joinery is hidden or resolved into simple, graceful lines. The object feels effortless, as if it naturally crystallized into that shape.",
      aZh: "一座禅宗寺庙或一把比例匀称的明式椅子散发着这种品质。没有多余的装饰，没有怪异的角度。细木工的复杂性被隐藏或分解为简单、优美的线条。物体感觉毫不费力，仿佛它自然结晶成了那个形状。",
      gEn: "Implement a 'Smoothing Pass' at the end of the generation. Analyze the mesh for high-frequency noise or unconnected vertices. Prune branches of the recursive tree that fail to terminate in strong centers. Minimize the number of unique angles and lengths to reduce entropy.",
      gZh: "在生成结束时实施“平滑通道”。分析网格的高频噪声或未连接的顶点。修剪未能在强中心终止的递归树的分支。最小化唯一角度和长度的数量以减少熵。",
      imageUrl: "/image/Simplicity and inner calm.png"
    },
    {
      n: 15, tEn: "Not-Separateness", tZh: "不可分离性",
      dEn: "Finally, a living structure is not separate from its surroundings. It does not sit 'on' the land; it grows 'out' of it. This property ensures that the field of centers inside the object extends smoothly into the world beyond. The object dissolves into its context, creating a larger wholeness that includes the environment.",
      dZh: "最后，生命结构与其周围环境不是分离的。它不是“坐”在土地上；它是从土地里“长”出来的。此属性确保物体内部的中心场平滑地延伸到外部世界。物体消解在它的语境中，创造了一个包含环境的更大的整体性。",
      mEn: "The mechanism is the blurring of the outer boundary. Instead of a hard line between building and nature, we create a zone of interpenetration—terraces, porches, steps, planting beds. The structure lowers its guard and invites the outside in, and extends its order outward.",
      mZh: "机制是外边界的模糊化。我们在建筑与自然之间不设硬线，而是创建一个相互渗透的区域——露台、门廊、台阶、花坛。结构放下防备，邀请外部进入，并将其秩序向外延伸。",
      aEn: "Fallingwater by Frank Lloyd Wright or a traditional mountain monastery demonstrates this. The rock becomes the foundation, the water flows under the floor. The materials of the building (stone, wood) match the materials of the site. One cannot say where the mountain ends and the temple begins.",
      aZh: "弗兰克·劳埃德·赖特的流水别墅或传统的山地修道院证明了这一点。岩石成为地基，水流过地板。建筑的材料（石头、木头）与场地的材料相匹配。人们无法说出山在哪里结束，寺庙从哪里开始。",
      gEn: "The generation box must include the terrain data. The algorithm should sample the 'Context Vectors' (sun path, wind, slope) and morph the building form to align with these vectors. Use 'Gradient Blending' for textures at the base of the mesh to merge with the ground plane.",
      gZh: "生成框必须包含地形数据。算法应该采样“上下文向量”（太阳路径、风、坡度）并使建筑形态变形以与这些向量对齐。对网格底部的纹理使用“渐变混合”以与地平面融合。",
      imageUrl: "/image/Not separateness.png"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1600px] mx-auto px-8 md:px-16 py-20">
        
        {/* SECTION 1 — HERO */}
        <div className="mb-32">
          <div className="grid md:grid-cols-2 gap-16 mb-16 items-end">
             <div>
                <h1 className="text-7xl md:text-8xl font-serif font-bold text-stone-900 mb-4 tracking-tighter leading-none">Living Structure</h1>
                <h1 className="text-5xl md:text-6xl font-serif text-stone-300 font-light">活力结构</h1>
             </div>
             <div className="border-l-2 border-stone-200 pl-8 py-2 md:mb-4">
                <BilingualParagraph 
                  label=""
                  en="A structural theory of wholeness, recursive hierarchy, and life in architecture."
                  zh="一种关于整体性、递归层级与建筑生命性的结构理论。"
                />
             </div>
          </div>

          <div className="relative w-full aspect-[21/9] bg-stone-100 mb-16 overflow-hidden">
             <ImageWithFallback 
                src="https://images.unsplash.com/photo-1598838665060-9a59c9b6683d"
                alt="Traditional Chinese Courtyard"
                className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 transition-all duration-1000 ease-out"
             />
             <div className="absolute bottom-6 left-6 text-white text-xs font-mono tracking-widest opacity-80 border-l border-white/50 pl-3">FIG 1.0 — TRADITIONAL SPATIAL WHOLENESS</div>
          </div>

          <div className="max-w-4xl mx-auto text-left pl-8 border-l-4 border-stone-900">
             <BilingualParagraph 
               label="Introduction / 简介"
               en="Living Structure understands life in architecture as an objective structural condition rather than stylistic expression. Wholeness emerges from recursive relationships among centers organized across multiple levels of scale. It is not a metaphor; it is a measurable field effect generated by geometry."
               zh="活力结构将建筑中的“生命”理解为一种客观结构状态，而非风格表达。整体性源于跨尺度组织的中心之间的递归关系。这不仅仅是一个隐喻；它是由几何形状产生的可测量的场效应。"
             />
          </div>
        </div>

        {/* SECTION 2 — CONCEPTUAL FOUNDATION */}
        <Section title="Conceptual Foundation" subTitle="概念基础">
          <div className="grid md:grid-cols-2 gap-20">
            <div className="space-y-8">
               <BilingualParagraph 
                 label="Wholeness as Recursive Center Structure / 整体性作为递归中心结构"
                 en="A whole is composed of centers. A center is not an isolated object but a relational field strengthened by surrounding centers. Strong centers emerge when recursive support relationships are established across scales. Just as an atom is made of a nucleus and electrons, a living building is made of centers organizing other centers."
                 zh="整体由中心构成。中心不是孤立物体，而是由周围中心强化的关系场。当跨尺度递归支撑关系建立时，强中心得以形成。就像原子由原子核和电子组成一样，有生命的建筑由组织其他中心的中心组成。"
               />
            </div>
            <div className="grid grid-cols-2 gap-6 h-80">
               <div className="bg-stone-50 border border-stone-200 h-full p-6">
                  <RecursiveCenterDiagram />
                  <p className="text-[10px] text-center mt-4 text-stone-400 font-mono tracking-widest">DIAGRAM: CENTER FIELD</p>
               </div>
               <div className="bg-stone-50 border border-stone-200 h-full overflow-hidden relative grayscale">
                   <ImageWithFallback 
                      src="https://images.unsplash.com/photo-1610650394144-a778795cf585"
                      alt="Plan Hierarchy"
                      className="w-full h-full object-cover mix-blend-multiply opacity-80"
                   />
                   <p className="text-[10px] text-center mt-2 absolute bottom-4 w-full text-stone-600 font-mono bg-white/80 py-1">PLAN: SPATIAL HIERARCHY</p>
               </div>
            </div>
          </div>
        </Section>

        {/* SECTION 3 — TWO STRUCTURAL LAWS */}
        <Section title="Structural Laws" subTitle="结构的两条基本规律">
           <div className="grid md:grid-cols-2 gap-16">
             {/* Law 1 */}
             <div className="group">
                <div className="aspect-[4/3] bg-stone-100 mb-8 overflow-hidden relative border border-stone-200">
                   <ImageWithFallback 
                      src="https://images.unsplash.com/photo-1719985968746-20cfb5634cc9"
                      alt="Scaling Hierarchy"
                      className="w-full h-full object-cover grayscale opacity-90 group-hover:scale-105 transition-transform duration-700"
                   />
                   <div className="absolute top-4 right-4 text-6xl font-serif text-white font-bold opacity-40 mix-blend-overlay">I</div>
                </div>
                <BilingualParagraph 
                  label="1. Scaling Law / 尺度规律"
                  en="Far more small centers than large ones. In living architecture, the number of spatial elements increases as scale decreases, forming hierarchical scaling. This follows a power law distribution, similar to the branching of trees or the circulatory system."
                  zh="小尺度中心远多于大尺度中心。在有生命的建筑中，空间元素的数量随着尺度的减小而增加，形成层级尺度。这遵循幂律分布，类似于树木的分支或循环系统。"
                />
             </div>

             {/* Law 2 */}
             <div className="group">
                <div className="aspect-[4/3] bg-stone-100 mb-8 overflow-hidden relative border border-stone-200">
                   <ImageWithFallback 
                      src="https://images.unsplash.com/photo-1758543710327-89e7674894f2"
                      alt="Local Similarity"
                      className="w-full h-full object-cover grayscale opacity-90 group-hover:scale-105 transition-transform duration-700"
                   />
                   <div className="absolute top-4 right-4 text-6xl font-serif text-white font-bold opacity-40 mix-blend-overlay">II</div>
                </div>
                <BilingualParagraph 
                  label="2. Local Similarity / 局部相似规律"
                  en="Nearby things are more or less similar. Spatial coherence is maintained through gradual differentiation rather than abrupt change. This does not mean identical repetition, but rather a statistical similarity that binds the local region into a recognizable fabric."
                  zh="相邻事物趋于相似。空间连贯性通过渐进分化维持，而非突变。这并不意味着完全相同的重复，而是一种统计上的相似性，将局部区域结合成可识别的肌理。"
                />
             </div>
           </div>
        </Section>

        {/* SECTION 4 — FIFTEEN PROPERTIES */}
        <Section title="15 Properties" subTitle="十五种基本结构属性">
           <div className="mb-16 border-b border-stone-200 pb-8">
              <p className="text-lg text-stone-600 font-serif max-w-3xl leading-relaxed">The fifteen properties are not independent rules, but recurrent structural patterns found in all living systems. They appear together to form a unified field of centers. Below is the detailed structural analysis of each property.</p>
           </div>
           
           <div className="space-y-0">
             {properties.map(p => (
               <PropertyBlock 
                 key={p.n}
                 number={p.n}
                 titleEn={p.tEn}
                 titleZh={p.tZh}
                 defEn={p.dEn}
                 defZh={p.dZh}
                 mechEn={p.mEn}
                 mechZh={p.mZh}
                 archEn={p.aEn}
                 archZh={p.aZh}
                 genEn={p.gEn}
                 genZh={p.gZh}
                 imageUrl={p.imageUrl}
               />
             ))}
           </div>
        </Section>
        
        {/* SECTION 5 — MATH MODEL */}
        <Section title="Mathematical Model" subTitle="活力结构的量化表达">
           <div className="grid md:grid-cols-2 gap-20 items-center bg-stone-50 p-16 border border-stone-200">
              <div>
                 <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-8">Vitality Equation</h3>
                 <div className="text-7xl md:text-9xl font-serif font-bold text-stone-900 mb-10 tracking-tight">
                   L = S × H
                 </div>
                 <div className="space-y-6 font-mono text-sm text-stone-600 border-l-2 border-stone-300 pl-8">
                    <div className="flex justify-between border-b border-stone-200 pb-4">
                       <span className="font-bold text-stone-900">L (Vitality)</span>
                       <span>Overall Living Intensity</span>
                    </div>
                    <div className="flex justify-between border-b border-stone-200 pb-4">
                       <span className="font-bold text-stone-900">S (Structure)</span>
                       <span>Structural Coherence (Network Centrality)</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="font-bold text-stone-900">H (Harmony)</span>
                       <span>Hierarchical Depth (Scaling Index)</span>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <div className="aspect-square bg-stone-200 flex items-center justify-center border border-stone-300">
                       <div className="w-24 h-24 border-2 border-stone-400"></div>
                    </div>
                    <div className="text-center">
                       <div className="text-sm font-bold text-stone-900 uppercase tracking-widest">Modern Box</div>
                       <div className="text-xs font-mono text-stone-500 mt-1">L = 1.2 (Low)</div>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div className="aspect-square bg-stone-200 overflow-hidden border border-stone-300 relative grayscale">
                       <ImageWithFallback 
                          src="https://images.unsplash.com/photo-1719985968746-20cfb5634cc9"
                          alt="Complex Structure"
                          className="w-full h-full object-cover"
                       />
                    </div>
                    <div className="text-center">
                       <div className="text-sm font-bold text-stone-900 uppercase tracking-widest">Living Structure</div>
                       <div className="text-xs font-mono text-stone-500 mt-1">L = 8.5 (High)</div>
                    </div>
                 </div>
              </div>
           </div>
        </Section>

        {/* Footer */}
        <div className="pt-16 border-t-2 border-stone-900 flex flex-col md:flex-row justify-between text-[11px] text-stone-400 font-mono tracking-widest uppercase gap-6">
           <span>Living Structure Research Platform</span>
           <span>Academic Reference © 2024</span>
           <span>Elsevier Digital System</span>
        </div>
      </div>
    </div>
  );
}
