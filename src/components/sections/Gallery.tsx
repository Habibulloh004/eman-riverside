"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGalleryPublic } from "@/hooks/useGallery";

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
          <div className="gallery-grid">
            <div className="gallery-title">
              <div className="h-10 w-56 bg-muted animate-pulse rounded mb-3" />
              <div className="h-4 w-72 bg-muted animate-pulse rounded" />
            </div>
            {[
              "tile-a",
              "tile-b",
              "tile-c",
              "tile-d",
              "tile-e",
              "tile-f",
              "tile-g",
              "tile-h",
              "tile-i",
            ].map((tile) => (
              <div
                key={tile}
                className={`gallery-tile ${tile} bg-muted animate-pulse`}
              />
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
        <div className="gallery-grid">
          <div className="gallery-tile gallery-title">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-4">
              {t.gallerySection.title}
            </h2>
            <p className="text-muted-foreground text-sm uppercase tracking-wider max-w-xs">
              {t.gallerySection.description}
            </p>
          </div>

          <div className="gallery-tile tile-a">
            <Image src={getImageUrl(0)} alt={getImageTitle(0)} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 1024px) 100vw, 25vw" unoptimized={getImageUrl(0).startsWith("http")} />
          </div>
          <div className="gallery-tile tile-b">
            <Image src={getImageUrl(1)} alt={getImageTitle(1)} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 1024px) 50vw, 25vw" unoptimized={getImageUrl(1).startsWith("http")} />
          </div>
          <div className="gallery-tile tile-c">
            <Image src={getImageUrl(2)} alt={getImageTitle(2)} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 1024px) 50vw, 25vw" unoptimized={getImageUrl(2).startsWith("http")} />
          </div>
          <div className="gallery-tile tile-d">
            <Image src={getImageUrl(3)} alt={getImageTitle(3)} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 1024px) 50vw, 25vw" unoptimized={getImageUrl(3).startsWith("http")} />
          </div>
          <div className="gallery-tile tile-e">
            <Image src={getImageUrl(4)} alt={getImageTitle(4)} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 1024px) 50vw, 25vw" unoptimized={getImageUrl(4).startsWith("http")} />
          </div>
          <div className="gallery-tile tile-f">
            <Image src={getImageUrl(5)} alt={getImageTitle(5)} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 1024px) 50vw, 25vw" unoptimized={getImageUrl(5).startsWith("http")} />
          </div>
          <div className="gallery-tile tile-g">
            <Image src={getImageUrl(6)} alt={getImageTitle(6)} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 1024px) 50vw, 25vw" unoptimized={getImageUrl(6).startsWith("http")} />
          </div>
          <div className="gallery-tile tile-h">
            <Image src={getImageUrl(7)} alt={getImageTitle(7)} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 1024px) 50vw, 25vw" unoptimized={getImageUrl(7).startsWith("http")} />
          </div>
          <div className="gallery-tile tile-i">
            <Image src={getImageUrl(8)} alt={getImageTitle(8)} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 1024px) 50vw, 25vw" unoptimized={getImageUrl(8).startsWith("http")} />
          </div>
        </div>
      </div>

      <style jsx>{`
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .gallery-tile {
          position: relative;
          overflow: hidden;
          cursor: pointer;
          border-radius: 2px;
        }

        .gallery-tile :global(img) {
          transition: transform 0.5s ease;
        }

        .gallery-tile:hover :global(img) {
          transform: scale(1.05);
        }

        .gallery-title {
          background: rgba(249, 239, 231, 0.85);
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 180px;
        }

        .tile-a,
        .tile-b,
        .tile-c,
        .tile-d,
        .tile-e,
        .tile-f,
        .tile-g,
        .tile-h,
        .tile-i {
          min-height: 180px;
        }

        @media (min-width: 1024px) {
          .gallery-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            grid-template-rows: repeat(3, 220px);
            grid-template-areas:
              "title title a b"
              "c d a e"
              "f g h i";
            gap: 16px;
          }

          .gallery-title {
            grid-area: title;
            min-height: auto;
          }

          .tile-a {
            grid-area: a;
          }
          .tile-b {
            grid-area: b;
          }
          .tile-c {
            grid-area: c;
          }
          .tile-d {
            grid-area: d;
          }
          .tile-e {
            grid-area: e;
          }
          .tile-f {
            grid-area: f;
          }
          .tile-g {
            grid-area: g;
          }
          .tile-h {
            grid-area: h;
          }
          .tile-i {
            grid-area: i;
          }
        }
      `}</style>
    </section>
  );
}
