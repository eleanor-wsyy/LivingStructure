import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Plus, X, Sparkles, Twitter,
  Facebook, ExternalLink, Send,
  BadgeCheck, Link2, Upload, Share2, CheckCircle2, MessageCircle
} from 'lucide-react';
import { cn } from "@/app/components/ui";
import { useLanguage } from "@/app/i18n/LanguageContext";

// --- Types ---
interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
  likes: number;
}

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
  comments?: Comment[];
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
  // ── 行1：机构资源 ──
  {
    id: 'ext_7',
    author: 'LivableCityLAB · HKUST-GZ',
    avatar: 'public/logo.jpg',
    imageUrl: '/images/lcb.png',
    titleEn: 'Architecture Education Declares',
    titleZh: '建筑教育宣言',
    descriptionEn: '"Our education has a key role to play in addressing the ongoing ecological crisis." A manifesto signed by hundreds of architecture students and faculty worldwide, calling for curriculum reform.',
    descriptionZh: '"我们的教育在应对持续的生态危机中扮演着关键角色。" 一份由全球数百名建筑学生和教职人员联署的宣言，呼吁对建筑教育课程进行深层改革。',
    likes: 6100,
    tagsEn: ['Manifesto', 'Ecological Crisis'],
    tagsZh: ['宣言', '生态危机'],
    locationEn: 'HKUST-GZ',
    locationZh: '香港科技大学（广州）',
    dateEn: 'Featured',
    dateZh: '精选转载',
    isExternal: true,
    externalUrl: 'https://livablecitylab.hkust-gz.edu.cn/ArchitectureEducationDeclares/'
  },
  {
    id: 'ext_5',
    author: 'Michael Diamant · newtrad.org',
    avatar: '/images/ntau.png',
    imageUrl: 'https://newtrad.org/wp-content/uploads/2018/10/balt3.jpg',
    titleEn: 'New Traditional Architecture & Urbanism',
    titleZh: '新传统建筑与城市规划',
    descriptionEn: 'A global directory of firms working in classical, vernacular, and organic tradition. Covering new classical projects from Estonia to Latin America — a continuously updated atlas of built livingness.',
    descriptionZh: '一份覆盖全球的古典、乡土与有机传统建筑事务所目录，从爱沙尼亚到拉丁美洲，持续记录新传统主义建筑的全球实践地图。',
    likes: 3800,
    tagsEn: ['Classical Architecture', 'Global Atlas'],
    tagsZh: ['古典建筑', '全球地图'],
    locationEn: 'Baltic States',
    locationZh: '波罗的海三国',
    dateEn: 'Featured',
    dateZh: '精选转载',
    isExternal: true,
    externalUrl: 'https://newtrad.org/'
  },
  {
    id: 'ext_9',
    author: 'Building Beauty',
    avatar: '/images/bb.png',
    imageUrl: 'https://images.squarespace-cdn.com/content/v1/5b630c72b105985f9011d294/1533265708303-4SIB8CL3QTWZVU3PLR0B/SORSAEntryDrive01.jpg',
    titleEn: 'Building Beauty',
    titleZh: 'Building Beauty 活力建造学院',
    descriptionEn: 'A multidisciplinary educational program and community of explorers committed to building places that nurture people and life. Founded on Christopher Alexander\'s "The Nature of Order" — head, heart, and hands.',
    descriptionZh: '一个跨学科教育项目与探索者社群，致力于创造能够滋养人类与生命的场所。以克里斯托弗·亚历山大《秩序的本质》为核心，融合"头脑、心灵与双手"的整体建造理念。',
    likes: 8700,
    tagsEn: ['Christopher Alexander', 'Living Process'],
    tagsZh: ['克里斯托弗·亚历山大', '活力过程'],
    locationEn: 'Sorrento, Italy',
    locationZh: '意大利，索伦托',
    dateEn: 'Featured',
    dateZh: '精选转载',
    isExternal: true,
    externalUrl: 'https://www.buildingbeauty.org/'
  },
  // ── 行2：研究者与运动 ──
  {
    id: 'ext_6',
    author: 'Ann Sussman',
    avatar: '/images/as.png',
    imageUrl: 'https://geneticsofdesign.com/wp-content/uploads/2016/04/eye-track-poster-section2.png',
    titleEn: 'Designing for the Subliminal Brain',
    titleZh: '为潜意识大脑而设计',
    descriptionEn: 'Author of "Cognitive Architecture". Using eye-tracking and biometric research to reveal how buildings unconsciously impact our brains — and why modernist facades consistently fail the human gaze.',
    descriptionZh: '《认知建筑》作者。通过眼动追踪与生物识别研究，揭示建筑如何在潜意识层面影响我们的大脑——以及为何现代主义建筑立面始终无法通过人类视觉的考验。',
    likes: 2900,
    tagsEn: ['Neuroscience', 'Biometrics'],
    tagsZh: ['神经科学', '生物识别'],
    locationEn: 'Boston, USA',
    locationZh: '美国，波士顿',
    dateEn: 'Featured',
    dateZh: '精选转载',
    isExternal: true,
    externalUrl: 'https://annsussman.com/'
  },
  {
    id: 'ext_4',
    author: 'The Aesthetic City',
    avatar: '/images/tac.png',
    imageUrl: 'https://theaestheticcity.com/wp-content/uploads/2021/11/LondonBathSeries1-293-scaled.jpg',
    titleEn: 'The Aesthetic City',
    titleZh: '唯美城市 (The Aesthetic City)',
    descriptionEn: 'Campaigning for beauty in the built environment. Cities should be beautiful, walkable, and human-scaled — the Royal Crescent in Bath is what living structure looks like at urban scale.',
    descriptionZh: '倡导建筑环境之美。城市应当是美丽的、步行友好的、具有人性化尺度的——巴斯皇家新月楼正是城市尺度下"活力结构"的真实体现。',
    likes: 5400,
    tagsEn: ['Urban Beauty', 'Human Scale'],
    tagsZh: ['城市美学', '人性尺度'],
    locationEn: 'Bath, UK',
    locationZh: '英国，巴斯',
    dateEn: 'Featured',
    dateZh: '精选转载',
    isExternal: true,
    externalUrl: 'https://theaestheticcity.com/'
  },
  {
    id: 'ext_8',
    author: 'Architectural Uprising',
    avatar: '/images/tau.png',
    imageUrl: 'https://www.architecturaluprising.com/wp-content/uploads/2023/09/header-img-two-AU-logo-new2.png',
    titleEn: 'Architectural Uprising (Arkitekturupproret)',
    titleZh: '建筑起义 (Arkitekturupproret)',
    descriptionEn: 'A grassroots movement that started in Scandinavia and spread globally. Using humor, debate, and media to question architectural experts and advocate for beauty and human-scaled tradition.',
    descriptionZh: '起源于斯堪的纳维亚、席卷全球的草根运动。以幽默、辩论和媒体为武器，向建筑专家权威发起质疑，捍卫美丽与人性化尺度的传统建筑价值。',
    likes: 12500,
    tagsEn: ['Grassroots', 'Scandinavia'],
    tagsZh: ['草根运动', '斯堪的纳维亚'],
    locationEn: 'Europe & Global',
    locationZh: '欧洲及全球',
    dateEn: 'Featured',
    dateZh: '精选转载',
    isExternal: true,
    externalUrl: 'https://www.architecturaluprising.com/'
  },
  // ── 行3（底部）：街道与人文观察 ──
  {
    id: 'ext_1',
    author: 'createstreets',
    avatar: '/posts/CSA.jpg',
    imageUrl: '/posts/CSI.jpg',
    titleEn: 'The best density is gentle...',
    titleZh: '最美妙的密度是"温柔"的...',
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
    id: 'ext_2',
    author: 'Humanise',
    avatar: 'https://humanise.org/apple-touch-icon.png',
    imageUrl: 'https://strapi-humanise.s3.eu-west-2.amazonaws.com/Web_banners_14_b8f8a150c2.png',
    titleEn: 'Six joyful Brazilian buildings',
    titleZh: '六座充满生机的巴西建筑',
    descriptionEn: "We're living through a quiet global catastrophe of soulless boring buildings. Let's look at six joyful buildings in Brazil that make cities more human.",
    descriptionZh: '我们正经历一场由缺乏灵魂的枯燥建筑带来的全球性灾难。一起来看看巴西这六座充满生机的建筑，它们让城市变得更加人性化。',
    likes: 8520,
    tagsEn: ['Joyful Buildings', 'Humanise'],
    tagsZh: ['生机建筑', '人性化城市'],
    locationEn: 'Brazil',
    locationZh: '巴西',
    dateEn: 'Featured',
    dateZh: '精选转载',
    isExternal: true,
    externalUrl: 'https://humanise.org/opinions/six-joyful-Brazilian-buildings'
  },
  {
    id: 'ext_3',
    author: 'Humanise',
    avatar: 'https://humanise.org/apple-touch-icon.png',
    imageUrl: 'https://strapi-humanise.s3.eu-west-2.amazonaws.com/Web_banners_15_aa1bad6880.png',
    titleEn: 'Giving more than taking: The BuStop House',
    titleZh: '给予多于索取：BuStop住宅',
    descriptionEn: 'The thinking behind the brilliant reimagining of a family home in Cambridgeshire, UK. Generosity and publicness at its core.',
    descriptionZh: '英国剑桥郡一处家庭住宅绝妙重构背后的思考。其核心在于对街道的慷慨与公共性的重塑。',
    likes: 4200,
    tagsEn: ['Publicness', 'Generosity'],
    tagsZh: ['公共性', '空间慷慨'],
    locationEn: 'UK',
    locationZh: '英国',
    dateEn: 'Featured',
    dateZh: '精选转载',
    isExternal: true,
    externalUrl: 'https://humanise.org/opinions/generosity-and-publicness-at-the-bustop-house'
  }
];

export default function Community() {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewingPostId, setViewingPostId] = useState<string | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [commentsByPost, setCommentsByPost] = useState<Record<string, Comment[]>>({});
  const [commentLikes, setCommentLikes] = useState<Set<string>>(new Set());
  const [newCommentText, setNewCommentText] = useState('');
  const commentsEndRef = useRef<HTMLDivElement>(null);

  // 发帖表单状态
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newImgUrl, setNewImgUrl] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [selectedTags, setSelectedTags] = useState<{ en: string, zh: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const viewingPost = posts.find(p => p.id === viewingPostId);
  const currentComments = viewingPostId ? (commentsByPost[viewingPostId] || []) : [];

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
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id); // 取消点赞
        setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes - 1 } : p));
      } else {
        next.add(id); // 点赞
        setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
      }
      return next;
    });
  };

  const handleCommentLike = (commentId: string) => {
    if (!viewingPostId) return;
    const key = `${viewingPostId}__${commentId}`;
    setCommentLikes(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
    setCommentsByPost(prev => ({
      ...prev,
      [viewingPostId]: (prev[viewingPostId] || []).map(c =>
        c.id === commentId
          ? { ...c, likes: commentLikes.has(key) ? c.likes - 1 : c.likes + 1 }
          : c
      )
    }));
  };

  const handleAddComment = () => {
    if (!newCommentText.trim() || !viewingPostId) return;
    const comment: Comment = {
      id: Date.now().toString(),
      author: isEn ? 'You' : '我',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User123',
      text: newCommentText.trim(),
      timestamp: isEn ? 'Just now' : '刚刚',
      likes: 0,
    };
    setCommentsByPost(prev => ({
      ...prev,
      [viewingPostId]: [...(prev[viewingPostId] || []), comment]
    }));
    setNewCommentText('');
    setTimeout(() => commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const handleDeleteComment = (commentId: string) => {
    if (!viewingPostId) return;
    setCommentsByPost(prev => ({
      ...prev,
      [viewingPostId]: (prev[viewingPostId] || []).filter(c => c.id !== commentId)
    }));
  };

  // 🌍 社交分享
  const shareToPlatform = (platform: string) => {
    if (!viewingPost) return;
    const shareText = encodeURIComponent(isEn ? viewingPost.titleEn : viewingPost.titleZh);
    const shareUrl = encodeURIComponent(window.location.href);

    const urls: Record<string, string> = {
      x: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      wechat: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${shareUrl}`,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else if (platform === 'wechat') {
      // 微信分享：打开二维码页面供用户扫码
      window.open(urls['wechat'], '_blank');
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
    <div className="min-h-screen bg-card text-stone-800 pb-24 font-sans selection:bg-amber-100">

      {/* Hero */}
      <div className="w-full pt-20 pb-16 px-6 border-b border-border bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground mb-6">
            <Sparkles className="w-3 h-3 text-amber-500" /> {isEn ? 'Global Observation Network' : '全球实证观测网络'}
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-black mb-6 tracking-tight text-foreground leading-[1.1]">
            {isEn ? (<>Reclaiming the <br /><span className="font-serif italic font-light text-amber-700">Living Structure</span> of Cities</>) : (<>重构城市空间的 <br /><span className="font-serif italic font-light text-amber-700">活力结构</span></>)}
          </h1>
          <button onClick={() => setIsCreateModalOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary-hover px-8 py-3.5 rounded-full font-bold tracking-widest uppercase text-xs transition-all flex items-center gap-2 mx-auto shadow-lg active:scale-95 mt-8">
            <Plus className="w-4 h-4" /> {isEn ? 'Post Observation' : '发布观测记录'}
          </button>
        </div>
      </div>

      {/* 列表显示区 */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <motion.div layout key={post.id} onClick={() => setViewingPostId(post.id)} className="bg-card rounded-xl overflow-hidden border border-border hover:border-amber-400 shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col cursor-pointer">
              <div className="relative aspect-[4/3] bg-secondary overflow-hidden">
                <img
                  src={post.imageUrl}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  alt="post"
                  onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=800"; }}
                />
                {post.isExternal && (
                  <div className="absolute top-3 right-3 bg-card/90 backdrop-blur px-2 py-1 rounded text-[9px] font-bold text-amber-700 border border-amber-100 flex items-center gap-1 shadow-sm">
                    <ExternalLink className="w-2.5 h-2.5" /> Featured
                  </div>
                )}
                <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 bg-card/90 backdrop-blur text-foreground text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    {isEn ? 'View Details' : '查看详情'}
                  </div>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
                  {(isEn ? post.tagsEn : post.tagsZh).map(tag => (
                    <span key={tag} className="shrink-0 px-2 py-0.5 bg-secondary text-muted-foreground text-[9px] font-bold uppercase tracking-wider rounded-sm border border-border">{tag}</span>
                  ))}
                </div>
                <h3 className="text-lg font-serif font-bold text-foreground mb-2 line-clamp-1">{isEn ? post.titleEn : post.titleZh}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-2 flex-grow">{isEn ? post.descriptionEn : post.descriptionZh}</p>
                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <img src={post.avatar} className="w-6 h-6 rounded-full border border-stone-300" alt="av" />
                    <div className="flex items-center gap-1 font-bold text-stone-700 text-xs">
                      {post.author}{post.isExternal && <BadgeCheck className="w-3 h-3 text-blue-500" />}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground group/btn"><Heart className="w-4 h-4" /><span className="text-xs font-mono">{post.likes}</span></div>
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
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-5xl bg-card rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">

              <div className="w-full md:w-3/5 bg-secondary relative h-64 md:h-auto overflow-hidden">
                <img src={viewingPost.imageUrl} className="absolute inset-0 w-full h-full object-cover" alt="detail" onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=1200"; }} />
                {viewingPost.isExternal && (
                  <div className="absolute bottom-6 left-6 flex items-center gap-2">
                    <div className="bg-stone-900/80 backdrop-blur text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-2xl border border-white/10">
                      {viewingPost.externalUrl?.includes('twitter') ? <Twitter className="w-3.5 h-3.5 text-blue-400" /> : <ExternalLink className="w-3.5 h-3.5 text-amber-400" />}
                      Source: {viewingPost.externalUrl?.includes('twitter') ? 'X / Twitter' : (viewingPost.externalUrl ? new URL(viewingPost.externalUrl).hostname.replace('www.', '') : 'External Site')}
                    </div>
                  </div>
                )}
              </div>

              {/* Right panel - Xiaohongshu style */}
              <div className="w-full md:w-2/5 flex flex-col bg-white" style={{ maxHeight: '90vh' }}>

                {/* ── Pinned Header ── */}
                <div className="px-5 py-4 border-b border-border flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-3">
                    <img src={viewingPost.avatar} alt="av" className="w-9 h-9 rounded-full border border-border object-cover" onError={(e) => { e.currentTarget.src = 'https://api.dicebear.com/7.x/shapes/svg?seed=fallback'; }} />
                    <div>
                      <div className="flex items-center gap-1 font-bold text-foreground text-sm">
                        {viewingPost.author}
                        {viewingPost.isExternal && <BadgeCheck className="w-3.5 h-3.5 text-blue-500" />}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">{isEn ? viewingPost.dateEn : viewingPost.dateZh}</div>
                    </div>
                  </div>
                  <button onClick={() => setViewingPostId(null)} className="p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* ── Scrollable Content + Comments ── */}
                <div className="flex-1 overflow-y-auto">

                  {/* Post content */}
                  <div className="px-5 pt-5 pb-4">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {(isEn ? viewingPost.tagsEn : viewingPost.tagsZh).map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-secondary text-muted-foreground text-[9px] font-bold uppercase tracking-wider rounded-sm border border-border">{tag}</span>
                      ))}
                    </div>
                    <h2 className="text-xl font-serif font-bold text-foreground mb-3">{isEn ? viewingPost.titleEn : viewingPost.titleZh}</h2>
                    <p className="text-muted-foreground text-sm leading-loose font-serif mb-5">{isEn ? viewingPost.descriptionEn : viewingPost.descriptionZh}</p>
                    {viewingPost.isExternal && viewingPost.externalUrl && (
                      <a href={viewingPost.externalUrl} target="_blank" rel="noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-secondary rounded-xl text-foreground text-xs font-bold uppercase tracking-widest hover:bg-amber-50 hover:border-amber-200 transition-all border border-border group mb-2">
                        <ExternalLink className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
                        {isEn ? `Read on ${new URL(viewingPost.externalUrl).hostname.replace('www.','')}` : `在 ${new URL(viewingPost.externalUrl).hostname.replace('www.','')} 查看原文`}
                      </a>
                    )}
                  </div>

                  {/* ── Comment Divider ── */}
                  <div className="px-5 py-3 border-t border-border flex items-center gap-2">
                    <MessageCircle className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      {isEn ? `${currentComments.length} Comment${currentComments.length !== 1 ? 's' : ''}` : `${currentComments.length} 条评论`}
                    </span>
                  </div>

                  {/* ── Comment List ── */}
                  <div className="px-5 pb-4 space-y-5">
                    {currentComments.length === 0 && (
                      <p className="text-center text-stone-300 text-xs py-6">{isEn ? 'Be the first to comment ✨' : '快来发表第一条评论吧 ✨'}</p>
                    )}
                    {currentComments.map(comment => {
                      const likeKey = `${viewingPostId}__${comment.id}`;
                      const isCommentLiked = commentLikes.has(likeKey);
                      return (
                        <div key={comment.id} className="flex gap-3 group/comment">
                          <img src={comment.avatar} alt="av" className="w-8 h-8 rounded-full shrink-0 object-cover border border-border" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-bold text-muted-foreground">{comment.author}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-stone-300">{comment.timestamp}</span>
                                {/* 删除按鈕：仅自己的评论悬停时显示 */}
                                {(comment.author === 'You' || comment.author === '我') && (
                                  <button
                                    onClick={() => handleDeleteComment(comment.id)}
                                    className="opacity-0 group-hover/comment:opacity-100 transition-opacity text-stone-300 hover:text-rose-500 p-0.5 rounded"
                                    title={isEn ? 'Delete comment' : '删除评论'}
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-stone-800 mt-0.5 leading-relaxed">{comment.text}</p>
                            <button
                              onClick={() => handleCommentLike(comment.id)}
                              className={cn("flex items-center gap-1 mt-1.5 transition-colors", isCommentLiked ? "text-rose-500" : "text-stone-300 hover:text-rose-400")}
                            >
                              <Heart className={cn("w-3 h-3", isCommentLiked && "fill-rose-500")} />
                              <span className="text-[10px] font-mono">{comment.likes > 0 ? comment.likes : ''}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={commentsEndRef} />
                  </div>
                </div>

                {/* ── Pinned Bottom: Like + Share + Input ── */}
                <div className="shrink-0 border-t border-border bg-white">
                  {/* Action row */}
                  <div className="px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Like toggle */}
                      <button
                        onClick={() => handleLike(viewingPost.id)}
                        className={cn("flex items-center gap-1.5 transition-all active:scale-90", likedPosts.has(viewingPost.id) ? "text-rose-500" : "text-muted-foreground hover:text-rose-400")}
                      >
                        <Heart className={cn("w-5 h-5 transition-all", likedPosts.has(viewingPost.id) && "fill-rose-500 scale-110")} />
                        <span className="text-sm font-bold font-mono">{viewingPost.likes}</span>
                      </button>
                      {/* Comment count */}
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm font-bold font-mono">{currentComments.length}</span>
                      </span>
                    </div>
                    {/* Share */}
                    <div className="relative">
                      <button onClick={() => setShowShareMenu(!showShareMenu)} className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-muted-foreground hover:bg-stone-900 hover:text-white rounded-full transition-all text-[10px] font-bold uppercase tracking-widest">
                        <Share2 className="w-3.5 h-3.5" /> {isEn ? 'Share' : '分享'}
                      </button>
                      <AnimatePresence>
                        {showShareMenu && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute bottom-full right-0 mb-3 bg-card border border-border shadow-2xl rounded-2xl p-2 w-44 z-10">
                            {[
                              { id: 'x', icon: Twitter, label: 'X (Twitter)', color: 'hover:bg-stone-900' },
                              { id: 'facebook', icon: Facebook, label: 'Facebook', color: 'hover:bg-blue-600' },
                              { id: 'wechat', icon: Share2, label: isEn ? 'WeChat (QR)' : '微信分享', color: 'hover:bg-green-600' },
                              { id: 'copy', icon: Link2, label: isEn ? 'Copy Link' : '复制链接', color: 'hover:bg-primary-hover' },
                            ].map(p => (
                              <button key={p.id} onClick={() => shareToPlatform(p.id)} className={cn("w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-muted-foreground hover:text-white rounded-xl transition-all", p.color)}>
                                <p.icon className="w-4 h-4" /> {p.label}
                                {p.id === 'copy' && copied && <CheckCircle2 className="w-3 h-3 text-white ml-auto" />}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Comment input */}
                  <div className="px-4 pb-4 flex items-center gap-2">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=User123" className="w-7 h-7 rounded-full border border-border shrink-0" alt="me" />
                    <div className="flex-1 flex items-center gap-2 bg-secondary rounded-full px-4 py-2">
                      <input
                        type="text"
                        value={newCommentText}
                        onChange={e => setNewCommentText(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleAddComment(); }}
                        placeholder={isEn ? 'Add a comment...' : '说点什么...'}
                        className="flex-1 bg-transparent text-sm text-stone-700 placeholder-stone-400 outline-none"
                      />
                      <button
                        onClick={handleAddComment}
                        disabled={!newCommentText.trim()}
                        className={cn("transition-colors shrink-0", newCommentText.trim() ? "text-amber-600 hover:text-amber-700" : "text-stone-300")}
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
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
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-2xl bg-card rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-border flex justify-between items-center bg-stone-50">
                <h3 className="text-xl font-serif font-bold text-foreground">{isEn ? 'New Observation' : '发布新观测记录'}</h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-muted rounded-full transition text-muted-foreground"><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6">
                <form id="post-form" onSubmit={handleSubmit} className="space-y-6">

                  {/* 🖼️ 本地传图区 */}
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">{isEn ? 'Observation Photo' : '观测照片上传'}</label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-48 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center bg-muted hover:bg-secondary cursor-pointer transition-all relative overflow-hidden group"
                    >
                      {newImgUrl ? (
                        <>
                          <img src={newImgUrl} className="w-full h-full object-cover" alt="preview" />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Upload className="text-white w-6 h-6" /></div>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-card rounded-full shadow-sm flex items-center justify-center mb-3 text-muted-foreground"><Upload className="w-6 h-6" /></div>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{isEn ? 'Select from your computer' : '从电脑本地文件夹选择图片'}</p>
                        </>
                      )}
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLocalUpload} />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{isEn ? 'Title' : '标题'}</label>
                    <input type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="..." className="w-full text-xl font-serif border-0 border-b border-border focus:border-amber-500 bg-transparent px-0 py-2 focus:ring-0 transition-all" />
                  </div>

                  {/* 🌿 15 个 Properties 选择器 */}
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center justify-between">
                      <span>{isEn ? 'Structural Properties (Max 3)' : '结构属性（最多3项）'}</span>
                      <span className="text-[10px] bg-secondary px-2 py-0.5 rounded">{selectedTags.length}/3</span>
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1 scrollbar-hide border border-border rounded-lg">
                      {PROPERTIES_TAGS.map(tag => {
                        const isSelected = selectedTags.some(t => t.en === tag.en);
                        return (
                          <button key={tag.en} type="button" onClick={() => toggleTag(tag)} className={cn("px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded border transition-all", isSelected ? "bg-primary text-primary-foreground border-stone-900 shadow-inner" : "bg-card text-muted-foreground border-border hover:border-amber-500 hover:text-amber-600")}>
                            {isEn ? tag.en : tag.zh}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{isEn ? 'Observation Summary' : '观测总结与感悟'}</label>
                    <textarea rows={3} value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="w-full text-sm bg-muted border border-border rounded-xl p-4 outline-none focus:ring-2 focus:ring-amber-500/20" />
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-border bg-muted flex justify-end gap-3">
                <button onClick={() => setIsCreateModalOpen(false)} className="px-6 py-2.5 text-xs font-bold text-muted-foreground">Cancel</button>
                <button type="submit" form="post-form" className="px-8 py-2.5 bg-primary text-primary-foreground rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-primary-hover transition-all shadow-lg active:scale-95">Publish</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}