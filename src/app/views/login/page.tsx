"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, User, Hexagon, Quote } from 'lucide-react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex bg-[#FDFBF7] text-stone-900 font-sans">
      
      {/* ================= 左侧：品牌与视觉展示区 (桌面端可见) ================= */}
      <div className="hidden lg:flex lg:w-1/2 bg-stone-900 text-stone-50 p-16 flex-col justify-between relative overflow-hidden">
        {/* 背景装饰：生命结构抽象网格/分形隐喻 */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
           <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
             <defs>
               <pattern id="living-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                 <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
               </pattern>
             </defs>
             <rect width="100%" height="100%" fill="url(#living-grid)" />
           </svg>
           {/* 你可以在这里放一张曼德勃罗集的暗色背景图 */}
           <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-[120px]" />
           <div className="absolute bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[150px]" />
        </div>

        {/* 左侧 Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Hexagon className="w-8 h-8 text-amber-500" />
            <span className="font-serif font-bold text-2xl tracking-tight">Living Structure</span>
          </div>
          <p className="text-stone-400 font-mono text-sm tracking-widest uppercase">Global Research Community</p>
        </div>

        {/* 左侧名言区 */}
        <div className="relative z-10 max-w-lg">
          <Quote className="w-10 h-10 text-stone-700 mb-6" />
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login-quote' : 'signup-quote'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-serif leading-snug mb-6">
                {isLogin 
                  ? "Welcome back to the mirror of the self." 
                  : "Join the largest collective experiment on structural beauty."}
              </h2>
              <p className="text-stone-400 leading-relaxed text-sm">
                {isLogin
                  ? "Log in to view your generative designs, structural analysis history, and continue contributing to the global map of living structures."
                  : "Create an account to save your L=S×H calculations, generate fractal structures, and share your discoveries with researchers worldwide."}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 左侧 Footer */}
        <div className="relative z-10 text-xs text-stone-500 font-mono">
          © 2026 Guangzhou Academy of Fine Arts & HKUST(GZ) Lab
        </div>
      </div>

      {/* ================= 右侧：交互表单区 ================= */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative">
        <div className="w-full max-w-md">
          
          {/* 移动端 Logo (仅在手机屏幕显示) */}
          <div className="lg:hidden flex items-center gap-3 mb-12">
            <Hexagon className="w-8 h-8 text-amber-500" />
            <span className="font-serif font-bold text-2xl tracking-tight">Living Structure</span>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-bold font-serif text-stone-900 mb-2">
              {isLogin ? 'Sign In' : 'Create Account'}
            </h1>
            <p className="text-stone-500 text-sm">
              {isLogin 
                ? 'Enter your email and password to access your dashboard.' 
                : 'Enter your details to join the research community.'}
            </p>
          </div>

          {/* 表单主体 */}
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            
            {/* 注册时特有的用户名输入框 */}
            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-1 mb-5">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Username</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-stone-400" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="e.g. Architect_01" 
                        className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-md text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-stone-400" />
                </div>
                <input 
                  type="email" 
                  placeholder="you@example.com" 
                  className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-md text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Password</label>
                {isLogin && <a href="#" className="text-xs text-amber-600 hover:text-amber-700 font-medium">Forgot password?</a>}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-stone-400" />
                </div>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-md text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
              </div>
            </div>

            <button className="w-full bg-stone-900 hover:bg-stone-800 text-white py-3 rounded-md text-sm font-bold flex items-center justify-center gap-2 transition-all mt-6 group">
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* 分割线 */}
          <div className="mt-8 relative flex items-center">
            <div className="flex-grow border-t border-stone-200"></div>
            <span className="flex-shrink-0 mx-4 text-stone-400 text-xs uppercase tracking-widest">Or continue with</span>
            <div className="flex-grow border-t border-stone-200"></div>
          </div>

          {/* 第三方登录按钮 */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-2.5 bg-white border border-stone-200 rounded-md text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/></svg>
              GitHub
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 bg-white border border-stone-200 rounded-md text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"/></svg>
              Google
            </button>
          </div>

          {/* 切换模式 */}
          <p className="text-center text-sm text-stone-500 mt-10">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-amber-600 font-bold hover:text-amber-700 hover:underline transition-all"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}