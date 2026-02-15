import React, { useState, useEffect } from "react";
import { Button, Card, cn } from "@/app/components/ui";
import { Upload, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { AnalysisPreview } from "@/app/components/AnalysisPreview";
import { useLanguage } from "@/app/i18n/LanguageContext";

export function Analyze() {
  const [step, setStep] = useState<"upload" | "processing" | "results">("upload");
  const { trans } = useLanguage();

  useEffect(() => {
    if (step === "processing") {
      const timer = setTimeout(() => {
        setStep("results");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        
        {/* Step Indicator */}
        <div className="mb-12 flex justify-center">
          <div className="flex items-center gap-4 text-sm font-medium">
             <StepItem current={step} target="upload" number={1} label={trans.analyze.step1} />
             <div className="h-px w-12 bg-stone-300" />
             <StepItem current={step} target="processing" number={2} label={trans.analyze.step2} />
             <div className="h-px w-12 bg-stone-300" />
             <StepItem current={step} target="results" number={3} label={trans.analyze.step3} />
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[600px]">
          {step === "upload" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex h-[500px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-300 bg-white p-12 text-center transition-colors hover:border-teal-500 hover:bg-stone-50/50"
            >
              <div className="mb-6 rounded-full bg-stone-100 p-6">
                <Upload className="h-10 w-10 text-stone-400" />
              </div>
              <h2 className="text-xl font-semibold text-stone-900">{trans.analyze.uploadTitle}</h2>
              <p className="mt-2 max-w-sm text-stone-500">
                {trans.analyze.uploadDesc}
              </p>
              <Button 
                className="mt-8 bg-stone-900" 
                onClick={() => setStep("processing")}
              >
                {trans.analyze.selectFile}
              </Button>
            </motion.div>
          )}

          {step === "processing" && (
            <div className="flex h-[500px] flex-col items-center justify-center text-center">
              <div className="relative mb-8 h-24 w-24">
                 <div className="absolute inset-0 rounded-full border-4 border-stone-200" />
                 <motion.div 
                   className="absolute inset-0 rounded-full border-4 border-teal-600 border-t-transparent"
                   animate={{ rotate: 360 }}
                   transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                 />
                 <div className="absolute inset-0 flex items-center justify-center">
                   <Loader2 className="h-8 w-8 text-teal-600 animate-pulse" />
                 </div>
              </div>
              <h2 className="text-xl font-semibold text-stone-900">{trans.analyze.analyzingTitle}</h2>
              <p className="mt-2 text-stone-500">{trans.analyze.analyzingDesc}</p>
              
              <div className="mt-8 w-full max-w-md space-y-2 text-xs text-stone-400 font-mono text-left">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>{trans.analyze.logs.preprocessing}</motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>{trans.analyze.logs.fractal}</motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }}>{trans.analyze.logs.mapped}</motion.div>
              </div>
            </div>
          )}

          {step === "results" && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-8 lg:grid-cols-3"
            >
              {/* Main Visual Result */}
              <div className="lg:col-span-2 space-y-6">
                <AnalysisPreview />
                <div className="rounded-xl border border-stone-200 bg-white p-6">
                  <h3 className="font-semibold text-stone-900 mb-4">{trans.analyze.insightTitle}</h3>
                  <p className="text-stone-600 leading-relaxed">
                    {trans.analyze.insightText}
                  </p>
                </div>
              </div>

              {/* Sidebar Metrics */}
              <div className="space-y-6">
                {/* Total Score */}
                <Card className="bg-stone-900 text-white border-stone-800">
                  <div className="p-6 text-center">
                    <div className="text-sm font-medium text-stone-400 uppercase tracking-widest">{trans.analyze.scoreLabel}</div>
                    <div className="mt-4 flex items-center justify-center text-6xl font-bold tracking-tighter text-teal-400">
                      84
                      <span className="text-xl text-stone-500 font-normal ml-2">/100</span>
                    </div>
                    <div className="mt-4 text-xs text-stone-500 font-mono">{trans.analyze.formula}</div>
                  </div>
                </Card>

                {/* Detailed Breakdown */}
                <Card className="bg-white">
                  <div className="p-4 border-b border-stone-100 font-semibold text-stone-900">{trans.analyze.breakdown}</div>
                  <div className="p-4 space-y-4">
                    <ScoreRow label={trans.theory.attributes[1].name} score={6.5} />
                    <ScoreRow label={trans.theory.attributes[2].name} score={9.0} />
                    <ScoreRow label={trans.theory.attributes[3].name} score={8.2} />
                    <ScoreRow label={trans.theory.attributes[7].name} score={7.8} />
                    <ScoreRow label={trans.theory.attributes[9].name} score={5.4} />
                  </div>
                  <div className="p-4 bg-stone-50 border-t border-stone-100 text-center">
                    <Button variant="outline" size="sm" className="w-full">{trans.analyze.downloadReport}</Button>
                  </div>
                </Card>

                 <Button variant="ghost" className="w-full" onClick={() => setStep("upload")}>{trans.analyze.analyzeAnother}</Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function StepItem({ current, target, number, label }: { current: string, target: string, number: number, label: string }) {
  const isActive = current === target;
  
  // Logic to determine completion for UI
  const isCompleted = (current === "processing" && target === "upload") || (current === "results" && target !== "results");

  return (
    <div className={cn("flex items-center gap-2", isActive ? "text-stone-900" : "text-stone-400")}>
      <div className={cn(
        "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
        isActive ? "bg-stone-900 text-white" : "bg-stone-200 text-stone-500"
      )}>
        {number}
      </div>
      <span>{label}</span>
    </div>
  );
}

function ScoreRow({ label, score }: { label: string, score: number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-stone-600 truncate max-w-[150px]" title={label}>{label}</span>
      <div className="flex items-center gap-3">
        <div className="h-2 w-24 rounded-full bg-stone-100 overflow-hidden">
          <div className="h-full bg-teal-600 rounded-full" style={{ width: `${score * 10}%` }} />
        </div>
        <span className="font-mono font-medium text-stone-900 w-6 text-right">{score}</span>
      </div>
    </div>
  );
}
