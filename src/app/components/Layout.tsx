import React, { useState } from "react";
import { Button, Input } from "@/app/components/ui";
import { Search, Menu, X, Globe, User, Home, BookOpen, BarChart3, PenTool, Layout as LayoutIcon, Library as LibraryIcon, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/app/components/ui";
import { useLanguage } from "@/app/i18n/LanguageContext";

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { trans, language, setLanguage } = useLanguage();

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
    
  ];

  const appTitle = language === 'zh' ? "活力结构" : "Living Structure";
  const studioTitle = language === 'zh' ? "活力结构工作室 v1.2" : "Living Structure Studio v1.2";

  React.useEffect(() => {
    document.title = studioTitle;
  }, [studioTitle]);

  return (
    <div className="flex h-screen bg-[#FDFBF7] font-sans text-stone-900 selection:bg-stone-200 overflow-hidden relative">
      
      {/* Texture Overlay */}
      <div 
        className="pointer-events-none absolute inset-0 z-50 opacity-[0.03] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* --- Sidebar (Desktop) --- */}
      <aside className="hidden w-64 flex-col border-r border-stone-200/60 bg-white/60 backdrop-blur-sm md:flex z-20 shadow-sm">
        {/* Brand */}
        <div className="flex h-16 items-center border-b border-stone-100/50 px-6">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate("discover")}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded bg-stone-900 text-white shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-stone-900 font-serif">
              {appTitle}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    currentPage === item.id 
                      ? "bg-stone-100/80 text-stone-900" 
                      : "text-stone-500 hover:bg-stone-50/80 hover:text-stone-900"
                  )}
                >
                  <item.icon className={cn("h-4 w-4", currentPage === item.id ? "text-stone-900" : "text-stone-400")} />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer / User / Lang */}
        <div className="border-t border-stone-100/50 p-4 space-y-4">
           <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleLanguage}
                className="h-8 px-2 text-xs font-medium text-stone-500 hover:text-stone-900"
              >
                {language === 'en' ? '中文' : 'English'}
              </Button>
               <div className="text-xs text-stone-400 flex items-center gap-1">
                 <Globe className="h-3 w-3" /> EN/ZH
               </div>
           </div>
           
           <div className="rounded-md bg-stone-50/50 p-3 flex items-center gap-3 border border-stone-100/50">
             <div className="h-8 w-8 rounded-full bg-stone-200 flex items-center justify-center text-stone-500">
               <User className="h-4 w-4" />
             </div>
             <div className="flex-1 overflow-hidden">
               <div className="text-xs font-medium text-stone-900 truncate">Researcher</div>
               <div className="text-[10px] text-stone-500 truncate">MIT Architecture</div>
             </div>
           </div>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <div className="flex flex-1 flex-col overflow-hidden relative bg-[#FDFBF7]">
        {/* Mobile Header */}
        <header className="flex h-14 items-center justify-between border-b border-stone-200 bg-white/80 backdrop-blur px-4 md:hidden z-30 relative">
          <div className="flex items-center gap-2">
             <div className="flex h-6 w-6 items-center justify-center rounded bg-stone-900 text-white">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="font-bold text-stone-900">{appTitle}</span>
          </div>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-stone-500 hover:bg-stone-100 rounded-md"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm md:hidden overflow-y-auto"
            >
              <div className="p-4 space-y-6 pt-20">
                <Input placeholder={trans.nav.searchPlaceholder} className="mb-6" />
                <nav className="flex flex-col space-y-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { onNavigate(item.id); setIsMenuOpen(false); }}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-3 text-base font-medium transition-colors",
                        currentPage === item.id ? "bg-stone-100 text-stone-900" : "text-stone-600 hover:bg-stone-50"
                      )}
                    >
                      <item.icon className="h-5 w-5 text-stone-400" />
                      {item.label}
                    </button>
                  ))}
                </nav>
                <div className="border-t border-stone-100 pt-6">
                  <Button 
                      variant="outline" 
                      onClick={toggleLanguage}
                      className="w-full justify-center mb-4"
                    >
                      {language === 'en' ? 'Switch to 中文' : 'Switch to English'}
                  </Button>
                  <Button className="w-full justify-center">{trans.nav.signIn}</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
           {/* Top Search Bar (Desktop only essentially, but keeping clean) */}
           <div className="hidden md:flex h-14 items-center justify-between border-b border-stone-200/50 bg-white/40 backdrop-blur px-8 sticky top-0 z-10">
              <div className="flex items-center text-xs text-stone-400 gap-2">
                <span className="font-medium text-stone-500 uppercase tracking-wider">{currentPage}</span>
                <span>/</span>
                <span>{studioTitle}</span>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2 h-4 w-4 text-stone-400" />
                <input 
                  className="h-8 w-full rounded-md border-none bg-stone-100/50 pl-8 text-xs focus:ring-1 focus:ring-stone-300 placeholder:text-stone-400" 
                  placeholder={trans.nav.searchPlaceholder} 
                />
              </div>
           </div>
           
           <div className="h-full relative z-0">
             {children}
           </div>
        </main>
      </div>
    </div>
  );
}
