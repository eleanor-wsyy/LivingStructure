import React, { useState } from "react";
import { Button, Input, Badge, Card } from "@/app/components/ui";
import { Search, Book, FileText, Bookmark, Download, Video, Filter, ExternalLink } from "lucide-react";
import { useLanguage } from "@/app/i18n/LanguageContext";

// ============================================================================
// 📚 真实的文献数据库 (添加你想要展示的 PDF 路径即可)
// 请确保把对应的 PDF 文件放在 public/papers/ 目录下
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
    abstractZh: "引入了生命力结构的概念以及构成自然界和建筑中所有生命系统的 15 个基本几何属性。",
    pdfUrl: "/papers/Book1Chapter8+9.pdf" // 指向你 public 里的文件
  },
  { 
    id: 2, 
    type: "paper", 
    titleEn: "Head/Tail Breaks: A New Classification Scheme for Data with a Heavy-Tailed Distribution", 
    titleZh: "头/尾分布：一种针对重尾分布数据的新型分类方案",
    author: "Bin Jiang", 
    year: 2013, 
    citations: 1205,
    abstractEn: "Proposes a novel classification scheme for data with a heavy-tailed distribution, which is the mathematical foundation for measuring living structure.",
    abstractZh: "提出了一种针对重尾分布数据的新型分类方案，这为量化测量“生命力结构”提供了坚实的数学和拓扑学基础。",
    pdfUrl: "https://arxiv.org/ftp/arxiv/papers/1209/1209.2801.pdf" // 也可以指向外部链接
  },
  { 
    id: 3, 
    type: "patent", 
    titleEn: "A Space Design Method, Device and Equipment based on the Integration of Skeleton and Skin", 
    titleZh: "一种基于骨架与外皮一体化的空间设计方法、装置及设备 (专利)",
    author: "Bin Jiang, et al.", 
    year: 2024, 
    citations: 0,
    abstractEn: "A patent detailing the algorithmic generation of spatial designs by iteratively dividing a skeleton and applying stylistic skins based on the L=S*H formula.",
    abstractZh: "一项详细介绍通过迭代划分骨架并应用风格表皮来算法化生成空间设计的专利，其核心逻辑基于 L=S×H 公式。",
    pdfUrl: "/papers/【发明初稿】一种基于骨架与外皮一体化的空间设计方法、装置及设备4PDF.pdf"
  },
  { 
    id: 4, 
    type: "video", 
    titleEn: "The Beauty of Architecture (Questionnaire & Lecture)", 
    titleZh: "建筑结构美测试与讲座",
    author: "LivableCityLAB, HKUST (GZ)", 
    year: 2025, 
    duration: "10m",
    abstractEn: "An interactive lecture and questionnaire terminal exploring the subconscious perception of structural beauty.",
    abstractZh: "探索对结构美潜意识感知的互动讲座与问卷终端。",
    pdfUrl: "https://livablecitylab.hkust-gz.edu.cn/beautyofarchitecture"
  }
];

export function Library() {
  const { trans, language } = useLanguage();
  const isEn = language === 'en';
  
  const [searchQuery, setSearchQuery] = useState("");
  // 简易过滤状态，实际项目中可根据左侧 checkbox 进一步丰富逻辑
  const [filterType, setFilterType] = useState<string>("all"); 

  const filteredResources = resources.filter(item => {
    const title = isEn ? item.titleEn : item.titleZh;
    const matchesSearch = 
      title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || item.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <div className="border-b border-stone-200 bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl md:text-4xl font-serif font-black text-stone-900 tracking-tight">
            {trans.library.title || "Academic Library"}
          </h1>
          <p className="mt-3 text-stone-600 max-w-2xl leading-relaxed">
            {trans.library.subtitle || "Explore foundational papers, books, and patents driving the mathematical laws of living structure."}
          </p>
          
          <div className="mt-8 flex flex-col md:flex-row gap-4 max-w-3xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-stone-400" />
              <Input 
                className="pl-12 h-12 bg-white rounded-xl border-stone-200 shadow-sm focus:ring-teal-500" 
                placeholder={trans.library.searchPlaceholder || "Search by title or author..."} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="h-12 px-8 bg-stone-900 rounded-xl hover:bg-teal-700 transition-colors shadow-md">
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
            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
              <h3 className="flex items-center gap-2 font-bold text-stone-900 mb-5 uppercase tracking-widest text-xs">
                <Filter className="h-4 w-4 text-stone-500" /> {trans.library.filters || "Resource Type"}
              </h3>
              <div className="space-y-3 font-medium text-sm text-stone-600">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="type" className="w-4 h-4 text-teal-600 focus:ring-teal-500" checked={filterType === "all"} onChange={() => setFilterType("all")} />
                  <span className="group-hover:text-stone-900 transition-colors">{isEn ? "All Resources" : "全部资源"}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="type" className="w-4 h-4 text-teal-600 focus:ring-teal-500" checked={filterType === "paper"} onChange={() => setFilterType("paper")} />
                  <span className="group-hover:text-stone-900 transition-colors">{trans.library.papers || "Papers"}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="type" className="w-4 h-4 text-teal-600 focus:ring-teal-500" checked={filterType === "book"} onChange={() => setFilterType("book")} />
                  <span className="group-hover:text-stone-900 transition-colors">{trans.library.books || "Books"}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="type" className="w-4 h-4 text-teal-600 focus:ring-teal-500" checked={filterType === "patent"} onChange={() => setFilterType("patent")} />
                  <span className="group-hover:text-stone-900 transition-colors">{isEn ? "Patents" : "专利"}</span>
                </label>
              </div>
            </div>
          </div>

          {/* Results List */}
          <div className="lg:col-span-3 space-y-5">
            {filteredResources.length === 0 ? (
              <div className="text-center py-20 text-stone-400">
                 <Search className="w-8 h-8 mx-auto mb-4 opacity-50" />
                 <p>{isEn ? "No resources found." : "未找到匹配的文献。"}</p>
              </div>
            ) : (
              filteredResources.map((item) => (
                <Card 
                  key={item.id} 
                  className="group flex flex-col sm:flex-row gap-6 p-6 hover:shadow-lg transition-all rounded-2xl border border-stone-200 border-l-4 border-l-transparent hover:border-l-teal-600 bg-white relative overflow-hidden"
                >
                  <div className="shrink-0 pt-1">
                    <div className="flex h-20 w-16 items-center justify-center rounded-lg bg-stone-100 text-stone-400 shadow-inner">
                      {item.type === "video" ? <Video className="h-7 w-7" /> : 
                       item.type === "book" ? <Book className="h-7 w-7" /> : <FileText className="h-7 w-7" />}
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-bold text-stone-900 leading-snug group-hover:text-teal-800 transition-colors">
                          <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {isEn ? item.titleEn : item.titleZh}
                          </a>
                        </h3>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0"><Bookmark className="h-4 w-4 text-stone-400 hover:text-stone-900 transition-colors" /></Button>
                      </div>
                      
                      <div className="mt-2 flex items-center gap-2 text-xs font-mono text-stone-500">
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

                      <p className="mt-4 text-sm text-stone-600 leading-relaxed max-w-3xl">
                        {isEn ? item.abstractEn : item.abstractZh}
                      </p>
                    </div>
                    
                    <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold text-stone-500 pt-4 border-t border-stone-100">
                      <Badge variant="secondary" className="bg-stone-100 hover:bg-stone-200 capitalize text-[10px] tracking-widest px-2 py-0.5">
                        {item.type}
                      </Badge>
                      
                      {item.citations > 0 && (
                        <span>{trans.library.citations || "Citations"}: {item.citations.toLocaleString()}</span>
                      )}
                      
                      {/* 直接在新标签页打开阅读 */}
                      <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-stone-900 hover:text-teal-600 transition-colors ml-auto md:ml-0">
                        <ExternalLink className="w-3.5 h-3.5" />
                        {isEn ? "Read Document" : "在线阅读"}
                      </a>

                      {/* 下载属性 */}
                      <a href={item.pdfUrl} download className="flex items-center gap-1 text-stone-500 hover:text-teal-600 transition-colors">
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
      </div>
    </div>
  );
}