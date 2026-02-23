import React, { useState, useRef, useEffect } from "react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { cn } from "@/app/components/ui";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronDown, ArrowRight, ArrowLeft, Quote, Info, Check, X, 
  Minus, Plus, Search, MapPin, Calendar, Activity, BarChart3,
  Columns, ScanLine, Maximize, MoveHorizontal, Divide,
  Eye, Layers, ArrowUpRight
} from "lucide-react";
import { useLanguage } from "@/app/i18n/LanguageContext";
const langjialiImage = "/images/Boundaries.png";

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
      exampleEn: "The architectural facade in the left image exhibits a rich scaling hierarchy through the use of variably sized windows and brickwork. The fenestration is further subdivided by frames into smaller panes, while the brick surfaces feature subtle textures. This creates a multi-level scalar structure that transitions seamlessly from the overall facade to the windows, subdivisions, bricks, and finally to the micro-textures.In contrast, the facade in the right image lacks such intricate articulation of its windows and wall surfaces. Its overall texture and detailing are relatively monotonous, resulting in a flat scaling hierarchy and a comparatively bland appearance.",
      exampleZh: "左图展示的建筑立面通过不同大小的窗户和墙面砖块体现了丰富的尺度层次。窗户由窗框进一步划分为小的分格，而砖块表面还有细腻的纹理，形成了从立面整体到窗户、分格、砖块，再到纹理的多重尺度层级。右图的建筑立面缺乏窗户和墙面的细致划分，整体纹理和细节也较为单一，导致其尺度层次单薄，显得较为平淡。",
      imgPos: "/images/level of scale.png",
      imgNeg: "/images/LOSNEG.png"
    },
    {
      n: 2, tEn: "Strong Centers", tZh: "强中心",
      quoteEn: "The strength of the centers dictates the cohesion and order of spatial organization.",
      quoteZh: "中心的强度决定了空间的组织是否紧密有序。",
      mechEn: "Strength depends on relational density (S).",
      mechZh: "强度取决于关系密度 S。",
      relEn: "Primarily increases S (Strength) by intensifying focus.",
      relZh: "通过强化焦点主要增加 S（强度）。",
      exampleEn: "The residence in the left image reinforces its 'strong centers' through its spatial configuration. Within each room, the arrangement of furniture establishes local centers, while the overall architecture unfolds around a central courtyard. The courtyard and the main hall serve as the core spaces, fostering closer human connections. Crucially, this centricity is derived not solely from the courtyard itself, but relies on the holistic organization of the adjacent rooms and furnishings. These elements mutually reinforce one another, collectively enhancing the spatial hierarchy.Conversely, the architecture in the right image lacks definitive centers. Its spatial layout is fragmented, leading to dispersed and isolated human activities devoid of organic connection.",
      exampleZh: "左图的住宅通过空间组织强化了中心性。每个房间内部由家具布局形成局部中心，而整个建筑围绕庭院展开，庭院和大厅成为核心空间，使人们的生活更加紧密联系。这种中心性不仅来自庭院本身，还依赖于周围房间和家具的整体组织，它们相互衬托，共同强化空间的层次感。相比之下，右图的建筑缺乏清晰的中心，空间分散，人们的活动更为松散和孤立，缺少有机的联系。",
      imgPos: "/images/Strong centers.png",
      imgNeg: "/images/SCNEG.png"
    },
    {
      n: 3, tEn: "Boundaries", tZh: "边界",
      quoteEn: "Boundaries create transitional layers that strengthen centers.",
      quoteZh: "边界通过过渡层强化中心。",
      mechEn: "Layered edges stabilize spatial continuity.",
      mechZh: "层级边界增强空间连续性。",
      relEn: "Increases S (Strength) by containing energy.",
      relZh: "通过包含能量增加 S（强度）。",
      exampleEn: "The left image shows the Gwalior Fort in India. The top-level railing acts as a boundary, highlighting the architectural facade as the center while harmonizing the relationship between the sky and the facade. The right image shows a 20th-century apartment building; due to a lack of boundaries, the architecture appears isolated from its surroundings. Boundaries exist not only on the exterior but also permeate through the various hierarchies within the center. In the Gwalior Fort, boundaries are incorporated across all scales—from railings and columns to wall surfaces. Internally, each boundary is composed of even smaller centers and boundaries, progressing hierarchically to achieve a rich and unified whole.",
      exampleZh: "左图为印度瓜廖尔城堡，顶层的围栏作为边界，凸显了建筑立面这一中心，同时协调了天空与立面的关系。右图为一座20世纪公寓，因缺乏边界，建筑显得孤立于周围环境。边界不仅存在于外部，也贯穿于中心内部的各个等级。在瓜廖尔城堡中，围栏、立柱、墙面等各尺度都包含边界，每个边界内部又由更小的中心和边界组成，层层递进，丰富统一。",
      imgPos: "/images/Boundaries.png",
      imgNeg: "/images/BN.png"
    },
    {
      n: 4, tEn: "Alternating Repetition", tZh: "交替重复",
      quoteEn: "Simple repetition is mechanical and lifeless. Living repetition is alternating.",
      quoteZh: "简单的重复是机械且无生命的。有生命的重复是交替的。",
      mechEn: "A special form of alternating repetition refers to the alternating occurrence of two or more vibrant centers, creating a unique rhythm. By mutually accentuating one another, they enhance the overall vitality of the whole.",
      mechZh: "特殊的“交替重复”指两种或多种富有活力的中心交替出现，形成独特的韵律，彼此衬托，增强整体的生命力。",
      relEn: "Increases H (Hierarchy) through rhythmic complexity.",
      relZh: "通过节奏复杂性增加 H（层级）。",
      exampleEn: "Designs featuring alternating repetition follow two principles. First, the substructures participating in the alternation must themselves possess vitality.The left image shows Brunelleschi's Hospital (Ospedale degli Innocenti) in Florence, Italy. On its facade, columns, arches, circular medallions, and intercolumnar spaces alternate. Each substructure is imbued with life, generating an overall vitality through alternating repetition. The right image depicts the colonnade of a modern building; although there is an alternation between the columns and the spaces between them, the overall structure lacks vitality because the substructures are monotonous and mechanical.Furthermore, alternating repetition exists within organizations across different scales. Small-scale substructures form large-scale substructures through alternating repetition, and these large-scale structures construct an even larger whole in a similar manner. In the left image, the arched colonnade and the intercolumnar spaces form a large-scale alternating repetition, while each individual arch creates a small-scale alternating repetition through its convex and concave curved lines. This cross-scale recursive organization ensures that the design is full of vitality at every level.",
      exampleZh: "具有“交替重复”的设计遵循两个原则。首先，参与交替的子结构本身需要是有活力的。左图为意大利佛罗伦萨布鲁内莱斯基医院，其立面中柱子、圆拱、圆形符号以及柱间空间交替出现，每个子结构都富有生命力，通过交替重复形成整体的活力。右图为某现代建筑的柱廊，尽管存在柱子与柱间空间的交替，但因子结构单调机械，整体显得缺乏活力。此外，“交替重复”存在于不同尺度的组织中。小尺度的子结构通过交替重复形成大尺度的子结构，而大尺度的结构又以类似方式构成更大的整体。左图中拱形柱廊与柱间空间形成大尺度的交替重复，而每个圆拱本身又通过凸起与凹陷的弧形线条在小尺度形成交替重复。这种跨尺度的递归组织，使设计在每个层级都充满生命力。",
      imgPos: "/images/Alternating repetition.png",
      imgNeg: "/images/ARNEG.png"
    },
    {
      n: 5, tEn: "Positive Space", tZh: "正空间",
      quoteEn: "Space is not merely the residue between objects but a distinct entity.",
      quoteZh: "空间不仅仅是物体之间的残留物，而是一个独立的实体。",
      mechEn: "The mechanism for creating positive space is enclosure and convexity.",
      mechZh: "创造正空间的机制是围合和凸性。",
      relEn: "Increases S (Strength) by shaping the void.",
      relZh: "通过塑造虚空增加 S（强度）。",
      exampleEn: "A public square defined by continuous building facades.",
      exampleZh: "由连续建筑立面定义的公共广场。",
      imgPos: "/images/Positive space.png",
      imgNeg: "/images/PSNEG.png"
    },
    {
      n: 6, tEn: "Good Shape", tZh: "良好形状",
      quoteEn: "Every element in a living structure should have a 'good shape'—simple and coherent.",
      quoteZh: "生命结构中的每个元素都应该有一个“良形”——简单且连贯。",
      mechEn: "Mechanism implies compactness and elementary geometry (squares, circles).",
      mechZh: "机制意味着紧凑性和基本几何（正方形、圆形）。",
      relEn: "Increases S (Strength) through geometric coherence.",
      relZh: "通过几何连贯性增加 S（强度）。",
      exampleEn: "A perfectly proportioned rectangular window or circular arch.",
      exampleZh: "比例完美的矩形窗或圆拱。",
      imgPos: "/images/Good shape.png",
      imgNeg: "/images/GSNEG.png"
    },
    {
      n: 7,tEn: "Local Symmetries", tZh: "局部对称",
      quoteEn: "Small parts of the structure should be symmetrical within themselves.",
      quoteZh: "结构的微小部分在自身内部应对称。",
      mechEn: "The mechanism is the creation of 'sub-centers' through reflection.", 
      mechZh: "该机制是通过反射创建“子中心”。",
      relEn: "Increases S (Strength) by binding centers locally.",
      relZh: "通过局部结合中心增加 S（强度）。",
      exampleEn: "Ornaments, door frames, or individual tiles having internal symmetry.",
      exampleZh: "装饰品、门框或单个瓷砖具有内部对称性。",
      imgPos: "/images/Local symmetries.png",
      imgNeg: "/images/LSNEG.png"
    },
    {
      n: 8,tEn: "Deep interlock and ambiguity", tZh: "深度交织与模糊性",
      quoteEn: "Elements should not simply sit next to each other; they should interlock.",
      quoteZh: "元素不应仅仅彼此相邻；它们应该嵌合。",
      mechEn: "The mechanism uses 'ambiguity of belonging' where material A penetrates material B.",
      mechZh: "该机制利用“归属的模糊性”，即材料 A 穿透材料 B。",
      relEn: "Increases S (Strength) by fusing adjacent centers.",
      relZh: "通过融合相邻中心增加 S（强度）。",
      exampleEn: "Dove-tail joints in wood or interlocking paving stones.",
      exampleZh: "木材中的燕尾榫或互锁铺路石。",
      imgPos: "/images/Deep interlock and ambiguity.png",
      imgNeg: "/images/DNEG.png"
    },
    {
      n: 9, tEn: "Contrast", tZh: "对比",
      quoteEn: "Life requires difference. Distinct parts should be visibly different in character.",
      quoteZh: "生命需要差异。独特部分在特征上应明显不同。",
      mechEn: "The mechanism is the unification of opposites, enhancing both qualities.",
      mechZh: "机制是对立面的统一，增强了两种特质。",
      relEn: "Increases S (Strength) by clarifying distinction.",
      relZh: "通过阐明区别增加 S（强度）。",
      exampleEn: "Light against dark, rough stone against smooth plaster.",
      exampleZh: "明与暗，粗糙石头与光滑灰泥。",
      imgPos: "/images/Contrast.png",
      imgNeg: "/images/CNEG.png"
    },
    {
      n: 10, tEn: "Gradients", tZh: "渐变",
      quoteEn: "A quality should slowly change across space to soften harshness.",
      quoteZh: "一种特质应该在空间中缓慢变化以柔化严酷。",
      mechEn: "The mechanism is the serialized progression of properties (A1, A2, A3...).",
      mechZh: "机制是属性的序列化推进（A1, A2, A3...）。",
      relEn: "Increases H (Hierarchy) by connecting scales.",
      relZh: "通过连接尺度增加 H（层级）。",
      exampleEn: "Steps of a staircase or diminishing sizes of arches.",
      exampleZh: "楼梯的台阶或逐渐缩小的拱门。",
      imgPos: "/images/Gradients.png",
      imgNeg: "/images/GRNEG.png"
    },
    {
      n: 11, tEn: "Roughness", tZh: "粗糙性",
      quoteEn: "True order is not perfect; it is rough and adaptive to local conditions.",
      quoteZh: "真正的秩序不是完美的；它是粗糙的且适应局部条件。",
      mechEn: "The mechanism is local relaxation of the grid to minimize tension.",
      mechZh: "机制是网格的局部松弛以最小化张力。",
      relEn: "Increases S (Strength) by adapting to reality.",
      relZh: "通过适应现实增加 S（强度）。",
      exampleEn: "Hand-laid brick walls with slight irregularities.",
      exampleZh: "手工砌筑的略带不规则的砖墙。",
      imgPos: "/images/Roughness.png",
      imgNeg: "/images/RNEG.png"
    },
    {
      n: 12, tEn: "Echoes", tZh: "共鸣",
      quoteEn: "The same structural logic appears at different scales throughout the design.",
      quoteZh: "相同结构逻辑出现在设计的不同尺度中。",
      mechEn: "The mechanism is the use of a 'generative seed' or fractal DNA recursively.",
      mechZh: "机制是递归使用“生成种子”或分形 DNA。",
      relEn: "Increases H (Hierarchy) through self-similarity.",
      relZh: "通过自相似性增加 H（层级）。",
      exampleEn: "The curve of a dome echoed in the arches below it.",
      exampleZh: "圆顶的曲线在其下方的拱门中得到呼应。",
      imgPos: "/images/Echoes.png",
      imgNeg: "/images/ENEG.png"
    },
    {
      n: 13, tEn: "The Void", tZh: "虚空",
      quoteEn: "In the most intense centers, there is often a moment of pure silence.",
      quoteZh: "在最强烈的中心里，通常有一刻纯粹的寂静。",
      mechEn: "The mechanism is the deliberate preservation of an empty center bounded by structure.",
      mechZh: "机制是特意保留一个由结构包围的空中心。",
      relEn: "Increases S (Strength) by creating a calm center.",
      relZh: "通过创造平静中心增加 S（强度）。",
      exampleEn: "An empty altar or a quiet central courtyard.",
      exampleZh: "左图为开罗拜巴尔清真寺，其中央中庭作为“虚空”，让周边小房间更有活力和秩序感。右图为某办公空间，缺乏中央虚空，满是小房间，显得拥挤、嘈杂。无论宗教建筑还是其他建筑，中心的虚空空间都至关重要，它能平衡嘈杂与宁静，提升空间的舒适性与体验感。",
      imgPos: "/images/The void.png",
      imgNeg: "/images/VNEG.png"
    },
    {
      n: 14, tEn: "Simplicity and Inner Calm", tZh: "简洁与内在平静",
      quoteEn: "The form feels calm because everything is exactly where it needs to be.",
      quoteZh: "形式感觉平静，因为一切都在它应该在的地方。",
      mechEn: "The mechanism is the removal of structural noise (Occam's Razor).",
      mechZh: "机制是消除结构噪音（奥卡姆剃刀）。",
      relEn: "Increases S (Strength) by removing friction.",
      relZh: "通过消除摩擦增加 S（强度）。",
      exampleEn: "A Shaker chair or a Zen garden.",
      exampleZh: "震颤派椅子或禅宗花园。",
      imgPos: "/images/Simplicity and inner calm.png",
      imgNeg: "/images/SINEG.png"
    },
    {
      n: 15, tEn: "Not-Separateness", tZh: "非分离性",
      quoteEn: "A living structure is not separate from its surroundings; it grows out of them.",
      quoteZh: "生命结构与其周围环境不是分离的；它是从中生长出来的。",
      mechEn: "The mechanism is the blurring of the outer boundary through interpenetration.",
      mechZh: "机制是通过相互渗透模糊外边界。",
      relEn: "Increases H (Hierarchy) by connecting to the largest whole.",
      relZh: "通过连接到最大整体增加 H（层级）。",
      exampleEn: "A building that steps down the hillside, merging with the terrain.",
      exampleZh: "顺山势而下的建筑，与地形融为一体。",
      imgPos: "/images/Not separateness.png",
      imgNeg: "/images/NSNEG.png"
    }
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
  imageUrl: string; 
  diagramUrl: string; 
  elevationUrl: string; 
  levels: number[];
  relatedProperties: number[];
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
    diagramUrl: langjialiImage,
    elevationUrl: "https://images.unsplash.com/photo-1754873313580-5d70c8fa2b29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaGUlMjBBbGhhbWJyYSUyMEdyYW5hZGElMjBpbnRyaWNhdGUlMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzcxNjQ3OTYzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    levels: [4, 10, 36, 123, 533, 2967],
    relatedProperties: [1, 3, 11, 15]
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
    diagramUrl: "https://images.unsplash.com/photo-1599571342676-47b297800067?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxGb3JiaWRkZW4lMjBDaXR5JTIwcm9vZiUyMGRldGFpbCUyMGdvbGRlbnxlbnwxfHx8fDE3NzE2NDk2MTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    elevationUrl: "https://images.unsplash.com/photo-1546261547-49f3e4c4c77c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxGb3JiaWRkZW4lMjBDaXR5JTIwZmFjYWRlfGVufDF8fHx8MTc3MTY0OTYxOXww&ixlib=rb-4.1.0&q=80&w=1080",
    levels: [2, 12, 48, 192, 864, 4200],
    relatedProperties: [2, 6, 7, 12, 14]
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
    diagramUrl: "https://images.unsplash.com/photo-1523528206898-1e43c5101037?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXpob3UlMjBnYXJkZW4lMjBkZXRhaWx8ZW58MXx8fHwxNzcxNjQ5NjE5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    elevationUrl: "https://images.unsplash.com/photo-1512805177439-012b18f15d73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXpob3UlMjBnYXJkZW4lMjB3aW5kb3d8ZW58MXx8fHwxNzcxNjQ5NjE5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    levels: [6, 24, 88, 300, 1100, 3500],
    relatedProperties: [4, 8, 11, 13, 15]
  }
];

// --- Components ---

const Section = ({ title, subTitle, children, className }: { title: string, subTitle?: string, children: React.ReactNode, className?: string }) => (
  <section className={cn("mb-32 pt-12 border-t border-stone-200", className)}>
    <div className="flex flex-col md:flex-row gap-4 md:gap-8 mb-16 items-baseline">
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
  number, p, isOpen, onToggle
}: any) => {
  const { language } = useLanguage();
  
  // Select content based on language
  const title = language === 'zh' ? p.tZh : p.tEn;
  const quote = language === 'zh' ? p.quoteZh : p.quoteEn;
  const mech = language === 'zh' ? p.mechZh : p.mechEn;
  const rel = language === 'zh' ? p.relZh : p.relEn;
  const example = language === 'zh' ? p.exampleZh : p.exampleEn;

  return (
    <div className="border-t border-stone-100 py-6 first:border-t-2 first:border-stone-900 transition-all duration-300 hover:bg-stone-50/50 px-2 -mx-2 rounded-sm">
      <div 
        onClick={onToggle}
        className="cursor-pointer group grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline"
      >
        <div className="col-span-1 md:col-span-1 flex items-center gap-4 md:block">
           <span className={cn(
            "text-xl md:text-2xl font-mono transition-colors duration-300",
            isOpen ? "text-stone-900 font-medium" : "text-stone-300 group-hover:text-stone-400"
          )}>
            {number < 10 ? `0${number}` : number}
          </span>
        </div>
        <div className="col-span-1 md:col-span-4">
          <h3 className="text-xl md:text-2xl font-serif font-bold text-stone-900 mb-1 group-hover:text-stone-600 transition-colors">{title}</h3>
        </div>
        <div className="col-span-1 md:col-span-6 pr-8 hidden md:block">
           {!isOpen && (
             <motion.p 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               className="text-sm text-stone-500 font-serif italic leading-relaxed truncate"
             >
               "{quote}"
             </motion.p>
           )}
        </div>
        <div className="col-span-1 md:col-span-1 flex justify-end">
           <ChevronDown className={cn(
             "w-5 h-5 text-stone-300 transition-transform duration-300",
             isOpen ? "rotate-180 text-stone-900" : "group-hover:text-stone-500"
           )} />
        </div>
      </div>

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
               <div className="col-span-1 md:col-span-5 md:col-start-2 space-y-8">
                  {/* Definition / Quote */}
                  <div className="relative pl-6 border-l-2 border-stone-200">
                    <Quote className="absolute -top-2 -left-3 w-6 h-6 bg-[#FDFBF7] text-stone-300" />
                    <p className="text-lg font-serif italic text-stone-800 mb-2">"{quote}"</p>
                  </div>
                  
                  {/* Mechanism */}
                  <div className="mb-6">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 mb-2">Structural Mechanism</h4>
                    <p className="text-stone-700 leading-relaxed">{mech}</p>
                  </div>

                   {/* Example */}
                   <div className="mb-6">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 mb-2">Architectural Example</h4>
                    <p className="text-stone-700 leading-relaxed italic">{example}</p>
                  </div>
                  
                  {/* Relation */}
                  <div className="bg-white p-6 border border-stone-200 shadow-sm rounded-sm">
                     <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 mb-3 flex items-center gap-2">
                       <Info className="w-3 h-3" /> Relation to L = S × H
                     </h4>
                     <p className="text-sm font-medium text-stone-800 font-serif mb-1">{rel}</p>
                  </div>
               </div>

               <div className="col-span-1 md:col-span-6 space-y-6">
                  <PropertyVisuals 
                    imgPos={p.imgPos} 
                    imgNeg={p.imgNeg} 
                    title={p.tEn} 
                  />
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ChineseArchitecturalSystem = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [highlightCenters, setHighlightCenters] = useState(false);
  const { trans, language } = useLanguage();

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
                    {trans.theory.chinese.viewAnalysis} <ArrowRight className="w-3 h-3" />
                  </button>
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
      <div className="border-b border-stone-100 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-stone-50/50">
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

      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Analysis */}
        <div className="lg:col-span-4 space-y-8">
           <div>
             <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 mb-3 border-b border-stone-100 pb-2 inline-block">
               {trans.theory.chinese.analysisTitle}
             </h4>
             <p className="text-stone-700 leading-relaxed text-sm">
               {language === 'zh' ? selectedCase.descriptionZh : selectedCase.description}
             </p>
           </div>
           
           {/* Layered Analysis */}
           <div>
              <div className="flex items-center gap-2 text-stone-400 uppercase tracking-wider text-[10px] mb-4">
                 <Layers className="w-3 h-3" /> {trans.theory.chinese.layerExplainer}
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

           {/* Related Properties */}
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

           {/* Toggle Centers */}
           <div className="pt-6 border-t border-stone-100">
              <label className="flex items-center justify-between cursor-pointer group">
                 <span className="text-sm font-medium text-stone-700 group-hover:text-stone-900 transition-colors">{trans.theory.chinese.toggleCenters}</span>
                 <button 
                   onClick={() => setHighlightCenters(!highlightCenters)}
                   className={cn(
                     "w-12 h-6 rounded-full relative transition-colors duration-300",
                     highlightCenters ? "bg-amber-500" : "bg-stone-200"
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

        {/* Right Column: Visual Analysis */}
        <div className="lg:col-span-8 grid grid-cols-1 gap-6">
           <div className="bg-white border border-stone-100 p-1 rounded-sm shadow-sm group relative">
              <div className="relative aspect-[16/9] overflow-hidden bg-stone-50 flex items-center justify-center">
                 <ImageWithFallback 
                   src={selectedCase.diagramUrl}
                   alt="Structural Diagram"
                   className={cn(
                     "w-full h-full object-contain mix-blend-multiply transition-all duration-700",
                     highlightCenters ? "opacity-100 scale-105" : "opacity-80"
                   )}
                 />
                 {highlightCenters && (
                   <div className="absolute inset-0 pointer-events-none">
                      {/* Simulated highlighted centers overlay */}
                      <div className="absolute top-1/2 left-1/2 w-32 h-32 border-2 border-red-500 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50 animate-pulse" />
                      <div className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-red-500 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-30" />
                      <div className="absolute top-1/2 right-1/4 w-16 h-16 border-2 border-red-500 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-30" />
                   </div>
                 )}
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
  const { trans } = useLanguage();
  
  const toggleProperty = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] text-stone-800 pb-24">
      
      <div className="w-full max-w-7xl mx-auto p-8 md:p-16 pb-0">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <div className="border-b border-stone-200 pb-12 mb-12">
             <div className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400 mb-6">Theoretical Framework</div>
             <div className="space-y-3 font-serif text-lg text-stone-600 leading-relaxed">
               <p>Living Structure originates from structural wholeness.</p>
               <p>Vitality emerges from hierarchical coherence.</p>
               <p className="font-bold text-stone-900 mt-4">L = S × H</p>
             </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif font-bold text-stone-900 mb-4 tracking-tight">
            THEORY OF<br/>LIVING STRUCTURE
          </h1>
          <p className="text-stone-500 font-mono uppercase tracking-widest text-xs">Vitality in Geometry & Architecture</p>
        </motion.div>

        {/* Section 1: Origin */}
        <Section title={trans.theory.origin.title} className="!pt-0 !border-0">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
             <div className="space-y-6">
               <p className="text-stone-800 text-lg leading-relaxed font-serif">{trans.theory.origin.content1}</p>
               <p className="text-stone-600 text-sm leading-relaxed">{trans.theory.origin.content2}</p>
             </div>
             <div className="bg-stone-100 p-8 rounded-sm">
                <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">{trans.theory.origin.formulaTitle}</h4>
                <div className="text-4xl font-serif font-bold text-stone-900 mb-4">L = S × H</div>
                <div className="space-y-2 text-sm text-stone-600 font-mono">
                  <div className="flex justify-between border-b border-stone-200 pb-1"><span>L</span> <span>{trans.theory.origin.formulaL}</span></div>
                  <div className="flex justify-between border-b border-stone-200 pb-1"><span>S</span> <span>{trans.theory.origin.formulaS}</span></div>
                  <div className="flex justify-between"><span>H</span> <span>{trans.theory.origin.formulaH}</span></div>
                </div>
             </div>
           </div>
           
           {/* Small Portrait Area */}
           <div className="flex gap-8 border-t border-stone-100 pt-8">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-stone-200 rounded-full overflow-hidden grayscale">
                   <ImageWithFallback src="https://images.unsplash.com/photo-1630756408085-ee4db9767669?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDaHJpc3RvcGhlciUyMEFsZXhhbmRlciUyMGFyY2hpdGVjdCUyMHBvcnRyYWl0JTIwYmxhY2slMjBhbmQlMjB3aGl0ZXxlbnwxfHx8fDE3NzE2NDkyMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="C. Alexander" className="w-full h-full object-cover" />
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
                    <div className="font-bold text-stone-900">Prof. Bin Jiang</div>
                    <div className="text-stone-400">Living Structure</div>
                 </div>
              </div>
           </div>
        </Section>

        {/* Section 2: Aesthetic Context */}
        <Section title={trans.theory.aesthetic.title}>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
             <div className="p-8 bg-white border border-stone-200 shadow-sm">
                <p className="text-stone-600 leading-relaxed mb-4">{trans.theory.aesthetic.p1}</p>
                <div className="h-1 w-12 bg-stone-200" />
             </div>
             <div className="p-8 bg-stone-50 border border-stone-200">
                <p className="text-stone-800 font-medium leading-relaxed mb-4">{trans.theory.aesthetic.p2}</p>
                <div className="h-1 w-12 bg-amber-200" />
             </div>
           </div>
        </Section>

        {/* Section 3: How to See */}
        <Section title={trans.theory.howToSee.title}>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-stone-200 border border-stone-200 bg-white">
              <div className="p-8 text-center hover:bg-stone-50 transition-colors">
                 <div className="w-10 h-10 mx-auto bg-stone-100 rounded-full flex items-center justify-center text-stone-600 mb-4">
                    <Eye className="w-5 h-5" />
                 </div>
                 <h4 className="font-serif font-bold text-stone-900 mb-2">{trans.theory.howToSee.method1}</h4>
                 <p className="text-xs text-stone-500">{trans.theory.howToSee.method1Desc}</p>
              </div>
              <div className="p-8 text-center hover:bg-stone-50 transition-colors">
                 <div className="w-10 h-10 mx-auto bg-stone-100 rounded-full flex items-center justify-center text-stone-600 mb-4">
                    <Layers className="w-5 h-5" />
                 </div>
                 <h4 className="font-serif font-bold text-stone-900 mb-2">{trans.theory.howToSee.method2}</h4>
                 <p className="text-xs text-stone-500">{trans.theory.howToSee.method2Desc}</p>
              </div>
              <div className="p-8 text-center hover:bg-stone-50 transition-colors">
                 <div className="w-10 h-10 mx-auto bg-stone-100 rounded-full flex items-center justify-center text-stone-600 mb-4">
                    <ArrowUpRight className="w-5 h-5" />
                 </div>
                 <h4 className="font-serif font-bold text-stone-900 mb-2">{trans.theory.howToSee.method3}</h4>
                 <p className="text-xs text-stone-500">{trans.theory.howToSee.method3Desc}</p>
              </div>
           </div>
        </Section>

        {/* Section 4: 15 Properties */}
        <Section title="15 Properties" subTitle={trans.theory.propertiesSubtitle}>
          <div className="border-b border-stone-200">
             {properties.map((p) => (
               <PropertyBlock 
                 key={p.n}
                 number={p.n}
                 p={p}
                 isOpen={openId === p.n}
                 onToggle={() => toggleProperty(p.n)}
               />
             ))}
          </div>
        </Section>
        
        {/* Section 5: Chinese Architecture (Independent) */}
        <div className="mt-32">
          <Section title={trans.theory.chinese.title} className="!pt-0 !border-0">
             <div className="mb-12 max-w-2xl">
                <p className="text-lg text-stone-600 leading-relaxed font-serif">
                   {trans.theory.chinese.intro}
                </p>
             </div>
             <ChineseArchitecturalSystem />
          </Section>
        </div>

      </div>
    </div>
  );
}
