"use client";

import Image from "next/image";
import { useState } from "react";
import { Header, Footer } from "@/components/sections";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";

// Construction steps
const constructionSteps = [
  {
    title: "Первые шаги",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc odio in et, lectus sit lorem id integer.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc odio in et, lectus sit lorem id integer."
  },
  {
    title: "Фундамент",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc odio in et, lectus sit lorem id integer.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc odio in et, lectus sit lorem id integer."
  }
];

// Gallery images
const galleryImages = [
  "/images/hero/1.png",
  "/images/hero/1.png",
  "/images/hero/1.png",
  "/images/hero/1.png",
  "/images/hero/1.png",
  "/images/hero/1.png",
];

// Interior images
const interiorImages = [
  "/images/hero/1.png",
  "/images/hero/1.png",
  "/images/hero/1.png",
  "/images/hero/1.png",
];

// Exterior images
const exteriorImages = [
  "/images/hero/1.png",
  "/images/hero/1.png",
  "/images/hero/1.png",
];

export default function GalleryPage() {
  const [currentInteriorIndex, setCurrentInteriorIndex] = useState(0);
  const [currentExteriorIndex, setCurrentExteriorIndex] = useState(0);

  const nextInterior = () => {
    setCurrentInteriorIndex((prev) => (prev + 1) % interiorImages.length);
  };

  const prevInterior = () => {
    setCurrentInteriorIndex((prev) => (prev - 1 + interiorImages.length) % interiorImages.length);
  };

  const nextExterior = () => {
    setCurrentExteriorIndex((prev) => (prev + 1) % exteriorImages.length);
  };

  const prevExterior = () => {
    setCurrentExteriorIndex((prev) => (prev - 1 + exteriorImages.length) % exteriorImages.length);
  };

  return (
    <>
      <Header />
      <main>
        {/* Hero Section - Exactly matching design */}
        <section className="relative h-screen bg-[#F5ECE4] pt-20 overflow-hidden">
          {/* Left side - Vertical text */}
          <div className="absolute left-6 lg:left-12 top-1/2 -translate-y-1/2 z-10">
            <span
              className="text-[#1a1a1a] text-xl sm:text-2xl lg:text-3xl font-semibold tracking-[0.2em] whitespace-nowrap"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              EMAN RIVERSIDE
            </span>
          </div>

          {/* Logo - positioned to the right of vertical text */}
          <div className="absolute left-16 sm:left-24 lg:left-36 top-32 lg:top-40 z-10">
            <Image
              src="/logo.svg"
              alt="EMAN RIVERSIDE"
              width={100}
              height={50}
              className="h-8 lg:h-12 w-auto"
            />
          </div>

          {/* Main diagonal image - covers right side */}
          <div
            className="absolute top-0 right-0 w-[70%] lg:w-[65%] h-[85%] origin-top-right"
            style={{
              clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)"
            }}
          >
            <Image
              src="/images/hero/1.png"
              alt="EMAN RIVERSIDE Building"
              fill
              className="object-cover"
              priority
            />
          </div>
        </section>

        {/* Construction Progress Section */}
        <section className="relative py-16 lg:py-24 bg-[#F5ECE4] overflow-hidden">
          <div className="container mx-auto px-4 lg:px-8">
            {/* Section title - large */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif mb-12 lg:mb-16">
              Строительства<br />
              EMAN RIVERSIDE
            </h2>

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Left - Construction steps text (narrow column) */}
              <div className="lg:col-span-4 space-y-8 lg:space-y-12">
                {constructionSteps.map((step, idx) => (
                  <div key={idx}>
                    <h3 className="text-lg lg:text-xl font-medium mb-3 text-[#1a1a1a]">
                      {step.title}
                    </h3>
                    <p className="text-xs lg:text-sm text-gray-500 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Right - 3 tilted images with decorative curves */}
              <div className="lg:col-span-8 relative h-[500px] lg:h-[600px]">
                {/* Decorative curved lines */}
                <svg
                  className="absolute left-[10%] top-[30%] w-[30%] h-auto z-0 opacity-40"
                  viewBox="0 0 200 100"
                  fill="none"
                >
                  <path
                    d="M0,50 Q50,0 100,50 T200,50"
                    stroke="#1a1a1a"
                    strokeWidth="1"
                    fill="none"
                  />
                  <path
                    d="M0,60 Q50,10 100,60 T200,60"
                    stroke="#1a1a1a"
                    strokeWidth="1"
                    fill="none"
                  />
                </svg>

                {/* Image 1 - Top right, tilted */}
                <div
                  className="absolute top-0 right-0 w-[55%] lg:w-[50%] aspect-[4/3] z-20"
                  style={{ transform: "rotate(5deg)" }}
                >
                  <Image
                    src="/images/hero/1.png"
                    alt="Construction 1"
                    fill
                    className="object-cover rounded-sm shadow-xl"
                  />
                </div>

                {/* Image 2 - Center, with blue border, tilted opposite */}
                <div
                  className="absolute top-[35%] left-[15%] w-[55%] lg:w-[50%] aspect-[4/3] z-30"
                  style={{ transform: "rotate(-5deg)" }}
                >
                  <div className="relative w-full h-full border-4 border-primary rounded-sm shadow-xl overflow-hidden">
                    <Image
                      src="/images/hero/1.png"
                      alt="Construction 2"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Image 3 - Bottom right, tilted */}
                <div
                  className="absolute bottom-0 right-[5%] w-[55%] lg:w-[50%] aspect-[4/3] z-10"
                  style={{ transform: "rotate(3deg)" }}
                >
                  <Image
                    src="/images/hero/1.png"
                    alt="Construction 3"
                    fill
                    className="object-cover rounded-sm shadow-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Grid Section - Green background */}
        <section className="relative py-16 lg:py-24 bg-primary overflow-hidden">
          <div className="container mx-auto px-4 lg:px-8">
            {/* Section header */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
              <div>
                <span className="text-sm text-white/70 uppercase tracking-wider mb-4 block">
                  ФОТОГАЛЕРЕЯ
                </span>
                <h2 className="text-3xl lg:text-4xl xl:text-5xl font-serif text-white">
                  Галерея
                </h2>
              </div>
              <p className="text-white/70 max-w-md text-sm lg:text-base">
                Исследуйте наш жилой комплекс через фотографии интерьеров,
                экстерьеров и общественных пространств
              </p>
            </div>

            {/* Gallery grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  className={`relative overflow-hidden rounded-lg cursor-pointer group ${
                    idx === 0 ? "col-span-2 row-span-2" : ""
                  }`}
                >
                  <div className={`relative ${idx === 0 ? "aspect-square" : "aspect-4/3"}`}>
                    <Image
                      src={img}
                      alt={`Gallery ${idx + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interior Section */}
        <section className="relative py-16 lg:py-24 bg-[#F5ECE4] overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-20 left-10 w-40 h-40 border-2 border-primary/20 rounded-full" />
          <div className="absolute bottom-20 right-10 w-60 h-60 border-2 border-primary/20 rounded-full" />
          <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-primary/10 rounded-full" />

          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            {/* Section header */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
              <div>
                <span className="text-sm text-primary uppercase tracking-wider mb-4 block">
                  ДИЗАЙН ИНТЕРЬЕРА
                </span>
                <h2 className="text-3xl lg:text-4xl xl:text-5xl font-serif">
                  Интерьер
                </h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={prevInterior}
                  className="w-12 h-12 rounded-full border border-gray-400 flex items-center justify-center hover:bg-white hover:border-primary transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextInterior}
                  className="w-12 h-12 rounded-full border border-gray-400 flex items-center justify-center hover:bg-white hover:border-primary transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Interior carousel */}
            <div className="relative overflow-hidden">
              <div
                className="flex gap-6 transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentInteriorIndex * (100 / 3)}%)` }}
              >
                {interiorImages.concat(interiorImages).map((img, idx) => (
                  <div
                    key={idx}
                    className="shrink-0 w-full md:w-1/2 lg:w-1/3"
                  >
                    <div className="relative aspect-4/3 rounded-lg overflow-hidden">
                      <Image
                        src={img}
                        alt={`Interior ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Exterior Section */}
        <section className="relative py-16 lg:py-24 bg-white overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-10 right-20 w-32 h-32 border border-primary/30 rounded-full" />
          <div className="absolute bottom-10 left-20 w-24 h-24 bg-primary/5 rounded-full" />

          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left - Content */}
              <div>
                <span className="text-sm text-primary uppercase tracking-wider mb-4 block">
                  АРХИТЕКТУРА
                </span>
                <h2 className="text-3xl lg:text-4xl xl:text-5xl font-serif mb-6">
                  Экстерьер
                </h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Современная архитектура с элегантными линиями и качественными
                  материалами. Каждая деталь продумана для создания гармоничного
                  облика комплекса.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={prevExterior}
                    className="w-12 h-12 rounded-full border border-gray-400 flex items-center justify-center hover:bg-primary/5 hover:border-primary transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextExterior}
                    className="w-12 h-12 rounded-full border border-gray-400 flex items-center justify-center hover:bg-primary/5 hover:border-primary transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Right - Circular images */}
              <div className="relative">
                <div className="grid grid-cols-2 gap-6">
                  {/* Main large circle */}
                  <div className="col-span-2 flex justify-center">
                    <div className="relative w-64 h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden">
                      <Image
                        src={exteriorImages[currentExteriorIndex]}
                        alt="Exterior main"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  {/* Smaller circles */}
                  <div className="flex justify-end">
                    <div className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden">
                      <Image
                        src={exteriorImages[(currentExteriorIndex + 1) % exteriorImages.length]}
                        alt="Exterior 2"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden">
                      <Image
                        src={exteriorImages[(currentExteriorIndex + 2) % exteriorImages.length]}
                        alt="Exterior 3"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
                {/* Decorative ring */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border border-primary/20 rounded-full -z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* Video Section - Green background */}
        <section className="relative py-16 lg:py-24 bg-primary overflow-hidden">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left - Content */}
              <div>
                <span className="text-sm text-white/70 uppercase tracking-wider mb-4 block">
                  ВИДЕОТУР
                </span>
                <h2 className="text-3xl lg:text-4xl xl:text-5xl font-serif text-white mb-6">
                  Видео
                </h2>
                <p className="text-white/70 leading-relaxed">
                  Совершите виртуальный тур по нашему жилому комплексу.
                  Посмотрите видео, чтобы оценить качество отделки и
                  планировочные решения.
                </p>
              </div>

              {/* Right - Video placeholder */}
              <div className="relative aspect-video rounded-lg overflow-hidden bg-black/20 group cursor-pointer">
                <Image
                  src="/images/hero/1.png"
                  alt="Video thumbnail"
                  fill
                  className="object-cover opacity-80"
                />
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-8 h-8 lg:w-10 lg:h-10 text-primary ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
