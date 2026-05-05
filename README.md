# Living Structure Studio

基于 Christopher Alexander《秩序的本质》(The Nature of Order) 与江斌教授活力结构理论 (Living Structure) 的交互式研究平台。通过 AI 驱动的图像诊断、层级化提示词工程和实证测试工具，量化并培养建筑空间中的"生命力"。

## 核心功能

- **专家诊断 (Analyze)** — 上传建筑/空间照片，通过 Gemini AI 对比分析 15 个几何属性，计算美度 (B-Score) 与活力指数
- **提示词实验室 (Prompt Lab)** — 基于层级化线稿方法论，生成可直接用于 AI 绘图的结构化提示词
- **自我之镜 (Mirror of the Self)** — 基于《秩序的本质》第 8/9 章的实证测试，用主观感受作为客观测量工具
- **活力结构构建 (Construct)** — 通过 L = ΣS × H 数学模型可视化结构的演化生长过程
- **校园实践 (Practice)** — 香港科技大学（广州）理疗所与课室改造的 VR 全景案例
- **中国建筑案例库 (Construct)** — 12 个传统建筑的结构层级分析与活力中心可视化

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 18 + TypeScript |
| 构建 | Vite 6 |
| 样式 | Tailwind CSS v4 |
| 组件 | Radix UI (手写封装) |
| 动画 | Framer Motion |
| 后端 | Supabase (Edge Functions + AI Gateway) |
| AI | Google Gemini (via Supabase proxy) |
| 国际化 | 自研 Context + 中英双语完整翻译 |

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 环境变量

在 `.env` 文件中配置以下变量：

```env
VITE_SUPABASE_URL="your-supabase-url"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
VITE_ALIYUN_API_KEY="your-aliyun-key"
VITE_OPENROUTER_API_KEY="your-openrouter-key"
```

> **注意**: 生产环境中请务必将 API Key 移至 Supabase Edge Function 环境变量中，不要在客户端暴露。

## 项目结构

```
src/
├── app/
│   ├── components/
│   │   ├── ui/          # 通用 UI 组件库 (Button/Card/Badge/...)
│   │   ├── figma/       # 图片组件
│   │   ├── Layout.tsx   # 全局布局 (侧边栏 + 顶部栏)
│   │   ├── Hero.tsx
│   │   ├── TheoryGrid.tsx
│   │   └── AnalysisPreview.tsx
│   ├── views/           # 页面视图
│   │   ├── Discover.tsx # 主页
│   │   ├── Theory.tsx   # 理论框架 (15 属性详解)
│   │   ├── Analyze.tsx  # AI 图像诊断
│   │   ├── Construct.tsx# 结构构建与中国古建
│   │   ├── Practice.tsx # 疗愈实践与校园案例
│   │   ├── Library.tsx  # 学术文库
│   │   └── Community.tsx# 社区
│   ├── data/            # 数据定义 (属性/案例/题库/工作室示例)
│   ├── hooks/           # 自定义 Hooks
│   └── i18n/            # 国际化 (LanguageContext + translations)
├── styles/              # 全局样式 (Tailwind + 字体 + 主题)
└── main.tsx             # 入口
```

## 理论基础

活力结构理论认为空间的美感和生命力不是主观偏好，而是可被客观测量的几何属性。核心公式：

```
L = S × H
```

其中 **L** 为活力强度 (Livingness)，**S** 为子结构数量 (Substructures)，**H** 为层级深度 (Hierarchical Depth)。平台围绕 Alexander 提出的 15 个基础几何属性构建了完整的分析、可视化和生成工具链。

## 相关资源

- [The Nature of Order — Christopher Alexander](https://www.patternlanguage.com/natureoforder.htm)
- [Bin Jiang — Structural Beauty & Living Structure](https://scholar.google.com/citations?user=oF2Vq_IAAAAJ)
- [原始 Figma 设计稿](https://www.figma.com/design/Ckt3xKTznyNENV1xbUCNap/Untitled)

## 许可证

MIT
