import React from "react";
import { motion } from "motion/react";

export function AnalysisPreview() {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-stone-900">
      <img 
        src="https://images.unsplash.com/photo-1758552396011-1610e8a4c1c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW9wbGUlMjB3YWxraW5nJTIwaW4lMjBwYXJrJTIwYWVyaWFsJTIwdmlld3xlbnwxfHx8fDE3NzAwODQ0OTB8MA&ixlib=rb-4.1.0&q=80&w=1080" 
        alt="Analysis Target" 
        className="h-full w-full object-cover opacity-50"
      />
      
      {/* Overlay of detection boxes/lines */}
      <svg className="absolute inset-0 h-full w-full">
        <motion.rect 
          x="20%" y="20%" width="30%" height="40%" 
          fill="none" stroke="rgba(20, 184, 166, 0.8)" strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
        <motion.circle 
          cx="60%" cy="40%" r="50" 
          fill="none" stroke="rgba(20, 184, 166, 0.6)" strokeWidth="1"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        />
        <motion.line 
          x1="35%" y1="60%" x2="60%" y2="40%" 
          stroke="rgba(20, 184, 166, 0.4)" strokeWidth="1"
          strokeDasharray="4 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        />
      </svg>
      
      <div className="absolute top-4 right-4 flex flex-col gap-2">
         <div className="bg-teal-900/80 backdrop-blur px-2 py-1 text-xs text-teal-100 rounded border border-teal-700/50 font-mono">
           D=1.65
         </div>
         <div className="bg-teal-900/80 backdrop-blur px-2 py-1 text-xs text-teal-100 rounded border border-teal-700/50 font-mono">
           H-Index: 0.82
         </div>
      </div>
    </div>
  );
}
