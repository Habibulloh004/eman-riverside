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
        {/* Row 1: Title + 2 landscape images */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3">
          <div className="flex flex-col justify-center py-4 lg:pr-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-4">
              {t.gallerySection.title}
            </h2>
            <p className="text-muted-foreground text-sm uppercase tracking-wider max-w-xs">
              {t.gallerySection.description}
            </p>
          </div>
          <div className="relative h-48 lg:h-56 overflow-hidden group cursor-pointer">
            <Image src={getImageUrl(0)} alt={getImageTitle(0)} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" unoptimized={getImageUrl(0).startsWith("http")} />
          </div>
          <div className="relative h-48 lg:h-56 overflow-hidden group cursor-pointer">
            <Image src={getImageUrl(1)} alt={getImageTitle(1)} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" unoptimized={getImageUrl(1).startsWith("http")} />
          </div>
        </div>

        {/* Row 2: 4 images, same height, different widths */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-3 mb-3">
          <div className="lg:col-span-2 relative h-48 lg:h-64 overflow-hidden group cursor-pointer">
            <Image src={getImageUrl(2)} alt={getImageTitle(2)} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 16vw" unoptimized={getImageUrl(2).startsWith("http")} />
          </div>
          <div className="lg:col-span-3 relative h-48 lg:h-64 overflow-hidden group cursor-pointer">
            <Image src={getImageUrl(3)} alt={getImageTitle(3)} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 25vw" unoptimized={getImageUrl(3).startsWith("http")} />
          </div>
          <div className="lg:col-span-4 relative h-48 lg:h-64 overflow-hidden group cursor-pointer">
            <Image src={getImageUrl(4)} alt={getImageTitle(4)} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" unoptimized={getImageUrl(4).startsWith("http")} />
          </div>
          <div className="lg:col-span-3 relative h-48 lg:h-64 overflow-hidden group cursor-pointer">
            <Image src={getImageUrl(5)} alt={getImageTitle(5)} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 25vw" unoptimized={getImageUrl(5).startsWith("http")} />
          </div>
        </div>

        {/* Row 3: 4 equal images in one line */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[6, 7, 8, 9].map((idx) => (
            <div key={idx} className="relative h-48 lg:h-64 overflow-hidden group cursor-pointer">
              <Image src={getImageUrl(idx)} alt={getImageTitle(idx)} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 25vw" unoptimized={getImageUrl(idx).startsWith("http")} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
