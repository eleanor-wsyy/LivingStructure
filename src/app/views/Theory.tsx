import React, { useState, useRef } from "react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { cn } from "@/app/components/ui";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Quote, Info, Check, X, 
  Columns, ScanLine, MoveHorizontal,
  Eye, Layers, ArrowUpRight, Leaf, Building2, BookOpen, Sparkles, Microscope, Loader2, RefreshCcw
} from "lucide-react";
import { useLanguage } from "@/app/i18n/LanguageContext";

// 💡 相对路径导入：直接跳出一层寻找 hooks 文件夹
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
      natureEn: "An oak tree shows distinct levels: the massive trunk, large branches, smaller boughs, twigs, and finally the leaves and their veins.",
      natureZh: "一棵橡树展现了清晰的层级：粗壮的树干、大树枝、小树枝、细枝，最后是树叶和叶脉。",
      exampleEn: "The architectural facade in the left image exhibits a rich scaling hierarchy through the use of variably sized windows and brickwork. The fenestration is further subdivided by frames into smaller panes, while the brick surfaces feature subtle textures. This creates a multi-level scalar structure that transitions seamlessly from the overall facade to the windows, subdivisions, bricks, and finally to the micro-textures.In contrast, the facade in the right image lacks such intricate articulation of its windows and wall surfaces. Its overall texture and detailing are relatively monotonous, resulting in a flat scaling hierarchy and a comparatively bland appearance.",
      exampleZh: "左图展示的建筑立面通过不同大小的窗户和墙面砖块体现了丰富的尺度层次。窗户由窗框进一步划分为小的分格，而砖块表面还有细腻的纹理，形成了从立面整体到窗户、分格、砖块，再到纹理的多重尺度层级。右图的建筑立面缺乏窗户和墙面的细致划分，整体纹理和细节也较为单一，导致其尺度层次单薄，显得较为平淡。",
      imgPos: "/images/level of scale.png",
      imgNeg: "/images/LOSNEG.png",
      bookImg: "/images/alexander/scale-nature.jpg" 
    },
    {
      n: 2, tEn: "Strong Centers", tZh: "强中心",
      quoteEn: "The strength of the centers dictates the cohesion and order of spatial organization.",
      quoteZh: "中心的强度决定了空间的组织是否紧密有序。",
      mechEn: "Strength depends on relational density (S).",
      mechZh: "强度取决于关系密度 S。",
      relEn: "Primarily increases S (Strength) by intensifying focus.",
      relZh: "通过强化焦点主要增加 S（强度）。",
      natureEn: "A sunflower head, or the eye of a hurricane, acting as a powerful focal point that defines everything around it.",
      natureZh: "向日葵的花盘，或是飓风的风眼，作为强大的焦点定义了周围的一切。",
      exampleEn: "The residence in the left image reinforces its 'strong centers' through its spatial configuration. Within each room, the arrangement of furniture establishes local centers, while the overall architecture unfolds around a central courtyard. The courtyard and the main hall serve as the core spaces, fostering closer human connections. Crucially, this centricity is derived not solely from the courtyard itself, but relies on the holistic organization of the adjacent rooms and furnishings. These elements mutually reinforce one another, collectively enhancing the spatial hierarchy.Conversely, the architecture in the right image lacks definitive centers. Its spatial layout is fragmented, leading to dispersed and isolated human activities devoid of organic connection.",
      exampleZh: "左图的住宅通过空间组织强化了中心性。每个房间内部由家具布局形成局部中心，而整个建筑围绕庭院展开，庭院和大厅成为核心空间，使人们的生活更加紧密联系。这种中心性不仅来自庭院本身，还依赖于周围房间和家具的整体组织，它们相互衬托，共同强化空间的层次感。相比之下，右图的建筑缺乏清晰的中心，空间分散，人们的活动更为松散和孤立，缺少有机的联系。",
      imgPos: "/images/Strong centers.png",
      imgNeg: "/images/SCNEG.png",
      bookImg: "/images/alexander/strong-center.jpg"
    },
    {
      n: 3, tEn: "Boundaries", tZh: "边界",
      quoteEn: "Boundaries create transitional layers that strengthen centers.",
      quoteZh: "边界通过过渡层强化中心。",
      mechEn: "Layered edges stabilize spatial continuity.",
      mechZh: "层级边界增强空间连续性。",
      relEn: "Increases S (Strength) by containing energy.",
      relZh: "通过包含能量增加 S（强度）。",
      natureEn: "The membrane of a cell, or the shoreline where a river meets the land.",
      natureZh: "细胞的细胞膜，或是河流与陆地交界的海岸线。",
      exampleEn: "The left image shows the Gwalior Fort in India. The top-level railing acts as a boundary, highlighting the architectural facade as the center while harmonizing the relationship between the sky and the facade. The right image shows a 20th-century apartment building; due to a lack of boundaries, the architecture appears isolated from its surroundings. Boundaries exist not only on the exterior but also permeate through the various hierarchies within the center. In the Gwalior Fort, boundaries are incorporated across all scales—from railings and columns to wall surfaces. Internally, each boundary is composed of even smaller centers and boundaries, progressing hierarchically to achieve a rich and unified whole.",
      exampleZh: "左图为印度瓜廖尔城堡，顶层的围栏作为边界，凸显了建筑立面这一中心，同时协调了天空与立面的关系。右图为一座20世纪公寓，因缺乏边界，建筑显得孤立于周围环境。边界不仅存在于外部，也贯穿于中心内部的各个等级。在瓜廖尔城堡中，围栏、立柱、墙面等各尺度都包含边界，每个边界内部又由更小的中心和边界组成，层层递进，丰富统一。",
      imgPos: "/images/Boundaries.png",
      imgNeg: "/images/BN.png",
      bookImg: "/images/alexander/boundaries.jpg"
    },
    {
      n: 4, tEn: "Alternating Repetition", tZh: "交替重复",
      quoteEn: "Simple repetition is mechanical and lifeless. Living repetition is alternating.",
      quoteZh: "简单的重复是机械且无生命的。有生命的重复是交替的。",
      mechEn: "A special form of alternating repetition refers to the alternating occurrence of two or more vibrant centers, creating a unique rhythm. By mutually accentuating one another, they enhance the overall vitality of the whole.",
      mechZh: "特殊的“交替重复”指两种或多种富有活力的中心交替出现，形成独特的韵律，彼此衬托，增强整体的生命力。",
      relEn: "Increases H (Hierarchy) through rhythmic complexity.",
      relZh: "通过节奏复杂性增加 H（层级）。",
      natureEn: "The alternating pattern of petals and sepals in a flower, or the rhythmic spacing of ripples on water.",
      natureZh: "花朵中花瓣和萼片的交替图案，或是水面上涟漪的节奏间距。",
      exampleEn: "Designs featuring alternating repetition follow two principles. First, the substructures participating in the alternation must themselves possess vitality.The left image shows Brunelleschi's Hospital (Ospedale degli Innocenti) in Florence, Italy. On its facade, columns, arches, circular medallions, and intercolumnar spaces alternate. Each substructure is imbued with life, generating an overall vitality through alternating repetition. The right image depicts the colonnade of a modern building; although there is an alternation between the columns and the spaces between them, the overall structure lacks vitality because the substructures are monotonous and mechanical.Furthermore, alternating repetition exists within organizations across different scales. Small-scale substructures form large-scale substructures through alternating repetition, and these large-scale structures construct an even larger whole in a similar manner. In the left image, the arched colonnade and the intercolumnar spaces form a large-scale alternating repetition, while each individual arch creates a small-scale alternating repetition through its convex and concave curved lines. This cross-scale recursive organization ensures that the design is full of vitality at every level.",
      exampleZh: "具有“交替重复”的设计遵循两个原则。首先，参与交替的子结构本身需要是有活力的。左图为意大利佛罗伦萨布鲁内莱斯基医院，其立面中柱子、圆拱、圆形符号以及柱间空间交替出现，每个子结构都富有生命力，通过交替重复形成整体的活力。右图为某现代建筑的柱廊，尽管存在柱子与柱间空间的交替，但因子结构单调机械，整体显得缺乏活力。此外，“交替重复”存在于不同尺度的组织中。小尺度的子结构通过交替重复形成大尺度的子结构，而大尺度的结构又以类似方式构成更大的整体。左图中拱形柱廊与柱间空间形成大尺度的交替重复，而每个圆拱本身又通过凸起与凹陷的弧形线条在小尺度形成交替重复。这种跨尺度的递归组织，使设计在每个层级都充满生命力。",
      imgPos: "/images/Alternating repetition.png",
      imgNeg: "/images/ARNEG.png",
      bookImg: "/images/alexander/placeholder.jpg"
    },
    { n: 5, tEn: "Positive Space", tZh: "正空间", quoteEn: "Space is not merely the residue between objects but a distinct entity.", quoteZh: "空间不仅仅是物体之间的残留物，而是一个独立的实体。", mechEn: "The mechanism for creating positive space is enclosure and convexity.", mechZh: "创造正空间的机制是围合和凸性。", relEn: "Increases S (Strength) by shaping the void.", relZh: "通过塑造虚空增加 S（强度）。", natureEn: "Nature avoids 'leftover' spaces; even the empty space between branches has a distinct shape.", natureZh: "大自然避免“多余”的空间；即使是树枝间的空隙也有清晰的形状。", exampleEn: "A public square defined by continuous building facades.", exampleZh: "由连续建筑立面定义的公共广场。", imgPos: "/images/Positive space.png", imgNeg: "/images/PSNEG.png", bookImg: "" },
    { n: 6, tEn: "Good Shape", tZh: "良好形状", quoteEn: "Every element in a living structure should have a 'good shape'—simple and coherent.", quoteZh: "活力结构中的每个元素都应该有一个“良形”——简单且连贯。", mechEn: "Mechanism implies compactness and elementary geometry (squares, circles).", mechZh: "机制意味着紧凑性和基本几何（正方形、圆形）。", relEn: "Increases S (Strength) through geometric coherence.", relZh: "通过几何连贯性增加 S（强度）。", natureEn: "A water drop or a river stone, worn into an elemental and harmonious shape.", natureZh: "水滴或河石，被磨成了基本且和谐的形状。", exampleEn: "A perfectly proportioned rectangular window or circular arch.", exampleZh: "比例完美的矩形窗或圆拱。", imgPos: "/images/Good shape.png", imgNeg: "/images/GSNEG.png", bookImg: "" },
    { n: 7, tEn: "Local Symmetries", tZh: "局部对称", quoteEn: "Small parts of the structure should be symmetrical within themselves.", quoteZh: "结构的微小部分在自身内部应对称。", mechEn: "The mechanism is the creation of 'sub-centers' through reflection.", mechZh: "该机制是通过反射创建“子中心”。", relEn: "Increases S (Strength) by binding centers locally.", relZh: "通过局部结合中心增加 S（强度）。", natureEn: "Leaves, crystals, and animal faces possess striking local symmetry despite global variation.", natureZh: "尽管整体有变化，树叶、水晶和动物面部都具有惊人的局部对称性。", exampleEn: "Ornaments, door frames, or individual tiles having internal symmetry.", exampleZh: "装饰品、门框或单个瓷砖具有内部对称性。", imgPos: "/images/Local symmetries.png", imgNeg: "/images/LSNEG.png", bookImg: "" },
    { n: 8, tEn: "Deep Interlock and Ambiguity", tZh: "深度交织与模糊性", quoteEn: "Elements should not simply sit next to each other; they should interlock.", quoteZh: "元素不应仅仅彼此相邻；它们应该嵌合。", mechEn: "The mechanism uses 'ambiguity of belonging' where material A penetrates material B.", mechZh: "该机制利用“归属的模糊性”，即材料 A 穿透材料 B。", relEn: "Increases S (Strength) by fusing adjacent centers.", relZh: "通过融合相邻中心增加 S（强度）。", natureEn: "The jagged interlocking of continental plates or roots winding through rocks.", natureZh: "大陆板块的锯齿状交错，或是盘绕穿过岩石的树根。", exampleEn: "Dove-tail joints in wood or interlocking paving stones.", exampleZh: "木材中的燕尾榫或互锁铺路石。", imgPos: "/images/Deep interlock and ambiguity.png", imgNeg: "/images/DNEG.png", bookImg: "" },
    { n: 9, tEn: "Contrast", tZh: "对比", quoteEn: "Life requires difference. Distinct parts should be visibly different in character.", quoteZh: "生命需要差异。独特部分在特征上应明显不同。", mechEn: "The mechanism is the unification of opposites, enhancing both qualities.", mechZh: "机制是对立面的统一，增强了两种特质。", relEn: "Increases S (Strength) by clarifying distinction.", relZh: "通过阐明区别增加 S（强度）。", natureEn: "The bright bloom of a flower against dark foliage, or stark shadows on a canyon wall.", natureZh: "深色树叶衬托下明亮的花朵，或峡谷崖壁上鲜明的阴影。", exampleEn: "Light against dark, rough stone against smooth plaster.", exampleZh: "明与暗，粗糙石头与光滑灰泥。", imgPos: "/images/Contrast.png", imgNeg: "/images/CNEG.png", bookImg: "" },
    { n: 10, tEn: "Gradients", tZh: "渐变", quoteEn: "A quality should slowly change across space to soften harshness.", quoteZh: "一种特质应该在空间中缓慢变化以柔化严酷。", mechEn: "The mechanism is the serialized progression of properties (A1, A2, A3...).", mechZh: "机制是属性的序列化推进（A1, A2, A3...）。", relEn: "Increases H (Hierarchy) by connecting scales.", relZh: "通过连接尺度增加 H（层级）。", natureEn: "The gradual thinning of a mountain atmosphere, or the color shift in a sunset.", natureZh: "高山大气的逐渐稀薄，或是日落时的色彩过渡。", exampleEn: "Steps of a staircase or diminishing sizes of arches.", exampleZh: "楼梯的台阶或逐渐缩小的拱门。", imgPos: "/images/Gradients.png", imgNeg: "/images/GRNEG.png", bookImg: "" },
    { n: 11, tEn: "Roughness", tZh: "粗糙性", quoteEn: "True order is not perfect; it is rough and adaptive to local conditions.", quoteZh: "真正的秩序不是完美的；它是粗糙的且适应局部条件。", mechEn: "The mechanism is local relaxation of the grid to minimize tension.", mechZh: "机制是网格的局部松弛以最小化张力。", relEn: "Increases S (Strength) by adapting to reality.", relZh: "通过适应现实增加 S（强度）。", natureEn: "Tree bark, mountain ridges, and coastlines derive their beauty from their unpolished, fractal roughness.", natureZh: "树皮、山脊和海岸线的美源于它们未经打磨的分形粗糙感。", exampleEn: "Hand-laid brick walls with slight irregularities.", exampleZh: "手工砌筑的略带不规则的砖墙。", imgPos: "/images/Roughness.png", imgNeg: "/images/RNEG.png", bookImg: "" },
    { n: 12, tEn: "Echoes", tZh: "共鸣", quoteEn: "The same structural logic appears at different scales throughout the design.", quoteZh: "相同结构逻辑出现在设计的不同尺度中。", mechEn: "The mechanism is the use of a 'generative seed' or fractal DNA recursively.", mechZh: "机制是递归使用“生成种子”或分形 DNA。", relEn: "Increases H (Hierarchy) through self-similarity.", relZh: "通过自相似性增加 H（层级）。", natureEn: "The branching of a river delta echoing the veins in a single leaf.", natureZh: "河流三角洲的分支与单片树叶的叶脉形成呼应。", exampleEn: "The curve of a dome echoed in the arches below it.", exampleZh: "圆顶的曲线在其下方的拱门中得到呼应。", imgPos: "/images/Echoes.png", imgNeg: "/images/ENEG.png", bookImg: "" },
    { n: 13, tEn: "The Void", tZh: "虚空", quoteEn: "In the most intense centers, there is often a moment of pure silence.", quoteZh: "在最强烈的中心里，通常有一刻纯粹的寂静。", mechEn: "The mechanism is the deliberate preservation of an empty center bounded by structure.", mechZh: "机制是特意保留一个由结构包围的空中心。", relEn: "Increases S (Strength) by creating a calm center.", relZh: "通过创造平静中心增加 S（强度）。", natureEn: "A clearing in a dense forest, or a perfectly still alpine lake.", natureZh: "茂密森林中的林间空地，或是一片平静的高山湖泊。", exampleEn: "An empty altar or a quiet central courtyard.", exampleZh: "左图为开罗拜巴尔清真寺，其中央中庭作为“虚空”，让周边小房间更有活力和秩序感。右图为某办公空间，缺乏中央虚空，满是小房间，显得拥挤、嘈杂。", imgPos: "/images/The void.png", imgNeg: "/images/VNEG.png", bookImg: "" },
    { n: 14, tEn: "Simplicity and Inner Calm", tZh: "简洁与内在平静", quoteEn: "The form feels calm because everything is exactly where it needs to be.", quoteZh: "形式感觉平静，因为一切都在它应该在的地方。", mechEn: "The mechanism is the removal of structural noise (Occam's Razor).", mechZh: "机制是消除结构噪音（奥卡姆剃刀）。", relEn: "Increases S (Strength) by removing friction.", relZh: "通过消除摩擦增加 S（强度）。", natureEn: "A smooth expanse of untouched snow, or a clear blue sky.", natureZh: "广阔无垠的纯洁雪原，或是清澈湛蓝的天空。", exampleEn: "A Shaker chair or a Zen garden.", exampleZh: "震颤派椅子或禅宗花园。", imgPos: "/images/Simplicity and inner calm.png", imgNeg: "/images/SINEG.png", bookImg: "" },
    { n: 15, tEn: "Not-Separateness", tZh: "非分离性", quoteEn: "A living structure is not separate from its surroundings; it grows out of them.", quoteZh: "活力结构与其周围环境不是分离的；它是从中生长出来的。", mechEn: "The mechanism is the blurring of the outer boundary through interpenetration.", mechZh: "机制是通过相互渗透模糊外边界。", relEn: "Increases H (Hierarchy) by connecting to the largest whole.", relZh: "通过连接到最大整体增加 H（层级）。", natureEn: "A nest woven seamlessly into the branches of a tree.", natureZh: "无缝编织在树枝间的鸟巢。", exampleEn: "A building that steps down the hillside, merging with the terrain.", exampleZh: "顺山势而下的建筑，与地形融为一体。", imgPos: "/images/Not separateness.png", imgNeg: "/images/NSNEG.png", bookImg: "" }
];

interface CenterNode {
  x: number; // 百分比坐标 0-100
  y: number; // 百分比坐标 0-100
  r: number; // 圈的大小 (px)
  label: string; // 节点说明文字
}

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
  centers?: CenterNode[]; 
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
    imageUrl: "/cnts/LJNMJ.png",
    diagramUrl: "/cnts/LJNMJ.png", 
    elevationUrl: "/cnts/LJNMJ.png", 
    levels: [4, 10, 36, 123, 533, 2967],
    relatedProperties: [1, 3, 11, 15],
    centers: [
      { x: 50, y: 30, r: 80, label: "Main Ridge (主脊)" },
      { x: 30, y: 60, r: 60, label: "Gable Wall (山墙)" },
      { x: 70, y: 60, r: 60, label: "Courtyard Entry (庭院入口)" },
    ]
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
    imageUrl: "https://images.unsplash.com/photo-1740390364580-bfc152f2499d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxGb3JiaWRkZW4lMjBDaXR5JTIwQmVpamluZyUyMGFlcmlhbCUyMHZpZXclMjBzeW1tZXRyeSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NzE2NDk6MTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    diagramUrl: "https://images.unsplash.com/photo-1599571342676-47b297800067?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxGb3JiaWRkZW4lMjBDaXR5JTIwcm9vZiUyMGRldGFpbCUyMGdvbGRlbnxlbnwxfHx8fDE3NzE2NDk2MTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    elevationUrl: "https://images.unsplash.com/photo-1546261547-49f3e4c4c77c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxGb3JiaWRkZW4lMjBDaXR5JTIwZmFjYWRlfGVufDF8fHx8MTc3MTY0OTYxOXww&ixlib=rb-4.1.0&q=80&w=1080",
    levels: [2, 12, 48, 192, 864, 4200],
    relatedProperties: [2, 6, 7, 12, 14],
    centers: [
      { x: 50, y: 50, r: 120, label: "Imperial Throne (宝座中心)" },
      { x: 20, y: 40, r: 50, label: "Dougong Cluster (斗拱群)" },
      { x: 80, y: 40, r: 50, label: "Dougong Cluster (斗拱群)" },
    ]
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
    relatedProperties: [4, 8, 11, 13, 15],
    centers: [
      { x: 40, y: 70, r: 70, label: "Rockery Point (假山叠石)" },
      { x: 75, y: 45, r: 60, label: "Framed Window (漏窗透景)" },
      { x: 25, y: 25, r: 50, label: "Curved Eave (飞檐)" },
    ]
  }
];

const QUESTION_POOL = [
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

const ChineseArchitecturalSystem = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [highlightCenters, setHighlightCenters] = useState(false);
  const { trans, language } = useLanguage();

  const selectedCase = cases.find(c => c.id === selectedCaseId);

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
                    {trans.theory?.chinese?.viewAnalysis || 'View Analysis'} <ArrowRight className="w-3 h-3" />
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

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

           {/* 高亮按钮 */}
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


// --- Main Page Component ---

export function Theory() {
  const [activePropId, setActivePropId] = useState<number>(1);
  const [activeHowTo, setActiveHowTo] = useState<number | null>(null); 
  const { trans, language } = useLanguage();
  const isEn = language === 'en';
  
  const activeProp = properties.find(p => p.n === activePropId) || properties[0];

  // 💡 提取观测相关的状态
  const { analyzeStructure, isThinking } = useGemini();
  const [hasStarted, setHasStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{property: string, choiceType: string}[]>([]);
  const [report, setReport] = useState<string | null>(null);
  
  // ✨ 修改点：存放题目的变量，改为固定 6 道
  const [activeQuestions, setActiveQuestions] = useState<typeof QUESTION_POOL>([]);

  // ✨ 修改点：启动函数改为固定 6 道，且不再随机洗牌
  const startTest = () => {
    // 1. 直接使用全部 6 道题
    setActiveQuestions(QUESTION_POOL); 
    setHasStarted(true);
    setCurrentStep(0);
    setAnswers([]);
    setReport(null);
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

  const generateReport = async (finalAnswers: {property: string, choiceType: string}[]) => {
    const strongCount = finalAnswers.filter(a => a.choiceType === 'strong').length;
    const total = finalAnswers.length;
    
    const prompt = `
      You are an expert in Christopher Alexander's "The Nature of Order" (specifically Book 1, Chapters 8 & 9) and Professor Bin Jiang's "Living Structure" theory. 
      A user just completed the "Mirror of the Self" test, choosing between Living Structures and Cartesian/mechanistic structures.
      
      Their empirical observations:
      ${finalAnswers.map((a, i) => `- Task ${i+1} (${a.property}): Identified the "${a.choiceType === 'strong' ? 'Living Structure' : 'Cartesian/Mechanistic Structure'}" as a truer picture of their whole self.`).join('\n')}
      
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
        setReport("⚠️ 获取报告失败：AI 返回了空值。请按 F12 打开浏览器控制台 (Console) 查看具体网络或 Key 报错。");
      }
    } catch (error) {
      setReport(`⚠️ 发生错误：${error}`);
    }
  };

  const handleShareToX = () => {
    const text = encodeURIComponent(
      isEn 
        ? "I just completed the 'Mirror of the Self' observation and shattered the Cartesian mechanistic worldview! 🔬✨ Discover your inner resonance with Living Structure:" 
        : "我刚刚完成了『自我之镜』客观生命力观测，并打破了笛卡尔机械世界观的束缚！🔬✨ 来测试你的内在几何共振："
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
        : "寻找跨尺度的层级嵌套。充满生命力的环境绝不仅有单一的巨大尺度，它总是以 2 到 6 倍的比例跃升。你能指出它的宏观骨架、中观边界和微观细节吗？如果从巨大的建筑体块直接跳崖式地过渡到微小的窗户，中间缺乏过渡，那么它的层级就是断裂的。"
    },
    {
      id: 3,
      icon: ArrowUpRight,
      title: isEn ? "Trace Connections" : "追踪联结",
      shortDesc: isEn ? "Identify how centers support each other." : "识别中心间如何互相支撑。",
      fullDesc: isEn 
        ? "No center lives in isolation. Choose any prominent feature in the space. Does its existence strengthen the space next to it? Do the boundaries interlock deeply, or are they cleanly severed? Living structures share DNA across scales, creating echoes that resonate throughout the entire system." 
        : "没有哪个中心可以孤立存在。选定空间中任意一个突出的特征，问问自己：它的存在是否强化了它旁边的空间？它们的边界是深度交织的，还是被生硬切断的？生命力结构在不同尺度间共享着几何DNA，在整个系统中形成持续的共鸣。"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] text-stone-800 pb-24">
      
      <div className="w-full max-w-7xl mx-auto p-8 md:p-16 pb-0">

        {/* ========================================================================= */}
        {/* Section 0: The Empirical Mirror (✨ 视觉升级：告别黑框，改为优雅浅色) */}
        {/* ========================================================================= */}
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
            {/* ✨ 视觉点：这里去掉了 bg-stone-900，改成了带阴影的白/浅石色容器 */}
            <div className="w-full bg-white border border-stone-200 text-stone-800 rounded-3xl overflow-hidden shadow-xl relative min-h-[600px] flex flex-col items-center justify-center p-8">
              
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
                      className="bg-stone-900 text-white px-8 py-3 rounded-full font-bold tracking-widest uppercase text-sm hover:bg-amber-500 transition-colors flex items-center gap-2 mx-auto shadow-md"
                    >
                      {isEn ? "Begin Observation" : "启动观测实验"} <ArrowRight className="w-4 h-4" />
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[400px]">
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
                    className="max-w-3xl w-full bg-stone-50/80 p-8 md:p-12 rounded-2xl border border-stone-200 backdrop-blur-sm shadow-inner"
                  >
                    <div className="text-amber-600 text-xs font-bold uppercase tracking-[0.2em] mb-4 text-center flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" /> 
                      {isEn ? "Scientific Observation Report" : "客观生命力观测报告"}
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


        {/* ========================================================================= */}
        {/* 核心过渡：巨幅大标题 */}
        {/* ========================================================================= */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-24 text-center mt-12"
        >
          <div className="border-b border-stone-200 pb-12 mb-12 max-w-2xl mx-auto">
             <div className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400 mb-6">
                {isEn ? "Theoretical Framework" : "理论框架提取"}
             </div>
             <div className="space-y-3 font-serif text-lg md:text-xl text-stone-600 leading-relaxed">
               <p>{isEn ? "Living Structure originates from structural wholeness." : "生命力结构，源于不可分割的整体性。"}</p>
               <p>{isEn ? "Vitality emerges from hierarchical coherence." : "客观的生命美感，涌现于层级的严密嵌套。"}</p>
               <p className="font-black text-stone-900 text-3xl mt-6 tracking-widest">L = S × H</p>
             </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif font-black text-stone-900 mb-4 tracking-tight uppercase">
            {isEn ? (
              <>THEORY OF<br/>LIVING STRUCTURE</>
            ) : (
              <>生 命 结 构 理 论</>
            )}
          </h1>
          <p className="text-stone-500 font-mono uppercase tracking-widest text-xs">
            {isEn ? "Vitality in Geometry & Architecture" : "几何与建筑中的生命力密码"}
          </p>
        </motion.div>


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
                    <div className="font-bold text-stone-900">Professor Bin Jiang</div>
                    <div className="text-stone-400">Living Structure</div>
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
        <Section title={trans.theory?.howToSee?.title || "How to See"}>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {howToData.map((item) => {
                const isActive = activeHowTo === item.id;
                return (
                  <motion.div 
                    layout
                    key={item.id}
                    onClick={() => setActiveHowTo(isActive ? null : item.id)}
                    className={cn(
                      "border border-stone-200 rounded-2xl cursor-pointer transition-colors overflow-hidden",
                      isActive ? "bg-stone-900 text-white shadow-xl" : "bg-white text-stone-900 hover:bg-stone-50"
                    )}
                  >
                    <motion.div layout className="p-6 md:p-8 flex flex-col items-center text-center">
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
                  className={`text-left px-4 py-3 rounded-md transition-all duration-200 ${
                    activePropId === prop.n 
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
                    className="p-8 md:p-12 flex-grow flex flex-col"
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 flex-grow">
                      <div className="bg-emerald-50/50 p-6 rounded-lg border border-emerald-100">
                        <h4 className="flex items-center gap-2 text-emerald-800 font-bold mb-4 uppercase tracking-wider text-sm">
                          <Leaf className="w-4 h-4" />
                          {language === 'zh' ? '在自然界中的体现' : 'Manifestation in Nature'}
                        </h4>
                        <p className="text-stone-600 text-sm leading-relaxed">
                          {language === 'zh' ? activeProp.natureZh : activeProp.natureEn}
                        </p>
                      </div>

                      <div className="bg-stone-50 p-6 rounded-lg border border-stone-200">
                        <h4 className="flex items-center gap-2 text-stone-800 font-bold mb-4 uppercase tracking-wider text-sm">
                          <Building2 className="w-4 h-4" />
                          {language === 'zh' ? '在空间设计中的体现' : 'Manifestation in Design'}
                        </h4>
                        <p className="text-stone-600 text-sm leading-relaxed">
                          {language === 'zh' ? activeProp.exampleZh : activeProp.exampleEn}
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-stone-100">
                      <p className="text-xs text-stone-400 uppercase tracking-widest mb-3 font-bold flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        {language === 'zh' ? '《秩序的本质》原著图解' : 'Illustration from The Nature of Order'}
                      </p>
                      <div className="w-full h-48 bg-stone-100 rounded-md overflow-hidden border border-stone-200 relative group flex items-center justify-center">
                        {activeProp.bookImg ? (
                          <img 
                            src={activeProp.bookImg} 
                            alt="Book Illustration"
                            className="w-full h-full object-contain mix-blend-multiply opacity-80 group-hover:opacity-100 transition-opacity"
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
        
        <div className="mt-32">
          <Section title={trans.theory?.chinese?.title || "Chinese Architecture"} className="!pt-0 !border-0">
             <div className="mb-12 max-w-2xl">
                <p className="text-lg text-stone-600 leading-relaxed font-serif">
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