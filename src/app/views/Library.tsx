import React, { useState } from "react";
import { Button, Input, Badge, Card } from "@/app/components/ui";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Book, FileText, Bookmark, Download, Video, 
  Filter, ExternalLink, X, Eye, Sparkles, PlayCircle
} from "lucide-react";
import { useLanguage } from "@/app/i18n/LanguageContext";

// ============================================================================
// 📚 真实的文献数据库
// ============================================================================
const resources = [
  { 
    id: 1, 
    type: "book", 
    titleEn: "The Nature of Order, Book 1: The Phenomenon of Life", 
    titleZh: "秩序的本质（卷一）：生命现象",
    author: "Christopher Alexander", 
    year: 2002, 
    citations: 4520,
    abstractEn: "Introduces the concept of living structure and the 15 fundamental properties that characterize all living systems in nature and architecture.",
    abstractZh: "引入了活力结构的概念以及构成自然界和建筑中所有生命系统的 15 个基本几何属性。",
    fileUrl: "/pdfs/book1.pdf" 
  },
  { 
    id: 2, 
    type: "book", 
    titleEn: "Living Structure: Exploring the Beauty of Chinese Traditional Buildings Through the Lens of AI", 
    titleZh: "活力结构：AI视角下的中国传统建筑之美",
    author: "LivableCityLAB, HKUST (GZ)", 
    year: 2025, 
    citations: 0,
    abstractEn: "A comprehensive exploration of traditional Chinese architecture through the lens of living structure theory and AI generation, written by the LivableCityLAB team under the guidance of Prof. Bin Jiang.",
    abstractZh: "由香港科技大学（广州）宜居城市实验室团队编撰，在江斌教授的指导下，融合活力结构理论与AI生成技术，探索并量化中国传统建筑之美。",
    fileUrl: "/pdfs/LivingStructure.pdf"

  },
  { 
    id: 5, 
    type: "video", 
    titleEn: "Living Structure", 
    titleZh: "活力结构",
    author: "LivableCityLAB", 
    year: 2026, 
    duration: "6m 47s",
    citations: 0,
    abstractEn: "An engaging video podcast explaining the core concepts of Living Structure, GeoAnalytics, and Alexander's 15 Properties.",
    abstractZh: "一段生动的播客视频，深入浅出地解释了活力结构、地理分析以及亚历山大 15 种几何属性的核心概念。",
    fileUrl: "/videos/livingstructure.mp4" // 💡 换成你视频的名字
  }
];

export function Library() {
  const { trans, language } = useLanguage();
  const isEn = language === 'en';
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all"); 
  
  // 💡 升级：用 selectedItem 保存整个被点击的文献对象，以便判断它是 PDF 还是视频
  const [selectedItem, setSelectedItem] = useState<typeof resources[0] | null>(null);

  const filteredResources = resources.filter(item => {
    const title = isEn ? item.titleEn : item.titleZh;
    const matchesSearch = 
      title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || item.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-card font-sans">
      {/* Header */}
      <div className="border-b border-border bg-muted py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl md:text-4xl font-serif font-black text-foreground tracking-tight">
            {trans.library.title || "Academic Library"}
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl leading-relaxed">
            {trans.library.subtitle || "Explore foundational papers, books, and patents driving the mathematical laws of living structure."}
          </p>
          
          <div className="mt-8 flex flex-col md:flex-row gap-4 max-w-3xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input 
                className="pl-12 h-12 bg-card rounded-xl border-border shadow-sm focus:ring-teal-500" 
                placeholder={trans.library.searchPlaceholder || "Search by title or author..."} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="h-12 px-8 bg-stone-900 rounded-xl hover:bg-primary-hover transition-colors shadow-md">
              {trans.library.searchButton || "Search"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          
          {/* Sidebar Filters */}
          <div className="space-y-8 lg:col-span-1 lg:sticky lg:top-8 h-fit">
            <div className="bg-muted p-6 rounded-2xl border border-border">
              <h3 className="flex items-center gap-2 font-bold text-foreground mb-5 uppercase tracking-widest text-xs">
                <Filter className="h-4 w-4 text-muted-foreground" /> {trans.library.filters || "Resource Type"}
              </h3>
              <div className="space-y-3 font-medium text-sm text-muted-foreground">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="type" className="w-4 h-4 text-teal-600 focus:ring-teal-500" checked={filterType === "all"} onChange={() => setFilterType("all")} />
                  <span className="group-hover:text-foreground transition-colors">{isEn ? "All Resources" : "全部资源"}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="type" className="w-4 h-4 text-teal-600 focus:ring-teal-500" checked={filterType === "paper"} onChange={() => setFilterType("paper")} />
                  <span className="group-hover:text-foreground transition-colors">{trans.library.papers || "Papers"}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="type" className="w-4 h-4 text-teal-600 focus:ring-teal-500" checked={filterType === "book"} onChange={() => setFilterType("book")} />
                  <span className="group-hover:text-foreground transition-colors">{trans.library.books || "Books"}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="type" className="w-4 h-4 text-teal-600 focus:ring-teal-500" checked={filterType === "video"} onChange={() => setFilterType("video")} />
                  <span className="group-hover:text-foreground transition-colors">{isEn ? "Videos" : "视频"}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="type" className="w-4 h-4 text-teal-600 focus:ring-teal-500" checked={filterType === "patent"} onChange={() => setFilterType("patent")} />
                  <span className="group-hover:text-foreground transition-colors">{isEn ? "Patents" : "专利"}</span>
                </label>
              </div>
            </div>
          </div>

          {/* Results List */}
          <div className="lg:col-span-3 space-y-5">
            {filteredResources.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                 <Search className="w-8 h-8 mx-auto mb-4 opacity-50" />
                 <p>{isEn ? "No resources found." : "未找到匹配的文献。"}</p>
              </div>
            ) : (
              filteredResources.map((item) => (
                <Card 
                  key={item.id} 
                  onClick={() => setSelectedItem(item)} // 💡 点击卡片触发弹窗，传入整个 item
                  className="group flex flex-col sm:flex-row gap-6 p-6 hover:shadow-lg transition-all rounded-2xl border border-border border-l-4 border-l-transparent hover:border-l-teal-600 bg-card relative overflow-hidden cursor-pointer"
                >
                  <div className="shrink-0 pt-1">
                    <div className="flex h-20 w-16 items-center justify-center rounded-lg bg-secondary text-muted-foreground shadow-inner">
                      {item.type === "video" ? <Video className="h-7 w-7" /> : 
                       item.type === "book" ? <Book className="h-7 w-7" /> : <FileText className="h-7 w-7" />}
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-bold text-foreground leading-snug group-hover:text-teal-800 transition-colors">
                          <span className="hover:underline">
                            {isEn ? item.titleEn : item.titleZh}
                          </span>
                        </h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 shrink-0"
                          onClick={(e) => e.stopPropagation()} 
                        >
                          <Bookmark className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                        </Button>
                      </div>
                      
                      <div className="mt-2 flex items-center gap-2 text-xs font-mono text-muted-foreground">
                        <span className="font-semibold text-stone-700">{item.author}</span>
                        <span>•</span>
                        <span>{item.year}</span>
                        {item.type === "video" && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Video className="h-3 w-3" /> {item.duration}</span>
                          </>
                        )}
                      </div>

                      <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-3xl">
                        {isEn ? item.abstractEn : item.abstractZh}
                      </p>
                    </div>
                    
                    <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold text-muted-foreground pt-4 border-t border-border">
                      <Badge variant="secondary" className="bg-secondary hover:bg-muted capitalize text-[10px] tracking-widest px-2 py-0.5">
                        {item.type}
                      </Badge>
                      
                      {item.citations > 0 && (
                        <span>{trans.library.citations || "Citations"}: {item.citations.toLocaleString()}</span>
                      )}
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); 
                          setSelectedItem(item);
                        }} 
                        className="flex items-center gap-1.5 text-foreground hover:text-teal-600 transition-colors ml-auto md:ml-0"
                      >
                        {item.type === 'video' ? <PlayCircle className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        {isEn ? (item.type === 'video' ? "Watch Video" : "Read Document") : (item.type === 'video' ? "播放视频" : "阅读文档")}
                      </button>

                      <a 
                        href={item.fileUrl} 
                        download 
                        onClick={(e) => e.stopPropagation()} 
                        className="flex items-center gap-1 text-muted-foreground hover:text-teal-600 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        {trans.library.download || "Download"}
                      </a>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* 📄 沉浸式 PDF / 视频 阅读器弹窗 */}
        <AnimatePresence>
          {selectedItem && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
              {/* 模糊背景 */}
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={() => setSelectedItem(null)} 
                className="absolute inset-0 bg-stone-900/90 backdrop-blur-sm cursor-pointer" 
              />
              
              {/* 媒体容器 */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: 20 }} 
                className="relative w-full max-w-6xl h-[90vh] bg-secondary rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-stone-700"
              >
                {/* 顶部工具栏 (智能切换标题和图标) */}
                <div className="h-14 bg-card border-b border-border flex justify-between items-center px-6 shrink-0">
                  <div className="flex items-center gap-2 text-muted-foreground font-serif font-bold text-sm">
                    {selectedItem.type === 'video' ? (
                      <><Video className="w-4 h-4 text-teal-600" /> {isEn ? "Video Player" : "视频播放器"}</>
                    ) : (
                      <><FileText className="w-4 h-4 text-teal-600" /> {isEn ? "Document Viewer" : "文档阅读器"}</>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <a 
                      href={selectedItem.fileUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-xs font-bold text-muted-foreground hover:text-teal-600 uppercase tracking-widest flex items-center gap-1 transition-colors"
                    >
                      <Sparkles className="w-3 h-3" /> {isEn ? "Open in New Tab" : "在新标签页打开"}
                    </a>
                    <button onClick={() => setSelectedItem(null)} className="p-1.5 bg-secondary text-muted-foreground hover:bg-red-50 hover:text-red-500 rounded-full transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* 核心：智能渲染 Video 标签 或 iframe */}
                <div className="flex-1 w-full relative bg-stone-900 flex items-center justify-center">
                  {selectedItem.type === 'video' ? (
                    <video 
                      src={selectedItem.fileUrl} 
                      controls 
                      autoPlay 
                      className="w-full h-full object-contain bg-black"
                    />
                  ) : (
                    <>
                      {/* 🖥️ PC 端显示 iframe */}
                      <iframe 
                        src={selectedItem.fileUrl.includes('.pdf') ? `${selectedItem.fileUrl}#toolbar=0&view=FitH` : selectedItem.fileUrl} 
                        className="hidden md:block w-full h-full border-none bg-muted"
                        title="Viewer"
                      />
                      {/* 📱 移动端显示全屏专属打开按钮，避免 iframe 兼容性问题 */}
                      <div className="md:hidden flex flex-col items-center justify-center p-8 text-center w-full h-full bg-stone-50">
                        <FileText className="w-16 h-16 text-stone-300 mb-6" />
                        <h3 className="text-xl font-bold text-stone-800 mb-3">{isEn ? "Mobile PDF Reader" : "移动端文档阅读"}</h3>
                        <p className="text-sm text-muted-foreground mb-8 max-w-xs leading-relaxed">
                          {isEn 
                            ? "For the best reading experience on mobile screens, please open the document directly." 
                            : "为了在小屏幕设备上获得最佳的排版与缩放体验，建议直接打开原生阅读器。"}
                        </p>
                        <a 
                          href={selectedItem.fileUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="px-8 py-4 bg-primary text-primary-foreground hover:bg-primary-hover rounded-full font-bold shadow-xl active:scale-95 transition-all flex items-center gap-3"
                        >
                          <ExternalLink className="w-5 h-5" />
                          {isEn ? "Open PDF Reader" : "使用原生阅读器打开"}
                        </a>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}