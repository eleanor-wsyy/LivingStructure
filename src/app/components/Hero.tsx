import React from "react";
import { Button, Input } from "@/app/components/ui";
import { Search, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-stone-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
          Quantifying the <span className="text-stone-500">Living Structure</span> of Space
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-stone-600">
          An open-source platform for measuring architectural vitality.
          Combining network science, fractal geometry, and biophilic design principles to create healing environments.
        </p>
        
        <div className="mx-auto mt-10 max-w-xl">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Sparkles className="h-5 w-5 text-teal-600" />
            </div>
            <Input
              type="text"
              placeholder="Analyze a space, search theory, or browse patterns..."
              className="h-14 rounded-full border-stone-200 bg-white pl-12 pr-32 text-base shadow-sm ring-1 ring-stone-900/5 focus:ring-2 focus:ring-teal-600"
            />
            <div className="absolute inset-y-1.5 right-1.5">
              <Button size="lg" className="h-full rounded-full bg-stone-900 px-6 hover:bg-stone-800">
                Analyze
              </Button>
            </div>
          </div>
          <div className="mt-4 flex justify-center gap-4 text-xs text-stone-500">
            <span>Popular:</span>
            <a href="#" className="underline hover:text-stone-900">Healing Gardens</a>
            <a href="#" className="underline hover:text-stone-900">Urban Plazas</a>
            <a href="#" className="underline hover:text-stone-900">Hospital Wards</a>
          </div>
        </div>
      </div>
      
      {/* Background subtle texture/pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50"></div>
    </section>
  );
}
