import React, { useState, useRef } from "react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { cn, Badge } from "@/app/components/ui";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowLeft, Quote, Info, Check, X,
  Columns, ScanLine, MoveHorizontal,
  Eye, Layers, ArrowUpRight, Leaf, Building2, BookOpen, Sparkles, Microscope, Loader2, RefreshCcw,
  Heart, Box, Brain, Activity
} from "lucide-react";
import { useLanguage } from "@/app/i18n/LanguageContext";
import { useGemini } from '../hooks/useGemini';

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
    natureEn: "A microscopic cross-section of biological tissue reveals nested scales: large cell clusters contain medium cells, each housing yet smaller organelles—a seamless cascade of distinct levels, each scale strengthening the ones above and below.",
    natureZh: "生物组织的显微截面揭示了嵌套的尺度层级：大细胞群包含中等细胞，每个细胞又容纳更小的细胞器——层层嵌套，形成无缝级联，每个尺度都强化着上下相邻的层级。",
    exampleEn: "The architectural facade in the left image exhibits a rich scaling hierarchy through the use of variably sized windows and brickwork. The fenestration is further subdivided by frames into smaller panes, while the brick surfaces feature subtle textures. This creates a multi-level scalar structure that transitions seamlessly from the overall facade to the windows, subdivisions, bricks, and finally to the micro-textures.In contrast, the facade in the right image lacks such intricate articulation of its windows and wall surfaces. Its overall texture and detailing are relatively monotonous, resulting in a flat scaling hierarchy and a comparatively bland appearance.",
    exampleZh: "左图展示的建筑立面通过不同大小的窗户和墙面砖块体现了丰富的尺度层次。窗户由窗框进一步划分为小的分格，而砖块表面还有细腻的纹理，形成了从立面整体到窗户、分格、砖块，再到纹理的多重尺度层级。右图的建筑立面缺乏窗户和墙面的细致划分，整体纹理和细节也较为单一，导致其尺度层次单薄，显得较为平淡。",
    imgPos: "/images/level of scale.png",
    imgNeg: "/images/LOSNEG.png",
    bookImg: "/images/LOSP.png"
  },
  {
    n: 2, tEn: "Strong Centers", tZh: "强中心",
    quoteEn: "The strength of the centers dictates the cohesion and order of spatial organization.",
    quoteZh: "中心的强度决定了空间的组织是否紧密有序。",
    mechEn: "Strength depends on relational density (S).",
    mechZh: "强度取决于关系密度 S。",
    relEn: "Primarily increases S (Strength) by intensifying focus.",
    relZh: "通过强化焦点主要增加 S（强度）。",
    natureEn: "Each orchid bloom is organized around an intensely focused center—its patterned lip—with every petal curving inward to reinforce it. The whole cluster becomes a field of mutually intensifying strong centers, each making the others more vivid.",
    natureZh: "每朵兰花都围绕一个极度聚焦的中心——其斑纹唇瓣——每片花瓣向内弯曲以强化它。整个花簇成为相互强化的强中心场，每一个中心都使其他中心更加鲜明。",
    exampleEn: "The residence in the left image reinforces its 'strong centers' through its spatial configuration. Within each room, the arrangement of furniture establishes local centers, while the overall architecture unfolds around a central courtyard. The courtyard and the main hall serve as the core spaces, fostering closer human connections. Crucially, this centricity is derived not solely from the courtyard itself, but relies on the holistic organization of the adjacent rooms and furnishings. These elements mutually reinforce one another, collectively enhancing the spatial hierarchy.Conversely, the architecture in the right image lacks definitive centers. Its spatial layout is fragmented, leading to dispersed and isolated human activities devoid of organic connection.",
    exampleZh: "左图的住宅通过空间组织强化了中心性。每个房间内部由家具布局形成局部中心，而整个建筑围绕庭院展开，庭院和大厅成为核心空间，使人们的生活更加紧密联系。这种中心性不仅来自庭院本身，还依赖于周围房间和家具的整体组织，它们相互衬托，共同强化空间的层次感。相比之下，右图的建筑缺乏清晰的中心，空间分散，人们的活动更为松散和孤立，缺少有机的联系。",
    imgPos: "/images/Strong centers.png",
    imgNeg: "/images/SCNEG.png",
    bookImg: "/images/SCP.png"
  },
  {
    n: 3, tEn: "Boundaries", tZh: "边界",
    quoteEn: "Boundaries create transitional layers that strengthen centers.",
    quoteZh: "边界通过过渡层强化中心。",
    mechEn: "Layered edges stabilize spatial continuity.",
    mechZh: "层级边界增强空间连续性。",
    relEn: "Increases S (Strength) by containing energy.",
    relZh: "通过包含能量增加 S（强度）。",
    natureEn: "Amazon oxbow lakes seen from above: each circular pool is enclosed by a dense ring of forest—a boundary as substantial as the water itself, giving each lake its identity as a strong center and tying it to the surrounding land.",
    natureZh: "从空中俯瞰亚马逊牛轭湖：每一个圆形水面都被浓密的森林环绕——这道边界与水体本身同等厚实，赋予每个湖泊强中心的身份，同时将它与周围陆地紧密相连。",
    exampleEn: "The left image shows the Gwalior Fort in India. The top-level railing acts as a boundary, highlighting the architectural facade as the center while harmonizing the relationship between the sky and the facade. The right image shows a 20th-century apartment building; due to a lack of boundaries, the architecture appears isolated from its surroundings. Boundaries exist not only on the exterior but also permeate through the various hierarchies within the center. In the Gwalior Fort, boundaries are incorporated across all scales—from railings and columns to wall surfaces. Internally, each boundary is composed of even smaller centers and boundaries, progressing hierarchically to achieve a rich and unified whole.",
    exampleZh: "左图为印度瓜廖尔城堡，顶层的围栏作为边界，凸显了建筑立面这一中心，同时协调了天空与立面的关系。右图为一座20世纪公寓，因缺乏边界，建筑显得孤立于周围环境。边界不仅存在于外部，也贯穿于中心内部的各个等级。在瓜廖尔城堡中，围栏、立柱、墙面等各尺度都包含边界，每个边界内部又由更小的中心和边界组成，层层递进，丰富统一。",
    imgPos: "/images/Boundaries.png",
    imgNeg: "/images/BN.png",
    bookImg: "/images/BP.png"
  },
  {
    n: 4, tEn: "Alternating Repetition", tZh: "交替重复",
    quoteEn: "Simple repetition is mechanical and lifeless. Living repetition is alternating.",
    quoteZh: "简单的重复是机械且无生命的。有生命的重复是交替的。",
    mechEn: "A special form of alternating repetition refers to the alternating occurrence of two or more vibrant centers, creating a unique rhythm. By mutually accentuating one another, they enhance the overall vitality of the whole.",
    mechZh: "特殊的“交替重复”指两种或多种富有活力的中心交替出现，形成独特的韵律，彼此衬托，增强整体的活力。",
    relEn: "Increases H (Hierarchy) through rhythmic complexity.",
    relZh: "通过节奏复杂性增加 H（层级）。",
    natureEn: "A fern frond is a living lesson in alternating repetition: pinnae alternate left and right along the stem, and each pinna is itself built of further alternating sub-leaflets—the same rhythm operating recursively at two nested scales simultaneously.",
    natureZh: "蕨叶是交替重复的自然教材：羽片沿茎秆左右交替排列，每片羽叶本身又由交替的小叶构成——同一节奏在两个嵌套尺度上同时递归运作。",
    exampleEn: "Designs featuring alternating repetition follow two principles. First, the substructures participating in the alternation must themselves possess vitality.The left image shows Brunelleschi's Hospital (Ospedale degli Innocenti) in Florence, Italy. On its facade, columns, arches, circular medallions, and intercolumnar spaces alternate. Each substructure is imbued with life, generating an overall vitality through alternating repetition. The right image depicts the colonnade of a modern building; although there is an alternation between the columns and the spaces between them, the overall structure lacks vitality because the substructures are monotonous and mechanical.Furthermore, alternating repetition exists within organizations across different scales. Small-scale substructures form large-scale substructures through alternating repetition, and these large-scale structures construct an even larger whole in a similar manner. In the left image, the arched colonnade and the intercolumnar spaces form a large-scale alternating repetition, while each individual arch creates a small-scale alternating repetition through its convex and concave curved lines. This cross-scale recursive organization ensures that the design is full of vitality at every level.",
    exampleZh: "具有“交替重复”的设计遵循两个原则。首先，参与交替的子结构本身需要是有活力的。左图为意大利佛罗伦萨布鲁内莱斯基医院，其立面中柱子、圆拱、圆形符号以及柱间空间交替出现，每个子结构都富有活力，通过交替重复形成整体的活力。右图为某现代建筑的柱廊，尽管存在柱子与柱间空间的交替，但因子结构单调机械，整体显得缺乏活力。此外，“交替重复”存在于不同尺度的组织中。小尺度的子结构通过交替重复形成大尺度的大结构，而大尺度的结构又以类似方式构成更大的整体。左图中拱形柱廊与柱间空间形成大尺度的交替重复，而每个圆拱本身又通过凸起与凹陷的弧形线条在小尺度形成交替重复。这种跨尺度的递归组织，使设计在每个层级都充满活力。",
    imgPos: "/images/Alternating repetition.png",
    imgNeg: "/images/ARNEG.png",
    bookImg: "/images/ARP.png"
  },
  {
    n: 5, tEn: "Positive Space", tZh: "正空间",
    quoteEn: "Space is not merely the residue between objects but a distinct entity.",
    quoteZh: "空间不仅仅是物体之间的残留物，而是一个独立的实体。",
    mechEn: "The mechanism for creating positive space is enclosure and convexity.",
    mechZh: "创造正空间的机制是围合和凸性。",
    relEn: "Increases S (Strength) by shaping the void.",
    relZh: "通过塑造虚空增加 S（强度）。",
    natureEn: "A cluster of mineral crystals leaves no leftover void: each faceted form presses against its neighbors so that every gap between crystals is itself a well-defined, positive shape—the space between is as alive as the solid matter.",

    natureZh: "矿物晶体簇不留任何剩余虚空：每个多面体形态与邻居紧紧相抵，使晶体间的每个间隙本身也成为明确的正面形状——间隙中的空间与固体物质同样充满生命力。",

    exampleEn: "A public square defined by continuous building facades.",
    exampleZh: "由连续建筑立面定义的公共广场。",
    imgPos: "/images/Positive space.png", imgNeg: "/images/PSNEG.png", bookImg: "/images/PP.png"
  },
  {
    n: 6, tEn: "Good Shape", tZh: "良好形状",
    quoteEn: "Every element in a living structure should have a 'good shape'—simple and coherent.",
    quoteZh: "活力结构中的每个元素都应该有一个“良形”——简单且连贯。",
    mechEn: "Mechanism implies compactness and elementary geometry (squares, circles).",
    mechZh: "机制意味着紧凑性和基本几何（正方形、圆形）。",
    relEn: "Increases S (Strength) through geometric coherence.",
    relZh: "通过几何连贯性增加 S（强度）。",
    natureEn: "This three-lobed leaf embodies good shape at every level: the overall silhouette is strong and compact, each lobe is a coherent sub-center with graceful convex curves, and the veins subdivide every surface into still smaller positive, well-shaped areas.",

    natureZh: "这片三裂叶片在每个层级都体现出良好形状：整体轮廓强健紧凑，每个裂片是具有优美凸曲线的连贯子中心，叶脉又将每个表面细分为更小的正面、形状良好的区域。",

    exampleEn: "A perfectly proportioned rectangular window or circular arch.",
    exampleZh: "比例完美的矩形窗或圆拱。",
    imgPos: "/images/Good shape.png", imgNeg: "/images/GSNEG.png", bookImg: "/images/GSP.png"
  },
  {
    n: 7, tEn: "Local Symmetries", tZh: "局部对称",
    quoteEn: "Small parts of the structure should be symmetrical within themselves.",
    quoteZh: "结构的微小部分在自身内部应对称。",
    mechEn: "The mechanism is the creation of 'sub-centers' through reflection.",
    mechZh: "该机制是通过反射创建“子中心”。",
    relEn: "Increases S (Strength) by binding centers locally.",
    relZh: "通过局部结合中心增加 S（强度）。",
    natureEn: "In a meadow of bunchberry blossoms, each four-petaled flower is perfectly symmetrical in itself, and each whorl of leaves has its own local axis—yet the whole carpet has no grand global axis, only an infinite weaving of small, independent symmetries.",

    natureZh: "草地上的白花草丛中，每朵四瓣小花本身完全对称，每组轮生叶片有其自身的局部轴线——然而整片植被没有宏大的整体轴，只有无数小而独立的对称性相互交织。",

    exampleEn: "Ornaments, door frames, or individual tiles having internal symmetry.",
    exampleZh: "装饰品、门框或单个瓷砖具有内部对称性。",
    imgPos: "/images/Local symmetries.png", imgNeg: "/images/LSNEG.png", bookImg: "/images/LSP.png"
  },
  {
    n: 8, tEn: "Deep Interlock and Ambiguity", tZh: "深度交织与模糊性",
    quoteEn: "Elements should not simply sit next to each other; they should interlock.",
    quoteZh: "元素不应仅仅彼此相邻；它们应该嵌合。",
    mechEn: "The mechanism uses 'ambiguity of belonging' where material A penetrates material B.",
    mechZh: "该机制利用“归属的模糊性”，即材料 A 穿透材料 B。",
    relEn: "Increases S (Strength) by fusing adjacent centers.",
    relZh: "通过融合相邻中心增加 S（强度）。",
    natureEn: "The giraffe's reticulated coat is a masterclass in deep interlock: dark polygonal patches and the cream network between them so deeply interpenetrate that no simple line divides them—each color belongs, ambiguously, to the other's domain.",

    natureZh: "长颈鹿的网状花纹是深度交织的自然杰作：深色多边形斑块与奶油色网络如此深度相互渗透，没有简单的线条可以将它们分开——每种颜色都模糊地归属于另一种颜色的领域。",

    exampleEn: "Dove-tail joints in wood or interlocking paving stones.",
    exampleZh: "木材中的燕尾榫或互锁铺路石。",
    imgPos: "/images/Deep interlock and ambiguity.png", imgNeg: "/images/DNEG.png", bookImg: "/images/DIAP.png"
  },
  {
    n: 9, tEn: "Contrast", tZh: "对比",
    quoteEn: "Life requires difference. Distinct parts should be visibly different in character.",
    quoteZh: "生命需要差异。独特部分在特征上应明显不同。",
    mechEn: "The mechanism is the unification of opposites, enhancing both qualities.",
    mechZh: "机制是对立面的统一，增强了两种特质。",
    relEn: "Increases S (Strength) by clarifying distinction.",
    relZh: "通过阐明区别增加 S（强度）。",
    natureEn: "The Purple Emperor butterfly lives through contrast: iridescent blue-violet flares against deep reddish-brown wings, while stark white spots punctuate both. Each color sharpens the others—the blue would not glow without the dark ground surrounding it.",

    natureZh: "闪蛱蝶以对比为生：虹彩蓝紫色在深红棕色翅膀上闪耀，鲜白色斑点贯穿其间。每种颜色使其他颜色更加鲜锐——若没有包围它的深色背景，蓝色便无法如此耀眼。",

    exampleEn: "Light against dark, rough stone against smooth plaster.",
    exampleZh: "明与暗，粗糙石头与光滑灰泥。",
    imgPos: "/images/Contrast.png", imgNeg: "/images/CNEG.png", bookImg: "/images/CP.png"
  },
  {
    n: 10, tEn: "Gradients", tZh: "渐变",
    quoteEn: "A quality should slowly change across space to soften harshness.",
    quoteZh: "一种特质应该在空间中缓慢变化以柔化严酷。",
    mechEn: "The mechanism is the serialized progression of properties (A1, A2, A3...).",
    mechZh: "机制是属性的序列化推进（A1, A2, A3...）。",
    relEn: "Increases H (Hierarchy) by connecting scales.",
    relZh: "通过连接尺度增加 H（层级）。",
    natureEn: "The nautilus shell cross-section is the archetype of gradient: each chamber grows smoothly larger as it spirals outward, curvature and spacing changing in one continuous flow from the tight inner whorl to the vast outer arc—no jumps, only gradual transformation.",

    natureZh: "鹦鹉螺截面是渐变的原型：每个腔室随螺旋向外平滑地增大，曲率与间距在一次连续的流动中变化，从细密的内圈到宽阔的外弧——没有跳跃，只有渐进的转化。",

    exampleEn: "Steps of a staircase or diminishing sizes of arches.",
    exampleZh: "楼梯的台阶或逐渐缩小的拱门。",
    imgPos: "/images/Gradients.png", imgNeg: "/images/GRNEG.png", bookImg: "/images/GP.png"
  },
  {
    n: 11, tEn: "Roughness", tZh: "粗糙性",
    quoteEn: "True order is not perfect; it is rough and adaptive to local conditions.",
    quoteZh: "真正的秩序不是完美的；它是粗糙的且适应局部条件。",
    mechEn: "The mechanism is local relaxation of the grid to minimize tension.",
    mechZh: "机制是网格的局部松弛以最小化张力。",
    relEn: "Increases S (Strength) by adapting to reality.",
    relZh: "通过适应现实增加 S（强度）。",
    natureEn: "The zebra's stripes exemplify living roughness: no two stripes are exactly the same width, each curves differently, each adapts to the body's local contour. This imperfect regularity is precisely what gives them life—mechanical perfection would make them dead.",

    natureZh: "斑马的条纹是活力粗糙性的典型：没有两条条纹宽度完全相同，每条曲线各异，每条都随身体局部轮廓自适应调整。这种不完美的规律性正是赋予它们生命的东西——机械的完美反而会使它们失去活力。",

    exampleEn: "Hand-laid brick walls with slight irregularities.",
    exampleZh: "手工砌筑的略带不规则的砖墙。",
    imgPos: "/images/Roughness.png", imgNeg: "/images/RNEG.png", bookImg: "/images/RP.png"
  },
  {
    n: 12, tEn: "Echoes", tZh: "共鸣",
    quoteEn: "The same structural logic appears at different scales throughout the design.",
    quoteZh: "相同结构逻辑出现在设计的不同尺度中。",
    mechEn: "The mechanism is the use of a 'generative seed' or fractal DNA recursively.",
    mechZh: "机制是递归使用“生成种子”或分形 DNA。",
    relEn: "Increases H (Hierarchy) through self-similarity.",
    relZh: "通过自相似性增加 H（层级）。",
    natureEn: "An X-ray of a lily reveals a single family of forms: the sweeping curves of the petals echo the curve of the trumpet, which echoes the bend of the stem and the arc of the stamens—every part is a variation on one deep morphological theme.",

    natureZh: "百合花的X光图像揭示了同一形态家族：花瓣的弧线呼应花管的曲线，花管又呼应茎秆的弯曲与雄蕊的弧度——每个部分都是同一深层形态主题的变奏。",

    exampleEn: "The curve of a dome echoed in the arches below it.",
    exampleZh: "圆顶的曲线在其下方的拱门中得到呼应。",
    imgPos: "/images/Echoes.png", imgNeg: "/images/ENEG.png", bookImg: "/images/EP.png"
  },
  {
    n: 13, tEn: "The Void", tZh: "虚空",
    quoteEn: "In the most intense centers, there is often a moment of pure silence.",
    quoteZh: "在最强烈的中心里，通常有一刻纯粹的寂静。",
    mechEn: "The mechanism is the deliberate preservation of an empty center bounded by structure.",
    mechZh: "机制是特意保留一个由结构包围的空中心。",
    relEn: "Increases S (Strength) by creating a calm center.",
    relZh: "通过创造平静中心增加 S（强度）。",
    natureEn: "In a mountain canyon, the river valley is the void: a calm, luminous emptiness carved through layer upon layer of ridges. The surrounding mountains—dense with texture—make this silence powerful; without them, the void would have no force.",

    natureZh: "在山脉峡谷中，河谷就是虚空：一片平静、明亮的空旷，穿切过层层叠叠的山脊。周围群山——充满丰富纹理——使这份寂静强大有力；没有它们，虚空便失去力量。",

    exampleEn: "An empty altar or a quiet central courtyard.",
    exampleZh: "左图为开罗拜巴尔清真寺，其中央中庭作为“虚空”，让周边小房间更有活力和秩序感。右图为某办公空间，缺乏中央虚空，满是小房间，显得拥挤、嘈杂。",
    imgPos: "/images/The void.png", imgNeg: "/images/VNEG.png", bookImg: "/images/VP.png"
  },
  {
    n: 14, tEn: "Simplicity and Inner Calm", tZh: "简洁与内在平静",
    quoteEn: "The form feels calm because everything is exactly where it needs to be.",
    quoteZh: "形式感觉平静，因为一切都在它应该在的地方。",
    mechEn: "The mechanism is the removal of structural noise (Occam's Razor).",
    mechZh: "机制是消除结构噪音（奥卡姆剃刀）。",
    relEn: "Increases S (Strength) by removing friction.",
    relZh: "通过消除摩擦增加 S（强度）。",
    natureEn: "A Tuscan wheat field in summer: the vast sweep of grain, a single row of cypresses on the ridge, a plain sky. Everything unnecessary has been stripped away by nature and time; what remains is so distilled to essentials that it radiates absolute inner calm.",

    natureZh: "夏日托斯卡纳麦田：大片连绵的麦浪，山脊上一排孤立的柏树，简洁的天空。一切多余之物已被自然与时间剔除；剩下的只是本质，却因此焕发出绝对的内在宁静。",

    exampleEn: "A Shaker chair or a Zen garden.",
    exampleZh: "震颤派椅子或禅宗花园。",
    imgPos: "/images/Simplicity and inner calm.png", imgNeg: "/images/SINEG.png", bookImg: "/images/SICP.png"
  },
  {
    n: 15, tEn: "Not-Separateness", tZh: "非分离性",
    quoteEn: "A living structure is not separate from its surroundings; it grows out of them.",
    quoteZh: "活力结构与其周围环境不是分离的；它是从中生长出来的。",
    mechEn: "The mechanism is the blurring of the outer boundary through interpenetration.",
    mechZh: "机制是通过相互渗透模糊外边界。",
    relEn: "Increases H (Hierarchy) by connecting to the largest whole.",
    relZh: "通过连接到最大整体增加 H（层级）。",
    natureEn: "Magnetic domains in a cobalt crystal under the microscope: each domain merges imperceptibly into its neighbors with no hard edge—only a gradual transition where one field dissolves into the next. No domain is separate; all are one continuous, indivisible whole.",

    natureZh: "显微镜下钴晶体的磁畴：每个磁畴与相邻磁畴不可察觉地融合，没有硬边——只有一个磁场逐渐溶入下一个的过渡。没有任何磁畴是孤立的；所有磁畴共同构成一个连续、不可分割的整体。",

    exampleEn: "A building that steps down the hillside, merging with the terrain.",
    exampleZh: "顺山势而下的建筑，与地形融为一体。",
    imgPos: "/images/Not separateness.png", imgNeg: "/images/NSNEG.png", bookImg: "/images/NSP.png"
  }
];

interface CenterNode {
  x: number;
  y: number;
  r: number;
  label: string;
}

interface CaseStudy {
  id: string;
  name: string;
  nameZh: string;
  dynasty: string;
  dynastyZh: string;
  location: string;
  locationZh: string;
  category: string;
  categoryZh: string;
  lValue: number;
  bValue: string;
  description: string;
  descriptionZh: string;
  imageUrl: string;
  diagramUrl: string;
  elevationUrl: string;
  levels: number[];
  relatedProperties: number[];
  centers?: CenterNode[];
}

const CATEGORIES = [
  { id: "all", en: "All Types", zh: "全部" },
  { id: "residential", en: "Residential", zh: "住宅" },
  { id: "temple", en: "Temple", zh: "庙宇" },
  { id: "educational", en: "Educational", zh: "教学楼" },
  { id: "commercial", en: "Commercial", zh: "商业" },
  { id: "medical", en: "Medical", zh: "医院" },
  { id: "palace_garden", en: "Palace", zh: "宫殿/坛庙" },
];

const cases: CaseStudy[] = [
  // ── 住宅 Residential ──────────────────────────────────────
  {
    id: "langjiali",
    name: "Langjiali Folk House",
    nameZh: "郎家里江南民居",
    dynasty: "Ming & Qing",
    dynastyZh: "明清时期",
    location: "Linhai, Zhejiang",
    locationZh: "浙江台州",
    category: "residential",
    categoryZh: "住宅",
    lValue: 22038,
    bValue: "6 / 15",
    description: "Jiangnan folk houses are a vital component of traditional Chinese residential architecture. Characterized by facing south for sunlight, structured around light wells.",
    descriptionZh: "典型江南水乡民居，围绕天井展开，木梁承重。从街巷到天井再到厅堂的层层递进，展现了丰富的尺度层级。",
    imageUrl: "/cnts/LJNMJ.png",
    diagramUrl: "/cnts/LJNMJ.png",
    elevationUrl: "/cnts/LJNMJ.png",
    levels: [4, 10, 36, 123, 533, 2967],
    relatedProperties: [1, 3, 11, 15],
    centers: [
      { x: 50, y: 30, r: 80, label: "Main Ridge (主脊)" },
      { x: 30, y: 60, r: 60, label: "Gable Wall (山墙)" },
      { x: 70, y: 60, r: 60, label: "Courtyard Entry (庭院入口)" }
    ]
  },
  {
    id: "guangdong_residence",
    name: "Guangdong Residence",
    nameZh: "广东旧址住宅",
    dynasty: "1871",
    dynastyZh: "1871年建",
    location: "Guangdong",
    locationZh: "广东",
    category: "residential",
    categoryZh: "住宅",
    lValue: 38706,
    bValue: "7 / 15",
    description: "A traditional Guangdong residence featuring 'wok-handle' roof walls. The complex layout of courtyards produces a high degree of living structure.",
    descriptionZh: "传统岭南民居，以经典的镬耳墙为特征。其复杂的院落布局和深层交织产生了极高的生命活力结构得分。",
    imageUrl: "/cnts/guangdong_residence.png",
    diagramUrl: "/cnts/guangdong_residence.png",
    elevationUrl: "/cnts/guangdong_residence.png",
    levels: [3, 9, 31, 169, 913, 5326],
    relatedProperties: [2, 5, 8, 12],
    centers: [
      { x: 50, y: 50, r: 100, label: "Main Courtyard (主院)" }
    ]
  },
  // ── 庙宇 Temple ──────────────────────────────────────
  {
    id: "jingci_temple",
    name: "Jingci Temple",
    nameZh: "净慈寺",
    dynasty: "Song Dynasty (Relic)",
    dynastyZh: "宋代始建",
    location: "Hangzhou, Zhejiang",
    locationZh: "浙江杭州",
    category: "temple",
    categoryZh: "庙宇",
    lValue: 19764,
    bValue: "10 / 15",
    description: "A prominent Buddhist temple featuring profound 'Voids' in its courtyards. The alternating repetition of halls and open spaces generates spiritual calmness.",
    descriptionZh: "著名的佛教寺庙，其庭院展现了深邃的'虚空'。殿堂与开阔空间的交替重复营造出精神上的宁静感。",
    imageUrl: "/cnts/jingci_temple.png",
    diagramUrl: "/cnts/jingci_temple.png",
    elevationUrl: "/cnts/jingci_temple.png",
    levels: [4, 11, 27, 90, 318, 2844],
    relatedProperties: [4, 13, 14],
    centers: [
      { x: 50, y: 60, r: 90, label: "Main Hall (大雄宝殿)" }
    ]
  },
  {
    id: "shengmu_temple",
    name: "Shengmu Temple",
    nameZh: "圣母庙",
    dynasty: "Song Dynasty",
    dynastyZh: "宋代",
    location: "Taiyuan, Shanxi",
    locationZh: "山西太原",
    category: "temple",
    categoryZh: "庙宇",
    lValue: 22038,
    bValue: "9 / 15",
    description: "An ancient temple complex nestled in the mountains. The harmony between natural topography and architectural structure exhibits strong 'not-separateness'.",
    descriptionZh: "依山而建的古老庙宇群。自然地形与建筑结构之间的和谐展现了强烈的“不分离”和“局部对称”属性。",
    imageUrl: "/cnts/jingci_temple.png",
    diagramUrl: "/cnts/jingci_temple.png",
    elevationUrl: "/cnts/jingci_temple.png",
    levels: [4, 10, 36, 123, 533, 2967],
    relatedProperties: [3, 7, 15],
    centers: [
      { x: 50, y: 40, r: 70, label: "Main Shrine (主殿)" }
    ]
  },
  // ── 教学楼 Educational ──────────────────────────────────────
  {
    id: "st_johns_univ",
    name: "St. John's University",
    nameZh: "圣约翰大学教学楼",
    dynasty: "1916",
    dynastyZh: "1916年",
    location: "Shanghai",
    locationZh: "上海",
    category: "educational",
    categoryZh: "教学楼",
    lValue: 12096,
    bValue: "7 / 15",
    description: "An early integration of Western collegiate architecture with Chinese traditional roofs. The strong boundaries and solid shapes reflect institutional stability.",
    descriptionZh: "早期中西合璧的大学建筑，结合了西方学院派结构与中国传统屋顶。坚固的边界和良好的形状体现了机构的稳定性。",
    imageUrl: "/cnts/st_johns_univ.png",
    diagramUrl: "/cnts/st_johns_univ.png",
    elevationUrl: "/cnts/st_johns_univ.png",
    levels: [2, 6, 30, 82, 314, 1582],
    relatedProperties: [3, 6, 9],
    centers: [
      { x: 50, y: 50, r: 80, label: "Main Entrance (主入口)" }
    ]
  },
  {
    id: "missions_building",
    name: "Missions Building",
    nameZh: "协和书局/教士大楼",
    dynasty: "1915",
    dynastyZh: "1915年",
    location: "Shanghai",
    locationZh: "上海",
    category: "educational",
    categoryZh: "教学楼",
    lValue: 38661,
    bValue: "7 / 15",
    description: "An important educational and publishing center. Its multi-layered facade and strong central entrance establish a powerful structural hierarchy.",
    descriptionZh: "重要的教育与出版中心。其多层次的立面和突出的中央入口建立了强大的结构层级和生命活力。",
    imageUrl: "/cnts/st_johns_univ.png",
    diagramUrl: "/cnts/st_johns_univ.png",
    elevationUrl: "/cnts/st_johns_univ.png",
    levels: [4, 12, 33, 108, 313, 1299, 3754],
    relatedProperties: [2, 4, 10],
    centers: [
      { x: 50, y: 70, r: 60, label: "Central Hall (中央大厅)" }
    ]
  },
  // ── 商业 Commercial ──────────────────────────────────────
  {
    id: "shanghai_customs",
    name: "Shanghai Customs House",
    nameZh: "上海海关大楼",
    dynasty: "1916",
    dynastyZh: "1916年",
    location: "The Bund, Shanghai",
    locationZh: "上海外滩",
    category: "commercial",
    categoryZh: "商业",
    lValue: 46770,
    bValue: "7 / 15",
    description: "A neo-classical commercial landmark on the Bund. Its massive scale and strong vertical centers dominate the skyline.",
    descriptionZh: "外滩的新古典主义商业地标。其巨大的尺度和强烈的垂直中心主导了天际线，创造了独特的视觉层级。",
    imageUrl: "/cnts/shanghai_customs.png",
    diagramUrl: "/cnts/shanghai_customs.png",
    elevationUrl: "/cnts/shanghai_customs.png",
    levels: [4, 12, 59, 223, 1132, 6365],
    relatedProperties: [1, 2, 7],
    centers: [
      { x: 50, y: 20, r: 60, label: "Clock Tower (钟楼)" }
    ]
  },
  {
    id: "art_deco_building",
    name: "Art Deco Commercial Bldg",
    nameZh: "杰凯庐苑(Art Deco商业)",
    dynasty: "1930s",
    dynastyZh: "1930年代",
    location: "Shanghai",
    locationZh: "上海",
    category: "commercial",
    categoryZh: "商业",
    lValue: 17766,
    bValue: "6 / 15",
    description: "Features geometric ornamentation and stepped gradients. The contrast between vertical lines and horizontal balconies creates dynamic positive space.",
    descriptionZh: "典型的Art Deco风格。具有几何装饰和阶梯状渐变，垂直线条与阳台之间的对比创造了动态的正空间。",
    imageUrl: "/cnts/shanghai_customs.png",
    diagramUrl: "/cnts/shanghai_customs.png",
    elevationUrl: "/cnts/shanghai_customs.png",
    levels: [3, 13, 32, 116, 652, 2145],
    relatedProperties: [5, 9, 10],
    centers: [
      { x: 50, y: 50, r: 70, label: "Facade Pattern (立面纹理)" }
    ]
  },
  // ── 医院 Medical ──────────────────────────────────────
  {
    id: "children_hospital",
    name: "Children's Hospital",
    nameZh: "巨鹿路儿童医院",
    dynasty: "1931",
    dynastyZh: "1931年",
    location: "Shanghai",
    locationZh: "上海",
    category: "medical",
    categoryZh: "医院",
    lValue: 5345,
    bValue: "5 / 15",
    description: "Designed with an emphasis on functional light and ventilation, featuring gentle gradients and calm spaces to promote healing.",
    descriptionZh: "设计注重采光和通风，具有柔和的渐变和平静的空间，以促进疗愈，体现了“局部对称”和“渐变”。",
    imageUrl: "/cnts/children_hospital.png",
    diagramUrl: "/cnts/children_hospital.png",
    elevationUrl: "/cnts/children_hospital.png",
    levels: [2, 14, 43, 216, 794],
    relatedProperties: [10, 14],
    centers: [
      { x: 50, y: 50, r: 60, label: "Entrance Hall (门厅)" }
    ]
  },
  {
    id: "early_medical",
    name: "Early Medical Building",
    nameZh: "早期医疗建筑",
    dynasty: "1835",
    dynastyZh: "1835年",
    location: "Guangzhou",
    locationZh: "广州",
    category: "medical",
    categoryZh: "医院",
    lValue: 9636,
    bValue: "6 / 15",
    description: "An early integration of Western medical function with local structural elements, maintaining strong 'roughness' and structural coherence.",
    descriptionZh: "早期西式医疗功能与本土结构的融合，维持了高强度的结构连贯性与和谐度。",
    imageUrl: "/cnts/children_hospital.png",
    diagramUrl: "/cnts/children_hospital.png",
    elevationUrl: "/cnts/children_hospital.png",
    levels: [2, 6, 21, 78, 288, 1211],
    relatedProperties: [8, 15],
    centers: [
      { x: 50, y: 50, r: 80, label: "Main Ward (主病房)" }
    ]
  },
  // ── 宫殿/坛庙 Palace/Altar ──────────────────────────────────────
  {
    id: "temple_of_heaven",
    name: "Temple of Heaven",
    nameZh: "明太祖天坛",
    dynasty: "1420",
    dynastyZh: "1420年",
    location: "Beijing",
    locationZh: "北京",
    category: "palace_garden",
    categoryZh: "宫殿/坛庙",
    lValue: 6525,
    bValue: "7 / 15",
    description: "An imperial complex representing the connection between Heaven and Earth, defined by perfect geometry and deep spiritual centers.",
    descriptionZh: "代表天地相连的皇家建筑群，以完美的几何形状和极强的“好形状”、“局部对称”属性著称。",
    imageUrl: "/cnts/temple_of_heaven.png",
    diagramUrl: "/cnts/temple_of_heaven.png",
    elevationUrl: "/cnts/temple_of_heaven.png",
    levels: [4, 12, 57, 263, 969],
    relatedProperties: [6, 7, 13],
    centers: [
      { x: 50, y: 50, r: 60, label: "Altar Center (天心石)" }
    ]
  },
  {
    id: "qianqing_palace",
    name: "Qianqing Palace",
    nameZh: "乾清宫",
    dynasty: "1748",
    dynastyZh: "1748年",
    location: "Beijing",
    locationZh: "北京故宫",
    category: "palace_garden",
    categoryZh: "宫殿/坛庙",
    lValue: 21828,
    bValue: "6 / 15",
    description: "The primary inner-court residence for emperors. It features extremely strong centers, strict boundaries, and high scale contrast.",
    descriptionZh: "故宫内廷主要建筑，皇帝的寝宫。具有极强的中心、严格的边界和高强度的层级尺度对比。",
    imageUrl: "/cnts/temple_of_heaven.png",
    diagramUrl: "/cnts/temple_of_heaven.png",
    elevationUrl: "/cnts/temple_of_heaven.png",
    levels: [3, 9, 47, 201, 504, 2874],
    relatedProperties: [2, 3, 9, 14],
    centers: [
      { x: 50, y: 50, r: 70, label: "Imperial Throne (宝座)" }
    ]
  }
];

// 本地经典题库 (作为回退机制)
const STATIC_QUESTION_POOL = [
  {
    id: 1, property: "Roughness vs. Perfection",
    optionA: { id: "A1", type: "strong", img: "/images/Roughness.png", descEn: "Adapting to the local environment", descZh: "适应局部环境的粗糙生长" },
    optionB: { id: "B1", type: "weak", img: "/images/RNEG.png", descEn: "Mechanically perfect and sterile", descZh: "机械般的完美与绝对无瑕" }
  },
  {
    id: 2, property: "Living Centers vs. Fragmented Space",
    optionA: { id: "A2", type: "weak", img: "/images/SCNEG.png", descEn: "Isolated, disjointed elements", descZh: "孤立、割裂的元素堆砌" },
    optionB: { id: "B2", type: "strong", img: "/images/Strong centers.png", descEn: "Centers reinforcing each other", descZh: "中心互相强化的嵌套层级" }
  },
  {
    id: 3, property: "Wholeness vs. Cartesian Grid",
    optionA: { id: "A3", type: "strong", img: "/images/Not separateness.png", descEn: "An unbroken, deeply interlocked whole", descZh: "不可分割、深度交织的整体" },
    optionB: { id: "B3", type: "weak", img: "/images/NSNEG.png", descEn: "A rigid, imposed mathematical grid", descZh: "强加的、死板的笛卡尔网格" }
  },
  {
    id: 4, property: "Gradients vs. Sharp Transitions",
    optionA: { id: "A4", type: "weak", img: "/images/GRNEG.png", descEn: "Abrupt, unnatural boundaries", descZh: "生硬、断裂的非自然边界" },
    optionB: { id: "B4", type: "strong", img: "/images/Gradients.png", descEn: "Gradual, organic transitions", descZh: "有机、柔和的层次渐变" }
  },
  {
    id: 5, property: "Local Symmetries vs. Monotony",
    optionA: { id: "A5", type: "strong", img: "/images/Local symmetries.png", descEn: "Complex, nested symmetries", descZh: "充满细节的嵌套局部对称" },
    optionB: { id: "B5", type: "weak", img: "/images/LSNEG.png", descEn: "Featureless, blank surfaces", descZh: "毫无特征的死板表面" }
  },
  {
    id: 6, property: "The Void vs. Clutter",
    optionA: { id: "A6", type: "weak", img: "/images/VNEG.png", descEn: "Chaotic and overwhelming noise", descZh: "拥挤不堪的结构噪音" },
    optionB: { id: "B6", type: "strong", img: "/images/The void.png", descEn: "A calm, unifying empty center", descZh: "平静、统摄全局的虚空" }
  }
];


// --- Components ---

const Section = ({ title, subTitle, children, className }: { title: string, subTitle?: string, children: React.ReactNode, className?: string }) => (
  <section className={cn("mb-16 md:mb-32 pt-8 md:pt-12 border-t border-stone-200", className)}>
    <div className="flex flex-col md:flex-row gap-4 md:gap-8 mb-8 md:mb-16 items-baseline">
      <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 uppercase tracking-widest shrink-0 w-auto md:w-80">{title}</h2>
      {subTitle && <h3 className="text-lg md:text-xl font-sans text-stone-400 font-light">{subTitle}</h3>}
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
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      setSliderPos((x / rect.width) * 100);
    }
  };

  return (
    <div className="w-full">
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

      <div
        ref={containerRef}
        className={cn(
          "w-full aspect-[4/3] md:aspect-[2/1] bg-stone-100 rounded-sm relative overflow-hidden border border-stone-200 select-none",
          viewMode === 'compare' ? "cursor-ew-resize touch-none" : ""
        )}
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
      >
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
        {viewMode === 'strong' && (
          <div className="w-full h-full relative">
            <div className="absolute top-4 left-4 bg-stone-900 text-white text-[10px] px-3 py-1.5 uppercase tracking-widest font-bold z-10 flex items-center gap-2 shadow-sm">
              <Check className="w-3 h-3" /> Strong Structure
            </div>
            <ImageWithFallback src={imgPos} alt="Strong" className="w-full h-full object-cover" />
          </div>
        )}
        {viewMode === 'weak' && (
          <div className="w-full h-full relative grayscale">
            <div className="absolute top-4 left-4 bg-stone-200 text-stone-600 text-[10px] px-3 py-1.5 uppercase tracking-widest font-bold z-10 flex items-center gap-2 shadow-sm border border-stone-300">
              <X className="w-3 h-3" /> Weak Structure
            </div>
            <ImageWithFallback src={finalImgNeg} alt="Weak" className="w-full h-full object-cover opacity-80" />
          </div>
        )}
        {viewMode === 'compare' && (
          <div className="w-full h-full relative group">
            <div className="absolute inset-0 grayscale opacity-90">
              <ImageWithFallback src={finalImgNeg} alt="Weak" className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4 bg-stone-200/90 text-stone-600 text-[10px] px-2 py-1 uppercase tracking-widest font-bold z-10 flex items-center gap-1 backdrop-blur-sm pointer-events-none">
                <X className="w-3 h-3" /> Weak
              </div>
            </div>
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              <ImageWithFallback src={imgPos} alt="Strong" className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 bg-stone-900/90 text-white text-[10px] px-2 py-1 uppercase tracking-widest font-bold z-10 flex items-center gap-1 backdrop-blur-sm pointer-events-none">
                <Check className="w-3 h-3" /> Strong
              </div>
            </div>
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_15px_rgba(0,0,0,0.3)] z-20 pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center border border-stone-200 text-stone-600">
                <MoveHorizontal className="w-5 h-5" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
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
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center md:justify-start">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors",
                activeCategory === cat.id
                  ? "bg-stone-900 text-white"
                  : "bg-white text-stone-500 border border-stone-200 hover:border-stone-400"
              )}
            >
              {language === 'zh' ? cat.zh : cat.en}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedCaseId(c.id)}
              className="group cursor-pointer bg-white border border-stone-200 hover:border-stone-400 transition-all duration-300 rounded-sm overflow-hidden"
            >
              <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                <ImageWithFallback
                  src={c.imageUrl}
                  alt={c.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 transition-colors" />
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-stone-700 transition-colors mb-1">
                    {language === 'zh' ? c.nameZh : c.name}
                  </h3>
                </div>

                <div className="flex justify-between items-center border-t border-stone-100 pt-4">
                  <button className="text-xs uppercase tracking-widest font-bold text-stone-900 flex items-center gap-2 group-hover:text-amber-700 transition-colors">
                    {trans.theory?.chinese?.viewAnalysis || 'View Analysis'} <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-stone-200 rounded-sm shadow-sm">
      <div className="border-b border-stone-100 p-4 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-stone-50/50">
        <div className="flex items-start gap-4">
          <button
            onClick={() => setSelectedCaseId(null)}
            className="mt-1 p-2 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-stone-600" />
          </button>
          <div>
            <h2 className="text-3xl font-serif font-bold text-stone-900">{language === 'zh' ? selectedCase.nameZh : selectedCase.name}</h2>
            <p className="text-stone-500 font-mono text-sm">{language === 'zh' ? selectedCase.dynastyZh : selectedCase.dynasty}</p>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        <div className="lg:col-span-4 space-y-8">
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 mb-3 border-b border-stone-100 pb-2 inline-block">
              {trans.theory?.chinese?.analysisTitle || 'Analysis'}
            </h4>
            <p className="text-stone-700 leading-relaxed text-sm">
              {language === 'zh' ? selectedCase.descriptionZh : selectedCase.description}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-stone-400 uppercase tracking-wider text-[10px] mb-4">
              <Layers className="w-3 h-3" /> {trans.theory?.chinese?.layerExplainer || 'Structural Layers'}
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

          <div>
            <div className="flex items-center gap-2 text-stone-400 uppercase tracking-wider text-[10px] mb-4">
              <Check className="w-3 h-3" /> Related Properties
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedCase.relatedProperties.map((pIndex) => {
                const p = properties.find(prop => prop.n === pIndex);
                return p ? (
                  <div key={p.n} className="px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-xs font-serif border border-stone-200">
                    {language === 'zh' ? p.tZh : p.tEn}
                  </div>
                ) : null;
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-stone-100">
            <label className="flex items-center justify-between cursor-pointer group bg-stone-50 p-4 rounded-lg border border-stone-200 hover:border-amber-400 transition-all">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-stone-900 group-hover:text-amber-600 transition-colors">
                  {trans.theory?.chinese?.toggleCenters || 'Highlight Living Centers'}
                </span>
                <span className="text-[10px] text-stone-500 mt-1">Reveal architectural focal points</span>
              </div>
              <button
                onClick={() => setHighlightCenters(!highlightCenters)}
                className={cn(
                  "w-12 h-6 rounded-full relative transition-colors duration-300 shadow-inner",
                  highlightCenters ? "bg-amber-500" : "bg-stone-300"
                )}
              >
                <div className={cn(
                  "w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-300 shadow-sm",
                  highlightCenters ? "left-7" : "left-1"
                )} />
              </button>
            </label>
          </div>
        </div>

        <div className="lg:col-span-8 grid grid-cols-1 gap-6">
          <div className="bg-white border border-stone-100 p-1 rounded-sm shadow-sm relative overflow-hidden">
            <div className="relative aspect-[16/9] overflow-hidden bg-stone-900 flex items-center justify-center">

              <ImageWithFallback
                src={selectedCase.diagramUrl}
                alt="Structural Diagram"
                className={cn(
                  "w-full h-full object-contain transition-all duration-700",
                  highlightCenters ? "opacity-60 scale-100 blur-[1px]" : "opacity-100 scale-105"
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
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: 'linear-gradient(rgba(251, 191, 36, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(251, 191, 36, 0.4) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                      }}
                    />

                    {selectedCase.centers.map((center, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: idx * 0.15, type: "spring", stiffness: 100 }}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                        style={{ left: `${center.x}%`, top: `${center.y}%`, width: center.r, height: center.r }}
                      >
                        <div className="absolute w-2 h-2 bg-amber-400 rounded-full shadow-[0_0_15px_rgba(251,191,36,1)] z-20" />
                        <div className="absolute w-full h-full border border-amber-400/80 rounded-full animate-[spin_8s_linear_infinite] border-dashed" />
                        <div className="absolute w-[150%] h-[150%] border border-amber-300/40 rounded-full animate-ping" />
                        <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 bg-stone-900/90 backdrop-blur border border-amber-500/30 text-amber-50 text-[10px] px-3 py-1 rounded shadow-xl uppercase tracking-widest whitespace-nowrap">
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

const OrganicViewSection = ({ isEn }: { isEn: boolean }) => (
  <Section
    title={isEn ? "The Organic Paradigm" : "有机空间范式"}
    subTitle={isEn ? "Mapping Physical Geometry to Human Cognition" : "物理几何与人类认知的深度映射"}
    className="!pt-12 !border-0"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      <div className="p-8 md:p-10 bg-white rounded-3xl border border-stone-200 grayscale hover:grayscale-0 transition-all duration-500 shadow-sm group">
        <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center mb-6 border border-stone-200 group-hover:bg-stone-900 group-hover:text-white transition-colors">
          <Box className="w-5 h-5 text-stone-500 group-hover:text-white" />
        </div>
        <h4 className="text-xl font-serif font-bold text-stone-900 mb-4">{isEn ? "The Cartesian 'Dead' Space" : "笛卡尔的「死寂」空间"}</h4>
        <p className="text-sm text-stone-600 leading-relaxed font-serif">
          {isEn
            ? "For 300 years, the mechanistic worldview taught us that space is a neutral, lifeless coordinate system. Matter is separate from us, and environmental geometry has no bearing on our inner emotional life."
            : "三百年来，机械论教导我们：空间只是中性、死寂的空盒子。物质与人是割裂的，周围的几何形状与我们内在的情感生活毫无瓜葛。"}
        </p>
      </div>

      <div className="p-8 md:p-10 bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl border border-amber-200 shadow-md group relative overflow-hidden">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm border border-amber-100 group-hover:bg-amber-500 transition-colors relative z-10">
          <Heart className="w-5 h-5 text-amber-500 group-hover:text-white" />
        </div>
        <h4 className="text-xl font-serif font-bold text-amber-950 mb-4 relative z-10">{isEn ? "The Organic Living Space" : "有机的「活力」空间"}</h4>
        <p className="text-sm text-amber-800/90 leading-relaxed font-serif relative z-10">
          {isEn
            ? "Space is a living organism. Healing the physical wholeness of our environment (moving a chair, softening an edge) is inextricably linked to healing our own inner fragmentation."
            : "空间是一个有生命的有机体。每一次几何结构的微调都在改变其生命度。治愈外部物理环境的整体性，就是在直接疗愈我们内心的破碎。"}
        </p>
        <Leaf className="absolute -bottom-8 -right-8 w-40 h-40 text-amber-500/10 rotate-12 group-hover:scale-110 transition-transform duration-700" />
      </div>
    </div>

    <div className="bg-stone-950 p-8 md:p-14 rounded-[2.5rem] border border-stone-800 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.png')] opacity-10 mix-blend-overlay" />

      <div className="text-center mb-12 relative z-10">
        <Badge variant="outline" className="mb-4 border-amber-500/50 text-amber-400 bg-amber-900/30 uppercase tracking-widest backdrop-blur-sm">
          {isEn ? "Cognitive Architecture" : "建筑认知学"}
        </Badge>
        <h3 className="text-2xl md:text-3xl font-serif font-black text-white">
          {isEn ? "How the Brain Processes Space" : "大脑如何解析空间生命力"}
        </h3>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
        <div className="flex-1 bg-stone-900/80 p-8 rounded-3xl border border-stone-700 backdrop-blur-md hover:border-stone-500 transition-colors h-full w-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 text-stone-300">
              <Brain className="w-6 h-6 text-stone-400" />
              <span className="font-bold tracking-widest uppercase text-sm">{isEn ? "Left Hemisphere" : "左脑 (理性)"}</span>
            </div>
            <span className="text-[10px] font-mono text-stone-500 uppercase">{isEn ? "Objective" : "客观世界"}</span>
          </div>
          <h5 className="text-2xl font-serif font-bold text-white mb-4">
            {isEn ? "Structural Beauty" : "客观结构美"}
          </h5>
          <div className="space-y-4">
            <p className="text-sm text-stone-400 leading-relaxed border-l-2 border-stone-600 pl-3">
              {isEn ? "Perceives the physical geometry, centers, boundaries, and mathematical order of the environment." : "解析物理几何：寻找中心、边界、粗糙性等客观存在的数学秩序。"}
            </p>
            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 font-mono text-amber-400/90 text-sm flex items-center justify-center">
              L = S × H (Livingness)
            </div>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-center justify-center shrink-0 w-24">
          <motion.div
            animate={{ height: ["0%", "100%", "0%"], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-16 bg-gradient-to-b from-stone-800 via-amber-500 to-stone-800"
          />
          <Activity className="w-8 h-8 text-amber-500 my-4" />
          <motion.div
            animate={{ height: ["0%", "100%", "0%"], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="w-px h-16 bg-gradient-to-b from-stone-800 via-teal-500 to-stone-800"
          />
        </div>

        <div className="md:hidden flex items-center justify-center w-full py-4">
          <ArrowRight className="w-6 h-6 text-amber-500 rotate-90 md:rotate-0" />
        </div>

        <div className="flex-1 bg-[#0f3531]/80 p-8 rounded-3xl border border-teal-800 backdrop-blur-md hover:border-teal-600 transition-colors h-full w-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 text-teal-100">
              <Heart className="w-6 h-6 text-teal-400" />
              <span className="font-bold tracking-widest uppercase text-sm">{isEn ? "Right Hemisphere" : "右脑 (感性)"}</span>
            </div>
            <span className="text-[10px] font-mono text-teal-500/70 uppercase">{isEn ? "Subjective" : "主观感受"}</span>
          </div>
          <h5 className="text-2xl font-serif font-bold text-white mb-4">
            {isEn ? "Felt Sense & Wholeness" : "主观生命感"}
          </h5>
          <div className="space-y-4">
            <p className="text-sm text-teal-200/80 leading-relaxed border-l-2 border-teal-600 pl-3">
              {isEn ? "Translates the structural complexity into a profound psychological feeling of safety, healing, and life." : "将复杂的客观几何结构，转化为深刻的心理感受：安全、治愈与生命力。"}
            </p>
            <div className="bg-teal-950/50 p-4 rounded-xl border border-teal-800/50 font-serif text-teal-300 text-sm flex items-center justify-center italic">
              "Felt more alive" (整体感)
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center relative z-10">
        <p className="text-stone-400 text-xs max-w-3xl mx-auto leading-relaxed">
          {isEn
            ? "The essence of Living Structure theory is to bridge this gap. By measuring and designing the objective geometric properties (Left Brain), we can reliably predict and cultivate the profound psychological wholeness experienced by human beings (Right Brain)."
            : "活力结构理论的核心正是跨越这道鸿沟。通过量化设计客观的几何属性（左脑），我们能够可靠地预测并培养人类深刻的心理整体感（右脑）。这就解释了为什么一个冰冷的空间被微调后，能让人感到被“治愈”。"}
        </p>
      </div>
    </div>
  </Section>
);

// ============================================================================
// 💡 全新落地模块：Campus Lab (理疗所 + 课室网格)
// ============================================================================
const CampusProjectsSection = ({ isEn }: { isEn: boolean }) => {
  // 💡 课室数据列表，已写死为本地路径
  const classrooms = [
    {
      id: "W1-233",
      link: "https://vr.justeasy.cn/view/174v3j47i0470778-1734793858.html",
      img: "/images/W1-233.png" // 👈 请确保 public/images 文件夹下有这个文件
    },
    {
      id: "5A-220",
      link: "https://vr.justeasy.cn/view/147e374o54n19057-1753083138.html",
      img: "/images/5A-220.png" // 👈 请确保 public/images 文件夹下有这个文件
    },
    {
      id: "E3-312",
      link: "https://vr.justeasy.cn/view/zn61187413306813-1756382846.html",
      img: "/images/E3-312.png" // 👈 请确保 public/images 文件夹下有这个文件
    },
    {
      id: "E3-314",
      link: "https://vr.justeasy.cn/view/uk17d141l920b639-1758796620.html",
      img: "/images/E3-314.png" // 👈 请确保 public/images 文件夹下有这个文件
    }
  ];

  return (
    <Section
      title={isEn ? "Campus Lab" : "校园实践"}
      subTitle={isEn ? "Translating theory into physical space through generative AI." : "将抽象理论通过人工智能，转化为物理空间的真实疗愈体验。"}
      className="!pt-12"
    >
      {/* 01. 理疗所 VR 独立入口卡片 */}
      <div className="mb-16 mt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-6">
          <div className="max-w-2xl">
            <h4 className="text-2xl font-serif font-bold text-stone-900 mb-3">
              {isEn ? "01. The Healing Clinic" : "01. 理疗所改造项目"}
            </h4>
            <p className="text-stone-600 text-sm leading-relaxed">
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
          className="block w-full aspect-[4/3] md:aspect-[21/9] bg-stone-900 rounded-2xl overflow-hidden border border-stone-200 shadow-md hover:shadow-xl transition-all duration-500 relative group cursor-pointer"
        >
          {/* 🖼️ 理疗所封面图 */}
          <ImageWithFallback
            src="/images/clinic.png"
            alt="Physiotherapy Clinic VR Cover"
            className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />

          {/* 悬浮居中的引导按钮 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.3)] group-hover:scale-110 group-hover:bg-teal-500 transition-all duration-300">
              <ArrowUpRight className="w-6 h-6 md:w-8 md:h-8 text-stone-900 group-hover:text-white transition-colors" />
            </div>
          </div>

          {/* 左下角信息 */}
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

      {/* 02. 课室改造网格画廊 */}
      <div className="mb-12 mt-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div className="max-w-2xl">
            <h4 className="text-2xl font-serif font-bold text-stone-900 mb-3 flex items-center gap-3">
              {isEn ? "02. Classroom Renovations" : "02. 传统课室系列改造"}
            </h4>
            <p className="text-stone-600 text-sm leading-relaxed">
              {isEn
                ? "Breaking the rigid Cartesian grid across multiple learning spaces. We apply the 15 properties to create 'Strong Centers' and 'Positive Space', turning monotonous rooms into organic learning organisms in HKUST（GZ）."
                : "打破传统排排坐的死板笛卡尔网格。我们在香港科技大学（广州）多间课室中应用 15 个基础属性，重新建立“强中心”和“正空间”，将单调的空间转化为有机的学习生命体。点击对应课室进入实景漫游："}
            </p>
          </div>
        </div>

        {/* 2x2 网格布局 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {classrooms.map((room) => (
            <a
              key={room.id}
              href={room.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full aspect-[4/3] md:aspect-[16/9] bg-stone-100 rounded-2xl overflow-hidden border border-stone-200 shadow-md relative group cursor-pointer"
            >
              {/* 🖼️ 课室封面图 */}
              <ImageWithFallback
                src={room.img}
                alt={`Classroom ${room.id}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 opacity-90 group-hover:opacity-100"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-transparent to-transparent pointer-events-none" />

              {/* 悬浮的小箭头 */}
              <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <ArrowUpRight className="w-5 h-5 text-stone-900" />
              </div>

              {/* 底部信息 */}
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

// --- Main Page Component ---

export function Theory() {
  const [activePropId, setActivePropId] = useState<number>(1);
  const [activeHowToIds, setActiveHowToIds] = useState<number[]>([]);
  const { trans, language } = useLanguage();
  const isEn = language === 'en';

  const activeProp = properties.find(p => p.n === activePropId) || properties[0];

  const { analyzeStructure, isThinking } = useGemini();
  const [hasStarted, setHasStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{ property: string, choiceType: string }[]>([]);
  const [report, setReport] = useState<string | null>(null);

  const [activeQuestions, setActiveQuestions] = useState<typeof STATIC_QUESTION_POOL>([]);
  const [isLoadingDataset, setIsLoadingDataset] = useState(false);

  const startTest = async () => {
    setIsLoadingDataset(true);
    let questions = STATIC_QUESTION_POOL;

    try {
      const treeRes = await fetch("https://api.github.com/repos/yq1ngz/before-after-streetscape/git/trees/main?recursive=1");

      if (treeRes.ok) {
        const treeData = await treeRes.json();

        const imagePaths = treeData.tree
          .map((item: any) => item.path)
          .filter((path: string) =>
            path.includes("2_Seperate images without watermarks") &&
            path.match(/\.(jpg|jpeg|png|webp)$/i)
          );

        const pairsMap = new Map<string, any[]>();

        imagePaths.forEach((path: string) => {
          const parts = path.split('/');
          const filename = parts[parts.length - 1];
          const folderPath = parts.slice(0, -1).join('/');

          const numMatch = filename.match(/\d+/) || folderPath.match(/\d+$/);
          if (numMatch) {
            const id = `${folderPath}-${numMatch[0]}`;
            if (!pairsMap.has(id)) pairsMap.set(id, []);

            const encodedPath = path.split('/').map(p => encodeURIComponent(p)).join('/');
            pairsMap.get(id)!.push({
              name: filename,
              url: `https://raw.githubusercontent.com/yq1ngz/before-after-streetscape/main/${encodedPath}`
            });
          }
        });

        const validPairs = Array.from(pairsMap.values())
          .filter(arr => arr.length >= 2)
          .map(arr => {
            arr.sort((a, b) => a.name.localeCompare(b.name));

            let beforeUrl = arr[0].url;
            let afterUrl = arr[1].url;

            const n1 = arr[0].name.toLowerCase();
            const n2 = arr[1].name.toLowerCase();

            if (n1.includes('after') || n1.includes('new') || n2.includes('before') || n2.includes('old') || n2.includes('original')) {
              afterUrl = arr[0].url;
              beforeUrl = arr[1].url;
            } else if (n2.includes('after') || n2.includes('new') || n1.includes('before') || n1.includes('old') || n1.includes('original')) {
              afterUrl = arr[1].url;
              beforeUrl = arr[0].url;
            }

            return { before: beforeUrl, after: afterUrl };
          });

        if (validPairs.length >= 5) {
          const shuffled = validPairs.sort(() => 0.5 - Math.random()).slice(0, 10);

          questions = shuffled.map((pair, index) => {
            const isStrongA = Math.random() > 0.5;
            return {
              id: index + 1,
              property: `Streetscape Transformation ${index + 1}`,
              optionA: {
                id: `A${index + 1}`,
                type: isStrongA ? "strong" : "weak",
                img: isStrongA ? pair.after : pair.before,
                descEn: isStrongA ? "Living Structure (Transformed)" : "Mechanistic Space (Original)",
                descZh: isStrongA ? "具备生命感的有机空间 (改造后)" : "机械、割裂的现代空间 (改造前)"
              },
              optionB: {
                id: `B${index + 1}`,
                type: !isStrongA ? "strong" : "weak",
                img: !isStrongA ? pair.after : pair.before,
                descEn: !isStrongA ? "Living Structure (Transformed)" : "Mechanistic Space (Original)",
                descZh: !isStrongA ? "具备生命感的有机空间 (改造后)" : "机械、割裂的现代空间 (改造前)"
              }
            };
          });
        }
      }
    } catch (e) {
      console.warn("Failed to load GitHub dataset via Tree API, using local fallback", e);
    }

    setActiveQuestions(questions);
    setHasStarted(true);
    setCurrentStep(0);
    setAnswers([]);
    setReport(null);
    setIsLoadingDataset(false);
  };

  const handleSelect = async (choiceType: string, property: string) => {
    const newAnswers = [...answers, { property, choiceType }];
    setAnswers(newAnswers);

    if (currentStep < activeQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateReport(newAnswers);
    }
  };

  const generateReport = async (finalAnswers: { property: string, choiceType: string }[]) => {
    const strongCount = finalAnswers.filter(a => a.choiceType === 'strong').length;
    const total = finalAnswers.length;

    const prompt = `
      You are an expert in Christopher Alexander's "The Nature of Order" (specifically Book 1, Chapters 8 & 9) and Bin Jiang's "Living Structure" theory. 
      A user just completed the "Mirror of the Self" test, choosing between Living Structures and Cartesian/mechanistic structures.
      
      Their empirical observations:
      ${finalAnswers.map((a, i) => `- Task ${i + 1} (${a.property}): Identified the "${a.choiceType === 'strong' ? 'Living Structure' : 'Cartesian/Mechanistic Structure'}" as a truer picture of their whole self.`).join('\n')}
      
      Total living structure identified: ${strongCount} out of ${total}.

      Task: Write a profound diagnosis (150-200 words) acting as a phenomenological scientist. 
      Core directives based on Chapter 8 & 9:
      1. Explain that their choices were NOT subjective "preferences", but an objective scientific measurement of the degree of life in the physical world using their own feeling as the instrument (Ch 8).
      2. If they chose 'strong' mostly: Explain how they successfully pierced through the 300-year-old Cartesian mechanistic worldview (Ch 9). They re-established the connection between the "I" and the world's geometry.
      3. If they chose 'weak' mostly: Gently point out how the modern mechanistic, Cartesian conditioning still heavily influences their perception, separating their inner humanity from the physical space.
      
      Tone: Profound, scientific, yet deeply healing and philosophical. Do not mention "Chapter 8", "Chapter 9", or raw scores. Speak directly to their perception of reality.
      
      ==================================================
      ⚠️ CRITICAL OUTPUT LANGUAGE INSTRUCTION ⚠️
      You MUST translate your thoughts and write the final response STRICTLY in: ${isEn ? 'English' : '简体中文 (Simplified Chinese)'}.
      ${isEn ? 'Ensure your entire response is in highly elegant English.' : '【强制警告】你的最终诊断报告必须 100% 使用优美、深邃的中文输出！绝不允许出现任何一段英文！'}
      ==================================================
    `;

    try {
      const aiResponse = await analyzeStructure(prompt);
      if (aiResponse) {
        setReport(aiResponse);
      } else {
        setReport("⚠️ 获取报告失败：AI 返回了空值。请检查网络状态或 Supabase 后端日志。");
      }
    } catch (error) {
      setReport(`⚠️ 发生错误：${error}`);
    }
  };

  const handleShareToX = () => {
    const text = encodeURIComponent(
      isEn
        ? "I just completed the 'Mirror of the Self' observation and shattered the Cartesian mechanistic worldview! 🔬✨ Discover your inner resonance with Living Structure:"
        : "我刚刚完成了『自我之镜』客观活力观测，并打破了笛卡尔机械世界观的束缚！🔬✨ 来测试你的内在几何共振："
    );
    const url = encodeURIComponent("https://livablecitylab.hkust-gz.edu.cn");
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  const resetTest = () => {
    setHasStarted(false);
    setCurrentStep(0);
    setAnswers([]);
    setReport(null);
  };

  const howToData = [
    {
      id: 1,
      icon: Eye,
      title: isEn ? "Observe Wholeness" : "感知整体",
      shortDesc: isEn ? "Use the squint test to blur details." : "用眯眼法则模糊表层细节。",
      fullDesc: isEn
        ? "To see the living structure, you must first ignore the functional labels or decorative styles. Squint your eyes until the image blurs. What remains are the true underlying 'centers' of gravity. Does the blurred structure still feel whole, or does it fall apart into chaotic fragments?"
        : "要看清活力结构，必须先抛弃功能标签或装饰风格。眯起你的眼睛，直到画面变得模糊。剩下的那些较暗或较亮的体块，就是底层真实的‘重心（Centers）’。在模糊状态下，它依然是一个统一的整体，还是碎裂成了混乱的碎片？"
    },
    {
      id: 2,
      icon: Layers,
      title: isEn ? "Map the Hierarchy" : "映射层级",
      shortDesc: isEn ? "Find structures within structures." : "寻找结构中的嵌套结构。",
      fullDesc: isEn
        ? "Look for scaling hierarchies. A living environment is never just one massive scale. It jumps by factors of 2 to 6. Can you point out the macro-skeleton, the meso-boundaries, and the micro-ornaments? If there is a huge jump from the building scale directly to the window scale with nothing in between, the hierarchy is broken."
        : "寻找跨尺度的层级嵌套。充满活力的环境绝不仅有单一的巨大尺度，它总是以 2 到 6 倍的比例跃升。你能指出它的宏观骨架、中观边界和微观细节吗？如果从巨大的建筑体块直接跳崖式地过渡到微小的窗户，中间缺乏过渡，那么它的层级就是断裂的。"
    },
    {
      id: 3,
      icon: ArrowUpRight,
      title: isEn ? "Trace Connections" : "追踪联结",
      shortDesc: isEn ? "Identify how centers support each other." : "识别中心间如何互相支撑。",
      fullDesc: isEn
        ? "No center lives in isolation. Choose any prominent feature in the space. Does its existence strengthen the space next to it? Do the boundaries interlock deeply, or are they cleanly severed? Living structures share DNA across scales, creating echoes that resonate throughout the entire system."
        : "没有哪个中心可以孤立存在。选定空间中任意一个突出的特征，问问自己：它的存在是否强化了它旁边的空间？它们的边界是深度交织的，还是被生硬切断的？活力结构在不同尺度间共享着几何DNA，在整个系统中形成持续的共鸣。"
    }
  ];

  const toggleHowToCard = (id: number) => {
    setActiveHowToIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] text-stone-800 pb-24">

      <div className="w-full max-w-7xl mx-auto p-4 md:p-16 pb-0">

        {/* Section 0: The Empirical Mirror */}
        <div className="mb-32">

          <div className="max-w-4xl mx-auto mb-16 text-center px-4 pt-4 md:pt-8">
            <Quote className="w-8 h-8 md:w-12 md:h-12 text-stone-200 mx-auto mb-6" />
            <p className="text-lg md:text-2xl font-serif text-stone-700 leading-relaxed mb-6 italic">
              "{isEn
                ? "Liking something from the heart means that it makes us more whole in ourselves. It has a healing effect on us. It makes us more human."
                : "发自内心的喜爱，意味着它让我们在内在变得更加完整。它对我们有疗愈的作用，让我们更具人性。"}"
            </p>
            <p className="text-sm md:text-base text-stone-500 font-medium">
              — Christopher Alexander, The Nature of Order
            </p>
          </div>

          <Section title={isEn ? "Empirical Test" : "实证测试"} subTitle={isEn ? "The Mirror of the Self" : "自我之镜：观测与测量"} className="!pt-0 !border-0">
            <div className="w-full bg-white border border-stone-200 text-stone-800 rounded-3xl overflow-hidden shadow-xl relative min-h-[500px] md:min-h-[600px] flex flex-col items-center justify-center p-6 md:p-8">

              <AnimatePresence mode="wait">
                {!hasStarted && !report && (
                  <motion.div
                    key="start"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center max-w-xl"
                  >
                    <Microscope className="w-12 h-12 text-amber-500 mx-auto mb-6 opacity-80" />
                    <h3 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-6">
                      {isEn ? "The Empirical Mirror" : "实证之镜"}
                    </h3>
                    <p className="text-stone-500 text-base md:text-lg mb-4 leading-relaxed font-serif">
                      {isEn
                        ? "This is not a test of preference. It is a scientific observation. We have been taught by the Cartesian worldview that our inner feelings and objective reality are entirely separate."
                        : "这不是一场关于主观喜好的测试，而是一次严谨的科学观测。过去三百年的笛卡尔世界观告诉我们，客观物质与主观感受是彻底割裂的。"}
                    </p>
                    <p className="text-stone-600 text-sm md:text-base mb-10 leading-relaxed font-serif italic border-l-2 border-amber-500/50 pl-4 text-left">
                      {isEn
                        ? "Please quiet your mind. When the images appear, use your inner feeling as a precision instrument. Ask yourself: Which of these two geometries is a truer, more encompassing picture of your whole self?"
                        : "请平静你的大脑。当画面出现时，请将你内心的深刻感受作为一把精密的科学量尺。问问你自己：哪一种几何形态，能更准确、更完整地映照出你作为一个人的全部本质？"}
                    </p>

                    <button
                      onClick={startTest}
                      disabled={isLoadingDataset}
                      className="bg-stone-900 text-white px-8 py-3 rounded-full font-bold tracking-widest uppercase text-sm hover:bg-amber-500 transition-colors flex items-center gap-2 mx-auto shadow-md disabled:opacity-50"
                    >
                      {isLoadingDataset ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> {isEn ? "Fetching Dataset..." : "正在抽取云端图库..."}</>
                      ) : (
                        <>{isEn ? "Begin Observation" : "启动观测实验"} <ArrowRight className="w-4 h-4" /></>
                      )}
                    </button>

                  </motion.div>
                )}

                {hasStarted && !isThinking && !report && activeQuestions.length > 0 && (
                  <motion.div
                    key={`step-${currentStep}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-4xl"
                  >
                    <div className="text-center mb-8">
                      <div className="text-xs uppercase tracking-[0.3em] text-stone-400 mb-2">
                        {isEn ? "Observation" : "观测节点"} {currentStep + 1} / {activeQuestions.length}
                      </div>
                      <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden max-w-md mx-auto border border-stone-200">
                        <div
                          className="bg-amber-500 h-full transition-all duration-500"
                          style={{ width: `${((currentStep) / activeQuestions.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 min-h-[400px] h-auto">
                      <div
                        onClick={() => handleSelect(activeQuestions[currentStep].optionA.type, activeQuestions[currentStep].property)}
                        className="relative rounded-2xl overflow-hidden cursor-pointer group border border-stone-200 hover:border-amber-400 shadow-sm transition-all"
                      >
                        <img src={activeQuestions[currentStep].optionA.img} alt="Option A" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-stone-900/5 group-hover:bg-stone-900/0 transition-colors" />
                        <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-stone-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white text-sm font-medium text-center font-serif">
                            {isEn ? activeQuestions[currentStep].optionA.descEn : activeQuestions[currentStep].optionA.descZh}
                          </p>
                        </div>
                      </div>

                      <div
                        onClick={() => handleSelect(activeQuestions[currentStep].optionB.type, activeQuestions[currentStep].property)}
                        className="relative rounded-2xl overflow-hidden cursor-pointer group border border-stone-200 hover:border-amber-400 shadow-sm transition-all"
                      >
                        <img src={activeQuestions[currentStep].optionB.img} alt="Option B" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-stone-900/5 group-hover:bg-stone-900/0 transition-colors" />
                        <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-stone-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white text-sm font-medium text-center font-serif">
                            {isEn ? activeQuestions[currentStep].optionB.descEn : activeQuestions[currentStep].optionB.descZh}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {isThinking && (
                  <motion.div
                    key="thinking"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center text-center"
                  >
                    <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-6" />
                    <h3 className="text-xl font-serif text-stone-900 mb-2">
                      {isEn ? "Computing Structural Resonance..." : "正在计算几何结构与自我的共振..."}
                    </h3>
                    <p className="text-stone-400 text-sm animate-pulse">
                      {isEn ? "Analyzing objective life degree based on Chapter 8 & 9 paradigms" : "正在依据超越笛卡尔的全新科学范式，生成观测报告..."}
                    </p>
                  </motion.div>
                )}

                {report && !isThinking && (
                  <motion.div
                    key="report"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl w-full bg-stone-50/80 p-6 md:p-12 rounded-2xl border border-stone-200 backdrop-blur-sm shadow-inner"
                  >
                    <div className="text-amber-600 text-xs font-bold uppercase tracking-[0.2em] mb-4 text-center flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      {isEn ? "Scientific Observation Report" : "客观活力观测报告"}
                    </div>

                    <p className="text-stone-700 text-base md:text-lg leading-loose font-serif whitespace-pre-line mb-10 text-justify">
                      {report}
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 border-t border-stone-200 pt-8">
                      <button
                        onClick={resetTest}
                        className="text-stone-500 hover:text-stone-900 flex items-center gap-2 text-sm transition-colors font-bold uppercase tracking-widest"
                      >
                        <RefreshCcw className="w-4 h-4" /> {isEn ? "New Observation" : "开启新观测"}
                      </button>

                      <button
                        onClick={handleShareToX}
                        className="bg-stone-900 text-white hover:bg-amber-600 px-6 py-2 rounded-full flex items-center gap-2 text-sm font-bold transition-all shadow-md"
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-current"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.96H5.078z"></path></g></svg>
                        {isEn ? "Share Results" : "分享观测结果"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Section>
        </div>


        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mt-12 mb-16"
        >
          <div className="border-b border-stone-200 pb-12 mb-12 max-w-2xl mx-auto">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400 mb-6">
              {isEn ? "Theoretical Framework" : "理论框架提取"}
            </div>
            <div className="space-y-3 font-serif text-lg md:text-xl text-stone-600 leading-relaxed">
              <p>{isEn ? "Living Structure originates from structural wholeness." : "活力结构，源于不可分割的整体性。"}</p>
              <p>{isEn ? "Vitality emerges from hierarchical coherence." : "客观的生命美感，涌现于层级的严密嵌套。"}</p>
              <p className="font-black text-stone-900 text-3xl mt-6 tracking-widest">L = S × H</p>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif font-black text-stone-900 mb-4 tracking-tight uppercase">
            {isEn ? (
              <>THEORY OF<br />LIVING STRUCTURE</>
            ) : (
              <>生 命 结 构 理 论</>
            )}
          </h1>
          <p className="text-stone-500 font-mono uppercase tracking-widest text-xs">
            {isEn ? "Vitality in Geometry & Architecture" : "几何与建筑中的活力密码"}
          </p>
        </motion.div>

        {/* 💡 全新理论模块：有机的空间观 */}
        <OrganicViewSection isEn={isEn} />

        {/* Section 1: Origin */}
        <Section title={trans.theory?.origin?.title || "Origin"}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div className="space-y-6">
              <p className="text-stone-800 text-lg leading-relaxed font-serif">{trans.theory?.origin?.content1}</p>
              <p className="text-stone-600 text-sm leading-relaxed">{trans.theory?.origin?.content2}</p>
            </div>
            <div className="bg-stone-100 p-8 rounded-sm">
              <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">{trans.theory?.origin?.formulaTitle || "Core Formula"}</h4>
              <div className="text-4xl font-serif font-bold text-stone-900 mb-4">L = S × H</div>
              <div className="space-y-2 text-sm text-stone-600 font-mono">
                <div className="flex justify-between border-b border-stone-200 pb-1"><span>L</span> <span>{trans.theory?.origin?.formulaL || "Livingness"}</span></div>
                <div className="flex justify-between border-b border-stone-200 pb-1"><span>S</span> <span>{trans.theory?.origin?.formulaS || "Substructures"}</span></div>
                <div className="flex justify-between"><span>H</span> <span>{trans.theory?.origin?.formulaH || "Hierarchy"}</span></div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 border-t border-stone-100 pt-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-stone-200 rounded-full overflow-hidden grayscale">
                <ImageWithFallback src="/images/A.png" alt="C. Alexander" className="w-full h-full object-cover" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-stone-900">Christopher Alexander</div>
                <div className="text-stone-400">The Nature of Order</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-stone-200 rounded-full overflow-hidden grayscale">
                <ImageWithFallback src="/images/BJ.png" alt="Bin Jiang" className="w-full h-full object-cover" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-stone-900">Bin Jiang</div>
                <div className="text-stone-400">Structural Beauty</div>
              </div>
            </div>
          </div>
        </Section>

        {/* Section 2: Aesthetic Context */}
        <Section title={trans.theory?.aesthetic?.title || "Aesthetic Context"}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-8 bg-white border border-stone-200 shadow-sm">
              <p className="text-stone-600 leading-relaxed mb-4">{trans.theory?.aesthetic?.p1}</p>
              <div className="h-1 w-12 bg-stone-200" />
            </div>
            <div className="p-8 bg-stone-50 border border-stone-200">
              <p className="text-stone-800 font-medium leading-relaxed mb-4">{trans.theory?.aesthetic?.p2}</p>
              <div className="h-1 w-12 bg-amber-200" />
            </div>
          </div>
        </Section>

        {/* Section 3: How to See */}
        <Section
          title={trans.theory?.howToSee?.title || "How to Perceive Structure"}
          subTitle={isEn
            ? "Click on any card to reveal the three fundamental steps for observing living structure in the built environment."
            : "点击展开下方卡片，掌握感知建筑与空间活力的三个核心步骤。"}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            {howToData.map((item) => {
              const isActive = activeHowToIds.includes(item.id);
              return (
                <motion.div
                  layout
                  key={item.id}
                  onClick={() => toggleHowToCard(item.id)}
                  className={cn(
                    "border border-stone-200 rounded-2xl cursor-pointer transition-colors overflow-hidden",
                    isActive ? "bg-stone-900 text-white shadow-xl" : "bg-white text-stone-900 hover:bg-stone-50"
                  )}
                >
                  <motion.div layout className="p-4 md:p-8 flex flex-col items-center text-center">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors",
                      isActive ? "bg-stone-800 text-teal-400" : "bg-stone-100 text-stone-600"
                    )}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-serif font-bold text-lg mb-2">{item.title}</h4>
                    <p className={cn("text-xs transition-colors", isActive ? "text-stone-300" : "text-stone-500")}>
                      {item.shortDesc}
                    </p>
                  </motion.div>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 md:px-8 pb-6 md:pb-8 text-left"
                      >
                        <div className="w-full h-px bg-stone-700 mb-6"></div>
                        <p className="text-sm leading-relaxed text-stone-300">
                          {item.fullDesc}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </Section>

        {/* Section 4: 15 Properties */}
        <Section title="15 Properties" subTitle={trans.theory?.propertiesSubtitle || "Fundamental patterns of living structure"}>

          <div className="flex flex-col lg:flex-row gap-12 mt-8">
            <div className="w-full lg:w-1/4 flex flex-col gap-2">
              {properties.map((prop) => (
                <button
                  key={prop.n}
                  onClick={() => setActivePropId(prop.n)}
                  className={`text-left px-4 py-3 rounded-md transition-all duration-200 ${activePropId === prop.n
                      ? 'bg-amber-100 text-amber-900 font-bold border-l-4 border-amber-500 shadow-sm'
                      : 'bg-transparent text-stone-600 hover:bg-stone-100'
                    }`}
                >
                  <span className="text-xs text-stone-400 mr-2 font-mono">{String(prop.n).padStart(2, '0')}</span>
                  {language === 'zh' ? prop.tZh : prop.tEn}
                </button>
              ))}
            </div>

            <div className="w-full lg:w-3/4 flex flex-col gap-8">

              <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeProp.n}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 md:p-12 flex-grow flex flex-col"
                  >
                    <h3 className="text-4xl font-serif font-bold text-stone-900 mb-6 flex items-baseline gap-4">
                      <span className="text-amber-500 text-2xl font-mono">{String(activeProp.n).padStart(2, '0')}</span>
                      {language === 'zh' ? activeProp.tZh : activeProp.tEn}
                    </h3>

                    <p className="text-lg text-stone-700 leading-relaxed mb-6 border-l-4 border-stone-300 pl-6 italic">
                      "{language === 'zh' ? activeProp.quoteZh : activeProp.quoteEn}"
                    </p>

                    <div className="flex items-center gap-2 mb-10">
                      <span className="px-3 py-1 bg-stone-100 text-stone-600 text-xs font-mono rounded-sm border border-stone-200">
                        {language === 'zh' ? activeProp.mechZh : activeProp.mechEn}
                      </span>
                      <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-mono rounded-sm border border-amber-200 flex items-center gap-1">
                        <Info className="w-3 h-3" /> {language === 'zh' ? activeProp.relZh : activeProp.relEn}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div className="bg-emerald-50/50 p-6 rounded-lg border border-emerald-100 hover:shadow-sm transition-shadow">
                        <h4 className="flex items-center gap-2 text-emerald-800 font-bold mb-4 uppercase tracking-wider text-sm">
                          <Leaf className="w-4 h-4" />
                          {language === 'zh' ? '在自然界中的体现' : 'Manifestation in Nature'}
                        </h4>
                        <p className="text-stone-600 text-sm leading-relaxed">
                          {language === 'zh' ? activeProp.natureZh : activeProp.natureEn}
                        </p>
                      </div>

                      <div className="bg-stone-50 p-6 rounded-lg border border-stone-200 hover:shadow-sm transition-shadow">
                        <h4 className="flex items-center gap-2 text-stone-800 font-bold mb-4 uppercase tracking-wider text-sm">
                          <Building2 className="w-4 h-4" />
                          {language === 'zh' ? '在空间设计中的体现' : 'Manifestation in Design'}
                        </h4>
                        <p className="text-stone-600 text-sm leading-relaxed">
                          {language === 'zh' ? activeProp.exampleZh : activeProp.exampleEn}
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-stone-100">
                      <p className="text-xs text-stone-400 uppercase tracking-widest mb-4 font-bold flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        {language === 'zh' ? '《秩序的本质》原著图解' : 'Illustration from The Nature of Order'}
                      </p>

                      <div className="w-full flex justify-center items-center py-2">
                        {activeProp.bookImg ? (
                          <img
                            src={activeProp.bookImg}
                            alt="Book Illustration"
                            className="max-h-[250px] md:max-h-[320px] w-auto max-w-full object-contain mix-blend-multiply opacity-85 group-hover:opacity-100 transition-opacity"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect fill='%23f5f5f4' width='100%25' height='100%25'/%3E%3Ctext fill='%23a8a29e' x='50%25' y='50%25' font-family='sans-serif' font-size='14' text-anchor='middle'%3EWaiting for book image scan...%3C/text%3E%3C/svg%3E"
                            }}
                          />
                        ) : (
                          <div className="text-stone-400 text-sm font-mono flex items-center gap-2">
                            <ScanLine className="w-4 h-4" /> Image scan pending...
                          </div>
                        )}
                      </div>
                    </div>

                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden p-8 md:p-12">
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 mb-6 flex items-center gap-2">
                  <ScanLine className="w-4 h-4" /> {language === 'zh' ? '互动分析对比' : 'Interactive Analysis'}
                </h4>
                <PropertyVisuals
                  key={activeProp.n}
                  imgPos={activeProp.imgPos}
                  imgNeg={activeProp.imgNeg}
                  title={language === 'zh' ? activeProp.tZh : activeProp.tEn}
                />
              </div>

            </div>
          </div>
        </Section>

        {/* 💡 新增：Campus Lab 校园实践项目与 AI 融合 */}
        <CampusProjectsSection isEn={isEn} />

        {/* Section 5: Chinese Architecture */}
        <div className="mt-32">
          <Section title={trans.theory?.chinese?.title || "Chinese Architecture"} className="!pt-0 !border-0">
            <div className="mb-12 max-w-2xl">
              <p className="text-lg text-stone-600
                 leading-relaxed font-serif">
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