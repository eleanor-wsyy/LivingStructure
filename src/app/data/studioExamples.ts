// 5 组来自 "Whole book.pdf" Chapter 4 的真实 Before/After 建筑改造案例
// 包含 L-score, B-score 以及 VAS 3M 热力图扫描焦点
// 
// ⚠️ 图片说明：
// 当前使用的图片路径指向 /cnts/ 目录。
// 请从 Whole book.pdf 第 110-119 页中截取对应的 Before/After 图片，
// 并保存为以下文件名到 public/cnts/ 目录中。
// 如果 /cnts/ 中的图片不存在，ImageWithFallback 会显示占位符。

export interface StudioExample {
  id: number;
  nameEn: string;
  nameZh: string;
  location: string;
  beforeImg: string;
  afterImg: string;
  beforeVasImg?: string;   // 书中真实热力图（可选）
  afterVasImg?: string;
  beforeL: number;
  afterL: number;
  beforeB: number;
  afterB: number;
  beforeVasFoci: { x: number; y: number; r: number }[];
  afterVasFoci: { x: number; y: number; r: number }[];
  beforeDescEn: string;
  beforeDescZh: string;
  afterDescEn: string;
  afterDescZh: string;
  pageRef: string;
}

export const studioExamples: StudioExample[] = [
  {
    id: 1,
    nameEn: "Media House",
    nameZh: "媒体之家",
    location: "Aabenraa, Denmark",
    beforeImg: "/cnts/media-before.png",
    afterImg: "/cnts/media-after.png",
    beforeVasImg: "/cnts/media-before-vas.png",
    afterVasImg: "/cnts/media-after-vas.png",
    beforeL: 17.9,
    afterL: 29.6,
    beforeB: 4.5,
    afterB: 12.8,
    beforeVasFoci: [
      { x: 50, y: 50, r: 200 },
    ],
    afterVasFoci: [
      { x: 40, y: 45, r: 80 },
      { x: 60, y: 50, r: 60 },
      { x: 50, y: 70, r: 50 },
    ],
    beforeDescEn: "Mid-20th-century buildings (1952–1960s) with utilitarian yellow brick facades, cement-concrete roof tiles, and large unarticulated panoramic windows. The front-connecting wing was later demolished.",
    beforeDescZh: "建于 1952-1960 年代的实用主义建筑，黄色砖立面、水泥混凝土屋顶瓦和大面积无分格全景窗。前连接翼后来被拆除。",
    afterDescEn: "Transformed into a cohesive media complex with a new circular foyer building, decorative cornices, zinc-clad timber roof, thick facades with dormered windows. Existing buildings internally renovated and structurally adapted to create a unified whole.",
    afterDescZh: "改造为统一的媒体综合体，新增圆形门厅建筑，配有装饰性檐口、镀锌木屋顶、带老虎窗的厚实立面。原有建筑进行了内部翻新和结构改造，形成统一整体。",
    pageRef: "pp. 110–111",
  },
  {
    id: 2,
    nameEn: "Ed Smith Stadium",
    nameZh: "艾德·史密斯体育场",
    location: "Sarasota, Florida, USA",
    beforeImg: "/cnts/edsmith-before.png",
    afterImg: "/cnts/edsmith-after.png",
    beforeVasImg: "/cnts/edsmith-before-vas.png",
    afterVasImg: "/cnts/edsmith-after-vas.png",
    beforeL: 28.8,
    afterL: 62.4,
    beforeB: 7.6,
    afterB: 12,
    beforeVasFoci: [
      { x: 50, y: 60, r: 180 },
    ],
    afterVasFoci: [
      { x: 50, y: 50, r: 90 },
      { x: 30, y: 45, r: 60 },
      { x: 70, y: 45, r: 60 },
    ],
    beforeDescEn: "A 1980s-era utilitarian baseball stadium with a plain, uninviting appearance. The exposed seating bowl rear wall and horizontal monotony dominate the facade with minimal architectural articulation.",
    beforeDescZh: "1980 年代的实用主义棒球场，外观朴素、缺乏吸引力。座位区后墙裸露，水平单调感主导了整个立面，建筑细节极少。",
    afterDescEn: "Renovated in 'Florida Picturesque' style with a two-level concourse featuring arched openings, decorative stucco, and tile details. The arches create strong centers and rhythmic alternating repetition, dramatically increasing livingness.",
    afterDescZh: "以'佛罗里达画境'风格翻新，增设双层环廊，带拱形开口、装饰性灰泥和瓷砖细节。拱门创造了强中心和节奏性交替重复，显著提升了活力。",
    pageRef: "pp. 112–113",
  },
  {
    id: 3,
    nameEn: "Trompe-l'œil Apartments",
    nameZh: "视觉错觉公寓 (Plattenbau)",
    location: "Marzahn, Berlin, Germany",
    beforeImg: "/cnts/marzahn-before.png",
    afterImg: "/cnts/marzahn-after.png",
    beforeVasImg: "/cnts/marzahn-before-vas.png",
    afterVasImg: "/cnts/marzahn-after-vas.png",
    beforeL: 12.4,
    afterL: 38.7,
    beforeB: 3,
    afterB: 11,
    beforeVasFoci: [
      { x: 50, y: 50, r: 220 },
    ],
    afterVasFoci: [
      { x: 45, y: 35, r: 70 },
      { x: 55, y: 55, r: 80 },
      { x: 35, y: 65, r: 50 },
      { x: 65, y: 40, r: 50 },
    ],
    beforeDescEn: "Drab East German Plattenbau (precast concrete) apartment blocks — plain, mechanically repetitive, architecturally lifeless with no hierarchy, no centers, and no boundaries.",
    beforeDescZh: "东德预制混凝土板式公寓 (Plattenbau)，单调重复、机械统一——建筑上毫无生命力，缺乏层级、中心和边界。",
    afterDescEn: "Large-scale trompe-l'œil murals depict illusory ornate architectural details: cornices, window frames, and fictional residents. The VAS heatmap shows 67% of visual attention concentrating on the painted architectural centers.",
    afterDescZh: "大型视觉错觉壁画描绘虚构的华丽建筑细节：檐口、窗框和虚构居民。VAS 热力图显示 67% 的视觉注意力集中在绘制的建筑中心上。",
    pageRef: "pp. 114–115",
  },
  {
    id: 4,
    nameEn: "Maybachufer 36",
    nameZh: "梅巴赫河岸 36 号",
    location: "Berlin, Germany",
    beforeImg: "/cnts/maybachufer-before.png",
    afterImg: "/cnts/maybachufer-after.png",
    beforeVasImg: "/cnts/maybachufer-before-vas.png",
    afterVasImg: "/cnts/maybachufer-after-vas.png",
    beforeL: 15.2,
    afterL: 45.3,
    beforeB: 5,
    afterB: 13,
    beforeVasFoci: [
      { x: 40, y: 40, r: 150 },
      { x: 70, y: 60, r: 120 },
    ],
    afterVasFoci: [
      { x: 50, y: 30, r: 70 },
      { x: 50, y: 55, r: 90 },
      { x: 30, y: 60, r: 50 },
      { x: 70, y: 60, r: 50 },
    ],
    beforeDescEn: "An old glass factory repurposed as a warehouse and factory outlet with a simple industrial facade and prominent commercial signage. No architectural articulation or hierarchy.",
    beforeDescZh: "旧玻璃工厂用作仓库和工厂直销店，简单工业立面，突出商业标牌。缺乏建筑表达和层级。",
    afterDescEn: "New mixed-use complex with a unified classical facade: copper roof domes, arched entrances, and varied facade textures. The VAS focus shifts from commercial signs to the architectural corner tower and ornamental details.",
    afterDescZh: "新的综合用途建筑，统一的古典立面：铜屋顶穹顶、拱形入口和多样化立面纹理。VAS 焦点从商业标牌转移到建筑角塔和装饰细节。",
    pageRef: "pp. 116–117",
  },
  {
    id: 5,
    nameEn: "Nagybörzsöny Station",
    nameZh: "纳吉伯尔若尼火车站",
    location: "Nagybörzsöny, Hungary",
    beforeImg: "/cnts/nagyborzsony-before.png",
    afterImg: "/cnts/nagyborzsony-after.png",
    beforeVasImg: "/cnts/nagyborzsony-before-vas.png",
    afterVasImg: "/cnts/nagyborzsony-after-vas.png",
    beforeL: 10.8,
    afterL: 34.2,
    beforeB: 3,
    afterB: 12,
    beforeVasFoci: [
      { x: 50, y: 50, r: 200 },
    ],
    afterVasFoci: [
      { x: 50, y: 40, r: 80 },
      { x: 35, y: 55, r: 60 },
      { x: 65, y: 55, r: 60 },
    ],
    beforeDescEn: "A simple modern white single-storey building with a plain utilitarian appearance and no traditional character. Flat roof, no hierarchical structure, no meaningful boundaries.",
    beforeDescZh: "简单的现代白色单层建筑，外观朴素实用，没有传统特色。平屋顶，无层级结构，无有意义的边界。",
    afterDescEn: "Rebuilt reflecting traditional local architectural character with articulated windows, a textured roofline, stone and timber detailing. VAS concentrates on the central entrance doors and the complex roof geometry.",
    afterDescZh: "按当地传统建筑风格重建，设有精细窗户、有纹理的屋顶线、石材和木材细节。VAS 集中在中央门和复杂屋顶几何上。",
    pageRef: "pp. 118–119",
  },
];
