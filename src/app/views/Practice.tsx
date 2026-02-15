import React, { useState } from "react";
import { Button, Card } from "@/app/components/ui";
import { Play, Pause, Activity, Wind, Circle } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "@/app/i18n/LanguageContext";

export function Practice() {
  const { trans } = useLanguage();

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="mx-auto max-w-5xl space-y-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-stone-900">{trans.practice.title}</h1>
          <p className="mt-4 text-stone-600 max-w-2xl mx-auto">
            {trans.practice.subtitle}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Module 1: Visual Breathing */}
          <Card className="p-8 flex flex-col items-center justify-center bg-white min-h-[400px]">
            <div className="mb-6 flex items-center gap-2 text-stone-500">
              <Wind className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-widest">{trans.practice.breathing}</span>
            </div>
            
            <BreathingCircle />
            
            <p className="mt-8 text-center text-sm text-stone-500 max-w-xs">
              {trans.practice.breathingInstruction}
            </p>
          </Card>

          <div className="space-y-8">
            {/* Module 2: Spatial Awareness */}
            <Card className="p-8 bg-white hover:border-teal-200 transition-colors cursor-pointer">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-stone-900">{trans.practice.awareness}</h3>
                  <p className="mt-2 text-sm text-stone-600">
                    {trans.practice.awarenessDesc}
                  </p>
                </div>
                <div className="rounded-full bg-stone-100 p-3 text-stone-600">
                  <Play className="h-5 w-5 ml-0.5" />
                </div>
              </div>
            </Card>

            {/* Module 3: Vitality Log */}
            <Card className="p-8 bg-white">
               <div className="flex items-center gap-2 mb-6">
                 <Activity className="h-5 w-5 text-teal-600" />
                 <h3 className="font-semibold text-stone-900">{trans.practice.log}</h3>
               </div>
               <div className="space-y-4">
                 <div className="flex justify-between text-xs text-stone-500">
                   <span>{trans.practice.today}</span>
                   <span>Feb 03, 2026</span>
                 </div>
                 <textarea 
                   className="w-full rounded-md border border-stone-200 p-3 text-sm focus:border-stone-400 focus:outline-none min-h-[100px]"
                   placeholder={trans.practice.logPlaceholder}
                 />
                 <Button className="w-full bg-stone-900">{trans.practice.saveEntry}</Button>
               </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function BreathingCircle() {
  const [isActive, setIsActive] = useState(false);
  const { trans } = useLanguage();

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative flex items-center justify-center h-48 w-48">
        <motion.div
          className="absolute inset-0 rounded-full bg-teal-100"
          animate={isActive ? { scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] } : { scale: 1 }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-4 rounded-full bg-teal-200"
          animate={isActive ? { scale: [1, 1.2, 1], opacity: [0.6, 0.3, 0.6] } : { scale: 1 }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
         <motion.div
          className="relative h-24 w-24 rounded-full bg-teal-600 shadow-lg flex items-center justify-center text-white cursor-pointer hover:bg-teal-700 transition-colors"
          onClick={() => setIsActive(!isActive)}
        >
          {isActive ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
        </motion.div>
      </div>
      <div className="mt-4 text-sm font-medium text-stone-900">
        {isActive ? trans.practice.breatheAction : trans.practice.startSession}
      </div>
    </div>
  );
}
