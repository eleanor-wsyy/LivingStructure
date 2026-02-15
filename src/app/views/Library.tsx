import React, { useState } from "react";
import { Button, Input, Badge, Card } from "@/app/components/ui";
import { Search, Book, FileText, Bookmark, Download, Video, Filter } from "lucide-react";
import { useLanguage } from "@/app/i18n/LanguageContext";

const resources = [
  { id: 1, type: "paper", title: "The Nature of Order, Book 1: The Phenomenon of Life", author: "C. Alexander", year: 2002, citations: 4520 },
  { id: 2, type: "paper", title: "Fractal Geometry in Architecture and Design", author: "C. Bovill", year: 1996, citations: 890 },
  { id: 3, type: "video", title: "Lecture: Wholeness and the Implicate Order", author: "D. Bohm", year: 1980, duration: "1h 12m" },
  { id: 4, type: "paper", title: "Biophilic Design: The Theory, Science and Practice", author: "S. Kellert", year: 2008, citations: 1205 },
  { id: 5, type: "book", title: "A Pattern Language", author: "C. Alexander et al.", year: 1977, citations: 15400 },
];

export function Library() {
  const { trans } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-stone-200 bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold text-stone-900">{trans.library.title}</h1>
          <p className="mt-2 text-stone-600">{trans.library.subtitle}</p>
          
          <div className="mt-8 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
              <Input className="pl-10 h-11 bg-white" placeholder={trans.library.searchPlaceholder} />
            </div>
            <Button className="h-11 px-6 bg-stone-900">{trans.library.searchButton}</Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar Filters */}
          <div className="space-y-8 lg:col-span-1">
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-stone-900 mb-4">
                <Filter className="h-4 w-4" /> {trans.library.filters}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="papers" className="rounded border-stone-300" defaultChecked />
                  <label htmlFor="papers" className="text-sm text-stone-600">{trans.library.papers}</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="books" className="rounded border-stone-300" defaultChecked />
                  <label htmlFor="books" className="text-sm text-stone-600">{trans.library.books}</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="video" className="rounded border-stone-300" />
                  <label htmlFor="video" className="text-sm text-stone-600">{trans.library.lectures}</label>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-stone-900 mb-4">{trans.library.year}</h3>
              <div className="flex items-center gap-2">
                <Input placeholder="1970" className="h-8 text-xs" />
                <span className="text-stone-400">-</span>
                <Input placeholder="2026" className="h-8 text-xs" />
              </div>
            </div>
          </div>

          {/* Results List */}
          <div className="lg:col-span-3 space-y-4">
            {resources.map((item) => (
              <Card key={item.id} className="flex flex-col sm:flex-row gap-6 p-6 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-transparent hover:border-l-teal-600">
                <div className="shrink-0">
                  <div className="flex h-24 w-20 items-center justify-center rounded bg-stone-100 text-stone-400">
                    {item.type === "video" ? <Video className="h-8 w-8" /> : <FileText className="h-8 w-8" />}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-stone-900">{item.title}</h3>
                      <div className="mt-1 flex items-center gap-2 text-sm text-stone-600">
                        <span className="font-medium">{item.author}</span>
                        <span>•</span>
                        <span>{item.year}</span>
                        {item.type === "video" && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Video className="h-3 w-3" /> {item.duration}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Bookmark className="h-4 w-4 text-stone-400" /></Button>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-4 text-xs text-stone-500">
                    <Badge variant="secondary" className="bg-stone-100 hover:bg-stone-200 capitalize">{item.type}</Badge>
                    <span>{trans.library.citations}: {item.citations ? item.citations.toLocaleString() : "N/A"}</span>
                    <a href="#" className="hover:text-teal-700 hover:underline">{trans.library.download}</a>
                    <a href="#" className="hover:text-teal-700 hover:underline">{trans.library.cite}</a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
