"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGalleryPublic } from "@/hooks/useGallery";
import { GallerySkeleton } from "@/components/ui/skeleton";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const DEFAULT_IMAGE = "/images/hero/1.png";

export default function Gallery() {
  const { t, language } = useLanguage();
  const { data, isLoading } = useGalleryPublic({ type: "image" });

  const images = (data?.items || []).map((item) => ({
    url: item.url.startsWith("http") ? item.url : `${API_URL}${item.url}`,
    title: language === "uz" ? (item.title_uz || item.title) : item.title,
  }));

  const getImageUrl = (index: number) => images[index]?.url || DEFAULT_IMAGE;
  const getImageTitle = (index: number) => images[index]?.title || t.gallerySection.title;

  if (isLoading) {
    return (
      <section id="gallery" className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[#F9EFE7]" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="mb-4">
            <div className="h-12 w-64 bg-muted animate-pulse rounded mb-4" />
            <div className="h-4 w-96 bg-muted animate-pulse rounded" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <GallerySkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

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
              {[0, 1, 2, 3].map((idx) => (
                <div key={idx} className="relative aspect-4/3 rounded-lg overflow-hidden group cursor-pointer">
                  <Image
                    src={getImageUrl(idx)}
                    alt={getImageTitle(idx)}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 20vw"
                    unoptimized={getImageUrl(idx).startsWith("http")}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Middle Column - 2 tall images */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {[4, 5].map((idx) => (
              <div key={idx} className="relative aspect-3/4 rounded-lg overflow-hidden group cursor-pointer">
                <Image
                  src={getImageUrl(idx)}
                  alt={getImageTitle(idx)}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 25vw"
                  unoptimized={getImageUrl(idx).startsWith("http")}
                />
              </div>
            ))}
          </div>

          {/* Right Column - Complex layout */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Top row - 2 images */}
            <div className="grid grid-cols-2 gap-4">
              {[6, 7].map((idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer">
                  <Image
                    src={getImageUrl(idx)}
                    alt={getImageTitle(idx)}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 15vw"
                    unoptimized={getImageUrl(idx).startsWith("http")}
                  />
                </div>
              ))}
            </div>

            {/* Middle - Large image */}
            <div className="relative aspect-4/3 rounded-lg overflow-hidden group cursor-pointer">
              <Image
                src={getImageUrl(8)}
                alt={getImageTitle(8)}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 30vw"
                unoptimized={getImageUrl(8).startsWith("http")}
              />
            </div>

            {/* Bottom row - 2 images */}
            <div className="grid grid-cols-2 gap-4">
              {[9, 10].map((idx) => (
                <div key={idx} className="relative aspect-3/4 rounded-lg overflow-hidden group cursor-pointer">
                  <Image
                    src={getImageUrl(idx)}
                    alt={getImageTitle(idx)}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 15vw"
                    unoptimized={getImageUrl(idx).startsWith("http")}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
