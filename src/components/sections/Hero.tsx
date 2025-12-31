"use client";

import Image from "next/image";
import { Search } from "lucide-react";
import { useState } from "react";

export default function Hero() {
  const [selectedDom, setSelectedDom] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [selectedApartment, setSelectedApartment] = useState("");

  return (
    <section id="hero" className="relative min-h-screen lg:min-h-0 flex items-center justify-center pt-20 pb-4 lg:pt-32 lg:pb-16">
      {/* Left Side Social Links - Desktop only */}
      <div className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col items-center gap-4">
        <span className="text-xs text-muted-foreground tracking-widest rotate-180" style={{ writingMode: "vertical-rl" }}>
          Соц.сеть
        </span>
        <div className="w-px h-8 bg-border" />
        <div className="flex flex-col gap-3">
          <a href="https://instagram.com/emanriverside" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a href="https://twitter.com/emanriverside" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-3 lg:px-8 relative z-10">
        {/* Main Hero Card - Green box + Image side by side */}
        <div className="flex flex-col lg:flex-row rounded-xl overflow-hidden shadow-2xl w-full lg:w-11/12 max-w-[1400px] mx-auto">
          {/* Left - Green Box with text and search form */}
          <div className="bg-primary p-5 sm:p-6 lg:p-14 text-white lg:w-[42%] flex flex-col justify-between min-h-[320px] sm:min-h-[380px] lg:min-h-[500px]">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-serif font-light mb-1 sm:mb-3">
                Tez Kunda
              </h1>
              <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-serif font-light mb-4 sm:mb-8">
                Скоро
              </h2>
              <p className="text-white/80 text-sm sm:text-base lg:text-xl">
                Жилой комплекс нового<br />уровня
              </p>
            </div>

            {/* Search Form inside green box */}
            <div className="bg-white rounded-lg p-3 sm:p-4 lg:p-5 mt-4 lg:mt-0">
              <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mb-2 sm:mb-4">
                ВЫБРАТЬ КВАРТИРУ
              </p>
              <div className="grid grid-cols-4 gap-1.5 sm:gap-3 items-end">
                {/* Дом */}
                <div>
                  <label className="text-[10px] sm:text-xs font-medium text-foreground mb-1 block">Дом</label>
                  <div className="relative">
                    <select
                      value={selectedDom}
                      onChange={(e) => setSelectedDom(e.target.value)}
                      className="w-full h-7 sm:h-9 px-1 sm:px-2 pr-5 sm:pr-6 text-[10px] sm:text-xs border-b border-border bg-transparent appearance-none cursor-pointer focus:outline-none focus:border-primary text-muted-foreground"
                    >
                      <option value="">Вы</option>
                      <option value="1">Дом 1</option>
                      <option value="2">Дом 2</option>
                      <option value="3">Дом 3</option>
                    </select>
                    <div className="absolute right-0.5 sm:right-1 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                        <circle cx="12" cy="12" r="3" fill="currentColor" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Этаж */}
                <div>
                  <label className="text-[10px] sm:text-xs font-medium text-foreground mb-1 block">Этаж</label>
                  <div className="relative">
                    <select
                      value={selectedFloor}
                      onChange={(e) => setSelectedFloor(e.target.value)}
                      className="w-full h-7 sm:h-9 px-1 sm:px-2 pr-5 sm:pr-6 text-[10px] sm:text-xs border-b border-border bg-transparent appearance-none cursor-pointer focus:outline-none focus:border-primary text-muted-foreground"
                    >
                      <option value="">Вы</option>
                      {[...Array(15)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                    <div className="absolute right-0.5 sm:right-1 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Квартира */}
                <div>
                  <label className="text-[10px] sm:text-xs font-medium text-foreground mb-1 block">Квартира</label>
                  <div className="relative">
                    <select
                      value={selectedApartment}
                      onChange={(e) => setSelectedApartment(e.target.value)}
                      className="w-full h-7 sm:h-9 px-1 sm:px-2 pr-5 sm:pr-6 text-[10px] sm:text-xs border-b border-border bg-transparent appearance-none cursor-pointer focus:outline-none focus:border-primary text-muted-foreground"
                    >
                      <option value="">Вы</option>
                      <option value="1">1-к</option>
                      <option value="2">2-к</option>
                      <option value="3">3-к</option>
                    </select>
                    <div className="absolute right-0.5 sm:right-1 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Search Button */}
                <div>
                  <button className="w-full h-7 sm:h-9 bg-white border border-border rounded-lg flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                    <Search className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Hero Image */}
          <div className="relative lg:w-[58%] aspect-[4/3] lg:aspect-auto min-h-[180px] sm:min-h-[220px] lg:min-h-[500px]">
            <Image
              src="/images/hero/1.png"
              alt="EMAN RIVERSIDE"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 58vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
