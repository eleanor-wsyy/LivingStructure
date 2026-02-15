import React from "react";
import { Button, Card, Badge } from "@/app/components/ui";
import { ArrowRight, Sparkles, Quote, User, Activity } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "@/app/i18n/LanguageContext";

interface DiscoverProps {
  onNavigate: (page: string) => void;
}

export function Discover({ onNavigate }: DiscoverProps) {
  const { trans } = useLanguage();

  return (
    <div className="space-y-24 pb-24">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-stone-50 px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold tracking-tight text-stone-900 sm:text-6xl lg:text-7xl">
              {trans.discover.title} <span className="text-stone-500 font-serif italic">{trans.discover.titleHighlight}</span> {trans.discover.titleSuffix}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl leading-8 text-stone-600">
              {trans.discover.subtitle}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button 
                size="lg" 
                className="h-12 min-w-[160px] bg-stone-900 text-lg hover:bg-stone-800"
                onClick={() => onNavigate("analyze")}
              >
                {trans.discover.ctaAnalyze}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="h-12 min-w-[160px] text-lg hover:bg-stone-100"
                onClick={() => onNavigate("theory")}
              >
                {trans.discover.ctaTheory}
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Background Texture */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] opacity-40"></div>
      </section>

      {/* 2. Today's Focus */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-teal-600">{trans.discover.dailyInsight}</span>
            <h2 className="mt-2 text-3xl font-bold text-stone-900">{trans.theory.attributes[1].name}</h2>
          </div>
          <Button variant="ghost" onClick={() => onNavigate("theory")}>{trans.discover.viewAll} <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Visual Comparison */}
          <Card className="overflow-hidden border-stone-200 bg-white">
            <div className="grid grid-cols-2 h-64 md:h-80">
              <div className="relative group">
                <img 
                  src="https://images.unsplash.com/photo-1758552396011-1610e8a4c1c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW9wbGUlMjB3YWxraW5nJTIwaW4lMjBwYXJrJTIwYWVyaWFsJTIwdmlld3xlbnwxfHx8fDE3NzAwODQ0OTB8MA&ixlib=rb-4.1.0&q=80&w=1080" 
                  alt="High Vitality" 
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors" />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 text-xs font-semibold text-teal-800 rounded-full">
                  {trans.theory.high} {trans.discover.titleHighlight}
                </div>
              </div>
              <div className="relative group">
                <img 
                  src="https://images.unsplash.com/photo-1712697236445-fad56534129e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmFsJTIwc2tldGNoJTIwdXJiYW4lMjBwbGFubmluZyUyMGRldGFpbHxlbnwxfHx8fDE3NzAwODQ0OTF8MA&ixlib=rb-4.1.0&q=80&w=1080" 
                  alt="Low Vitality" 
                  className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                />
                 <div className="absolute bottom-4 left-4 bg-stone-100/90 backdrop-blur px-3 py-1 text-xs font-semibold text-stone-600 rounded-full">
                  Structural
                </div>
              </div>
            </div>
          </Card>

          {/* Explanation */}
          <div className="flex flex-col justify-center space-y-6 lg:pl-8">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-teal-100 p-2 text-teal-700">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-stone-900">{trans.discover.aiInterpretation}</h3>
                <p className="mt-2 text-stone-600 leading-relaxed">
                  {trans.theory.content.levelsOfScale.interpretation}
                </p>
              </div>
            </div>
            <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
              <div className="mb-2 text-xs font-semibold uppercase text-stone-500">{trans.discover.keyMetric}</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-stone-900">2.718</span>
                <span className="text-sm text-stone-500">{trans.theory.content.levelsOfScale.metric}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Research */}
      <section className="bg-stone-100 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Quote className="h-12 w-12 text-stone-300" />
              <blockquote className="mt-6 text-2xl font-medium leading-relaxed text-stone-900">
                "A living structure is not merely a metaphor. It is a definable, mathematical quality of space that directly impacts human biological wellbeing."
              </blockquote>
              <div className="mt-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-stone-300 overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1760121788536-9797394e210e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzb3IlMjBsZWN0dXJpbmclMjB1bml2ZXJzaXR5JTIwYXVkaXRvcml1bSUyMGJsYWNrJTIwYW5kJTIwd2hpdGV8ZW58MXx8fHwxNzcwMDg0NDkxfDA&ixlib=rb-4.1.0&q=80&w=1080" alt="Professor" className="h-full w-full object-cover" />
                </div>
                <div>
                  <div className="font-semibold text-stone-900">Prof. Jiang Bin</div>
                  <div className="text-sm text-stone-500">University of Gävle, Sweden</div>
                </div>
              </div>
            </div>

            <Card className="group relative overflow-hidden bg-white hover:shadow-lg transition-all">
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-1/3 bg-stone-200">
                   <img src="https://images.unsplash.com/photo-1727522974631-c8779e7de5d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmFsJTIwc2tldGNoJTIwYmx1ZXByaW50JTIwdGVjaG5pY2FsJTIwZHJhd2luZyUyMG1pbmltYWx8ZW58MXx8fHwxNzcwMDg0MDE2fDA&ixlib=rb-4.1.0&q=80&w=1080" alt="Book Cover" className="h-full w-full object-cover" />
                </div>
                <div className="p-6 sm:w-2/3">
                  <div className="mb-2 text-xs font-semibold text-teal-600">{trans.discover.featuredResearch}</div>
                  <h3 className="text-xl font-bold text-stone-900">The Geometry of Environment</h3>
                  <p className="mt-2 text-sm text-stone-600">
                    An introduction to spatial order through the lens of recent complexity science discoveries.
                  </p>
                  <Button variant="outline" size="sm" className="mt-6" onClick={() => onNavigate("library")}>{trans.discover.readAbstract}</Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. Community Highlights */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-stone-900">{trans.discover.communityAnalysis}</h2>
          <p className="mt-4 text-stone-600">{trans.discover.communitySubtitle}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: "Kyoto Temple Garden", score: 92, type: "Restorative" },
            { title: "Brutalist Civic Center", score: 45, type: "Stressful" },
            { title: "Venetian Plaza", score: 88, type: "Vibrant" },
          ].map((item, i) => (
            <Card key={i} className="bg-white p-6 hover:border-teal-200 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-stone-500 text-sm">
                  <User className="h-4 w-4" />
                  <span>Anonymous Researcher</span>
                </div>
                <Badge variant="outline">{item.type}</Badge>
              </div>
              <h3 className="font-semibold text-lg text-stone-900">{item.title}</h3>
              
              <div className="mt-6 flex items-center justify-between">
                <div className="text-xs text-stone-500">{trans.discover.vitalityScore}</div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-teal-600" />
                  <span className={`text-2xl font-bold ${item.score > 80 ? 'text-teal-700' : 'text-stone-400'}`}>
                    {item.score}
                  </span>
                </div>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-stone-100">
                <div 
                  className={`h-full rounded-full ${item.score > 80 ? 'bg-teal-500' : 'bg-stone-300'}`} 
                  style={{ width: `${item.score}%` }} 
                />
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
