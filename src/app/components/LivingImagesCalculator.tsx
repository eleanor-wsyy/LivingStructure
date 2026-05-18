import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, ScanEye, Calculator, ChevronRight, Activity, Image as ImageIcon } from 'lucide-react';
import { Button, Card, Badge } from '@/app/components/ui';
import { computeLivingImages, ComputationResult, Substructure } from '@/app/lib/livingImagesAlg';

export function LivingImagesCalculator() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<ComputationResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const MAX_DIMENSION = 300; // Resize image for fast JS computation

  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      setResult(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  React.useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = Array.from(e.clipboardData?.items || []);
      const imageItem = items.find(it => it.type.startsWith('image/'));
      if (imageItem) {
        // e.preventDefault();
        const file = imageItem.getAsFile();
        if (file) processFile(file);
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  React.useEffect(() => {
    if (imageSrc) {
      // Need a tiny timeout to ensure canvas is mounted if it just switched state
      setTimeout(() => drawToCanvas(imageSrc), 50);
    }
  }, [imageSrc]);

  const drawToCanvas = (url: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Calculate scale to fit MAX_DIMENSION
      const scale = Math.min(MAX_DIMENSION / img.width, MAX_DIMENSION / img.height);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);

      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);
    };
    img.src = url;
  };

  const drawSubstructures = (subs: Substructure[], ctx: CanvasRenderingContext2D) => {
    // Draw bounding boxes for root substructures
    ctx.lineWidth = 1;
    for (const sub of subs) {
      if (sub.area < 10) continue;
      ctx.strokeStyle = `hsla(${Math.random() * 360}, 100%, 50%, 0.7)`;
      ctx.strokeRect(
        sub.boundingBox.minX,
        sub.boundingBox.minY,
        sub.boundingBox.maxX - sub.boundingBox.minX,
        sub.boundingBox.maxY - sub.boundingBox.minY
      );
      
      // Draw centroid
      ctx.fillStyle = ctx.strokeStyle;
      ctx.beginPath();
      ctx.arc(sub.centroid.x, sub.centroid.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const runCalculation = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsCalculating(true);
    setResult(null);
    setProgress(10);

    // Give UI time to update loading state
    await new Promise(r => setTimeout(r, 100));

    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setProgress(40);
      
      // Allow UI update
      await new Promise(r => setTimeout(r, 50));

      const res = await computeLivingImages(imgData, 6); // Max depth 6
      setResult(res);
      setProgress(100);

      // Visualize
      drawSubstructures(res.rootSubstructures, ctx);
      
    } catch (e) {
      console.error(e);
      alert('Computation failed. Image might be too complex or there is an error.');
    } finally {
      setIsCalculating(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <Card className="p-8 border border-border shadow-xl rounded-3xl overflow-hidden relative bg-card">
      <div className="absolute top-0 left-0 w-full h-1 bg-secondary">
        <motion.div 
          className="h-full bg-teal-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Left: Input & Canvas */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-serif font-bold text-foreground">Living Images Calculator</h3>
              <p className="text-sm text-muted-foreground mt-1">
                L = S × H &nbsp; | &nbsp; Recursive Substructure Dichotomy
              </p>
            </div>
            <Badge variant="outline" className="border-teal-500 text-teal-600 bg-teal-50">Local Compute</Badge>
          </div>

          <div 
            className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all bg-secondary/50 relative overflow-hidden ${
              isDraggingOver ? 'border-teal-500 bg-teal-50/40 scale-[1.01]' : 
              (!imageSrc ? 'h-64 border-stone-300 hover:border-teal-400 cursor-pointer' : 'border-transparent p-4')
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
            onDragLeave={() => setIsDraggingOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingOver(false);
              const file = e.dataTransfer.files[0];
              if (file) processFile(file);
            }}
            onClick={() => !imageSrc && fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
            />
            
            {!imageSrc ? (
              <div className="text-center p-6 pointer-events-none">
                <Upload className="w-10 h-10 text-stone-400 mx-auto mb-4" />
                <p className="text-sm font-bold text-stone-600">Click, Drop, or Paste (Ctrl+V) an Image</p>
                <p className="text-xs text-stone-400 mt-2">Will be scaled down to ~300px for real-time JS computation.</p>
              </div>
            ) : (
              <div className="relative">
                <canvas 
                  ref={canvasRef} 
                  className="rounded-xl shadow-md bg-white mx-auto max-w-full"
                />
                {isCalculating && (
                  <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl">
                    <Activity className="w-10 h-10 text-teal-400 animate-pulse mb-3" />
                    <p className="text-teal-400 font-mono text-sm tracking-widest uppercase">Computing Wholeness...</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {imageSrc && (
            <div className="flex gap-4">
              <Button 
                onClick={runCalculation} 
                disabled={isCalculating}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white shadow-lg"
              >
                {isCalculating ? 'Computing...' : 'Calculate Structural Beauty'} <Calculator className="ml-2 w-4 h-4" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isCalculating}
              >
                Change Image
              </Button>
            </div>
          )}
        </div>

        {/* Right: Results Dashboard */}
        <div className="w-full md:w-80 bg-stone-50 border border-border rounded-2xl p-6 flex flex-col">
          <h4 className="text-sm uppercase tracking-widest font-bold text-stone-500 mb-6 flex items-center gap-2">
            <ScanEye className="w-4 h-4" /> Analysis Report
          </h4>

          {result ? (
            <div className="space-y-6 flex-1">
              {/* L-Score */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 relative overflow-hidden">
                <div className="absolute right-0 top-0 h-full w-1 bg-teal-500" />
                <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-1">Base Livingness (L)</p>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-serif font-bold text-teal-700">{result.L}</span>
                  <span className="text-sm text-stone-500 mb-1 font-mono">= S×H</span>
                </div>
              </div>

              {/* LR-Score */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 relative overflow-hidden">
                <div className="absolute right-0 top-0 h-full w-1 bg-amber-500" />
                <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-1">Recursive Beauty (LR)</p>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-serif font-bold text-amber-600">{result.LR}</span>
                  <span className="text-sm text-stone-500 mb-1 font-mono">Σ(S_i × H_i)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-stone-200 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-1">Substructures (S)</p>
                  <p className="text-xl font-bold text-stone-700">{result.S}</p>
                </div>
                <div className="bg-white p-3 rounded-xl shadow-sm border border-stone-200 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-1">Hierarchy (H)</p>
                  <p className="text-xl font-bold text-stone-700">{result.H}</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200">
                <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-2">Decomposition Metrics</p>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-stone-500">Decomposable Nodes (D)</span>
                  <span className="font-bold text-stone-700">{result.D}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-stone-500">Max Depth (I)</span>
                  <span className="font-bold text-stone-700">{result.maxDepth + 1}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-stone-100 mt-2">
                  <span className="font-bold text-stone-700">Decomposition Score (V)</span>
                  <span className="font-bold text-blue-600">{result.V}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
              <ImageIcon className="w-12 h-12 text-stone-300 mb-4" />
              <p className="text-sm font-bold text-stone-400">Awaiting Image</p>
              <p className="text-xs text-stone-400 mt-2 max-w-[200px]">Upload an image and run the calculation to view the objective structural metrics.</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
