"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Gallery() {
  const { t } = useLanguage();

  return (
    <section id="gallery" className="relative py-16 lg:py-24 overflow-hidden">
      {/* Background image with low opacity */}
      <div className="absolute inset-0 z-0 bg-[#F9EFE7]">
        <Image
          src="/images/hero/1.png"
          alt=""
          fill
          className="object-cover opacity-[0.04]"
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column - Title + 2x2 grid */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Title Section */}
            <div className="mb-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-4">
                {t.gallerySection.title}
              </h2>
              <p className="text-muted-foreground text-sm uppercase tracking-wider max-w-md">
                {t.gallerySection.description}
              </p>
            </div>

            {/* 2x2 Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-4/3 rounded-lg overflow-hidden group cursor-pointer">
                <Image
                  src="/images/hero/1.png"
                  alt={t.gallerySection.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
              </div>
              <div className="relative aspect-4/3 rounded-lg overflow-hidden group cursor-pointer">
                <Image
                  src="/images/hero/1.png"
                  alt={t.gallerySection.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
              </div>
              <div className="relative aspect-4/3 rounded-lg overflow-hidden group cursor-pointer">
                <Image
                  src="/images/hero/1.png"
                  alt={t.gallerySection.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
              </div>
              <div className="relative aspect-4/3 rounded-lg overflow-hidden group cursor-pointer">
                <Image
                  src="/images/hero/1.png"
                  alt={t.gallerySection.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
              </div>
            </div>
          </div>

          {/* Middle Column - 2 tall images */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="relative aspect-3/4 rounded-lg overflow-hidden group cursor-pointer">
              <Image
                src="/images/hero/1.png"
                alt={t.gallerySection.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>
            <div className="relative aspect-3/4 rounded-lg overflow-hidden group cursor-pointer">
              <Image
                src="/images/hero/1.png"
                alt={t.gallerySection.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>
          </div>

          {/* Right Column - Complex layout */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Top row - 2 images */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer">
                <Image
                  src="/images/hero/1.png"
                  alt={t.gallerySection.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 15vw"
                />
              </div>
              <div className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer">
                <Image
                  src="/images/hero/1.png"
                  alt={t.gallerySection.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 15vw"
                />
              </div>
            </div>

            {/* Middle - Large image */}
            <div className="relative aspect-4/3 rounded-lg overflow-hidden group cursor-pointer">
              <Image
                src="/images/hero/1.png"
                alt={t.gallerySection.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 30vw"
              />
            </div>

            {/* Bottom row - 2 images */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-3/4 rounded-lg overflow-hidden group cursor-pointer">
                <Image
                  src="/images/hero/1.png"
                  alt={t.gallerySection.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 15vw"
                />
              </div>
              <div className="relative aspect-3/4 rounded-lg overflow-hidden group cursor-pointer">
                <Image
                  src="/images/hero/1.png"
                  alt={t.gallerySection.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 15vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
