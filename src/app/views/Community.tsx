import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Plus, X, Image as ImageIcon, Sparkles, Twitter, 
  Facebook, Youtube, Trash2, AlertCircle, ExternalLink, 
  BadgeCheck, Link2, Upload, Share2, Copy, CheckCircle2
} from 'lucide-react';
import { cn } from "@/app/components/ui";
import { useLanguage } from "@/app/i18n/LanguageContext";

// --- Types ---
interface Post {
  id: string;
  author: string;
  avatar: string;
  imageUrl: string;
  titleEn: string;
  titleZh: string;
  descriptionEn: string;
  descriptionZh: string;
  likes: number;
  tagsEn: string[];
  tagsZh: string[];
  locationEn?: string;
  locationZh?: string;
  dateEn: string;
  dateZh: string;
  isMe?: boolean;
  isExternal?: boolean;
  externalUrl?: string;
}

// --- 🌿 15 个 Properties 完整数据池 ---
const PROPERTIES_TAGS = [
  { en: 'Levels of Scale', zh: '尺度层级' },
  { en: 'Strong Centers', zh: '强中心' },
  { en: 'Boundaries', zh: '边界' },
  { en: 'Alternating Repetition', zh: '交替重复' },
  { en: 'Positive Space', zh: '正空间' },
  { en: 'Good Shape', zh: '良好形状' },
  { en: 'Local Symmetries', zh: '局部对称' },
  { en: 'Deep Interlock', zh: '深度交织' },
  { en: 'Contrast', zh: '对比' },
  { en: 'Gradients', zh: '渐变' },
  { en: 'Roughness', zh: '粗糙性' },
  { en: 'Echoes', zh: '共鸣' },
  { en: 'The Void', zh: '虚空' },
  { en: 'Inner Calm', zh: '内在平静' },
  { en: 'Not-Separateness', zh: '非分离性' }
];

// --- 💎 完整的初始数据 ---
const INITIAL_POSTS: Post[] = [
  {
    id: 'ext_1',
    author: 'createstreets',
    avatar: '/posts/CSA.jpg',
    imageUrl: '/posts/CSI.jpg',
    titleEn: 'The best density is gentle...',
    titleZh: '最美妙的密度是“温柔”的...',
    descriptionEn: 'Research shows that traditional street patterns with high visual complexity improve mental well-being.',
    descriptionZh: '研究表明，具有高视觉复杂度的传统街道模式，能显著提升居民的心理健康。',
    likes: 6900,
    tagsEn: ['Gentle Density', 'Create Streets'],
    tagsZh: ['温和密度', '精选转载'],
    locationEn: 'London, UK',
    locationZh: '英国，伦敦',
    dateEn: 'Featured',
    dateZh: '精选转载',
    isExternal: true,
    externalUrl: 'https://twitter.com/createstreets/status/1190219661596200961'
  },
  {
    id: '1',
    author: 'Thomas_Pioneer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    imageUrl: 'https://images.unsplash.com/photo-1518991669955-9c7e78ec80ca?auto=format&fit=crop&w=800&q=80',
    titleEn: 'Florence Gradients',
    titleZh: '佛罗伦萨的渐变',
    descriptionEn: 'Found this beautiful transition in Florence. The gradient of shadows creates a profound sense of inner calm.',
    descriptionZh: '在佛罗伦萨发现了这段绝美的过渡空间。阴影的渐变营造出一种深刻的内在平静。',
    likes: 342,
    tagsEn: ['Gradients', 'Humanise'],
    tagsZh: ['渐变', '人性化'],
    dateEn: '2h ago',
    dateZh: '2小时前'
  },
  {
    id: '2',
    author: 'PatternLanguage',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    titleEn: 'Strong Centers study',
    titleZh: '强中心空间研究',
    descriptionEn: 'Notice how the boundaries are not just lines, but spaces themselves.',
    descriptionZh: '请注意这些边界不再是简单的线条，而是具有厚度的空间本身。',
    likes: 189,
    tagsEn: ['Strong Centers', 'Boundaries'],
    tagsZh: ['强中心', '边界'],
    dateEn: '5h ago',
    dateZh: '5小时前'
  }
];

export default function Community() {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewingPostId, setViewingPostId] = useState<string | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  // 发帖表单状态
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newImgUrl, setNewImgUrl] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [selectedTags, setSelectedTags] = useState<{en: string, zh: string}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const viewingPost = posts.find(p => p.id === viewingPostId);

  // 🖼️ 核心功能：处理本地图片文件上传
  const handleLocalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImgUrl(reader.result as string); // 将本地图片转为 Base64 预览图
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  // 🌍 社交分享
  const shareToPlatform = (platform: string) => {
    if (!viewingPost) return;
    const shareText = encodeURIComponent(isEn ? viewingPost.titleEn : viewingPost.titleZh);
    const shareUrl = encodeURIComponent(window.location.href);

    const urls: Record<string, string> = {
      x: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      youtube: `https://www.youtube.com/` 
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      window.open(urls[platform], '_blank');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newImgUrl) return;
    const newPost: Post = {
      id: Date.now().toString(),
      author: 'Researcher',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Researcher',
      imageUrl: newImgUrl,
      titleEn: newTitle, titleZh: newTitle,
      descriptionEn: newDesc, descriptionZh: newDesc,
      likes: 0,
      tagsEn: selectedTags.map(t => t.en),
      tagsZh: selectedTags.map(t => t.zh),
      dateEn: 'Just now', dateZh: '刚刚',
      isMe: true
    };
    setPosts([newPost, ...posts]);
    setIsCreateModalOpen(false);
    setNewTitle(''); setNewDesc(''); setNewImgUrl(''); setSelectedTags([]);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 pb-24 font-sans selection:bg-amber-100">
      
      {/* Hero */}
      <div className="w-full pt-20 pb-16 px-6 border-b border-stone-200 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500 mb-6">
            <Sparkles className="w-3 h-3 text-amber-500" /> {isEn ? 'Global Observation Network' : '全球实证观测网络'}
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-black mb-6 tracking-tight text-stone-900 leading-[1.1]">
            {isEn ? (<>Reclaiming the <br/><span className="font-serif italic font-light text-amber-700">Living Structure</span> of Cities</>) : (<>重构城市空间的 <br/><span className="font-serif italic font-light text-amber-700">活力结构</span></>)}
          </h1>
          <button onClick={() => setIsCreateModalOpen(true)} className="bg-stone-900 text-white hover:bg-amber-600 px-8 py-3.5 rounded-full font-bold tracking-widest uppercase text-xs transition-all flex items-center gap-2 mx-auto shadow-lg active:scale-95 mt-8">
            <Plus className="w-4 h-4" /> {isEn ? 'Post Observation' : '发布观测记录'}
          </button>
        </div>
      </div>

      {/* 列表显示区 */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <motion.div layout key={post.id} onClick={() => setViewingPostId(post.id)} className="bg-white rounded-xl overflow-hidden border border-stone-200 hover:border-amber-400 shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col cursor-pointer">
              <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                <img 
                  src={post.imageUrl} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                  alt="post"
                  onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=800"; }}
                />
                {post.isExternal && (
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-[9px] font-bold text-amber-700 border border-amber-100 flex items-center gap-1 shadow-sm">
                    <ExternalLink className="w-2.5 h-2.5" /> Featured
                  </div>
                )}
                <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 bg-white/90 backdrop-blur text-stone-900 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    {isEn ? 'View Details' : '查看详情'}
                  </div>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
                  {(isEn ? post.tagsEn : post.tagsZh).map(tag => (
                    <span key={tag} className="shrink-0 px-2 py-0.5 bg-stone-100 text-stone-500 text-[9px] font-bold uppercase tracking-wider rounded-sm border border-stone-200">{tag}</span>
                  ))}
                </div>
                <h3 className="text-lg font-serif font-bold text-stone-900 mb-2 line-clamp-1">{isEn ? post.titleEn : post.titleZh}</h3>
                <p className="text-stone-500 text-sm leading-relaxed mb-6 line-clamp-2 flex-grow">{isEn ? post.descriptionEn : post.descriptionZh}</p>
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <img src={post.avatar} className="w-6 h-6 rounded-full border border-stone-300" alt="av" />
                    <div className="flex items-center gap-1 font-bold text-stone-700 text-xs">
                      {post.author}{post.isExternal && <BadgeCheck className="w-3 h-3 text-blue-500" />}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-stone-400 group/btn"><Heart className="w-4 h-4" /><span className="text-xs font-mono">{post.likes}</span></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* --- 详情弹窗 (含有外部跳转代码) --- */}
      <AnimatePresence>
        {viewingPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewingPostId(null)} className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
              
              <div className="w-full md:w-3/5 bg-stone-100 relative h-64 md:h-auto overflow-hidden">
                <img src={viewingPost.imageUrl} className="absolute inset-0 w-full h-full object-cover" alt="detail" onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=1200"; }} />
                {viewingPost.isExternal && (
                  <div className="absolute bottom-6 left-6 flex items-center gap-2">
                    <div className="bg-stone-900/80 backdrop-blur text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-2xl border border-white/10">
                      <Twitter className="w-3.5 h-3.5 text-blue-400" /> Source: X / Twitter
                    </div>
                  </div>
                )}
              </div>
              
              <div className="w-full md:w-2/5 flex flex-col h-full bg-white overflow-y-auto">
                <div className="p-8 flex-grow">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center space-x-3">
                      <img src={viewingPost.avatar} alt="avatar" className="w-10 h-10 rounded-full border border-stone-200" />
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-stone-900 text-sm">{viewingPost.author}{viewingPost.isExternal && <BadgeCheck className="w-3.5 h-3.5 text-blue-500" />}</div>
                        <div className="text-[10px] text-stone-400 font-mono uppercase tracking-widest">{isEn ? viewingPost.dateEn : viewingPost.dateZh}</div>
                      </div>
                    </div>
                    <button onClick={() => setViewingPostId(null)} className="p-2 text-stone-400 hover:bg-stone-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                  </div>

                  <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">{isEn ? viewingPost.titleEn : viewingPost.titleZh}</h2>
                  <p className="text-stone-600 text-sm leading-loose font-serif mb-8">{isEn ? viewingPost.descriptionEn : viewingPost.descriptionZh}</p>
                  
                  {/* 💡 外部链接跳转代码就在这里！ */}
                  {viewingPost.isExternal && viewingPost.externalUrl && (
                    <a 
                      href={viewingPost.externalUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex items-center justify-center gap-2 w-full py-3.5 bg-stone-100 rounded-xl text-stone-900 text-xs font-bold uppercase tracking-widest hover:bg-stone-200 transition-all border border-stone-200 shadow-sm group"
                    >
                      <Twitter className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" /> 
                      {isEn ? 'Dive Deeper on X' : '在 X 上查看原文链接'}
                    </a>
                  )}
                </div>

                <div className="p-8 border-t border-stone-100 bg-stone-50 flex justify-between items-center mt-auto">
                  <button onClick={() => handleLike(viewingPost.id)} className="flex items-center gap-2 text-stone-500 hover:text-amber-600 transition-colors">
                    <Heart className={cn("w-6 h-6", viewingPost.likes > 1000 && "fill-amber-500 text-amber-500")} />
                    <span className="font-bold font-mono text-lg">{viewingPost.likes}</span>
                  </button>
                  
                  {/* 🌍 社交分享弹窗 */}
                  <div className="flex items-center gap-2 relative">
                    <button onClick={() => setShowShareMenu(!showShareMenu)} className="p-2.5 bg-stone-100 text-stone-600 hover:bg-stone-900 hover:text-white rounded-full transition-all flex items-center gap-2">
                      <Share2 className="w-4 h-4" /> <span className="text-[10px] font-bold uppercase tracking-widest">{isEn ? 'Share' : '分享'}</span>
                    </button>
                    <AnimatePresence>
                      {showShareMenu && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute bottom-full right-0 mb-4 bg-white border border-stone-100 shadow-2xl rounded-2xl p-2 w-48 z-10">
                          {[
                            { id: 'x', icon: Twitter, label: 'X (Twitter)', color: 'hover:bg-stone-900' },
                            { id: 'facebook', icon: Facebook, label: 'Facebook', color: 'hover:bg-blue-600' },
                            { id: 'youtube', icon: Youtube, label: 'YouTube', color: 'hover:bg-red-600' },
                            { id: 'copy', icon: Link2, label: isEn ? 'Copy Link' : '复制链接', color: 'hover:bg-amber-600' },
                          ].map(p => (
                            <button key={p.id} onClick={() => shareToPlatform(p.id)} className={cn("w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-stone-600 hover:text-white rounded-xl transition-all", p.color)}>
                              <p.icon className="w-4 h-4" /> {p.label}
                              {p.id === 'copy' && copied && <CheckCircle2 className="w-3 h-3 text-white ml-auto" />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- 🔴 升级版发帖弹窗 (本地传图 + 15 Properties) --- */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCreateModalOpen(false)} className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                <h3 className="text-xl font-serif font-bold text-stone-900">{isEn ? 'New Observation' : '发布新观测记录'}</h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-stone-200 rounded-full transition text-stone-500"><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6">
                <form id="post-form" onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* 🖼️ 本地传图区 */}
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">{isEn ? 'Observation Photo' : '观测照片上传'}</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-48 border-2 border-dashed border-stone-200 rounded-2xl flex flex-col items-center justify-center bg-stone-50 hover:bg-stone-100 cursor-pointer transition-all relative overflow-hidden group"
                    >
                      {newImgUrl ? (
                        <>
                          <img src={newImgUrl} className="w-full h-full object-cover" alt="preview" />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Upload className="text-white w-6 h-6" /></div>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 text-stone-400"><Upload className="w-6 h-6" /></div>
                          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{isEn ? 'Select from your computer' : '从电脑本地文件夹选择图片'}</p>
                        </>
                      )}
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLocalUpload} />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">{isEn ? 'Title' : '标题'}</label>
                    <input type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="..." className="w-full text-xl font-serif border-0 border-b border-stone-200 focus:border-amber-500 bg-transparent px-0 py-2 focus:ring-0 transition-all" />
                  </div>

                  {/* 🌿 15 个 Properties 选择器 */}
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 flex items-center justify-between">
                      <span>{isEn ? 'Structural Properties (Max 3)' : '结构属性（最多3项）'}</span>
                      <span className="text-[10px] bg-stone-100 px-2 py-0.5 rounded">{selectedTags.length}/3</span>
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1 scrollbar-hide border border-stone-100 rounded-lg">
                      {PROPERTIES_TAGS.map(tag => {
                        const isSelected = selectedTags.some(t => t.en === tag.en);
                        return (
                          <button key={tag.en} type="button" onClick={() => toggleTag(tag)} className={cn("px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded border transition-all", isSelected ? "bg-stone-900 text-white border-stone-900 shadow-inner" : "bg-white text-stone-400 border-stone-200 hover:border-amber-500 hover:text-amber-600")}>
                            {isEn ? tag.en : tag.zh}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">{isEn ? 'Observation Summary' : '观测总结与感悟'}</label>
                    <textarea rows={3} value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="w-full text-sm bg-stone-50 border border-stone-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-amber-500/20" />
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-stone-100 bg-stone-50 flex justify-end gap-3">
                <button onClick={() => setIsCreateModalOpen(false)} className="px-6 py-2.5 text-xs font-bold text-stone-500">Cancel</button>
                <button type="submit" form="post-form" className="px-8 py-2.5 bg-stone-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg active:scale-95">Publish</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}