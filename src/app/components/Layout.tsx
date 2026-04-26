import React, { useState, useRef } from "react";
import { Button, Input } from "@/app/components/ui";
import { 
  Search, Menu, X, Globe, User, Home, BookOpen, BarChart3, 
  PenTool, Layout as LayoutIcon, Library as LibraryIcon, 
  Users, ChevronUp, Settings, LogOut, ShieldCheck, Camera, Building, Upload
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/app/components/ui";
import { useLanguage } from "@/app/i18n/LanguageContext";

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

// ----------------------------------------------------------------------
// 💡 UserControl：支持真实换头像、默认灰色学术头像
// ----------------------------------------------------------------------
function UserControl({ isEn }: { isEn: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 登录状态
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    name: 'Researcher',
    org: 'MIT Architecture',
    // 💡 默认换成优雅的学术灰色图标
    avatar: '' 
  });

  // 🖼️ 处理图片上传逻辑
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative">
      {/* 侧边栏底部个人信息区 */}
      <div 
        onClick={() => isLoggedIn ? setIsMenuOpen(!isMenuOpen) : setIsLoginModalOpen(true)}
        className="rounded-md bg-stone-50/50 p-3 flex items-center gap-3 border border-stone-100/50 hover:bg-stone-100/80 transition-all cursor-pointer group"
      >
        <div className="relative shrink-0">
          <div className="h-8 w-8 rounded-full border border-stone-200 bg-stone-200 overflow-hidden flex items-center justify-center text-stone-500">
            {user.avatar ? (
              <img src={user.avatar} className="h-full w-full object-cover" alt="avatar" />
            ) : (
              <User className="h-4 w-4" />
            )}
          </div>
          {isLoggedIn && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />}
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="text-xs font-bold text-stone-900 truncate">
            {isLoggedIn ? user.name : (isEn ? 'Sign In' : '点击登录')}
          </div>
          <div className="text-[10px] text-stone-500 truncate">
            {isLoggedIn ? user.org : (isEn ? 'Guest Account' : '访客账号')}
          </div>
        </div>
        {isLoggedIn && <ChevronUp className={cn("w-3 h-3 text-stone-300 transition-transform", isMenuOpen && "rotate-180")} />}
      </div>

      {/* 弹出菜单 */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full left-0 mb-2 w-56 bg-white rounded-xl shadow-xl border border-stone-100 p-1.5 z-50"
            >
              <button 
                onClick={() => { setIsEditModalOpen(true); setIsMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-50 rounded-lg transition-colors"
              >
                <Settings className="w-3.5 h-3.5" /> {isEn ? 'Profile Settings' : '资料设置'}
              </button>
              <div className="h-px bg-stone-100 my-1" />
              <button 
                onClick={() => { setIsLoggedIn(false); setIsMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> {isEn ? 'Sign Out' : '退出登录'}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 登录弹窗 (保持逻辑) */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsLoginModalOpen(false)} className="absolute inset-0 bg-stone-900/40 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-10 text-center">
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6"><ShieldCheck className="w-7 h-7" /></div>
              <h2 className="text-xl font-serif font-bold text-stone-900 mb-2">{isEn ? 'Join the Movement' : '加入实证观测'}</h2>
              <div className="space-y-3 mt-8">
                <button onClick={() => { setIsLoggedIn(true); setIsLoginModalOpen(false); }} className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-stone-200 rounded-xl hover:bg-stone-50 transition-all font-bold text-xs">
                  <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="google" /> {isEn ? 'Continue with Google' : '使用 Google 登录'}
                </button>
                <button onClick={() => { setIsLoggedIn(true); setIsLoginModalOpen(false); }} className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-stone-900 text-white rounded-xl hover:bg-black transition-all font-bold text-xs shadow-lg">
                  <Globe className="w-4 h-4" /> {isEn ? 'Continue with GitHub' : '使用 GitHub 登录'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🔴 编辑资料弹窗 - 支持点击上传 */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditModalOpen(false)} className="absolute inset-0 bg-stone-900/40 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-lg font-serif font-bold text-stone-900">{isEn ? 'Profile Settings' : '个人资料设置'}</h2>
                <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-stone-100 rounded-full"><X className="w-4 h-4 text-stone-400" /></button>
              </div>

              {/* 头像上传区 */}
              <div className="flex flex-col items-center mb-8">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative group cursor-pointer"
                >
                  <div className="w-24 h-24 rounded-full border-4 border-stone-100 shadow-sm bg-stone-200 overflow-hidden flex items-center justify-center text-stone-400">
                    {user.avatar ? (
                      <img src={user.avatar} className="w-full h-full object-cover" alt="preview" />
                    ) : (
                      <User className="w-10 h-10" />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white w-6 h-6 mb-1" />
                    <span className="text-[8px] text-white font-bold uppercase tracking-wider">{isEn ? 'Upload' : '上传'}</span>
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleAvatarChange} 
                />
                <p className="mt-4 text-[10px] text-stone-400 font-bold uppercase tracking-[0.2em]">
                   {isEn ? 'Click avatar to change photo' : '点击头像更换照片'}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">{isEn ? 'Display Name' : '显示名称'}</label>
                  <input value={user.name} onChange={e => setUser({...user, name: e.target.value})} className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">{isEn ? 'Organization' : '所属机构'}</label>
                  <input value={user.org} onChange={e => setUser({...user, org: e.target.value})} className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm transition-all" />
                </div>
              </div>

              <button onClick={() => setIsEditModalOpen(false)} className="w-full mt-10 py-3.5 bg-stone-900 text-white rounded-xl font-bold text-xs hover:bg-black transition-all shadow-lg active:scale-[0.98]">
                {isEn ? 'Save Changes' : '保存所有修改'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ----------------------------------------------------------------------
// 💡 主 Layout 组件 (无变化，仅确保内部 UserControl 被正确调用)
// ----------------------------------------------------------------------
export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { trans, language, setLanguage } = useLanguage();
  const isEn = language === 'en';

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  const menuItems = [
    { id: "discover", label: trans.nav.discover, icon: Home },
    { id: "theory", label: trans.nav.theory, icon: BookOpen },
    { id: "analyze", label: trans.nav.analyze, icon: BarChart3 },
    { id: "construct", label: trans.nav.construct, icon: PenTool },
    { id: "practice", label: trans.nav.practice, icon: LayoutIcon },
    { id: "library", label: trans.nav.library, icon: LibraryIcon },
    { id: "community", label: language === 'zh' ? '社区' : 'Community', icon: Users },
  ];

  const studioTitle = language === 'zh' ? "活力结构工作室 v1.2" : "Living Structure Studio v1.2";

  React.useEffect(() => {
    document.title = studioTitle;
  }, [studioTitle]);

  return (
    <div className="flex h-[100dvh] w-full bg-[#FDFBF7] font-sans text-stone-900 selection:bg-stone-200 overflow-hidden relative">
      <div 
        className="pointer-events-none absolute inset-0 z-50 opacity-[0.03] mix-blend-multiply"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      {/* --- Sidebar --- */}
      <aside className="hidden w-64 flex-col border-r border-stone-200/60 bg-white/60 backdrop-blur-sm md:flex z-20 shadow-sm">
        <div className="flex h-16 items-center border-b border-stone-100/50 px-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate("discover")}>
            <div className="flex h-8 w-8 items-center justify-center rounded bg-stone-900 text-white shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-stone-900 font-serif">{isEn ? 'Living Structure' : '活力结构'}</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button onClick={() => onNavigate(item.id)} className={cn("flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all group", currentPage === item.id ? "bg-stone-900 text-white shadow-md" : "text-stone-500 hover:bg-stone-100 hover:text-stone-900 hover:scale-[1.02]")}>
                  <item.icon className={cn("h-4 w-4 transition-colors", currentPage === item.id ? "text-amber-400" : "text-stone-400 group-hover:text-amber-500")} />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-stone-100/50 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={toggleLanguage} className="h-8 px-2 text-xs font-medium text-stone-500 hover:text-stone-900">
              {language === 'en' ? '中文' : 'English'}
            </Button>
            <div className="text-xs text-stone-400 flex items-center gap-1"><Globe className="h-3 w-3" /> EN/ZH</div>
          </div>
          
          {/* 💡 调用 UserControl */}
          <UserControl isEn={isEn} />
        </div>
      </aside>

      {/* --- Main Area --- */}
      <div className="flex flex-1 flex-col overflow-hidden relative bg-[#FDFBF7]">
        <header className="flex h-14 items-center justify-between border-b border-stone-200 bg-white/90 backdrop-blur-md px-4 md:hidden z-30 relative shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-stone-900 text-white shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
            </div>
            <span className="font-bold text-stone-900">{isEn ? 'Living Structure' : '活力结构'}</span>
          </div>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-stone-600 hover:bg-stone-100 rounded-md active:scale-95 transition-transform">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="absolute inset-0 z-20 bg-white/98 backdrop-blur-md md:hidden overflow-y-auto">
              <div className="p-4 space-y-6 pt-20">
                <nav className="flex flex-col space-y-1">
                  {menuItems.map((item) => (
                    <button key={item.id} onClick={() => { onNavigate(item.id); setIsMenuOpen(false); }} className={cn("flex items-center gap-3 rounded-md px-3 py-3 text-base font-medium transition-colors", currentPage === item.id ? "bg-stone-100 text-stone-900" : "text-stone-600 hover:bg-stone-50")}>
                      <item.icon className="h-5 w-5 text-stone-400" />
                      {item.label}
                    </button>
                  ))}
                </nav>

                <div className="border-t border-stone-100 mt-6 pt-6 space-y-6">
                  <div className="flex items-center justify-between px-3">
                    <Button variant="ghost" size="sm" onClick={toggleLanguage} className="h-8 px-4 py-2 border border-stone-200 rounded-full text-sm font-bold text-stone-600 hover:bg-stone-100 transition-colors shadow-sm active:scale-95">
                      {language === 'en' ? '切换至中文' : 'Switch to English'}
                    </Button>
                    <div className="text-xs font-bold text-stone-400 flex items-center gap-1"><Globe className="h-4 w-4" /> EN/ZH</div>
                  </div>
                  
                  <div className="px-3">
                     <UserControl isEn={isEn} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
          <div className="hidden md:flex h-14 items-center justify-between border-b border-stone-200/50 bg-white/40 backdrop-blur px-8 sticky top-0 z-10">
            <div className="flex items-center text-xs text-stone-400 gap-2">
              <span className="font-medium text-stone-500 uppercase tracking-wider">{currentPage}</span>
              <span>/</span>
              <span>{studioTitle}</span>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2 h-4 w-4 text-stone-400" />
              <input className="h-8 w-full rounded-md border-none bg-stone-100/50 pl-9 text-xs focus:ring-1 focus:ring-stone-300 placeholder:text-stone-400" placeholder={trans.nav.searchPlaceholder} />
            </div>
          </div>
          
          <div className="min-h-full w-full flex-1 relative z-0 flex flex-col">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}