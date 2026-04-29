export interface CenterNode {
  x: number;
  y: number;
  r: number;
  label: string;
}

export interface CaseStudy {
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

export const CATEGORIES = [
  { id: "all", en: "All Types", zh: "全部" },
  { id: "residential", en: "Residential", zh: "住宅" },
  { id: "temple", en: "Temple", zh: "庙宇" },
  { id: "educational", en: "Educational", zh: "教学楼" },
  { id: "commercial", en: "Commercial", zh: "商业" },
  { id: "medical", en: "Medical", zh: "医院" },
  { id: "palace_garden", en: "Palace", zh: "宫殿/坛庙" },
];

export const cases: CaseStudy[] = [
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
