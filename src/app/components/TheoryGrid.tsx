import React from "react";
import { Card, CardContent, CardHeader, Badge, Button } from "@/app/components/ui";
import { ArrowRight, BookOpen, Clock, Download } from "lucide-react";

const articles = [
  {
    id: 1,
    title: "Fractal Scaling in Urban Environments: A Quantifiable Approach to Wellbeing",
    authors: "Dr. E. Salingaros, A. Mehaffy",
    journal: "Journal of Urban Design",
    date: "Oct 2023",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1671542002281-c7e24cb6efad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMG5hdHVyZSUyMHBhdHRlcm5zJTIwZnJhY3RhbHMlMjBtYWNybyUyMHRleHR1cmUlMjBuZXV0cmFsfGVufDF8fHx8MTc3MDA4NDAxNnww&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["Fractals", "Urban Health"],
    featured: true
  },
  {
    id: 2,
    title: "The Neurobiology of Beauty: Why Our Brains Seek Order and Complexity",
    authors: "S. Semir, K. Zeki",
    journal: "Architectural Science Review",
    date: "Sep 2023",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1533391120950-2d65c72e5969?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYXJjaGl0ZWN0dXJlJTIwY2FsbSUyMGhlYWxpbmclMjBzcGFjZSUyMHdoaXRlJTIwY29uY3JldGUlMjB3b29kfGVufDF8fHx8MTc3MDA4NDAxNnww&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["Neuroscience", "Aesthetics"],
    featured: false
  },
  {
    id: 3,
    title: "Restorative Commons: Creating Public Spaces for Mental Health",
    authors: "L. Campbell, A. Wiesen",
    journal: "Landscape Research",
    date: "Aug 2023",
    readTime: "15 min read",
    image: "https://images.unsplash.com/photo-1727522974631-c8779e7de5d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmFsJTIwc2tldGNoJTIwYmx1ZXByaW50JTIwdGVjaG5pY2FsJTIwZHJhd2luZyUyMG1pbmltYWx8ZW58MXx8fHwxNzcwMDg0MDE2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["Public Space", "Mental Health"],
    featured: false
  }
];

export function TheoryGrid() {
  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-stone-900">Latest Research</h2>
        <Button variant="ghost" className="text-stone-600">View all publications <ArrowRight className="ml-2 h-4 w-4" /></Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Card key={article.id} className="group flex flex-col overflow-hidden transition-all hover:shadow-md">
            <div className="relative h-48 overflow-hidden bg-stone-200">
               <img 
                 src={article.image} 
                 alt={article.title}
                 className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
               />
               <div className="absolute top-4 left-4 flex gap-2">
                 {article.tags.map(tag => (
                   <Badge key={tag} className="bg-white/90 backdrop-blur-sm">{tag}</Badge>
                 ))}
               </div>
            </div>
            <CardHeader className="flex-1 pb-2">
              <div className="mb-2 flex items-center gap-2 text-xs text-stone-500">
                <span className="font-semibold text-stone-700">{article.journal}</span>
                <span>•</span>
                <span>{article.date}</span>
              </div>
              <h3 className="line-clamp-2 text-lg font-bold leading-tight text-stone-900 group-hover:text-teal-700">
                {article.title}
              </h3>
              <p className="mt-2 text-sm text-stone-600">{article.authors}</p>
            </CardHeader>
            <CardContent className="mt-auto border-t border-stone-100 bg-stone-50 p-4">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {article.readTime}
                </div>
                <div className="flex gap-2">
                   <button className="hover:text-stone-900"><Download className="h-4 w-4" /></button>
                   <button className="hover:text-stone-900"><BookOpen className="h-4 w-4" /></button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
