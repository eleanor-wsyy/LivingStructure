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
    descriptionZh: "江南民居是中国传统民居建筑的重要组成部分，围绕天井展开，木梁承重。从街巷到天井再到厅堂的层层递进，展现了丰富的尺度层级。",
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
    id: "kui_yuan",
    name: "Kui Yuan",
    nameZh: "逵园",
    dynasty: "1922",
    dynastyZh: "1922年建",
    location: "Guangzhou, Guangdong",
    locationZh: "广州市越秀区恤孤院路9号",
    category: "residential",
    categoryZh: "住宅",
    lValue: 74520,
    bValue: "7 / 15",
    description: "Built by an American overseas Chinese, this villa combines Western and Lingnan architectural styles, producing a high degree of living structure.",
    descriptionZh: "由美国华侨马灼文建造的园林式洋房。整座建筑将西方建筑元素与岭南本土特色相融合，其复杂的结构产生了极高的生命活力。",
    imageUrl: "/cnts/ky.png",
    diagramUrl: "/cnts/ky.png",
    elevationUrl: "/cnts/ky.png",
    levels: [2, 8, 46, 127, 592, 11645],
    relatedProperties: [2, 5, 8, 12],
    centers: [
      { x: 50, y: 50, r: 100, label: "Main Facade (主立面)" }
    ]
  },
  // ── 庙宇 Temple ──────────────────────────────────────
  {
    id: "baolun_temple",
    name: "Baolun Temple",
    nameZh: "宝伦寺大雄宝殿",
    dynasty: "Song Dynasty",
    dynastyZh: "宋真宗咸平年间",
    location: "Chongqing",
    locationZh: "重庆市沙坪坝区磁器口古镇",
    category: "temple",
    categoryZh: "庙宇",
    lValue: 19764,
    bValue: "10 / 15",
    description: "One of the oldest surviving wooden structures in eastern Sichuan. The alternating repetition of halls generates profound spiritual calmness.",
    descriptionZh: "川东地区现存最古老的木结构建筑之一。殿内四根龙井柱与周围的木结构相互交织，产生出精神上的宁静感与庄严的生命感。",
    imageUrl: "/cnts/DXBD.png",
    diagramUrl: "/cnts/DXBD.png",
    elevationUrl: "/cnts/DXBD.png",
    levels: [4, 11, 27, 90, 318, 2844],
    relatedProperties: [4, 13, 14],
    centers: [
      { x: 50, y: 60, r: 90, label: "Main Hall (大雄宝殿)" }
    ]
  },
  {
    id: "shengmu_temple",
    name: "Shengmu Temple",
    nameZh: "山西晋祠圣母殿",
    dynasty: "Song Dynasty",
    dynastyZh: "北宋天圣年间",
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
    name: "Grant Hall",
    nameZh: "中山大学格兰堂",
    dynasty: "1915",
    dynastyZh: "1915年",
    location: "Guangzhou, Guangdong",
    locationZh: "广州市海珠区新港西路135号",
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
    name: "Missions Building (Guang Lou)",
    nameZh: "光楼",
    dynasty: "1915",
    dynastyZh: "1915年",
    location: "Guangzhou, Guangdong",
    locationZh: "广州市越秀区长堤大马路潮音街1号",
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
    name: "Canton Customs House",
    nameZh: "粤海关旧址",
    dynasty: "1916",
    dynastyZh: "1916年",
    location: "Guangzhou, Guangdong",
    locationZh: "广州市荔湾区沿江西路29号",
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
    name: "Datong Restaurant",
    nameZh: "大同酒家",
    dynasty: "1936",
    dynastyZh: "1936年",
    location: "Guangzhou, Guangdong",
    locationZh: "广州市越秀区沿江西路63号",
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
    name: "Paulun Hospital",
    nameZh: "达保罗医院旧址",
    dynasty: "1931",
    dynastyZh: "1931年",
    location: "Guangzhou, Guangdong",
    locationZh: "广州市越秀区人民中路318号",
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
